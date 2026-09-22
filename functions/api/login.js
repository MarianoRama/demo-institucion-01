import { sha256Hex, createSessionCookie } from '../_session.js';

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Solicitud invalida' }), { status: 400 });
  }

  const password = (body?.password || '').toString();
  if (!password) {
    return new Response(JSON.stringify({ error: 'Falta la contraseña' }), { status: 400 });
  }

  if (!env.ADMIN_PASSWORD_HASH || !env.SESSION_SECRET) {
    return new Response(JSON.stringify({ error: 'El panel no esta configurado (faltan variables de entorno)' }), { status: 500 });
  }

  const hash = await sha256Hex(password);
  if (hash !== env.ADMIN_PASSWORD_HASH) {
    return new Response(JSON.stringify({ error: 'Contraseña incorrecta' }), { status: 401 });
  }

  const cookie = await createSessionCookie(env.SESSION_SECRET);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie },
  });
}
