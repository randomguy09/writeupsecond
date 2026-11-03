import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export function useWriteups(userId) {
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "users", userId, "writeups"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setWriteups(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  const saveWriteup = (userId, data) =>
    addDoc(collection(db, "users", userId, "writeups"), {
      ...data,
      createdAt: serverTimestamp(),
    });

  return { writeups, loading, saveWriteup };
}
