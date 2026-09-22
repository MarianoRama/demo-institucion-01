import { isAuthenticated } from '../_session.js';
import { SINGLE_SLOTS, GALLERY_CATEGORIES, MANIFEST_PATH } from '../_slots.js';
import { getJsonFile } from '../_github.js';

function imageUrl(env, filename) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';
  // cache-buster corto para no depender del cache del CDN despues de subir/sacar fotos
  const v = Date.now();
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/public/images/${filename}?v=${v}`;
}

export async function onRequestGet({ request, env }) {
  if (!(await isAuthenticated(request, env.SESSION_SECRET))) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }

  const single = SINGLE_SLOTS.map((slot) => ({
    id: slot.id,
    label: slot.label,
    previewUrl: imageUrl(env, slot.path.replace('public/images/', '')),
  }));

  let manifest = {};
  try {
    const { data } = await getJsonFile(env, MANIFEST_PATH);
    manifest = data || {};
  } catch (err) {
    return new Response(JSON.stringify({ error: 'No se pudo leer la lista de fotos', detail: String(err) }), { status: 502 });
  }

  const galleries = GALLERY_CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label,
    photos: (manifest[cat.id] || []).map((filename) => ({
      filename,
      url: imageUrl(env, filename),
    })),
  }));

  return new Response(JSON.stringify({ single, galleries }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
