/* ============================================================
   PROTOCOLO MORIARTY · Estado, persistencia y cálculo del plan
   ============================================================ */

import { TASKS, phaseOf } from "./data";

export interface IllRecord {
  tema: string;
  materia: string;
  tipo: string;
  herramienta: string;
  comprension: number;
  explico: boolean;
  idea?: string;
  ts: number;
}

export interface QuestionRec {
  id: string;
  materia: string;
  pregunta: string;
  respuesta: string;
  explicacion: string;
  dificultad: string;
  ts: number;
}

export interface NotesRec {
  observaciones: string;
  ideas: string;
  errores: string;
  manana: string;
}

export interface DayRecord {
  tasks: string[];
  notes: NotesRec;
  illustration: IllRecord | null;
  questions: QuestionRec[];
  fisico: Record<string, boolean>;
  estilo: string[];
}

export interface ProtocolState {
  startDate: string | null; // YYYY-MM-DD
  days: Record<number, DayRecord>;
  celebrated: number[]; // milestones ya mostrados
}

export const STORAGE_KEY = "protocolo-moriarty-v1";

export const emptyNotes = (): NotesRec => ({
  observaciones: "",
  ideas: "",
  errores: "",
  manana: "",
});

export const emptyDay = (): DayRecord => ({
  tasks: [],
  notes: emptyNotes(),
  illustration: null,
  questions: [],
  fisico: {},
  estilo: [],
});

export const freshState = (): ProtocolState => ({
  startDate: null,
  days: {},
  celebrated: [],
});

export function loadState(): ProtocolState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as Partial<ProtocolState>;
    if (!parsed || typeof parsed !== "object") return freshState();
    return {
      startDate: typeof parsed.startDate === "string" ? parsed.startDate : null,
      days: parsed.days && typeof parsed.days === "object" ? parsed.days : {},
      celebrated: Array.isArray(parsed.celebrated) ? parsed.celebrated : [],
    };
  } catch {
    return freshState();
  }
}

export function saveState(s: ProtocolState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* almacenamiento no disponible */
  }
}

/* ---------------- Fechas ---------------- */

export function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function toISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function diffDays(a: Date, b: Date): number {
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / 86400000);
}

export function fmtLong(d: Date): string {
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/* ---------------- Información del reto ---------------- */

export type ChallengeStatus = "idle" | "upcoming" | "active" | "complete";

export interface CurrentInfo {
  day: number; // día efectivo 1..30
  status: ChallengeStatus;
  startsIn: number; // días que faltan si upcoming
}

export function getCurrentInfo(state: ProtocolState, today = new Date()): CurrentInfo {
  if (!state.startDate) return { day: 1, status: "idle", startsIn: 0 };
  const start = parseISO(state.startDate);
  const diff = diffDays(start, today);
  if (diff < 0) return { day: 1, status: "upcoming", startsIn: -diff };
  return {
    day: Math.min(30, diff + 1),
    status: diff >= 30 ? "complete" : "active",
    startsIn: 0,
  };
}

/** Fecha real correspondiente a un día del reto. */
export function dayDate(state: ProtocolState, day: number): Date {
  if (!state.startDate) return new Date();
  const d = parseISO(state.startDate);
  d.setDate(d.getDate() + (day - 1));
  return d;
}

/* ---------------- Progreso ---------------- */

export const TOTAL_TASKS = TASKS.length;

export function dayProgress(rec: DayRecord | undefined): number {
  if (!rec) return 0;
  return Math.min(1, rec.tasks.length / TOTAL_TASKS);
}

export function isDayComplete(rec: DayRecord | undefined): boolean {
  if (!rec) return false;
  return TASKS.every((t) => rec.tasks.includes(t.id));
}

export function completedDayList(state: ProtocolState): number[] {
  const out: number[] = [];
  for (let d = 1; d <= 30; d++) {
    if (isDayComplete(state.days[d])) out.push(d);
  }
  return out;
}

export function streakInfo(state: ProtocolState, currentDay: number): { current: number; best: number } {
  const done = new Set(completedDayList(state));
  let cur = 0;
  let d = currentDay;
  if (!done.has(d)) d = currentDay - 1; // la racha sigue viva con lo hecho hasta ayer
  while (d >= 1 && done.has(d)) {
    cur++;
    d--;
  }
  let best = 0;
  let run = 0;
  for (let i = 1; i <= 30; i++) {
    if (done.has(i)) {
      run++;
      best = Math.max(best, run);
    } else run = 0;
  }
  return { current: cur, best };
}

/** Preguntas de prueba nacional exigidas para un día dado. */
export function requiredQuestions(state: ProtocolState, day: number): number {
  const p = phaseOf(day);
  if (p.n === 1) return 0;
  if (p.n === 2) return 1;
  const wd = dayDate(state, day).getDay();
  return wd === 0 || wd === 6 ? 3 : 1;
}

/* ---------------- Estadísticas globales ---------------- */

export interface GlobalStats {
  daysDone: number;
  totalTasks: number;
  streak: number;
  bestStreak: number;
  illustrations: number;
  avgComprension: number;
  questions: number;
  fisicoPct: number;
  estiloPoints: number;
}

export function computeStats(state: ProtocolState, currentDay: number): GlobalStats {
  const done = completedDayList(state);
  const st = streakInfo(state, currentDay);
  let totalTasks = 0;
  let illustrations = 0;
  let compSum = 0;
  let questions = 0;
  let fisicoOk = 0;
  let fisicoSeen = 0;
  let estiloPoints = 0;

  for (let d = 1; d <= 30; d++) {
    const rec = state.days[d];
    if (!rec) continue;
    totalTasks += rec.tasks.length;
    if (rec.illustration) {
      illustrations++;
      compSum += rec.illustration.comprension;
    }
    questions += rec.questions.length;
    const vals = Object.values(rec.fisico);
    if (vals.length) {
      fisicoSeen++;
      if (vals.every(Boolean)) fisicoOk++;
    }
    estiloPoints += rec.estilo.length;
  }

  return {
    daysDone: done.length,
    totalTasks,
    streak: st.current,
    bestStreak: st.best,
    illustrations,
    avgComprension: illustrations ? Math.round((compSum / illustrations) * 10) / 10 : 0,
    questions,
    fisicoPct: fisicoSeen ? Math.round((fisicoOk / fisicoSeen) * 100) : 0,
    estiloPoints,
  };
}
