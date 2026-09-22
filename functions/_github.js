function headers(env) {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'panel-fotos-colegio',
  };
}

function apiUrl(env, path) {
  return `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
}

export function bufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// Lee un archivo del repo. Devuelve { sha, contentBase64 } o null si no existe.
export async function getFile(env, path) {
  const branch = env.GITHUB_BRANCH || 'main';
  const res = await fetch(`${apiUrl(env, path)}?ref=${branch}`, { headers: headers(env) });
  if (res.status === 404) return null;
  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`GitHub GET ${path} -> ${res.status}: ${bodyText}`);
  }
  const data = await res.json();
  return { sha: data.sha, contentBase64: data.content?.replace(/\n/g, '') };
}

export async function getJsonFile(env, path) {
  const file = await getFile(env, path);
  if (!file) return { data: null, sha: null };
  const text = atob(file.contentBase64);
  return { data: JSON.parse(text), sha: file.sha };
}

// Crea o reemplaza un archivo. contentBase64 ya debe venir codificado.
export async function putFile(env, path, contentBase64, message, sha) {
  const branch = env.GITHUB_BRANCH || 'main';
  const res = await fetch(apiUrl(env, path), {
    method: 'PUT',
    headers: { ...headers(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: contentBase64, branch, sha: sha || undefined }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub PUT ${path} -> ${res.status}: ${detail}`);
  }
  return res.json();
}

export async function putJsonFile(env, path, data, message, sha) {
  const text = JSON.stringify(data, null, 2) + '\n';
  const contentBase64 = btoa(unescape(encodeURIComponent(text)));
  return putFile(env, path, contentBase64, message, sha);
}
