// Espacios de foto UNICA: subir una foto nueva reemplaza siempre el mismo archivo.
export const SINGLE_SLOTS = [
  { id: 'hero', label: 'Foto principal (Inicio)', path: 'public/images/sample-general-1.jpg' },
  { id: 'maternal', label: 'Nivel Maternal', path: 'public/images/sample-maternal.jpg' },
  { id: 'inicial', label: 'Nivel Inicial', path: 'public/images/sample-inicial.jpg' },
  { id: 'primaria', label: 'Nivel Primaria', path: 'public/images/sample-primaria.jpg' },
];

// Secciones de GALERIA: lista de fotos que se puede agregar o sacar libremente.
export const GALLERY_CATEGORIES = [
  { id: 'robotica', label: 'Robótica' },
  { id: 'arte', label: 'Arte y creatividad' },
  { id: 'salidas', label: 'Salidas y campamentos' },
  { id: 'galeria', label: 'Galería general' },
];

export const MANIFEST_PATH = 'src/data/photos.json';
export const IMAGES_DIR = 'public/images';

export function findSingleSlot(id) {
  return SINGLE_SLOTS.find((s) => s.id === id) || null;
}

export function findGalleryCategory(id) {
  return GALLERY_CATEGORIES.find((c) => c.id === id) || null;
}
