// Small TTL + LRU cache with in-flight de-duplication. Swap for Redis when we run more than one API instance.

export class TtlCache<V = unknown> {
  private map = new Map<string, { v: V; exp: number }>();
  private inflight = new Map<string, Promise<V>>();
  hits = 0;
  misses = 0;
  readonly max: number;
  constructor(max = 5000) {
    this.max = max;
  }

  get(key: string): V | undefined {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (e.exp < Date.now()) { this.map.delete(key); return undefined; }
    this.map.delete(key);
    this.map.set(key, e); // LRU bump
    return e.v;
  }

  set(key: string, v: V, ttlMs: number) {
    this.map.set(key, { v, exp: Date.now() + ttlMs });
    while (this.map.size > this.max) this.map.delete(this.map.keys().next().value!);
  }

  async wrap(key: string, ttlMs: number, fn: () => Promise<V>): Promise<V> {
    const hit = this.get(key);
    if (hit !== undefined) { this.hits++; return hit; }
    const running = this.inflight.get(key);
    if (running) return running;
    this.misses++;
    const p = fn().then((v) => { this.set(key, v, ttlMs); return v; }).finally(() => this.inflight.delete(key));
    this.inflight.set(key, p);
    return p;
  }

  get size() {
    return this.map.size;
  }
}
