# 0xWriteups — CTF Case File Portfolio

A dark, "hacker case file" themed CTF write-up portfolio. React + Tailwind + Firebase (Auth + Firestore), with a TipTap-powered WYSIWYG editor (headings, bold/italic, lists, inline images, and syntax-highlighted code blocks).

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Firebase project** at https://console.firebase.google.com
   - Enable **Authentication** → Sign-in methods → turn on *Anonymous* and *Email/Password*.
   - Enable **Firestore Database** (start in production mode).
   - In Project Settings → General, create a Web App and copy its config values.

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in `.env` with your Firebase web app config (`apiKey`, `authDomain`, `projectId`, etc).

4. **Deploy Firestore security rules** (`firestore.rules` is included) so each user can only read/write their own `users/{uid}/writeups` collection:
   ```bash
   firebase deploy --only firestore:rules
   ```
   (requires the Firebase CLI and `firebase init` run once against your project)

5. **Run locally**
   ```bash
   npm run dev
   ```

## Structure

```
src/
  lib/
    firebase.js      # Firebase app/auth/db init
    useAuth.js        # anonymous + email/password auth hook
    useWriteups.js     # real-time Firestore listener + save function
  components/
    Sidebar.jsx        # nav: Dashboard / New Case File + user status
    AuthGate.jsx        # sign-in / register / anonymous screen
    Dashboard.jsx        # grid of write-up cards, search
    WriteupCard.jsx       # individual card with badges
    Badges.jsx              # difficulty + category color-coded badges
    CaseFileEditor.jsx       # metadata form + TipTap editor ("New Case File")
    EditorToolbar.jsx         # formatting toolbar for the editor
    Icons.jsx                  # inline SVG icon set
  App.jsx                       # view routing + Firebase wiring
  index.css                      # Tailwind layers + editor/code styling
```

## Data model

Each write-up is stored at `users/{uid}/writeups/{docId}`:

```js
{
  ctfName: "HackTheBox CyberApocalypse",
  challengeName: "baby-rop",
  category: "Pwn",        // Web | Crypto | Pwn | Rev | Forensics | OSINT
  difficulty: "Medium",    // Textbook | Easy | Medium | Hard
  summary: "Short one-liner for the card view",
  contentHTML: "<p>...</p>",  // rendered HTML from the editor
  contentJSON: { ... },         // raw TipTap JSON doc, for re-editing later
  createdAt: Timestamp,
}
```

## Notes

- The editor saves both `contentHTML` (for quick rendering) and `contentJSON` (TipTap's document format, useful if you later add an "edit existing case file" flow — just feed it back into `useEditor({ content: contentJSON })`).
- Swap `lowlight`'s `common` import for `all` if you need syntax highlighting for more languages.
- Difficulty colors: Textbook = sky, Easy = emerald, Medium = amber, Hard = rose.
- Category colors: Pwn = red, Web = blue, Crypto = purple, Rev = orange, Forensics = yellow, OSINT = teal (not in the original spec, added for the extra dropdown option).
