import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  Level,
  Area,
  AttemptDocument,
  VideoAnalysis,
} from "../../mentor/types";
import { useStudentAttempts } from "../../hooks/useStudentData";
import {
  LevelBadge,
  AssessmentBadge,
  AreaBar,
  SkeletonTable,
  scoreHex,
  formatDate,
  AREA_COLORS,
} from "../../mentor/components/SharedComponents";

// Helper to extract date string from either format
const getDateString = (
  dateField: string | { $date: string } | undefined,
): string => {
  if (!dateField) return "—";
  if (typeof dateField === "string") return dateField;
  if (dateField && "$date" in dateField) return dateField.$date;
  return "—";
};

const FILTER_OPTIONS: (Level | "all")[] = [
  "all",
  "basic",
  "intermediate",
  "advanced",
];
const EMOJI_MAP: Record<string, string> = {
  all: "🔘",
  basic: "🟢",
  intermediate: "🟡",
  advanced: "🔴",
};

/* ============================================================
   MAIN - STUDENT ATTEMPTS DASHBOARD
   ============================================================ */
export default function StudentAttemptsPage() {
  const navigate = useNavigate();
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  // reset page when filter changes
  const handleFilter = (f: Level | "all") => {
    setLevelFilter(f);
    setPage(1);
  };

  const { data, loading } = useStudentAttempts(levelFilter, page);

  const attempts = data?.attempts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 8));

  // --------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Results</h1>
          <p className="text-gray-400">Track your quiz attempts and progress</p>
        </div>
        <button
          onClick={() => navigate("/student/landing")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          ← Back to Learning
        </button>
      </div>

      {/* FILTER + COUNT */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((f) => {
            const isActive = levelFilter === f;
            return (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={`
                  px-3.5 py-1 rounded-full border text-xs font-medium transition-all duration-200 capitalize
                  ${
                    isActive
                      ? f === "all"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/40"
                        : f === "basic"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/40"
                          : f === "intermediate"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/40"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/40"
                      : "border-gray-700 text-gray-500 bg-gray-800 hover:border-gray-600 hover:text-gray-300"
                  }
                `}
              >
                {EMOJI_MAP[f]} {f}
              </button>
            );
          })}
        </div>
        <span className="text-xs text-gray-600 font-mono">
          {total} attempt{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* TABLE */}
      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  {[
                    "#",
                    "Level",
                    "Score",
                    "Assessment",
                    "Top Areas",
                    "Video",
                    "Date",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attempts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center text-gray-600 text-sm py-12"
                    >
                      No attempts found for this filter. Start by taking a quiz!
                    </td>
                  </tr>
                ) : (
                  attempts.map((att) => {
                    const isOpen = expanded === att.attemptNumber;
                    const areas = att.areas ?? {};
                    const topAreas = Object.entries(areas)
                      .sort(
                        (a, b) =>
                          (b[1].percentage ?? 0) - (a[1].percentage ?? 0),
                      )
                      .slice(0, 3);
                    const hasVideo = !!att.videoAnalysis;

                    return (
                      <React.Fragment key={att.attemptNumber}>
                        {/* MAIN ROW */}
                        <tr
                          onClick={() =>
                            setExpanded(isOpen ? null : att.attemptNumber)
                          }
                          className="border-b border-gray-700 last:border-0 hover:bg-gray-750 cursor-pointer transition-colors duration-150"
                          style={{
                            background: isOpen
                              ? "rgba(255,255,255,0.02)"
                              : undefined,
                          }}
                        >
                          <td className="px-4 py-2.5">
                            <span className="font-mono text-gray-400 text-xs">
                              {att.attemptNumber}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <LevelBadge level={att.level} />
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className="font-mono font-semibold text-sm"
                              style={{
                                color: scoreHex(att.quiz?.overallScore ?? 0),
                              }}
                            >
                              {att.quiz?.overallScore ?? "—"}%
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <AssessmentBadge
                              assessment={att.quiz?.assessment ?? null}
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex gap-1.5 flex-wrap">
                              {topAreas.map(([area, data]) => (
                                <span
                                  key={area}
                                  className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 capitalize whitespace-nowrap"
                                >
                                  {area}{" "}
                                  <strong className="text-gray-200">
                                    {data.percentage}%
                                  </strong>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            {hasVideo ? (
                              <span
                                className="text-base"
                                title="Video analysis available"
                              >
                                🎥
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(getDateString(att.createdAt))}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-center text-gray-600 text-xs select-none">
                            {isOpen ? "▲" : "▼"}
                          </td>
                        </tr>

                        {/* EXPANDED DETAIL */}
                        {isOpen && (
                          <tr style={{ background: "rgba(255,255,255,0.025)" }}>
                            <td colSpan={8} className="px-5 py-4">
                              <DetailPanel attempt={att} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-end gap-1.5 px-4 py-3 border-t border-gray-700 flex-wrap">
            <PagBtn disabled={page === 1} onClick={() => setPage(1)}>
              « First
            </PagBtn>
            <PagBtn
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Prev
            </PagBtn>

            {paginationNumbers(page, totalPages).map((p, i) =>
              typeof p === "string" ? (
                <span key={`e${i}`} className="text-gray-600 text-xs px-1">
                  …
                </span>
              ) : (
                <PagBtn key={p} active={p === page} onClick={() => setPage(p)}>
                  {p}
                </PagBtn>
              ),
            )}

            <PagBtn
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next ›
            </PagBtn>
            <PagBtn
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              Last »
            </PagBtn>
            <span className="text-xs text-gray-600 ml-2 font-mono">
              Page {page} of {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DETAIL PANEL  (expanded row content)
   ============================================================ */
function DetailPanel({ attempt: att }: { attempt: AttemptDocument }) {
  const areas = att.areas ?? {};
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* ALL AREAS */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          All Areas
        </p>
        {Object.entries(areas).length > 0 ? (
          Object.entries(areas).map(([area, data]) => (
            <AreaBar
              key={area}
              area={area as Area}
              percentage={data.percentage}
              correct={data.correct}
              total={data.total}
            />
          ))
        ) : (
          <span className="text-xs text-gray-600">No area data</span>
        )}
      </div>

      {/* INSIGHTS */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Insights
        </p>
        {att.insights?.weakAreas?.length > 0 && (
          <p className="text-xs mb-1.5">
            <span className="text-rose-400">⚠ Weak: </span>
            <span className="text-gray-400 capitalize">
              {att.insights.weakAreas.join(", ")}
            </span>
          </p>
        )}
        {att.insights?.strongAreas?.length > 0 && (
          <p className="text-xs mb-1.5">
            <span className="text-emerald-400">✓ Strong: </span>
            <span className="text-gray-400 capitalize">
              {att.insights.strongAreas.join(", ")}
            </span>
          </p>
        )}
        {att.insights?.recommendations?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            {att.insights.recommendations.map((r, i) => (
              <p
                key={i}
                className="text-xs text-gray-500 py-1 flex gap-1.5 items-start"
              >
                <span className="text-violet-400 font-bold leading-none">
                  ›
                </span>{" "}
                {r}
              </p>
            ))}
          </div>
        )}
        {!att.insights?.weakAreas?.length &&
          !att.insights?.strongAreas?.length &&
          !att.insights?.recommendations?.length && (
            <span className="text-xs text-gray-600">No insights</span>
          )}
      </div>

      {/* VIDEO ANALYSIS */}
      {att.videoAnalysis && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
            Video Analysis
          </p>
          <VideoDetail analysis={att.videoAnalysis} />
        </div>
      )}
    </div>
  );
}

/* ============================================================
   VIDEO DETAIL  helper
   ============================================================ */
function VideoDetail({ analysis }: { analysis: VideoAnalysis }) {
  const ec = analysis?.eye_contact;
  const sr = analysis?.sign_recognition;

  const hasEcError = !!(ec && "error" in ec);
  const hasSrError = !!(sr && "error" in sr);

  const ecData = ec && !hasEcError ? (ec as any) : null;
  const srData = sr && !hasSrError ? (sr as any) : null;

  const finalPercentages = ecData?.final_prediction_percentages ?? {};
  const finalStats = ecData?.final_prediction_statistics ?? {};
  const modelStats = ecData?.model_statistics ?? {};
  const avgConfidence = ecData?.average_model_confidence ?? {};
  const faceDetection = ecData?.face_detection ?? {};

  const eyeContactPct =
    finalPercentages?.EyeContact !== undefined
      ? Number(finalPercentages.EyeContact)
      : null;

  const lookAwayPct = finalPercentages
    ? Number(finalPercentages.LookLeft || 0) +
      Number(finalPercentages.LookRight || 0) +
      Number(finalPercentages.LookUp || 0) +
      Number(finalPercentages.LookDown || 0)
    : null;

  const noFacePct =
    finalPercentages?.NoFace !== undefined
      ? Number(finalPercentages.NoFace)
      : null;

  const eyesClosedPct =
    finalPercentages?.EyesClosed !== undefined
      ? Number(finalPercentages.EyesClosed)
      : null;

  const dominantPrediction = ecData?.dominant_prediction ?? "—";
  const duration =
    typeof ecData?.video_duration === "number"
      ? `${ecData.video_duration}s`
      : "—";

  const detectedPct = faceDetection?.detected_percentage ?? "—";
  const notDetectedPct = faceDetection?.not_detected_percentage ?? "—";

  const signText =
    srData?.answer || srData?.text || srData?.recognized_sign || "—";

  const signConfidence =
    typeof srData?.confidence === "number"
      ? Math.round(srData.confidence * 100)
      : null;

  const predictionRows = [
    {
      key: "EyeContact",
      label: "Eye Contact",
      pct: Number(finalPercentages?.EyeContact || 0),
      frames: Number(finalStats?.EyeContact || 0),
      color: "bg-emerald-500",
      text: "text-emerald-400",
    },
    {
      key: "LookLeft",
      label: "Look Left",
      pct: Number(finalPercentages?.LookLeft || 0),
      frames: Number(finalStats?.LookLeft || 0),
      color: "bg-amber-500",
      text: "text-amber-400",
    },
    {
      key: "LookRight",
      label: "Look Right",
      pct: Number(finalPercentages?.LookRight || 0),
      frames: Number(finalStats?.LookRight || 0),
      color: "bg-amber-500",
      text: "text-amber-400",
    },
    {
      key: "LookUp",
      label: "Look Up",
      pct: Number(finalPercentages?.LookUp || 0),
      frames: Number(finalStats?.LookUp || 0),
      color: "bg-violet-500",
      text: "text-violet-400",
    },
    {
      key: "LookDown",
      label: "Look Down",
      pct: Number(finalPercentages?.LookDown || 0),
      frames: Number(finalStats?.LookDown || 0),
      color: "bg-rose-500",
      text: "text-rose-400",
    },
    {
      key: "EyesClosed",
      label: "Eyes Closed",
      pct: Number(finalPercentages?.EyesClosed || 0),
      frames: Number(finalStats?.EyesClosed || 0),
      color: "bg-yellow-500",
      text: "text-yellow-400",
    },
    {
      key: "NoFace",
      label: "No Face",
      pct: Number(finalPercentages?.NoFace || 0),
      frames: Number(finalStats?.NoFace || 0),
      color: "bg-gray-500",
      text: "text-gray-300",
    },
  ].sort((a, b) => b.pct - a.pct);

  const getAttentionTone = () => {
    if (lookAwayPct !== null && lookAwayPct >= 60) {
      return {
        label: "High Distraction",
        box: "border-rose-500/30 bg-rose-500/10",
        text: "text-rose-400",
      };
    }
    if (eyeContactPct !== null && eyeContactPct >= 60) {
      return {
        label: "Good Focus",
        box: "border-emerald-500/30 bg-emerald-500/10",
        text: "text-emerald-400",
      };
    }
    return {
      label: "Mixed Attention",
      box: "border-amber-500/30 bg-amber-500/10",
      text: "text-amber-400",
    };
  };

  const attentionTone = getAttentionTone();

  if (hasEcError || hasSrError) {
    return (
      <div className="space-y-2 text-xs">
        {hasEcError && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-300">
            Eye contact analysis failed
          </div>
        )}
        {hasSrError && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-300">
            Sign recognition failed
          </div>
        )}
      </div>
    );
  }

  if (!ecData && !srData) {
    return <p className="text-xs text-gray-600">No detailed results</p>;
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard
          title="Eye Contact"
          value={eyeContactPct !== null ? `${eyeContactPct}%` : "—"}
          sub="Focused frames"
          tone={
            eyeContactPct !== null && eyeContactPct >= 60
              ? "success"
              : eyeContactPct !== null && eyeContactPct >= 30
                ? "warning"
                : "danger"
          }
        />
        <MetricCard
          title="Look Away"
          value={lookAwayPct !== null ? `${lookAwayPct.toFixed(1)}%` : "—"}
          sub="Left / Right / Up / Down"
          tone={
            lookAwayPct !== null && lookAwayPct < 30
              ? "success"
              : lookAwayPct !== null && lookAwayPct < 60
                ? "warning"
                : "danger"
          }
        />
        <MetricCard
          title="Face Detected"
          value={detectedPct}
          sub={`Missing: ${notDetectedPct}`}
          tone="info"
        />
        <MetricCard
          title="Duration"
          value={duration}
          sub={`Dominant: ${dominantPrediction}`}
          tone="neutral"
        />
      </div>

      {/* Highlight banner */}
      <div className={`rounded-xl border px-4 py-3 ${attentionTone.box}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className={`text-sm font-semibold ${attentionTone.text}`}>
              {attentionTone.label}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Dominant behavior:{" "}
              <span className="font-semibold text-white">
                {dominantPrediction}
              </span>
            </p>
          </div>

          {srData && (
            <div className="rounded-lg bg-gray-900/50 border border-gray-700 px-3 py-2 min-w-[160px]">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Recognized Sign
              </p>
              <p className="text-sm font-semibold text-blue-400 capitalize">
                {signText}
              </p>
              {signConfidence !== null && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Confidence: {signConfidence}%
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl border border-gray-700 bg-gray-900/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Prediction Breakdown
          </p>
          <span className="text-[11px] text-gray-600">
            Model enabled: {ecData?.model_enabled ? "Yes" : "No"}
          </span>
        </div>

        <div className="space-y-3">
          {predictionRows.map((row) => (
            <div key={row.key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${row.text}`}>{row.label}</span>
                  <span className="text-gray-500">{row.frames} frames</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">
                    Avg conf:{" "}
                    {Math.round((avgConfidence?.[row.key] || 0) * 100)}%
                  </span>
                  <span className="font-mono text-gray-200">
                    {row.pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="h-2.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className={`h-full ${row.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(0, Math.min(100, row.pct))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary insights */}
      <div className="grid md:grid-cols-2 gap-3">
        <InfoBox
          title="Focus Summary"
          items={[
            `Eye contact: ${eyeContactPct !== null ? `${eyeContactPct}%` : "—"}`,
            `Look away: ${lookAwayPct !== null ? `${lookAwayPct.toFixed(1)}%` : "—"}`,
            `Eyes closed: ${eyesClosedPct !== null ? `${eyesClosedPct}%` : "—"}`,
            `No face: ${noFacePct !== null ? `${noFacePct}%` : "—"}`,
          ]}
        />
      </div>
    </div>
  );
}
/* ============================================================
   PAGINATION helpers
   ============================================================ */
function PagBtn({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-2.5 py-1 rounded text-xs font-medium border transition-all duration-150
        ${
          active
            ? "bg-blue-500 border-blue-500 text-white"
            : "border-gray-700 text-gray-400 bg-gray-800 hover:border-gray-600 hover:text-gray-200"
        }
        disabled:opacity-30 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
}

function paginationNumbers(
  current: number,
  total: number,
): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (current > 3) pages.push("…");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  )
    pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

function MetricCard({
  title,
  value,
  sub,
  tone = "neutral",
}: {
  title: string;
  value: string;
  sub?: string;
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  const toneMap = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    danger: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    info: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    neutral: "border-gray-700 bg-gray-800/70 text-gray-200",
  };

  return (
    <div className={`rounded-xl border p-3 ${toneMap[tone]}`}>
      <p className="text-[11px] uppercase tracking-wide opacity-80">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
      {sub ? <p className="text-[11px] mt-1 opacity-70">{sub}</p> : null}
    </div>
  );
}

function InfoBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/40 p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 text-xs text-gray-300">
            <span className="text-violet-400 font-bold">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
