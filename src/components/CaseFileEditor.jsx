import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import EditorToolbar from "./EditorToolbar";

const lowlight = createLowlight(common);

const CATEGORIES = ["Web", "Crypto", "Pwn", "Rev", "Forensics", "OSINT"];
const DIFFICULTIES = ["Textbook", "Easy", "Medium", "Hard"];

export default function CaseFileEditor({ onSave, onCancel }) {
  const [ctfName, setCtfName] = useState("");
  const [challengeName, setChallengeName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ HTMLAttributes: { class: "rounded-md border border-case-border" } }),
      Placeholder.configure({
        placeholder: "Document the exploit chain, payloads, and recon notes…",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm sm:prose-base max-w-none px-5 py-4 min-h-[360px] focus:outline-none prose-pre:bg-case-950 prose-pre:border prose-pre:border-case-border prose-code:text-emerald-300 prose-headings:font-semibold prose-a:text-emerald-400",
      },
    },
  });

  async function handleSave() {
    setErrorMsg("");
    if (!ctfName.trim() || !challengeName.trim()) {
      setErrorMsg("CTF name and challenge name are required.");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ctfName: ctfName.trim(),
        challengeName: challengeName.trim(),
        category,
        difficulty,
        summary: summary.trim(),
        contentHTML: editor?.getHTML() || "",
        contentJSON: editor?.getJSON() || null,
      });
    } catch (err) {
      setErrorMsg(err.message || "Failed to save case file.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-case-border bg-case-950/80 px-8 py-6 backdrop-blur">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-emerald-400/80">
            case_files --new
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">New Case File</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-case-border px-4 py-2.5 font-mono text-sm text-slate-400 hover:text-slate-200"
          >
            discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-emerald-500 px-5 py-2.5 font-mono text-sm font-semibold text-case-950 transition-all hover:bg-emerald-400 hover:shadow-glow disabled:opacity-50"
          >
            {saving ? "saving…" : "Save Case"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-8 py-8">
        {errorMsg && (
          <p className="mb-5 rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-mono text-xs text-rose-300">
            {errorMsg}
          </p>
        )}

        <section className="mb-6 rounded-lg border border-case-border bg-case-900/60 p-5 backdrop-blur">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-slate-500">
            // metadata
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="CTF Name">
              <input
                value={ctfName}
                onChange={(e) => setCtfName(e.target.value)}
                placeholder="HackTheBox CyberApocalypse"
                className="field"
              />
            </Field>
            <Field label="Challenge Name">
              <input
                value={challengeName}
                onChange={(e) => setChallengeName(e.target.value)}
                placeholder="baby-rop"
                className="field"
              />
            </Field>
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="field"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Difficulty">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="field"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Summary">
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  placeholder="One or two lines describing the bug class and the win condition."
                  className="field resize-none"
                />
              </Field>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-case-border bg-case-900/60 backdrop-blur">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
