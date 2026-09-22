export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const ui = {
  es: {
    nav: {
      inicio: 'Inicio',
      nosotros: 'Nosotros',
      propuesta: 'Propuesta educativa',
      propuestaCorta: 'Propuesta',
      actividades: 'Actividades',
      galeria: 'Galería',
      admisiones: 'Admisiones',
      contacto: 'Contacto',
      cta: 'Solicitar información',
    },
    footer: {
      tagline: 'Educación bilingüe de doble horario, laica, de Maternal a Primaria.',
      contacto: 'Contacto',
      seguinos: 'Seguinos',
      rights: 'Todos los derechos reservados.',
    },
  },
  en: {
    nav: {
      inicio: 'Home',
      nosotros: 'About us',
      propuesta: 'Our program',
      propuestaCorta: 'Program',
      actividades: 'Activities',
      galeria: 'Gallery',
      admisiones: 'Admissions',
      contacto: 'Contact',
      cta: 'Request information',
    },
    footer: {
      tagline: 'Secular, full-day bilingual education, from Nursery to Primary school.',
      contacto: 'Contact',
      seguinos: 'Follow us',
      rights: 'All rights reserved.',
    },
  },
} as const;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export function stripBase(pathname: string) {
  if (base && pathname.startsWith(base)) return pathname.slice(base.length) || '/';
  return pathname;
}

export function pathFor(locale: Locale, path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const localized = locale === defaultLocale ? clean : `/en${clean}`;
  return withBase(localized);
}

