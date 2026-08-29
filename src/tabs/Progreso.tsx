import { useRef, useState } from "react";
import { MILESTONES, PHASES } from "../data";
import type { CurrentInfo, ProtocolState } from "../state";
import { computeStats, dayDate, isDayComplete, toISO } from "../state";
import {
  Bar,
  IconBoard,
  IconCalendar,
  IconDownload,
  IconFlame,
  IconRefresh,
  IconUpload,
  Panel,
  SectionTitle,
  Stat,
} from "../components/ui";

export interface ProgresoProps {
  state: ProtocolState;
  info: CurrentInfo;
  onSelectDay: (day: number) => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  onAskReset: () => void;
  onChangeStart: (date: string) => void;
}

export default function Progreso({
  state,
  info,
  onSelectDay,
  onExport,
  onImportFile,
  onAskReset,
  onChangeStart,
}: ProgresoProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [datePick, setDatePick] = useState(state.startDate ?? toISO(new Date()));
  const stats = computeStats(state, info.day);
  const overall = stats.daysDone / 30;

  return (
    <div className="space-y-5">
      {/* Panorama general */}
      <Panel corners delay={0} className="p-6 sm:p-8">
        <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
          <div>
            <p className="small-caps text-gold/80">Estado del protocolo</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-bold text-7xl text-bone tabular-nums leading-none">
                {Math.round(overall * 100)}
              </span>
              <span className="font-display text-2xl text-muted">% completo</span>
            </div>
          </div>
          <div className="flex-1 min-w-[240px]">
            <Bar value={overall} className="h-3" />
            <div className="flex justify-between text-[11px] text-muted mt-2 uppercase tracking-[0.18em]">
              <span>{stats.daysDone} de 30 días ganados</span>
              <span>Día actual: {info.day}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center panel-flat px-5 py-3">
              <IconFlame className={`w-5 h-5 mx-auto ${stats.streak > 0 ? "text-winebright" : "text-muted"}`} />
              <div className="font-display text-2xl text-bone mt-1">{stats.streak}</div>
              <div className="small-caps text-muted mt-0.5">Racha</div>
            </div>
            <div className="text-center panel-flat px-5 py-3">
              <IconBoard className="w-5 h-5 mx-auto text-gold" />
              <div className="font-display text-2xl text-bone mt-1">{stats.bestStreak}</div>
              <div className="small-caps text-muted mt-0.5">Récord</div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
        <div className="space-y-5">
          {/* El tablero */}
          <Panel corners delay={80} className="p-6">
            <SectionTitle numeral="I." title="El tablero · 30 jugadas" />
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
                const complete = isDayComplete(state.days[d]);
                const isCurrent = d === info.day && info.status !== "complete";
                const future = d > info.day;
                const phase = PHASES.find((p) => d >= p.from && d <= p.to)!;
                return (
                  <button
                    key={d}
                    onClick={() => !future && onSelectDay(d)}
                    disabled={future}
                    title={`Día ${d} · ${phase.name}${future ? " · aún no jugado" : ""}`}
                    className={`day-cell aspect-square border flex flex-col items-center justify-center relative ${
                      complete
                        ? "bg-gradient-to-b from-wine to-winedeep border-gold/50 text-bone"
                        : isCurrent
                        ? "border-gold text-gold ring-pulse bg-gold/5"
                        : future
                        ? "border-linesoft text-muted/40 cursor-not-allowed"
                        : "border-line text-bonedim hover:text-bone"
                    }`}
                  >
                    <span className="font-display text-[13px] sm:text-sm tabular-nums">{d}</span>
                    {complete && <span className="w-1 h-1 bg-gold mt-0.5" />}
                    {isCurrent && !complete && (
                      <span className="text-[7px] uppercase tracking-[0.2em] text-gold">hoy</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 inline-block bg-gradient-to-b from-wine to-winedeep border border-gold/50" /> Ganado
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 inline-block border border-gold bg-gold/10" /> En juego
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 inline-block border border-linesoft opacity-50" /> Pendiente
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              {PHASES.map((p) => {
                const inPhase = Array.from({ length: p.to - p.from + 1 }, (_, i) => p.from + i);
                const done = inPhase.filter((d) => isDayComplete(state.days[d])).length;
                const activePhase = info.day >= p.from && info.day <= p.to && info.status !== "complete";
                return (
                  <div
                    key={p.n}
                    className={`panel-flat p-4 ${activePhase ? "border-gold/40!" : ""}`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-xs text-gold/80 tracking-[0.2em]">
                        FASE {p.numeral}
                      </span>
                      <span className="text-[11px] tabular-nums text-muted">{done}/10</span>
                    </div>
                    <div className="font-display text-bone text-[13.5px] font-semibold mt-1">{p.name}</div>
                    <div className="mt-2.5">
                      <Bar value={done / 10} className="h-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Estadísticas */}
          <Panel delay={140} className="p-6">
            <SectionTitle numeral="II." title="Números del plan" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="Tareas ejecutadas" value={stats.totalTasks} />
              <Stat label="Ilustraciones" value={stats.illustrations} accent />
              <Stat label="Comprensión media" value={stats.avgComprension ? `${stats.avgComprension}/10` : "—"} />
              <Stat label="Preguntas resueltas" value={stats.questions} accent />
              <Stat label="Días físicos al 100%" value={`${stats.fisicoPct}%`} />
              <Stat label="Puntos de estilo" value={stats.estiloPoints} />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          {/* Hitos */}
          <Panel corners delay={100} className="p-6">
            <SectionTitle numeral="III." title="Condecoraciones" />
            <ul className="space-y-3">
              {MILESTONES.map((m) => {
                const earned = stats.daysDone >= m.at;
                return (
                  <li
                    key={m.at}
                    className={`flex items-start gap-3.5 border p-3.5 transition-all ${
                      earned ? "border-gold/40 bg-gold/5" : "border-linesoft opacity-70"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 flex-none grid place-items-center border font-display text-sm ${
                        earned ? "border-gold text-gold bg-gold/10" : "border-line text-muted"
                      }`}
                    >
                      {m.at}
                    </span>
                    <span>
                      <span className={`block text-[13.5px] font-medium ${earned ? "text-bone" : "text-bonedim"}`}>
                        {m.title}
                      </span>
                      <span className="block font-quote italic text-[13.5px] text-muted mt-0.5">
                        {earned ? m.msg : "Aún en el tablero por ganar."}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Datos */}
          <Panel delay={160} className="p-6">
            <SectionTitle numeral="IV." title="Gestión del dossier" />
            <div className="grid grid-cols-2 gap-2.5">
              <button className="btn btn-gold" onClick={onExport}>
                <IconDownload className="w-4 h-4" /> Exportar
              </button>
              <button className="btn btn-gold" onClick={() => fileRef.current?.click()}>
                <IconUpload className="w-4 h-4" /> Importar
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImportFile(f);
                  e.target.value = "";
                }}
              />
              <button className="btn btn-danger col-span-2" onClick={onAskReset}>
                <IconRefresh className="w-4 h-4" /> Reiniciar protocolo
              </button>
            </div>
            <div className="border-t border-linesoft mt-5 pt-5">
              <label className="small-caps text-bonedim block mb-1.5">Ajustar fecha de inicio</label>
              <div className="relative">
                <input
                  type="date"
                  className="field pr-10!"
                  value={datePick}
                  onChange={(e) => setDatePick(e.target.value)}
                />
                <IconCalendar className="w-4 h-4 text-gold/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button className="btn btn-ghost w-full mt-2.5" onClick={() => onChangeStart(datePick)}>
                Guardar fecha
              </button>
              <p className="text-[11.5px] text-muted mt-3 leading-relaxed">
                Mover la fecha reubica los días de la semana y el día actual del reto. Las jugadas
                ya registradas se conservan.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
