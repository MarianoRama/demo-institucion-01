import { isAuthenticated } from '../_session.js';
import { findGalleryCategory, MANIFEST_PATH, IMAGES_DIR } from '../_slots.js';
import { bufferToBase64, putFile, getJsonFile, putJsonFile } from '../_github.js';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function onRequestPost({ request, env }) {
  if (!(await isAuthenticated(request, env.SESSION_SECRET))) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }
  if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
    return new Response(JSON.stringify({ error: 'El panel no esta configurado (faltan variables de GitHub)' }), { status: 500 });
  }

  const form = await request.formData();
  const categoryId = form.get('category');
  const file = form.get('file');

  const category = findGalleryCategory(categoryId);
  if (!category) return new Response(JSON.stringify({ error: 'Sección no reconocida' }), { status: 400 });
  if (!(file instanceof File)) return new Response(JSON.stringify({ error: 'Falta el archivo' }), { status: 400 });
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return new Response(JSON.stringify({ error: 'Formato no permitido. Usá JPG, PNG o WEBP.' }), { status: 400 });
  if (file.size > MAX_BYTES) return new Response(JSON.stringify({ error: 'La foto pesa demasiado (máximo 8 MB).' }), { status: 400 });

  const filename = `${category.id}-${Date.now()}.${ext}`;

  try {
    const contentBase64 = bufferToBase64(await file.arrayBuffer());
    await putFile(env, `${IMAGES_DIR}/${filename}`, contentBase64, `Agrega foto a ${category.label}`, undefined);

    const { data, sha } = await getJsonFile(env, MANIFEST_PATH);
    const manifest = data || {};
    manifest[category.id] = [...(manifest[category.id] || []), filename];
    await putJsonFile(env, MANIFEST_PATH, manifest, `Agrega ${filename} a ${category.label}`, sha);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'GitHub rechazó la subida', detail: String(err) }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true, filename }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
