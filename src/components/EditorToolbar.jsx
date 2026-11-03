import { CodeIcon, ImageIcon } from "./Icons";

function ToolButton({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded px-2.5 py-1.5 font-mono text-xs transition-colors ${
        active
          ? "bg-emerald-400/15 text-emerald-300"
          : "text-slate-400 hover:bg-case-800 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-case-border bg-case-900/60 px-3 py-2">
      <ToolButton
        title="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </ToolButton>
      <ToolButton
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolButton>
      <div className="mx-1 h-4 w-px bg-case-border" />
      <ToolButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolButton>
      <ToolButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </ToolButton>
      <div className="mx-1 h-4 w-px bg-case-border" />
      <ToolButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • list
      </ToolButton>
      <ToolButton
        title="Ordered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. list
      </ToolButton>
      <div className="mx-1 h-4 w-px bg-case-border" />
      <ToolButton
        title="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {"</>"}
      </ToolButton>
      <ToolButton
        title="Code block (syntax highlighted)"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <CodeIcon className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton title="Insert image" onClick={addImage}>
        <ImageIcon className="h-3.5 w-3.5" />
      </ToolButton>
      <div className="mx-1 h-4 w-px bg-case-border" />
      <ToolButton
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        "quote"
      </ToolButton>
    </div>
  );
}
