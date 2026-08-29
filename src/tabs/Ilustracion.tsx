import { useState } from "react";
import { ILL_IDEAS, ILL_TOOLS, ILL_TYPES, SUBJECTS } from "../data";
import type { DayRecord, IllRecord, ProtocolState } from "../state";
import {
  FieldLabel,
  IconNib,
  IconShuffle,
  Panel,
  SectionTitle,
  Switch,
} from "../components/ui";

export interface IlustracionProps {
  state: ProtocolState;
  effDay: number;
  record?: DayRecord;
  onSaveIll: (day: number, rec: IllRecord) => void;
}

const randIdea = () => Math.floor(Math.random() * ILL_IDEAS.length);

export default function Ilustracion({ state, effDay, record, onSaveIll }: IlustracionProps) {
  const prev = record?.illustration;
  const [ideaIdx, setIdeaIdx] = useState(randIdea);
  const [tema, setTema] = useState(prev?.tema ?? "");
  const [materia, setMateria] = useState(prev?.materia ?? SUBJECTS[0]);
  const [tipo, setTipo] = useState(prev?.tipo ?? ILL_TYPES[0]);
  const [herramienta, setHerramienta] = useState(prev?.herramienta ?? ILL_TOOLS[0]);
  const [comprension, setComprension] = useState(prev?.comprension ?? 5);
  const [explico, setExplico] = useState(prev?.explico ?? false);
  const [error, setError] = useState(false);

  const shuffle = () => setIdeaIdx((c) => {
    let n = c;
    while (n === c) n = randIdea();
    return n;
  });

  const save = () => {
    if (!tema.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onSaveIll(effDay, {
      tema: tema.trim(),
      materia,
      tipo,
      herramienta,
      comprension,
      explico,
      idea: ILL_IDEAS[ideaIdx],
      ts: Date.now(),
    });
  };

  const history: { day: number; rec: IllRecord }[] = [];
  for (let d = 30; d >= 1; d--) {
    const r = state.days[d]?.illustration;
    if (r) history.push({ day: d, rec: r });
    if (history.length >= 6) break;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.35fr] gap-5 items-start">
      <div className="space-y-5">
        <Panel corners delay={0} className="p-6">
          <SectionTitle numeral="I." title="Misión visual" right={<IconNib className="w-4 h-4 text-gold/70" />} />
          <p className="text-[13px] text-bonedim leading-relaxed mb-4">
            La ilustración lógica convierte el estudio en estrategia: lo que la mano dibuja, la
            memoria lo guarda. 45 minutos, un tema, una imagen que lo explique todo.
          </p>
          <div className="panel-flat p-5 border-gold/25" key={ideaIdx}>
            <p className="small-caps text-gold/80 mb-2.5">Idea para hoy · Día {effDay}</p>
            <p className="font-quote italic text-bone text-xl leading-snug fadein">
              {ILL_IDEAS[ideaIdx]}
            </p>
          </div>
          <button className="btn btn-gold w-full mt-4" onClick={shuffle}>
            <IconShuffle className="w-4 h-4" />
            Barajar otra idea
          </button>
        </Panel>

        {history.length > 0 && (
          <Panel delay={120} className="p-6">
            <SectionTitle numeral="II." title="Registro de ilustraciones" />
            <ul className="space-y-3">
              {history.map(({ day, rec }) => (
                <li key={day} className="flex items-center gap-3 border-b border-linesoft pb-3 last:border-b-0 last:pb-0">
                  <span className="font-display text-gold/70 tabular-nums text-sm w-14 flex-none">
                    Día {day}
                  </span>
                  <span className="text-[13.5px] text-bone truncate flex-1">{rec.tema}</span>
                  <span
                    className={`text-[11px] tabular-nums px-2 py-0.5 border flex-none ${
                      rec.comprension >= 7
                        ? "text-gold border-gold/40 bg-gold/10"
                        : rec.comprension >= 4
                        ? "text-bonedim border-line"
                        : "text-winebright border-winebright/40"
                    }`}
                  >
                    {rec.comprension}/10
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>

      <Panel corners delay={80} className="p-6">
        <SectionTitle
          numeral="III."
          title="Bitácora de la sesión"
          right={
            prev ? (
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold border border-gold/40 px-2.5 py-1 bg-gold/10">
                Guardado
              </span>
            ) : undefined
          }
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FieldLabel>Tema estudiado</FieldLabel>
            <input
              className={`field ${error && !tema.trim() ? "border-winebright!" : ""}`}
              placeholder="Ej. La Revolución Francesa, fracciones, la célula…"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
            />
            {error && !tema.trim() && (
              <p className="text-[12px] text-winebright mt-1.5">El estratega siempre nombra su objetivo.</p>
            )}
          </div>
          <div>
            <FieldLabel>Materia</FieldLabel>
            <select className="field" value={materia} onChange={(e) => setMateria(e.target.value)}>
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Tipo de ilustración</FieldLabel>
            <select className="field" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {ILL_TYPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Herramienta</FieldLabel>
            <select className="field" value={herramienta} onChange={(e) => setHerramienta(e.target.value)}>
              {ILL_TOOLS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Comprensión del tema</FieldLabel>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={10}
                value={comprension}
                onChange={(e) => setComprension(Number(e.target.value))}
                className="flex-1"
              />
              <span className="font-display text-3xl text-gold w-12 text-right tabular-nums">
                {comprension}
              </span>
            </div>
            <p className="text-[11.5px] text-muted mt-1">1 = niebla total · 10 = podrías enseñarlo</p>
          </div>
          <div className="flex items-end justify-between pb-1.5">
            <FieldLabel>¿Pudiste explicarlo a otra persona?</FieldLabel>
            <Switch on={explico} onToggle={() => setExplico((v) => !v)} />
          </div>
        </div>
        <button className="btn btn-wine w-full mt-6" onClick={save}>
          {prev ? "Actualizar registro" : "Guardar registro"}
        </button>
        <p className="text-[12px] text-muted mt-3 leading-relaxed">
          Meta del protocolo: que cada tema importante exista dos veces — en el cuaderno y en tu
          mano.
        </p>
      </Panel>
    </div>
  );
}
