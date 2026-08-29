import { useState } from "react";
import { STYLE_CHECKS, STYLE_TIPS } from "../data";
import type { DayRecord } from "../state";
import { Bar, CheckBox, IconCrown, IconShuffle, Panel, SectionTitle } from "../components/ui";

export interface EstiloProps {
  effDay: number;
  record?: DayRecord;
  onEstiloToggle: (day: number, id: string) => void;
}

export default function Estilo({ effDay, record, onEstiloToggle }: EstiloProps) {
  const [tipIdx, setTipIdx] = useState(() => Math.floor(Math.random() * STYLE_TIPS.length));
  const [spin, setSpin] = useState(0);
  const points = record?.estilo.length ?? 0;

  const shuffle = () => {
    setTipIdx((cur) => {
      let n = cur;
      while (n === cur) n = Math.floor(Math.random() * STYLE_TIPS.length);
      return n;
    });
    setSpin((s) => s + 1);
  };

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5 items-start">
      <Panel corners delay={0} className="p-6">
        <SectionTitle
          numeral="I."
          title="Estilo del caballero"
          right={
            <span className={`text-[11px] tabular-nums ${points === STYLE_CHECKS.length ? "text-gold" : "text-muted"}`}>
              {points}/{STYLE_CHECKS.length}
            </span>
          }
        />
        <p className="font-quote italic text-bonedim text-[15px] -mt-2 mb-4">
          Día {effDay} — la elegancia se entrena igual que la mente.
        </p>
        <ul>
          {STYLE_CHECKS.map((c) => {
            const on = !!record?.estilo.includes(c.id);
            return (
              <li key={c.id} className="border-b border-linesoft last:border-b-0">
                <button
                  onClick={() => onEstiloToggle(effDay, c.id)}
                  className={`task-row w-full flex items-center gap-3.5 px-3 py-3.5 text-left cursor-pointer ${
                    on ? "opacity-60" : ""
                  }`}
                >
                  <CheckBox on={on} />
                  <span className={`text-[14.5px] ${on ? "line-through text-muted" : "text-bone"}`}>
                    {c.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-5">
          <div className="flex justify-between mb-1.5">
            <span className="small-caps text-muted">Presencia del día</span>
            <span className="font-display text-gold">{Math.round((points / STYLE_CHECKS.length) * 100)}%</span>
          </div>
          <Bar value={points / STYLE_CHECKS.length} className="h-1.5" />
        </div>
      </Panel>

      <div className="space-y-5">
        <Panel corners delay={100} className="p-6">
          <SectionTitle numeral="II." title="Consejo del día" right={<IconCrown className="w-4 h-4 text-gold/70" />} />
          <div key={spin} className="fadein text-center py-5">
            <p className="font-quote italic text-bone text-2xl leading-snug">
              "{STYLE_TIPS[tipIdx]}"
            </p>
          </div>
          <button className="btn btn-gold w-full" onClick={shuffle}>
            <IconShuffle className="w-4 h-4" />
            Otro consejo
          </button>
        </Panel>

        <Panel delay={160} className="p-6">
          <SectionTitle numeral="III." title="Código breve" />
          <ol className="space-y-2.5">
            {[
              "Entra a cada lugar como si ya hubieras ganado la partida.",
              "El orden externo sostiene el orden interno.",
              "Una palabra precisa vale más que diez rápidas.",
              "Lo que preparas en silencio, se nota en público.",
            ].map((c, i) => (
              <li key={c} className="flex gap-3 text-[13.5px] text-bonedim">
                <span className="font-display text-gold/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}
