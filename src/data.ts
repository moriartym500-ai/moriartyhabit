/* ============================================================
   PROTOCOLO MORIARTY · Contenido del plan de 30 días
   ============================================================ */

export interface Task {
  id: string;
  label: string;
  group: string;
  hint?: string;
}

export const TASK_GROUPS: { id: string; label: string; time: string }[] = [
  { id: "apertura", label: "Apertura", time: "Primera hora" },
  { id: "mente", label: "Estrategia Mental", time: "Jornada" },
  { id: "cuerpo", label: "Cuerpo", time: "Tarde" },
  { id: "cierre", label: "Cierre", time: "Noche" },
];

export const TASKS: Task[] = [
  { id: "despertar", label: "Despertar sin quedarse viendo el celular", group: "apertura", hint: "El primer movimiento es tuyo, no de la pantalla." },
  { id: "agua", label: "Beber un vaso grande de agua", group: "apertura" },
  { id: "postura-am", label: "5 minutos de postura y estiramiento", group: "apertura" },
  { id: "ducha", label: "Ducha tibia cerrando con 30 s de agua fría", group: "apertura" },
  { id: "desayuno", label: "Desayuno estratégico", group: "apertura" },
  { id: "observacion", label: "Observación escolar: analizar una clase, profesor o compañero", group: "mente", hint: "¿Qué patrones viste que otros no notaron?" },
  { id: "nota", label: "Tomar al menos una nota inteligente del día", group: "mente" },
  { id: "ilustracion", label: "Ilustración lógica de 45 minutos", group: "mente", hint: "45 min · usa el temporizador de ilustración." },
  { id: "pruebas", label: "Resolver preguntas de prueba nacional según la fase", group: "mente" },
  { id: "arte", label: "Arte libre durante al menos 1 hora", group: "mente" },
  { id: "batido", label: "Batido de superávit calórico para ectomorfo", group: "cuerpo" },
  { id: "entreno", label: "Entrenamiento físico de 15 minutos", group: "cuerpo" },
  { id: "cierre-dia", label: "Cierre: escribir 3 aprendizajes y 1 error", group: "cierre" },
  { id: "preparar", label: "Preparar ropa y material para mañana", group: "cierre" },
  { id: "lectura", label: "Leer 15 minutos antes de dormir", group: "cierre" },
  { id: "dormir", label: "Dormir alrededor de las 23:00", group: "cierre", hint: "El descanso también es una jugada." },
];

/* ---------------- Fases ---------------- */

export interface Phase {
  n: number;
  numeral: string;
  name: string;
  from: number;
  to: number;
  desc: string;
  directive: string;
}

export const PHASES: Phase[] = [
  {
    n: 1,
    numeral: "I",
    name: "Operación Despertar",
    from: 1,
    to: 10,
    desc: "Construir la base: sueño, agua, postura, enfoque y las primeras jugadas silenciosas.",
    directive: "Sin preguntas obligatorias: solo lectura ligera de 10 minutos de un tema básico.",
  },
  {
    n: 2,
    numeral: "II",
    name: "Operación Infiltración",
    from: 11,
    to: 20,
    desc: "Entrar en el juego académico: una pregunta de prueba nacional cada día.",
    directive: "Resolver 1 pregunta de prueba nacional por día.",
  },
  {
    n: 3,
    numeral: "III",
    name: "Operación Caballero",
    from: 21,
    to: 30,
    desc: "Dominio bajo presión: elegancia, precisión y remate del plan.",
    directive: "Lunes a viernes: 1 pregunta. Sábados y domingos: 3 preguntas.",
  },
];

export const phaseOf = (day: number): Phase =>
  PHASES.find((p) => day >= p.from && day <= p.to) ?? PHASES[2];

/* ---------------- Los 30 días ---------------- */

export const DAY_BRIEFS: string[] = [
  "Establece el control básico.",
  "La disciplina vence a la motivación.",
  "Observa más de lo que hablas.",
  "El primer movimiento define la partida.",
  "Reduce la fricción y ganarás la mañana.",
  "El cuerpo obedece a la mente entrenada.",
  "Registra el error antes de que se repita.",
  "La constancia no hace ruido: hace resultados.",
  "Prepara mañana esta noche.",
  "Cierra la primera fase con silencio y orden.",
  "La infiltración comienza: una pregunta al día.",
  "Que tu progreso sea invisible hasta que sea inevitable.",
  "Dibuja el conocimiento: lo que la mano traza, la mente lo guarda.",
  "La postura erguida también intimida sin palabras.",
  "El superávit de hoy es la fuerza de mañana.",
  "Escucha el doble de lo que hablas.",
  "Un plan escrito pesa más que diez intenciones.",
  "La elegancia es disciplina invisible.",
  "Anticipa la fatiga como anticipas al rival.",
  "Segunda fase cerrada: ya estás dentro.",
  "Operación Caballero: actúa como si el trono ya fuera tuyo.",
  "Cada hábito es una pieza movida en el tablero.",
  "La pereza se vence reduciendo la fricción del primer movimiento.",
  "No reveles el plan; revela el resultado.",
  "El aburrimiento es energía sin dirección: dirígela.",
  "Domina lo básico hasta que parezca talento.",
  "La mente ordinaria reacciona; la estratégica anticipa.",
  "A dos jugadas del final, no aceleres: precisa.",
  "La penúltima jugada decide la última.",
  "Treinta jugadas bien pensadas valen más que mil impulsos.",
];

