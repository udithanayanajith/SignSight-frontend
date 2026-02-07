import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import type { UserSummary, Area, Assessment } from "../types";
import {
  StatCard,
  Card,
  AreaBar,
  AREA_COLORS,
  ASSESS_COLORS,
  ALL_AREAS,
  scoreHex,
} from "../components/SharedComponents";

/* ============================================================
   CUSTOM TOOLTIPS
   ============================================================ */
function BarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as { area: string; avg: number };
  return (
    <div className="bg-gray-900 border border-gray-600 rounded-lg px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        {d.area}
      </p>
      <p
        className="text-sm font-mono font-semibold"
        style={{ color: AREA_COLORS[d.area as Area] }}
      >
        {d.avg}%
      </p>
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as { name: string; value: number };
  const c = ASSESS_COLORS[d.name as Assessment];
  return (
    <div className="bg-gray-900 border border-gray-600 rounded-lg px-3.5 py-2.5 shadow-lg">
      <p className="text-xs text-gray-500 mb-0.5">{d.name}</p>
      <p
        className="text-sm font-mono font-semibold"
        style={{ color: c?.hex ?? "#fff" }}
      >
        {d.value} attempts
      </p>
    </div>
  );
}

/* ============================================================
   MAIN
   ============================================================ */
export default function OverviewPage({ summary }: { summary: UserSummary }) {
  const {
    levelStats,
    globalAreaAverages,
    weakAreas,
    strongAreas,
    latest,
    totalAttempts,
  } = summary;

  // ---- derived stat values ----
  const levelAvgs = Object.values(levelStats)
    .filter((l) => l.attemptCount > 0)
    .map((l) => l.avgScore);

  const overallAvg = levelAvgs.length
    ? (levelAvgs.reduce((a, b) => a + b, 0) / levelAvgs.length).toFixed(1)
    : "0";

  const bestScore = Math.max(
    ...Object.values(levelStats).map((l) => l.bestScore),
    0,
  );
  const levelsActive = Object.values(levelStats).filter(
    (l) => l.attemptCount > 0,
  ).length;

  // ---- bar chart data ----
  const barData = ALL_AREAS.map((area) => ({
    area,
    avg: +(globalAreaAverages[area] ?? 0).toFixed(1),
  }));

  // ---- pie chart data  (aggregate assessments across all levels) ----
  const assessMap: Partial<Record<Assessment, number>> = {};
  Object.values(levelStats).forEach((ls) => {
    Object.entries(ls.assessments).forEach(([k, v]) => {
      const key = k as Assessment;
      assessMap[key] = (assessMap[key] ?? 0) + v;
    });
  });
  const pieData = Object.entries(assessMap).map(([name, value]) => ({
    name,
    value,
  }));

  // --------------------------------------------------------
  return (
    <>
      {/* ============ STAT CARDS ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <StatCard
          label="Total Attempts"
          value={totalAttempts}
          sub="across all levels"
          accentColor="border-blue-500"
        />
        <StatCard
          label="Overall Avg"
          value={`${overallAvg}%`}
          sub="weighted across levels"
          accentColor="border-teal-500"
        />
        <StatCard
          label="Best Score"
          value={`${bestScore}%`}
          sub="single attempt high"
          accentColor="border-amber-500"
        />
        <StatCard
          label="Levels Active"
          value={levelsActive}
          sub="out of 3 levels"
          accentColor="border-violet-500"
        />
        <StatCard
          label="Latest Score"
          value={latest ? `${latest.score}%` : "—"}
          sub={
            latest
              ? `${latest.level} · ${latest.assessment ?? "—"}`
              : "no attempts"
          }
          accentColor="border-rose-500"
        />
      </div>

      {/* ============ CHARTS ROW ============ */}
      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        {/* BAR — area averages */}
        <Card
          title="Area Performance"
          badge="Global Avg"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
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
                content={<BarTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="avg" radius={[5, 5, 0, 0]} barSize={32}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={AREA_COLORS[entry.area as Area]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* PIE — assessment distribution */}
        <Card title="Assessment Split" badge="All Levels">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={72}
                  innerRadius={36}
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
            <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-sm">
              <span className="text-3xl mb-2 opacity-40">📊</span>
              No assessment data yet
            </div>
          )}
        </Card>
      </div>

      {/* ============ INSIGHTS STRIP ============ */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* WEAK AREAS */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />{" "}
            Areas Needing Improvement
          </h4>
          {weakAreas.length > 0 ? (
            weakAreas.map((w) => (
              <div
                key={w.area}
                className="flex items-center justify-between py-1.5 border-b border-gray-700 last:border-0"
              >
                <span className="text-sm text-gray-300 capitalize">
                  {w.area}
                </span>
                <span className="text-xs font-mono font-semibold text-rose-400">
                  {w.avg}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-600 pt-2">
              All areas performing well 🎉
            </p>
          )}
        </div>

        {/* STRONG AREAS */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{" "}
            Strong Areas
          </h4>
          {strongAreas.length > 0 ? (
            strongAreas.map((s) => (
              <div
                key={s.area}
                className="flex items-center justify-between py-1.5 border-b border-gray-700 last:border-0"
              >
                <span className="text-sm text-gray-300 capitalize">
                  {s.area}
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  {s.avg}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-600 pt-2">
              Keep practising to build strong areas
            </p>
          )}
        </div>

        {/* RECOMMENDATIONS */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />{" "}
            Recommendations
          </h4>
          {latest?.insights?.recommendations?.length ? (
            latest.insights.recommendations.map((r, i) => (
              <div
                key={i}
                className="text-xs text-gray-400 py-1.5 border-b border-gray-700 last:border-0 flex gap-2 items-start"
              >
                <span className="text-violet-400 font-bold leading-none">
                  ›
                </span>{" "}
                {r}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-600 pt-2">
              No recommendations available yet
            </p>
          )}
        </div>
      </div>
    </>
  );
}
