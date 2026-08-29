import type { DayRecord, NotesRec } from "../state";
import { IconQuill, Panel, SectionTitle } from "../components/ui";

export interface NotasProps {
  effDay: number;
  record?: DayRecord;
  onNotes: (day: number, key: keyof NotesRec, value: string) => void;
}

const AREAS: { key: keyof NotesRec; numeral: string; title: string; ph: string; hint: string }[] = [
  {
    key: "observaciones",
    numeral: "I.",
    title: "Observaciones",
    ph: "¿Qué patrones viste hoy en clase, en la gente, en ti?",
    hint: "El observador silencioso reúne la información que otros regalan.",
  },
  {
    key: "ideas",
    numeral: "II.",
    title: "Ideas",
    ph: "Conceptos, dibujos pendientes, conexiones entre materias…",
    hint: "Una idea anotada es un movimiento reservado para la siguiente jugada.",
  },
  {
    key: "errores",
    numeral: "III.",
    title: "Errores detectados",
    ph: "¿Qué falló hoy? ¿Distracción, tiempo, energía, comida?",
    hint: "Un error registrado es una lección armada.",
  },
  {
    key: "manana",
    numeral: "IV.",
    title: "Estrategias para mañana",
    ph: "El primer movimiento de mañana se decide esta noche.",
    hint: "Prepara la ropa, el material y la primera tarea antes de dormir.",
  },
];

export default function Notas({ effDay, record, onNotes }: NotasProps) {
  return (
    <div className="space-y-5">
      <Panel corners delay={0} className="p-6">
        <SectionTitle
          numeral="·"
          title={`Diario del estratega · Día ${effDay}`}
          right={
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted">
              <IconQuill className="w-4 h-4 text-gold/70" />
              Guardado automático
            </span>
          }
        />
        <div className="grid md:grid-cols-2 gap-5">
          {AREAS.map((a, i) => (
            <div key={a.key} className="rise" style={{ animationDelay: `${80 + i * 70}ms` }}>
              <div className="flex items-baseline gap-2.5 mb-2">
                <span className="font-display text-gold/80 text-sm tracking-[0.2em]">{a.numeral}</span>
                <h3 className="font-display text-bone text-sm font-semibold tracking-[0.18em] uppercase">
                  {a.title}
                </h3>
              </div>
              <textarea
                className="field min-h-[120px] resize-y leading-relaxed"
                placeholder={a.ph}
                value={record?.notes[a.key] ?? ""}
                onChange={(e) => onNotes(effDay, a.key, e.target.value)}
              />
              <p className="font-quote italic text-muted text-[13.5px] mt-1.5">{a.hint}</p>
            </div>
          ))}
        </div>
      </Panel>
      <p className="text-center text-[12px] text-muted fadein" style={{ animationDelay: "400ms" }}>
        Tres líneas honestas valen más que una página de excusas.
      </p>
    </div>
  );
}
