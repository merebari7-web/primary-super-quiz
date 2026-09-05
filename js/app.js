(function () {
  "use strict";

  const app = document.getElementById("app");
  const canvas = document.getElementById("confetti");
  const LETTERS = ["A", "B", "C", "D"];
  const bankCache = {};
  const SK = "psq-settings-v4";

  const EMPTY_PROGRESS = {
    xp: 0, streak: 0, lastDay: "", quizzes: 0, badges: [],
    best: {}, history: [], missed: {}, dailyDate: "", dailyBest: 0,
    weekKey: "", weekQuizzes: 0, lastRank: "hatchling", days: {},
    studySec: 0, studyByDay: {}, favs: [],
    flashcards: { box1: [], box2: [], box3: [] },
    confidenceStats: { mastered: 0, misconceptions: 0, lucky: 0, growth: 0 },
    topicMastery: {}
  };

  const settings = loadJSON(SK, {
    sound: true, music: false, tts: false, ttsSpeed: 1.0, ttsHighlight: true,
    theme: "light", font: "nunito", fontSize: 100,
    dark: false, large: false, contrast: false, autoDark: false,
    focus: false, calm: false, confidenceMode: true
  });

  let progress = EMPTY_PROGRESS;

  const state = {
    screen: "home",
    name: localStorage.getItem("psq-name") || "",
    grade: (function () {
      const n = Number(localStorage.getItem("psq-grade") || "");
      return n >= 1 && n <= 6 ? n : null;
    })(),
    subject: null,
    selectedTopic: null,
    group: "all",
    query: "",
    length: 20,
    mode: "practice", // "practice", "exam", "timed", "flashcard"
    questions: [],
    index: 0,
    picked: [],
    confidence: [],
    revealed: false,
    hidden: {},
    used5050: false,
    usedSkip: false,
    combo: 0,
    maxCombo: 0,
    loading: false,
    error: "",
    toast: "",
    daily: false,
    lightning: false,
    timer: 0,
    timedSec: 20,
    paused: false,
    xpGained: 0,
    newBadges: [],
    examPaper: null,
    user: null,
    reviewFilter: "all",
    reviewQuery: "",
    usedHint: false,
    hintText: "",
    quizStartedAt: 0,
    elapsedSec: 0,
    flagged: {},
    scratchpadOpen: false,
    scratchpadTool: "pen",
    scratchpadColor: "#0e7c76",
    scratchpadSize: 4,
    flashcardDeck: "missed",
    flashcardIndex: 0,
    flashcardFlipped: false,
    classRoster: loadJSON("psq-class-roster-v1", []),
    activeClassGroup: localStorage.getItem("psq-class-group") || "Default Class",
    projectorIndex: 0,
    projectorRevealed: false,
    wsGrade: 1,
    wsSubject: "maths",
    wsCount: 20,
    wsLevel: "standard",
    availableTopics: []
  };

  let audioCtx = null;
  let confettiTimer = null;
  let tickTimer = null;
  let clockTimer = null;
  let toastTimer = null;
  let ttsUtterance = null;
  let scratchpadCtx = null;
  let isDrawing = false;
  let lastX = 0, lastY = 0;

  applyChrome();
  initAudio();
  loadCurrentProgress();

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const data = JSON.parse(raw);
      if (fallback && typeof fallback === "object" && !Array.isArray(fallback)) {
        return Object.assign({}, fallback, data);
      }
      return data;
    } catch (e) { return fallback; }
  }

  function saveSettings() {
    localStorage.setItem(SK, JSON.stringify(settings));
    applyChrome();
  }

  function currentUser() {
    try {
      const u = JSON.parse(localStorage.getItem("psq-user") || "null");
      return u && u.sub ? u : null;
    } catch (e) { return null; }
  }

  function uid() {
    const u = currentUser();
    if (u && u.sub) return u.sub;
    ensureProfiles();
    return localStorage.getItem("psq-profile-id") || "p1";
  }

  function progressKey() { return "psq-progress-v4-" + uid(); }

  function loadCurrentProgress() {
    progress = loadJSON(progressKey(), Object.assign({}, EMPTY_PROGRESS));
    if (!progress.flashcards) progress.flashcards = { box1: [], box2: [], box3: [] };
    if (!progress.confidenceStats) progress.confidenceStats = { mastered: 0, misconceptions: 0, lucky: 0, growth: 0 };
    if (!progress.topicMastery) progress.topicMastery = {};
  }

  function saveProgress() {
    localStorage.setItem(progressKey(), JSON.stringify(progress));
  }

  function listProfiles() { return loadJSON("psq-profiles-v1", []); }
  function saveProfiles(list) { localStorage.setItem("psq-profiles-v1", JSON.stringify(list)); }

  function ensureProfiles() {
    let list = listProfiles();
    if (!list || !list.length) {
      list = [{ id: "p1", name: state.name || "Pupil 1", grade: state.grade || 1, created: Date.now() }];
      saveProfiles(list);
      localStorage.setItem("psq-profile-id", "p1");
    }
  }

  function switchProfile(pid) {
    const list = listProfiles();
    const found = list.find(function (x) { return x.id === pid; });
    if (!found) return;
    localStorage.setItem("psq-profile-id", pid);
    state.name = found.name || "";
    state.grade = found.grade || 1;
    localStorage.setItem("psq-name", state.name);
    localStorage.setItem("psq-grade", String(state.grade));
    loadCurrentProgress();
    toast("Switched to profile: " + found.name);
    render();
  }

  function schoolName() { return localStorage.getItem("psq-school-name") || ""; }
  function setSchoolName(val) { localStorage.setItem("psq-school-name", String(val || "").trim()); }

  function applyChrome() {
    let theme = settings.theme || "light";
    if (settings.dark) theme = "dark";
    if (settings.contrast) theme = "solar";
    if (settings.autoDark && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.font = settings.font || "nunito";
    document.documentElement.dataset.size = String(settings.fontSize || 100);
    document.documentElement.classList.toggle("focus-ui", !!settings.focus);
    document.documentElement.classList.toggle("calm", !!settings.calm);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"'`]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" }[c];
    });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ==========================================================================
     AUDIO SYNTHESIS & SOUND EFFECTS (Pure Web Audio API - Zero External Files)
     ========================================================================== */

  function initAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !audioCtx) {
        audioCtx = new AudioCtx();
      }
    } catch (e) {}
  }

  function playTone(freq, dur, type, gainVal) {
    if (!settings.sound) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    try {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, audioCtx.currentTime);
      g.gain.setValueAtTime(gainVal || 0.08, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }

  function playCorrect() {
    playTone(523.25, 0.12, "triangle", 0.08); // C5
    setTimeout(function () { playTone(659.25, 0.12, "triangle", 0.08); }, 80); // E5
    setTimeout(function () { playTone(783.99, 0.22, "triangle", 0.1); }, 160); // G5
  }

  function playWrong() {
    playTone(196.00, 0.25, "square", 0.04);
  }

  function playBadgeFanfare() {
    playTone(440.00, 0.1, "triangle", 0.08);
    setTimeout(function () { playTone(554.37, 0.1, "triangle", 0.08); }, 90);
    setTimeout(function () { playTone(659.25, 0.1, "triangle", 0.08); }, 180);
    setTimeout(function () { playTone(880.00, 0.35, "triangle", 0.12); }, 270);
  }

  function playTick() {
    playTone(800, 0.03, "sine", 0.03);
  }

  /* ==========================================================================
     TEXT TO SPEECH (Web Speech API with Synchronous Visual Karaoke Highlighting)
     ========================================================================== */

  function stopSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function speakText(text, onBoundary) {
    if (!("speechSynthesis" in window)) {
      toast("Read-aloud is not supported on this browser.");
      return;
    }
    stopSpeech();
    const clean = text.replace(/<[^>]*>/g, "").trim();
    if (!clean) return;

    ttsUtterance = new SpeechSynthesisUtterance(clean);
    ttsUtterance.rate = settings.ttsSpeed || 1.0;
    ttsUtterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find(function (v) {
      return (v.lang && (v.lang.startsWith("en-") || v.lang === "en"));
    });
    if (engVoice) ttsUtterance.voice = engVoice;

    if (onBoundary) {
      ttsUtterance.onboundary = function (e) {
        if (e.name === "word") {
          onBoundary(e.charIndex, e.charLength || 6);
        }
      };
    }

    ttsUtterance.onend = function () {
      const qEl = document.querySelector(".question");
      if (qEl) qEl.innerHTML = esc(state.questions[state.index] ? state.questions[state.index].q : "");
    };

    window.speechSynthesis.speak(ttsUtterance);
  }

  function speakCurrentQuestion() {
    const q = state.questions[state.index];
    if (!q) return;
    const full = q.q + ". Option A: " + q.options[0] + ". Option B: " + q.options[1] + ". Option C: " + q.options[2] + ". Option D: " + q.options[3];
    speakText(full, function (charIdx, charLen) {
      if (!settings.ttsHighlight) return;
      const qEl = document.querySelector(".question");
      if (qEl && charIdx < q.q.length) {
        const pre = q.q.slice(0, charIdx);
        const word = q.q.slice(charIdx, charIdx + charLen);
        const post = q.q.slice(charIdx + charLen);
        qEl.innerHTML = esc(pre) + `<span class="tts-highlight">${esc(word)}</span>` + esc(post);
      }
    });
  }

  /* ==========================================================================
     DATA LOADING & QUIZ ENGINE
     ========================================================================== */

  async function loadBank(grade, subj) {
    const key = `p${grade}/${subj}`;
    if (bankCache[key]) return bankCache[key];
    const url = `data/p${grade}/${subj}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not load questions for ${subj} Primary ${grade}`);
    const data = await res.json();
    bankCache[key] = data;
    return data;
  }

  async function startQuiz(subj, len, mode, topicFilter) {
    if (!state.grade) {
      state.screen = "grade";
      render();
      return;
    }
    state.subject = subj;
    state.length = len || 20;
    state.mode = mode || "practice";
    state.selectedTopic = topicFilter || null;
    state.loading = true;
    state.error = "";
    render();

    try {
      let bank = await loadBank(state.grade, subj);
      if (topicFilter) {
        const filtered = bank.filter(function (q) { return q.topic === topicFilter; });
        if (filtered.length >= 5) bank = filtered;
      }
      const pool = shuffle(bank);
      const chosen = pool.slice(0, Math.min(state.length, pool.length)).map(function (q) {
        return Object.assign({}, q, { subject: subj });
      });

      state.questions = chosen;
      state.index = 0;
      state.picked = new Array(chosen.length).fill(null);
      state.confidence = new Array(chosen.length).fill(null);
      state.hidden = {};
      state.revealed = false;
      state.used5050 = false;
      state.usedSkip = false;
      state.usedHint = false;
      state.hintText = "";
      state.combo = 0;
      state.maxCombo = 0;
      state.quizStartedAt = Date.now();
      state.elapsedSec = 0;
      state.flagged = {};
      state.loading = false;
      state.screen = "quiz";
      render();

      if (state.mode === "timed") {
        state.timer = state.timedSec || 20;
        startTickTimer();
      }
      startClockTimer();

      if (settings.tts) {
        setTimeout(speakCurrentQuestion, 300);
      }
    } catch (err) {
      state.loading = false;
      state.error = err.message || "Failed to load paper.";
      render();
    }
  }

  async function openTopicDrill(subj) {
    state.subject = subj;
    state.loading = true;
    render();
    try {
      const bank = await loadBank(state.grade || 1, subj);
      const topicMap = {};
      bank.forEach(function (q) {
        const t = q.topic || "Core Foundations";
        topicMap[t] = (topicMap[t] || 0) + 1;
      });
      state.availableTopics = Object.keys(topicMap).map(function (t) {
        return { name: t, count: topicMap[t] };
      });
      state.loading = false;
      state.screen = "topics";
      render();
    } catch (e) {
      state.loading = false;
      state.error = "Could not load topics.";
      render();
    }
  }

  async function startDailyChallenge() {
    if (!state.grade) state.grade = 3;
    state.daily = true;
    state.subject = "english";
    state.mode = "practice";
    state.loading = true;
    render();

    try {
      const allSubjs = Object.keys(window.SUBJECTS);
      const chosenSubjs = shuffle(allSubjs).slice(0, 10);
      const questions = [];

      for (let i = 0; i < chosenSubjs.length; i++) {
        const s = chosenSubjs[i];
        const bank = await loadBank(state.grade, s);
        const q = shuffle(bank)[0];
        questions.push(Object.assign({}, q, { subject: s }));
      }

      state.questions = questions;
      state.length = 10;
      state.index = 0;
      state.picked = new Array(10).fill(null);
      state.confidence = new Array(10).fill(null);
      state.revealed = false;
      state.hidden = {};
      state.used5050 = false;
      state.usedSkip = false;
      state.usedHint = false;
      state.combo = 0;
      state.maxCombo = 0;
      state.quizStartedAt = Date.now();
      state.loading = false;
      state.screen = "quiz";
      render();
      startClockTimer();
    } catch (e) {
      state.loading = false;
      state.error = "Could not load Daily Challenge.";
      render();
    }
  }

  async function startSmartPractice() {
    if (!state.grade) state.grade = 3;
    state.mode = "practice";
    state.loading = true;
    render();

    try {
      const g = state.grade;
      const missedList = progress.missed[g] || [];
      let questions = [];

      if (missedList.length >= 5) {
        questions = shuffle(missedList).slice(0, 10);
      } else {
        const subjs = shuffle(Object.keys(window.SUBJECTS)).slice(0, 5);
        for (const s of subjs) {
          const bank = await loadBank(g, s);
          questions.push.apply(questions, shuffle(bank).slice(0, 2).map(q => Object.assign({}, q, { subject: s })));
        }
      }

      state.questions = questions.slice(0, 10);
      state.length = state.questions.length;
      state.index = 0;
      state.picked = new Array(state.length).fill(null);
      state.confidence = new Array(state.length).fill(null);
      state.revealed = false;
      state.hidden = {};
      state.used5050 = false;
      state.usedSkip = false;
      state.usedHint = false;
      state.combo = 0;
      state.maxCombo = 0;
      state.quizStartedAt = Date.now();
      state.loading = false;
      state.screen = "quiz";
      render();
      startClockTimer();
    } catch (e) {
      state.loading = false;
      state.error = "Could not generate Smart Practice.";
      render();
    }
  }

  async function startChampionMix() {
    if (!state.grade) state.grade = 3;
    state.mode = "practice";
    state.loading = true;
    render();

    try {
      const subjs = Object.keys(window.SUBJECTS);
      const questions = [];
      for (const s of subjs) {
        const bank = await loadBank(state.grade, s);
        questions.push(Object.assign({}, shuffle(bank)[0], { subject: s }));
      }
      state.questions = shuffle(questions).slice(0, 16);
      state.length = state.questions.length;
      state.index = 0;
      state.picked = new Array(state.length).fill(null);
      state.confidence = new Array(state.length).fill(null);
      state.revealed = false;
      state.hidden = {};
      state.used5050 = false;
      state.usedSkip = false;
      state.combo = 0;
      state.maxCombo = 0;
      state.quizStartedAt = Date.now();
      state.loading = false;
      state.screen = "quiz";
      render();
      startClockTimer();
    } catch (e) {
      state.loading = false;
      state.error = "Could not load Champion Mix.";
      render();
    }
  }

  async function startLightning5() {
    if (!state.grade) state.grade = 3;
    state.lightning = true;
    state.mode = "timed";
    state.timedSec = 12;
    await startQuiz(state.subject || "maths", 5, "timed");
  }

  /* ==========================================================================
     TIMERS & SCORE CALCULATION
     ========================================================================== */

  function stopTickTimer() { clearInterval(tickTimer); tickTimer = null; }
  function stopClockTimer() { clearInterval(clockTimer); clockTimer = null; }

  function startClockTimer() {
    if (clockTimer) return;
    clockTimer = setInterval(function () {
      if (state.screen !== "quiz" || state.paused) return;
      state.elapsedSec = Math.floor((Date.now() - (state.quizStartedAt || Date.now())) / 1000);
      const el = document.getElementById("sess-clock");
      if (el) el.textContent = "⏱ " + fmtDur(state.elapsedSec);
    }, 1000);
  }

  function startTickTimer() {
    stopTickTimer();
    tickTimer = setInterval(function () {
      if (state.screen !== "quiz" || state.paused) return;
      state.timer -= 1;
      const el = document.querySelector(".timer-wrap");
      if (el) el.textContent = "⏱ " + state.timer + "s";
      if (state.timer <= 3 && state.timer > 0) playTick();
      if (state.timer <= 0) {
        stopTickTimer();
        if (!state.revealed) {
          submitAnswer(-1);
        }
      }
    }, 1000);
  }

  function submitAnswer(optIdx) {
    if (state.revealed && state.mode !== "exam") return;
    state.picked[state.index] = optIdx;
    const q = state.questions[state.index];
    const isCorrect = (optIdx === q.answer);

    if (state.mode !== "exam") {
      state.revealed = true;
      if (isCorrect) {
        state.combo += 1;
        if (state.combo > state.maxCombo) state.maxCombo = state.combo;
        playCorrect();
      } else {
        state.combo = 0;
        playWrong();
        recordMissed(q);
      }
    }

    render();
  }

  function recordMissed(q) {
    const g = state.grade || 1;
    if (!progress.missed[g]) progress.missed[g] = [];
    const exists = progress.missed[g].some(function (item) { return item.q === q.q; });
    if (!exists) {
      progress.missed[g].unshift(q);
      if (progress.missed[g].length > 100) progress.missed[g].pop();
    }
    // Add to Leitner Flashcard Box 1 for spaced recall
    if (!progress.flashcards.box1.some(function (item) { return item.q === q.q; })) {
      progress.flashcards.box1.unshift(q);
      if (progress.flashcards.box1.length > 60) progress.flashcards.box1.pop();
    }
  }

  function nextQuestion() {
    stopSpeech();
    stopTickTimer();
    state.revealed = false;
    state.hintText = "";
    state.usedHint = false;

    if (state.index < state.questions.length - 1) {
      state.index += 1;
      if (state.mode === "timed") {
        state.timer = state.timedSec || 20;
        startTickTimer();
      }
      render();
      if (settings.tts) setTimeout(speakCurrentQuestion, 300);
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    stopClockTimer();
    stopTickTimer();
    stopSpeech();

    const total = state.questions.length;
    let correctCount = 0;
    for (let i = 0; i < total; i++) {
      if (state.picked[i] === state.questions[i].answer) correctCount += 1;
    }

    const pct = Math.round((correctCount / total) * 100);
    const xpBase = correctCount * 10;
    const xpBonus = (pct === 100 ? 50 : pct >= 80 ? 25 : 0) + (state.maxCombo >= 5 ? 20 : 0);
    const xpGained = xpBase + xpBonus;

    progress.xp += xpGained;
    progress.quizzes += 1;
    progress.studySec = (progress.studySec || 0) + (state.elapsedSec || 60);

    const todayStr = new Date().toISOString().slice(0, 10);
    if (!progress.studyByDay) progress.studyByDay = {};
    progress.studyByDay[todayStr] = (progress.studyByDay[todayStr] || 0) + (state.elapsedSec || 60);

    // Update streak
    if (progress.lastDay !== todayStr) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (progress.lastDay === yesterday) progress.streak += 1;
      else progress.streak = 1;
      progress.lastDay = todayStr;
    }

    // Update history
    const histEntry = {
      date: todayStr,
      grade: state.grade,
      subject: state.subject || "mixed",
      mode: state.mode,
      score: correctCount,
      total: total,
      pct: pct,
      time: state.elapsedSec
    };
    if (!progress.history) progress.history = [];
    progress.history.unshift(histEntry);
    if (progress.history.length > 50) progress.history.pop();

    // Update best record
    const bestKey = `${state.grade}/${state.subject || "mixed"}`;
    if (!progress.best[bestKey] || pct > progress.best[bestKey].pct) {
      progress.best[bestKey] = { pct: pct, score: correctCount, total: total, date: todayStr };
    }

    // Metacognitive Calibration calculation
    for (let i = 0; i < total; i++) {
      const ok = state.picked[i] === state.questions[i].answer;
      const conf = state.confidence[i] || "thinking";
      if (conf === "sure" && ok) progress.confidenceStats.mastered += 1;
      else if (conf === "sure" && !ok) progress.confidenceStats.misconceptions += 1;
      else if (conf === "guess" && ok) progress.confidenceStats.lucky += 1;
      else progress.confidenceStats.growth += 1;
    }

    // Check Badges
    state.newBadges = checkBadges(pct, correctCount, total);
    state.xpGained = xpGained;
    state.screen = "result";

    saveProgress();
    if (pct >= 80) playBadgeFanfare();
    render();
    if (pct >= 70) launchConfetti();
  }

  function checkBadges(pct, correctCount, total) {
    const newlyEarned = [];
    function grant(id) {
      if (progress.badges.indexOf(id) < 0) {
        progress.badges.push(id);
        newlyEarned.push(id);
      }
    }

    if (progress.quizzes >= 1) grant("first");
    if (pct === 100) grant("perfect");
    if (progress.streak >= 3) grant("streak3");
    if (progress.streak >= 7) grant("streak7");
    if (total >= 100) grant("hundred");
    if (state.daily && pct >= 80) grant("daily");
    if (progress.xp >= 650) grant("scholar");
    if (progress.xp >= 2000) grant("champion");
    if (state.mode === "exam") grant("exam");
    if (state.mode === "timed" && pct >= 75) grant("speed");
    if (progress.studySec >= 1800) grant("bookworm");
    if (state.maxCombo >= 5) grant("bolt");
    if (progress.flashcards.box3.length >= 5) grant("flashcard");
    if (progress.confidenceStats.mastered >= 15) grant("calibrated");

    return newlyEarned;
  }

  /* ==========================================================================
     CONFETTI ANIMATION
     ========================================================================== */

  function launchConfetti() {
    if (settings.calm || !canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const particles = [];
    const colors = ["#0e7c76", "#e9a825", "#e07a5f", "#10b981", "#0284c7", "#4f46e5"];

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        speed: Math.random() * 4 + 3
      });
    }

    let start = Date.now();
    function step() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(function (p) {
        p.y += p.speed;
        p.x += Math.sin(p.tilt);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      if (Date.now() - start < 2800) {
        confettiTimer = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
    step();
  }

  /* ==========================================================================
     UI RENDERING ENGINE
     ========================================================================== */

  function renderTopBar(backTarget) {
    const g = state.grade ? window.GRADE_INFO[state.grade].label : "Class 1–6";
    const backBtn = backTarget
      ? `<button class="icon-btn" data-go="${backTarget}" aria-label="Go back">←</button>`
      : `<div class="brand" data-go="home"><img src="images/favicon.png" alt=""><span>Super Quiz</span></div>`;

    return `
      <header class="topbar no-print">
        <div style="display:flex;align-items:center;gap:12px;">
          ${backBtn}
          <span class="chip" data-go="account" style="cursor:pointer;">👤 ${esc(state.name || "Scholar")} · P${state.grade || 1}</span>
        </div>
        <div class="top-actions">
          <button class="icon-btn" data-action="toggle-sound" title="Toggle sound FX">${settings.sound ? "🔊" : "🔇"}</button>
          <button class="icon-btn" data-go="flashcards" title="Spaced Recall Flashcards">🗂️</button>
          <button class="icon-btn" data-go="teachers" title="Teacher & Classroom Hub">👨‍🏫</button>
          <button class="icon-btn" data-go="account" title="Trophy Showcase & Badges">🏆</button>
          <button class="icon-btn" data-go="settings" title="Settings">⚙️</button>
        </div>
      </header>`;
  }

  function renderBreadcrumbs(crumbs) {
    const list = crumbs.map(function (c, i) {
      if (i === crumbs.length - 1) return `<span>${esc(c.label)}</span>`;
      return `<button data-go="${c.go}">${esc(c.label)}</button> &gt; `;
    }).join("");
    return `<nav class="crumbs no-print" aria-label="Breadcrumb">${list}</nav>`;
  }

  function renderHome() {
    const resume = loadJSON("psq-resume-quiz", null);
    const contBanner = resume && resume.questions && resume.questions.length
      ? `<div class="continue-banner">
           <div>
             <strong>Resume Incomplete Quiz</strong>
             <p>${esc(subjectName(resume.subject))} · Q${(resume.index || 0) + 1}/${resume.questions.length}</p>
           </div>
           <button class="btn btn-sun btn-sm" data-action="resume-quiz-saved">Resume</button>
         </div>` : "";

    const r = rankFor(progress.xp);

    return `
      <div class="wrap">
        ${renderTopBar(null)}
        ${contBanner}
        <section class="hero">
          <div>
            <div class="kicker">Scientifically Designed · Primary 1–6 · 100% Offline</div>
            <h1>Primary Super Quiz</h1>
            <p class="lead">World-class retrieval practice for English-medium primary classrooms and homes. 16 subjects, 9,600 unique curriculum questions, metacognitive calibration, and printable teacher papers.</p>
            <div class="top-actions" style="margin-top:16px;">
              <button class="btn btn-primary" data-action="start">Start Practising →</button>
              <button class="btn btn-ghost" data-go="curriculum">Curriculum Map 🗺️</button>
              <button class="btn btn-ghost" data-go="teachers">Teacher Hub 👨‍🏫</button>
            </div>
          </div>
          <div class="hero-art">
            <img src="images/hero-kids.jpg" alt="Students engaging in learning">
            <span class="art-badge">16 Subjects · 9,600 MCQs</span>
          </div>
        </section>

        <div class="home-stats">
          <div class="stat-tile"><b>${progress.xp}</b><span>Total XP</span></div>
          <div class="stat-tile"><b>${progress.streak}🔥</b><span>Day Streak</span></div>
          <div class="stat-tile"><b>${progress.quizzes}</b><span>Quizzes</span></div>
          <div class="stat-tile"><b>${accuracyPct()}%</b><span>Accuracy</span></div>
          <div class="stat-tile"><b>${r.icon}</b><span>${r.name}</span></div>
          <div class="stat-tile"><b>${fmtDur(progress.studySec || 0)}</b><span>Study Time</span></div>
        </div>

        <h2 class="section-title" style="margin-top:28px;">Learning Modes</h2>
        <p class="sub">Choose an active learning path designed by cognitive scientists and primary educators.</p>

        <div class="play-row">
          <div class="play-tile daily" data-action="launch-daily">
            <span class="ico">☀️</span>
            <strong>Daily Challenge</strong>
            <p>10 multidisciplinary questions to build continuous daily learning habit.</p>
          </div>
          <div class="play-tile smart" data-action="launch-smart">
            <span class="ico">🧠</span>
            <strong>Smart Practice</strong>
            <p>Adaptive retrieval targeting previous error patterns and weak areas.</p>
          </div>
          <div class="play-tile flash" data-go="flashcards">
            <span class="ico">🗂️</span>
            <strong>Spaced Recall</strong>
            <p>Leitner 3-box active flashcard revision for long-term memory mastery.</p>
          </div>
          <div class="play-tile bolt" data-action="launch-lightning">
            <span class="ico">⚡</span>
            <strong>Lightning 5</strong>
            <p>Rapid-fire 12-second speed challenge to develop retrieval fluency.</p>
          </div>
          <div class="play-tile mix" data-action="launch-mix">
            <span class="ico">🌈</span>
            <strong>Champion Mix</strong>
            <p>Interleaved cross-subject paper proven to enhance memory retention.</p>
          </div>
          <div class="play-tile curriculum" data-go="curriculum">
            <span class="ico">🏛️</span>
            <strong>Curriculum Standards</strong>
            <p>Explore international curriculum alignment (NERDC, Cambridge, UK, US, IB).</p>
          </div>
        </div>

        <section class="trust-row" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;margin:32px 0;">
          <div class="stat-tile"><b>16</b><span>Subjects Covered</span></div>
          <div class="stat-tile"><b>9,600</b><span>100% Unique Questions</span></div>
          <div class="stat-tile"><b>P1–P6</b><span>Developmental Levels</span></div>
          <div class="stat-tile"><b>100%</b><span>Offline PWA Ready</span></div>
        </section>

        ${renderFooter()}
      </div>`;
  }

  function renderGrades() {
    const cards = [1, 2, 3, 4, 5, 6].map(function (g) {
      const info = window.GRADE_INFO[g];
      const isCurrent = state.grade === g;
      return `
        <button class="card-btn ${isCurrent ? "on" : ""}" data-set-grade="${g}">
          <div class="grade-no">${g}</div>
          <h3>${info.label}</h3>
          <p style="font-weight:700;color:var(--teal);margin-bottom:4px;">${info.international}</p>
          <p>${info.ages} · ${info.blurb}</p>
        </button>`;
    }).join("");

    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Select Class Level" }])}
        <div class="kicker">Universal Primary Standards</div>
        <h2 class="section-title">Select Your Class Grade</h2>
        <p class="sub">Questions and cognitive difficulty are developmentally calibrated from Primary 1 to Primary 6.</p>
        <div class="grid-grades">${cards}</div>
      </div>`;
  }

  function renderSubjects() {
    const g = state.grade || 1;
    const group = state.group || "all";
    const qy = (state.query || "").toLowerCase().trim();

    const groupBtns = window.SUBJECT_GROUPS.map(function (grp) {
      return `<button class="chip ${group === grp.id ? "on" : ""}" data-set-group="${grp.id}">${grp.label}</button>`;
    }).join("");

    const subjCards = Object.keys(window.SUBJECTS).map(function (k) {
      const s = window.SUBJECTS[k];
      if (group !== "all" && s.group !== group) return "";
      if (qy && s.name.toLowerCase().indexOf(qy) < 0 && s.desc.toLowerCase().indexOf(qy) < 0) return "";

      const best = progress.best[`${g}/${k}`];
      const bestTxt = best ? `Best: ${best.pct}% (${best.score}/${best.total})` : "Not attempted yet";

      return `
        <div class="subject-card" data-pick-subj="${k}">
          <div class="sub-head">
            <span class="sub-icon">${s.icon}</span>
            <span class="chip">${s.short}</span>
          </div>
          <h3>${s.name}</h3>
          <p>${s.desc}</p>
          <div style="font-size:0.8rem;font-weight:700;color:var(--teal);margin-bottom:12px;">${bestTxt}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" data-pick-subj="${k}">Practice →</button>
            <button class="btn btn-ghost btn-sm" data-drill-subj="${k}">Topics</button>
          </div>
        </div>`;
    }).join("");

    return `
      <div class="wrap">
        ${renderTopBar("grade")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: window.GRADE_INFO[g].label, go: "grade" }, { label: "Subjects" }])}
        <div class="kicker">${window.GRADE_INFO[g].label} · ${window.GRADE_INFO[g].international}</div>
        <h2 class="section-title">Select a Subject Domain</h2>
        <p class="sub">16 comprehensive subjects aligned with national and international primary frameworks.</p>
        <div class="chip-group">${groupBtns}</div>
        <div style="margin-bottom:20px;">
          <input type="text" id="subj-search" class="btn btn-ghost" style="width:100%;max-width:400px;text-align:left;" placeholder="🔍 Search subjects or topics..." value="${esc(state.query)}">
        </div>
        <div class="grid-subjects">${subjCards || `<div class="empty-state">No subjects matched your filter.</div>`}</div>
      </div>`;
  }

  function renderTopicDrill() {
    const s = window.SUBJECTS[state.subject] || { name: "Subject Topics", icon: "📘" };
    const g = state.grade || 1;

    return `
      <div class="wrap">
        ${renderTopBar("subject")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: window.GRADE_INFO[g].label, go: "grade" }, { label: s.name, go: "subject" }, { label: "Subtopics" }])}
        <div class="kicker">${s.icon} ${s.name} · Primary ${g}</div>
        <h2 class="section-title">Focused Subtopic Mastery</h2>
        <p class="sub">Select a targeted curriculum subtopic to practice specific learning objectives and skills.</p>

        <div class="grid-grades" style="margin-top:20px;">
          ${state.availableTopics.map(function (top) {
            return `
              <div class="card-btn">
                <h4>🎯 ${esc(top.name)}</h4>
                <p style="color:var(--muted);font-size:0.88rem;margin:8px 0 14px;">${top.count} questions available in bank</p>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <button class="btn btn-primary btn-sm" data-start-topic-quiz="${esc(top.name)}" data-topic-len="10">10 Questions</button>
                  <button class="btn btn-ghost btn-sm" data-start-topic-quiz="${esc(top.name)}" data-topic-len="20">20 Questions</button>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  function renderLengthSetup() {
    const s = window.SUBJECTS[state.subject] || { name: "Subject", icon: "📘" };
    const g = state.grade || 1;

    const lengthBtns = window.QUIZ_LENGTHS.map(function (n) {
      const isSel = state.length === n;
      return `<button class="btn ${isSel ? "btn-primary" : "btn-ghost"}" data-set-len="${n}">${n} Questions</button>`;
    }).join("");

    const modes = [
      { id: "practice", title: "Practice Mode", desc: "Formative: Instant feedback, hints, 50/50, and step-by-step explanations." },
      { id: "exam", title: "Exam Mode", desc: "Summative: Simulates real exam conditions with no hints until final score." },
      { id: "timed", title: "Timed Challenge", desc: "Fluency: 20 seconds per question to build cognitive automaticity." }
    ].map(function (m) {
      return `
        <button class="card-btn ${state.mode === m.id ? "on" : ""}" data-set-mode="${m.id}">
          <h4>${m.title}</h4>
          <p>${m.desc}</p>
        </button>`;
    }).join("");

    return `
      <div class="wrap">
        ${renderTopBar("subject")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: window.GRADE_INFO[g].label, go: "grade" }, { label: s.name, go: "subject" }, { label: "Setup" }])}
        <div class="kicker">${window.GRADE_INFO[g].label} · ${s.icon} ${s.name}</div>
        <h2 class="section-title">Configure Practice Session</h2>
        ${state.selectedTopic ? `<div class="hint-box">🎯 Topic Filter: <strong>${esc(state.selectedTopic)}</strong> <button class="btn btn-ghost btn-sm" data-clear-topic style="margin-left:8px;">Clear Filter</button></div>` : ""}
        <div class="grid-grades" style="margin-bottom:24px;">${modes}</div>
        <h3 style="margin-bottom:12px;font-size:1.1rem;">Number of Questions</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px;">${lengthBtns}</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-primary" data-action="launch-quiz">${state.loading ? "Loading..." : "Begin Quiz →"}</button>
          <button class="btn btn-ghost" data-go="subject">Change Subject</button>
        </div>
      </div>`;
  }

  /* ==========================================================================
     QUIZ INTERACTION & WHITEBOARD SCRATCHPAD
     ========================================================================== */

  function renderQuiz() {
    const q = state.questions[state.index];
    if (!q) return `<div class="wrap">${renderTopBar("subject")}<p>Loading questions...</p></div>`;

    const total = state.questions.length;
    const pct = Math.round(((state.index + 1) / total) * 100);
    const s = window.SUBJECTS[q.subject] || window.SUBJECTS[state.subject] || { name: "Quiz", icon: "📘" };
    const exam = state.mode === "exam";
    const showFeedback = state.revealed && !exam;
    const hide = state.hidden[state.index] || [];

    const optionsHtml = q.options.map(function (opt, i) {
      if (hide.indexOf(i) >= 0) return "";
      let cls = "opt";
      if (showFeedback) {
        if (i === q.answer) cls += " correct";
        else if (i === state.picked[state.index]) cls += " wrong";
        else cls += " dim";
      } else if (exam && state.picked[state.index] === i) {
        cls += " correct";
      }
      return `
        <button class="${cls}" data-opt="${i}" ${showFeedback ? "disabled" : ""}>
          <span class="badge">${LETTERS[i]}</span>
          <span>${esc(opt)}</span>
        </button>`;
    }).join("");

    let feedbackHtml = "";
    if (showFeedback) {
      const ok = state.picked[state.index] === q.answer;
      feedbackHtml = `
        <div class="feedback ${ok ? "ok" : "no"}" role="status">
          <strong>${ok ? "✅ Correct! " : "❌ Not quite. The correct answer is: " + esc(q.options[q.answer]) + ". "}</strong>
          <p style="margin-top:6px;">${esc(q.explain)}</p>
        </div>`;
    }

    const confVal = state.confidence[state.index];
    const confidenceHtml = settings.confidenceMode && !exam && !state.revealed ? `
      <div class="confidence-box">
        <p>Rate your confidence before picking:</p>
        <div class="conf-options">
          <button class="conf-btn ${confVal === "sure" ? "selected" : ""}" data-set-conf="sure">🌟 I'm Sure</button>
          <button class="conf-btn ${confVal === "think" ? "selected" : ""}" data-set-conf="think">🤔 Thinking</button>
          <button class="conf-btn ${confVal === "guess" ? "selected" : ""}" data-set-conf="guess">🎲 Just Guessing</button>
        </div>
      </div>` : "";

    const canAdvance = exam ? (state.picked[state.index] != null) : state.revealed;

    return `
      <div class="wrap ${settings.focus ? "focus-quiz" : ""}">
        ${renderTopBar(null)}
        <div class="quiz-head">
          <div class="progress-meta">${s.icon} ${esc(s.name)} · Primary ${state.grade || 1}</div>
          <div style="display:flex;align-items:center;gap:10px;">
            ${state.combo >= 2 ? `<span class="chip on">🔥 x${state.combo}</span>` : ""}
            ${state.mode === "timed" ? `<span class="chip on timer-wrap">⏱ ${state.timer}s</span>` : ""}
            <span class="progress-meta" id="sess-clock">⏱ 0:00</span>
            <span class="progress-meta">Q ${state.index + 1} / ${total}</span>
          </div>
        </div>

        <div class="bar"><span style="width:${pct}%;"></span></div>

        <div class="q-card">
          <div class="q-meta-badges">
            <span class="badge-tag">${esc(q.topic || "General")}</span>
            <span class="badge-tag bloom">Bloom: ${esc(q.bloom || "Understand")}</span>
            <span class="badge-tag">${esc(q.difficulty || "Standard")}</span>
          </div>

          <h2 class="question">${esc(q.q)}</h2>

          ${confidenceHtml}
          <div class="options">${optionsHtml}</div>

          ${state.hintText && !showFeedback ? `<div class="hint-box">💡 Scaffolding Hint: ${esc(state.hintText)}</div>` : ""}
          ${feedbackHtml}

          <div class="lifelines">
            <button class="life" data-action="speak-q">🔊 Read Aloud</button>
            <button class="life" data-action="use-hint" ${state.usedHint || exam || showFeedback ? "disabled" : ""}>💡 Hint</button>
            <button class="life" data-action="use-5050" ${state.used5050 || exam || showFeedback ? "disabled" : ""}>✂️ 50 / 50</button>
            <button class="life" data-action="use-skip" ${state.usedSkip ? "disabled" : ""}>⏭️ Skip</button>
            <button class="life" data-action="toggle-scratchpad">✏️ Scratchpad</button>
            <button class="life ${state.flagged[state.index] ? "on" : ""}" data-action="toggle-flag">${state.flagged[state.index] ? "🚩 Flagged" : "🏳️ Flag"}</button>
          </div>

          <div class="quiz-actions">
            ${canAdvance ? `<button class="btn btn-primary" data-action="quiz-next">${state.index === total - 1 ? "See Results →" : "Next Question →"}</button>` : "<div></div>"}
            <button class="btn btn-ghost" data-action="quit-quiz">Exit Quiz</button>
          </div>
        </div>

        ${state.scratchpadOpen ? renderScratchpadModal() : ""}
      </div>`;
  }

  function renderScratchpadModal() {
    return `
      <div class="scratchpad-modal no-print">
        <div class="scratchpad-card">
          <div class="scratchpad-head">
            <strong>✏️ Interactive Whiteboard & Scratchpad</strong>
            <button class="btn btn-ghost btn-sm" data-action="close-scratchpad">✕ Close</button>
          </div>
          <canvas id="scratchpad-canvas" class="scratchpad-canvas"></canvas>
          <div class="scratchpad-tools">
            <button class="btn ${state.scratchpadTool === "pen" ? "btn-primary" : "btn-ghost"} btn-sm" data-set-stool="pen">✏️ Pen</button>
            <button class="btn ${state.scratchpadTool === "eraser" ? "btn-primary" : "btn-ghost"} btn-sm" data-set-stool="eraser">🧹 Eraser</button>
            <button class="btn btn-ghost btn-sm" data-action="clear-scratchpad">🗑️ Clear</button>
            <div style="display:flex;gap:6px;align-items:center;margin-left:auto;">
              ${["#0e7c76", "#1c2834", "#e07a5f", "#0284c7"].map(c => `
                <div class="color-dot ${state.scratchpadColor === c ? "active" : ""}" style="background:${c};" data-set-scolor="${c}"></div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>`;
  }

  function initScratchpadCanvas() {
    const c = document.getElementById("scratchpad-canvas");
    if (!c) return;
    scratchpadCtx = c.getContext("2d");
    c.width = c.clientWidth;
    c.height = c.clientHeight;

    function getPos(e) {
      const rect = c.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function startDraw(e) {
      isDrawing = true;
      const pos = getPos(e);
      lastX = pos.x; lastY = pos.y;
    }
    function draw(e) {
      if (!isDrawing || !scratchpadCtx) return;
      e.preventDefault();
      const pos = getPos(e);
      scratchpadCtx.beginPath();
      scratchpadCtx.moveTo(lastX, lastY);
      scratchpadCtx.lineTo(pos.x, pos.y);
      scratchpadCtx.strokeStyle = (state.scratchpadTool === "eraser") ? "#ffffff" : state.scratchpadColor;
      scratchpadCtx.lineWidth = (state.scratchpadTool === "eraser") ? 18 : 3;
      scratchpadCtx.lineCap = "round";
      scratchpadCtx.stroke();
      lastX = pos.x; lastY = pos.y;
    }
    function stopDraw() { isDrawing = false; }

    c.onmousedown = startDraw;
    c.onmousemove = draw;
    c.onmouseup = stopDraw;
    c.ontouchstart = startDraw;
    c.ontouchmove = draw;
    c.ontouchend = stopDraw;
  }

  /* ==========================================================================
     RESULTS, DIAGNOSTIC REPORTS & CERTIFICATES
     ========================================================================== */

  function renderResult() {
    const total = state.questions.length;
    let correct = 0;
    for (let i = 0; i < total; i++) {
      if (state.picked[i] === state.questions[i].answer) correct += 1;
    }
    const pct = Math.round((correct / total) * 100);
    const gl = gradeLetter(pct);

    const masteredCount = state.questions.filter((q, i) => state.picked[i] === q.answer && (state.confidence[i] === "sure" || state.confidence[i] === "think")).length;
    const misconceptionCount = state.questions.filter((q, i) => state.picked[i] !== q.answer && state.confidence[i] === "sure").length;

    return `
      <div class="wrap">
        ${renderTopBar("subject")}
        <div class="result">
          <div class="letter-mark">${gl.mark}</div>
          <div class="kicker">Formative Evaluation · ${gl.label}</div>
          <h2 class="section-title">${correct} out of ${total} (${pct}%)</h2>
          <p class="sub">${scorePedagogicalMessage(pct)}</p>

          <div class="metric-grid">
            <div><b>${pct}%</b><span>Score</span></div>
            <div><b>+${state.xpGained}</b><span>XP Earned</span></div>
            <div><b>x${state.maxCombo || 0}</b><span>Max Combo</span></div>
            <div><b>${fmtDur(state.elapsedSec || 0)}</b><span>Time</span></div>
          </div>

          <h3 style="margin-top:28px;text-align:left;font-size:1.15rem;">🧠 Metacognitive Calibration Matrix</h3>
          <div class="calibration-matrix">
            <div class="calib-cell mastered">
              <strong>🌟 Mastered Concepts (${masteredCount})</strong>
              <p>High confidence with correct response. Solid conceptual grasp.</p>
            </div>
            <div class="calib-cell misconception">
              <strong>⚠️ Misconception Alerts (${misconceptionCount})</strong>
              <p>High confidence but incorrect response. Key area for conceptual review.</p>
            </div>
          </div>

          <div class="top-actions" style="justify-content:center;gap:12px;margin-top:24px;">
            ${(total - correct > 0) ? `<button class="btn btn-primary" data-action="practice-missed-now">🔄 Retake Missed Items (${total - correct})</button>` : ""}
            <button class="btn btn-ghost" data-go="review">🔍 Review All Explanations</button>
            <button class="btn btn-ghost" data-go="report">📊 Full Teacher Diagnostic</button>
            <button class="btn btn-ghost" data-go="certificate">📜 Print Certificate</button>
            <button class="btn btn-ghost" data-go="subject">New Quiz →</button>
          </div>
        </div>
      </div>`;
  }

  function renderReview() {
    const qy = (state.reviewQuery || "").toLowerCase();
    const filter = state.reviewFilter || "all";

    const itemsHtml = state.questions.map(function (q, i) {
      const isCorrect = state.picked[i] === q.answer;
      if (filter === "missed" && isCorrect) return "";
      if (filter === "correct" && !isCorrect) return "";
      if (filter === "flagged" && !state.flagged[i]) return "";
      if (qy && q.q.toLowerCase().indexOf(qy) < 0 && q.explain.toLowerCase().indexOf(qy) < 0) return "";

      const options = q.options.map(function (opt, oi) {
        let cls = "opt";
        if (oi === q.answer) cls += " correct";
        else if (oi === state.picked[i]) cls += " wrong";
        return `<div class="${cls}"><span class="badge">${LETTERS[oi]}</span><span>${esc(opt)}</span></div>`;
      }).join("");

      return `
        <article class="q-card" style="margin-bottom:18px;">
          <div class="q-meta-badges">
            <span class="badge-tag ${isCorrect ? "" : "bloom"}">${isCorrect ? "✅ Correct" : "❌ Missed"}</span>
            <span class="badge-tag">${esc(q.topic || "General")}</span>
            <span class="badge-tag bloom">${esc(q.bloom || "Understand")}</span>
          </div>
          <h4>${i + 1}. ${esc(q.q)}</h4>
          <div class="options" style="margin:12px 0;">${options}</div>
          <div class="feedback ${isCorrect ? "ok" : "no"}">
            <strong>Explanation:</strong> ${esc(q.explain)}
          </div>
        </article>`;
    }).join("");

    return `
      <div class="wrap">
        ${renderTopBar("result")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Results", go: "result" }, { label: "Detailed Review" }])}
        <h2 class="section-title">Detailed Question Review</h2>
        <p class="sub">Review step-by-step solutions, Bloom's cognitive domain, and learning explanations.</p>
        <div class="chip-group">
          <button class="chip ${filter === "all" ? "on" : ""}" data-set-rfilter="all">All (${state.questions.length})</button>
          <button class="chip ${filter === "missed" ? "on" : ""}" data-set-rfilter="missed">Missed Only</button>
          <button class="chip ${filter === "correct" ? "on" : ""}" data-set-rfilter="correct">Correct Only</button>
        </div>
        ${itemsHtml}
      </div>`;
  }

  /* ==========================================================================
     SPACED REPETITION FLASHCARDS (Leitner 3-Box System)
     ========================================================================== */

  function renderFlashcards() {
    const deckType = state.flashcardDeck || "missed";
    const g = state.grade || 1;
    let deck = [];

    if (deckType === "missed") {
      deck = progress.missed[g] || [];
    } else if (deckType === "box1") {
      deck = progress.flashcards.box1 || [];
    } else if (deckType === "box2") {
      deck = progress.flashcards.box2 || [];
    } else {
      deck = progress.flashcards.box3 || [];
    }

    const card = deck[state.flashcardIndex] || null;

    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Spaced Repetition" }])}
        <div class="kicker">Leitner 3-Box Active Recall System</div>
        <h2 class="section-title">Spaced Memory Flashcards</h2>
        <p class="sub">Active recall strengthening long-term memory through structured spacing intervals.</p>

        <div class="leitner-boxes">
          <div class="leitner-box" data-set-deck="box1">
            <b>${progress.flashcards.box1.length}</b>
            <span>Box 1 · Daily Practice</span>
          </div>
          <div class="leitner-box" data-set-deck="box2">
            <b>${progress.flashcards.box2.length}</b>
            <span>Box 2 · Every 3 Days</span>
          </div>
          <div class="leitner-box" data-set-deck="box3">
            <b>${progress.flashcards.box3.length}</b>
            <span>Box 3 · Mastered Memory</span>
          </div>
        </div>

        ${card ? `
          <div class="flashcard-wrap" data-action="flip-flashcard">
            <div class="flashcard-card ${state.flashcardFlipped ? "flipped" : ""}">
              <div class="flashcard-face flashcard-front">
                <div>
                  <div class="q-meta-badges">
                    <span class="badge-tag">${esc(card.topic || "Core")}</span>
                    <span class="badge-tag bloom">${esc(card.bloom || "Recall")}</span>
                  </div>
                  <h3 style="font-size:1.4rem;line-height:1.4;margin-top:16px;">${esc(card.q)}</h3>
                </div>
                <p style="color:var(--muted);font-weight:700;">👆 Tap card to reveal answer & solution</p>
              </div>
              <div class="flashcard-face flashcard-back">
                <div>
                  <div class="kicker">Correct Answer</div>
                  <h3 style="color:var(--teal);font-size:1.3rem;margin-bottom:12px;">✅ ${esc(card.options[card.answer])}</h3>
                  <p style="font-size:0.95rem;color:var(--ink);">${esc(card.explain)}</p>
                </div>
                <div style="display:flex;gap:8px;justify-content:center;margin-top:16px;">
                  <button class="btn btn-coral btn-sm" data-rate-card="1">❌ Still Learning (Box 1)</button>
                  <button class="btn btn-sun btn-sm" data-rate-card="2">👍 Getting Better (Box 2)</button>
                  <button class="btn btn-leaf btn-sm" data-rate-card="3">⭐ Mastered (Box 3)</button>
                </div>
              </div>
            </div>
          </div>
        ` : `
          <div class="q-card" style="text-align:center;padding:40px;">
            <h3>🎉 No Flashcards in this Box!</h3>
            <p class="sub">Complete a practice quiz to automatically add missed concepts to your Leitner deck.</p>
            <button class="btn btn-primary" data-action="start">Start a Quiz →</button>
          </div>
        `}
      </div>`;
  }

  /* ==========================================================================
     GLOBAL CURRICULUM STANDARDS EXPLORER
     ========================================================================== */

  function renderCurriculum() {
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Curriculum Standards" }])}
        <div class="kicker">International Educational Alignment</div>
        <h2 class="section-title">Global Curriculum & Standards Map</h2>
        <p class="sub">How Primary Super Quiz aligns with international education ministries and curricula worldwide.</p>

        <div class="table-scroll">
          <table class="report-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Nigeria (NERDC)</th>
                <th>Cambridge Primary</th>
                <th>UK National Curriculum</th>
                <th>US Common Core / NGSS</th>
                <th>IB Primary Years (PYP)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Primary 1 (Age 6–7)</td><td>Primary 1</td><td>Stage 1</td><td>Year 2 (KS1)</td><td>Grade 1</td><td>PYP Early Primary</td></tr>
              <tr><td>Primary 2 (Age 7–8)</td><td>Primary 2</td><td>Stage 2</td><td>Year 3 (KS2)</td><td>Grade 2</td><td>PYP Inquiry 1</td></tr>
              <tr><td>Primary 3 (Age 8–9)</td><td>Primary 3</td><td>Stage 3</td><td>Year 4 (KS2)</td><td>Grade 3</td><td>PYP Inquiry 2</td></tr>
              <tr><td>Primary 4 (Age 9–10)</td><td>Primary 4</td><td>Stage 4</td><td>Year 5 (KS2)</td><td>Grade 4</td><td>PYP Middle Primary</td></tr>
              <tr><td>Primary 5 (Age 10–11)</td><td>Primary 5</td><td>Stage 5</td><td>Year 6 (KS2)</td><td>Grade 5</td><td>PYP Upper Primary</td></tr>
              <tr><td>Primary 6 (Age 11–12)</td><td>Primary 6 (Common Entrance)</td><td>Stage 6 (Checkpoint)</td><td>Year 7 (KS3 Prep)</td><td>Grade 6</td><td>PYP Exhibition Level</td></tr>
            </tbody>
          </table>
        </div>

        <h3 style="margin-top:28px;">Subject Curricular Breakdown (16 Subjects)</h3>
        <div class="grid-subjects" style="margin-top:16px;">
          ${Object.keys(window.SUBJECTS).map(function (k) {
            const s = window.SUBJECTS[k];
            return `
              <div class="subject-card">
                <span class="sub-icon">${s.icon}</span>
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
                <button class="btn btn-primary btn-sm" data-pick-subj="${k}">View Bank & Practice →</button>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  /* ==========================================================================
     WHY IT WORKS: LEARNING SCIENCE WHITE PAPER
     ========================================================================== */

  function renderWhy() {
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Why It Works (Learning Science)" }])}
        <div class="kicker">Cognitive Psychology &amp; Educational Evidence</div>
        <h2 class="section-title">The Science of Active Retrieval</h2>
        <p class="sub">Why professors, researchers, and primary educators worldwide recommend retrieval practice over passive studying.</p>

        <div class="home-grid" style="margin-bottom:28px;">
          <div class="card-btn">
            <h3>🧠 1. The Testing Effect (Roediger &amp; Karpicke, 2006)</h3>
            <p>Direct experimental evidence shows that actively retrieving a fact from memory creates stronger, more durable neural connections than re-reading notes multiple times.</p>
          </div>
          <div class="card-btn">
            <h3>⏳ 2. Spaced Repetition (Bjork, 1994; Cepeda et al., 2006)</h3>
            <p>Our Leitner 3-Box Flashcard system interrupts the natural Ebbinghaus forgetting curve just as a memory begins to decay, solidifying long-term synaptic retention.</p>
          </div>
          <div class="card-btn">
            <h3>🌈 3. Interleaving Practice (Rohrer &amp; Taylor, 2007)</h3>
            <p>The Champion Mix and multi-subject challenges interleave different topics, teaching children's brains to categorize problems and select the correct solution strategy dynamically.</p>
          </div>
          <div class="card-btn">
            <h3>🎯 4. Metacognitive Calibration (Dunlosky et al., 2013)</h3>
            <p>Prompting pupils to rate confidence before answering uncovers illusions of competence (the Dunning-Kruger effect) and guides focused revision to real areas of growth.</p>
          </div>
        </div>

        <div class="q-card" style="margin-bottom:28px;">
          <h3>✨ Key Principles Embedded in Primary Super Quiz</h3>
          <ul style="padding-left:20px;margin-top:12px;line-height:1.7;">
            <li><strong>Zero Extraneous Cognitive Load (Sweller, 1988):</strong> Clean, clutter-free, ad-free interface ensures 100% of working memory is devoted to thinking and solving.</li>
            <li><strong>Immediate Formative Scaffolding:</strong> Hints and step-by-step solutions explain <em>why</em> a concept works, transforming mistakes into high-impact learning opportunities.</li>
            <li><strong>Low-Stakes Psychological Safety:</strong> Practice modes celebrate effort, combos, and consistency without penalizing exploratory learning.</li>
          </ul>
        </div>
      </div>`;
  }

  /* ==========================================================================
     PRIVACY POLICY (COPPA & GDPR COMPLIANCE)
     ========================================================================== */

  function renderPrivacy() {
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Privacy Policy & Child Safety" }])}
        <div class="kicker">COPPA &amp; GDPR Compliant · Safe for Classrooms</div>
        <h2 class="section-title">Privacy &amp; Child Safety Policy</h2>
        <p class="sub">How Primary Super Quiz protects children's privacy and delivers safe, ad-free education.</p>

        <div class="q-card" style="margin-bottom:20px;">
          <h3>🔒 100% On-Device Local Storage</h3>
          <p style="margin-top:8px;line-height:1.5;">All student profiles, XP progress, badge unlocks, quiz scores, and flashcard states are stored strictly on this device inside browser <code>localStorage</code>. No personal identifiable information is sent to external servers.</p>
        </div>

        <div class="q-card" style="margin-bottom:20px;">
          <h3>🚫 Zero Advertisements &amp; No Commercial Trackers</h3>
          <p style="margin-top:8px;line-height:1.5;">Primary Super Quiz contains zero advertising, zero marketing pixels, and zero third-party tracking scripts. The app is 100% free for schools, teachers, parents, and pupils.</p>
        </div>

        <div class="q-card">
          <h3>📜 Full International Compliance</h3>
          <p style="margin-top:8px;line-height:1.5;">Designed in compliance with the US Children's Online Privacy Protection Act (COPPA), the European Union General Data Protection Regulation (GDPR-K), and Nigeria Data Protection Regulation (NDPR).</p>
        </div>
      </div>`;
  }

  /* ==========================================================================
     PUPIL ACCOUNT & TROPHY SHOWCASE
     ========================================================================== */

  function renderAccount() {
    const r = rankFor(progress.xp);
    const allBadges = window.BADGES || [];
    const unlockedBadges = progress.badges || [];

    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Student Profile & Trophy Cabinet" }])}
        <div class="kicker">Academic Distinction &amp; Badges</div>
        <h2 class="section-title">Trophy Cabinet &amp; Profile</h2>
        <p class="sub">Track student achievements, unlock milestones, and switch learner profiles.</p>

        <div class="hero" style="margin-bottom:28px;">
          <div>
            <div class="kicker">Current Academic Rank</div>
            <h2 style="font-size:2rem;color:var(--teal);margin:8px 0;">${r.icon} ${r.name}</h2>
            <p style="font-size:1.05rem;color:var(--muted);">${progress.xp} Total XP · ${progress.quizzes} Quizzes Completed</p>
            <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" data-action="add-student-modal">+ New Student Profile</button>
              <button class="btn btn-ghost btn-sm" data-go="certificate">Print Diploma 📜</button>
            </div>
          </div>
          <div class="hero-art">
            <img src="images/trophy.png" alt="Trophy" style="max-width:180px;">
          </div>
        </div>

        <div class="q-card" style="margin-bottom:28px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <h3>👥 Switch Active Profile</h3>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${listProfiles().map(function (p) {
              const isCur = uid() === p.id;
              return `
                <button class="chip ${isCur ? "on" : ""}" data-switch-profile="${p.id}">
                  👤 ${esc(p.name)} (P${p.grade || 1})
                </button>`;
            }).join("")}
          </div>
        </div>

        <h3 style="margin-bottom:16px;">🏆 Academic Milestone Badges (${unlockedBadges.length} / ${allBadges.length} Unlocked)</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px;margin-bottom:32px;">
          ${allBadges.map(function (b) {
            const isUnlocked = unlockedBadges.indexOf(b.id) >= 0;
            return `
              <div class="stat-tile" style="text-align:left;padding:16px;opacity:${isUnlocked ? "1" : "0.55"};border-color:${isUnlocked ? "var(--sun)" : "var(--line)"};">
                <div style="font-size:2rem;margin-bottom:6px;">${b.icon}</div>
                <strong style="display:block;font-size:1.05rem;color:var(--ink);">${esc(b.name)}</strong>
                <p style="font-size:0.82rem;color:var(--muted);margin-top:4px;">${esc(b.desc)}</p>
                <span class="chip ${isUnlocked ? "on" : ""}" style="margin-top:8px;font-size:0.75rem;">${isUnlocked ? "✅ Unlocked" : "🔒 In Progress"}</span>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  /* ==========================================================================
     TEACHER COMMAND CENTER & PRINTABLE WORKSHEET BUILDER
     ========================================================================== */

  function renderTeachers() {
    const roster = state.classRoster || [];
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Teacher Command Center" }])}
        <div class="kicker">Educator & Classroom Toolkit</div>
        <h2 class="section-title">Teacher Command Center</h2>
        <p class="sub">Everything teachers and school leaders need: class roster tracking, printable worksheets with marking keys, and live projector mode.</p>

        <div class="home-grid" style="margin-bottom:28px;">
          <div class="card-btn" data-go="projector">
            <h3>📽️ Classroom Projector Mode</h3>
            <p>High-visibility interactive display mode designed for classroom smartboards and school projectors.</p>
          </div>
          <div class="card-btn" data-action="export-class-csv">
            <h3>📊 Export Class CSV Report</h3>
            <p>Download aggregated student performance, study minutes, and accuracy metrics for school records.</p>
          </div>
        </div>

        <div class="q-card" style="margin-bottom:28px;">
          <h3>📄 Custom Printable Worksheet & Test Builder</h3>
          <p class="sub">Generate formatted printable exam papers, homework sheets, and complete teacher answer keys.</p>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;margin:16px 0;">
            <div>
              <label class="kicker">Grade Level</label>
              <select id="ws-grade" class="btn btn-ghost" style="width:100%;text-align:left;">
                ${[1,2,3,4,5,6].map(g => `<option value="${g}" ${state.wsGrade === g ? "selected" : ""}>Primary ${g}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="kicker">Subject</label>
              <select id="ws-subject" class="btn btn-ghost" style="width:100%;text-align:left;">
                ${Object.keys(window.SUBJECTS).map(k => `<option value="${k}" ${state.wsSubject === k ? "selected" : ""}>${window.SUBJECTS[k].name}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="kicker">Question Count</label>
              <select id="ws-count" class="btn btn-ghost" style="width:100%;text-align:left;">
                <option value="10">10 Questions</option>
                <option value="20" selected>20 Questions</option>
                <option value="50">50 Questions</option>
                <option value="80">80 Questions (Mock Exam)</option>
              </select>
            </div>
          </div>

          <button class="btn btn-primary" data-action="generate-print-worksheet">Generate Printable Paper & Marking Scheme →</button>
        </div>

        <div class="q-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
            <h3>👥 Student & Class Roster</h3>
            <button class="btn btn-primary btn-sm" data-action="add-student-modal">+ Add Student Profile</button>
          </div>
          <div class="table-scroll">
            <table class="report-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Grade</th>
                  <th>XP</th>
                  <th>Quizzes Taken</th>
                  <th>Study Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${listProfiles().map(function (p) {
                  return `
                    <tr>
                      <td><strong>${esc(p.name)}</strong></td>
                      <td>Primary ${p.grade || 1}</td>
                      <td>${p.xp || progress.xp}</td>
                      <td>${p.quizzes || progress.quizzes}</td>
                      <td>${fmtDur(p.studySec || progress.studySec || 0)}</td>
                      <td>
                        <button class="btn btn-ghost btn-sm" data-switch-profile="${p.id}">Select</button>
                      </td>
                    </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  }

  /* ==========================================================================
     CLASSROOM PROJECTOR VIEW
     ========================================================================== */

  function renderProjector() {
    const q = state.questions[state.projectorIndex || 0] || (state.questions.length ? state.questions[0] : null);
    if (!q) {
      return `<div class="wrap">${renderTopBar("teachers")}<p>Please start a quiz or select a subject to present in Projector Mode.</p><button class="btn btn-primary" data-go="subject">Choose Subject</button></div>`;
    }

    const total = state.questions.length;
    const isRev = state.projectorRevealed;

    const optsHtml = q.options.map(function (opt, i) {
      let cls = "projector-opt";
      if (isRev && i === q.answer) cls += " correct";
      return `<div class="${cls}"><strong>(${LETTERS[i]})</strong> ${esc(opt)}</div>`;
    }).join("");

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="btn btn-ghost btn-sm" data-go="teachers">← Exit Projector View</button>
          <span>Question ${(state.projectorIndex || 0) + 1} of ${total}</span>
        </div>
        <div class="projector-view">
          <div>
            <div class="kicker">Primary ${state.grade || 1} · ${esc(q.topic || "Topic Inquiry")}</div>
            <h2 class="projector-q">${esc(q.q)}</h2>
            <div class="projector-opts">${optsHtml}</div>
            ${isRev ? `<div class="feedback ok"><strong>Marking Solution:</strong> ${esc(q.explain)}</div>` : ""}
          </div>
          <div class="top-actions" style="justify-content:space-between;margin-top:24px;">
            <button class="btn btn-ghost" data-action="proj-prev" ${state.projectorIndex === 0 ? "disabled" : ""}>← Previous</button>
            <button class="btn btn-sun" data-action="proj-toggle-reveal">${isRev ? "Hide Solution" : "Reveal Solution & Explanation"}</button>
            <button class="btn btn-primary" data-action="proj-next" ${state.projectorIndex >= total - 1 ? "disabled" : ""}>Next Question →</button>
          </div>
        </div>
      </div>`;
  }

  /* ==========================================================================
     DIAGNOSTIC REPORT & CERTIFICATE OF DISTINCTION
     ========================================================================== */

  function renderReport() {
    const g = state.grade || 1;
    const r = rankFor(progress.xp);
    const totalQuizzes = progress.quizzes || 0;
    const avgScore = accuracyPct();

    return `
      <div class="wrap report">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="home">←</button>
          <button class="btn btn-primary" data-action="print-page">🖨️ Print Diagnostic Portfolio</button>
        </div>

        <header style="border-bottom:3px solid var(--teal);padding-bottom:16px;margin-bottom:24px;">
          <h2 style="font-family:var(--font-display);font-size:2rem;color:var(--teal);">Primary Super Quiz · Formative Diagnostic Assessment</h2>
          <p style="font-size:1.1rem;color:var(--ink);margin-top:4px;"><strong>Student:</strong> ${esc(state.name || "Pupil")} ${schoolName() ? " · " + esc(schoolName()) : ""} · <strong>Level:</strong> Primary ${g}</p>
          <p style="color:var(--muted);font-size:0.9rem;">Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · Rank: ${r.icon} ${r.name} (${progress.xp} XP)</p>
        </header>

        <div class="home-stats" style="margin-bottom:24px;">
          <div class="stat-tile"><b>${avgScore}%</b><span>Overall Accuracy</span></div>
          <div class="stat-tile"><b>${totalQuizzes}</b><span>Total Papers</span></div>
          <div class="stat-tile"><b>${progress.streak} days</b><span>Consistency Streak</span></div>
          <div class="stat-tile"><b>${fmtDur(progress.studySec || 0)}</b><span>Active Retrieval Time</span></div>
        </div>

        <div class="q-card" style="margin-bottom:24px;">
          <h3>Pedagogical Strengths & Interventions</h3>
          <p style="margin-top:8px;line-height:1.5;">${pedagogicalRecommendation()}</p>
        </div>

        <h3>Curriculum Mastery by Subject Domain (Primary ${g})</h3>
        <div class="table-scroll" style="margin-top:12px;">
          <table class="report-table">
            <thead>
              <tr>
                <th>Subject Domain</th>
                <th>Best Score</th>
                <th>Evaluation</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(window.SUBJECTS).map(function (k) {
                const s = window.SUBJECTS[k];
                const b = progress.best[`${g}/${k}`];
                const pct = b ? b.pct : null;
                const gl = pct != null ? gradeLetter(pct) : { mark: "—", label: "Pending" };
                const act = pct == null ? "Sit diagnostic 10-question paper" : pct >= 80 ? "Extend with challenge paper" : "Review missed items with flashcards";
                return `
                  <tr>
                    <td>${s.icon} ${s.name}</td>
                    <td>${pct != null ? pct + "%" : "Not yet sat"}</td>
                    <td><strong>Grade ${gl.mark}</strong> (${gl.label})</td>
                    <td>${act}</td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderCertificate() {
    const r = rankFor(progress.xp);
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="result">←</button>
          <button class="btn btn-primary" data-action="print-page">🖨️ Print Certificate</button>
        </div>
        <div class="certificate" style="background:#fffdf8;border:12px double #d4af37;padding:48px;text-align:center;border-radius:12px;box-shadow:var(--shadow-lg);">
          <div style="font-size:3rem;margin-bottom:8px;">🏆</div>
          <div class="kicker" style="color:#d4af37;letter-spacing:0.15em;">Certificate of Educational Achievement</div>
          <h1 style="font-family:var(--font-display);font-size:2.6rem;color:#0e7c76;margin:12px 0;">Primary Super Quiz Distinction</h1>
          <p style="font-size:1.15rem;color:#475569;">This is proudly presented to</p>
          <h2 style="font-family:var(--font-display);font-size:2.2rem;color:#0f172a;text-decoration:underline;margin:16px 0;">${esc(state.name || "Pupil Scholar")}</h2>
          <p style="font-size:1.05rem;line-height:1.6;color:#334155;max-width:600px;margin:0 auto 24px;">
            for demonstrated excellence, dedication, and active retrieval practice across <strong>Primary ${state.grade || 1}</strong> curriculum subjects${schoolName() ? " at <strong>" + esc(schoolName()) + "</strong>" : ""}.
          </p>
          <div style="display:flex;justify-content:space-around;margin-top:36px;border-top:2px solid #e2e8f0;padding-top:20px;">
            <div>
              <p style="font-weight:800;color:#0e7c76;">${today}</p>
              <span style="font-size:0.8rem;color:#64748b;">Date Awarded</span>
            </div>
            <div>
              <p style="font-weight:800;color:#0e7c76;">${r.name} · ${progress.xp} XP</p>
              <span style="font-size:0.8rem;color:#64748b;">Academic Distinction Level</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ==========================================================================
     SETTINGS & USER PREFERENCES
     ========================================================================== */

  function renderSettings() {
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Settings & Universal Accessibility" }])}
        <h2 class="section-title">Settings & Accessibility</h2>
        <p class="sub">Personalize your learning environment. All settings are preserved locally on this device.</p>

        <div class="q-card" style="margin-bottom:20px;">
          <h3>🎨 Visual Themes & Contrast</h3>
          <div class="chip-group" style="margin-top:12px;">
            <button class="chip ${settings.theme === "light" ? "on" : ""}" data-set-theme="light">Light Classroom</button>
            <button class="chip ${settings.theme === "dark" ? "on" : ""}" data-set-theme="dark">Slate Dark</button>
            <button class="chip ${settings.theme === "solar" ? "on" : ""}" data-set-theme="solar">☀️ High-Contrast Solar (WCAG AAA)</button>
            <button class="chip ${settings.theme === "sepia" ? "on" : ""}" data-set-theme="sepia">📜 Calm Sepia</button>
            <button class="chip ${settings.theme === "mint" ? "on" : ""}" data-set-theme="mint">🌿 Soft Mint</button>
            <button class="chip ${settings.theme === "violet" ? "on" : ""}" data-set-theme="violet">🔮 Cyber Violet</button>
          </div>
        </div>

        <div class="q-card" style="margin-bottom:20px;">
          <h3>📖 Typography & Dyslexia Support</h3>
          <div class="chip-group" style="margin-top:12px;">
            <button class="chip ${settings.font === "nunito" ? "on" : ""}" data-set-font="nunito">Nunito (Friendly Rounded)</button>
            <button class="chip ${settings.font === "lexend" ? "on" : ""}" data-set-font="lexend">Lexend (Dyslexia-Friendly)</button>
            <button class="chip ${settings.font === "sans" ? "on" : ""}" data-set-font="sans">Clean System Sans</button>
            <button class="chip ${settings.font === "serif" ? "on" : ""}" data-set-font="serif">Classic Book Serif</button>
          </div>
          <p class="kicker" style="margin-top:16px;">Font Size Scaling</p>
          <div class="chip-group">
            <button class="chip ${settings.fontSize === 100 ? "on" : ""}" data-set-fsize="100">Standard (100%)</button>
            <button class="chip ${settings.fontSize === 120 ? "on" : ""}" data-set-fsize="120">Large (120%)</button>
            <button class="chip ${settings.fontSize === 140 ? "on" : ""}" data-set-fsize="140">Extra Large (140%)</button>
            <button class="chip ${settings.fontSize === 160 ? "on" : ""}" data-set-fsize="160">Giant (160%)</button>
          </div>
        </div>

        <div class="q-card" style="margin-bottom:20px;">
          <h3>🔊 Audio & Speech Synthesis (TTS)</h3>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;">
            <button class="btn ${settings.sound ? "btn-primary" : "btn-ghost"}" data-action="toggle-sound">Sound Effects: ${settings.sound ? "Enabled" : "Disabled"}</button>
            <button class="btn ${settings.tts ? "btn-primary" : "btn-ghost"}" data-action="toggle-tts">Auto Read-Aloud: ${settings.tts ? "Enabled" : "Disabled"}</button>
          </div>
        </div>

        <div class="q-card" style="margin-bottom:20px;">
          <h3>🏫 School & Classroom Information</h3>
          <label class="kicker" for="school-name-input">School Name (appears on certificates and worksheets):</label>
          <input type="text" id="school-name-input" class="btn btn-ghost" style="width:100%;max-width:480px;text-align:left;margin-top:8px;" placeholder="e.g. St. Peter's International Academy" value="${esc(schoolName())}">
          <button class="btn btn-primary btn-sm" data-action="save-school-name" style="margin-top:10px;">Save School Name</button>
        </div>

        <div class="q-card">
          <h3>💾 Data Management (Backup & Restore)</h3>
          <p class="sub">Export complete student progress to JSON or restore backup on a new device.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn btn-primary" data-action="download-backup-json">Download JSON Backup</button>
            <button class="btn btn-ghost" data-action="trigger-import-backup">Import JSON Backup</button>
            <input type="file" id="import-backup-input" accept=".json" style="display:none;">
          </div>
        </div>
      </div>`;
  }

  function renderFooter() {
    return `
      <footer class="site-footer no-print" style="border-top:2px solid var(--line);margin-top:48px;padding-top:24px;text-align:center;color:var(--muted);font-size:0.9rem;">
        <p><strong>Primary Super Quiz</strong> · World-Class Universal Primary 1–6 Educational Practice</p>
        <p style="margin-top:6px;">16 Subjects · 9,600 Unique Questions · Free &amp; Ad-Free · Works Offline Worldwide</p>
        <div style="display:flex;gap:14px;justify-content:center;margin-top:12px;flex-wrap:wrap;">
          <button class="crumbs button" data-go="why">Learning Science</button> ·
          <button class="crumbs button" data-go="curriculum">Curriculum Map</button> ·
          <button class="crumbs button" data-go="teachers">Teachers</button> ·
          <button class="crumbs button" data-go="privacy">Privacy (COPPA/GDPR)</button>
        </div>
      </footer>`;
  }

  /* ==========================================================================
     HELPERS & CALCULATION UTILITIES
     ========================================================================== */

  function subjectName(key) {
    const s = window.SUBJECTS[key];
    return s ? s.name : (key || "General Subject");
  }

  function gradeLetter(pct) {
    if (pct >= 85) return { mark: "A", label: "Distinction / Outstanding" };
    if (pct >= 70) return { mark: "B", label: "Very Good / Proficient" };
    if (pct >= 55) return { mark: "C", label: "Credit / Developing" };
    if (pct >= 40) return { mark: "D", label: "Pass / Emerging" };
    return { mark: "E", label: "Needs Targeted Revision" };
  }

  function scorePedagogicalMessage(pct) {
    if (pct >= 90) return "Mastery Level! Excellent conceptual retention and accuracy.";
    if (pct >= 75) return "Very Strong performance. Ready for advanced practice topics.";
    if (pct >= 60) return "Good foundational understanding. Use flashcards for missed items.";
    return "Targeted review recommended. Read step-by-step solutions carefully.";
  }

  function rankFor(xp) {
    const list = window.RANKS || [];
    let cur = list[0];
    for (let i = 0; i < list.length; i++) {
      if (xp >= list[i].min) cur = list[i];
    }
    return cur;
  }

  function accuracyPct() {
    if (!progress.history || !progress.history.length) return 0;
    const sum = progress.history.reduce(function (acc, h) { return acc + (h.pct || 0); }, 0);
    return Math.round(sum / progress.history.length);
  }

  function fmtDur(sec) {
    if (!sec || sec <= 0) return "0 min";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m < 60) return `${m}m ${s}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  }

  function pedagogicalRecommendation() {
    const g = state.grade || 1;
    const missed = (progress.missed[g] || []).length;
    if (missed > 10) {
      return `Targeted retrieval priority: ${missed} concepts need consolidation. Recommended daily routine: 10 minutes with Spaced Recall flashcards followed by a 10-question formative practice quiz.`;
    }
    return `Strong overall curriculum grasp across Primary ${g} domains. Recommended next step: Sit full 50-question mock exam papers and challenge multi-subject Champion Mix.`;
  }

  function toast(msg) {
    state.toast = msg;
    clearTimeout(toastTimer);
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = "block";
    toastTimer = setTimeout(function () {
      if (el) el.style.display = "none";
    }, 2600);
  }

  /* ==========================================================================
     EVENT DELEGATION & ROUTING
     ========================================================================== */

  function render() {
    if (!app) return;
    let html = "";
    switch (state.screen) {
      case "home": html = renderHome(); break;
      case "grade": html = renderGrades(); break;
      case "subject": html = renderSubjects(); break;
      case "topics": html = renderTopicDrill(); break;
      case "length": html = renderLengthSetup(); break;
      case "quiz": html = renderQuiz(); break;
      case "result": html = renderResult(); break;
      case "review": html = renderReview(); break;
      case "flashcards": html = renderFlashcards(); break;
      case "curriculum": html = renderCurriculum(); break;
      case "why": html = renderWhy(); break;
      case "privacy": html = renderPrivacy(); break;
      case "account": html = renderAccount(); break;
      case "teachers": html = renderTeachers(); break;
      case "projector": html = renderProjector(); break;
      case "report": html = renderReport(); break;
      case "certificate": html = renderCertificate(); break;
      case "settings": html = renderSettings(); break;
      default: html = renderHome();
    }
    app.innerHTML = html;
    window.scrollTo(0, 0);

    if (state.screen === "quiz" && state.scratchpadOpen) {
      setTimeout(initScratchpadCanvas, 100);
    }
  }

  document.addEventListener("click", function (e) {
    const target = e.target.closest("[data-action], [data-go], [data-set-grade], [data-pick-subj], [data-drill-subj], [data-start-topic-quiz], [data-set-group], [data-set-len], [data-set-mode], [data-opt], [data-set-conf], [data-set-stool], [data-set-scolor], [data-rate-card], [data-set-theme], [data-set-font], [data-set-fsize], [data-switch-profile], [data-set-rfilter]");
    if (!target) return;

    if (target.dataset.go) {
      state.screen = target.dataset.go;
      render();
      return;
    }

    if (target.dataset.setGrade) {
      state.grade = Number(target.dataset.setGrade);
      localStorage.setItem("psq-grade", String(state.grade));
      state.screen = "subject";
      render();
      return;
    }

    if (target.dataset.pickSubj) {
      state.subject = target.dataset.pickSubj;
      state.selectedTopic = null;
      state.screen = "length";
      render();
      return;
    }

    if (target.dataset.drillSubj) {
      openTopicDrill(target.dataset.drillSubj);
      return;
    }

    if (target.dataset.startTopicQuiz) {
      const topName = target.dataset.startTopicQuiz;
      const len = Number(target.dataset.topicLen || 10);
      startQuiz(state.subject, len, "practice", topName);
      return;
    }

    if (target.dataset.setGroup) {
      state.group = target.dataset.setGroup;
      render();
      return;
    }

    if (target.dataset.setLen) {
      state.length = Number(target.dataset.setLen);
      render();
      return;
    }

    if (target.dataset.setMode) {
      state.mode = target.dataset.setMode;
      render();
      return;
    }

    if (target.dataset.opt != null) {
      submitAnswer(Number(target.dataset.opt));
      return;
    }

    if (target.dataset.setConf) {
      state.confidence[state.index] = target.dataset.setConf;
      render();
      return;
    }

    if (target.dataset.setStool) {
      state.scratchpadTool = target.dataset.setStool;
      render();
      return;
    }

    if (target.dataset.setScolor) {
      state.scratchpadColor = target.dataset.setScolor;
      state.scratchpadTool = "pen";
      render();
      return;
    }

    if (target.dataset.rateCard) {
      const rating = Number(target.dataset.rateCard);
      const g = state.grade || 1;
      const card = (progress.missed[g] || [])[state.flashcardIndex];
      if (card) {
        if (rating === 3) {
          progress.flashcards.box3.unshift(card);
          progress.flashcards.box1 = progress.flashcards.box1.filter(c => c.q !== card.q);
        } else if (rating === 2) {
          progress.flashcards.box2.unshift(card);
        } else {
          progress.flashcards.box1.unshift(card);
        }
        saveProgress();
      }
      state.flashcardFlipped = false;
      state.flashcardIndex += 1;
      render();
      return;
    }

    if (target.dataset.setTheme) {
      settings.theme = target.dataset.setTheme;
      settings.dark = (settings.theme === "dark");
      settings.contrast = (settings.theme === "solar");
      saveSettings();
      render();
      return;
    }

    if (target.dataset.setFont) {
      settings.font = target.dataset.setFont;
      saveSettings();
      render();
      return;
    }

    if (target.dataset.setFsize) {
      settings.fontSize = Number(target.dataset.setFsize);
      saveSettings();
      render();
      return;
    }

    if (target.dataset.switchProfile) {
      switchProfile(target.dataset.switchProfile);
      return;
    }

    if (target.dataset.setRfilter) {
      state.reviewFilter = target.dataset.setRfilter;
      render();
      return;
    }

    const act = target.dataset.action;
    switch (act) {
      case "start":
        state.screen = state.grade ? "subject" : "grade";
        render();
        break;
      case "launch-daily":
        startDailyChallenge();
        break;
      case "launch-smart":
        startSmartPractice();
        break;
      case "launch-mix":
        startChampionMix();
        break;
      case "launch-lightning":
        startLightning5();
        break;
      case "launch-quiz":
        startQuiz(state.subject || "maths", state.length || 20, state.mode || "practice", state.selectedTopic);
        break;
      case "quiz-next":
        nextQuestion();
        break;
      case "speak-q":
        speakCurrentQuestion();
        break;
      case "use-hint":
        state.usedHint = true;
        state.hintText = state.questions[state.index].hint || "Recall the fundamental concepts of this domain.";
        render();
        break;
      case "use-5050":
        state.used5050 = true;
        const curQ = state.questions[state.index];
        const wrongs = [0, 1, 2, 3].filter(i => i !== curQ.answer);
        state.hidden[state.index] = shuffle(wrongs).slice(0, 2);
        render();
        break;
      case "use-skip":
        state.usedSkip = true;
        const skipped = state.questions.splice(state.index, 1)[0];
        state.questions.push(skipped);
        state.picked.splice(state.index, 1);
        state.picked.push(null);
        render();
        break;
      case "toggle-scratchpad":
        state.scratchpadOpen = !state.scratchpadOpen;
        render();
        break;
      case "close-scratchpad":
        state.scratchpadOpen = false;
        render();
        break;
      case "clear-scratchpad":
        if (scratchpadCtx) {
          const c = document.getElementById("scratchpad-canvas");
          if (c) scratchpadCtx.clearRect(0, 0, c.width, c.height);
        }
        break;
      case "toggle-flag":
        state.flagged[state.index] = !state.flagged[state.index];
        render();
        break;
      case "toggle-sound":
        settings.sound = !settings.sound;
        saveSettings();
        toast(settings.sound ? "Sound FX Enabled" : "Sound Muted");
        render();
        break;
      case "toggle-tts":
        settings.tts = !settings.tts;
        saveSettings();
        toast(settings.tts ? "Auto Read-Aloud Enabled" : "Auto Read-Aloud Disabled");
        render();
        break;
      case "flip-flashcard":
        state.flashcardFlipped = !state.flashcardFlipped;
        render();
        break;
      case "practice-missed-now":
        const g = state.grade || 1;
        const misses = progress.missed[g] || [];
        if (misses.length) {
          state.questions = shuffle(misses).slice(0, 10);
          state.length = state.questions.length;
          state.index = 0;
          state.picked = new Array(state.length).fill(null);
          state.confidence = new Array(state.length).fill(null);
          state.revealed = false;
          state.screen = "quiz";
          render();
        }
        break;
      case "print-page":
        window.print();
        break;
      case "save-school-name":
        const el = document.getElementById("school-name-input");
        if (el) {
          setSchoolName(el.value);
          toast("School name saved.");
        }
        break;
      case "download-backup-json":
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress, null, 2));
        const a = document.createElement("a");
        a.href = dataStr;
        a.download = `primary-super-quiz-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        break;
      case "trigger-import-backup":
        const fileIn = document.getElementById("import-backup-input");
        if (fileIn) fileIn.click();
        break;
      case "add-student-modal":
        const sName = prompt("Enter new student profile name:");
        if (sName && sName.trim()) {
          const list = listProfiles();
          const newId = "p" + (list.length + 1);
          list.push({ id: newId, name: sName.trim(), grade: state.grade || 1, created: Date.now() });
          saveProfiles(list);
          toast("Student profile created: " + sName);
          render();
        }
        break;
      case "export-class-csv":
        const rows = [["Student Name", "Grade", "XP", "Quizzes", "Accuracy (%)", "Study Time (Sec)"]];
        listProfiles().forEach(p => {
          rows.push([p.name, p.grade || 1, progress.xp, progress.quizzes, accuracyPct(), progress.studySec || 0]);
        });
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const dlA = document.createElement("a");
        dlA.href = encodeURI(csvContent);
        dlA.download = `class-roster-report-${new Date().toISOString().slice(0, 10)}.csv`;
        dlA.click();
        break;
      case "generate-print-worksheet":
        const gVal = Number(document.getElementById("ws-grade").value);
        const sVal = document.getElementById("ws-subject").value;
        const cntVal = Number(document.getElementById("ws-count").value);
        loadBank(gVal, sVal).then(bank => {
          state.questions = shuffle(bank).slice(0, cntVal);
          state.grade = gVal;
          state.subject = sVal;
          window.print();
        });
        break;
      case "proj-next":
        if (state.projectorIndex < state.questions.length - 1) {
          state.projectorIndex += 1;
          state.projectorRevealed = false;
          render();
        }
        break;
      case "proj-prev":
        if (state.projectorIndex > 0) {
          state.projectorIndex -= 1;
          state.projectorRevealed = false;
          render();
        }
        break;
      case "proj-toggle-reveal":
        state.projectorRevealed = !state.projectorRevealed;
        render();
        break;
      case "quit-quiz":
        if (confirm("Are you sure you want to quit this quiz?")) {
          stopClockTimer();
          stopTickTimer();
          stopSpeech();
          state.screen = "subject";
          render();
        }
        break;
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target.id === "subj-search") {
      state.query = e.target.value;
      render();
      const el = document.getElementById("subj-search");
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  });

  document.addEventListener("change", function (e) {
    if (e.target.id === "import-backup-input" && e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (parsed && typeof parsed.xp === "number") {
            progress = parsed;
            saveProgress();
            toast("Backup imported successfully!");
            render();
          }
        } catch (err) { toast("Invalid backup JSON file."); }
      };
      reader.readAsText(e.target.files[0]);
    }
  });

  // Keyboard Shortcuts (Universal Accessibility)
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
    const key = e.key.toUpperCase();

    if (state.screen === "quiz") {
      if (key === "A" || key === "1") submitAnswer(0);
      else if (key === "B" || key === "2") submitAnswer(1);
      else if (key === "C" || key === "3") submitAnswer(2);
      else if (key === "D" || key === "4") submitAnswer(3);
      else if (key === "ENTER" || key === " ") {
        if (state.revealed || state.mode === "exam") nextQuestion();
      }
      else if (key === "H") {
        state.usedHint = true;
        state.hintText = state.questions[state.index].hint || "Focus on core concepts.";
        render();
      }
      else if (key === "F") {
        state.flagged[state.index] = !state.flagged[state.index];
        render();
      }
      else if (key === "S") {
        state.scratchpadOpen = !state.scratchpadOpen;
        render();
      }
      else if (key === "R") {
        speakCurrentQuestion();
      }
      else if (key === "ESCAPE") {
        if (state.scratchpadOpen) {
          state.scratchpadOpen = false;
          render();
        }
      }
    }
  });

  // Service Worker Registration for 100% Offline PWA functionality
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }

  // Initial Boot Render
  render();

})();
