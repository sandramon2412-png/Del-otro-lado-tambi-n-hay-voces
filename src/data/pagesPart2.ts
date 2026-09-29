import { BookPage } from './bookMeta';
import { BOOK_IMAGES } from './bookImages';

export const PAGES_PART_1: BookPage[] = [
  {
    pageNumber: 1,
    type: 'cover',
    chapterId: 'portada',
    chapterTitle: 'Portada',
    title: 'Del otro lado también hay voces',
    subtitle: 'Relatos de vida, memoria y conflicto armado',
    authors: ['Daniela Alejandra González Soto', 'Carlos Eduardo Vallejo Montezuma'],
    image: BOOK_IMAGES.cover,
    paragraphs: [
      'Programa de Trabajo Social',
      'Universidad Mariana — San Juan de Pasto'
    ]
  },
  {
    pageNumber: 2,
    type: 'epigraph',
    chapterId: 'portada',
    chapterTitle: 'Epígrafe',
    image: BOOK_IMAGES.epigraph,
    paragraphs: [
      '“Hay que recuperar, mantener y transmitir la memoria histórica, porque se empieza por el olvido y se termina en la indiferencia.”',
      '— José Saramago'
    ]
  },
  {
    pageNumber: 3,
    type: 'toc',
    chapterId: 'portada',
    chapterTitle: 'Índice General',
    title: 'Índice',
    paragraphs: [
      'Nota preliminar — pág. 4',
      'Antes de escuchar estas voces — pág. 7',
      'El cuerpo no lo olvida — pág. 11',
      'Hasta ahora yo lo extraño — pág. 19',
      'Entre la espera y el regreso — pág. 29',
      'Lo que permanece — pág. 62'
    ]
  },
  {
    pageNumber: 4,
    type: 'intro',
    chapterId: 'nota-preliminar',
    chapterTitle: 'Nota preliminar',
    title: 'Nota preliminar',
    paragraphs: [
      'La presente antología surge del proceso de investigación Rupturas y reconstrucción: estrategias de reparación simbólica en el tejido social de militares víctimas del conflicto armado.',
      'Los relatos permiten acercarse a las experiencias de los participantes más allá de los hechos victimizantes. Recogen las transformaciones en sus vidas, sus relaciones familiares y sociales.',
      'La construcción de las historias siguió diferentes caminos, respetando las posibilidades y formas de expresión de cada participante.',
      'Este proceso se orientó también por principios de la escritura autobiográfica reflexiva propuesta por Louise DeSalvo, retomando especialmente la posibilidad de relacionar los acontecimientos con el sentido de la vida.',
      'La intervención realizada sobre los relatos procuró ser cuidadosa y respetuosa de las voces de sus protagonistas, por lo que los ajustes se concentraron en favorecer la organización, claridad y lectura del texto.'
    ]
  },
  {
    pageNumber: 5,
    type: 'intro',
    chapterId: 'nota-preliminar',
    chapterTitle: 'Nota preliminar',
    paragraphs: [
      'Por quienes participaron. Del mismo modo, se respetaron los silencios, las dudas y los límites establecidos alrededor de aquello que cada persona decidió compartir, en coherencia con los acuerdos de elaboración.',
      'Los relatos reunidos no pretenden representar todas las experiencias de los militares víctimas del conflicto armado colombiano y sus familias. Cada historia conserva su particularidad y su riqueza específica.'
    ]
  },
  {
    pageNumber: 6,
    type: 'intro',
    chapterId: 'introduccion',
    chapterTitle: 'Introducción',
    title: 'Introducción',
    subtitle: 'Antes de escuchar estas voces',
    image: BOOK_IMAGES.intro,
    paragraphs: [
      '«Antes de escuchar estas voces» abre una ventana hacia el territorio, la memoria y el reconocimiento íntimo de las personas detrás de los uniformes y sus familias.'
    ]
  },
  {
    pageNumber: 7,
    type: 'intro',
    chapterId: 'introduccion',
    chapterTitle: 'Antes de escuchar estas voces',
    title: 'Antes de escuchar estas voces',
    paragraphs: [
      'Durante mucho tiempo, mi relación con el conflicto armado colombiano estuvo mediada por una pantalla. Como ocurre con muchas personas en este país, aprendí a reconocer la guerra a través de las noticias, los reportes y las imágenes que se repetían.',
      'En esas noticias también aparecían los militares. Los veía en imágenes de operativos, enfrentamientos o ataques, pero pocas veces me detenía a pensar en lo que ocurría con ellos después de esas imágenes.',
      'Estudiar Trabajo Social comenzó a transformar esa percepción. La universidad me enseñó a detenerme ante aquello que parecía evidente, a preguntarme de dónde provenían ciertas ideas y quiénes quedaban ocultos detrás de los discursos.',
      'Cuando llegó el momento de desarrollar el trabajo de grado, apareció la posibilidad de investigar las experiencias de militares víctimas del conflicto armado. Nunca había imaginado trabajar con ese tipo de relatos.',
      'Frente a mí había personas contando qué había sucedido antes, durante y después. Había recuerdos de la vida en el campo, familias acostumbradas a las ausencias, esposas esperando llamadas, hombres volviendo a casa con más heridas de las que podrían contener.'
    ]
  },
  {
    pageNumber: 8,
    type: 'intro',
    chapterId: 'introduccion',
    chapterTitle: 'Antes de escuchar estas voces',
    paragraphs: [
      'Escuchar produjo un impacto personal. En algunos momentos fue difícil conciliar aquellas historias con la representación que había construido de quienes integraban la Fuerza Pública. Como si la guerra se hubiese organizado en un relato único y sin matices.',
      'Lo que estas voces hicieron fue romper ese esquema. No se trataba solo de víctimas ni de culpables, sino de personas con memoria, dolor, responsabilidad y humanidad.',
      'A veces la verdad más difícil no es la del conflicto, sino la del encuentro: reconocer que, allí también, hubo dolor, miedo y supervivencia.'
    ]
  }
];
