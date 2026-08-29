import { useState, type ReactNode } from "react";
import {
  DAY_BRIEFS,
  PHASES,
  TASKS,
  TASK_GROUPS,
  WEEK_WORKOUT,
  WEEKDAYS_ES,
  phaseOf,
  quoteOfDay,
} from "../data";
import type { CurrentInfo, DayRecord, ProtocolState } from "../state";
import {
  completedDayList,
  dayDate,
  dayProgress,
  fmtLong,
  requiredQuestions,
  streakInfo,
  toISO,
} from "../state";
import {
  Bar,
  CheckBox,
  Corners,
  IconCalendar,
  IconChevronL,
  IconChevronR,
  IconFlame,
  Panel,
  SectionTitle,
} from "../components/ui";

function Seal({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <circle cx="60" cy="60" r="56" stroke="#c8a96e" strokeOpacity="0.55" />
      <circle cx="60" cy="60" r="47" stroke="#c8a96e" strokeOpacity="0.22" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 24;
        const x1 = 60 + Math.cos(a) * 51;
        const y1 = 60 + Math.sin(a) * 51;
        const x2 = 60 + Math.cos(a) * 54;
        const y2 = 60 + Math.sin(a) * 54;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c8a96e" strokeOpacity="0.35" />;
      })}
      <text
        x="60"
        y="73"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontWeight="700"
        fontSize="42"
        fill="#c8a96e"
        className="seal-glow"
      >
        M
      </text>
      <text
        x="60"
        y="93"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="11"
        letterSpacing="6"
        fill="#c8a96e"
        fillOpacity="0.7"
      >
        XXX
      </text>
    </svg>
  );
}

export interface HoyProps {
  state: ProtocolState;
  info: CurrentInfo;
  effDay: number;
  record?: DayRecord;
  onToggleTask: (day: number, id: string) => void;
  onStart: (date: string) => void;
  onChangeStart: (date: string) => void;
  onGotoTab: (id: string) => void;
  onSelectDay: (day: number) => void;
  timerSlot: ReactNode;
}

