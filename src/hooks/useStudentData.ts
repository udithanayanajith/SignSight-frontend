import { useState, useEffect } from "react";
import type { AttemptsPage, Level } from "../mentor/types";
import { BACKEND_BASE_URI } from "../config/CONFIG";

const API = "/api/dashboard"; // proxied by Vite → port 5050

// ============================================================
// useStudentAttempts — fetch student's own paginated attempts
// ============================================================
export function useStudentAttempts(levelFilter: Level | "all", page: number) {
  const [data, setData] = useState<AttemptsPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get userId from localStorage (studentName is used as user_id in the system)
    const userId = localStorage.getItem("studentName");

    if (!userId) {
      setError(
        "No student name found. Please enter your name on the home page.",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const lvlParam = levelFilter !== "all" ? `&level=${levelFilter}` : "";
    const url = `${API}/users/${userId}/attempts?page=${page}&limit=8${lvlParam}`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<AttemptsPage>;
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [levelFilter, page]);

  return { data, loading, error };
}
