import { useState } from "react";
import { useAuth } from "./lib/useAuth";
import { useWriteups } from "./lib/useWriteups";
import AuthGate from "./components/AuthGate";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CaseFileEditor from "./components/CaseFileEditor";

export default function App() {
  const auth = useAuth();
  const [view, setView] = useState("dashboard");
  const [activeWriteup, setActiveWriteup] = useState(null);

  const { writeups, loading, saveWriteup } = useWriteups(auth.user?.uid);

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-case-950">
        <p className="animate-pulse font-mono text-sm text-emerald-400">
          booting_terminal<span className="animate-blink">_</span>
        </p>
      </div>
    );
  }

  if (!auth.user) {
    return <AuthGate auth={auth} />;
  }

  async function handleSave(data) {
    await saveWriteup(auth.user.uid, data);
    setView("dashboard");
  }

  return (
    <div className="flex min-h-screen bg-case-950 bg-scanlines text-slate-200">
      <Sidebar
        view={view}
        setView={(v) => {
          setActiveWriteup(null);
          setView(v);
        }}
        user={auth.user}
        onLogout={auth.logout}
      />

      {view === "dashboard" ? (
        <Dashboard
          writeups={writeups}
          loading={loading}
          onNew={() => setView("editor")}
          onOpen={setActiveWriteup}
        />
      ) : (
        <CaseFileEditor onSave={handleSave} onCancel={() => setView("dashboard")} />
      )}
    </div>
  );
}
