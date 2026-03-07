import React, { useState } from "react";
import type { Level, Area, AttemptDocument, VideoAnalysis } from "../types";
import { useAttempts } from "../hooks/useMentorData";
import {
  LevelBadge,
  AssessmentBadge,
  AreaBar,
  SkeletonTable,
  scoreHex,
  formatDate,
  AREA_COLORS,
} from "../components/SharedComponents";

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
   MAIN
   ============================================================ */
export default function AttemptsPage({ userId }: { userId: string }) {
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  // reset page when filter changes
  const handleFilter = (f: Level | "all") => {
    setLevelFilter(f);
    setPage(1);
  };

  const { data, loading } = useAttempts(userId, levelFilter, page);

  const attempts = data?.attempts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 8));

  // --------------------------------------------------------
  return (
    <>
      {/* ---------- FILTER + COUNT ---------- */}
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

      {/* ---------- TABLE ---------- */}
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
                      No attempts found for this filter.
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
                        {/* ─── MAIN ROW ─── */}
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

                        {/* ─── EXPANDED DETAIL ─── */}
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

          {/* ---------- PAGINATION ---------- */}
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
    </>
  );
}

/* ============================================================
   DETAIL PANEL  (expanded row content)
   ============================================================ */
function DetailPanel({ attempt: att }: { attempt: AttemptDocument }) {
  const areas = att.areas ?? {};
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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

      {/* ML / SHAP */}
      {att.ml && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
            ML (SHAP)
          </p>
          <p className="text-xs text-gray-400 mb-1">
            Predicted:{" "}
            <strong className="text-gray-200 font-mono">
              {Number(att.ml.predicted_score).toFixed(1)}%
            </strong>
          </p>
          <p className="text-xs text-gray-400">
            Base value:{" "}
            <strong className="text-gray-200 font-mono">
              {Number(att.ml.base_value).toFixed(1)}
            </strong>
          </p>
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

  const hasEcError = ec && "error" in ec;
  const hasSrError = sr && "error" in sr;
  const ecData = ec && !hasEcError ? (ec as any) : null;
  const srData = sr && !hasSrError ? (sr as any) : null;

  return (
    <div className="text-xs text-gray-400 flex flex-col gap-1">
      {hasEcError && <p className="text-rose-400">👀 Eye contact: Error</p>}
      {ecData && (
        <>
          <p>
            👀 Eye contact:{" "}
            <strong className="text-teal-400">
              {ecData.eye_contact?.percentage}
            </strong>
          </p>
          <p className="opacity-60">
            {" "}
            Look away: {ecData.look_away?.percentage}
          </p>
          <p className="opacity-60"> Duration: {ecData.video_duration}s</p>
        </>
      )}
      {hasSrError && (
        <p className="text-rose-400 mt-1">🤚 Sign recognition: Error</p>
      )}
      {srData?.recognized_sign && (
        <p className="mt-1">
          🤚 Sign:{" "}
          <strong className="text-blue-400 capitalize">
            {srData.recognized_sign}
          </strong>
        </p>
      )}
      {!ecData && !hasEcError && !srData?.recognized_sign && !hasSrError && (
        <p className="text-gray-600">No detailed results</p>
      )}
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
