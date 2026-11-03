import { useCallback, useEffect, useState } from "react";

async function request(method, body) {
  const res = await fetch("/api/writeups", {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status}).`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* non-JSON error */
    }
    if (res.status === 401) message = "Your session expired. Please sign in again.";
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

export function useWriteups(userId) {
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      setWriteups(await request("GET"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setWriteups([]);
      setLoading(true);
      return;
    }
    refresh();
  }, [userId, refresh]);

  const saveWriteup = async (data) => {
    const created = await request("POST", data);
    setWriteups((prev) => [created, ...prev]);
    return created;
  };

  return { writeups, loading, error, refresh, saveWriteup };
}
