(function () {
  const app = document.getElementById("app");
  const canvas = document.getElementById("confetti");
  const LETTERS = ["A", "B", "C", "D"];
  const bankCache = {};

  const state = {
    screen: "home",
    name: localStorage.getItem("psq-name") || "",
    grade: null,
    subject: null,
    length: 20,
    questions: [],
    index: 0,
    picked: [],
    revealed: false,
    sound: localStorage.getItem("psq-sound") !== "off",
    loading: false,
    error: ""
  };

  let audioCtx = null;
  let confettiTimer = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"'`]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" }[c];
    });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function prepareQuestion(q, subject) {
    const answerText = q.options[q.answer];
    const options = shuffle(q.options);
    return {
      q: q.q,
      options: options,
      answer: options.indexOf(answerText),
      explain: q.explain,
      subject: subject
    };
  }

  async function fetchBank(grade, subject) {
    const key = grade + "/" + subject;
    if (!bankCache[key]) {
      const res = await fetch("data/p" + grade + "/" + subject + ".json");
      if (!res.ok) throw new Error("Could not load " + subject + " for Primary " + grade);
      bankCache[key] = await res.json();
    }
    return bankCache[key];
  }

  async function loadQuiz(grade, subject, length) {
    if (subject === "mix") {
      const keys = Object.keys(window.SUBJECTS);
      const picked = [];
      const per = Math.max(1, Math.ceil(length / keys.length));
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const bank = await fetchBank(grade, k);
        shuffle(bank).slice(0, per).forEach(function (q) {
          picked.push(prepareQuestion(q, k));
        });
      }
      return shuffle(picked).slice(0, length);
    }
    const bank = await fetchBank(grade, subject);
    return shuffle(bank).slice(0, Math.min(length, bank.length)).map(function (q) {
      return prepareQuestion(q, subject);
    });
  }

  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }

  function tone(freq, dur, type, gain) {
    if (!state.sound || !audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain || 0.07, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + dur);
  }

  function playCorrect() {
    tone(523.25, 0.12, "triangle", 0.06);
    setTimeout(function () { tone(659.25, 0.12, "triangle", 0.06); }, 90);
    setTimeout(function () { tone(783.99, 0.18, "triangle", 0.07); }, 180);
  }

  function playWrong() {
    tone(196, 0.22, "square", 0.04);
  }

  function score() {
    let n = 0;
    state.questions.forEach(function (q, i) {
      if (state.picked[i] === q.answer) n += 1;
    });
    return n;
  }

  function subjectName(key) {
    if (key === "mix") return "Champion Mix";
    return window.SUBJECTS[key] ? window.SUBJECTS[key].name : key;
  }

  function iconFor(key) {
    if (key === "mix") return "🏆";
    return window.SUBJECTS[key] ? window.SUBJECTS[key].icon : "⭐";
  }

  function topbar(backScreen) {
    const left = backScreen
      ? `<button class="icon-btn" data-go="${backScreen}" aria-label="Back">←</button>`
      : `<div class="brand"><img src="images/mascot.png" alt=""> Super Quiz</div>`;
    return `
      <div class="topbar no-print">
        ${left}
        <div class="ghost-row">
          <button class="icon-btn" data-action="toggle-sound" aria-label="Sound">${state.sound ? "🔊" : "🔇"}</button>
        </div>
      </div>`;
  }

  function renderHome() {
    const nSub = Object.keys(window.SUBJECTS).length;
    return `
      <div class="wrap">
        ${topbar(null)}
        <section class="hero">
          <div>
            <div class="kicker">Primary 1 – 6 · Nigeria · NERDC-style</div>
            <h1>Primary Super Quiz</h1>
            <p class="lead">Every class, every subject — 100 questions each. English, Maths, Science, Civic, Computer, Agric, Arts, PHE, History, Reasoning, CRS, IRS and more.</p>
            <div class="stats">
              <span class="chip">${nSub} subjects</span>
              <span class="chip">9,600 questions</span>
              <span class="chip">Printable papers</span>
              <span class="chip">Certificates</span>
            </div>
          </div>
          <div class="hero-art"><img src="images/hero-kids.png" alt="Children taking a quiz together"></div>
        </section>
        <div class="home-panel panel-rel" style="margin-top:22px;background:var(--card);border:3px solid var(--line);border-radius:28px;padding:22px;box-shadow:var(--shadow);">
          <img class="mascot-float" src="images/mascot.png" alt="">
          <label class="field" for="pupil-name">What is your name?</label>
          <input id="pupil-name" type="text" maxlength="40" placeholder="Type your name" value="${esc(state.name)}">
          <div style="margin-top:14px">
            <button class="btn btn-primary" data-action="start">Let’s go! →</button>
          </div>
          <p class="sub" style="margin-top:12px;margin-bottom:0">Teachers can print an exam paper after choosing a class.</p>
        </div>
      </div>`;
  }

  function renderGrades() {
    const cards = [1, 2, 3, 4, 5, 6].map(function (g) {
      const info = window.GRADE_INFO[g];
      return `
        <button class="card-btn g${g}" data-grade="${g}">
          <div class="grade-no">${g}</div>
          <h3>${info.label}</h3>
          <p>${info.ages} · ${info.blurb}</p>
        </button>`;
    }).join("");
    return `
      <div class="wrap">
        ${topbar("home")}
        <p class="kicker">Hello, ${esc(state.name || "friend")}</p>
        <h2 class="section-title">Which class are you in?</h2>
        <p class="sub">Pick your class. Questions get harder from Primary 1 to Primary 6.</p>
        <div class="grid-grades">${cards}</div>
      </div>`;
  }

  function renderSubjects() {
    const g = state.grade;
    const cards = Object.keys(window.SUBJECTS).map(function (k) {
      const s = window.SUBJECTS[k];
      return `
        <button class="card-btn subject-card" style="--accent:hsl(${s.hue},55%,38%)" data-pick-subject="${k}">
          <div class="subj-icon">${s.icon}</div>
          <h3>${s.name}</h3>
          <p>100 questions in the bank</p>
        </button>`;
    }).join("");
    return `
      <div class="wrap">
        ${topbar("grade")}
        <p class="kicker">${window.GRADE_INFO[g].label}</p>
        <h2 class="section-title">Choose a subject</h2>
        <p class="sub">16 subjects · 100 questions each. Then pick how many you want to try.</p>
        <div class="grid-subjects">
          ${cards}
          <button class="card-btn mix-card" data-pick-subject="mix">
            <div>
              <h3>Champion Mix 🏆</h3>
              <p>A mixed paper drawn from every subject in this class.</p>
            </div>
            <span class="btn btn-sun" style="pointer-events:none">Play mix</span>
          </button>
        </div>
        <div class="teacher-row no-print">
          <div>
            <strong>For teachers</strong>
            <p class="sub" style="margin:0">Print an exam paper (5 questions × 16 subjects = 80) with an answer key.</p>
          </div>
          <button class="btn btn-ghost" data-action="print-exam">Print exam paper</button>
        </div>
      </div>`;
  }

  function renderLength() {
    const name = subjectName(state.subject);
    const buttons = window.QUIZ_LENGTHS.map(function (n) {
      const label = n === 10 ? "Quick" : n === 20 ? "Standard" : n === 50 ? "Long" : "Full paper";
      const cls = n === 100 ? "btn btn-sun" : n === 20 ? "btn btn-primary" : "btn btn-ghost";
      return `<button class="${cls} length-btn" data-length="${n}"><strong>${n}</strong><span>${label}</span></button>`;
    }).join("");
    return `
      <div class="wrap">
        ${topbar("subject")}
        <p class="kicker">${window.GRADE_INFO[state.grade].label} · ${esc(name)}</p>
        <h2 class="section-title">How many questions?</h2>
        <p class="sub">Each subject has 100 questions. Primary pupils often start with 10 or 20.</p>
        <div class="length-grid">${buttons}</div>
        ${state.loading ? '<p class="sub">Loading questions…</p>' : ""}
        ${state.error ? `<p class="feedback no">${esc(state.error)}</p>` : ""}
      </div>`;
  }

  function renderQuiz() {
    const q = state.questions[state.index];
    const total = state.questions.length;
    const pct = Math.round((state.index / total) * 100);
    const subj = q.subject ? window.SUBJECTS[q.subject] : window.SUBJECTS[state.subject];
    const options = q.options.map(function (opt, i) {
      let cls = "opt";
      if (state.revealed) {
        if (i === q.answer) cls += " correct";
        else if (i === state.picked[state.index]) cls += " wrong";
        else cls += " dim";
      }
      return `
        <button class="${cls}" data-opt="${i}" ${state.revealed ? "disabled" : ""}>
          <span class="badge">${LETTERS[i]}</span>
          <span>${esc(opt)}</span>
        </button>`;
    }).join("");
    let feedback = "";
    if (state.revealed) {
      const ok = state.picked[state.index] === q.answer;
      feedback = `
        <div class="feedback ${ok ? "ok" : "no"}">
          ${ok ? "Yes! " : "Not quite. The answer is <strong>" + esc(q.options[q.answer]) + "</strong>. "}
          ${esc(q.explain)}
        </div>`;
    }
    const nextLabel = state.index === total - 1 ? "See my score" : "Next question →";
    return `
      <div class="wrap">
        ${topbar("length")}
        <div class="quiz-head">
          <div class="progress-meta">${iconFor(q.subject || state.subject)} ${esc(subj ? subj.name : "Champion Mix")} · Primary ${state.grade}</div>
          <div class="progress-meta">${state.index + 1} / ${total}</div>
        </div>
        <div class="bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
        <div class="q-card">
          <div class="q-label">Question ${state.index + 1}</div>
          <h2 class="question">${esc(q.q)}</h2>
          <div class="options">${options}</div>
          ${feedback}
          <div class="quiz-actions">
            ${state.revealed ? `<button class="btn btn-primary" data-action="next">${nextLabel}</button>` : ""}
            <button class="btn btn-ghost" data-go="subject">Quit</button>
          </div>
        </div>
      </div>`;
  }

  function starsFor(pct) {
    if (pct >= 85) return 3;
    if (pct >= 60) return 2;
    if (pct >= 40) return 1;
    return 0;
  }

  function messageFor(pct) {
    if (pct === 100) return "Perfect score! You are a quiz champion.";
    if (pct >= 85) return "Outstanding work. Keep it up!";
    if (pct >= 70) return "Very good. A little extra practice and you will be unbeatable.";
    if (pct >= 50) return "Nice try. Review the ones you missed and have another go.";
    return "Keep going — every champion started as a learner. Try again!";
  }

  function renderResult() {
    const total = state.questions.length;
    const n = score();
    const pct = Math.round((n / total) * 100);
    const stars = starsFor(pct);
    const img = pct >= 70
      ? '<img class="trophy" src="images/trophy.png" alt="Trophy">'
      : '<img class="stars" src="images/stars.png" alt="Stars">';
    const starWord = stars === 1 ? "star" : "stars";
    return `
      <div class="wrap">
        ${topbar("subject")}
        <div class="result">
          ${img}
          <p class="kicker">${window.GRADE_INFO[state.grade].label} · ${esc(subjectName(state.subject))}</p>
          <h2 class="section-title">${esc(state.name || "Well done")}</h2>
          <div class="score-num">${n}<span style="font-size:.45em;color:var(--muted)"> / ${total}</span></div>
          <p style="font-weight:800;margin-top:4px">${pct}% · ${stars} ${starWord}</p>
          <p class="score-msg">${messageFor(pct)}</p>
          <div class="actions">
            <button class="btn btn-primary" data-action="review">Review answers</button>
            <button class="btn btn-sun" data-action="certificate">Certificate</button>
            <button class="btn btn-ghost" data-action="again">Play again</button>
            <button class="btn btn-ghost" data-go="subject">New subject</button>
          </div>
        </div>
      </div>`;
  }

  function renderReview() {
    const items = state.questions.map(function (q, i) {
      const ok = state.picked[i] === q.answer;
      const chosen = state.picked[i] == null ? "—" : q.options[state.picked[i]];
      const missed = ok ? "" : `<p>Correct answer: <strong>${esc(q.options[q.answer])}</strong></p>`;
      return `
        <article class="review-item">
          <span class="tag ${ok ? "ok" : "no"}">${ok ? "Correct" : "Missed"}</span>
          <h4>${i + 1}. ${esc(q.q)}</h4>
          <p>Your answer: <strong>${esc(chosen)}</strong></p>
          ${missed}
          <p style="color:var(--muted);margin-top:6px">${esc(q.explain)}</p>
        </article>`;
    }).join("");
    return `
      <div class="wrap">
        ${topbar("result")}
        <h2 class="section-title">Answer review</h2>
        <p class="sub">Read why each answer is right, then try the quiz again.</p>
        ${items}
        <div class="actions" style="margin-top:8px">
          <button class="btn btn-primary" data-go="result">Back to score</button>
        </div>
      </div>`;
  }

  function todayPretty() {
    try {
      return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return "3 September 2026";
    }
  }

  function renderCertificate() {
    const total = state.questions.length;
    const n = score();
    const pct = Math.round((n / total) * 100);
    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="result" aria-label="Back">←</button>
          <button class="btn btn-primary" data-action="print">Print certificate</button>
        </div>
        <div class="certificate" id="certificate">
          <div class="cert-inner">
            <img class="cert-owl" src="images/mascot.png" alt="">
            <p class="cert-kicker">Primary Super Quiz</p>
            <h2>Certificate of Achievement</h2>
            <p>This is to certify that</p>
            <p class="script-name">${esc(state.name || "A brilliant pupil")}</p>
            <p>has completed the <strong>${esc(subjectName(state.subject))}</strong> quiz<br>for <strong>${window.GRADE_INFO[state.grade].label}</strong></p>
            <p style="margin:14px 0;font-weight:800;font-size:22px">Score: ${n} / ${total} (${pct}%)</p>
            <p>${todayPretty()}</p>
            <p style="margin-top:18px;font-weight:800;color:var(--teal)">Well done — keep learning.</p>
          </div>
        </div>
      </div>`;
  }

  function renderExam() {
    const paper = state.examPaper;
    if (!paper) {
      return `
        <div class="wrap">
          ${topbar("subject")}
          <p class="sub">${state.loading ? "Preparing the exam paper…" : esc(state.error || "No paper loaded.")}</p>
        </div>`;
    }
    const g = state.grade;
    let body = "";
    let key = "";
    let total = 0;
    paper.forEach(function (block) {
      body += `<h3 style="margin:18px 0 10px;border-bottom:1px solid #ccc;padding-bottom:4px">${esc(block.name)}</h3>`;
      key += `<h3 style="margin-top:14px">${esc(block.name)}</h3><div class="key-grid">`;
      block.questions.forEach(function (q, i) {
        total += 1;
        const opts = q.options.map(function (opt, oi) {
          return `<div class="exam-opt">(${LETTERS[oi]}) ${esc(opt)}</div>`;
        }).join("");
        body += `<div class="exam-q"><p>${i + 1}. ${esc(q.q)}</p>${opts}</div>`;
        key += `<div>${i + 1}. ${LETTERS[q.answer]} — ${esc(q.options[q.answer])}</div>`;
      });
      key += "</div>";
    });
    const names = Object.keys(window.SUBJECTS).map(function (k) { return window.SUBJECTS[k].short; }).join(" · ");
    return `
      <div class="wrap exam">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="subject" aria-label="Back">←</button>
          <button class="btn btn-primary" data-action="print">Print paper</button>
        </div>
        <header class="exam-head">
          <h2>Primary Super Quiz — Examination Paper</h2>
          <p>${window.GRADE_INFO[g].label} · ${esc(names)}</p>
          <p>Time: 1½ hours · Answer all questions. Circle A, B, C or D.</p>
        </header>
        <div class="exam-meta">
          <span>Name: ______________________________</span>
          <span>Date: ______________</span>
          <span>Score: ______ / ${total}</span>
        </div>
        ${body}
        <section class="answer-key">
          <h2>Answer key — for the teacher only</h2>
          ${key}
        </section>
      </div>`;
  }

  function render() {
    const map = {
      home: renderHome,
      grade: renderGrades,
      subject: renderSubjects,
      length: renderLength,
      quiz: renderQuiz,
      result: renderResult,
      review: renderReview,
      certificate: renderCertificate,
      exam: renderExam
    };
    app.innerHTML = map[state.screen]();
    if (state.screen === "home") {
      const input = document.getElementById("pupil-name");
      if (input) {
        input.addEventListener("input", function () {
          state.name = input.value;
        });
        input.addEventListener("keydown", function (e) {
          if (e.key === "Enter") startFromHome();
        });
      }
    }
    if (state.screen === "result") {
      const pct = Math.round((score() / state.questions.length) * 100);
      if (pct >= 70) launchConfetti();
    } else {
      stopConfetti();
    }
    window.scrollTo(0, 0);
  }

  function startFromHome() {
    const input = document.getElementById("pupil-name");
    state.name = (input ? input.value : state.name).trim();
    if (!state.name) {
      if (input) {
        input.focus();
        input.style.borderColor = "#d4573e";
      }
      return;
    }
    localStorage.setItem("psq-name", state.name);
    state.screen = "grade";
    render();
  }

  async function beginQuiz() {
    state.loading = true;
    state.error = "";
    render();
    try {
      state.questions = await loadQuiz(state.grade, state.subject, state.length);
      state.index = 0;
      state.picked = [];
      state.revealed = false;
      state.screen = "quiz";
    } catch (err) {
      state.error = err.message || "Could not load the quiz.";
      state.screen = "length";
    }
    state.loading = false;
    render();
  }

  async function buildExam() {
    state.loading = true;
    state.error = "";
    state.examPaper = null;
    state.screen = "exam";
    render();
    try {
      const keys = Object.keys(window.SUBJECTS);
      const paper = [];
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const bank = await fetchBank(state.grade, k);
        paper.push({
          key: k,
          name: window.SUBJECTS[k].name,
          questions: shuffle(bank).slice(0, 5)
        });
      }
      state.examPaper = paper;
    } catch (err) {
      state.error = err.message || "Could not build the paper.";
    }
    state.loading = false;
    render();
  }

  function launchConfetti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#0e7c76", "#e9a825", "#e07a5f", "#3d8b6e", "#fff"];
    const bits = [];
    for (let i = 0; i < 90; i++) {
      bits.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.4,
        r: 4 + Math.random() * 6,
        c: colors[i % colors.length],
        vy: 2 + Math.random() * 3.5,
        vx: -1.5 + Math.random() * 3,
        a: Math.random() * Math.PI
      });
    }
    cancelAnimationFrame(confettiTimer);
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bits.forEach(function (b) {
        b.x += b.vx;
        b.y += b.vy;
        b.a += 0.08;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.a);
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.r, -b.r / 2, b.r * 2, b.r);
        ctx.restore();
      });
      confettiTimer = requestAnimationFrame(tick);
    })();
    setTimeout(stopConfetti, 2800);
  }

  function stopConfetti() {
    cancelAnimationFrame(confettiTimer);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  app.addEventListener("click", function (e) {
    const t = e.target.closest("[data-go], [data-action], [data-grade], [data-pick-subject], [data-length], [data-opt]");
    if (!t) return;
    ensureAudio();

    if (t.dataset.go) {
      state.screen = t.dataset.go;
      render();
      return;
    }
    if (t.dataset.grade) {
      state.grade = Number(t.dataset.grade);
      state.screen = "subject";
      render();
      return;
    }
    if (t.dataset.pickSubject) {
      state.subject = t.dataset.pickSubject;
      state.screen = "length";
      state.error = "";
      render();
      return;
    }
    if (t.dataset.length) {
      state.length = Number(t.dataset.length);
      beginQuiz();
      return;
    }
    if (t.dataset.opt != null && !state.revealed) {
      const i = Number(t.dataset.opt);
      state.picked[state.index] = i;
      state.revealed = true;
      if (i === state.questions[state.index].answer) playCorrect();
      else playWrong();
      render();
      return;
    }
    const action = t.dataset.action;
    if (action === "start") startFromHome();
    if (action === "toggle-sound") {
      state.sound = !state.sound;
      localStorage.setItem("psq-sound", state.sound ? "on" : "off");
      render();
    }
    if (action === "next") {
      if (state.index >= state.questions.length - 1) {
        state.screen = "result";
      } else {
        state.index += 1;
        state.revealed = false;
      }
      render();
    }
    if (action === "review") {
      state.screen = "review";
      render();
    }
    if (action === "certificate") {
      state.screen = "certificate";
      render();
    }
    if (action === "again") beginQuiz();
    if (action === "print-exam") buildExam();
    if (action === "print") window.print();
  });

  document.addEventListener("keydown", function (e) {
    if (state.screen === "quiz" && state.revealed && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      const btn = app.querySelector('[data-action="next"]');
      if (btn) btn.click();
      return;
    }
    if (state.screen !== "quiz" || state.revealed) return;
    const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
    if (map[e.key] != null) {
      const btn = app.querySelector('[data-opt="' + map[e.key] + '"]');
      if (btn) btn.click();
    }
  });

  render();
})();
