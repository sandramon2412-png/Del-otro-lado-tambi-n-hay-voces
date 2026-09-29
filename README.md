# Del otro lado también hay voces

Libro digital interactivo de relatos, memoria y conflicto armado. Experiencia editorial completa con navegación fluida, síntesis de voz natural, autoavance automático e interactividad del lector.

## Descripción

Proyecto académico que convierte un libro de testimonios en una experiencia digital inmersiva:

- **Lectura multimodal**: página doble, página única, modo continuo
- **Narración en voz alta**: síntesis de voz con perfiles personalizados (Elena, Carlos, Daniela, Crónica Andina)
- **Autoavance**: pasa páginas automáticamente mientras escuchas
- **Interactividad**: marcadores, notas personales, subrayados, búsqueda
- **Diseño editorial**: temas visuales (papel, sepia, oscuro, blanco), imágenes por sección
- **Accesibilidad**: lectura desde párrafos específicos, control de velocidad de reproducción

## Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **Síntesis de voz**: Gemini TTS (API)
- **Backend**: Express.js
- **Estilos**: Tailwind CSS + Motion.js
- **UI**: Lucide React (iconos)

## Requisitos

- Node.js 18+
- npm
- Clave API de Gemini (obtén una en [aistudio.google.com](https://aistudio.google.com))

## Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/sandramon2412-png/Del-otro-lado-tambi-n-hay-voces.git
cd Del-otro-lado-tambi-n-hay-voces
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y añade tu clave de API:

```env
GEMINI_API_KEY="tu_clave_aqui"
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## Ejecutar el proyecto

### Desarrollo (con live reload)

```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

### Build de producción

```bash
npm run build
```

### Iniciar en producción

```bash
npm run start
```

### Verificar lint

```bash
npm run lint
```

## Estructura del Proyecto

```
.
├── index.html              # Entrada HTML
├── server.ts               # Servidor Express (Vite + TTS API)
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── src/
│   ├── App.tsx            # Componente raíz (orquestación)
│   ├── main.tsx           # Punto de entrada React
│   ├── index.css          # Estilos globales
│   ├── assets/            # Imágenes y medios
│   │   └── images/        # Portadas e ilustraciones del libro
│   ├── components/        # Componentes React
│   │   ├── BookNavbar.tsx
│   │   ├── TwoPageView.tsx
│   │   ├── SinglePageView.tsx
│   │   ├── ContinuousView.tsx
│   │   ├── PageRenderer.tsx       # Motor de renderizado de páginas
│   │   ├── AudioNarrationBar.tsx  # Controles de reproducción
│   │   ├── VoiceSelectorModal.tsx # Selector de perfiles de voz
│   │   ├── AutoFlipWidget.tsx     # Contador de autoavance
│   │   ├── PageScrubber.tsx       # Barra de progreso
│   │   ├── TableOfContentsDrawer.tsx
│   │   ├── SearchModal.tsx
│   │   ├── ReaderSettingsModal.tsx
│   │   └── PageInteractionsPanel.tsx # Notas y subrayados
│   ├── data/              # Datos del libro
│   │   ├── bookData.ts    # Loader y búsqueda
│   │   ├── bookMeta.ts    # Metadatos
│   │   ├── pagesPart1.ts  # Páginas 1-20
│   │   ├── pagesPart2.ts  # Páginas 21-40
│   │   ├── pagesPart3.ts  # Páginas 41-60
│   │   ├── pagesPart4.ts  # Páginas 61-64
│   │   └── userInteractions.ts # Tipos (notas, subrayados)
│   └── utils/             # Utilidades
│       ├── speechUtils.ts # Motor de síntesis de voz con fallback
│       └── audioUtils.ts  # Control de audio ambiente
└── dist/                  # Build de producción (generado)
```

## ¿Cómo personalizar las voces?

Las voces están definidas en `src/utils/speechUtils.ts` en el array `VOICE_PROFILES`.

### Opción 1: Cambiar desde la interfaz

En la app, ve a **Ajustes de voz** y selecciona entre los perfiles disponibles.

### Opción 2: Modificar perfiles en el código

Edita `src/utils/speechUtils.ts`:

```typescript
{
  id: 'elena-female',
  name: 'Elena',
  role: 'Voz Femenina Serena',
  description: 'Tono cálido, empático y maternal.',
  gender: 'female',
  geminiVoice: 'Kore',  // Cambia la voz base
  stylePrompt: 'Lee con voz humana femenina, cálida... en español latinoamericano',
  pitch: 1.05,   // Ajusta el tono (0.5 - 2.0)
  rate: 0.90,    // Ajusta la velocidad (0.5 - 2.0)
  icon: '👩',
}
```

### Voces disponibles (Gemini)

- `Kore` - Femenina clara
- `Fenrir` - Masculina profunda
- `Aoede` - Femenina joven
- `Puck` - Masculina narrativa
- `Charon` - Masculina grave

### Mejorar naturalidad

Si la voz suena robótica:

1. **Mejora el `stylePrompt`** - Sé muy específico sobre el tono y ritmo que quieres
2. **Prueba otra `geminiVoice`** - Cada voz tiene características diferentes
3. **Ajusta pitch y rate** - Baja la velocidad, cambia el tono
4. **Acorta el texto** - Párrafos cortos suenan más naturales
5. **Usa voces del navegador** - El fallback usa las voces nativas del SO

Ejemplo de prompt mejorado:

```typescript
stylePrompt: 'Lee como una mujer que comparte una historia importante. Voz cálida, pausada, natural. Respiraciones sutiles. Énfasis en palabras clave sin dramatismo. Tono reflexivo. Pronuncia en español colombiano claro. Parece un podcast, no una máquina.'
```

## Gestión de caché y API

El servidor implementa:

- **Caché de audio**: Almacena audios generados hasta 24 horas
- **Límite de caché**: Máx. 100 entradas para evitar saturación
- **Reintentos**: Si Gemini falla, intenta 2 veces antes del fallback
- **Fallback**: Si la API no responde, usa Web Speech API del navegador
- **Timeout**: 30 segundos por solicitud de TTS

## Troubleshooting

### "No audio generated"
- Verifica que tu `GEMINI_API_KEY` sea válida
- Comprueba que tienes cuota disponible en tu API de Gemini

### Voces muy robóticas
- Mejora el `stylePrompt` con instrucciones más detalladas
- Prueba otra `geminiVoice`
- Reduce la velocidad (baja `rate`)

### Error 429 (Quota exceeded)
- Esperá unos minutos antes de intentar de nuevo
- El app automáticamente cae al fallback de navegador
- Considera aumentar el TTL de caché

### Servidor no inicia
- Verifica que Puerto 3000 esté disponible
- Comprueba `.env` - ¿está `GEMINI_API_KEY` configurada?
- Revisa la consola para mensajes de error

### No compila (TypeScript errors)
```bash
npm run lint
```

Si hay errores, revisa los archivos indicados y corrige tipos.

## Deploy a producción

### Opción 1: Vercel / Netlify

1. Haz push a GitHub
2. Conecta tu repo en Vercel/Netlify
3. Añade `GEMINI_API_KEY` en Variables de Entorno
4. Deploy automático

### Opción 2: Servidor propio

```bash
npm run build
npm run start
```

Asegúrate de:
- Exponer puerto 3000 (o el que configures)
- Configurar `NODE_ENV=production`
- Pasar `GEMINI_API_KEY` como variable de entorno

### Variables de entorno requeridas (producción)

```env
GEMINI_API_KEY=tu_clave
NODE_ENV=production
```

## Notas

- El audio se genera en servidor usando Gemini TTS
- Cada párrafo único se cachea para evitar regeneración
- Si la API falla, el navegador usa su síntesis de voz nativa
- Los marcadores y notas se guardan en `localStorage`
- La página actual también se persiste automáticamente

## Licencia

Proyecto académico. Sin licencia especificada.

## Autores

Daniela Alejandra González Soto · Carlos Eduardo Vallejo Montezuma  
Programa de Trabajo Social · Universidad Mariana

---

**¿Preguntas o sugerencias?** Abre un issue en GitHub o contacta a los autores.
