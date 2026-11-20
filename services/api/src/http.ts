// fetch with timeout, retries on 429/5xx, and an identifying User-Agent (MET Norway and Nominatim require one).

export class UpstreamError extends Error {
  readonly host: string;
  readonly status: number;
  constructor(host: string, status: number, message?: string) {
    super(message ?? `${host} answered ${status}`);
    this.host = host;
    this.status = status;
  }
}

export interface HttpOptions {
  userAgent: string;
  fetch?: typeof fetch;
}

export interface RequestOpts extends RequestInit {
  timeoutMs?: number;
  retries?: number;
}

export function makeHttp({ userAgent, fetch: f = fetch }: HttpOptions) {
  async function json<T = any>(url: string, opts: RequestOpts = {}): Promise<T> {
    const { timeoutMs = 20000, retries = 1, ...init } = opts;
    const host = new URL(url).host;
    let lastErr: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const r = await f(url, { ...init, signal: ctrl.signal, headers: { 'User-Agent': userAgent, Accept: 'application/json', ...(init.headers as Record<string, string>) } });
        if (r.ok) return (await r.json()) as T;
        const body = await r.text().catch(() => '');
        lastErr = new UpstreamError(host, r.status, `${host} answered ${r.status}: ${body.slice(0, 200)}`);
        if (r.status !== 429 && r.status < 500) throw lastErr;
      } catch (e) {
        lastErr = e;
        if (e instanceof UpstreamError && e.status !== 429 && e.status < 500) throw e;
      } finally {
        clearTimeout(t);
      }
      if (attempt < retries) await new Promise((res) => setTimeout(res, 300 * 2 ** attempt));
    }
    throw lastErr;
  }
  return { json };
}

export type Http = ReturnType<typeof makeHttp>;
