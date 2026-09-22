import { isAuthenticated } from '../_session.js';
import { findGalleryCategory, MANIFEST_PATH } from '../_slots.js';
import { getJsonFile, putJsonFile } from '../_github.js';

export async function onRequestPost({ request, env }) {
  if (!(await isAuthenticated(request, env.SESSION_SECRET))) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }
  if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
    return new Response(JSON.stringify({ error: 'El panel no esta configurado (faltan variables de GitHub)' }), { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Solicitud invalida' }), { status: 400 });
  }

  const category = findGalleryCategory(body?.category);
  const filename = (body?.filename || '').toString();
  if (!category || !filename) {
    return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });
  }

  try {
    const { data, sha } = await getJsonFile(env, MANIFEST_PATH);
    const manifest = data || {};
    const list = manifest[category.id] || [];
    if (!list.includes(filename)) {
      return new Response(JSON.stringify({ error: 'Esa foto ya no está en la lista' }), { status: 404 });
    }
    manifest[category.id] = list.filter((f) => f !== filename);
    await putJsonFile(env, MANIFEST_PATH, manifest, `Saca ${filename} de ${category.label}`, sha);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'GitHub rechazó el cambio', detail: String(err) }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
