import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginAnon = () => signInAnonymously(auth);
  const loginEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const registerEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return { user, loading, loginAnon, loginEmail, registerEmail, logout };
}
