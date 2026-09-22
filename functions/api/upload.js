import { isAuthenticated } from '../_session.js';
import { findSingleSlot } from '../_slots.js';
import { bufferToBase64, getFile, putFile } from '../_github.js';

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function onRequestPost({ request, env }) {
  if (!(await isAuthenticated(request, env.SESSION_SECRET))) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }
  if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
    return new Response(JSON.stringify({ error: 'El panel no esta configurado (faltan variables de GitHub)' }), { status: 500 });
  }

  const form = await request.formData();
  const slotId = form.get('slotId');
  const file = form.get('file');

  const slot = findSingleSlot(slotId);
  if (!slot) return new Response(JSON.stringify({ error: 'Foto no reconocida' }), { status: 400 });
  if (!(file instanceof File)) return new Response(JSON.stringify({ error: 'Falta el archivo' }), { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) return new Response(JSON.stringify({ error: 'Formato no permitido. Usá JPG, PNG o WEBP.' }), { status: 400 });
  if (file.size > MAX_BYTES) return new Response(JSON.stringify({ error: 'La foto pesa demasiado (máximo 8 MB).' }), { status: 400 });

  try {
    const current = await getFile(env, slot.path);
    const contentBase64 = bufferToBase64(await file.arrayBuffer());
    await putFile(env, slot.path, contentBase64, `Actualiza foto: ${slot.label}`, current?.sha);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'GitHub rechazó la subida', detail: String(err) }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
