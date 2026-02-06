import { useState, useEffect, useCallback } from "react";
import type { UserDocument, UserSummary, AttemptsPage, Level } from "../types";

const API = "/api/dashboard"; // proxied by Vite → port 5050

// ============================================================
// 1.  useUsers  —  fetch the full user list once
// ============================================================
export function useUsers() {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/users`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<UserDocument[]>;
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { users, loading, error };
}

// ============================================================
// 2.  useUserSummary  —  fetch summary whenever userId changes
// ============================================================
export function useUserSummary(userId: string | null) {
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    fetch(`${API}/users/${userId}/summary`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<UserSummary>;
      })
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { summary, loading, error, refetch: fetch_ };
}

// ============================================================
// 3.  useAttempts  —  paginated attempt list with level filter
// ============================================================
export function useAttempts(
  userId: string | null,
  levelFilter: Level | "all",
  page: number,
) {
  const [data, setData] = useState<AttemptsPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
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
  }, [userId, levelFilter, page]);

  return { data, loading, error };
}
