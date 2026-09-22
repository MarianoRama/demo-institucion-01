# Colegio Bilingüe de Minas — rediseño

Versión de trabajo en español e inglés. El proyecto original del Escritorio se conserva sin modificar.

## Ejecutar

Requiere Node.js compatible con Astro 4 y npm.

```sh
npm install
npm run dev
```

Para compilar y revisar la versión estática:

```sh
npm run build
npm run preview
```

Esta entrega fue revisada en http://127.0.0.1:4322/. El puerto 4321 corresponde a la instancia anterior del usuario.

## Diseño y cambios

- Identidad bordó y marfil, tipografía editorial, navegación más clara y diseño adaptable.
- Inicio con fotografías reales, niveles enlazados y recorrido hacia consultas.
- Las 14 páginas comparten componentes para mantener coherencia entre español e inglés.
- Admisiones con preguntas desplegables y enlaces WhatsApp, teléfono y correo. No hay formulario ni envío automático.
- Contacto con mapa y acceso a indicaciones.
- Galería con cuatro fotos reales y acceso a la imagen completa, conservando proporciones.
- Carruseles con controles traducidos, pausa, teclado y respeto por movimiento reducido.
- Enlace para saltar al contenido, foco visible y navegación móvil con cierre por Escape.
- Metadatos sociales y enlaces de idiomas; URLs canónicas solo al configurar un dominio real.

## Correcciones de contenido

Scratch provenía del sitio anterior y no se verificó: no aparece en la nueva versión. Streaming/radio fue una experiencia puntual según el usuario; se reemplazó por teatro anual para los distintos grupos, en ambos idiomas.

Se retiraron las afirmaciones no comprobadas sobre exclusividad, certificaciones, horas exactas y admisiones abiertas. Las descripciones de robótica, arte y salidas se basan en el proyecto recibido y aún deben revisarse con el colegio.

## Archivos a editar

- `src/components/Home.astro`: inicio ES/EN.
- `src/components/SchoolPage.astro`: nosotros, propuesta, actividades y galería ES/EN.
- `src/components/Admissions.astro` y `Contact.astro`: admisiones y contacto ES/EN.
- `Header.astro`, `Footer.astro`, `Visit.astro`, `Carousel.astro`: piezas compartidas.
- `src/styles/global.css`: colores, tipografía y reglas generales.
- `src/i18n/ui.ts`: textos compartidos de navegación y pie.
- `src/pages/`: entradas estáticas en español y `/en/`, con i18n nativo de Astro.

## Antes de publicar

1. Reemplazar las 8 fotos de muestra todavía visibles: 3 niveles, 2 robótica y 3 arte. Están rotuladas. Las 3 imágenes `sample-general-*` heredadas ya no se muestran.
2. Confirmar autorización para publicar las fotos de alumnos.
3. Revisar todos los textos con la dirección, incluidas actividades, modalidad y datos de contacto.
4. Confirmar que el celular de admisiones recibe WhatsApp.
5. Agregar fotos reales de las obras de teatro si están disponibles. El bloque actual utiliza una composición gráfica, sin simular una foto del colegio.
6. Conectar el dominio elegido y configurar `PUBLIC_SITE_URL` con su URL HTTPS durante la compilación. Sin esta variable no se inventan URLs canónicas.

No se publicó ni se compró un dominio. No se configuró una cuenta externa. Se conserva Astro estático, sin backend, base de datos ni frameworks de UI.

## Validación de esta entrega

- Compilación correcta de las 14 páginas.
- 518 referencias internas a páginas, imágenes, estilos, scripts y anclas verificadas sin faltantes.
- Las 14 páginas revisadas a 320 px sin desbordamiento horizontal y con un único h1.
- Inspección visual de inicio en escritorio y celular, menú y cierre con Escape, carrusel inglés y FAQ desplegable.
- Los destinos externos (teléfono, WhatsApp, correo y redes) no se contactaron ni se enviaron mensajes.
