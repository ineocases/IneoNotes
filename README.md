# InkNest

InkNest es una aplicación web de notas digitales manuscritas **offline-first**, construida desde cero con React + TypeScript + Vite + Tailwind CSS, con un editor basado en Konva y persistencia local mediante Dexie/IndexedDB. Puede funcionar en modo demo sin Firebase y queda preparada para activar autenticación y sincronización al configurar Firebase.

## Funciones

- Login, registro, Google Login y recuperación de contraseña cuando Firebase está configurado.
- Modo demo sin credenciales.
- Biblioteca de cuadernos con favoritos, búsqueda, duplicación y papelera.
- Editor de página con pluma, lápiz, resaltador, borrador por trazo, texto y formas.
- Mouse, touch y stylus mediante Pointer Events.
- Zoom, deshacer/rehacer, guardado local y estado online/offline.
- Plantillas: blanco, líneas, cuadrícula, puntos, Cornell, tareas, diario, semanal y milimetrado.
- Exportación básica de la página actual a PDF.
- Dexie + IndexedDB y cola de sincronización.
- Firebase Authentication, Firestore y Storage preparados.
- Responsive para escritorio, tablet y móvil.
- Tema claro/oscuro.
- GitHub Pages mediante workflow incluido.

## Requisitos

- Node.js 20+ (22 recomendado).
- npm.

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

En Windows, copiá `.env.example` como `.env`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run test
npm run typecheck
```

## Modo demo

Si las variables `VITE_FIREBASE_*` no existen o contienen `CAMBIAR_AQUI`, InkNest no inicializa Firebase. El login/registro se comporta como una demostración y la biblioteca/editor usan IndexedDB local.

Esto permite probar la interfaz y el editor sin crear un proyecto Firebase.

## Configuración de Firebase

1. Crear un proyecto en Firebase.
2. Agregar una aplicación Web.
3. Copiar sus valores al `.env`:

```text
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. Activar **Authentication → Sign-in method → Email/Password**.
5. Activar **Google** y configurar el dominio autorizado.
6. Crear Firestore Database.
7. Crear Storage.
8. Aplicar `firebase/firestore.rules`, `firebase/firestore.indexes.json` y `firebase/storage.rules`.

No se incluyen claves reales, service accounts ni secretos.

## Estructura Firestore

La aplicación está preparada para:

```text
users/{userId}
users/{userId}/notebooks/{notebookId}
users/{userId}/notebooks/{notebookId}/pages/{pageId}
users/{userId}/notebooks/{notebookId}/pages/{pageId}/elements/{elementId}
```

Las reglas restringen cada rama al usuario autenticado correspondiente.

## Offline-first

Los cuadernos y páginas se guardan primero en IndexedDB. Los cambios generan una cola local de sincronización. Cuando vuelve la conexión, `flushSyncQueue()` puede enviar los cambios a Firestore. La interfaz no necesita bloquearse esperando una escritura remota.

La resolución avanzada de conflictos por documento puede ampliarse posteriormente; la base de datos local usa `updatedAt` y la cola evita repetir el mismo `kind:entityId`.

## PDF

La exportación actual crea un PDF de la página con textos, trazos y rectángulos. La importación/edición completa de PDF multipágina requiere integrar el pipeline de renderizado de PDF.js y composición de capas; el proyecto deja los servicios y dependencias preparados, pero esta entrega documenta esa limitación para evitar una implementación falsa o rota.

## GitHub Pages

El proyecto usa una configuración de Vite compatible con despliegues estáticos y un workflow en `.github/workflows/deploy.yml`.

En el repositorio de GitHub, agregá estos **Repository secrets**:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

El workflow ejecuta:

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. publicación de `dist` en GitHub Pages.

No hace falta modificar código para colocar las claves: se inyectan durante el build.

## Firebase local

Opcionalmente se puede usar Firebase Emulator Suite. Para activar la conexión en desarrollo:

```text
VITE_USE_FIREBASE_EMULATORS=true
```

y ejecutar los emuladores correspondientes.

## Accesibilidad

Se utilizan botones con `aria-label`, foco visible, contraste, controles nativos y navegación compatible con teclado. El editor está preparado para Pointer Events y touch.

## Limitaciones conocidas

- Importación PDF completa y anotación sobre páginas PDF todavía es una integración avanzada pendiente; la exportación básica de páginas nativas sí funciona.
- Edición directa de texto en canvas (doble clic) está representada por el modelo y preparada para una capa HTML de edición; el editor básico permite insertar el elemento de texto.
- Algunas operaciones avanzadas como pegado del portapapeles enriquecido, OCR y borrador por píxel requieren APIs adicionales y no se simulan.
- El workflow publica en GitHub Pages, pero no conecta ningún repositorio desde este proyecto.

## Roadmap

- PDF.js multipágina con miniaturas.
- Anotación PDF con capas persistentes.
- Transformaciones completas de imágenes y elementos.
- Doble clic con editor HTML para texto.
- Sincronización por lotes con resolución de conflictos.
- Búsqueda de texto dentro de páginas.
- Exportación de cuadernos completos.
- PWA instalable con Service Worker.

## Licencia

MIT.
## Firebase de InkNest ya preparado

El paquete entregado incluye un `.env` local con la configuración Web de Firebase proporcionada para el proyecto `ineonotees`. Esa configuración no contiene una clave privada: la API key Web de Firebase es un identificador público del cliente y la seguridad real debe mantenerse mediante Authentication, Firestore Rules y Storage Rules.

Si vas a publicar el proyecto en un repositorio público, podés borrar el `.env` local y cargar los mismos valores como Secrets/Variables de GitHub Actions (`VITE_FIREBASE_*`). El archivo `.gitignore` mantiene `.env` fuera de commits accidentales.

### Error de `main.tsx 404`

InkNest usa `base: "./"` y el `index.html` referencia `./src/main.tsx` de forma relativa. Esto evita el 404 que aparece cuando el `index.html` se sirve desde un subdirectorio o mediante servidores estáticos sencillos. Para desarrollo se recomienda `npm run dev` en la raíz del proyecto, no abrir `index.html` con `file://`.

### Si Firebase está configurado pero no podés entrar

En Firebase Console verificá Authentication → Sign-in method y activá Email/Password y Google. Después verificá Firestore y Storage y publicá las reglas incluidas en `firebase/firestore.rules` y `firebase/storage.rules`.

## GitHub Pages: corrección del error `application/octet-stream`

Si el navegador muestra `GET .../src/main.tsx 404` o `Expected a JavaScript-or-Wasm module script`, GitHub Pages está publicando el código fuente directamente en lugar del resultado de Vite. **No es un problema de Firebase.**

En GitHub entra a **Settings → Pages → Build and deployment → Source → GitHub Actions**. No selecciones `Deploy from a branch` ni publiques la raíz del repositorio.

El workflow incluido construye la aplicación y publica exclusivamente `dist/`. La URL esperada para este repositorio es `https://ineocases.github.io/IneoNotes/`.

El favicon usa una ruta relativa simple (`favicon.svg`), por lo que no queda el literal `%BASE_URL%` cuando el HTML se abre fuera de Vite.
