import { useEffect, useMemo, useRef, useState } from "react";
import { DAY_BRIEFS, MILESTONES, phaseOf, quoteOfDay } from "./data";
import type { DayRecord, IllRecord, NotesRec, ProtocolState, QuestionRec } from "./state";
import {
  completedDayList,
  computeStats,
  emptyDay,
  emptyNotes,
  freshState,
  getCurrentInfo,
  isDayComplete,
  loadState,
  saveState,
  toISO,
} from "./state";
import {
  Bar,
  Corners,
  IconBoard,
  IconBarbell,
  IconCrown,
  IconFlame,
  IconLock,
  IconNib,
  IconPawn,
  IconQuill,
  IconTarget,
  IconX,
} from "./components/ui";
import {
  MiniTimer,
  PomodoroPanel,
  TIMER_MODES,
  initialTimer,
  type TimerState,
} from "./components/Pomodoro";
import Hoy from "./tabs/Hoy";
import Ilustracion from "./tabs/Ilustracion";
import Fisico from "./tabs/Fisico";
import Pruebas from "./tabs/Pruebas";
import Estilo from "./tabs/Estilo";
import Notas from "./tabs/Notas";
import Progreso from "./tabs/Progreso";

/* ---------------- Navegación ---------------- */

const TABS = [
  { id: "hoy", numeral: "I", label: "Hoy", icon: IconPawn },
  { id: "ilustracion", numeral: "II", label: "Ilustración Lógica", icon: IconNib },
  { id: "fisico", numeral: "III", label: "Físico", icon: IconBarbell },
  { id: "pruebas", numeral: "IV", label: "Pruebas Nacionales", icon: IconTarget },
  { id: "estilo", numeral: "V", label: "Estilo", icon: IconCrown },
  { id: "notas", numeral: "VI", label: "Notas", icon: IconQuill },
  { id: "progreso", numeral: "VII", label: "Progreso", icon: IconBoard },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface OverlayMsg {
  kicker: string;
  title: string;
  lines: string[];
}

function beep() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const tone = (freq: number, t0: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t0);
      g.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + 0.45);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t0);
      o.stop(ctx.currentTime + t0 + 0.5);
    };
    tone(659, 0);
    tone(880, 0.2);
  } catch {
    /* silencio elegante */
  }
}

