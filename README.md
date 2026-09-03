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

- Instant marking and a short explanation after every answer
- Champion Mix drawn from every subject
- Printable 80-question exam paper (5 per subject) with a teacher answer key
- Certificate of achievement
- Keyboard: `A`–`D` or `1`–`4` to answer, `Enter` for next

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
