import { useState } from "react";
import { DIFFICULTIES, PHASES, SUBJECTS, phaseOf } from "../data";
import type { DayRecord, ProtocolState, QuestionRec } from "../state";
import { requiredQuestions } from "../state";
import {
  Bar,
  FieldLabel,
  IconTarget,
  IconTrash,
  Panel,
  SectionTitle,
} from "../components/ui";

export interface PruebasProps {
  state: ProtocolState;
  effDay: number;
  record?: DayRecord;
  onAddQuestion: (day: number, q: QuestionRec) => void;
  onDeleteQuestion: (day: number, id: string) => void;
}

const DIFF_STYLE: Record<string, string> = {
  "Fácil": "text-gold border-gold/40 bg-gold/10",
  "Media": "text-bonedim border-line bg-raise",
  "Difícil": "text-winebright border-winebright/45 bg-winedeep/50",
};

export default function Pruebas({ state, effDay, record, onAddQuestion, onDeleteQuestion }: PruebasProps) {
  const phase = phaseOf(effDay);
  const req = requiredQuestions(state, effDay);
  const solved = record?.questions.length ?? 0;

  const [materia, setMateria] = useState<string>(SUBJECTS[0]);
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [explicacion, setExplicacion] = useState("");
  const [dificultad, setDificultad] = useState<string>("Media");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!pregunta.trim()) return setError("Escribe la pregunta resuelta.");
    if (!respuesta.trim()) return setError("Anota la respuesta correcta.");
    setError(null);
    onAddQuestion(effDay, {
      id: `q-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      materia,
      pregunta: pregunta.trim(),
      respuesta: respuesta.trim(),
      explicacion: explicacion.trim(),
      dificultad,
      ts: Date.now(),
    });
    setPregunta("");
    setRespuesta("");
    setExplicacion("");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.35fr] gap-5 items-start">
      <div className="space-y-5">
        <Panel corners delay={0} className="p-6">
          <SectionTitle numeral="I." title="Orden de la fase" right={<IconTarget className="w-4 h-4 text-gold/70" />} />
          <div className="flex flex-wrap gap-2 mb-4">
            {PHASES.map((p) => (
              <span
                key={p.n}
                className={`text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border ${
                  p.n === phase.n
                    ? "text-bone border-winebright/60 bg-winedeep/60"
                    : "text-muted border-linesoft"
                }`}
              >
                Fase {p.numeral}
              </span>
            ))}
          </div>
          <p className="font-display text-bone font-semibold text-lg">{phase.name}</p>
          <p className="text-[13.5px] text-bonedim mt-2 leading-relaxed">{phase.directive}</p>

          <div className="mt-5">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="small-caps text-muted">
                {req > 0 ? "Preguntas de hoy" : "Lectura ligera"}
              </span>
              {req > 0 && (
                <span className={`font-display text-lg tabular-nums ${solved >= req ? "text-gold" : "text-bone"}`}>
                  {Math.min(solved, req)}/{req}
                </span>
              )}
            </div>
            {req > 0 ? (
              <Bar value={solved / req} className="h-2" />
            ) : (
              <p className="font-quote italic text-gold/90 text-[15px]">
                10 minutos de lectura de un tema básico. Sin presión: la base se construye en calma.
              </p>
            )}
            {req > 0 && solved >= req && (
              <p className="text-[12px] text-gold mt-2">Meta cumplida. Toda pregunta extra es ventaja.</p>
            )}
          </div>
        </Panel>

        {solved > 0 && (
          <Panel delay={120} className="p-6">
            <SectionTitle numeral="II." title={`Resueltas · Día ${effDay}`} />
            <ol className="space-y-4">
              {record!.questions.map((q, i) => (
                <li key={q.id} className="border-b border-linesoft pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="font-display text-gold/70 tabular-nums text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-bonedim border border-line px-2 py-0.5">
                      {q.materia}
                    </span>
                    <span className={`text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 border ${DIFF_STYLE[q.dificultad] ?? DIFF_STYLE.Media}`}>
                      {q.dificultad}
                    </span>
                    <button
                      className="ml-auto text-muted hover:text-winebright transition-colors cursor-pointer"
                      onClick={() => onDeleteQuestion(effDay, q.id)}
                      aria-label="Eliminar pregunta"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[14px] text-bone leading-snug">{q.pregunta}</p>
                  <p className="text-[13px] mt-1.5">
                    <span className="text-gold">Respuesta:</span>{" "}
                    <span className="text-bonedim">{q.respuesta}</span>
                  </p>
                  {q.explicacion && (
                    <p className="text-[12.5px] text-muted italic font-quote text-[14px] mt-1">
                      {q.explicacion}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </Panel>
        )}
      </div>

      <Panel corners delay={80} className="p-6">
        <SectionTitle numeral="III." title="Registrar pregunta" />
        {phase.n === 1 && (
          <p className="text-[12.5px] text-muted -mt-2 mb-4">
            En la Fase I el registro es opcional: úsalo si una lectura te dejó una pregunta digna.
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Materia</FieldLabel>
            <select className="field" value={materia} onChange={(e) => setMateria(e.target.value)}>
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Dificultad</FieldLabel>
            <select className="field" value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
              {DIFFICULTIES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Pregunta resuelta</FieldLabel>
            <textarea
              className="field min-h-[74px] resize-y"
              placeholder="Copia o resume la pregunta…"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Respuesta correcta</FieldLabel>
            <input
              className="field"
              placeholder="La respuesta que el examen espera…"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Explicación breve</FieldLabel>
            <textarea
              className="field min-h-[60px] resize-y"
              placeholder="¿Por qué es correcta? Explícalo como a un aliado…"
              value={explicacion}
              onChange={(e) => setExplicacion(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-[12.5px] text-winebright mt-3">{error}</p>}
        <button className="btn btn-wine w-full mt-5" onClick={submit}>
          Registrar en el dossier
        </button>
      </Panel>
    </div>
  );
}
