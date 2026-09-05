# Primary Super Quiz 🎓

**Primary Super Quiz** is a free, ad-free, classroom-ready educational web application providing world-class active retrieval practice for **English-medium primary learning** (Primary 1–6 / Grades 1–6 / Ages 6–12).

Built on cognitive learning science principles, it delivers **9,600 100% unique multiple-choice questions** across 16 subjects, aligned with Nigerian (NERDC), Cambridge Primary, UK National Curriculum, US Common Core / NGSS, and International Baccalaureate (IB PYP) frameworks.

**Live site:** [https://merebari7-web.github.io/primary-super-quiz/](https://merebari7-web.github.io/primary-super-quiz/)

---

## 🌟 Pedagogical Architecture & Features

### 1. 9,600 Unique Questions Across 16 Subjects
- **Zero repetitive templates:** Every question features authentic curriculum scenarios, age-appropriate vocabulary, and distinct distractor options.
- **Bloom’s Taxonomy Calibration:** Each item is tagged by cognitive level (*Remember*, *Understand*, *Apply*, *Analyze*) with developmental scaffolding.
- **Step-by-Step Explanations & Hints:** Formative scaffolding hints guide students before answer submission, and detailed pedagogical explanations teach the underlying concept.

### 2. Metacognitive Confidence Calibration
- **Metacognitive Rating:** Before submitting an answer, learners rate their certainty (*"I'm Sure"*, *"Thinking"*, *"Just Guessing"*).
- **2×2 Calibration Matrix:** Evaluates:
  - 🌟 **Mastered Concepts:** High confidence + Correct.
  - ⚠️ **Misconceptions:** High confidence + Incorrect (prioritized for review).
  - 🎲 **Fragile / Lucky:** Low confidence + Correct.
  - 🌱 **Growth Areas:** Low confidence + Incorrect.

### 3. Spaced Repetition Flashcards (Leitner 3-Box System)
- Automatically transfers missed items into a 3D animated Leitner flashcard deck.
- Students rate recall difficulty to space revision intervals for optimal long-term memory consolidation.

### 4. Interactive Digital Whiteboard & Scratchpad
- Built-in canvas for learners to work out math calculations, draw diagrams, or sketch phonetic breakdowns without leaving the quiz screen.

### 5. Educator & Classroom Command Center
- **Custom Printable Worksheet & Exam Builder:** Generates clean, printer-friendly exams with formatted answer keys, marking criteria, and Bloom's taxonomy notes.
- **Classroom Projector / Smartboard Mode:** High-visibility whole-class presentation interface with concealed step-by-step solutions for interactive whiteboard teaching.
- **Formative Diagnostic Learning Reports:** Detailed radar-style skill portfolios with specific pedagogical recommendations for teachers and parents.
- **Class Roster & Student Profiles:** Manage multiple learner profiles locally with one-click CSV export of scores, study minutes, and accuracy metrics.

### 6. Universal Design for Learning (UDL) & Accessibility
- **Dyslexia-Friendly Typography:** Native support for `Lexend`, `Nunito`, clean sans-serif, and serif fonts with adjustable scaling (100% to 160%).
- **High-Contrast Solar Theme:** WCAG AAA compliant yellow-on-black mode alongside Slate Dark, Mint, Calm Sepia, Cyber Violet, and Light Classroom themes.
- **Synchronized Text-to-Speech (TTS):** Browser Web Speech API integration with real-time visual karaoke word highlighting.
- **Zero-Dependency Audio Synthesis:** Pure Web Audio API procedural sound engine and study chimes.
- **Full Keyboard Navigation:** Shortcuts for options (A/B/C/D or 1/2/3/4), Hint (H), Scratchpad (S), Flag (F), and Read Aloud (R).
- **100% Offline PWA:** Instant caching via service worker for uninterrupted learning in low-bandwidth regions.

---

## 📚 Subject Domains (16 Subjects)

| Category | Subjects | Subtopics & Cognitive Domains |
|---|---|---|
| **Core Foundations** | English Language, Mathematics, Basic Science, Social Studies, Civic Education | Grammar, Reading comprehension, Arithmetic, Geometry, Word problems, Living systems, Earth science, Community, Governance, Human rights |
| **Applied & Practical** | Computer Studies, Agricultural Science, Cultural & Creative Arts, Physical & Health Education (PHE), Home Economics | Digital literacy, Hardware, Farm tools, Crops & livestock, Music, Visual arts, Nutrition, First aid, Cooking methods, Clothing |
| **Reasoning & Logic** | Verbal Reasoning, Quantitative Reasoning | Analogies, Word codes, Letter series, Syllables, Number matrices, Pattern puzzles, Arithmetic relations |
| **Humanities & Ethics** | History, Security Education, Christian Religious Studies (CRS), Islamic Religious Studies (IRS) | Ancient kingdoms, Independence heroes, World history, Safety, Cyber-awareness, Emergency services, Moral values, Scripture & ethics |

---

## 🏛️ International Curriculum Alignment

| Grade Level | Nigeria (NERDC) | Cambridge Primary | UK National Curriculum | US Common Core / NGSS | IB PYP |
|---|---|---|---|---|---|
| **Primary 1** (Age 6–7) | Primary 1 | Stage 1 | Year 2 (KS1) | Grade 1 | Early Primary |
| **Primary 2** (Age 7–8) | Primary 2 | Stage 2 | Year 3 (KS2) | Grade 2 | Inquiry 1 |
| **Primary 3** (Age 8–9) | Primary 3 | Stage 3 | Year 4 (KS2) | Grade 3 | Inquiry 2 |
| **Primary 4** (Age 9–10) | Primary 4 | Stage 4 | Year 5 (KS2) | Grade 4 | Middle Primary |
| **Primary 5** (Age 10–11) | Primary 5 | Stage 5 | Year 6 (KS2) | Grade 5 | Upper Primary |
| **Primary 6** (Age 11–12) | Primary 6 (Common Entrance) | Stage 6 (Checkpoint) | Year 7 (KS3 Prep) | Grade 6 | Exhibition Level |

---

## 🚀 Running Locally

Clone the repository and run any local static HTTP server:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` in any modern web browser.

---

## 🔒 Privacy & Compliance

- **No Student Tracking:** All learner data, XP, profiles, and quiz histories remain in browser `localStorage`.
- **COPPA & GDPR Compliant:** No pupil accounts required, zero third-party trackers, and no advertisements.

---

## 📄 Licence

© merebari web 2026. **All rights reserved.** See [LICENSE](LICENSE).

Teachers, parents, and students worldwide may use this application for independent learning and classroom instruction.
