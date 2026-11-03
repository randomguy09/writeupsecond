import { useEffect, useState } from "react";
import {
  getUser,
  login,
  signup,
  logout as identityLogout,
  onAuthChange,
  handleAuthCallback,
  AUTH_EVENTS,
} from "@netlify/identity";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Handles email-confirmation / recovery links (#confirmation_token=…)
      try {
        const result = await handleAuthCallback();
        if (result?.type === "confirmation") {
          setNotice("Email confirmed. You are now signed in.");
        }
      } catch (err) {
        if (!cancelled) setNotice(err?.message || "Could not process the link.");
      }
      const u = await getUser();
      if (!cancelled) {
        setUser(u);
        setLoading(false);
      }
    }
    init();

    const unsub = onAuthChange((event, u) => {
      if (event === AUTH_EVENTS.LOGOUT) setUser(null);
      else if (u) setUser(u);
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const loginEmail = async (email, password) => {
    const u = await login(email, password);
    setUser(u);
    return u;
  };

  const registerEmail = async (email, password) => {
    await signup(email, password);
    // With autoconfirm on, signup logs the user in immediately.
    const current = await getUser();
    if (current) {
      setUser(current);
      return { needsConfirmation: false };
    }
    return { needsConfirmation: true };
  };

  const logout = async () => {
    try {
      await identityLogout();
    } finally {
      setUser(null);
    }
  };

  return { user, loading, notice, loginEmail, registerEmail, logout };
}
