export interface BookPage {
  pageNumber: number;
  type: 'cover' | 'epigraph' | 'toc' | 'intro' | 'story-cover' | 'story' | 'closing-cover' | 'closing' | 'acknowledgments' | 'back-cover';
  chapterId: string;
  chapterTitle: string;
  storyNumber?: number;
  storyQuote?: string;
  authorNote?: string;
  image?: string;
  title?: string;
  subtitle?: string;
  authors?: string[];
  paragraphs: string[];
}

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  startPage: number;
  endPage: number;
  badge?: string;
  summary: string;
}

export const BOOK_METADATA = {
  title: "Del otro lado también hay voces",
  subtitle: "Relatos de vida, memoria y conflicto armado",
  authors: [
    { name: "Daniela Alejandra González Soto", role: "Investigadora / Autora" },
    { name: "Carlos Eduardo Vallejo Montezuma", role: "Investigador / Autor" }
  ],
  institution: "Universidad Mariana",
  program: "Programa de Trabajo Social",
  location: "San Juan de Pasto, Nariño, Colombia",
  year: "2026",
  totalPages: 64,
  epigraph: {
    quote: "Hay que recuperar, mantener y transmitir la memoria histórica, porque se empieza por el olvido y se termina en la indiferencia.",
    author: "José Saramago"
  }
};

export const CHAPTERS: Chapter[] = [
  {
    id: "portada",
    title: "Portada y Presentación",
    startPage: 1,
    endPage: 3,
    summary: "Portada original, epígrafe de José Saramago e índice general de la obra."
  },
  {
    id: "nota-preliminar",
    title: "Nota preliminar",
    startPage: 4,
    endPage: 5,
    summary: "Contexto de investigación 'Rupturas y reconstrucción', metodología de Louise DeSalvo y principios éticos."
  },
  {
    id: "introduccion",
    title: "Antes de escuchar estas voces",
    subtitle: "Introducción",
    startPage: 6,
    endPage: 9,
    summary: "Reflexión inicial de Carlos Eduardo Vallejo sobre acercarse al conflicto más allá de las cifras y los bandos."
  },
  {
    id: "relato-1",
    title: "El cuerpo no lo olvida",
    subtitle: "Relato 1",
    startPage: 10,
    endPage: 17,
    summary: "Testimonio de un soldado voluntario de Nariño: el servicio militar, el combate en Putumayo, la herida en combate y las huellas físicas y psicológicas que persisten."
  },
  {
    id: "relato-2",
    title: "Hasta ahora yo lo extraño",
    subtitle: "Relato 2",
    startPage: 18,
    endPage: 27,
    summary: "Historia de Elena: la pérdida de su esposo militar, las amenazas, el desplazamiento forzado con su hijo de dos años y la reconstrucción a través del Trabajo Social."
  },
  {
    id: "relato-3",
    title: "Entre la espera y el regreso",
    subtitle: "Relato 3",
    startPage: 28,
    endPage: 60,
    summary: "Crónica íntima de Claudia y su esposo Julián: el secuestro de 41 días en Cumbitara, la movilización comunitaria, el viaje a buscarlo en zona de conflicto y las secuelas."
  },
  {
    id: "cierre",
    title: "Lo que permanece",
    subtitle: "Cierre y Agradecimientos",
    startPage: 61,
    endPage: 64,
    summary: "Epílogo reflexivo de Daniela Alejandra González Soto sobre el cuidado de la memoria y gratitud a las familias participantes."
  }
];
