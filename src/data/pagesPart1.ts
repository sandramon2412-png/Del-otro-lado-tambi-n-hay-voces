import { BookPage } from './bookMeta';

export const PAGES_PART_1: BookPage[] = [
  {
    pageNumber: 1,
    type: 'cover',
    chapterId: 'portada',
    chapterTitle: 'Portada',
    title: 'Del otro lado también hay voces',
    subtitle: 'Relatos de vida, memoria y conflicto armado',
    authors: ['Daniela Alejandra González Soto', 'Carlos Eduardo Vallejo Montezuma'],
    image: '/src/assets/images/del_otro_lado_cover_1790636505858.jpg',
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
    image: '/src/assets/images/epigraph_saramago_1790637485245.jpg',
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
      'La presente antología surge del proceso de investigación Rupturas y reconstrucción: estrategias de reparación simbólica en el tejido social de militares víctimas del conflicto armado en Colombia, desarrollado desde el Programa de Trabajo Social de la Universidad Mariana. Como parte de sus objetivos, la investigación propuso la construcción de una antología que recopilara las narrativas de militares víctimas del conflicto armado y de familiares afectados por estos hechos, concibiéndola como una estrategia de reparación simbólica y reconstrucción del tejido social.',
      'Los relatos permiten acercarse a las experiencias de los participantes más allá de los hechos victimizantes. Recogen las transformaciones en sus vidas, sus relaciones familiares y sociales, sus proyectos y las formas en que hoy comprenden lo vivido. La antología reúne esas historias desde las voces de quienes decidieron compartirlas.',
      'La construcción de las historias siguió diferentes caminos, respetando las posibilidades y formas de expresión de cada participante. Algunos relatos surgieron de la escritura de sus propios protagonistas y posteriormente fueron acompañados mediante un proceso de edición narrativa; otros fueron construidos a partir de las entrevistas realizadas durante la investigación, mediante un ejercicio de mediación narrativa y editorial que permitió organizar la palabra oral y darle continuidad en forma de relato; en otros casos, la escritura inicial del participante se complementó con una entrevista posterior, integrando ambas fuentes sin desplazar su autoría ni alterar el sentido de lo expresado.',
      'Este proceso se orientó también por principios de la escritura autobiográfica reflexiva propuesta por Louise DeSalvo, retomando especialmente la posibilidad de relacionar los acontecimientos vividos con las emociones, consecuencias y significados que adquieren desde el presente. Su incorporación no implica comprender estos relatos como una intervención terapéutica ni asumir que narrar conduce necesariamente a sanar o superar lo ocurrido; por el contrario, se buscó respetar las distintas maneras en que cada participante comprende su experiencia, incluyendo aquello que ha logrado resignificar y aquello que todavía permanece abierto, duele o continúa teniendo efectos en su vida.',
      'La intervención realizada sobre los relatos procuró ser cuidadosa y respetuosa de las voces de sus protagonistas, por lo que los ajustes se concentraron en favorecer la organización, continuidad y legibilidad de las historias, sin incorporar acontecimientos, sentimientos o interpretaciones que no hubieran sido expresados'
    ]
  },
  {
    pageNumber: 5,
    type: 'intro',
    chapterId: 'nota-preliminar',
    chapterTitle: 'Nota preliminar',
    paragraphs: [
      'por quienes participaron. Del mismo modo, se respetaron los silencios, las dudas y los límites establecidos alrededor de aquello que cada persona decidió compartir, en coherencia con los principios de autonomía, confidencialidad y cuidado que orientaron la investigación.',
      'Los relatos reunidos no pretenden representar todas las experiencias de los militares víctimas del conflicto armado colombiano y sus familias. Cada historia conserva su particularidad y su propia forma de recordar, narrar y otorgar significado a lo vivido.'
    ]
  },
  {
    pageNumber: 6,
    type: 'intro',
    chapterId: 'introduccion',
    chapterTitle: 'Introducción',
    title: 'Introducción',
    subtitle: 'Antes de escuchar estas voces',
    image: '/src/assets/images/intro_student_writing_1790637495506.jpg',
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
      'Durante mucho tiempo, mi relación con el conflicto armado colombiano estuvo mediada por una pantalla. Como ocurre con muchas personas en este país, aprendí a reconocer la guerra a través de las noticias: cifras de muertos y heridos, desplazamientos, enfrentamientos, atentados, secuestros y territorios asociados una y otra vez a la violencia. Sabía que el conflicto existía y conocía parte de su historia, pero entre conocer una realidad y acercarse a ella había una distancia que entonces no alcanzaba a dimensionar.',
      'En esas noticias también aparecían los militares. Los veía en imágenes de operativos, enfrentamientos o ataques, pero pocas veces me detenía a pensar en lo que ocurría con ellos después. Había una idea que parecía explicarlo todo: estaban cumpliendo con su deber y ser militar significaba asumir ciertos riesgos. Esa percepción hacía que sus heridas, sus pérdidas y las consecuencias de la guerra pasaran inadvertidas. Me costaba reconocer a la persona detrás del uniforme, pensar en su familia o preguntarme qué sucedía cuando regresaba a casa.',
      'Estudiar Trabajo Social comenzó a transformar esa percepción. La universidad me enseñó a detenerme ante aquello que parecía evidente, a preguntarme de dónde provenían ciertas ideas y a comprender que una realidad social difícilmente puede explicarse desde una sola mirada. Pude reconocer prejuicios y cuestionar mi manera de interpretar el mundo, aunque el conflicto continuaba siendo una realidad que conocía desde afuera.',
      'Cuando llegó el momento de desarrollar el trabajo de grado, apareció la posibilidad de investigar las experiencias de militares víctimas del conflicto armado. Nunca había imaginado trabajar con esta población y tenía más preguntas que certezas. En los encuentros surgieron historias que comenzaban mucho antes del hecho que las había marcado y continuaban mucho después de que dejara de ocupar un espacio en los medios de comunicación.',
      'Frente a mí había personas contando qué había sucedido antes, durante y después. Había recuerdos de la vida en el campo, familias acostumbradas a las ausencias, esposas esperando llamadas e hijos preguntando por sus padres. Había cuerpos que décadas después todavía reaccionaban ante determinados sonidos. La guerra empezaba a tener nombres, relaciones, rutinas y consecuencias que ninguna cifra podía contener.'
    ]
  },
  {
    pageNumber: 8,
    type: 'intro',
    chapterId: 'introduccion',
    chapterTitle: 'Antes de escuchar estas voces',
    paragraphs: [
      'Escuchar produjo un impacto personal. En algunos momentos fue difícil conciliar aquellas historias con la representación que había construido de quienes integraban la Fuerza Pública. Comprendí que cumplir con el deber podía implicar miedo, dolor, incertidumbre y pérdida. También entendí que las consecuencias alcanzaban a quienes esperaban en casa y a quienes tuvieron que aprender a vivir con los cambios en una persona cercana.',
      'Reconocer mi propia distancia me confrontó. Había estudiado el conflicto, leído investigaciones y seguido las noticias, pero escuchar a quienes lo habían vivido mostró los límites de ese conocimiento. Un acontecimiento que desde afuera parecía delimitado en el tiempo podía seguir afectando la vida de alguien muchos años después.',
      'Cada encuentro mostró una manera diferente de recordar. Algunas personas podían hablar con mayor facilidad; otras regresaban a recuerdos que todavía resultaban dolorosos. Hubo momentos relatados con detalle y otros frente a los cuales apareció el silencio. Comprendí que acercarme a estas historias implicaba no esperar una conclusión determinada. Nadie tenía que decir que había superado lo vivido, perdonado o encontrado algo positivo después del dolor. Reconocer que todavía duele o que se extraña a alguien también forma parte de la historia.',
      'De esos encuentros nació la necesidad de que las voces escuchadas no permanecieran únicamente dentro del trabajo académico. Las entrevistas habían permitido comprender dimensiones de las rupturas provocadas por el conflicto, pero las historias de sus protagonistas excedían las categorías de análisis. Quisimos abrir un espacio donde pudieran leerse con esa amplitud.',
      'Esta antología busca aportar a la memoria histórica del conflicto armado colombiano desde experiencias que no siempre han ocupado un lugar visible en ella. Los relatos muestran cómo sus efectos permanecen en los cuerpos, las relaciones familiares, las ausencias y las maneras de continuar la vida.',
      'Incluir las experiencias de militares víctimas y sus familias amplía esa memoria sin desplazar las de otras víctimas. Cada relato ofrece una perspectiva situada en lo que una persona recuerda, siente y decide compartir.',
      'La posibilidad de contribuir a la reparación simbólica está en ese reconocimiento: ofrecer un lugar a sus voces y preservar aquello que quisieron contar. La publicación no permite asumir que el daño haya sido reparado ni que narrar produzca por sí mismo una transformación en quienes participan.'
    ]
  },
  {
    pageNumber: 9,
    type: 'intro',
    chapterId: 'introduccion',
    chapterTitle: 'Antes de escuchar estas voces',
    paragraphs: [
      'El título Del otro lado también hay voces alude a la distancia desde la cual observamos determinadas experiencias y creemos conocerlas sin habernos detenido a escucharlas. Ese “otro lado” no establece una división entre víctimas ni propone comprender el conflicto a partir de bandos. Las páginas que siguen hablan de militares y de sus familias: de quiénes eran antes, de las personas que amaban, de lo que cambió y de lo que todavía permanece.',
      'Estas voces transformaron muchas de las ideas con las que llegué a la investigación. Me enseñaron a acercarme sin decidir de antemano lo que debía encontrar. Esa es la disposición con la que quisiera invitar a leerlas.',
      'Ahora son ellas las que ocupan estas páginas.',
      'Y quizá el primer gesto sea simplemente ese: acercarse y escuchar.',
      'Carlos Eduardo Vallejo Montezuma'
    ]
  },
  {
    pageNumber: 10,
    type: 'story-cover',
    chapterId: 'relato-1',
    chapterTitle: 'El cuerpo no lo olvida',
    storyNumber: 1,
    title: 'El cuerpo no lo olvida',
    storyQuote: '“La mente es diferente, pero el cuerpo no se olvida de eso.”',
    authorNote: 'Relato construido a partir de la escritura autobiográfica y la entrevista realizada al participante.',
    image: '/src/assets/images/relato_1_boots_1790636517062.jpg',
    paragraphs: []
  },
  {
    pageNumber: 11,
    type: 'story',
    chapterId: 'relato-1',
    chapterTitle: 'El cuerpo no lo olvida',
    title: 'El cuerpo no lo olvida',
    paragraphs: [
      'Mi niñez fue una etapa muy bonita. Desde pequeño fui una persona trabajadora y me gustaban mucho la pesca, la cacería y el deporte. También me gustaban las aventuras y todo lo relacionado con el monte. Crecí rodeado de personas del campo, de animales, caballos y ganado, y eso me permitió conocer y aprender muchas cosas de la vida campesina.',
      'Éramos cinco hermanos, tres hombres y dos mujeres. Disfrutaba jugar y compartir con ellos. Jugábamos fútbol y, aunque a veces teníamos nuestras diferencias, siempre estuvimos pendientes unos de otros y de nuestros padres. La relación entre nosotros era buena. Como en toda familia podía haber conflictos, pero siempre hubo cariño y unión.',
      'Después formé mi propia familia. Llevo aproximadamente treinta años de casado y tengo tres hijos, dos mujeres y un hombre. Son personas trabajadoras: una de mis hijas es estilista y otro de mis hijos se ha dedicado a la construcción. Actualmente vivimos juntos en la zona de Laguna Verde, en un ambiente campesino, rodeados de animales, entre ellos gallinas y vacas de leche.',
      'Vivimos bien, en armonía y con una buena relación familiar. Mis hijos nos apoyan y nosotros también los apoyamos a ellos. Siempre hemos tratado de mantenernos unidos y respetarnos.',
      'En cuanto a mi vida en el Ejército, ingresé en 1987. Tenía dieciocho años cuando entré a prestar el servicio. Me presenté en Pasto y después fui enviado al Batallón Pichincha. Pasé aproximadamente tres meses en Cali y luego otros meses en el Cauca. Durante ese tiempo conocí la vida militar y empecé a participar en operaciones.',
      'En ese entonces estaba activo el conflicto con el M-19 y participé en un combate en Lucero. Era una época en la que la guerrilla tenía una fuerte presencia en esa zona.',
      'Después de cumplir el tiempo correspondiente salimos y cada uno regresó a su casa. Un día, mientras me encontraba nuevamente en mi vida cotidiana, me encontré con un sargento. Me preguntó qué estaba haciendo y le comenté que ya no me gustaba el campo y que quería regresar al Ejército. Me dijo que podía volver y me entregó una hoja de comisión para presentarme en Cali.',
      'Así regresé a la vida militar, esta vez como soldado voluntario. Empecé a trabajar con otros compañeros y, como era nuevo en ese lugar, tuve que adaptarme, conocer a mis superiores y a los demás soldados.'
    ]
  },
  {
    pageNumber: 12,
    type: 'story',
    chapterId: 'relato-1',
    chapterTitle: 'El cuerpo no lo olvida',
    paragraphs: [
      'Al principio incluso tuve dificultades con el pago. Durante aproximadamente tres meses no recibí mi sueldo. Como tenía dos hijos, ese dinero me hacía mucha falta, especialmente para comprarles los útiles y cubrir algunos gastos de la familia. Después la situación se normalizó y pude continuar con mi trabajo.',
      'Con el tiempo empecé a participar en diferentes operaciones. A veces recibíamos información sobre la presencia de la guerrilla y teníamos que desplazarnos. También estuve en un grupo especial, conformado por varios soldados, que realizaba misiones en zonas donde había presencia de grupos armados.',
      'Pasábamos mucho tiempo en el monte y aprendimos a sobrevivir con las condiciones que había allí.',
      'La alimentación era diferente a la que teníamos normalmente. Comíamos lo que se podía conseguir o transportar. En algunas ocasiones había arroz, lentejas, sardinas, arepas, panela. Cuando llegábamos a algún pueblo podíamos comprar gallinas, carne u otros alimentos. También llegamos a comer animales que se conseguían en el monte.',
      'Entre los compañeros nos ayudábamos. Terminamos convirtiéndonos prácticamente en una familia. Dormíamos, comíamos y convivíamos juntos durante largos períodos. Conocíamos los problemas de cada uno y compartíamos muchas cosas; prácticamente no había secretos entre nosotros.',
      'En una ocasión me preguntaron si quería ser suboficial. Aunque no tenía todos los estudios necesarios, decidí aceptar la propuesta. Me dieron aproximadamente quince días de permiso para despedirme de mi familia y visitar a mis hijos.',
      'Sin embargo, cuando regresé a Santa Ana empecé a pensar que ya no quería continuar. Le dije a mi coronel que quería pedir la baja y entregar el armamento. Él me preguntó por qué y le expliqué que llevaba un tiempo pensando en retirarme.',
      'En medio de esa situación tuve que acompañar a realizar un giro hacia Puerto Asís. Nos desplazamos primero en helicóptero y después continuamos en una camioneta. Llegamos a la zona y, mientras nos encontrábamos cerca de la base, apareció otro helicóptero. Poco después se presentó un enfrentamiento con la guerrilla y comenzó el combate.',
      'Recuerdo que había mucha tensión. Éramos pocos y teníamos que enfrentarnos a una situación bastante difícil. En medio de la operación recuerdo incluso cosas extrañas, como una gallina blanca que se atravesó. Yo pensé que no me dejaba avanzar. También había compañeros que nos avisaban cuando se acercaba el enemigo.'
    ]
  },
  {
    pageNumber: 13,
    type: 'story',
    chapterId: 'relato-1',
    chapterTitle: 'El cuerpo no lo olvida',
    paragraphs: [
      'En determinado momento me protegí detrás de un palo, pero recibí varios impactos. Una bala me alcanzó en la cabeza.',
      'Al principio no entendía exactamente qué estaba pasando. Cuando escuché a mis compañeros decirme que tuviera cuidado, me di cuenta de que estaba herido. Sentí la sangre. Después me vendaron la cabeza con una toalla para poder trasladarme.',
      'Me llevaron primero a Puerto Asís y, posteriormente, en una avioneta, a Bogotá, al Hospital Militar.',
      'Cuando desperté, después de un tiempo, tenía la voz afectada y el lado izquierdo de mi cuerpo no se movía. No entendía muy bien dónde estaba ni qué había ocurrido.',
      'Comenzó un largo proceso de recuperación, tanto psicológica como física. Estuve aproximadamente seis meses en el Hospital Militar. Allí recibí acompañamiento psicológico, neurológico y físico. Tuve los tratamientos y durante esos seis meses recibí ese acompañamiento.',
      'Me realizaron una junta médica, después de la cual salí pensionado.',
      'Durante la recuperación tuve que aprender nuevamente muchas cosas, entre ellas caminar. Una doctora me enseñaba durante las terapias. Me decía que me agarrara y diera los pasos sin miedo. Fue difícil porque mi cuerpo estaba muy rígido y tenía dificultades para moverme.',
      'Se me afectó la lengua. Me costaba hablar y mover algunas partes del cuerpo. En algunos momentos necesitaba ayuda para hacer actividades que antes realizaba normalmente. Poco a poco fui recuperándome y aprendiendo de nuevo a hacer diferentes cosas.',
      'La vida emocional cambia harto. No es lo mismo estar alentado que estar con las secuelas. Uno se siente mal, piensa en cómo lo mira todo el mundo, se ve caminando con bastón. Yo miraba la diferencia entre lo que era antes, lo que corría, lo que hablaba, lo que gritaba, y lo que podía hacer después.',
      'La psicóloga y los mismos amigos me ayudaban. Me decían que pusiera la frente en alto, que lo que me había pasado había sido sirviendo a la patria y defendiéndola, que no había sido robando ni atracando. Por ahí fui poniéndome bien psicológicamente, poco a poco.',
      'De la vida militar a la vida civil es diferente. Mi esposa comenzó a ayudarme con los ejercicios, con la terapia, para ir recuperándome. En algunas cosas necesitaba esa'
    ]
  },
  {
    pageNumber: 14,
    type: 'story',
    chapterId: 'relato-1',
    chapterTitle: 'El cuerpo no lo olvida',
    paragraphs: [
      'colaboración. Tuve que acostumbrarme nuevamente a estar en casa y compartir con mi familia.',
      'Regresar a la vida cotidiana tampoco fue sencillo. Después del impacto del plomo, del combate, uno queda mal. Cualquier totazo, cualquier ruido, lo hacía brincar alto. Estábamos psicoseados con eso.',
      'Había sonidos o situaciones inesperadas que me producían miedo. Un ruido fuerte podía hacerme pensar que algo estaba ocurriendo.',
      'En una ocasión estábamos en la cocina y hubo un accidente con una olla a presión. La olla se destapó y la presión hizo que saliera el contenido. Por un momento pensé que podía volver a ocurrir algo grave. Son experiencias que quedan en la memoria después de haber pasado por situaciones como las que viví en el Ejército.',
      'Ya pasaron los años y poco a poco uno va olvidando un poco. Pero hay cosas que siguen.',
      'Cuando se escucha pólvora, un cohete o el escape de un carro, ya no es solo cosa mental, sino del cuerpo mismo. El brazo brinca o la pierna es capaz de salir volando al oír eso.',
      'La mente es diferente, pero el cuerpo no se olvida de eso.',
      'Yo no sé, los miembros, los tendones, reaccionan al escuchar esos sonidos. Uno entiende que lo que pasó ya pasó, pero el cuerpo reacciona.',
      'También se sienten las diferencias al trabajar o al querer hacer cosas con los hijos. Yo quisiera estar alentado, manejar una moto, un carro, poder movilizarme así. No he podido hacerlo de esa manera.',
      'Mi condición también los ha afectado a ellos. A veces hay discriminación, comentarios en el colegio o en la escuela sobre el papá.',
      'En la comunidad uno desearía trabajar. Yo soy un líder, hago trabajos, obras, pero una persona con discapacidad es diferente de una persona alentada. No es lo mismo ponerse a hacer un trabajo o hacer la misma fuerza que los demás.',
      'En eso, físicamente, uno se siente medio mal, tanto respecto a la comunidad como respecto a los hijos.',
      'Aun así, considero que mi familia siempre ha sido muy unida. Nos hemos respetado y hemos tratado de mantenernos juntos. Mis hijos son trabajadores y nos colaboramos.'
    ]
  },
  {
    pageNumber: 15,
    type: 'story',
    chapterId: 'relato-1',
    chapterTitle: 'El cuerpo no lo olvida',
    paragraphs: [
      'Ahora tengo una movilidad con la que puedo ayudarme yo solo. Hay otras personas que dependen de alguien más. Yo tengo mis secuelas, pero me acostumbré a andar sin el bastón, a ser independiente de él.',
      'Me ha pasado que lo llevo, me siento en una cafetería o entro a un cajero y después se me olvida. Si no me dicen que mire el bastón, se queda. Hasta cuando andamos con mi mujer pasa eso: nos damos cuenta de que lo dejé en alguna parte.',
      'Uno tiene que acostumbrarse a llevarlo.',
      'Ahora fui a una cita de ortopedia y la doctora me dio una rodillera, un soporte para la rodilla. Me dijo que tengo que andar con bastón. También me ordenó radiografías para revisar la rodilla y la cadera. Estamos esperando esos exámenes en el hospital, a ver cómo nos va.',
      'Físicamente ya no es lo mismo. Antes corría, hablaba, gritaba. Ahora hablar también me cuesta. Uno trata de no preocupar a la familia, pero a veces aparecen mareos o problemas con la visión, y yo veo que esas cosas vienen del mismo trauma, del mismo accidente.',
      'Con la atención en salud he tenido cosas buenas. Uno tiene que sacar su tiempo, pedir la cita y ahí miran si necesita un profesional, si lo mandan al hospital o si debe hacerse exámenes por fuera. Para qué voy a hablar mal de ellos: respecto a la salud, el tratamiento ha sido bueno.',
      'Durante la hospitalización sí recibí acompañamiento. La atención psicológica fue individual.',
      'Después se me hacía difícil asistir. No podía caminar bien y era complicado pagar taxi a toda hora, bajar, subir. Por eso dejé de ir al batallón.',
      'No puedo decir que toda la atención sea mala, pero sí que faltaría un poco. Que se tenga en cuenta que a uno se le dificulta movilizarse. Recibir atención en la casa sería algo primordial.',
      'La relación con el Ejército también es distinta. Cuando uno está activo se siente respetado como militar. Después, para entrar al batallón, tiene que identificarse, decir a qué va, entrar en un horario, indicar a qué hora sale.',
      'Uno sigue llevando eso por dentro. Si hay que colaborar con alguna información, uno colabora. Pero los oficiales van cambiando, está uno un tiempo y después llega otro. A veces no lo conocen a uno y hasta de pronto lo discriminan.'
    ]
  }
];