/* ---------------- Frases estratégicas ---------------- */

export const QUOTES: string[] = [
  "La mente ordinaria reacciona; la mente estratégica anticipa.",
  "El aburrimiento es energía sin dirección.",
  "No estudies para memorizar; estudia para comprender y dominar.",
  "Cada hábito es una pieza movida en el tablero.",
  "La elegancia es disciplina invisible.",
  "El cuerpo también es parte del plan.",
  "Un caballero no improvisa: prepara.",
  "La pereza se vence reduciendo la fricción del primer movimiento.",
  "Observa, analiza y actúa solo cuando sea necesario.",
  "El conocimiento bien ilustrado se queda en la memoria.",
  "Un plan que no se ejecuta hoy es un favor al adversario.",
  "La constancia es la estrategia de los que no necesitan suerte.",
  "Domina tu mañana la noche anterior.",
  "El talento sin protocolo es un arma sin puntería.",
  "Que tus resultados hablen; tú guarda silencio.",
  "Cada minuto de enfoque es territorio ganado.",
  "El descanso también es una jugada.",
  "No persigas motivación: construye inercia.",
  "La mente clara se dibuja a mano.",
  "Un error registrado es una lección armada.",
  "La elegancia no se nota: se percibe.",
  "Anticipa la fatiga como anticipas al rival.",
  "El caos del escritorio es el caos del plan.",
  "Sé amable; la amabilidad desarma y observa.",
  "La memoria ama lo que la mano dibuja.",
  "Nadie nota el ensayo; todos notan la función.",
  "El superávit de hoy es la fuerza de mañana.",
  "Postura erguida, mente en guardia.",
  "Los planes se revelan solo cuando están cumplidos.",
  "El tablero no perdona al que mueve por impulso.",
];

export const quoteOfDay = (day: number): string => QUOTES[(day - 1) % QUOTES.length];

/* ---------------- Ilustración lógica ---------------- */

export const ILL_IDEAS: string[] = [
  "Dibuja un concepto científico como si fuera una máquina.",
  "Convierte un evento histórico en un mapa estratégico.",
  "Transforma una fórmula matemática en un diagrama visual.",
  "Dibuja una célula como una ciudad fortificada.",
  "Representa un conflicto histórico como una partida de ajedrez.",
  "Crea una infografía elegante del tema.",
  "Dibuja un personaje que explique el concepto.",
  "Haz un esquema visual con estilo de manga.",
  "Convierte el tema en un jefe final con debilidades.",
  "Diseña una escena donde el concepto sea la clave del misterio.",
  "Explica el tema como un manual de espionaje con planos.",
  "Dibuja una línea de tiempo como la ruta de un tren.",
  "Convierte el vocabulario nuevo en emblemas heráldicos.",
  "Ilustra el tema como el vitral de una catedral.",
];

export const ILL_TYPES = [
  "Diagrama / esquema",
  "Infografía",
  "Mapa conceptual",
  "Escena narrativa",
  "Personaje explicativo",
  "Máquina / mecanismo",
  "Mapa estratégico",
  "Estilo manga",
  "Jefe final",
  "Otro",
];

export const ILL_TOOLS = [
  "Lápiz y papel",
  "Clip Studio Paint",
  "Photoshop",
  "Procreate",
  "Krita",
  "Tableta gráfica",
  "Otro",
];

export const SUBJECTS = [
  "Matemáticas",
  "Lengua y Literatura",
  "Ciencias Naturales",
  "Estudios Sociales",
  "Inglés",
  "Otra",
];

/* ---------------- Físico ---------------- */

export interface Exercise {
  name: string;
  sets: string;
}
export interface Workout {
  kind: "fuerza" | "postura" | "descanso";
  title: string;
  days: string;
  focus: string;
  exercises: Exercise[];
}

