// Helpers para firmar/verificar la cookie de sesion del panel de edicion.
// No usa ninguna libreria externa: solo Web Crypto (disponible en Cloudflare Pages Functions).

const SESSION_COOKIE = 'panel_session';
const SESSION_HOURS = 8;

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toHex(signature);
}

export async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return toHex(digest);
}

export async function createSessionCookie(secret) {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `ok.${expires}`;
  const signature = await hmac(secret, payload);
  const value = `${payload}.${signature}`;
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

export async function isAuthenticated(request, secret) {
  const value = readCookie(request, SESSION_COOKIE);
  if (!value) return false;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  const [ok, expires, signature] = parts;
  if (ok !== 'ok') return false;
  if (Date.now() > Number(expires)) return false;
  const expected = await hmac(secret, `${ok}.${expires}`);
  return expected === signature;
}
