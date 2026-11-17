// Tokens: our own HS256 JWTs for API access; Apple identity tokens verified against Apple's keys.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';

const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url');

export function signToken(sub: string, secret: string, ttlSec = 180 * 86400, now = Date.now()): string {
  const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64(JSON.stringify({ sub, iat: Math.floor(now / 1000), exp: Math.floor(now / 1000) + ttlSec }));
  const sig = b64(createHmac('sha256', secret).update(`${header}.${payload}`).digest());
  return `${header}.${payload}.${sig}`;
}

export function verifyToken(token: string, secret: string, now = Date.now()): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const expected = createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest();
  const got = Buffer.from(parts[2], 'base64url');
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) return null;
  try {
    const p = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (typeof p.sub !== 'string' || typeof p.exp !== 'number' || p.exp * 1000 < now) return null;
    return p.sub;
  } catch {
    return null;
  }
}

let appleKeys: JWTVerifyGetKey | null = null;

/** Verify a Sign in with Apple identity token; returns Apple's stable user id (sub). */
export async function verifyAppleToken(idToken: string, audiences: string[], keys?: JWTVerifyGetKey): Promise<string> {
  const getKey = keys ?? (appleKeys ??= createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys')));
  const { payload } = await jwtVerify(idToken, getKey, { issuer: 'https://appleid.apple.com', audience: audiences });
  if (!payload.sub) throw new Error('Apple token has no subject');
  return payload.sub;
}
