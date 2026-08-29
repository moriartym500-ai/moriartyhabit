import { PHYS_CHECKS, PHYS_REMINDER, WEEK_WORKOUT, WEEKDAYS_ES } from "../data";
import type { DayRecord, ProtocolState } from "../state";
import { dayDate } from "../state";
import { Bar, Panel, SectionTitle, Switch } from "../components/ui";

const KIND_COLOR: Record<string, string> = {
  fuerza: "bg-winebright",
  postura: "bg-gold",
  descanso: "bg-muted",
};

export interface FisicoProps {
  state: ProtocolState;
  effDay: number;
  infoDay: number;
  record?: DayRecord;
  onPhysToggle: (day: number, id: string) => void;
}

export default function Fisico({ state, effDay, infoDay, record, onPhysToggle }: FisicoProps) {
  const date = dayDate(state, effDay);
  const wd = date.getDay();
  const workout = WEEK_WORKOUT[wd];
  const answered = PHYS_CHECKS.filter((c) => record?.fisico[c.id] !== undefined).length;
  const ok = PHYS_CHECKS.filter((c) => record?.fisico[c.id] === true).length;

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5 items-start">
      <div className="space-y-5">
        <Panel corners delay={0} className="p-6">
          <SectionTitle
            numeral="I."
            title="Registro físico del día"
            right={
              <span className="text-[11px] tabular-nums text-muted">
                {ok}/{PHYS_CHECKS.length} en orden
              </span>
            }
          />
          <ul>
            {PHYS_CHECKS.map((c) => {
              const v = record?.fisico[c.id];
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-4 border-b border-linesoft last:border-b-0 py-3.5"
                >
                  <span
                    className={`text-[14.5px] ${
                      v === true ? "text-bone" : v === false ? "text-muted" : "text-bonedim"
                    }`}
                  >
                    {c.label}
                  </span>
                  <Switch on={v === true} onToggle={() => onPhysToggle(effDay, c.id)} />
                </li>
              );
            })}
          </ul>
          <div className="mt-5">
            <div className="flex justify-between mb-1.5">
              <span className="small-caps text-muted">Registro del día</span>
              <span className="text-[11px] tabular-nums text-muted">{answered}/5 respondido</span>
            </div>
            <Bar value={answered / 5} className="h-1.5" />
          </div>
        </Panel>

        <div className="panel rise border-l-2 border-l-winebright! p-5" style={{ animationDelay: "90ms" }}>
          <p className="small-caps text-winebright mb-2">Directriz del estratega</p>
          <p className="font-quote italic text-bone text-lg leading-relaxed">"{PHYS_REMINDER}"</p>
        </div>

        <Panel delay={150} className="p-5">
          <SectionTitle numeral="II." title="Semana de entrenamiento" />
          <div className="grid grid-cols-7 gap-1.5">
            {["L", "M", "X", "J", "V", "S", "D"].map((l, i) => {
              const realWd = (i + 1) % 7; // 1=lunes … 0=domingo
              const w = WEEK_WORKOUT[realWd];
              const isSel = realWd === wd;
              return (
                <div
                  key={l}
                  className={`text-center py-2.5 border transition-all ${
                    isSel ? "border-gold bg-gold/10" : "border-linesoft"
                  }`}
                  title={`${WEEKDAYS_ES[realWd]}: ${w.title}`}
                >
                  <span className={`block text-[11px] ${isSel ? "text-gold" : "text-muted"}`}>{l}</span>
                  <span className={`block w-1.5 h-1.5 mx-auto mt-1.5 ${KIND_COLOR[w.kind]}`} />
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[11px] text-muted">
            <span className="flex items-center gap-1.5"><i className="w-1.5 h-1.5 bg-winebright inline-block" /> Fuerza</span>
            <span className="flex items-center gap-1.5"><i className="w-1.5 h-1.5 bg-gold inline-block" /> Postura</span>
            <span className="flex items-center gap-1.5"><i className="w-1.5 h-1.5 bg-muted inline-block" /> Descanso activo</span>
          </div>
        </Panel>
      </div>

      <Panel corners delay={100} className="p-6">
        <SectionTitle numeral="III." title={`Rutina · ${workout.title}`} />
        <div className="flex flex-wrap items-center gap-2 -mt-2 mb-4">
          <span className="small-caps text-muted">{WEEKDAYS_ES[wd]} · Día {effDay} del protocolo</span>
          <span
            className={`text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border ${
              workout.kind === "fuerza"
                ? "text-winebright border-winebright/50 bg-winedeep/50"
                : workout.kind === "postura"
                ? "text-gold border-gold/40 bg-gold/10"
                : "text-bonedim border-line"
            }`}
          >
            {workout.kind === "descanso" ? "Descanso activo" : workout.kind}
          </span>
        </div>
        <p className="font-quote italic text-bonedim text-[15px] mb-5">{workout.focus}</p>
        <ul className="space-y-3">
          {workout.exercises.map((e, i) => (
            <li key={e.name} className="flex items-baseline gap-3 border-b border-linesoft pb-3 last:border-b-0">
              <span className="font-display text-gold/70 text-sm w-5 flex-none tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[14.5px] text-bone flex-1">{e.name}</span>
              <span className="text-[12px] text-muted whitespace-nowrap">{e.sets}</span>
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-muted mt-5 leading-relaxed">
          Consejo: termina siempre con 30 segundos de postura erguida frente al espejo. El cuerpo
          memoriza lo que repites al final.
        </p>
      </Panel>
    </div>
  );
}