export default function App() {
  const [state, setState] = useState<ProtocolState>(loadState);
  const [tab, setTab] = useState<TabId>("hoy");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [overlay, setOverlay] = useState<OverlayMsg | null>(null);
  const [askReset, setAskReset] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const [timer, setTimer] = useState<TimerState>(initialTimer);
  const toastId = useRef(0);
  const wasRunning = useRef(false);

  const info = useMemo(() => getCurrentInfo(state), [state]);
  const stats = useMemo(() => computeStats(state, info.day), [state, info.day]);
  const phase = phaseOf(info.day);
  const locked = info.status === "idle" || info.status === "upcoming";
  const effDay = selectedDay ?? info.day;
  const record = state.days[effDay];

  /* Persistencia automática */
  useEffect(() => saveState(state), [state]);

  /* Cronómetro */
  useEffect(() => {
    if (!timer.running) return;
    const id = setInterval(
      () =>
        setTimer((t) =>
          t.left <= 1 ? { ...t, left: 0, running: false } : { ...t, left: t.left - 1 }
        ),
      1000
    );
    return () => clearInterval(id);
  }, [timer.running]);

  useEffect(() => {
    if (wasRunning.current && !timer.running && timer.left === 0) {
      beep();
      pushToast("Tiempo cumplido. Jugada cerrada.");
    }
    wasRunning.current = timer.running;
  }, [timer.running, timer.left]);

  function pushToast(msg: string) {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }

  /* ---------------- Mutaciones del día ---------------- */

  function patchDay(day: number, fn: (r: DayRecord) => DayRecord) {
    setState((s) => ({
      ...s,
      days: { ...s.days, [day]: fn(s.days[day] ?? emptyDay()) },
    }));
  }

  function toggleTask(day: number, id: string) {
    const rec = state.days[day] ?? emptyDay();
    const has = rec.tasks.includes(id);
    const next: DayRecord = {
      ...rec,
      tasks: has ? rec.tasks.filter((t) => t !== id) : [...rec.tasks, id],
    };
    const nextState: ProtocolState = { ...state, days: { ...state.days, [day]: next } };
    setState(nextState);
    if (!has && isDayComplete(next)) celebrate(nextState, day);
  }

  function celebrate(next: ProtocolState, day: number) {
    const count = completedDayList(next).length;
    const fresh = MILESTONES.filter((m) => m.at > 1 && m.at <= count && !next.celebrated.includes(m.at));
    if (fresh.length) {
      setState({ ...next, celebrated: [...next.celebrated, ...fresh.map((m) => m.at)] });
    }
    const top = fresh.sort((a, b) => b.at - a.at)[0];
    setOverlay({
      kicker: `Día ${day} · ${phaseOf(day).name}`,
      title: "Día completado.",
      lines: [
        "El tablero avanza a tu favor.",
        ...(top ? [`${top.title}: ${top.msg}`] : []),
      ],
    });
  }

  function physToggle(day: number, id: string) {
    patchDay(day, (r) => {
      const v = r.fisico[id];
      return { ...r, fisico: { ...r.fisico, [id]: v === undefined ? true : v ? false : true } };
    });
  }

  function estiloToggle(day: number, id: string) {
    patchDay(day, (r) => ({
      ...r,
      estilo: r.estilo.includes(id) ? r.estilo.filter((x) => x !== id) : [...r.estilo, id],
    }));
  }

  function setNotes(day: number, key: keyof NotesRec, value: string) {
    patchDay(day, (r) => ({ ...r, notes: { ...r.notes, [key]: value } }));
  }

  function saveIll(day: number, rec: IllRecord) {
    patchDay(day, (r) => ({ ...r, illustration: rec }));
    pushToast("Ilustración registrada en el dossier.");
  }

  function addQuestion(day: number, q: QuestionRec) {
    patchDay(day, (r) => ({ ...r, questions: [...r.questions, q] }));
    pushToast("Pregunta registrada en el dossier.");
  }

  function deleteQuestion(day: number, qid: string) {
    patchDay(day, (r) => ({ ...r, questions: r.questions.filter((q) => q.id !== qid) }));
  }

  /* ---------------- Control del protocolo ---------------- */

  function startProtocol(date: string) {
    setState((s) => ({ ...s, startDate: date }));
    setSelectedDay(null);
    setOverlay({
      kicker: "Dossier abierto",
      title: "El protocolo ha comenzado.",
      lines: [`Día 1 · "${DAY_BRIEFS[0]}"`, quoteOfDay(1)],
    });
  }

  function changeStart(date: string) {
    setState((s) => ({ ...s, startDate: date }));
    setSelectedDay(null);
    pushToast("Fecha de inicio actualizada.");
  }

  function resetProtocol() {
    setState(freshState());
    setSelectedDay(null);
    setAskReset(false);
    setTab("hoy");
    pushToast("Tablero reiniciado. Treinta jugadas en blanco.");
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `protocolo-moriarty-${toISO(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast("Dossier exportado en JSON.");
  }

  function importFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<ProtocolState>;
        if (!parsed || typeof parsed !== "object" || !parsed.days || typeof parsed.days !== "object") {
          pushToast("El archivo no parece un dossier del protocolo.");
          return;
        }
        const days: Record<number, DayRecord> = {};
        for (const [k, v] of Object.entries(parsed.days)) {
          const n = Number(k);
          if (!Number.isFinite(n) || n < 1 || n > 30 || !v) continue;
          const base = emptyDay();
          days[n] = {
            ...base,
            ...v,
            notes: { ...emptyNotes(), ...(v.notes ?? {}) },
            tasks: Array.isArray(v.tasks) ? v.tasks : [],
            questions: Array.isArray(v.questions) ? v.questions : [],
            estilo: Array.isArray(v.estilo) ? v.estilo : [],
            fisico: v.fisico && typeof v.fisico === "object" ? v.fisico : {},
          };
        }
        setState({
          startDate: typeof parsed.startDate === "string" ? parsed.startDate : null,
          days,
          celebrated: Array.isArray(parsed.celebrated) ? parsed.celebrated : [],
        });
        setSelectedDay(null);
        pushToast("Dossier restaurado con éxito.");
      } catch {
        pushToast("No se pudo leer el archivo. Verifica que sea JSON.");
      }
    };
    reader.readAsText(file);
  }

  /* ---------------- Temporizador ---------------- */

  function timerSelect(id: string) {
    const m = TIMER_MODES.find((x) => x.id === id)!;
    setTimer({ modeId: m.id, label: m.label, total: m.mins * 60, left: m.mins * 60, running: false, startedOnce: false });
  }
  function timerToggle() {
    setTimer((t) => {
      if (t.left === 0) return { ...t, left: t.total, running: true, startedOnce: true };
      return { ...t, running: !t.running, startedOnce: true };
    });
  }
  function timerReset() {
    setTimer((t) => ({ ...t, left: t.total, running: false, startedOnce: false }));
  }

  const showMini = timer.startedOnce && (timer.running || timer.left < timer.total);
  const today = new Date();

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen relative">
      {/* Fondo ambiental */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="chess-field absolute inset-0" />
        <div className="glow-a absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-wine/15 blur-[130px]" />
        <div className="glow-b absolute -bottom-52 -right-40 w-[620px] h-[620px] rounded-full bg-gold/[0.07] blur-[140px]" />
      </div>

      {/* Cabecera */}
      <header className="relative z-10 border-b border-line bg-ink/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <div className="w-11 h-11 border border-gold/50 grid place-items-center bg-panel flex-none relative">
            <Corners />
            <span className="font-display font-bold text-gold text-lg leading-none">M</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-bone text-base sm:text-xl tracking-[0.12em] uppercase leading-tight truncate">
              Protocolo Moriarty
            </h1>
            <p className="small-caps text-muted mt-0.5 hidden sm:block">
              Plan secreto de 30 días · Confidencial
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            {info.status === "active" && (
              <span className="hidden md:inline-flex items-center gap-2 border border-winebright/50 bg-winedeep/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-bone">
                Fase {phase.numeral} · {phase.name}
              </span>
            )}
            <span className="hidden sm:inline-flex items-center gap-1.5 border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-bonedim">
              <IconFlame className={`w-3.5 h-3.5 ${stats.streak > 0 ? "text-winebright" : "text-muted"}`} />
              {stats.streak}
            </span>
            <span className="text-[11px] text-muted capitalize hidden lg:block">
              {today.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
        </div>
        <div className="h-[2px] bg-linesoft">
          <div className="bar-fill h-full" style={{ width: `${(stats.daysDone / 30) * 100}%` }} />
        </div>
      </header>

      {/* Navegación móvil */}
      <nav className="lg:hidden sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur-md">
        <div className="flex gap-1.5 overflow-x-auto px-4 py-2.5 no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`nav-pill flex-none flex items-center gap-1.5 border border-line px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-bonedim cursor-pointer ${
                tab === t.id ? "active" : ""
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Cuerpo */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-6 lg:py-8 grid lg:grid-cols-[228px_1fr] gap-7 items-start">
        {/* Riel lateral */}
        <aside className="hidden lg:block sticky top-8">
          <p className="small-caps text-muted mb-3 pl-4">Índice del plan</p>
          <nav className="space-y-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`nav-item w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer ${
                  tab === t.id ? "active" : "text-muted"
                }`}
              >
                <span className="font-display text-[11px] tracking-[0.2em] text-gold/70 w-5 flex-none">
                  {t.numeral}
                </span>
                <t.icon className="w-[18px] h-[18px] flex-none" />
                <span className="text-[13px] tracking-wide">{t.label}</span>
              </button>
            ))}
          </nav>
          <div className="panel-flat mt-8 p-4">
            <p className="small-caps text-gold/70 mb-2">Estado</p>
            <p className="font-display text-bone text-sm font-semibold">
              Día {info.day} <span className="text-muted font-normal">/ 30</span>
            </p>
            <div className="mt-2.5">
              <Bar value={stats.daysDone / 30} className="h-1" />
            </div>
            <p className="text-[11px] text-muted mt-2">
              {locked
                ? "Protocolo sin iniciar."
                : info.status === "complete"
                ? "Las 30 jugadas están sobre la mesa."
                : `${phase.name} en curso.`}
            </p>
          </div>
          {!locked && (
            <button className="btn btn-danger w-full mt-3" onClick={() => setAskReset(true)}>
              Reiniciar reto
            </button>
          )}
        </aside>

        {/* Contenido */}
        <main className="min-w-0 pb-24">
          {tab === "hoy" && (
            <Hoy
              state={state}
              info={info}
              effDay={effDay}
              record={record}
              onToggleTask={toggleTask}
              onStart={startProtocol}
              onChangeStart={changeStart}
              onGotoTab={(id) => setTab(id as TabId)}
              onSelectDay={(d) => setSelectedDay(d)}
              timerSlot={
                <PomodoroPanel
                  timer={timer}
                  onSelect={timerSelect}
                  onToggle={timerToggle}
                  onReset={timerReset}
                />
              }
            />
          )}

          {tab !== "hoy" && locked && (
            <div className="panel corners max-w-lg mx-auto p-10 text-center rise">
              <IconLock className="w-10 h-10 text-gold/60 mx-auto" />
              <h2 className="font-display text-xl text-bone font-semibold mt-5 tracking-[0.12em] uppercase">
                Sección sellada
              </h2>
              <p className="font-quote italic text-bonedim text-lg mt-3">
                Esta sala del plan se abre cuando el protocolo comienza.
              </p>
              <button className="btn btn-wine mt-7" onClick={() => setTab("hoy")}>
                Ir al inicio
              </button>
            </div>
          )}

          {tab === "ilustracion" && !locked && (
            <Ilustracion key={effDay} state={state} effDay={effDay} record={record} onSaveIll={saveIll} />
          )}
          {tab === "fisico" && !locked && (
            <Fisico state={state} effDay={effDay} infoDay={info.day} record={record} onPhysToggle={physToggle} />
          )}
          {tab === "pruebas" && !locked && (
            <Pruebas
              key={effDay}
              state={state}
              effDay={effDay}
              record={record}
              onAddQuestion={addQuestion}
              onDeleteQuestion={deleteQuestion}
            />
          )}
          {tab === "estilo" && !locked && (
            <Estilo effDay={effDay} record={record} onEstiloToggle={estiloToggle} />
          )}
          {tab === "notas" && !locked && <Notas effDay={effDay} record={record} onNotes={setNotes} />}
          {tab === "progreso" && (
            <Progreso
              state={state}
              info={info}
              onSelectDay={(d) => {
                setSelectedDay(d);
                setTab("hoy");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onExport={exportData}
              onImportFile={importFile}
              onAskReset={() => setAskReset(true)}
              onChangeStart={changeStart}
            />
          )}
        </main>
      </div>

      {/* Pie */}
      <footer className="relative z-10 border-t border-linesoft mt-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center gap-3 justify-between">
          <p className="text-[11.5px] text-muted">
            Protocolo Moriarty · El plan existe solo si se ejecuta.
          </p>
          <p className="text-[11.5px] text-muted/70">
            Tus datos permanecen únicamente en este dispositivo.
          </p>
        </div>
      </footer>

      {/* Mini cronómetro flotante */}
      {showMini && (
        <MiniTimer timer={timer} onToggle={timerToggle} onReset={timerReset} onClose={timerReset} />
      )}

      {/* Avisos */}
      <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-[calc(100%-6rem)]">
        {toasts.map((t) => (
          <div key={t.id} className="toast-in panel-flat border-gold/35 px-4 py-3 text-[13px] text-bone flex items-center gap-2.5">
            <span className="text-gold">◆</span>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Recompensa / hito */}
      {overlay && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 fadein" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-ink/85 backdrop-blur-sm cursor-default"
            onClick={() => setOverlay(null)}
            aria-label="Cerrar"
          />
          <div className="modal-in panel corners relative max-w-md w-full p-8 sm:p-10 text-center">
            <button
              className="absolute top-3 right-3 text-muted hover:text-bone transition-colors cursor-pointer"
              onClick={() => setOverlay(null)}
              aria-label="Cerrar aviso"
            >
              <IconX className="w-4 h-4" />
            </button>
            <div className="font-display text-gold text-2xl tracking-[0.4em]">◆</div>
            <p className="small-caps text-gold/80 mt-4">{overlay.kicker}</p>
            <h2 className="font-display text-3xl font-bold text-bone mt-3 leading-tight">
              {overlay.title}
            </h2>
            <div className="space-y-2 mt-4">
              {overlay.lines.map((l) => (
                <p key={l} className="font-quote italic text-bonedim text-lg leading-snug">
                  "{l}"
                </p>
              ))}
            </div>
            <button className="btn btn-wine w-full mt-8" onClick={() => setOverlay(null)}>
              Continuar la partida
            </button>
          </div>
        </div>
      )}

      {/* Confirmación de reinicio */}
      {askReset && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 fadein" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-ink/85 backdrop-blur-sm cursor-default"
            onClick={() => setAskReset(false)}
            aria-label="Cancelar"
          />
          <div className="modal-in panel corners relative max-w-md w-full p-8">
            <p className="small-caps text-winebright">Advertencia del estratega</p>
            <h2 className="font-display text-2xl font-bold text-bone mt-3">
              ¿Reiniciar el tablero completo?
            </h2>
            <p className="text-[13.5px] text-bonedim mt-3 leading-relaxed">
              Se borrarán {stats.daysDone} día{stats.daysDone === 1 ? "" : "s"} ganado
              {stats.daysDone === 1 ? "" : "s"}, {stats.totalTasks} tareas, {stats.questions}{" "}
              preguntas y todas las notas. Esta jugada no se puede deshacer.
            </p>
            <div className="flex gap-3 mt-7">
              <button className="btn btn-ghost flex-1" onClick={() => setAskReset(false)}>
                Conservar
              </button>
              <button className="btn btn-danger flex-1" onClick={resetProtocol}>
                Reiniciar todo
              </button>
            </div>
            <p className="text-[11.5px] text-muted mt-4 text-center">
              Consejo: exporta el dossier antes de borrarlo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
