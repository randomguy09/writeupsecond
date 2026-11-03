# 0xWriteups — CTF Case File Portfolio

A dark, "hacker case file" themed CTF write-up portfolio. React + Tailwind on Netlify, using **Netlify Identity** for accounts and **Netlify Database** (managed Postgres, via Drizzle ORM) for storage, with a TipTap-powered WYSIWYG editor (headings, bold/italic, lists, inline images, and syntax-highlighted code blocks).

## Setup

No API keys or external services are needed.

1. `npm install`
2. `netlify dev` — runs Vite plus the `/api/writeups` function locally.

On deploy, Netlify provisions the database and applies the migrations in `netlify/database/migrations/` automatically.

### Accounts

Identity is enabled for the site. By default new sign-ups must confirm their email before they can sign in; you can turn on *Autoconfirm* (or switch registration to invite-only) in the Netlify dashboard under **Project configuration → Identity**.

## Structure

```
db/
  schema.ts            # Drizzle table definition (writeups)
  index.ts             # Drizzle client (Netlify Database adapter)
netlify/
  functions/writeups.mts   # GET / POST / DELETE /api/writeups (per signed-in user)
  database/migrations/     # generated with `npx drizzle-kit generate --name <change>`
src/
  lib/
    useAuth.js         # Netlify Identity login / signup / logout hook
    useWriteups.js     # fetches + saves write-ups via /api/writeups
  components/          # Sidebar, AuthGate, Dashboard, WriteupCard, Badges, CaseFileEditor, EditorToolbar, Icons
  App.jsx              # view routing
  index.css            # Tailwind layers + editor/code styling
```

## Data model

Table `writeups`: `id`, `user_id` (Identity user id), `ctf_name`, `challenge_name`, `category` (Web | Crypto | Pwn | Rev | Forensics | OSINT), `difficulty` (Textbook | Easy | Medium | Hard), `summary`, `content_html`, `content_json` (raw TipTap doc), `created_at`.

The API only ever returns or modifies rows belonging to the signed-in user.

## Notes

- The editor saves both `contentHTML` (for quick rendering) and `contentJSON` (TipTap's document format, useful if you later add an "edit existing case file" flow — just feed it back into `useEditor({ content: contentJSON })`).
- Swap `lowlight`'s `common` import for `all` if you need syntax highlighting for more languages.
- Difficulty colors: Textbook = sky, Easy = emerald, Medium = amber, Hard = rose.
- Category colors: Pwn = red, Web = blue, Crypto = purple, Rev = orange, Forensics = yellow, OSINT = teal (not in the original spec, added for the extra dropdown option).