export default function Hoy({
  state,
  info,
  effDay,
  record,
  onToggleTask,
  onStart,
  onChangeStart,
  onGotoTab,
  onSelectDay,
  timerSlot,
}: HoyProps) {
  const [pickDate, setPickDate] = useState(toISO(new Date()));

  /* ---------- Protocolo sin iniciar: dossier de briefing ---------- */
  if (info.status === "idle") {
    return (
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
        <Panel corners className="p-7 sm:p-10">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <Seal />
            <div>
              <p className="small-caps text-gold/80 mb-3">Dossier Nº 30 · Confidencial</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-bone leading-tight">
                El tablero está
                <br />
                dispuesto.
              </h2>
              <p className="font-quote italic text-bonedim text-lg mt-4 leading-relaxed">
                Treinta días. Tres operaciones. Un solo objetivo: convertir la disciplina en
                elegancia y el estudio en estrategia. Nadie sabrá que existe este plan — hasta que
                vean el resultado.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-9">
            {PHASES.map((p, i) => (
              <div key={p.n} className="panel-flat p-4 rise" style={{ animationDelay: `${150 + i * 110}ms` }}>
                <div className="font-display text-gold text-xs tracking-[0.25em]">FASE {p.numeral}</div>
                <div className="font-display text-bone font-semibold mt-1">{p.name}</div>
                <div className="small-caps text-muted mt-1.5">Días {p.from} – {p.to}</div>
                <p className="text-[13px] text-bonedim mt-2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel corners className="p-7 self-start">
          <SectionTitle numeral="I." title="Iniciar el protocolo" />
          <label className="small-caps text-bonedim block mb-1.5" htmlFor="start-date">
            Fecha de inicio
          </label>
          <div className="relative">
            <input
              id="start-date"
              type="date"
              className="field pr-10!"
              value={pickDate}
              onChange={(e) => setPickDate(e.target.value)}
            />
            <IconCalendar className="w-4 h-4 text-gold/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="btn btn-wine w-full mt-4" onClick={() => onStart(pickDate)}>
            Iniciar Protocolo
          </button>
          <p className="text-[12.5px] text-muted leading-relaxed mt-4">
            Sin cuentas. Sin servidores. Tu progreso vive únicamente en este dispositivo y se
            guarda con cada movimiento.
          </p>
          <div className="border-t border-linesoft mt-5 pt-5">
            <div className="small-caps text-muted mb-3">Reglas del juego</div>
            <ul className="space-y-2 text-[13px] text-bonedim">
              {[
                "Las 16 tareas del día definen la jugada: todas completadas, día ganado.",
                "El entrenamiento cambia según el día real de la semana.",
                "Las pruebas nacionales se intensifican en cada fase.",
                "Reiniciar borra el tablero completo. Exporta antes si dudas.",
              ].map((r) => (
                <li key={r} className="flex gap-2.5">
                  <span className="text-gold mt-0.5">◆</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>
    );
  }

  /* ---------- Protocolo futuro: cuenta regresiva ---------- */
  if (info.status === "upcoming") {
    return (
      <Panel corners className="p-8 sm:p-12 max-w-2xl mx-auto text-center">
        <Seal className="w-24 h-24 mx-auto" />
        <p className="small-caps text-gold/80 mt-6">El protocolo comienza en</p>
        <div className="font-display text-7xl font-bold text-bone my-3">{info.startsIn}</div>
        <p className="small-caps text-muted">
          {info.startsIn === 1 ? "día" : "días"} · inicio: {fmtLong(dayDate(state, 1))}
        </p>
        <p className="font-quote italic text-bonedim text-lg mt-5">
          "Un caballero no improvisa: prepara." Aprovecha la espera para dejar listo tu escritorio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button className="btn btn-wine" onClick={() => onStart(toISO(new Date()))}>
            Adelantar inicio a hoy
          </button>
          <input
            type="date"
            className="field sm:w-48 text-center"
            value={pickDate}
            onChange={(e) => setPickDate(e.target.value)}
          />
          <button className="btn btn-gold" onClick={() => onChangeStart(pickDate)}>
            Guardar fecha
          </button>
        </div>
      </Panel>
    );
  }

  /* ---------- Protocolo activo ---------- */
  const phase = phaseOf(effDay);
  const pct = dayProgress(record);
  const doneTasks = record?.tasks.length ?? 0;
  const date = dayDate(state, effDay);
  const weekday = WEEKDAYS_ES[date.getDay()];
  const workout = WEEK_WORKOUT[date.getDay()];
  const reqQ = requiredQuestions(state, effDay);
  const solvedQ = record?.questions.length ?? 0;
  const streak = streakInfo(state, info.day).current;
  const done = completedDayList(state).length;
  const reviewing = effDay !== info.day;
  const isToday = !reviewing;
  const complete = pct >= 1;

  return (
    <div className="space-y-5">
      {/* Cabecera del día */}
      <Panel corners delay={0} className="p-6 sm:p-8 overflow-hidden">
        <div
          className="absolute inset-y-0 right-0 w-1/2 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              "conic-gradient(#c8a96e 0 25%, transparent 0 50%, #c8a96e 0 75%, transparent 0)",
            backgroundSize: "34px 34px",
            maskImage: "linear-gradient(90deg, transparent, black)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, black)",
          }}
        />
        <div className="relative flex flex-wrap items-end gap-x-8 gap-y-4">
          <div>
            <p className="small-caps text-gold/80">Día del protocolo</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-6xl sm:text-7xl text-bone leading-none tabular-nums">
                {String(effDay).padStart(2, "0")}
              </span>
              <span className="font-display text-xl text-muted">/ 30</span>
            </div>
          </div>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 border border-winebright/50 bg-winedeep/60 text-[11px] uppercase tracking-[0.22em] px-3 py-1.5 text-bone">
              Fase {phase.numeral} · {phase.name}
            </span>
            <p className="text-bonedim text-sm mt-2 capitalize">
              {weekday} · {date.toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
            </p>
            <p className="font-quote italic text-gold text-lg mt-1">
              {DAY_BRIEFS[effDay - 1]}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-center panel-flat px-4 py-3">
              <IconFlame className={`w-5 h-5 mx-auto ${streak > 0 ? "text-winebright" : "text-muted"}`} />
              <div className="font-display text-2xl text-bone leading-none mt-1">{streak}</div>
              <div className="small-caps text-muted mt-1">Racha</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                className="btn btn-ghost px-2.5! py-1.5!"
                disabled={effDay <= 1}
                onClick={() => onSelectDay(effDay - 1)}
                style={{ opacity: effDay <= 1 ? 0.35 : 1 }}
              >
                <IconChevronL className="w-4 h-4" /> Día anterior
              </button>
              {isToday ? (
                <button
                  className="btn btn-ghost px-2.5! py-1.5!"
                  disabled={effDay >= info.day}
                  onClick={() => onSelectDay(effDay + 1)}
                  style={{ opacity: effDay >= info.day ? 0.35 : 1 }}
                >
                  Día siguiente <IconChevronR className="w-4 h-4" />
                </button>
              ) : (
                <button className="btn btn-gold px-2.5! py-1.5!" onClick={() => onSelectDay(info.day)}>
                  Volver a hoy
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative grid sm:grid-cols-2 gap-6 mt-7">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="small-caps text-muted">Jornada de hoy</span>
              <span className={`font-display text-lg ${complete ? "text-gold" : "text-bone"}`}>
                {Math.round(pct * 100)}%
              </span>
            </div>
            <Bar value={pct} className="h-2.5" />
            <p className="text-[12.5px] text-muted mt-2">
              {doneTasks} de {TASKS.length} movimientos ejecutados
              {complete ? " · día ganado" : ""}
            </p>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="small-caps text-muted">Protocolo completo</span>
              <span className="font-display text-lg text-bone">{done}/30 días</span>
            </div>
            <Bar value={done / 30} className="h-2.5" />
            <p className="font-quote italic text-bonedim text-[15px] mt-2">
              "{quoteOfDay(effDay)}"
            </p>
          </div>
        </div>
      </Panel>

      {reviewing && (
        <div className="panel-flat border-gold/30 px-4 py-3 flex items-center gap-3 text-sm text-gold fadein">
          <IconCalendar className="w-4 h-4" />
          Estás revisando el día {effDay}. Los cambios se guardan en ese día.
        </div>
      )}

      <div className="grid lg:grid-cols-[1.55fr_1fr] gap-5 items-start">
        {/* Tareas */}
        <Panel corners delay={80} className="p-6">
          <SectionTitle
            numeral="II."
            title="Movimientos del día"
            right={
              complete ? (
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold border border-gold/40 px-2.5 py-1 bg-gold/10">
                  Día ganado
                </span>
              ) : undefined
            }
          />
          <div className="space-y-6">
            {TASK_GROUPS.map((g) => {
              const groupTasks = TASKS.filter((t) => t.group === g.id);
              const gDone = groupTasks.filter((t) => record?.tasks.includes(t.id)).length;
              return (
                <div key={g.id}>
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="small-caps text-gold/90">{g.label}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">{g.time}</span>
                    <span className="h-px flex-1 bg-linesoft" />
                    <span className="text-[11px] tabular-nums text-muted">
                      {gDone}/{groupTasks.length}
                    </span>
                  </div>
                  <ul className="border-t border-linesoft">
                    {groupTasks.map((t) => {
                      const on = !!record?.tasks.includes(t.id);
                      return (
                        <li key={t.id} className="border-b border-linesoft last:border-b-0">
                          <button
                            onClick={() => onToggleTask(effDay, t.id)}
                            className={`task-row w-full text-left flex items-start gap-3.5 px-3 py-3 cursor-pointer ${
                              on ? "opacity-60" : ""
                            }`}
                          >
                            <span className="mt-0.5">
                              <CheckBox on={on} />
                            </span>
                            <span className="min-w-0">
                              <span
                                className={`block text-[14.5px] leading-snug ${
                                  on ? "line-through text-muted" : "text-bone"
                                }`}
                              >
                                {t.label}
                              </span>
                              {t.hint && !on && (
                                <span className="block text-[12px] text-muted mt-0.5 italic font-quote text-[13.5px]">
                                  {t.hint}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Columna lateral */}
        <div className="space-y-5">
          <Panel delay={140} className="p-5">
            <SectionTitle numeral="III." title={`Entrenamiento · ${workout.title}`} />
            <p className="small-caps text-muted -mt-3 mb-3">{weekday} · {workout.days}</p>
            <ul className="space-y-1.5 mb-4">
              {workout.exercises.slice(0, 3).map((e) => (
                <li key={e.name} className="flex justify-between gap-3 text-[13px] text-bonedim border-b border-linesoft pb-1.5">
                  <span>{e.name}</span>
                  <span className="text-muted whitespace-nowrap">{e.sets}</span>
                </li>
              ))}
              {workout.exercises.length > 3 && (
                <li className="text-[12px] text-muted">+ {workout.exercises.length - 3} más…</li>
              )}
            </ul>
            <button className="btn btn-ghost w-full" onClick={() => onGotoTab("fisico")}>
              Ver rutina completa
            </button>
          </Panel>

          <Panel delay={200} className="p-5">
            <SectionTitle numeral="IV." title="Pruebas nacionales" />
            <p className="text-[13px] text-bonedim mb-3 leading-relaxed">{phase.directive}</p>
            {reqQ > 0 ? (
              <>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="small-caps text-muted">Meta de hoy</span>
                  <span className={`font-display ${solvedQ >= reqQ ? "text-gold" : "text-bone"}`}>
                    {Math.min(solvedQ, reqQ)}/{reqQ}
                  </span>
                </div>
                <Bar value={reqQ ? solvedQ / reqQ : 0} className="h-1.5 mb-4" />
              </>
            ) : (
              <p className="font-quote italic text-gold/90 text-[15px] mb-4">
                Fase de lectura: 10 minutos ligeros bastan por hoy.
              </p>
            )}
            <button className="btn btn-ghost w-full" onClick={() => onGotoTab("pruebas")}>
              {reqQ > 0 ? "Registrar preguntas" : "Registrar lectura"}
            </button>
          </Panel>

          {timerSlot}
        </div>
      </div>
    </div>
  );
}
