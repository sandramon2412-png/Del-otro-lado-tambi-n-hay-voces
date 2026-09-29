# Del otro lado también hay voces

Libro digital interactivo de relatos, memoria y conflicto armado, pensado como una experiencia de lectura editorial con navegación, voz en off, autoavance y elementos visuales.

## Descripción

Este proyecto simula la experiencia de un libro físico digital, con:

- lectura en modo página doble, página individual y continuo
- autoavance de páginas
- lectura en voz alta por texto narrado
- selección de perfiles de voz
- marcadores, notas y subrayados
- imágenes y fondos editoriales para cada sección
- diseño en tema papel/sepia/oscuro

## Stack

- React + TypeScript + Vite
- Express (servidor local)
- Gemini TTS para generación de audio
- CSS/Tailwind para la interfaz visual

## Requisitos

- Node.js 18 o superior
- npm
- una clave API de Gemini en la variable `GEMINI_API_KEY`

## Instalación

1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

4. Completa los valores:

```env
GEMINI_API_KEY="TU_CLAVE"
APP_URL="http://localhost:3000"
```

## Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Build de producción:

```bash
npm run build
```

Iniciar producción:

```bash
npm run start
```

## Estructura principal

```text
.
├─ index.html
├─ server.ts
├─ package.json
├─ vite.config.ts
├─ .env.example
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ index.css
│  ├─ assets/
│  ├─ components/
│  ├─ data/
│  └─ utils/
└─ README.md
```

## ¿Se pueden cambiar las voces?

Sí. De hecho, el proyecto ya lo permite.

### Opción 1: cambiar la voz desde la interfaz

En la app hay un selector de voz que permite elegir entre perfiles como:

- Elena
- Carlos
- Daniela
- Crónica Andina

Estos perfiles se definen en:

```ts
src/utils/speechUtils.ts
```

### Opción 2: cambiar la voz en el código

En `VOICE_PROFILES` puedes modificar los valores de:

- `geminiVoice`
- `stylePrompt`
- `pitch`
- `rate`

Ejemplo:

```ts
{
  id: 'narrador-suave',
  name: 'Narrador suave',
  geminiVoice: 'Aoede',
  stylePrompt: 'Lee con voz humana, cálida, muy natural, expresiva y masculina en español latinoamericano',
  pitch: 1.0,
  rate: 0.9,
  icon: '🎧',
}
```

Las voces disponibles del modelo Gemini en este proyecto son principalmente:

- `Kore`
- `Fenrir`
- `Aoede`
- `Puck`
- `Charon`

### Opción 3: mejorar la naturalidad

Si la voz te suena muy robótica, puedes hacer lo siguiente:

- probar otra `geminiVoice`
- mejorar el `stylePrompt` con texto más específico
- acortar frases o texto por párrafo
- usar el fallback de navegador con voces nativas del sistema
- elegir una voz más natural del sistema operativo en el selector de voces 

## Nota importante

El audio se genera a través del endpoint `/api/tts` en `server.ts` usando Gemini. Si el servicio falla o llega a cuota límite, el proyecto hace fallback a la síntesis del navegador.

## Convenciones de desarrollo

```bash
npm run lint
npm run build
```

## Licencia

Este proyecto no especifica licencia todavía.

## Autor

Proyecto académico y editorial desarrollado para la experiencia de lectura digital de "Del otro lado también hay voces".
