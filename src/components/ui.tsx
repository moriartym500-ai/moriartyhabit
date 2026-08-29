import type { ReactNode, SVGProps } from "react";

/* ============================================================
   Iconos — trazo fino, dibujo propio
   ============================================================ */

type IP = SVGProps<SVGSVGElement> & { className?: string };

const base = (p: IP) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: p.className ?? "w-5 h-5",
  ...p,
});

export const IconPawn = (p: IP) => (
  <svg {...base(p)}>
    <circle cx="12" cy="6.2" r="2.7" />
    <path d="M12 9v1.4M8.6 18c.4-3.4 1.4-6 3.4-7.6 2 1.6 3 4.2 3.4 7.6" />
    <path d="M6.5 20.5h11M8 18h8" />
  </svg>
);

export const IconNib = (p: IP) => (
  <svg {...base(p)}>
    <path d="M13.5 4.5 19.5 10.5 10 20H4v-6z" />
    <path d="M13.5 4.5 16 2l6 6-2.5 2.5" />
    <circle cx="11.5" cy="12.5" r="1.1" />
    <path d="M4 20l6.4-6.4" />
  </svg>
);

export const IconBarbell = (p: IP) => (
  <svg {...base(p)}>
    <path d="M7 7v10M17 7v10M3.5 9.5v5M20.5 9.5v5M7 12h10" />
  </svg>
);

export const IconTarget = (p: IP) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </svg>
);

export const IconCrown = (p: IP) => (
  <svg {...base(p)}>
    <path d="M4 17.5 5.5 7l4.6 4.6L12 5.5l1.9 6.1L18.5 7 20 17.5z" />
    <path d="M5 20.5h14" />
  </svg>
);

export const IconQuill = (p: IP) => (
  <svg {...base(p)}>
    <path d="M20 4c-6.5.5-11 3.5-13.5 9.5L5 19l1.5-.5C13 16.5 17.5 12 20 4z" />
    <path d="M5 19 4 20M9.5 14.5 15 9" />
  </svg>
);

export const IconBoard = (p: IP) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" />
    <path d="M3.5 12h17M12 3.5v17" />
    <rect x="3.5" y="3.5" width="8.5" height="8.5" fill="currentColor" opacity="0.25" stroke="none" />
    <rect x="12" y="12" width="8.5" height="8.5" fill="currentColor" opacity="0.25" stroke="none" />
  </svg>
);

export const IconTimer = (p: IP) => (
  <svg {...base(p)}>
    <circle cx="12" cy="13.5" r="7" />
    <path d="M12 13.5V9.8M9.5 2.5h5M12 2.5v2M18.5 6.5 20 8" />
  </svg>
);

export const IconFlame = (p: IP) => (
  <svg {...base(p)}>
    <path d="M12 21c3.9 0 6.5-2.5 6.5-6.2 0-3.4-2.3-5.4-4-7.8-.6 1.6-1.4 2.4-2.5 3.3C10.7 8.6 10 6.7 10.3 4c-2.9 2-4.8 5.3-4.8 8.6C5.5 18.5 8.1 21 12 21z" />
    <path d="M12 21c-1.7 0-2.8-1.3-2.8-3 0-1.6 1.1-2.6 2.8-4.2 1.7 1.6 2.8 2.6 2.8 4.2 0 1.7-1.1 3-2.8 3z" opacity="0.55" />
  </svg>
);

export const IconCheck = (p: IP) => (
  <svg {...base(p)}>
    <path d="M4.5 12.5 10 18 19.5 6.5" />
  </svg>
);

export const IconDownload = (p: IP) => (
  <svg {...base(p)}>
    <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15" />
  </svg>
);

export const IconUpload = (p: IP) => (
  <svg {...base(p)}>
    <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M4.5 19.5h15" />
  </svg>
);

export const IconRefresh = (p: IP) => (
  <svg {...base(p)}>
    <path d="M4.5 12a7.5 7.5 0 0 1 13-5.2L20 9.5M20 4.5v5h-5M19.5 12a7.5 7.5 0 0 1-13 5.2L4 14.5M4 19.5v-5h5" />
  </svg>
);