const STRENGTH: Workout = {
  kind: "fuerza",
  title: "Fuerza",
  days: "Lunes · Miércoles · Viernes",
  focus: "Construir base muscular con peso corporal. Calidad antes que velocidad.",
  exercises: [
    { name: "Flexiones", sets: "3 series al fallo" },
    { name: "Sentadillas", sets: "3 series de 20" },
    { name: "Plancha abdominal", sets: "3 series de 1 minuto" },
    { name: "Elevación de talones", sets: "3 series de 20" },
    { name: "Retracciones escapulares", sets: "3 series de 15" },
  ],
};

const POSTURE: Workout = {
  kind: "postura",
  title: "Postura y Estiramientos",
  days: "Martes · Jueves",
  focus: "Abrir el pecho, centrar los hombros y erguir la figura del caballero.",
  exercises: [
    { name: "Estiramiento de pecho en marco de puerta", sets: "3 series de 30 segundos" },
    { name: "Retracciones escapulares", sets: "3 series de 15" },
    { name: "Face pulls con banda o toalla", sets: "3 series de 15" },
    { name: "Plancha suave", sets: "3 series de 30 segundos" },
    { name: "Estiramiento de cuello y espalda", sets: "5 minutos" },
  ],
};

const SATURDAY: Workout = {
  kind: "descanso",
  title: "Descanso Activo",
  days: "Sábado",
  focus: "Caminata a buen ritmo o movilidad ligera. El músculo crece en la calma.",
  exercises: [
    { name: "Caminata a paso ligero", sets: "30 – 40 minutos" },
    { name: "Movilidad de hombros y cadera", sets: "10 minutos" },
  ],
};

const SUNDAY: Workout = {
  kind: "descanso",
  title: "Descanso Activo",
  days: "Domingo",
  focus: "Estiramientos suaves y respiración. Preparar la semana como se prepara una partida.",
  exercises: [
    { name: "Estiramientos suaves globales", sets: "15 minutos" },
    { name: "Respiración lenta y consciente", sets: "5 minutos" },
  ],
};

/* getDay(): 0 domingo … 6 sábado */
export const WEEK_WORKOUT: Record<number, Workout> = {
  0: SUNDAY,
  1: STRENGTH,
  2: POSTURE,
  3: STRENGTH,
  4: POSTURE,
  5: STRENGTH,
  6: SATURDAY,
};

export const WEEKDAYS_ES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const PHYS_CHECKS: { id: string; label: string }[] = [
  { id: "batido", label: "¿Tomé el batido de superávit?" },
  { id: "proteina", label: "¿Comí suficiente proteína?" },
  { id: "agua", label: "¿Tomé suficiente agua?" },
  { id: "entreno", label: "¿Entrené 15 minutos?" },
  { id: "postura", label: "¿Corregí postura?" },
];

export const PHYS_REMINDER =
  "Como ectomorfo, si no estás comiendo suficiente, no crecerás. Prioriza calorías líquidas, proteína y descanso.";

/* ---------------- Estilo del caballero ---------------- */

export const STYLE_CHECKS: { id: string; label: string }[] = [
  { id: "ropa", label: "Ropa preparada para mañana" },
  { id: "apariencia", label: "Apariencia cuidada" },
  { id: "postura", label: "Postura elegante" },
  { id: "habitacion", label: "Habitación ordenada" },
  { id: "escritorio", label: "Escritorio limpio" },
  { id: "lenguaje", label: "Lenguaje calmado" },
  { id: "observacion", label: "Observación silenciosa" },
];

export const STYLE_TIPS: string[] = [
  "Usa ropa limpia y bien ajustada.",
  "Mantén postura recta.",
  "Habla con calma.",
  "Escucha más de lo que hablas.",
  "No reveles todos tus planes.",
  "Sé educado, pero estratégico.",
  "Mantén tu espacio ordenado.",
  "La elegancia también es disciplina.",
];

/* ---------------- Recompensas ---------------- */

export interface Milestone {
  at: number;
  title: string;
  msg: string;
}

export const MILESTONES: Milestone[] = [
  { at: 1, title: "Primer día completado", msg: "El tablero avanza a tu favor." },
  { at: 7, title: "Primera semana dominada", msg: "Siete jugadas en silencio." },
  { at: 10, title: "Operación Despertar completada", msg: "La base es tuya. Ahora infiltra." },
  { at: 20, title: "Operación Infiltración completada", msg: "Ya estás dentro. Queda el trono." },
  { at: 30, title: "Protocolo Moriarty completado", msg: "Ahora puedes solicitar la siguiente fase." },
];

export const DIFFICULTIES = ["Fácil", "Media", "Difícil"] as const;
