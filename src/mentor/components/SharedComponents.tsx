import type { Level, Assessment, Area } from "../types";

/* ============================================================
   COLOUR MAPS  (centralised — used by every chart & badge)
   ============================================================ */
export const LEVEL_COLORS: Record<
  Level,
  { bg: string; text: string; border: string; accent: string }
> = {
  basic: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/40",
    accent: "#3b82f6",
  },
  intermediate: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/40",
    accent: "#f59e0b",
  },
  advanced: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/40",
    accent: "#f43f5e",
  },
};

export const ASSESS_COLORS: Record<
  Assessment,
  { bg: string; text: string; hex: string }
> = {
  Excellent: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    hex: "#22c55e",
  },
  Good: { bg: "bg-blue-500/10", text: "text-blue-400", hex: "#3b82f6" },
  "Needs Improvement": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    hex: "#f59e0b",
  },
  Critical: { bg: "bg-rose-500/10", text: "text-rose-400", hex: "#f43f5e" },
};

export const AREA_COLORS: Record<Area, string> = {
  family: "#3b82f6",
  alphabet: "#14b8a6",
  numbers: "#f59e0b",
  objects: "#8b5cf6",
  actions: "#f43f5e",
  emotions: "#06b6d4",
};

export const ALL_AREAS: Area[] = [
  "family",
  "alphabet",
  "numbers",
  "objects",
  "actions",
  "emotions",
];

/* ============================================================
   STAT CARD
   Props:  label, value (string | number), sub (subtitle),
           accentColor (tailwind border-top class e.g. 'border-blue-500')
   ============================================================ */
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accentColor: string; // e.g. 'border-blue-500'
}

export function StatCard({ label, value, sub, accentColor }: StatCardProps) {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-xl p-5 border-t-2 ${accentColor} transition-all duration-200 hover:-translate-y-0.5`}
    >
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-100 font-mono leading-tight">
        {value}
      </p>
      {sub && <p className="text-xs text-gray-500 mt-1.5">{sub}</p>}
    </div>
  );
}

/* ============================================================
   LEVEL BADGE
   ============================================================ */
export function LevelBadge({ level }: { level: Level }) {
  const c = LEVEL_COLORS[level];
  return (
    <span
      className={`inline-block ${c.bg} ${c.text} text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize`}
    >
      {level}
    </span>
  );
}

/* ============================================================
   ASSESSMENT BADGE
   ============================================================ */
export function AssessmentBadge({
  assessment,
}: {
  assessment: Assessment | null;
}) {
  if (!assessment) return <span className="text-gray-600 text-xs">—</span>;
  const c = ASSESS_COLORS[assessment];
  return (
    <span
      className={`inline-block ${c.bg} ${c.text} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
    >
      {assessment}
    </span>
  );
}

/* ============================================================
   AREA BAR  (horizontal mini progress bar)
   ============================================================ */
interface AreaBarProps {
  area: Area;
  percentage: number;
  correct?: number;
  total?: number;
}

export function AreaBar({ area, percentage, correct, total }: AreaBarProps) {
  const color = AREA_COLORS[area];
  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400 capitalize">{area}</span>
        <span className="text-xs font-mono font-semibold" style={{ color }}>
          {correct !== undefined && total !== undefined
            ? `${correct}/${total} · `
            : ""}
          {percentage}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   SKELETON PLACEHOLDERS
   ============================================================ */
export function SkeletonStatRow() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 border border-gray-700 rounded-xl p-5 animate-pulse"
        >
          <div className="h-2.5 bg-gray-700 rounded w-2/5 mb-3" />
          <div className="h-7 bg-gray-700 rounded w-3/5 mb-2" />
          <div className="h-2 bg-gray-700 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChartRow() {
  return (
    <div className="grid lg:grid-cols-3 gap-4 mb-5">
      <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-5 animate-pulse">
        <div className="h-3 bg-gray-700 rounded w-1/4 mb-5" />
        <div className="h-52 bg-gray-700 rounded" />
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 animate-pulse">
        <div className="h-3 bg-gray-700 rounded w-1/3 mb-5" />
        <div className="h-52 bg-gray-700 rounded" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden animate-pulse">
      <div className="h-10 bg-gray-700" />
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-12 border-t border-gray-700 flex items-center gap-4 px-4"
        >
          <div className="h-2.5 bg-gray-700 rounded w-8" />
          <div className="h-2.5 bg-gray-700 rounded w-20" />
          <div className="h-2.5 bg-gray-700 rounded w-16" />
          <div className="h-2.5 bg-gray-700 rounded w-24" />
          <div className="h-2.5 bg-gray-700 rounded flex-1" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   CARD WRAPPER  (consistent panel)
   ============================================================ */
interface CardProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, badge, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-xl p-5 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
        {badge && (
          <span className="text-xs font-semibold text-gray-500 bg-gray-700 px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ============================================================
   SCORE COLOUR  (returns a hex based on score value)
   ============================================================ */
export function scoreHex(score: number): string {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#f43f5e";
}

/* ============================================================
   DATE FORMATTER
   ============================================================ */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    "  " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
}
