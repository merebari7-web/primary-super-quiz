# Primary Super Quiz

A free, offline-friendly quiz for **Nigerian primary schools (Primary 1–6)**.

**16 subjects × 6 classes × 100 questions = 9,600 multiple-choice items.**

**Live site:** [https://merebari7-web.github.io/primary-super-quiz/](https://merebari7-web.github.io/primary-super-quiz/)

Open [index.html](index.html) to run it on your computer, or use the live GitHub Pages link above.

## Subjects

| Group | Subjects |
|---|---|
| Core | English Language, Mathematics, Basic Science, Social Studies, Civic Education |
| Practical | Computer Studies, Agricultural Science, Cultural & Creative Arts, PHE, Home Economics |
| Reasoning | Verbal Reasoning, Quantitative Reasoning |
| Humanities | History, Security Education |
| Religion | Christian Religious Studies (CRS), Islamic Religious Studies (IRS) |

Each subject bank has **100 questions** per class. Pupils can sit 10, 20, 50 or the full 100.

## Features

- **Practice, Exam and Timed** modes (30–45s per question)
- **Daily Challenge** (10 mixed questions, new set each day)
- **XP, day streaks and 10 badges** saved on the device
- Mastery stars per subject, retry missed questions
- 50/50 and Skip lifelines, optional read-aloud
- Dark mode, larger text, sound toggle
- **Works offline** (installable PWA) after the first visit
- Printable 80-question exam paper with a teacher answer key
- Certificate: print or download as PNG
- Keyboard: `A`–`D` or `1`–`4` to answer, `Enter` for next
- **Optional Google Sign-In** (guest play still works for younger pupils)

## Google Sign-In (optional)

Pupils can always type a name and play as a guest. To let teachers or older pupils sign in with Google:

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth client ID** of type **Web application**.
3. Under **Authorized JavaScript origins** add:
   - `https://merebari7-web.github.io`
   - `http://localhost:8080` (for local testing)
4. Copy the Client ID (`….apps.googleusercontent.com`).
5. Either paste it into **Settings → Google Client ID** on the live quiz, or set `window.GOOGLE_CLIENT_ID` in `js/config.js` and redeploy.

Progress is stored on the device, keyed by Google account (`sub`). Signing out returns to guest progress. This does **not** send scores to a server.

Questions follow typical NERDC primary topics and get harder from Primary 1 to Primary 6.

## Run locally

Any static server works. From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Regenerate the question banks

```bash
python3 scripts/generate_bank.py
```

Files are written to `data/p1` … `data/p6`.

## Publish on GitHub Pages

1. Create a new GitHub repository (for example `primary-super-quiz`).
2. Push this project:
   ```bash
   git init
   git add .
   git commit -m "Primary Super Quiz — 16 subjects, 100 questions each"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/primary-super-quiz.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Deploy from branch `main` / root**.
4. Your quiz will be at `https://YOUR_USER.github.io/primary-super-quiz/`.

## Licence

MIT — see [LICENSE](LICENSE).
