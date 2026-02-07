import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";

import type { UserSummary, Level, Area, Assessment } from "../types";
import {
  StatCard,
  Card,
  LevelBadge,
  LEVEL_COLORS,
  AREA_COLORS,
  ASSESS_COLORS,
  ALL_AREAS,
} from "../components/SharedComponents";

const LEVELS: Level[] = ["basic", "intermediate", "advanced"];

/* ============================================================
   TOOLTIPS
   ============================================================ */
function AreaTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as { area: string; avg: number };
  return (
    <div className="bg-gray-900 border border-gray-600 rounded-lg px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-gray-500 capitalize mb-0.5">{d.area}</p>
      <p
        className="text-sm font-mono font-semibold"
        style={{ color: AREA_COLORS[d.area as Area] }}
      >
        {d.avg}%
      </p>
    </div>
  );
}

function LineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-600 rounded-lg px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-gray-500 mb-1">Attempt #{label}</p>
      <p className="text-sm font-mono font-semibold text-gray-100">
        {payload[0].value}%
      </p>
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as { name: string; value: number };
  return (
    <div className="bg-gray-900 border border-gray-600 rounded-lg px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-gray-500 mb-0.5">{d.name}</p>
      <p
        className="text-sm font-mono font-semibold"
        style={{ color: ASSESS_COLORS[d.name as Assessment]?.hex ?? "#fff" }}
      >
        {d.value}
      </p>
    </div>
  );
}

/* ============================================================
   MAIN
   ============================================================ */
