// Photos of a place, so the app can show why it's beautiful instead of saying it.
// Wikimedia Commons: geotagged, openly licensed (CC BY / CC BY-SA / PD), free with attribution and a
// descriptive User-Agent. We keep only landscape-style JPEGs and drop maps, coats of arms, interiors and plaques.

import type { Http } from '../http.ts';
import { TtlCache } from '../cache.ts';

export interface Photo {
  /** ~800 px wide thumbnail, served by Wikimedia's CDN. */
  url: string;
  width: number;
  height: number;
  title: string;
  author: string;
  license: string;
  /** The file page, for the credit link. */
  source: string;
}

export interface PhotoSource {
  near(lat: number, lon: number, opts?: { radiusM?: number; limit?: number; name?: string }): Promise<Photo[]>;
}

/** Titles that are rarely a view of the place. */
const NOT_A_VIEW = /\b(map|mappa|karte|plan|pianta|planimetria|stemma|stemmi|coat[ _]of[ _]arms|wappen|logo|diagram|schema|interior|interno|interni|cortile|courtyard|chiostro|cloister|altar|altare|organ|organo|tomb|tomba|lapide|plaque|targa|epigrafe|sign|cartello|insegna|ticket|menu|document|manuscript|coin|moneta|portrait|ritratto|stamp|francobollo|bus|train|treno|car|auto|ambulanza|ambulance|monumento|monument|memorial|caduti|statua|statue|busto|bust|fresco|affresco|dipinto|painting|mele|apple|frutto|fruit|fiore|fiori|flower|insetto|insect|farfalla|butterfly|uccello|bird|cane|dog|gatto|cat|museo|museum|detail|dettaglio|particolare|stazione|station|railway|ferrovia|binari|bahnhof|gare)\b/i;

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

interface CommonsPage {
  title: string;
  index?: number;
  imageinfo?: {
    thumburl?: string; thumbwidth?: number; thumbheight?: number; width: number; height: number; mime: string; descriptionurl: string;
    extmetadata?: Record<string, { value: string } | undefined>;
  }[];
}

/** Commons API response → photos, best first. Exported for tests. */
export function parseCommons(json: { query?: { pages?: Record<string, CommonsPage> } }, name?: string): Photo[] {
  const pages = Object.values(json.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const out: (Photo & { rank: number })[] = [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii || ii.mime !== 'image/jpeg' || !ii.thumburl) continue;
    const title = p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '');
    if (NOT_A_VIEW.test(title.replace(/_/g, ' '))) continue;
    if (ii.width < 800 || ii.width < ii.height * 1.15) continue; // landscape, reasonably large
    const md = ii.extmetadata ?? {};
    const license = stripHtml(md.LicenseShortName?.value ?? '');
    if (!/^(cc|public domain|pd)/i.test(license)) continue;
    const author = stripHtml(md.Artist?.value ?? '').slice(0, 80) || 'Unknown';
    // Prefer photos named after the place, then wider ones (views over details).
    const named = name && title.toLowerCase().includes(name.toLowerCase().split(/[ ,]/)[0]) ? 1 : 0;
    out.push({
      url: ii.thumburl, width: ii.thumbwidth ?? 800, height: ii.thumbheight ?? Math.round((800 * ii.height) / ii.width),
      title, author, license, source: ii.descriptionurl, rank: named * 2 + Math.min(1, ii.width / ii.height - 1),
    });
  }
  // Near-identical shots (same subject, numbered series) only once.
  const seen = new Set<string>();
  const subject = (t: string) => t.toLowerCase().replace(/[^a-zà-ù ]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 3).join(' ');
  return out.sort((a, b) => b.rank - a.rank).filter((p) => { const k = subject(p.title); if (seen.has(k)) return false; seen.add(k); return true; }).map(({ rank, ...p }) => p);
}

export class CommonsPhotos implements PhotoSource {
  readonly attribution = 'Photos: Wikimedia Commons contributors';
  private cache = new TtlCache<Photo[]>(20_000);
  private http: Http;
  private base: string;
  constructor(http: Http, base = 'https://commons.wikimedia.org/w/api.php') {
    this.http = http;
    this.base = base;
  }
  async near(lat: number, lon: number, { radiusM = 1000, limit = 6, name }: { radiusM?: number; limit?: number; name?: string } = {}): Promise<Photo[]> {
    const key = `${lat.toFixed(3)},${lon.toFixed(3)},${radiusM},${name ?? ''}`;
    const all = await this.cache.wrap(key, 30 * 86400_000, async () => {
      const u = new URL(this.base);
      const q: Record<string, string> = {
        action: 'query', format: 'json', formatversion: '1', generator: 'geosearch',
        ggscoord: `${lat}|${lon}`, ggsradius: String(Math.min(10000, radiusM)), ggsnamespace: '6', ggslimit: '40',
        prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '800', iiextmetadatafilter: 'Artist|LicenseShortName',
      };
      for (const [k, v] of Object.entries(q)) u.searchParams.set(k, v);
      return parseCommons(await this.http.json(u.toString(), { timeoutMs: 10000 }), name);
    });
    return all.slice(0, limit);
  }
}
