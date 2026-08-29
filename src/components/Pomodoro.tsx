import {
  IconPause,
  IconPlay,
  IconRefresh,
  IconTimer,
  IconX,
  Panel,
  SectionTitle,
} from "./ui";

export interface TimerState {
  modeId: string;
  label: string;
  total: number; // segundos
  left: number;
  running: boolean;
  startedOnce: boolean;
}

export const TIMER_MODES = [
  { id: "estudio", label: "Estudio", mins: 25 },
  { id: "ilustracion", label: "Ilustración", mins: 45 },
  { id: "entreno", label: "Entrenamiento", mins: 15 },
  { id: "descanso", label: "Descanso", mins: 5 },
];

export const initialTimer = (): TimerState => ({
  modeId: "estudio",
  label: "Estudio",
  total: 25 * 60,
  left: 25 * 60,
  running: false,
  startedOnce: false,
});

export function fmtClock(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function PomodoroPanel({
  timer,
  onSelect,
  onToggle,
  onReset,
}: {
  timer: TimerState;
  onSelect: (id: string) => void;
  onToggle: () => void;
  onReset: () => void;
}) {
  const pct = timer.total ? 1 - timer.left / timer.total : 0;
  return (
    <Panel corners delay={120}>
      <div className="p-5">
        <SectionTitle numeral="·" title="Temporizador" right={<IconTimer className="w-4 h-4 text-gold/70" />} />

        <div className="grid grid-cols-2 gap-2 mb-5">
          {TIMER_MODES.map((m) => {
            const active = timer.modeId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m.id)}
                className={`px-3 py-2.5 border text-left transition-all duration-200 cursor-pointer ${
                  active
                    ? "border-gold/70 bg-gold/10 text-gold"
                    : "border-line bg-[#101013] text-bonedim hover:border-gold/40 hover:text-bone"
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.18em]">{m.label}</span>
                <span className="font-display text-lg leading-tight">{m.mins} min</span>
              </button>
            );
          })}
        </div>

        <div className="text-center py-4 relative">
          <div
            className={`font-display font-bold tabular-nums text-6xl tracking-wide ${
              timer.running ? "text-bone" : timer.left < timer.total ? "text-gold" : "text-bonedim"
            }`}
          >
            {fmtClock(timer.left)}
          </div>
          <div className="small-caps text-muted mt-2">{timer.label} · en curso</div>
          <div className="bar-track h-1 mt-4">
            <div className="bar-fill" style={{ width: `${pct * 100}%` }} />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button className="btn btn-wine flex-1" onClick={onToggle}>
            {timer.running ? <IconPause className="w-4 h-4" /> : <IconPlay className="w-4 h-4" />}
            {timer.running ? "Pausar" : timer.left < timer.total && timer.left > 0 ? "Reanudar" : "Iniciar"}
          </button>
          <button className="btn btn-ghost" onClick={onReset} title="Reiniciar">
            <IconRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Panel>
  );
}

/** Barra flotante visible en todas las pestañas cuando el tiempo corre. */
export function MiniTimer({
  timer,
  onToggle,
  onReset,
  onClose,
}: {
  timer: TimerState;
  onToggle: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const pct = timer.total ? 1 - timer.left / timer.total : 0;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 toast-in w-[calc(100%-2rem)] max-w-md">
      <div className="panel-flat backdrop-blur-md border-gold/30 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.9)] px-4 py-3 flex items-center gap-4">
        <div className="relative w-9 h-9 flex-none">
          <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#26262c" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={timer.running ? "#c8a96e" : "#8e2434"}
              strokeWidth="3"
              strokeDasharray={`${pct * 94.2} 94.2`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <IconTimer className="w-4 h-4 text-gold absolute inset-0 m-auto" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl leading-none tabular-nums text-bone">
            {fmtClock(timer.left)}
          </div>
          <div className="small-caps text-muted mt-1">{timer.label}</div>
        </div>
        <button
          className="btn btn-wine px-3! py-2!"
          onClick={onToggle}
          aria-label={timer.running ? "Pausar" : "Reanudar"}
        >
          {timer.running ? <IconPause className="w-4 h-4" /> : <IconPlay className="w-4 h-4" />}
        </button>
        <button
          className="text-muted hover:text-bone transition-colors cursor-pointer"
          onClick={onReset}
          aria-label="Reiniciar temporizador"
        >
          <IconRefresh className="w-4 h-4" />
        </button>
        <button
          className="text-muted hover:text-bone transition-colors cursor-pointer"
          onClick={onClose}
          aria-label="Cerrar temporizador"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