export default function LevelViewPage({ summary }: { summary: UserSummary }) {
  const [activeLevel, setActiveLevel] = useState<Level>("basic");

  const ls = summary.levelStats[activeLevel];
  const prog = summary.progress[activeLevel] ?? [];

  // bar data
  const barData = ALL_AREAS.map((area) => ({
    area,
    avg: +((ls.areaAverages[area] ?? 0) as number).toFixed(1),
  }));

  // line data
  const lineData = prog.map((p) => ({ attempt: p.attempt, score: p.score }));

  // pie data
  const pieData = Object.entries(ls.assessments).map(([name, value]) => ({
    name,
    value,
  }));

  // --------------------------------------------------------
  return (
    <>
      {/* ---------- LEVEL TABS ---------- */}
      <div className="flex flex-wrap gap-2 mb-5">
        {LEVELS.map((lvl) => {
          const isActive = activeLevel === lvl;
          const c = LEVEL_COLORS[lvl];
          return (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`
                px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 capitalize
                ${
                  isActive
                    ? `${c.bg} ${c.text} ${c.border}`
                    : "border-gray-700 text-gray-400 bg-gray-800 hover:border-gray-600 hover:text-gray-300"
                }
              `}
            >
              {lvl === "basic" && "🟢 "}
              {lvl === "intermediate" && "🟡 "}
              {lvl === "advanced" && "🔴 "}
              {lvl}
              {ls.attemptCount > 0 && (
                <span className="opacity-50 ml-1.5 text-xs">
                  ({ls.attemptCount})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------- LEVEL STAT CARDS ---------- */}
      <div
        className={`grid gap-3 mb-5 ${activeLevel === "advanced" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"}`}
      >
        <StatCard
          label="Attempts"
          value={ls.attemptCount}
          sub="at this level"
          accentColor="border-blue-500"
        />
        <StatCard
          label="Avg Score"
          value={ls.attemptCount ? `${ls.avgScore}%` : "—"}
          sub="average across attempts"
          accentColor="border-teal-500"
        />
        <StatCard
          label="Best Score"
          value={ls.attemptCount ? `${ls.bestScore}%` : "—"}
          sub="highest single attempt"
          accentColor="border-emerald-500"
        />
        <StatCard
          label="Worst Score"
          value={ls.attemptCount ? `${ls.worstScore}%` : "—"}
          sub="lowest single attempt"
          accentColor="border-amber-500"
        />
        {activeLevel === "advanced" && (
          <StatCard
            label="Video Attempts"
            value={ls.videoAttempts}
            sub="with video analysis"
            accentColor="border-rose-500"
          />
        )}
      </div>

      {/* ---------- EMPTY STATE ---------- */}
      {ls.attemptCount === 0 && (
        <div className="flex flex-col items-center justify-center bg-gray-800 border border-gray-700 rounded-xl py-16">
          <span className="text-4xl mb-3 opacity-30">📭</span>
          <p className="text-gray-500 text-sm">
            No attempts at <LevelBadge level={activeLevel} /> level yet.
          </p>
        </div>
      )}

      {ls.attemptCount > 0 && (
        <>
          {/* ---------- CHARTS ROW 1: Bar + Line ---------- */}
          <div className="grid lg:grid-cols-3 gap-4 mb-5">
            {/* BAR */}
            <Card
              title="Area Averages"
              badge={activeLevel}
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={230}>
                <BarChart
                  data={barData}
                  margin={{ top: 4, right: 8, left: -12, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1f2937"
                  />
                  <XAxis
                    dataKey="area"
                    tick={{
                      fill: "#6b7280",
                      fontSize: 11,
               
                      textAnchor: "middle",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<AreaTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="avg" radius={[5, 5, 0, 0]} barSize={30}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={AREA_COLORS[entry.area as Area]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* LINE */}
            <Card title="Score Progression" badge="Over Time">
              <ResponsiveContainer width="100%" height={230}>
                <LineChart
                  data={lineData}
                  margin={{ top: 4, right: 8, left: -12, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1f2937"
                  />
                  <XAxis
                    dataKey="attempt"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<LineTooltip />}
                    cursor={{ stroke: "rgba(255,255,255,0.06)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={LEVEL_COLORS[activeLevel].accent}
                    strokeWidth={2.5}
                    dot={{
                      r: 3.5,
                      fill: LEVEL_COLORS[activeLevel].accent,
                      strokeWidth: 0,
                    }}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#111827" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* ---------- ROW 2: Pie + Video ---------- */}
          <div
            className={`grid gap-4 ${activeLevel === "advanced" ? "lg:grid-cols-2" : ""}`}
          >
            {/* PIE */}
            <Card
              title="Assessment Breakdown"
              badge={`${ls.attemptCount} attempts`}
            >
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={66}
                      innerRadius={32}
                      paddingAngle={3}
                      stroke="none"
                      label={({ name, percent }: any) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={{ stroke: "#374151", strokeWidth: 1 }}
                    >
                      {pieData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            ASSESS_COLORS[entry.name as Assessment]?.hex ??
                            "#3b82f6"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-600 text-xs">
                  No data
                </div>
              )}
            </Card>

            {/* VIDEO CARD (advanced only) */}
            {activeLevel === "advanced" && (
              <Card title="Video Analysis" badge="Advanced Only">
                {ls.videoAttempts === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                    <span className="text-3xl mb-2 opacity-30">🎥</span>
                    <p className="text-xs">No video submissions yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <VideoRow
                      icon="🎥"
                      label="Total Video Submissions"
                      value={String(ls.videoAttempts)}
                    />
                    <VideoRow
                      icon="👀"
                      label="Eye Contact Tracking"
                      value="Enabled"
                      color="text-teal-400"
                    />
                    <VideoRow
                      icon="🤚"
                      label="Sign Recognition"
                      value="Enabled"
                      color="text-blue-400"
                    />
                    <div className="mt-3 bg-gray-700/50 rounded-lg px-3 py-2.5 text-xs text-gray-500 leading-relaxed">
                      Video analysis includes{" "}
                      <span className="text-gray-300 font-medium">
                        eye contact detection
                      </span>{" "}
                      via MediaPipe and{" "}
                      <span className="text-gray-300 font-medium">
                        sign language recognition
                      </span>{" "}
                      via the external model API. Per-attempt details are
                      visible in the Attempts tab.
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </>
      )}
    </>
  );
}

/* ============================================================
   VIDEO ROW helper
   ============================================================ */
function VideoRow({
  icon,
  label,
  value,
  color = "text-gray-100",
}: {
  icon: string;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
      <span className="text-xs text-gray-400">
        {icon} {label}
      </span>
      <span className={`text-xs font-mono font-semibold ${color}`}>
        {value}
      </span>
    </div>
  );
}