export const IconX = (p: IP) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPlay = (p: IP) => (
  <svg {...base(p)}>
    <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPause = (p: IP) => (
  <svg {...base(p)}>
    <path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth={2.2} />
  </svg>
);

export const IconCalendar = (p: IP) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15.5" />
    <path d="M3.5 9.5h17M8 2.5V6M16 2.5V6" />
  </svg>
);

export const IconLock = (p: IP) => (
  <svg {...base(p)}>
    <rect x="5.5" y="10.5" width="13" height="9.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2" />
  </svg>
);

export const IconShuffle = (p: IP) => (
  <svg {...base(p)}>
    <path d="M3.5 7h3l10 10h4M20.5 17l-2.5 2.5M20.5 17 18 14.5M3.5 17h3l2.8-2.8M13.7 9.8l2.8-2.8h4M20.5 7 18 4.5M20.5 7 18 9.5" />
  </svg>
);

export const IconTrash = (p: IP) => (
  <svg {...base(p)}>
    <path d="M4.5 6.5h15M9.5 6V4h5v2M6.5 6.5 7.5 20h9l1-13.5M10 10.5v6M14 10.5v6" />
  </svg>
);

export const IconChevronL = (p: IP) => (
  <svg {...base(p)}>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </svg>
);

export const IconChevronR = (p: IP) => (
  <svg {...base(p)}>
    <path d="M9.5 5.5 16 12l-6.5 6.5" />
  </svg>
);

export const IconEye = (p: IP) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const IconKnight = (p: IP) => (
  <svg {...base(p)}>
    <path d="M6 20.5h12M7 18.5h10c0-5.5-1.6-8.3-4-10.5L14.5 5 12 3.5l-.8 2.2C8 7 6.8 10 7 13.5c1.6.4 2.9-.2 4-1.5.6 2.4-.3 4.6-2 6.5-.5.6-1 0-2 0z" />
    <circle cx="11.2" cy="7.2" r="0.4" fill="currentColor" />
  </svg>
);

/* ============================================================
   Piezas de interfaz
   ============================================================ */

export function Corners() {
  return (
    <>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
    </>
  );
}

export function Panel({
  children,
  className = "",
  corners = false,
  delay,
}: {
  children: ReactNode;
  className?: string;
  corners?: boolean;
  delay?: number;
}) {
  return (
    <section
      className={`panel rise ${className}`}
      style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}
    >
      {corners && <Corners />}
      {children}
    </section>
  );
}

export function SectionTitle({
  numeral,
  title,
  right,
}: {
  numeral?: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <header className="flex items-center gap-3 mb-5">
      {numeral && (
        <span className="font-display text-gold/80 text-sm tracking-[0.2em]">{numeral}</span>
      )}
      <h2 className="font-display text-bone text-sm sm:text-base font-semibold tracking-[0.18em] uppercase">
        {title}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-r from-gold/40 via-line to-transparent" />
      {right}
    </header>
  );
}

export function Bar({ value, className = "h-2" }: { value: number; className?: string }) {
  return (
    <div className={`bar-track w-full ${className}`}>
      <div
        className="bar-fill"
        style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }}
      />
    </div>
  );
}

export function CheckBox({ on }: { on: boolean }) {
  return (
    <span className={`check-box ${on ? "on" : ""}`}>
      <IconCheck className="w-3.5 h-3.5 text-bone" strokeWidth={2.4} />
    </span>
  );
}

export function Switch({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex border border-line bg-[#101013] flex-none" role="group">
      {[true, false].map((v) => {
        const active = on === v;
        return (
          <button
            key={String(v)}
            onClick={onToggle}
            className={`px-3 py-1 text-[10px] uppercase tracking-[0.18em] transition-all duration-200 cursor-pointer ${
              active
                ? v
                  ? "bg-gradient-to-b from-winebright to-wine text-bone"
                  : "bg-raise text-bonedim"
                : "text-muted hover:text-bonedim"
            }`}
          >
            {v ? "Sí" : "No"}
          </button>
        );
      })}
    </div>
  );
}

export function Stat({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="panel-flat px-4 py-4 flex flex-col gap-1.5 min-w-0">
      <span className="small-caps text-muted flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span
        className={`font-display text-2xl leading-none font-semibold ${
          accent ? "text-gold" : "text-bone"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="small-caps text-bonedim block mb-1.5">{children}</span>;
}
