import { defineConfig } from 'astro/config';

const configuredSite = process.env.PUBLIC_SITE_URL;
let site;

if (configuredSite) {
  try {
    const url = new URL(configuredSite);
    if (url.protocol === 'https:') site = url.toString().replace(/\/$/, '');
  } catch {
    site = undefined;
  }
}

export default defineConfig({
  vite: { cacheDir: '.astro/vite' },
  ...(site ? { site } : {}),
  base: '/colegio-bilingue-minas-demo',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
