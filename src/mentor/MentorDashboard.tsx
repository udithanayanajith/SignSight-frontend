import { useState } from "react";
import { useUsers, useUserSummary } from "./hooks/useMentorData";
import OverviewPage from "./pages/OverviewPage";
import LevelViewPage from "./pages/LevelViewPage";
import AttemptsPage from "./pages/AttemptsPage";
import {
  SkeletonStatRow,
  SkeletonChartRow,
} from "./components/SharedComponents";

type NavId = "overview" | "level" | "attempts";

const NAV_ITEMS: { id: NavId; icon: string; label: string }[] = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "level", icon: "📈", label: "Level Details" },
  { id: "attempts", icon: "📋", label: "Attempts" },
];

export default function MentorDashboard() {
  const [activeNav, setActiveNav] = useState<NavId>("overview");

  // ---- data ----
  const { users, loading: usersLoading } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    () => users[0]?.userId ?? null,
  );

  // keep selectedUserId in sync after users load
  const effectiveUserId = selectedUserId ?? users[0]?.userId ?? null;

  const { summary, loading: summaryLoading } = useUserSummary(effectiveUserId);

  const isLoading = usersLoading || summaryLoading || !summary;

  // --------------------------------------------------------
  return (
    <div
      className="flex min-h-screen bg-gray-900 text-gray-100"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      {/* ==================== SIDEBAR ==================== */}
      <aside className="w-56 bg-gray-800 border-r border-gray-700 flex flex-col shrink-0">
        {/* logo */}
        <div className="p-5 border-b border-gray-700 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-lg">
            🤚
          </div>
          <h1 className="text-base font-semibold tracking-tight">
            Sign<span className="text-teal-400">Sight</span>
          </h1>
        </div>

        {/* nav */}
        <nav className="flex-1 py-3">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest px-4 mb-2">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`
                  w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all duration-150 border-l-2
                  ${
                    isActive
                      ? "bg-gray-700/60 text-blue-400 border-blue-500"
                      : "text-gray-500 border-transparent hover:bg-gray-700/30 hover:text-gray-300"
                  }
                `}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* footer info */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-600">
            👤 {users.length} student{users.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
      </aside>

      {/* ==================== MAIN AREA ==================== */}
      <main className="flex-1 min-w-0 overflow-x-auto p-7">
        {/* ── TOPBAR ── */}
        <header className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-gray-100">
              {activeNav === "overview" && "Student Overview"}
              {activeNav === "level" && "Level Breakdown"}
              {activeNav === "attempts" && "Attempt History"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {activeNav === "overview" &&
                "Summary, area performance & insights"}
              {activeNav === "level" &&
                "Deep-dive into Basic · Intermediate · Advanced"}
              {activeNav === "attempts" &&
                "Paginated log with full attempt detail"}
            </p>
          </div>

          {/* student selector */}
          <div className="relative">
            <select
              value={effectiveUserId ?? ""}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-3.5 py-2 pr-8 text-xs text-gray-200 cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
            >
              {users.map((u) => (
                <option
                  key={u.userId}
                  value={u.userId}
                  style={{ background: "#1f2937" }}
                >
                  {u.userId}
                </option>
              ))}
              {users.length === 0 && (
                <option disabled>No students found</option>
              )}
            </select>
            {/* chevron icon */}
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 4l4 4 4-4" />
            </svg>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        {isLoading ? (
          <>
            <SkeletonStatRow />
            <SkeletonChartRow />
          </>
        ) : (
          <>
            {activeNav === "overview" && <OverviewPage summary={summary!} />}
            {activeNav === "level" && <LevelViewPage summary={summary!} />}
            {activeNav === "attempts" && (
              <AttemptsPage userId={effectiveUserId!} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
