(function () {
  "use strict";

  const app = document.getElementById("app");
  const canvas = document.getElementById("confetti");
  const LETTERS = ["A", "B", "C", "D"];
  const bankCache = {};
  const SK = "psq-settings-v6";

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

  // Global Application State
  const state = {
    screen: "home",
    name: localStorage.getItem("psq-name") || "",
    grade: (function () {
      const n = Number(localStorage.getItem("psq-grade") || "");
      return n >= 1 && n <= 6 ? n : 5;
    })(),
    subject: "maths",
    selectedTopic: null,
    group: "all",
    query: "",
    length: 20,
    mode: "practice", // "practice", "exam", "timed"
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
    selectedPupilId: "c1",
    curriculumTab: "nerdc",
    editModalOpen: false,
    editingQIndex: null,
    editQData: { q: "", options: ["", "", "", ""], answer: 0, topic: "General", bloom: "Understand", explain: "" },
    classRoster: loadJSON("psq-class-roster-v2", [
      { id: "c1", name: "Chinedu Okafor", grade: 5, arm: "5 Gold", ca1: 18, ca2: 17, exam: 52 },
      { id: "c2", name: "Amina Bello", grade: 5, arm: "5 Gold", ca1: 19, ca2: 18, exam: 56 },
      { id: "c3", name: "Tunde Bakare", grade: 5, arm: "5 Gold", ca1: 15, ca2: 14, exam: 46 },
      { id: "c4", name: "Zainab Mohammed", grade: 5, arm: "5 Gold", ca1: 20, ca2: 19, exam: 58 },
      { id: "c5", name: "Emeka Nwosu", grade: 5, arm: "5 Gold", ca1: 16, ca2: 15, exam: 48 },
      { id: "c6", name: "Blessing Adeyemi", grade: 5, arm: "5 Gold", ca1: 17, ca2: 18, exam: 50 },
      { id: "c7", name: "Ibrahim Yakubu", grade: 5, arm: "5 Gold", ca1: 14, ca2: 13, exam: 39 },
      { id: "c8", name: "Fatima Aliyu", grade: 5, arm: "5 Gold", ca1: 19, ca2: 20, exam: 57 }
    ]),
    projectorIndex: 0,
    projectorRevealed: false,
    availableTopics: [],

    // ==========================================
    // NIGERIAN EXAM SETTER STATE
    // ==========================================
    examSetter: {
      schoolName: localStorage.getItem("psq-school-name") || "FEDERAL STAFF PRIMARY SCHOOL",
      schoolAddress: localStorage.getItem("psq-school-addr") || "P.M.B. 1024, Minna, Niger State",
      schoolMotto: localStorage.getItem("psq-school-motto") || "Motto: Knowledge, Character & Excellence",
      examType: "second_term",
      session: "2025/2026",
      grade: 5,
      subject: "maths",
      nceeBundle: "none",
      count: 40,
      layout: "2col",
      timeAllowed: "1 Hour 30 Mins",
      marksSecA: 40,
      marksSecB: 20,
      includeSecB: true,
      selectedTopics: [],
      instructions: "Answer ALL questions in Section A by choosing the correct option. For Section B, answer any THREE (3) questions. Show all your workings clearly.",
      questions: [],
      theoryQuestions: [],
      paperType: "A",
      savedPapers: loadJSON("psq-saved-exams-v1", [])
    },

    // ==========================================
    // CBT EXAM ROOM STATE
    // ==========================================
    cbt: {
      active: false,
      pin: "2026",
      candidateName: "",
      candidateNo: "",
      candidateArm: "Primary 5 Gold",
      paperTitle: "",
      questions: [],
      answers: [],
      flagged: {},
      index: 0,
      timeLeft: 3600,
      submitted: false,
      score: 0,
      total: 0,
      percentage: 0,
      gradeLetter: "A",
      remark: ""
    }
  };

  let audioCtx = null;
  let confettiTimer = null;
  let tickTimer = null;
  let clockTimer = null;
  let cbtTimer = null;
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

  function progressKey() { return "psq-progress-v6-" + uid(); }

  function loadCurrentProgress() {
    progress = loadJSON(progressKey(), Object.assign({}, EMPTY_PROGRESS));
    if (!progress.flashcards) progress.flashcards = { box1: [], box2: [], box3: [] };
    if (!progress.confidenceStats) progress.confidenceStats = { mastered: 0, misconceptions: 0, lucky: 0, growth: 0 };
    if (!progress.topicMastery) progress.topicMastery = {};
  }

  function saveProgress() {
    localStorage.setItem(progressKey(), JSON.stringify(progress));
  }

  function listProfiles() { return loadJSON("psq-profiles-v2", []); }
  function saveProfiles(list) { localStorage.setItem("psq-profiles-v2", JSON.stringify(list)); }

  function ensureProfiles() {
    let list = listProfiles();
    if (!list || !list.length) {
      list = [{ id: "p1", name: state.name || "Pupil 1", grade: state.grade || 5, created: Date.now() }];
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
    state.grade = found.grade || 5;
    localStorage.setItem("psq-name", state.name);
    localStorage.setItem("psq-grade", String(state.grade));
    loadCurrentProgress();
    toast("Switched to profile: " + found.name);
    render();
  }

  function schoolName() { return state.examSetter.schoolName; }

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
     AUDIO SYNTHESIS & SOUND EFFECTS (Pure Web Audio API)
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
    playTone(523.25, 0.12, "triangle", 0.08);
    setTimeout(function () { playTone(659.25, 0.12, "triangle", 0.08); }, 80);
    setTimeout(function () { playTone(783.99, 0.22, "triangle", 0.1); }, 160);
  }

  function playWrong() { playTone(196.00, 0.25, "square", 0.04); }

  function playBadgeFanfare() {
    playTone(440.00, 0.1, "triangle", 0.08);
    setTimeout(function () { playTone(554.37, 0.1, "triangle", 0.08); }, 90);
    setTimeout(function () { playTone(659.25, 0.1, "triangle", 0.08); }, 180);
    setTimeout(function () { playTone(880.00, 0.35, "triangle", 0.12); }, 270);
  }

  function playTick() { playTone(800, 0.03, "sine", 0.03); }

  /* ==========================================================================
     TEXT TO SPEECH (Web Speech API)
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

      if (settings.tts) setTimeout(speakCurrentQuestion, 300);
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
    if (!state.grade) state.grade = 5;
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
    if (!state.grade) state.grade = 5;
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
    if (!state.grade) state.grade = 5;
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
    if (!state.grade) state.grade = 5;
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
  function stopCbtTimer() { clearInterval(cbtTimer); cbtTimer = null; }

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
    const g = state.grade || 5;
    if (!progress.missed[g]) progress.missed[g] = [];
    const exists = progress.missed[g].some(function (item) { return item.q === q.q; });
    if (!exists) {
      progress.missed[g].unshift(q);
      if (progress.missed[g].length > 100) progress.missed[g].pop();
    }
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

    if (progress.lastDay !== todayStr) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (progress.lastDay === yesterday) progress.streak += 1;
      else progress.streak = 1;
      progress.lastDay = todayStr;
    }

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

    const bestKey = `${state.grade}/${state.subject || "mixed"}`;
    if (!progress.best[bestKey] || pct > progress.best[bestKey].pct) {
      progress.best[bestKey] = { pct: pct, score: correctCount, total: total, date: todayStr };
    }

    for (let i = 0; i < total; i++) {
      const ok = state.picked[i] === state.questions[i].answer;
      const conf = state.confidence[i] || "thinking";
      if (conf === "sure" && ok) progress.confidenceStats.mastered += 1;
      else if (conf === "sure" && !ok) progress.confidenceStats.misconceptions += 1;
      else if (conf === "guess" && ok) progress.confidenceStats.lucky += 1;
      else progress.confidenceStats.growth += 1;
    }

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
     NIGERIAN EXAM BUILDER & QUESTION GENERATION ENGINE
     ========================================================================== */

  async function generateNigerianExamPaper() {
    const es = state.examSetter;
    state.loading = true;
    render();

    try {
      let pool = [];
      if (es.nceeBundle && es.nceeBundle !== "none") {
        const bundle = window.NIGERIAN_NCEE_BUNDLES.find(b => b.id === es.nceeBundle);
        if (bundle) {
          const perSubj = Math.ceil(es.count / bundle.subjects.length);
          for (const s of bundle.subjects) {
            const bank = await loadBank(es.grade, s);
            const picked = shuffle(bank).slice(0, perSubj).map(q => Object.assign({}, q, { subject: s }));
            pool.push.apply(pool, picked);
          }
        }
      } else {
        const bank = await loadBank(es.grade, es.subject);
        let filtered = bank;
        if (es.selectedTopics && es.selectedTopics.length > 0) {
          const topFiltered = bank.filter(q => es.selectedTopics.indexOf(q.topic) >= 0);
          if (topFiltered.length >= 10) filtered = topFiltered;
        }
        pool = shuffle(filtered).map(q => Object.assign({}, q, { subject: es.subject }));
      }

      const chosenQuestions = pool.slice(0, Math.min(es.count, pool.length));
      es.questions = chosenQuestions;

      const theorySubj = (es.nceeBundle && es.nceeBundle !== "none") ? "maths" : es.subject;
      const bankSecB = (window.NIGERIAN_THEORY_BANK[theorySubj] && window.NIGERIAN_THEORY_BANK[theorySubj][es.grade])
        ? window.NIGERIAN_THEORY_BANK[theorySubj][es.grade]
        : (window.NIGERIAN_THEORY_BANK["maths"][es.grade] || window.NIGERIAN_THEORY_BANK["maths"][5]);

      es.theoryQuestions = (bankSecB || []).map(t => Object.assign({}, t));

      state.loading = false;
      state.screen = "exam_preview";
      render();
      toast("Exam paper generated successfully!");
    } catch (err) {
      state.loading = false;
      state.error = err.message || "Failed to generate exam paper.";
      render();
    }
  }

  function swapExamQuestion(idx) {
    const es = state.examSetter;
    const cur = es.questions[idx];
    if (!cur) return;
    const subj = cur.subject || es.subject;
    loadBank(es.grade, subj).then(bank => {
      const candidates = bank.filter(q => !es.questions.some(eq => eq.q === q.q));
      if (candidates.length) {
        es.questions[idx] = Object.assign({}, shuffle(candidates)[0], { subject: subj });
        toast(`Question ${idx + 1} swapped with fresh curriculum item.`);
        render();
      } else {
        toast("No other unselected questions found in this subtopic.");
      }
    });
  }

  function shufflePaperType(typeLetter) {
    const es = state.examSetter;
    es.paperType = typeLetter;
    es.questions = shuffle(es.questions).map(q => {
      const correctText = q.options[q.answer];
      const newOpts = shuffle(q.options);
      const newAns = newOpts.indexOf(correctText);
      return Object.assign({}, q, { options: newOpts, answer: newAns });
    });
    toast(`Paper Type ${typeLetter} generated with randomized order & options.`);
    render();
  }

  function saveCurrentExamPaper() {
    const es = state.examSetter;
    const typeObj = window.NIGERIAN_EXAM_TYPES.find(t => t.id === es.examType) || { name: "Term Examination" };
    const sName = (es.nceeBundle !== "none") ? "NCEE Multi-Subject" : (window.SUBJECTS[es.subject] ? window.SUBJECTS[es.subject].name : "Subject");
    const paperTitle = `Primary ${es.grade} ${sName} (${typeObj.name} ${es.session})`;

    const savedEntry = {
      id: "exam-" + Date.now(),
      title: paperTitle,
      savedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      config: JSON.parse(JSON.stringify(es))
    };

    es.savedPapers.unshift(savedEntry);
    localStorage.setItem("psq-saved-exams-v1", JSON.stringify(es.savedPapers));
    toast("Paper saved to My Exam Papers library!");
  }

  /* ==========================================================================
     EXPORT TO MICROSOFT WORD (.DOC) ENGINE
     ========================================================================== */

  function exportExamAsWordDoc() {
    const es = state.examSetter;
    const typeObj = window.NIGERIAN_EXAM_TYPES.find(t => t.id === es.examType) || { name: "Term Examination" };
    const sName = (es.nceeBundle !== "none") ? "NCEE MULTI-SUBJECT BUNDLE" : (window.SUBJECTS[es.subject] ? window.SUBJECTS[es.subject].name.toUpperCase() : "EXAM");

    let docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${esc(es.schoolName)} - Exam Paper</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.4; }
        h1 { font-size: 18pt; text-align: center; text-transform: uppercase; margin-bottom: 2pt; }
        h2 { font-size: 14pt; text-align: center; text-transform: uppercase; margin: 4pt 0; }
        p { margin: 2pt 0; }
        .details-table { width: 100%; border-collapse: collapse; margin: 10pt 0; font-size: 11pt; }
        .details-table td { padding: 4pt; }
        .instructions { border: 1pt solid #000; padding: 6pt; margin-bottom: 12pt; font-size: 10.5pt; }
        .section-hdr { background-color: #000; color: #fff; font-weight: bold; text-align: center; padding: 4pt; margin: 12pt 0 8pt; font-size: 12pt; }
        .q-item { margin-bottom: 8pt; page-break-inside: avoid; }
        .q-stem { font-weight: bold; }
        .opts { margin-left: 15pt; }
      </style>
      </head>
      <body>
        <h1>${esc(es.schoolName)}</h1>
        <p style="text-align:center;font-style:italic;">${esc(es.schoolAddress)}</p>
        <p style="text-align:center;font-weight:bold;">${esc(es.schoolMotto)}</p>
        <h2>${esc(typeObj.name.toUpperCase())} — ${esc(es.session)} ACADEMIC SESSION</h2>
        <p style="text-align:center;font-weight:bold;">SUBJECT: ${esc(sName)} · CLASS: PRIMARY ${es.grade} · TYPE ${es.paperType || "A"}</p>
        
        <table class="details-table">
          <tr>
            <td><strong>NAME:</strong> ____________________________________________</td>
            <td><strong>CLASS/ARM:</strong> __________________</td>
          </tr>
          <tr>
            <td><strong>EXAM NO:</strong> ________________________</td>
            <td><strong>TIME ALLOWED:</strong> ${esc(es.timeAllowed)}</td>
          </tr>
        </table>

        <div class="instructions">
          <strong>INSTRUCTIONS:</strong> ${esc(es.instructions)}
        </div>

        <div class="section-hdr">SECTION A: OBJECTIVES (${es.questions.length} MARKS)</div>
    `;

    es.questions.forEach((q, i) => {
      docHtml += `
        <div class="q-item">
          <div class="q-stem">${i + 1}. ${esc(q.q)}</div>
          <div class="opts">
            (a) ${esc(q.options[0])}&nbsp;&nbsp;&nbsp;&nbsp;(b) ${esc(q.options[1])}<br>
            (c) ${esc(q.options[2])}&nbsp;&nbsp;&nbsp;&nbsp;(d) ${esc(q.options[3])}
          </div>
        </div>
      `;
    });

    if (es.includeSecB && es.theoryQuestions && es.theoryQuestions.length) {
      docHtml += `<div class="section-hdr">SECTION B: THEORY (ANSWER ANY THREE · 20 MARKS)</div>`;
      es.theoryQuestions.forEach(t => {
        docHtml += `<div style="margin-bottom:12pt;page-break-inside:avoid;"><strong>${esc(t.q).replace(/\n/g, "<br>")}</strong></div>`;
      });
    }

    docHtml += `</body></html>`;

    const blob = new Blob(["\ufeff", docHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${es.schoolName.replace(/[^a-zA-Z0-9]/g, "_")}_Primary_${es.grade}_${es.subject}_Exam.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Exam exported as Microsoft Word (.doc) document!");
  }

  /* ==========================================================================
     CBT EXAM ROOM ENGINE
     ========================================================================== */

  function launchCBTExam() {
    const es = state.examSetter;
    if (!es.questions || !es.questions.length) {
      toast("Please generate an exam paper first.");
      return;
    }
    const cbt = state.cbt;
    cbt.active = true;
    cbt.questions = JSON.parse(JSON.stringify(es.questions));
    cbt.answers = new Array(cbt.questions.length).fill(null);
    cbt.flagged = {};
    cbt.index = 0;
    cbt.timeLeft = (es.count <= 20) ? 1800 : (es.count <= 40) ? 3600 : 5400;
    cbt.submitted = false;
    cbt.paperTitle = `Primary ${es.grade} ${window.SUBJECTS[es.subject] ? window.SUBJECTS[es.subject].name : "Exam"} · ${es.session}`;

    state.screen = "cbt_hall";
    render();
    startCbtTimer();
  }

  function startCbtTimer() {
    stopCbtTimer();
    cbtTimer = setInterval(function () {
      if (state.screen !== "cbt_hall" || state.cbt.submitted) return;
      state.cbt.timeLeft -= 1;
      const el = document.getElementById("cbt-timer-disp");
      if (el) el.textContent = fmtCbtTime(state.cbt.timeLeft);
      if (state.cbt.timeLeft <= 0) {
        stopCbtTimer();
        submitCbtExam();
      }
    }, 1000);
  }

  function fmtCbtTime(sec) {
    if (sec <= 0) return "00:00:00";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? (h < 10 ? "0" + h : h) + ":" : ""}${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  }

  function submitCbtExam() {
    stopCbtTimer();
    const cbt = state.cbt;
    cbt.submitted = true;
    let score = 0;
    for (let i = 0; i < cbt.questions.length; i++) {
      if (cbt.answers[i] === cbt.questions[i].answer) score += 1;
    }
    cbt.score = score;
    cbt.total = cbt.questions.length;
    cbt.percentage = Math.round((score / cbt.total) * 100);

    const ng = getNigerianGrade(cbt.percentage);
    cbt.gradeLetter = ng.grade;
    cbt.remark = ng.remark;

    if (cbt.candidateName && cbt.candidateName.trim()) {
      const examMarks = Math.round((cbt.percentage / 100) * 60);
      const newPupil = {
        id: "c-" + Date.now(),
        name: cbt.candidateName.trim(),
        grade: state.examSetter.grade,
        arm: cbt.candidateArm || "Primary 5 Gold",
        ca1: Math.min(20, Math.round(examMarks * 0.33) + 3),
        ca2: Math.min(20, Math.round(examMarks * 0.33) + 2),
        exam: examMarks
      };
      state.classRoster.unshift(newPupil);
      localStorage.setItem("psq-class-roster-v2", JSON.stringify(state.classRoster));
    }

    render();
    if (cbt.percentage >= 70) launchConfetti();
  }

  function getNigerianGrade(pct) {
    const list = window.NIGERIAN_GRADING || [];
    for (let i = 0; i < list.length; i++) {
      if (pct >= list[i].min && pct <= list[i].max) return list[i];
    }
    return { grade: "F", label: "Needs Improvement", remark: "Requires intensive remedial revision." };
  }

  /* ==========================================================================
     SCRATCHPAD WHITEBOARD ENGINE (HTML5 CANVAS)
     ========================================================================== */

  function initScratchpadCanvas() {
    const cvs = document.getElementById("scratchpad-canvas");
    if (!cvs) return;
    scratchpadCtx = cvs.getContext("2d");
    cvs.width = cvs.parentElement.clientWidth || 320;
    cvs.height = cvs.parentElement.clientHeight || 280;

    cvs.addEventListener("mousedown", startScratchDraw);
    cvs.addEventListener("mousemove", drawScratch);
    cvs.addEventListener("mouseup", stopScratchDraw);
    cvs.addEventListener("mouseleave", stopScratchDraw);

    cvs.addEventListener("touchstart", function (e) {
      e.preventDefault();
      const t = e.touches[0];
      const rect = cvs.getBoundingClientRect();
      lastX = t.clientX - rect.left;
      lastY = t.clientY - rect.top;
      isDrawing = true;
    }, { passive: false });

    cvs.addEventListener("touchmove", function (e) {
      e.preventDefault();
      if (!isDrawing) return;
      const t = e.touches[0];
      const rect = cvs.getBoundingClientRect();
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;
      drawOnCanvas(x, y);
      lastX = x;
      lastY = y;
    }, { passive: false });

    cvs.addEventListener("touchend", function (e) {
      e.preventDefault();
      isDrawing = false;
    });
  }

  function startScratchDraw(e) {
    const cvs = document.getElementById("scratchpad-canvas");
    if (!cvs) return;
    const rect = cvs.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    isDrawing = true;
  }

  function drawScratch(e) {
    if (!isDrawing) return;
    const cvs = document.getElementById("scratchpad-canvas");
    if (!cvs) return;
    const rect = cvs.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawOnCanvas(x, y);
    lastX = x;
    lastY = y;
  }

  function stopScratchDraw() { isDrawing = false; }

  function drawOnCanvas(x, y) {
    if (!scratchpadCtx) return;
    scratchpadCtx.beginPath();
    scratchpadCtx.moveTo(lastX, lastY);
    scratchpadCtx.lineTo(x, y);
    if (state.scratchpadTool === "eraser") {
      scratchpadCtx.strokeStyle = "#ffffff";
      scratchpadCtx.lineWidth = 18;
    } else {
      scratchpadCtx.strokeStyle = state.scratchpadColor || "#0e7c76";
      scratchpadCtx.lineWidth = state.scratchpadSize || 4;
    }
    scratchpadCtx.lineCap = "round";
    scratchpadCtx.lineJoin = "round";
    scratchpadCtx.stroke();
  }

  /* ==========================================================================
     QUIZ ENGINE RENDERER (RETRIEVAL PRACTICE VIEW)
     ========================================================================== */

  function renderQuiz() {
    const total = state.questions.length;
    const q = state.questions[state.index];
    if (!q) return `<div class="wrap">${renderTopBar("subject")}<p>Loading question...</p></div>`;

    const s = window.SUBJECTS[q.subject || state.subject] || { name: "Subject", icon: "📘" };
    const pctProg = Math.round(((state.index + 1) / total) * 100);
    const hiddenOpts = state.hidden[state.index] || [];
    const chosenOpt = state.picked[state.index];
    const isRev = state.revealed;
    const isExam = state.mode === "exam";

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <div style="display:flex;align-items:center;gap:10px;">
            <button class="btn btn-ghost btn-sm" data-action="quit-quiz">✕ Quit</button>
            <span class="chip">Q ${state.index + 1} / ${total}</span>
            <span class="chip" id="sess-clock">⏱ ${fmtDur(state.elapsedSec)}</span>
            ${state.mode === "timed" ? `<span class="chip on timer-wrap">⏱ ${state.timer}s</span>` : ""}
            ${state.combo >= 2 ? `<span class="chip on" style="background:#fef3c7;color:#92400e;border-color:#f59e0b;">🔥 ${state.combo} Streak!</span>` : ""}
          </div>
          <div class="top-actions">
            <button class="icon-btn" data-action="speak-q" title="Read Aloud (R)">🔊</button>
            <button class="icon-btn" data-action="use-5050" title="50/50 Lifeline (Eliminate 2)" ${state.used5050 || isRev ? "disabled" : ""}>✂️</button>
            <button class="icon-btn" data-action="use-skip" title="Skip Question" ${state.usedSkip || isRev ? "disabled" : ""}>⏩</button>
            <button class="icon-btn" data-action="use-hint" title="Show Hint (H)" ${state.usedHint || isRev ? "disabled" : ""}>💡</button>
            <button class="icon-btn" data-action="toggle-flag" title="Flag Question (F)">${state.flagged[state.index] ? "🚩" : "🏳️"}</button>
            <button class="icon-btn" data-action="toggle-scratchpad" title="Working Scratchpad (S)">📝</button>
          </div>
        </div>

        <div class="progress-bar">
          <div class="progress-fill" style="width:${pctProg}%;"></div>
        </div>

        <div class="q-card" style="margin-top:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;gap:6px;align-items:center;">
              <span class="badge-tag">${s.icon} ${s.name}</span>
              <span class="chip" style="font-size:0.75rem;">${esc(q.topic || "Core")}</span>
            </div>
            <span class="chip" style="font-size:0.75rem;background:#f1f5f9;">Bloom: <strong>${esc(q.bloom || "Understand")}</strong></span>
          </div>

          <h2 class="question">${esc(q.q)}</h2>

          ${state.usedHint && state.hintText ? `<div class="hint-box">💡 <strong>Pedagogical Hint:</strong> ${esc(state.hintText)}</div>` : ""}

          <!-- Metacognitive Confidence Selector -->
          ${settings.confidenceMode && !isRev && chosenOpt == null ? `
            <div style="margin:14px 0 10px;padding:8px 12px;background:var(--card-alt);border-radius:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;font-size:0.85rem;">
              <span><strong>Metacognitive Calibration:</strong> How sure are you?</span>
              <div style="display:flex;gap:6px;">
                <button class="chip ${state.confidence[state.index] === "sure" ? "on" : ""}" data-set-conf="sure">🌟 Confident</button>
                <button class="chip ${state.confidence[state.index] === "thinking" ? "on" : ""}" data-set-conf="thinking">🤔 Thinking</button>
                <button class="chip ${state.confidence[state.index] === "guess" ? "on" : ""}" data-set-conf="guess">🎲 Guessing</button>
              </div>
            </div>
          ` : ""}

          <div class="options">
            ${q.options.map(function (opt, oi) {
              if (hiddenOpts.indexOf(oi) >= 0) return "";
              let cls = "opt";
              if (isRev) {
                if (oi === q.answer) cls += " correct";
                else if (oi === chosenOpt) cls += " wrong";
              } else if (isExam && chosenOpt === oi) {
                cls += " correct";
              }

              return `
                <button class="${cls}" data-opt="${oi}">
                  <span class="badge">${LETTERS[oi]}</span>
                  <span>${esc(opt)}</span>
                </button>`;
            }).join("")}
          </div>

          ${isRev ? `
            <div class="feedback ${chosenOpt === q.answer ? "ok" : "err"}">
              <strong>${chosenOpt === q.answer ? "🎉 Correct!" : "⚠️ Incorrect!"}</strong>
              <p style="margin-top:6px;line-height:1.5;">${esc(q.explain)}</p>
            </div>
          ` : ""}

          <div class="quiz-actions" style="margin-top:20px;">
            ${(isRev || (isExam && chosenOpt != null)) ? `
              <button class="btn btn-primary" data-action="quiz-next" style="width:100%;justify-content:center;font-size:1.05rem;">
                ${state.index < total - 1 ? "Next Question →" : "Finish & View Results 🏆"}
              </button>
            ` : ""}
          </div>
        </div>

        <!-- Scratchpad Whiteboard Drawer -->
        ${state.scratchpadOpen ? `
          <div class="scratchpad-drawer no-print">
            <div class="scratchpad-header">
              <strong>📝 Rough Work Scratchpad</strong>
              <div style="display:flex;gap:6px;">
                <button class="chip ${state.scratchpadTool === "pen" ? "on" : ""}" data-set-stool="pen">✏️ Pen</button>
                <button class="chip ${state.scratchpadTool === "eraser" ? "on" : ""}" data-set-stool="eraser">🧹 Eraser</button>
                <button class="chip" data-set-scolor="#0e7c76" style="background:#0e7c76;color:#fff;">●</button>
                <button class="chip" data-set-scolor="#e11d48" style="background:#e11d48;color:#fff;">●</button>
                <button class="chip" data-set-scolor="#0284c7" style="background:#0284c7;color:#fff;">●</button>
                <button class="btn btn-ghost btn-sm" data-action="clear-scratchpad">Clear</button>
                <button class="btn btn-ghost btn-sm" data-action="close-scratchpad">✕</button>
              </div>
            </div>
            <div class="scratchpad-canvas-wrap">
              <canvas id="scratchpad-canvas"></canvas>
            </div>
          </div>
        ` : ""}
      </div>`;
  }

  /* ==========================================================================
     QUIZ RESULT & PEDAGOGICAL EVALUATION VIEW
     ========================================================================== */

  function renderResult() {
    const total = state.questions.length;
    let correctCount = 0;
    for (let i = 0; i < total; i++) {
      if (state.picked[i] === state.questions[i].answer) correctCount += 1;
    }
    const pct = Math.round((correctCount / total) * 100);
    const gl = gradeLetter(pct);
    const r = rankFor(progress.xp);

    return `
      <div class="wrap">
        <div class="result">
          <div class="letter-mark">${gl.mark}</div>
          <div class="kicker">Formative Evaluation · Primary ${state.grade || 5}</div>
          <h2 class="section-title">${esc(scorePedagogicalMessage(pct))}</h2>
          <p class="sub">${gl.label} · ${progress.xp} Total XP · ${r.name}</p>

          <div class="metric-grid">
            <div><b>${correctCount} / ${total}</b><span>Score</span></div>
            <div><b>${pct}%</b><span>Accuracy</span></div>
            <div><b>+${state.xpGained} XP</b><span>Points Earned</span></div>
            <div><b>${fmtDur(state.elapsedSec)}</b><span>Duration</span></div>
          </div>

          ${state.newBadges && state.newBadges.length ? `
            <div class="q-card" style="margin:24px 0;background:#fef3c7;border-color:#f59e0b;">
              <h3 style="color:#92400e;">🎖️ New Academic Badges Unlocked!</h3>
              <div style="display:flex;gap:12px;justify-content:center;margin-top:10px;flex-wrap:wrap;">
                ${state.newBadges.map(function (bid) {
                  const b = (window.BADGES || []).find(x => x.id === bid) || { icon: "⭐", name: "Badge" };
                  return `<div class="chip on" style="font-size:0.95rem;">${b.icon} ${esc(b.name)}</div>`;
                }).join("")}
              </div>
            </div>
          ` : ""}

          <div class="top-actions" style="justify-content:center;gap:12px;margin-top:28px;flex-wrap:wrap;">
            <button class="btn btn-primary" data-go="review">Detailed Item Review 🔍</button>
            <button class="btn btn-sun" data-action="launch-quiz">Practice Again 🔄</button>
            <button class="btn btn-ghost" data-go="flashcards">Spaced Recall Flashcards 🗂️</button>
            <button class="btn btn-ghost" data-go="report">Diagnostic Dossier 📊</button>
            <button class="btn btn-ghost" data-go="certificate">Print Certificate 📜</button>
            <button class="btn btn-ghost" data-go="home">Home 🏠</button>
          </div>
        </div>
      </div>`;
  }

  /* ==========================================================================
     DETAILED POST-TEST QUESTION REVIEW VIEW
     ========================================================================== */

  function renderReview() {
    const total = state.questions.length;
    const filter = state.reviewFilter || "all";

    const filtered = state.questions.map(function (q, i) {
      return { q, index: i, userAns: state.picked[i], isCorrect: state.picked[i] === q.answer, isFlagged: !!state.flagged[i] };
    }).filter(function (item) {
      if (filter === "missed") return !item.isCorrect;
      if (filter === "correct") return item.isCorrect;
      if (filter === "flagged") return item.isFlagged;
      return true;
    });

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="result">←</button>
          <div class="chip-group">
            <button class="chip ${filter === "all" ? "on" : ""}" data-set-rfilter="all">All (${total})</button>
            <button class="chip ${filter === "missed" ? "on" : ""}" data-set-rfilter="missed">Missed</button>
            <button class="chip ${filter === "correct" ? "on" : ""}" data-set-rfilter="correct">Correct</button>
            <button class="chip ${filter === "flagged" ? "on" : ""}" data-set-rfilter="flagged">Flagged</button>
          </div>
          <button class="btn btn-primary btn-sm" data-action="print-page">🖨️ Print Review</button>
        </div>

        <h2 class="section-title">Item-by-Item Formative Review</h2>
        <p class="sub">Examine step-by-step solutions, cognitive domains, and curriculum competencies.</p>

        <div style="display:flex;flex-direction:column;gap:18px;margin-top:20px;">
          ${filtered.map(function (item) {
            const q = item.q;
            const ok = item.isCorrect;
            return `
              <div class="q-card" style="border-left:6px solid ${ok ? "var(--teal)" : "var(--coral)"};">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <span class="badge-tag">Question ${item.index + 1} · ${esc(q.topic || "General")}</span>
                  <span class="chip ${ok ? "on" : ""}" style="${ok ? "" : "background:#fee2e2;color:#991b1b;border-color:#f87171;"}">${ok ? "✅ Correct" : "❌ Missed"}</span>
                </div>
                <h3 style="font-size:1.15rem;margin-bottom:12px;">${esc(q.q)}</h3>
                <div class="options">
                  ${q.options.map(function (opt, oi) {
                    let cls = "opt";
                    if (oi === q.answer) cls += " correct";
                    else if (oi === item.userAns) cls += " wrong";
                    return `
                      <div class="${cls}" style="cursor:default;">
                        <span class="badge">${LETTERS[oi]}</span>
                        <span>${esc(opt)} ${oi === q.answer ? " (Correct Key)" : oi === item.userAns ? " (Your Selection)" : ""}</span>
                      </div>`;
                  }).join("")}
                </div>
                <div class="feedback ok" style="margin-top:12px;">
                  <strong>Pedagogical Solution &amp; Working Steps:</strong>
                  <p style="margin-top:4px;line-height:1.5;">${esc(q.explain)}</p>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  /* ==========================================================================
     SPACED REPETITION FLASHCARDS (LEITNER 3-BOX SYSTEM)
     ========================================================================== */

  function renderFlashcards() {
    const g = state.grade || 5;
    const list = progress.missed[g] || [];
    const total = list.length;
    const cur = list[state.flashcardIndex] || list[0];
    const isFlipped = state.flashcardFlipped;

    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Spaced Recall Flashcards" }])}
        <div class="kicker">Leitner 3-Box Active Recall System</div>
        <h2 class="section-title">Spaced Retrieval Flashcards</h2>
        <p class="sub">Review previous misconceptions at scientifically spaced intervals to lock facts into permanent memory.</p>

        <div class="home-stats" style="margin:20px 0;">
          <div class="stat-tile"><b>${progress.flashcards.box1.length}</b><span>Box 1 (Daily)</span></div>
          <div class="stat-tile"><b>${progress.flashcards.box2.length}</b><span>Box 2 (3 Days)</span></div>
          <div class="stat-tile"><b>${progress.flashcards.box3.length}</b><span>Box 3 (Mastered)</span></div>
          <div class="stat-tile"><b>${total}</b><span>Total Missed Items</span></div>
        </div>

        ${cur ? `
          <div class="flashcard-scene" data-action="flip-flashcard" style="perspective:1000px;margin:24px auto;max-width:600px;cursor:pointer;">
            <div class="flashcard ${isFlipped ? "flipped" : ""}" style="background:var(--card);border:2px solid var(--teal);border-radius:16px;padding:36px;min-height:260px;display:flex;flex-direction:column;justify-content:center;text-align:center;box-shadow:var(--shadow-md);">
              ${!isFlipped ? `
                <div class="kicker" style="color:var(--teal);">Curriculum Question · Tap Card to Flip 🔄</div>
                <h3 style="font-size:1.35rem;margin:16px 0;line-height:1.5;">${esc(cur.q)}</h3>
                <span class="chip" style="margin:0 auto;font-size:0.8rem;">${esc(cur.topic || "Subject Item")}</span>
              ` : `
                <div class="kicker" style="color:var(--coral);">Correct Answer &amp; Explanation</div>
                <h2 style="color:var(--teal);font-size:1.45rem;margin:12px 0;">${esc(cur.options[cur.answer])}</h2>
                <p style="font-size:0.95rem;line-height:1.5;color:var(--ink);">${esc(cur.explain)}</p>
              `}
            </div>
          </div>

          ${isFlipped ? `
            <div style="display:flex;justify-content:center;gap:12px;margin-top:16px;flex-wrap:wrap;">
              <button class="btn btn-coral" data-rate-card="1">🔴 Hard (Repeat Daily)</button>
              <button class="btn btn-sun" data-rate-card="2">🟡 Good (Review in 3 Days)</button>
              <button class="btn btn-primary" data-rate-card="3">🟢 Easy (Mastered to Box 3)</button>
            </div>
          ` : `
            <div style="text-align:center;margin-top:12px;">
              <button class="btn btn-primary" data-action="flip-flashcard">Flip Card to Reveal Answer 🔄</button>
            </div>
          `}
        ` : `
          <div class="q-card" style="text-align:center;padding:48px 24px;margin-top:24px;">
            <div style="font-size:3rem;margin-bottom:12px;">🎉</div>
            <h3>Zero Misconceptions Pending!</h3>
            <p class="sub">You have mastered all attempted questions. Start a new quiz to discover new challenge items.</p>
            <button class="btn btn-primary" data-go="subject" style="margin-top:16px;">Start Practice Quiz →</button>
          </div>
        `}
      </div>`;
  }

  /* ==========================================================================
     MAIN ROUTING RENDERER & ENTRY POINT
     ========================================================================== */

  function renderTopBar(backTarget) {
    const backBtn = backTarget
      ? `<button class="icon-btn" data-go="${backTarget}" aria-label="Go back">←</button>`
      : `<div class="brand" data-go="home"><img src="images/favicon.png" alt=""><span>Super Quiz</span></div>`;

    return `
      <header class="topbar no-print">
        <div style="display:flex;align-items:center;gap:12px;">
          ${backBtn}
          <span class="chip" data-go="account" style="cursor:pointer;">👤 ${esc(state.name || "Scholar")} · P${state.grade || 5}</span>
        </div>
        <div class="top-actions">
          <button class="btn btn-sun btn-sm" data-go="exam_setter">🇳🇬 Set Exam Paper</button>
          <button class="icon-btn" data-action="toggle-sound" title="Toggle sound FX">${settings.sound ? "🔊" : "🔇"}</button>
          <button class="icon-btn" data-go="teachers" title="Teacher Hub & Class Broadsheet">👨‍🏫</button>
          <button class="icon-btn" data-go="flashcards" title="Spaced Recall Flashcards">🗂️</button>
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
    const r = rankFor(progress.xp);

    return `
      <div class="wrap">
        ${renderTopBar(null)}
        <section class="hero">
          <div>
            <div class="kicker">Universal Basic Education · NERDC Aligned · 100% Offline</div>
            <h1>Primary Super Quiz</h1>
            <p class="lead">World-class retrieval practice and official Nigerian Examination Setter for Primary 1–6 (Basic 1–6). 16 subjects, 9,600 unique curriculum questions, 2-column printable exam papers, OMR shading sheets, and CBT exam hall.</p>
            <div class="top-actions" style="margin-top:16px;">
              <button class="btn btn-primary" data-action="start">Start Practising →</button>
              <button class="btn btn-sun" data-go="exam_setter">🇳🇬 Set Nigerian Exam Paper</button>
              <button class="btn btn-ghost" data-go="broadsheet">Teacher Broadsheet 📊</button>
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

        <h2 class="section-title" style="margin-top:28px;">Learning &amp; Assessment Modes</h2>
        <p class="sub">Choose an active learning path designed by cognitive scientists and primary educators.</p>

        <div class="play-row">
          <div class="play-tile" style="border-top:5px solid #0e7c76;background:#f0fdfa;" data-go="exam_setter">
            <span class="ico">🇳🇬</span>
            <strong>Nigerian Exam Center</strong>
            <p>Set formal 1st/2nd/3rd term exams, NCEE mocks, printable OMR bubble sheets & Section B theory.</p>
          </div>
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
        </div>

        <section class="trust-row" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;margin:32px 0;">
          <div class="stat-tile"><b>16</b><span>NERDC Subjects</span></div>
          <div class="stat-tile"><b>9,600</b><span>100% Unique Questions</span></div>
          <div class="stat-tile"><b>P1–P6</b><span>Basic 1 to Basic 6</span></div>
          <div class="stat-tile"><b>NCEE</b><span>Common Entrance Ready</span></div>
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
        <div class="kicker">Universal Basic Education Standards</div>
        <h2 class="section-title">Select Your Class Grade (Basic 1–6)</h2>
        <p class="sub">Questions and cognitive difficulty are developmentally calibrated from Primary 1 to Primary 6.</p>
        <div class="grid-grades">${cards}</div>
      </div>`;
  }

  function renderSubjects() {
    const g = state.grade || 5;
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
            <button class="btn btn-ghost btn-sm" data-drill-subj="${k}">Subtopics</button>
          </div>
        </div>`;
    }).join("");

    return `
      <div class="wrap">
        ${renderTopBar("grade")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: window.GRADE_INFO[g].label, go: "grade" }, { label: "Subjects" }])}
        <div class="kicker">${window.GRADE_INFO[g].label} · ${window.GRADE_INFO[g].international}</div>
        <h2 class="section-title">Select a Subject Domain</h2>
        <p class="sub">16 comprehensive subjects aligned with NERDC and international primary frameworks.</p>
        <div class="chip-group">${groupBtns}</div>
        <div style="margin-bottom:20px;">
          <input type="text" id="subj-search" class="btn btn-ghost" style="width:100%;max-width:400px;text-align:left;" placeholder="🔍 Search subjects or topics..." value="${esc(state.query)}">
        </div>
        <div class="grid-subjects">${subjCards || `<div class="empty-state">No subjects matched your filter.</div>`}</div>
      </div>`;
  }

  function renderTopicDrill() {
    const s = window.SUBJECTS[state.subject] || { name: "Subject Topics", icon: "📘" };
    const g = state.grade || 5;

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
    const g = state.grade || 5;

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
     NIGERIAN EXAM SETTER SCREEN (BUILDER & TABLE OF SPECIFICATIONS)
     ========================================================================== */

  function renderExamSetter() {
    const es = state.examSetter;
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Nigerian Exam Setter Suite" }])}
        <div class="kicker">NERDC &amp; Universal Basic Education Standards</div>
        <h2 class="section-title">🇳🇬 Nigerian School Examination Setter</h2>
        <p class="sub">Set standard termly exams, Continuous Assessment tests, NCEE mocks, 2-column print papers, OMR shading sheets, and CBT exam halls.</p>

        <div class="q-card" style="margin-bottom:28px;">
          <h3 style="margin-bottom:16px;">🏫 1. School Header &amp; Institutional Details</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:16px;">
            <div>
              <label class="kicker">School Name</label>
              <input type="text" id="es-school-name" class="btn btn-ghost" style="width:100%;text-align:left;font-weight:700;" value="${esc(es.schoolName)}" placeholder="e.g. COMMAND CHILDREN'S SCHOOL">
            </div>
            <div>
              <label class="kicker">School Motto</label>
              <input type="text" id="es-school-motto" class="btn btn-ghost" style="width:100%;text-align:left;" value="${esc(es.schoolMotto)}" placeholder="e.g. Motto: Knowledge & Excellence">
            </div>
            <div>
              <label class="kicker">Address / Town / State</label>
              <input type="text" id="es-school-addr" class="btn btn-ghost" style="width:100%;text-align:left;" value="${esc(es.schoolAddress)}" placeholder="e.g. P.M.B. 1024, Minna, Niger State">
            </div>
          </div>
        </div>

        <div class="q-card" style="margin-bottom:28px;">
          <h3 style="margin-bottom:16px;">📝 2. Examination Classification &amp; Subject</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;">
            <div>
              <label class="kicker">Examination Type</label>
              <select id="es-exam-type" class="btn btn-ghost" style="width:100%;text-align:left;">
                ${window.NIGERIAN_EXAM_TYPES.map(t => `<option value="${t.id}" ${es.examType === t.id ? "selected" : ""}>${t.name}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="kicker">Academic Session</label>
              <select id="es-session" class="btn btn-ghost" style="width:100%;text-align:left;">
                ${window.NIGERIAN_SESSIONS.map(s => `<option value="${s}" ${es.session === s ? "selected" : ""}>${s} Session</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="kicker">Class Level</label>
              <select id="es-grade" class="btn btn-ghost" style="width:100%;text-align:left;">
                ${[1, 2, 3, 4, 5, 6].map(g => `<option value="${g}" ${es.grade === g ? "selected" : ""}>Primary ${g} (Basic ${g})</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="kicker">Subject Domain</label>
              <select id="es-subject" class="btn btn-ghost" style="width:100%;text-align:left;">
                <option value="maths" ${es.subject === "maths" ? "selected" : ""}>Mathematics</option>
                <option value="english" ${es.subject === "english" ? "selected" : ""}>English Studies</option>
                <option value="science" ${es.subject === "science" ? "selected" : ""}>Basic Science</option>
                <option value="social" ${es.subject === "social" ? "selected" : ""}>Social Studies</option>
                <option value="civic" ${es.subject === "civic" ? "selected" : ""}>Civic Education</option>
                <option value="computer" ${es.subject === "computer" ? "selected" : ""}>Computer Studies (ICT)</option>
                <option value="agric" ${es.subject === "agric" ? "selected" : ""}>Agricultural Science</option>
                <option value="home" ${es.subject === "home" ? "selected" : ""}>Home Economics</option>
                <option value="cca" ${es.subject === "cca" ? "selected" : ""}>Cultural &amp; Creative Arts</option>
                <option value="phe" ${es.subject === "phe" ? "selected" : ""}>Physical &amp; Health Education</option>
                <option value="history" ${es.subject === "history" ? "selected" : ""}>History</option>
                <option value="verbal" ${es.subject === "verbal" ? "selected" : ""}>Verbal Reasoning</option>
                <option value="quantitative" ${es.subject === "quantitative" ? "selected" : ""}>Quantitative Reasoning</option>
                <option value="security" ${es.subject === "security" ? "selected" : ""}>Security Education</option>
                <option value="crs" ${es.subject === "crs" ? "selected" : ""}>Christian Religious Studies</option>
                <option value="irs" ${es.subject === "irs" ? "selected" : ""}>Islamic Religious Studies</option>
              </select>
            </div>
          </div>

          <div style="margin-top:16px;">
            <label class="kicker">Or Select NCEE / Common Entrance Multi-Subject Bundle:</label>
            <select id="es-ncee-bundle" class="btn btn-ghost" style="width:100%;text-align:left;">
              <option value="none" ${es.nceeBundle === "none" ? "selected" : ""}>None (Use Single Subject Selected Above)</option>
              ${window.NIGERIAN_NCEE_BUNDLES.map(b => `<option value="${b.id}" ${es.nceeBundle === b.id ? "selected" : ""}>${b.name}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="q-card" style="margin-bottom:28px;">
          <h3 style="margin-bottom:16px;">⚙️ 3. Paper Configuration &amp; Marks Breakdown</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;">
            <div>
              <label class="kicker">Section A (MCQ Count)</label>
              <select id="es-count" class="btn btn-ghost" style="width:100%;text-align:left;">
                <option value="15" ${es.count === 15 ? "selected" : ""}>15 Questions (C.A. Test)</option>
                <option value="20" ${es.count === 20 ? "selected" : ""}>20 Questions (Standard C.A.)</option>
                <option value="30" ${es.count === 30 ? "selected" : ""}>30 Questions</option>
                <option value="40" ${es.count === 40 ? "selected" : ""}>40 Questions (Standard Terminal)</option>
                <option value="50" ${es.count === 50 ? "selected" : ""}>50 Questions</option>
                <option value="60" ${es.count === 60 ? "selected" : ""}>60 Questions (Full NCEE Mock)</option>
                <option value="80" ${es.count === 80 ? "selected" : ""}>80 Questions (Marathon Mock)</option>
              </select>
            </div>
            <div>
              <label class="kicker">Time Allowed</label>
              <input type="text" id="es-time-allowed" class="btn btn-ghost" style="width:100%;text-align:left;" value="${esc(es.timeAllowed)}" placeholder="e.g. 1 Hour 30 Mins">
            </div>
            <div>
              <label class="kicker">Print Layout Format</label>
              <select id="es-layout" class="btn btn-ghost" style="width:100%;text-align:left;">
                <option value="2col" ${es.layout === "2col" ? "selected" : ""}>2 Columns (Compact / Low Photocopy Cost)</option>
                <option value="1col" ${es.layout === "1col" ? "selected" : ""}>1 Column (Standard Spaced)</option>
              </select>
            </div>
            <div>
              <label class="kicker">Include Section B (Theory / Essay)</label>
              <select id="es-include-secb" class="btn btn-ghost" style="width:100%;text-align:left;">
                <option value="yes" ${es.includeSecB ? "selected" : ""}>Yes (Objective + Theory)</option>
                <option value="no" ${!es.includeSecB ? "selected" : ""}>No (Objective Only / NCEE Style)</option>
              </select>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:32px;">
          <button class="btn btn-primary" data-action="generate-exam-btn">${state.loading ? "Generating..." : "Generate Complete Exam Paper →"}</button>
          <button class="btn btn-sun" data-go="exam_library">📂 My Saved Exam Papers (${es.savedPapers.length})</button>
          <button class="btn btn-ghost" data-go="broadsheet">📊 Class C.A. Broadsheet</button>
        </div>
      </div>`;
  }

  /* ==========================================================================
     EXAM PAPER PREVIEW & LIVE QUESTION SWAPPER SCREEN
     ========================================================================== */

  function renderExamPreview() {
    const es = state.examSetter;
    const typeObj = window.NIGERIAN_EXAM_TYPES.find(t => t.id === es.examType) || { name: "Term Examination" };
    const sName = (es.nceeBundle !== "none")
      ? "NATIONAL COMMON ENTRANCE MULTI-SUBJECT BUNDLE"
      : (window.SUBJECTS[es.subject] ? window.SUBJECTS[es.subject].name.toUpperCase() : "EXAMINATION");

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="btn btn-ghost btn-sm" data-go="exam_setter">← Back to Exam Setter</button>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-sun btn-sm" data-action="save-exam-paper">💾 Save Paper</button>
            <button class="btn btn-ghost btn-sm" data-action="shuffle-type" data-type="B">🔀 Type B</button>
            <button class="btn btn-ghost btn-sm" data-action="open-add-q-modal">➕ Add Custom Q</button>
            <button class="btn btn-ghost btn-sm" data-action="export-word-doc">📄 Export MS Word (.doc)</button>
            <button class="btn btn-ghost btn-sm" data-go="omr_sheet">📄 OMR Shading Sheet</button>
            <button class="btn btn-ghost btn-sm" data-go="marking_scheme">🔑 Marking Scheme &amp; TOS</button>
            <button class="btn btn-ghost btn-sm" data-action="launch-cbt-exam">💻 Launch CBT Exam</button>
            <button class="btn btn-primary" data-action="print-page">🖨️ Print Exam Paper</button>
          </div>
        </div>

        <!-- OFFICIAL NIGERIAN EXAM QUESTION PAPER -->
        <div class="exam-paper-container">
          <header class="ng-exam-header">
            <h1 class="ng-school-title">${esc(es.schoolName)}</h1>
            <p class="ng-school-address">${esc(es.schoolAddress)}</p>
            <p style="font-size:0.85rem;font-weight:700;color:#333;">${esc(es.schoolMotto)}</p>
            <div class="ng-exam-session-banner">
              ${esc(typeObj.name.toUpperCase())} — ${esc(es.session)} ACADEMIC SESSION
            </div>
            <div style="font-size:1.15rem;font-weight:800;margin-top:6px;text-transform:uppercase;">
              SUBJECT: ${esc(sName)} · CLASS: PRIMARY ${es.grade} (BASIC ${es.grade}) ${es.paperType ? `· TYPE ${es.paperType}` : ""}
            </div>

            <table class="ng-exam-details-table">
              <tr>
                <td style="width:65%;"><strong>CANDIDATE'S NAME:</strong> ____________________________________________________</td>
                <td style="width:35%;"><strong>CLASS / ARM:</strong> __________________</td>
              </tr>
              <tr>
                <td><strong>EXAM NUMBER:</strong> ________________________</td>
                <td><strong>TIME ALLOWED:</strong> ${esc(es.timeAllowed)}</td>
              </tr>
            </table>

            <div class="ng-instructions-box">
              <strong>INSTRUCTIONS TO CANDIDATES:</strong> ${esc(es.instructions)}
            </div>
          </header>

          <!-- SECTION A BANNER -->
          <div class="ng-section-banner">
            SECTION A: OBJECTIVE QUESTIONS (${es.questions.length} MARKS)
          </div>

          <!-- SECTION A QUESTIONS -->
          <main class="${es.layout === "2col" ? "exam-2col-layout" : ""}">
            ${es.questions.map(function (q, i) {
              return `
                <article class="ng-q-item">
                  <div class="ng-q-stem">${i + 1}. ${esc(q.q)}</div>
                  <div class="ng-opts-grid">
                    ${q.options.map(function (opt, oi) {
                      return `<div><strong>(${LETTERS[oi].toLowerCase()})</strong> ${esc(opt)}</div>`;
                    }).join("")}
                  </div>
                  <div class="no-print" style="margin-top:4px;display:flex;gap:6px;">
                    <button class="chip" data-action="swap-q" data-idx="${i}" style="cursor:pointer;font-size:0.75rem;">🔄 Swap</button>
                    <button class="chip" data-action="edit-q-modal" data-idx="${i}" style="cursor:pointer;font-size:0.75rem;">✏️ Edit</button>
                    <button class="chip" data-action="delete-q" data-idx="${i}" style="cursor:pointer;font-size:0.75rem;color:#b91c1c;">🗑️</button>
                  </div>
                </article>`;
            }).join("")}
          </main>

          <!-- SECTION B: THEORY / ESSAY QUESTIONS -->
          ${es.includeSecB && es.theoryQuestions && es.theoryQuestions.length ? `
            <div class="ng-section-banner" style="margin-top:32px;">
              SECTION B: THEORY &amp; ESSAY QUESTIONS (ANSWER ANY THREE · 20 MARKS)
            </div>
            <section style="margin-top:16px;">
              ${es.theoryQuestions.map(function (t, ti) {
                return `
                  <div class="ng-theory-item">
                    <div style="font-weight:700;white-space:pre-line;">${esc(t.q)}</div>
                  </div>`;
              }).join("")}
            </section>
          ` : ""}
        </div>

        ${state.editModalOpen ? renderEditQuestionModal() : ""}
      </div>`;
  }

  /* ==========================================================================
     INTERACTIVE QUESTION EDITOR & ADD CUSTOM QUESTION MODAL
     ========================================================================== */

  function renderEditQuestionModal() {
    const d = state.editQData;
    const isNew = state.editingQIndex === null;

    return `
      <div class="edit-modal no-print">
        <div class="edit-card">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid var(--line);padding-bottom:10px;margin-bottom:12px;">
            <h3>${isNew ? "➕ Add Custom School Question" : `✏️ Edit Question ${state.editingQIndex + 1}`}</h3>
            <button class="btn btn-ghost btn-sm" data-action="close-edit-modal">✕ Close</button>
          </div>

          <label>Question Stem / Problem Text:</label>
          <textarea id="edit-q-text" class="edit-textarea" placeholder="Type question text here...">${esc(d.q)}</textarea>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
            <div>
              <label>Option A:</label>
              <input type="text" id="edit-opt-0" class="edit-input" value="${esc(d.options[0])}">
            </div>
            <div>
              <label>Option B:</label>
              <input type="text" id="edit-opt-1" class="edit-input" value="${esc(d.options[1])}">
            </div>
            <div>
              <label>Option C:</label>
              <input type="text" id="edit-opt-2" class="edit-input" value="${esc(d.options[2])}">
            </div>
            <div>
              <label>Option D:</label>
              <input type="text" id="edit-opt-3" class="edit-input" value="${esc(d.options[3])}">
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
            <div>
              <label>Correct Answer Option:</label>
              <select id="edit-ans-idx" class="edit-input">
                <option value="0" ${d.answer === 0 ? "selected" : ""}>Option A</option>
                <option value="1" ${d.answer === 1 ? "selected" : ""}>Option B</option>
                <option value="2" ${d.answer === 2 ? "selected" : ""}>Option C</option>
                <option value="3" ${d.answer === 3 ? "selected" : ""}>Option D</option>
              </select>
            </div>
            <div>
              <label>Bloom's Taxonomy Domain:</label>
              <select id="edit-bloom" class="edit-input">
                <option value="Remember" ${d.bloom === "Remember" ? "selected" : ""}>Remember (Recall/Knowledge)</option>
                <option value="Understand" ${d.bloom === "Understand" ? "selected" : ""}>Understand (Comprehension)</option>
                <option value="Apply" ${d.bloom === "Apply" ? "selected" : ""}>Apply (Problem Solving)</option>
                <option value="Analyze" ${d.bloom === "Analyze" ? "selected" : ""}>Analyze (Critical Analysis)</option>
              </select>
            </div>
          </div>

          <label>Curriculum Subtopic:</label>
          <input type="text" id="edit-topic" class="edit-input" value="${esc(d.topic || "Core Curriculum")}">

          <label>Explanation &amp; Working Steps (for Teacher Marking Key):</label>
          <textarea id="edit-explain" class="edit-textarea" placeholder="Step-by-step solution...">${esc(d.explain || "")}</textarea>

          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
            <button class="btn btn-ghost btn-sm" data-action="close-edit-modal">Cancel</button>
            <button class="btn btn-primary btn-sm" data-action="save-edit-q-data">Save to Exam Paper →</button>
          </div>
        </div>
      </div>`;
  }

  /* ==========================================================================
     OFFICIAL OMR BUBBLE SHADING SHEET (NCEE / NECO / SUBEB STANDARD)
     ========================================================================== */

  function renderOMRSheet() {
    const es = state.examSetter;
    const count = es.questions.length || 40;
    const colSize = 10;
    const numCols = Math.ceil(count / colSize);

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="btn btn-ghost btn-sm" data-go="exam_preview">← Back to Exam Paper</button>
          <button class="btn btn-primary" data-action="print-page">🖨️ Print OMR Shading Sheets</button>
        </div>

        <div class="omr-sheet-paper">
          <header class="omr-header">
            <h2 style="font-size:1.5rem;text-transform:uppercase;">${esc(es.schoolName)}</h2>
            <h3 style="font-size:1.15rem;color:#333;">OFFICIAL CANDIDATE OMR SHADING / ANSWER SHEET</h3>
            <p style="font-size:0.85rem;color:#555;">National Common Entrance &amp; Terminal Assessment Standard</p>
          </header>

          <div class="omr-candidate-grid">
            <div><strong>CANDIDATE NAME:</strong> _______________________________</div>
            <div><strong>EXAM NO:</strong> __________________</div>
            <div><strong>CLASS:</strong> Primary ${es.grade}</div>
            <div><strong>SUBJECT:</strong> ${esc(es.subject.toUpperCase())}</div>
            <div><strong>DATE:</strong> ________________________</div>
            <div><strong>PAPER TYPE:</strong> [ A ] [ B ] [ C ]</div>
          </div>

          <div style="font-size:0.85rem;margin-bottom:14px;border-left:4px solid #000;padding-left:10px;">
            <strong>SHADING INSTRUCTIONS:</strong> Use HB pencil only. Shade completely inside the circle like this: <span class="omr-bubble" style="background:#000;color:#fff;">●</span>. Do not tick <span style="text-decoration:line-through;">✓</span> or cross <span style="text-decoration:line-through;">✕</span>. Erase completely to change an answer.
          </div>

          <div class="omr-columns" style="grid-template-columns: repeat(${numCols}, 1fr);">
            ${Array.from({ length: numCols }).map(function (_, colIdx) {
              const start = colIdx * colSize;
              const end = Math.min(start + colSize, count);
              let rowsHtml = "";
              for (let i = start; i < end; i++) {
                rowsHtml += `
                  <div class="omr-row">
                    <span style="width:24px;">${i + 1}.</span>
                    <div style="display:flex;gap:6px;">
                      <span class="omr-bubble">A</span>
                      <span class="omr-bubble">B</span>
                      <span class="omr-bubble">C</span>
                      <span class="omr-bubble">D</span>
                    </div>
                  </div>`;
              }
              return `<div class="omr-col-block">${rowsHtml}</div>`;
            }).join("")}
          </div>

          <div style="display:flex;justify-content:space-between;margin-top:36px;border-top:1px solid #000;padding-top:12px;font-size:0.85rem;">
            <div><strong>INVIGILATOR'S SIGNATURE:</strong> ___________________________</div>
            <div><strong>TOTAL SCORE:</strong> ________ / ${count}</div>
          </div>
        </div>
      </div>`;
  }

  /* ==========================================================================
     CONFIDENTIAL TEACHER MARKING SCHEME & TABLE OF SPECIFICATIONS (TOS)
     ========================================================================== */

  function renderMarkingScheme() {
    const es = state.examSetter;
    const totalQ = es.questions.length || 1;

    let recallCnt = 0, underCnt = 0, applyCnt = 0, analCnt = 0;
    const topicMap = {};

    es.questions.forEach(q => {
      const b = (q.bloom || "Understand").toLowerCase();
      if (b.indexOf("rem") >= 0 || b.indexOf("rec") >= 0) recallCnt += 1;
      else if (b.indexOf("app") >= 0) applyCnt += 1;
      else if (b.indexOf("ana") >= 0) analCnt += 1;
      else underCnt += 1;

      const t = q.topic || "Core Foundations";
      topicMap[t] = (topicMap[t] || 0) + 1;
    });

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="btn btn-ghost btn-sm" data-go="exam_preview">← Back to Exam Paper</button>
          <button class="btn btn-primary" data-action="print-page">🖨️ Print Marking Scheme &amp; TOS</button>
        </div>

        <div class="worksheet-paper">
          <header style="text-align:center;border-bottom:3px double #000;padding-bottom:14px;margin-bottom:20px;">
            <div class="kicker" style="color:#000;font-size:0.9rem;">CONFIDENTIAL · FOR TEACHERS &amp; EXAMINERS ONLY</div>
            <h2 style="font-size:1.6rem;text-transform:uppercase;">${esc(es.schoolName)}</h2>
            <h3 style="font-size:1.25rem;">TEACHER MARKING GUIDE &amp; TABLE OF SPECIFICATIONS</h3>
            <p><strong>Primary ${es.grade} ${esc(es.subject.toUpperCase())} · ${esc(es.session)} Academic Session</strong></p>
          </header>

          <h3 style="margin-bottom:8px;">📊 TABLE OF SPECIFICATIONS (TEST BLUEPRINT &amp; COGNITIVE GRID)</h3>
          <p style="font-size:0.85rem;color:#444;margin-bottom:10px;">Curriculum topic coverage vs. Bloom's Taxonomy cognitive domain distribution.</p>

          <div class="table-scroll" style="margin-bottom:24px;">
            <table class="report-table" style="border:1px solid #000;font-size:0.88rem;text-align:center;">
              <thead>
                <tr style="background:#f1f5f9;border-bottom:2px solid #000;">
                  <th style="text-align:left;">Curriculum Domain</th>
                  <th>Recall (LOTS)</th>
                  <th>Understanding</th>
                  <th>Application (HOTS)</th>
                  <th>Analysis</th>
                  <th>Total Questions</th>
                  <th>Weighting (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align:left;"><strong>Overall Exam Distribution</strong></td>
                  <td>${recallCnt} (${Math.round((recallCnt / totalQ) * 100)}%)</td>
                  <td>${underCnt} (${Math.round((underCnt / totalQ) * 100)}%)</td>
                  <td>${applyCnt} (${Math.round((applyCnt / totalQ) * 100)}%)</td>
                  <td>${analCnt} (${Math.round((analCnt / totalQ) * 100)}%)</td>
                  <td><strong>${totalQ}</strong></td>
                  <td><strong>100%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style="margin-bottom:10px;">SECTION A: OBJECTIVE ANSWER KEY &amp; PEDAGOGICAL SOLUTIONS</h3>
          <div class="table-scroll">
            <table class="report-table" style="border:1px solid #000;font-size:0.88rem;">
              <thead>
                <tr style="border-bottom:2px solid #000;">
                  <th style="width:40px;">Q#</th>
                  <th style="width:55px;">Key</th>
                  <th>Correct Answer</th>
                  <th>Subtopic &amp; Bloom's Domain</th>
                  <th>Step-by-Step Explanation &amp; Working</th>
                </tr>
              </thead>
              <tbody>
                ${es.questions.map(function (q, i) {
                  return `
                    <tr style="border-bottom:1px solid #ddd;">
                      <td><strong>${i + 1}</strong></td>
                      <td><strong style="color:var(--teal);">${LETTERS[q.answer]}</strong></td>
                      <td>${esc(q.options[q.answer])}</td>
                      <td>${esc(q.topic || "Core")} · <em>${esc(q.bloom || "Understand")}</em></td>
                      <td>${esc(q.explain)}</td>
                    </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>

          ${es.includeSecB && es.theoryQuestions && es.theoryQuestions.length ? `
            <h3 style="margin:28px 0 10px;">SECTION B: THEORY MARKING SCHEME &amp; STEP MARKS ALLOCATION</h3>
            <div class="table-scroll">
              <table class="report-table" style="border:1px solid #000;font-size:0.88rem;">
                <thead>
                  <tr style="border-bottom:2px solid #000;">
                    <th style="width:45px;">Item</th>
                    <th>Model Solution &amp; Step-by-Step Marking Breakdown</th>
                  </tr>
                </thead>
                <tbody>
                  ${es.theoryQuestions.map(function (t, ti) {
                    return `
                      <tr style="border-bottom:1px solid #ddd;">
                        <td><strong>Q${ti + 1}</strong></td>
                        <td style="white-space:pre-line;">${esc(t.answer)}</td>
                      </tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          ` : ""}
        </div>
      </div>`;
  }

  /* ==========================================================================
     INDIVIDUAL PUPIL TERMLY CONTINUOUS ASSESSMENT REPORT SHEET
     ========================================================================== */

  function renderPupilReportCard() {
    const es = state.examSetter;
    const roster = state.classRoster || [];
    const p = roster.find(x => x.id === state.selectedPupilId) || roster[0] || { name: "Chinedu Okafor", arm: "5 Gold", ca1: 18, ca2: 17, exam: 52 };

    const ca1 = p.ca1 || 18;
    const ca2 = p.ca2 || 17;
    const exam = p.exam || 52;
    const total = ca1 + ca2 + exam;
    const ng = getNigerianGrade(total);

    const subjectsList = [
      { name: "English Studies", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Mathematics", ca1: Math.min(20, ca1 + 1), ca2: Math.min(20, ca2 - 1), exam: Math.min(60, exam + 2) },
      { name: "Basic Science", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Social Studies", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Civic Education", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Computer Studies (ICT)", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Agricultural Science", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Cultural & Creative Arts (CCA)", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Physical & Health Education", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Home Economics", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Verbal Reasoning", ca1: ca1, ca2: ca2, exam: exam },
      { name: "Quantitative Reasoning", ca1: ca1, ca2: ca2, exam: exam }
    ];

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="btn btn-ghost btn-sm" data-go="broadsheet">← Back to Master Broadsheet</button>
          <button class="btn btn-primary" data-action="print-page">🖨️ Print Pupil Terminal Report Card</button>
        </div>

        <div class="report-card-paper">
          <header style="text-align:center;border-bottom:3px double #000;padding-bottom:12px;margin-bottom:16px;">
            <h1 style="font-size:1.7rem;text-transform:uppercase;">${esc(es.schoolName)}</h1>
            <p style="font-style:italic;font-size:0.95rem;">${esc(es.schoolAddress)}</p>
            <p style="font-weight:bold;font-size:0.85rem;">${esc(es.schoolMotto)}</p>
            <h2 style="font-size:1.25rem;border-top:1px solid #000;border-bottom:1px solid #000;padding:4px 0;margin-top:8px;">
              CONTINUOUS ASSESSMENT TERMINAL REPORT SHEET — ${esc(es.session)} SESSION
            </h2>
          </header>

          <div class="pupil-info-grid">
            <div><strong>PUPIL'S FULL NAME:</strong> ${esc(p.name)}</div>
            <div><strong>CLASS / ARM:</strong> ${esc(p.arm || "Primary 5 Gold")}</div>
            <div><strong>GENDER:</strong> M / F</div>
            <div><strong>TIMES SCHOOL OPENED:</strong> 120</div>
            <div><strong>TIMES PRESENT:</strong> 118</div>
            <div><strong>TERM:</strong> 2nd Term</div>
          </div>

          <h3 style="font-size:1.05rem;margin-bottom:6px;">ACADEMIC PERFORMANCE BY SUBJECT (COGNITIVE DOMAIN)</h3>
          <div class="table-scroll">
            <table class="report-table" style="border:1px solid #000;font-size:0.86rem;">
              <thead>
                <tr style="background:#f1f5f9;border-bottom:2px solid #000;">
                  <th style="text-align:left;">Subjects</th>
                  <th style="width:65px;">1st CA (20)</th>
                  <th style="width:65px;">2nd CA (20)</th>
                  <th style="width:65px;">Exam (60)</th>
                  <th style="width:75px;">Total (100)</th>
                  <th style="width:55px;">Grade</th>
                  <th>Teacher's Subject Remark</th>
                </tr>
              </thead>
              <tbody>
                ${subjectsList.map(function (s) {
                  const sTot = s.ca1 + s.ca2 + s.exam;
                  const sG = getNigerianGrade(sTot);
                  return `
                    <tr style="border-bottom:1px solid #ddd;">
                      <td style="text-align:left;"><strong>${esc(s.name)}</strong></td>
                      <td>${s.ca1}</td>
                      <td>${s.ca2}</td>
                      <td>${s.exam}</td>
                      <td><strong>${sTot}</strong></td>
                      <td><span class="grade-badge-${sG.grade.toLowerCase()}">${sG.grade}</span></td>
                      <td style="font-size:0.8rem;">${esc(sG.remark)}</td>
                    </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>

          <div class="behavior-rating-grid">
            <div style="border:1px solid #000;padding:10px;">
              <strong>AFFECTIVE DOMAIN (BEHAVIOR)</strong>
              <div style="margin-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                <div>Punctuality: 5/5</div>
                <div>Neatness: 5/5</div>
                <div>Politeness: 4/5</div>
                <div>Honesty: 5/5</div>
                <div>Relationship with Peers: 5/5</div>
              </div>
            </div>
            <div style="border:1px solid #000;padding:10px;">
              <strong>PSYCHOMOTOR SKILLS (PRACTICAL)</strong>
              <div style="margin-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                <div>Handwriting: 4/5</div>
                <div>Sports &amp; Athletics: 4/5</div>
                <div>Verbal Fluency: 5/5</div>
                <div>Drawing &amp; Crafts: 4/5</div>
                <div>Musical Rhythm: 4/5</div>
              </div>
            </div>
          </div>

          <div style="border:1px solid #000;padding:10px;margin-top:10px;font-size:0.9rem;">
            <div><strong>FORM TEACHER'S GENERAL REMARK:</strong> ${esc(ng.remark)} An attentive and hardworking scholar.</div>
            <div style="margin-top:6px;"><strong>HEADTEACHER'S ENDORSEMENT:</strong> A very commendable result. Keep up the high standard!</div>
            <div style="margin-top:8px;display:flex;justify-content:space-between;border-top:1px dashed #000;padding-top:6px;">
              <span><strong>NEXT TERM RESUMPTION DATE:</strong> 4th May, 2026</span>
              <span><strong>HEADTEACHER'S SIGNATURE &amp; STAMP:</strong> _____________________</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ==========================================================================
     NIGERIAN CBT EXAM HALL VIEW
     ========================================================================== */

  function renderCBTHall() {
    const cbt = state.cbt;
    const total = cbt.questions.length;

    if (cbt.submitted) {
      return `
        <div class="wrap">
          <div class="result">
            <div class="letter-mark">${cbt.gradeLetter}</div>
            <div class="kicker">CBT Examination Completed</div>
            <h2 class="section-title">${esc(cbt.candidateName || "Candidate")} — Result Slip</h2>
            <p class="sub">${esc(cbt.remark)}</p>

            <div class="metric-grid">
              <div><b>${cbt.score} / ${cbt.total}</b><span>Raw Score</span></div>
              <div><b>${cbt.percentage}%</b><span>Percentage</span></div>
              <div><b>Grade ${cbt.gradeLetter}</b><span>Nigerian Grade</span></div>
              <div><b>${Math.round((cbt.percentage / 100) * 60)} / 60</b><span>Terminal Exam Mark</span></div>
            </div>

            <div class="top-actions" style="justify-content:center;gap:12px;margin-top:24px;">
              <button class="btn btn-primary" data-go="broadsheet">📊 View Class Master Broadsheet</button>
              <button class="btn btn-ghost" data-go="exam_preview">← Back to Exam Paper</button>
            </div>
          </div>
        </div>`;
    }

    const q = cbt.questions[cbt.index];
    if (!q) return `<div class="wrap"><p>No question loaded.</p></div>`;

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <div>
            <strong>Candidate: ${esc(cbt.candidateName || "Student")}</strong> · ${esc(cbt.candidateArm || "Primary 5")}
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="chip on" style="font-size:1.1rem;background:#fee2e2;color:#991b1b;border-color:#f87171;">
              ⏱ Time Left: <strong id="cbt-timer-disp">${fmtCbtTime(cbt.timeLeft)}</strong>
            </span>
          </div>
        </div>

        <div class="cbt-hall-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <span class="badge-tag">${esc(q.topic || "General")}</span>
            <span style="font-weight:800;color:var(--muted);">Question ${cbt.index + 1} of ${total}</span>
          </div>

          <h2 class="question" style="font-size:1.5rem;margin-bottom:20px;">${cbt.index + 1}. ${esc(q.q)}</h2>

          <div class="options">
            ${q.options.map(function (opt, oi) {
              const isSelected = cbt.answers[cbt.index] === oi;
              return `
                <button class="opt ${isSelected ? "correct" : ""}" data-action="cbt-pick-opt" data-opt="${oi}">
                  <span class="badge">${LETTERS[oi]}</span>
                  <span>${esc(opt)}</span>
                </button>`;
            }).join("")}
          </div>

          <div class="cbt-nav-palette">
            ${cbt.questions.map(function (_, pi) {
              let cls = "cbt-palette-btn";
              if (pi === cbt.index) cls += " current";
              if (cbt.answers[pi] != null) cls += " answered";
              if (cbt.flagged[pi]) cls += " flagged";
              return `<button class="${cls}" data-action="cbt-jump" data-idx="${pi}">${pi + 1}</button>`;
            }).join("")}
          </div>

          <div class="quiz-actions" style="margin-top:24px;">
            <button class="btn btn-ghost" data-action="cbt-prev" ${cbt.index === 0 ? "disabled" : ""}>← Previous</button>
            <button class="btn btn-ghost" data-action="cbt-flag">${cbt.flagged[cbt.index] ? "🚩 Unflag" : "🏳️ Flag for Review"}</button>
            ${cbt.index < total - 1
              ? `<button class="btn btn-primary" data-action="cbt-next">Next Question →</button>`
              : `<button class="btn btn-sun" data-action="cbt-submit-confirm">Submit Exam Paper 📤</button>`}
          </div>
        </div>
      </div>`;
  }

  /* ==========================================================================
     CLASS CONTINUOUS ASSESSMENT (C.A.) MASTER SCORE SHEET & BROADSHEET
     ========================================================================== */

  function renderBroadsheet() {
    const roster = state.classRoster || [];
    const es = state.examSetter;

    const computedList = roster.map(function (p) {
      const ca1 = p.ca1 || 0;
      const ca2 = p.ca2 || 0;
      const exam = p.exam || 0;
      const total = ca1 + ca2 + exam;
      const ng = getNigerianGrade(total);
      return Object.assign({}, p, { total, gradeLetter: ng.grade, remark: ng.remark });
    }).sort((a, b) => b.total - a.total);

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="exam_setter">←</button>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-sun btn-sm" data-action="add-roster-pupil">+ Add Pupil Record</button>
            <button class="btn btn-ghost btn-sm" data-action="export-class-csv">📊 Export CSV</button>
            <button class="btn btn-primary btn-sm" data-action="print-page">🖨️ Print Master Broadsheet</button>
          </div>
        </div>

        <div class="worksheet-paper">
          <header style="text-align:center;border-bottom:3px double #000;padding-bottom:14px;margin-bottom:20px;">
            <h2 style="font-size:1.6rem;text-transform:uppercase;">${esc(es.schoolName)}</h2>
            <h3 style="font-size:1.25rem;">CONTINUOUS ASSESSMENT MASTER SCORE SHEET (BROADSHEET)</h3>
            <p><strong>Primary ${es.grade} · ${esc(es.subject.toUpperCase())} · ${esc(es.session)} Academic Session</strong></p>
          </header>

          <div class="table-scroll">
            <table class="report-table" style="border:1px solid #000;font-size:0.9rem;">
              <thead>
                <tr style="border-bottom:2px solid #000;background:#f1f5f9;">
                  <th style="width:40px;">Pos</th>
                  <th>Candidate Name</th>
                  <th>Class / Arm</th>
                  <th style="width:75px;">1st C.A. (20)</th>
                  <th style="width:75px;">2nd C.A. (20)</th>
                  <th style="width:75px;">Exam (60)</th>
                  <th style="width:85px;">Total (100)</th>
                  <th style="width:65px;">Grade</th>
                  <th>Teacher's Remark</th>
                  <th class="no-print">Action</th>
                </tr>
              </thead>
              <tbody>
                ${computedList.map(function (p, idx) {
                  return `
                    <tr style="border-bottom:1px solid #ddd;">
                      <td><strong>${idx + 1}</strong></td>
                      <td><strong>${esc(p.name)}</strong></td>
                      <td>${esc(p.arm || "P5")}</td>
                      <td>${p.ca1}</td>
                      <td>${p.ca2}</td>
                      <td>${p.exam}</td>
                      <td><strong style="color:var(--teal);">${p.total}</strong></td>
                      <td><span class="grade-badge-${p.gradeLetter.toLowerCase()}">${p.gradeLetter}</span></td>
                      <td style="font-size:0.82rem;">${esc(p.remark)}</td>
                      <td class="no-print">
                        <button class="btn btn-ghost btn-sm" data-action="view-pupil-report" data-pid="${p.id}">Report Card 📜</button>
                      </td>
                    </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>

          <div style="display:flex;justify-content:space-around;margin-top:40px;border-top:1px solid #000;padding-top:16px;">
            <div>
              <p>______________________________________</p>
              <strong style="font-size:0.85rem;">FORM TEACHER'S SIGNATURE &amp; DATE</strong>
            </div>
            <div>
              <p>______________________________________</p>
              <strong style="font-size:0.85rem;">HEADTEACHER / PRINCIPAL'S STAMP</strong>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ==========================================================================
     SAVED EXAM PAPERS ARCHIVE & LIBRARY
     ========================================================================== */

  function renderExamLibrary() {
    const list = state.examSetter.savedPapers || [];
    return `
      <div class="wrap">
        ${renderTopBar("exam_setter")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Exam Setter", go: "exam_setter" }, { label: "My Exam Papers Library" }])}
        <h2 class="section-title">📂 Saved Examination Papers Library</h2>
        <p class="sub">Reopen, re-print, or export previous examination papers created for your school.</p>

        ${list.length ? `
          <div class="grid-grades" style="margin-top:20px;">
            ${list.map(function (paper, idx) {
              return `
                <div class="card-btn">
                  <h4>📄 ${esc(paper.title)}</h4>
                  <p style="font-size:0.85rem;color:var(--muted);margin:6px 0 14px;">Saved on ${paper.savedAt} · ${paper.config.questions ? paper.config.questions.length : 40} Questions</p>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn btn-primary btn-sm" data-action="load-saved-paper" data-idx="${idx}">Open &amp; Print →</button>
                    <button class="btn btn-coral btn-sm" data-action="delete-saved-paper" data-idx="${idx}">Delete</button>
                  </div>
                </div>`;
            }).join("")}
          </div>
        ` : `
          <div class="q-card" style="text-align:center;padding:40px;">
            <h3>📭 No Saved Exam Papers Yet</h3>
            <p class="sub">Generate an exam paper in the Exam Setter and click "Save Paper" to build your school archive.</p>
            <button class="btn btn-primary" data-go="exam_setter">Go to Exam Setter →</button>
          </div>
        `}
      </div>`;
  }

  /* ==========================================================================
     GLOBAL CURRICULUM STANDARDS MATRIX EXPLORER
     ========================================================================== */

  function renderCurriculum() {
    const tab = state.curriculumTab || "nerdc";

    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Global Curriculum Matrix" }])}
        <div class="kicker">International Educational Standards &amp; Equivalence</div>
        <h2 class="section-title">Global Curriculum &amp; Standards Matrix</h2>
        <p class="sub">Explore how Primary Super Quiz aligns with international education ministries, testing boards, and primary frameworks worldwide.</p>

        <div class="chip-group" style="margin-bottom:24px;">
          <button class="chip ${tab === "nerdc" ? "on" : ""}" data-set-cur-tab="nerdc">🇳🇬 Nigeria (NERDC / SUBEB / NCEE)</button>
          <button class="chip ${tab === "cambridge" ? "on" : ""}" data-set-cur-tab="cambridge">🇬🇧 Cambridge Primary (Stages 1–6)</button>
          <button class="chip ${tab === "uk" ? "on" : ""}" data-set-cur-tab="uk">🇬🇧 UK National Curriculum (KS1 &amp; KS2)</button>
          <button class="chip ${tab === "us" ? "on" : ""}" data-set-cur-tab="us">🇺🇸 US Common Core &amp; NGSS (Grades 1–6)</button>
          <button class="chip ${tab === "ib" ? "on" : ""}" data-set-cur-tab="ib">🌐 IB Primary Years Programme (PYP)</button>
        </div>

        <div class="q-card" style="margin-bottom:28px;">
          ${tab === "nerdc" ? `
            <h3>🇳🇬 Nigerian Universal Basic Education (NERDC) Framework</h3>
            <p style="margin-top:6px;line-height:1.6;">Aligned with the 9-Year Basic Education Curriculum established by the Nigerian Educational Research and Development Council (NERDC). Covers Core Foundation (English, Maths, Basic Science &amp; Tech), National Values (Social Studies, Civic, Security), Pre-Vocational Studies (Agric, Home Econ), and Religions &amp; Creative Arts for Primary 1–6 and National Common Entrance Examination (NCEE).</p>
          ` : tab === "cambridge" ? `
            <h3>🇬🇧 Cambridge Assessment International Primary Framework</h3>
            <p style="margin-top:6px;line-height:1.6;">Aligned with Cambridge Primary Stages 1 through 6 in English as a First/Second Language, Primary Mathematics, and Primary Science. Prepares learners for the Cambridge Primary Checkpoint assessments with rigorous analytical and problem-solving standards.</p>
          ` : tab === "uk" ? `
            <h3>🇬🇧 UK National Curriculum (Key Stages 1 &amp; 2)</h3>
            <p style="margin-top:6px;line-height:1.6;">Aligned with the UK Department for Education statutory frameworks for Key Stage 1 (Years 1–2) and Key Stage 2 (Years 3–6), including Year 6 SATs and 11+ Grammar / Independent School Common Entrance reasoning examinations.</p>
          ` : tab === "us" ? `
            <h3>🇺🇸 US Common Core State Standards &amp; NGSS</h3>
            <p style="margin-top:6px;line-height:1.6;">Mapped to Common Core State Standards (CCSS.MATH and CCSS.ELA-LITERACY) for Grades 1–6, Next Generation Science Standards (NGSS Elementary Disciplinary Core Ideas), and C3 Framework for Social Studies State Standards.</p>
          ` : `
            <h3>🌐 International Baccalaureate Primary Years Programme (IB PYP)</h3>
            <p style="margin-top:6px;line-height:1.6;">Aligned with the IB PYP transdisciplinary inquiry model across 6 core themes: Who we are, Where we are in place and time, How we express ourselves, How the world works, How we organize ourselves, and Sharing the planet.</p>
          `}
        </div>

        <div class="table-scroll">
          <table class="report-table">
            <thead>
              <tr style="background:#f1f5f9;">
                <th>Learner Age</th>
                <th>Nigeria (NERDC)</th>
                <th>Cambridge Primary</th>
                <th>UK National Curriculum</th>
                <th>US Common Core / NGSS</th>
                <th>Practice Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Ages 6–7</strong></td>
                <td>Primary 1 (Basic 1)</td>
                <td>Stage 1</td>
                <td>Year 2 (KS1)</td>
                <td>Grade 1</td>
                <td><button class="btn btn-primary btn-sm" data-set-grade="1">Practice P1 →</button></td>
              </tr>
              <tr>
                <td><strong>Ages 7–8</strong></td>
                <td>Primary 2 (Basic 2)</td>
                <td>Stage 2</td>
                <td>Year 3 (KS2)</td>
                <td>Grade 2</td>
                <td><button class="btn btn-primary btn-sm" data-set-grade="2">Practice P2 →</button></td>
              </tr>
              <tr>
                <td><strong>Ages 8–9</strong></td>
                <td>Primary 3 (Basic 3)</td>
                <td>Stage 3</td>
                <td>Year 4 (KS2)</td>
                <td>Grade 3</td>
                <td><button class="btn btn-primary btn-sm" data-set-grade="3">Practice P3 →</button></td>
              </tr>
              <tr>
                <td><strong>Ages 9–10</strong></td>
                <td>Primary 4 (Basic 4)</td>
                <td>Stage 4</td>
                <td>Year 5 (KS2)</td>
                <td>Grade 4</td>
                <td><button class="btn btn-primary btn-sm" data-set-grade="4">Practice P4 →</button></td>
              </tr>
              <tr>
                <td><strong>Ages 10–11</strong></td>
                <td>Primary 5 (Basic 5)</td>
                <td>Stage 5</td>
                <td>Year 6 (KS2)</td>
                <td>Grade 5</td>
                <td><button class="btn btn-primary btn-sm" data-set-grade="5">Practice P5 →</button></td>
              </tr>
              <tr>
                <td><strong>Ages 11–12</strong></td>
                <td>Primary 6 (Basic 6 / NCEE)</td>
                <td>Stage 6 Checkpoint</td>
                <td>Year 7 (KS3 Prep / 11+)</td>
                <td>Grade 6</td>
                <td><button class="btn btn-primary btn-sm" data-set-grade="6">Practice P6 →</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* ==========================================================================
     LEARNING SCIENCE & COGNITIVE PSYCHOLOGY WHITE PAPER
     ========================================================================== */

  function renderWhy() {
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Cognitive Learning Sciences White Paper" }])}
        <div class="kicker">Peer-Reviewed Evidence in Primary Pedagogy</div>
        <h2 class="section-title">The Cognitive Science of Retrieval Practice</h2>
        <p class="sub">Why professors of education and learning scientists worldwide advocate for structured retrieval over passive study.</p>

        <div class="home-grid" style="margin-bottom:28px;">
          <div class="card-btn">
            <h3>🧠 1. The Testing Effect &amp; Active Retrieval</h3>
            <p style="color:var(--muted);font-size:0.85rem;margin-bottom:6px;"><em>Roediger &amp; Karpicke (2006); Karpicke &amp; Blunt (2011, Science)</em></p>
            <p>Empirical cognitive psychology shows that the mental act of retrieving a memory trace fundamentally alters that memory, rendering it far more resistant to decay than equal time spent re-reading notes.</p>
          </div>
          <div class="card-btn">
            <h3>⏳ 2. Spaced Retrieval (The Leitner System)</h3>
            <p style="color:var(--muted);font-size:0.85rem;margin-bottom:6px;"><em>Bjork (1994); Cepeda, Vul, Rohrer, Wixted &amp; Pashler (2008)</em></p>
            <p>Our 3-Box Leitner system introduces "desirable difficulties". Reviewing missed facts at spaced intervals forces deeper cognitive re-encoding right before memory decay occurs.</p>
          </div>
          <div class="card-btn">
            <h3>🌈 3. Interleaving Practice (Champion Mix)</h3>
            <p style="color:var(--muted);font-size:0.85rem;margin-bottom:6px;"><em>Rohrer &amp; Taylor (2007); Dunlosky et al. (2013, Psychological Science)</em></p>
            <p>Blocking one topic at a time creates illusions of fluency. Interleaving multiple domains trains children to identify problem types and select the correct strategy dynamically.</p>
          </div>
          <div class="card-btn">
            <h3>🎯 4. Metacognitive Calibration &amp; Monitoring</h3>
            <p style="color:var(--muted);font-size:0.85rem;margin-bottom:6px;"><em>Dunlosky &amp; Metcalfe (2009); Kruger &amp; Dunning (1999)</em></p>
            <p>Rating confidence before selecting an answer uncovers illusions of competence. Our Metacognitive Matrix isolates confident misconceptions from genuine mastery.</p>
          </div>
          <div class="card-btn">
            <h3>🧩 5. Cognitive Load Theory &amp; Worked Solutions</h3>
            <p style="color:var(--muted);font-size:0.85rem;margin-bottom:6px;"><em>Sweller (1988); Paas &amp; van Merriënboer (1994)</em></p>
            <p>Extraneous load is eliminated through a clean, distraction-free interface. Step-by-step explanations provide immediate scaffolding to reduce cognitive anxiety.</p>
          </div>
          <div class="card-btn">
            <h3>🌱 6. Formative Scaffolding &amp; Growth Mindset</h3>
            <p style="color:var(--muted);font-size:0.85rem;margin-bottom:6px;"><em>Black &amp; Wiliam (1998); Dweck (2006); Vygotsky (1978, ZPD)</em></p>
            <p>Instant feedback reframes errors as high-value learning opportunities, reinforcing self-efficacy, persistence, and continuous academic growth.</p>
          </div>
        </div>
      </div>`;
  }

  function renderPrivacy() {
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Privacy Policy" }])}
        <div class="kicker">COPPA &amp; GDPR Compliant · Safe for Classrooms</div>
        <h2 class="section-title">Privacy &amp; Child Safety Policy</h2>
        <p class="sub">How Primary Super Quiz protects children's privacy and delivers safe, ad-free education.</p>

        <div class="q-card" style="margin-bottom:20px;">
          <h3>🔒 100% On-Device Local Storage</h3>
          <p style="margin-top:8px;">All student progress, scores, and exam papers are stored strictly on this device inside browser <code>localStorage</code>.</p>
        </div>
        <div class="q-card">
          <h3>🚫 Zero Advertisements &amp; No Commercial Trackers</h3>
          <p style="margin-top:8px;">Contains zero advertising, zero marketing pixels, and zero third-party tracking scripts.</p>
        </div>
      </div>`;
  }

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
          <h3>👥 Switch Active Profile</h3>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
            ${listProfiles().map(function (p) {
              const isCur = uid() === p.id;
              return `
                <button class="chip ${isCur ? "on" : ""}" data-switch-profile="${p.id}">
                  👤 ${esc(p.name)} (P${p.grade || 5})
                </button>`;
            }).join("")}
          </div>
        </div>

        <h3 style="margin-bottom:16px;">🏆 Academic Milestone Badges (${unlockedBadges.length} / ${allBadges.length} Unlocked)</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px;">
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

  function renderTeachers() {
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Teacher & Classroom Hub" }])}
        <div class="kicker">Educator &amp; School Command Center</div>
        <h2 class="section-title">Teacher Command Center</h2>
        <p class="sub">Set official Nigerian exams, manage class continuous assessment broadsheets, and project live quizzes.</p>

        <div class="home-grid" style="margin-bottom:28px;">
          <div class="card-btn" data-go="exam_setter" style="border-color:var(--teal);background:var(--teal-soft);">
            <h3>🇳🇬 1. Nigerian Exam Setter Suite</h3>
            <p>Set 1st/2nd/3rd term exams, NCEE mocks, 2-column print papers, OMR shading sheets, and marking keys.</p>
          </div>
          <div class="card-btn" data-go="broadsheet">
            <h3>📊 2. Class Master Broadsheet</h3>
            <p>Record 1st C.A., 2nd C.A., and Exam scores. Automatic Nigerian grading (A-F), positions, and remarks.</p>
          </div>
          <div class="card-btn" data-go="projector">
            <h3>📽️ 3. Smartboard Projector Mode</h3>
            <p>High-visibility classroom projection mode for smartboards and live class polling.</p>
          </div>
          <div class="card-btn" data-action="export-class-csv">
            <h3>📥 4. Export Class CSV Gradebook</h3>
            <p>Download complete student performance metrics and study hours for school records.</p>
          </div>
        </div>
      </div>`;
  }

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
    }).join("") ;

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="btn btn-ghost btn-sm" data-go="teachers">← Exit Projector View</button>
          <span>Question ${(state.projectorIndex || 0) + 1} of ${total}</span>
        </div>
        <div class="projector-view">
          <div>
            <div class="kicker">Primary ${state.grade || 5} · ${esc(q.topic || "Topic Inquiry")}</div>
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
     PROFESSOR-GRADE PSYCHOMETRIC DIAGNOSTIC DOSSIER
     ========================================================================== */

  function renderReport() {
    const g = state.grade || 5;
    const r = rankFor(progress.xp);
    const avgScore = accuracyPct();
    const conf = progress.confidenceStats;
    const totalConf = (conf.mastered + conf.misconceptions + conf.lucky + conf.growth) || 1;
    const masteredPct = Math.round((conf.mastered / totalConf) * 100);
    const miscPct = Math.round((conf.misconceptions / totalConf) * 100);

    return `
      <div class="wrap report">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="home">←</button>
          <button class="btn btn-primary" data-action="print-page">🖨️ Print Academic Diagnostic Dossier</button>
        </div>

        <header style="border-bottom:3px solid var(--teal);padding-bottom:16px;margin-bottom:24px;">
          <h2 style="font-family:var(--font-display);font-size:2rem;color:var(--teal);">Primary Super Quiz · Psychometric Diagnostic Portfolio</h2>
          <p style="font-size:1.1rem;color:var(--ink);margin-top:4px;"><strong>Student:</strong> ${esc(state.name || "Pupil")} ${schoolName() ? " · " + esc(schoolName()) : ""} · <strong>Level:</strong> Primary ${g} (Basic ${g})</p>
          <p style="color:var(--muted);font-size:0.88rem;">Academic Rank: ${r.icon} ${r.name} (${progress.xp} Total XP) · Evaluation Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </header>

        <div class="home-stats" style="margin-bottom:24px;">
          <div class="stat-tile"><b>${avgScore}%</b><span>Overall Accuracy</span></div>
          <div class="stat-tile"><b>${progress.quizzes}</b><span>Papers Completed</span></div>
          <div class="stat-tile"><b>${progress.streak} days</b><span>Retrieval Habit</span></div>
          <div class="stat-tile"><b>${fmtDur(progress.studySec || 0)}</b><span>Time on Task</span></div>
        </div>

        <div class="q-card" style="margin-bottom:24px;">
          <h3 style="margin-bottom:8px;">🧠 Metacognitive Calibration Analysis (Kruger-Dunning / Brier Matrix)</h3>
          <p style="font-size:0.9rem;color:var(--muted);margin-bottom:14px;">Evaluates student judgment accuracy and cognitive self-monitoring.</p>
          <div class="calibration-matrix" style="margin:0;">
            <div class="calib-cell mastered">
              <strong>🌟 Mastered Knowledge (${masteredPct}%)</strong>
              <p>High confidence paired with correct response. Demonstrated long-term schema consolidation.</p>
            </div>
            <div class="calib-cell misconception">
              <strong>⚠️ Confident Misconceptions (${miscPct}%)</strong>
              <p>High confidence but incorrect response. Illusions of competence requiring targeted schema unlearning.</p>
            </div>
          </div>
        </div>

        <h3>Curriculum Domain Proficiency Breakdown (Primary ${g})</h3>
        <div class="table-scroll" style="margin-top:12px;">
          <table class="report-table">
            <thead>
              <tr style="background:#f1f5f9;">
                <th>Subject Domain</th>
                <th>Best Score</th>
                <th>Evaluation</th>
                <th>Pedagogical Recommendation</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(window.SUBJECTS).map(function (k) {
                const s = window.SUBJECTS[k];
                const b = progress.best[`${g}/${k}`];
                const pct = b ? b.pct : null;
                const gl = pct != null ? gradeLetter(pct) : { mark: "—", label: "Pending" };
                const act = pct == null ? "Sit diagnostic 10-question paper" : pct >= 80 ? "Advance to higher-order problem solving" : "Consolidate via Leitner Spaced Recall";
                return `
                  <tr>
                    <td>${s.icon} ${s.name}</td>
                    <td>${pct != null ? pct + "%" : "Not yet sat"}</td>
                    <td><strong>Grade ${gl.mark}</strong> (${gl.label})</td>
                    <td style="font-size:0.85rem;">${act}</td>
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
            for demonstrated academic excellence and active retrieval practice across <strong>Primary ${state.grade || 5}</strong> curriculum subjects at <strong>${esc(schoolName())}</strong>.
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

  function renderSettings() {
    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Settings" }])}
        <h2 class="section-title">Settings &amp; Universal Accessibility (UDL)</h2>
        <p class="sub">Personalize your learning environment. All settings are preserved locally on this device.</p>

        <div class="q-card" style="margin-bottom:20px;">
          <h3>🎨 Visual Themes &amp; Contrast</h3>
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
          <h3>📖 Typography &amp; Dyslexia Support</h3>
          <div class="chip-group" style="margin-top:12px;">
            <button class="chip ${settings.font === "nunito" ? "on" : ""}" data-set-font="nunito">Nunito (Friendly Rounded)</button>
            <button class="chip ${settings.font === "lexend" ? "on" : ""}" data-set-font="lexend">Lexend (Dyslexia-Friendly)</button>
            <button class="chip ${settings.font === "sans" ? "on" : ""}" data-set-font="sans">Clean System Sans</button>
            <button class="chip ${settings.font === "serif" ? "on" : ""}" data-set-font="serif">Classic Book Serif</button>
          </div>
        </div>

        <div class="q-card" style="margin-bottom:20px;">
          <h3>🔊 Audio &amp; Speech Synthesis (TTS)</h3>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;">
            <button class="btn ${settings.sound ? "btn-primary" : "btn-ghost"}" data-action="toggle-sound">Sound Effects: ${settings.sound ? "Enabled" : "Disabled"}</button>
            <button class="btn ${settings.tts ? "btn-primary" : "btn-ghost"}" data-action="toggle-tts">Auto Read-Aloud: ${settings.tts ? "Enabled" : "Disabled"}</button>
          </div>
        </div>

        <div class="q-card">
          <h3>💾 Data Management (Backup &amp; Restore)</h3>
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
        <p><strong>Primary Super Quiz</strong> · World-Class Universal Primary 1–6 (Basic 1–6) Educational Platform</p>
        <p style="margin-top:6px;">16 Subjects · 9,600 Unique Questions · Official Nigerian Exam Setter · Free &amp; Offline PWA</p>
        <div style="display:flex;gap:14px;justify-content:center;margin-top:12px;flex-wrap:wrap;">
          <button class="crumbs button" data-go="exam_setter">Set Nigerian Exam</button> ·
          <button class="crumbs button" data-go="broadsheet">Class Broadsheet</button> ·
          <button class="crumbs button" data-go="why">Learning Science</button> ·
          <button class="crumbs button" data-go="curriculum">Curriculum Map</button> ·
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
     MAIN ROUTING RENDERER
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
      case "exam_setter": html = renderExamSetter(); break;
      case "exam_preview": html = renderExamPreview(); break;
      case "omr_sheet": html = renderOMRSheet(); break;
      case "marking_scheme": html = renderMarkingScheme(); break;
      case "pupil_report": html = renderPupilReportCard(); break;
      case "cbt_hall": html = renderCBTHall(); break;
      case "broadsheet": html = renderBroadsheet(); break;
      case "exam_library": html = renderExamLibrary(); break;
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

  /* ==========================================================================
     GLOBAL EVENT LISTENERS & DELEGATION
     ========================================================================== */

  document.addEventListener("click", function (e) {
    const target = e.target.closest("[data-action], [data-go], [data-set-grade], [data-pick-subj], [data-drill-subj], [data-start-topic-quiz], [data-set-group], [data-set-len], [data-set-mode], [data-opt], [data-set-conf], [data-set-stool], [data-set-scolor], [data-rate-card], [data-set-theme], [data-set-font], [data-set-cur-tab], [data-switch-profile], [data-set-rfilter]");
    if (!target) return;

    if (target.dataset.go) {
      state.screen = target.dataset.go;
      render();
      return;
    }

    if (target.dataset.setGrade) {
      state.grade = Number(target.dataset.setGrade);
      state.examSetter.grade = state.grade;
      localStorage.setItem("psq-grade", String(state.grade));
      state.screen = "subject";
      render();
      return;
    }

    if (target.dataset.pickSubj) {
      state.subject = target.dataset.pickSubj;
      state.examSetter.subject = state.subject;
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

    if (target.dataset.setCurTab) {
      state.curriculumTab = target.dataset.setCurTab;
      render();
      return;
    }

    if (target.dataset.opt != null && state.screen === "quiz") {
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
      const g = state.grade || 5;
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
        state.hintText = state.questions[state.index].hint || "Recall core curriculum principles.";
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
        const g = state.grade || 5;
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

      // ==========================================
      // NIGERIAN EXAM SETTER ACTIONS
      // ==========================================
      case "generate-exam-btn":
        const es = state.examSetter;
        const sNameEl = document.getElementById("es-school-name");
        if (sNameEl) {
          es.schoolName = sNameEl.value.trim() || "FEDERAL STAFF PRIMARY SCHOOL";
          localStorage.setItem("psq-school-name", es.schoolName);
        }
        const sMottoEl = document.getElementById("es-school-motto");
        if (sMottoEl) {
          es.schoolMotto = sMottoEl.value.trim() || "Motto: Knowledge & Excellence";
          localStorage.setItem("psq-school-motto", es.schoolMotto);
        }
        const sAddrEl = document.getElementById("es-school-addr");
        if (sAddrEl) {
          es.schoolAddress = sAddrEl.value.trim() || "P.M.B. 1024, Minna, Niger State";
          localStorage.setItem("psq-school-addr", es.schoolAddress);
        }
        const eTypeEl = document.getElementById("es-exam-type");
        if (eTypeEl) es.examType = eTypeEl.value;
        const eSessEl = document.getElementById("es-session");
        if (eSessEl) es.session = eSessEl.value;
        const eGradeEl = document.getElementById("es-grade");
        if (eGradeEl) es.grade = Number(eGradeEl.value);
        const eSubjEl = document.getElementById("es-subject");
        if (eSubjEl) es.subject = eSubjEl.value;
        const eBundleEl = document.getElementById("es-ncee-bundle");
        if (eBundleEl) es.nceeBundle = eBundleEl.value;
        const eCountEl = document.getElementById("es-count");
        if (eCountEl) es.count = Number(eCountEl.value);
        const eTimeEl = document.getElementById("es-time-allowed");
        if (eTimeEl) es.timeAllowed = eTimeEl.value;
        const eLayoutEl = document.getElementById("es-layout");
        if (eLayoutEl) es.layout = eLayoutEl.value;
        const eSecBEl = document.getElementById("es-include-secb");
        if (eSecBEl) es.includeSecB = (eSecBEl.value === "yes");

        generateNigerianExamPaper();
        break;

      case "swap-q":
        const swapIdx = Number(target.dataset.idx);
        swapExamQuestion(swapIdx);
        break;

      case "delete-q":
        const delQIdx = Number(target.dataset.idx);
        if (confirm(`Delete Question ${delQIdx + 1}?`)) {
          state.examSetter.questions.splice(delQIdx, 1);
          render();
          toast("Question removed from paper.");
        }
        break;

      case "edit-q-modal":
        const edIdx = Number(target.dataset.idx);
        state.editingQIndex = edIdx;
        const curEditQ = state.examSetter.questions[edIdx];
        state.editQData = {
          q: curEditQ.q,
          options: curEditQ.options.slice(),
          answer: curEditQ.answer,
          topic: curEditQ.topic || "Core Curriculum",
          bloom: curEditQ.bloom || "Understand",
          explain: curEditQ.explain || ""
        };
        state.editModalOpen = true;
        render();
        break;

      case "open-add-q-modal":
        state.editingQIndex = null;
        state.editQData = {
          q: "",
          options: ["", "", "", ""],
          answer: 0,
          topic: "Core Curriculum",
          bloom: "Understand",
          explain: ""
        };
        state.editModalOpen = true;
        render();
        break;

      case "close-edit-modal":
        state.editModalOpen = false;
        render();
        break;

      case "save-edit-q-data":
        const qTxt = (document.getElementById("edit-q-text").value || "").trim();
        const o0 = (document.getElementById("edit-opt-0").value || "").trim();
        const o1 = (document.getElementById("edit-opt-1").value || "").trim();
        const o2 = (document.getElementById("edit-opt-2").value || "").trim();
        const o3 = (document.getElementById("edit-opt-3").value || "").trim();
        const aIdx = Number(document.getElementById("edit-ans-idx").value);
        const bLm = document.getElementById("edit-bloom").value;
        const tPc = (document.getElementById("edit-topic").value || "Core").trim();
        const exp = (document.getElementById("edit-explain").value || "").trim();

        if (!qTxt || !o0 || !o1 || !o2 || !o3) {
          toast("Please enter the question text and all 4 options.");
          return;
        }

        const savedQObj = {
          q: qTxt,
          options: [o0, o1, o2, o3],
          answer: aIdx,
          topic: tPc,
          bloom: bLm,
          explain: exp || `The correct answer is (${LETTERS[aIdx]}): ${[o0, o1, o2, o3][aIdx]}.`,
          subject: state.examSetter.subject
        };

        if (state.editingQIndex === null) {
          state.examSetter.questions.push(savedQObj);
          toast("Custom question added to paper!");
        } else {
          state.examSetter.questions[state.editingQIndex] = savedQObj;
          toast(`Question ${state.editingQIndex + 1} updated!`);
        }
        state.editModalOpen = false;
        render();
        break;

      case "export-word-doc":
        exportExamAsWordDoc();
        break;

      case "shuffle-type":
        const typeLtr = target.dataset.type || "B";
        shufflePaperType(typeLtr);
        break;

      case "save-exam-paper":
        saveCurrentExamPaper();
        break;

      case "load-saved-paper":
        const pIdx = Number(target.dataset.idx);
        const savedP = state.examSetter.savedPapers[pIdx];
        if (savedP && savedP.config) {
          state.examSetter = Object.assign({}, savedP.config, { savedPapers: state.examSetter.savedPapers });
          state.screen = "exam_preview";
          render();
          toast("Loaded saved paper: " + savedP.title);
        }
        break;

      case "delete-saved-paper":
        const delIdx = Number(target.dataset.idx);
        if (confirm("Are you sure you want to delete this saved paper?")) {
          state.examSetter.savedPapers.splice(delIdx, 1);
          localStorage.setItem("psq-saved-exams-v1", JSON.stringify(state.examSetter.savedPapers));
          toast("Paper deleted from library.");
          render();
        }
        break;

      // ==========================================
      // CBT EXAM ROOM ACTIONS
      // ==========================================
      case "launch-cbt-exam":
        const candName = prompt("Enter Candidate Full Name:", "Chinedu Okafor");
        if (candName !== null) {
          state.cbt.candidateName = candName.trim();
          launchCBTExam();
        }
        break;

      case "cbt-pick-opt":
        const cOpt = Number(target.dataset.opt);
        state.cbt.answers[state.cbt.index] = cOpt;
        render();
        break;

      case "cbt-jump":
        state.cbt.index = Number(target.dataset.idx);
        render();
        break;

      case "cbt-next":
        if (state.cbt.index < state.cbt.questions.length - 1) {
          state.cbt.index += 1;
          render();
        }
        break;

      case "cbt-prev":
        if (state.cbt.index > 0) {
          state.cbt.index -= 1;
          render();
        }
        break;

      case "cbt-flag":
        state.cbt.flagged[state.cbt.index] = !state.cbt.flagged[state.cbt.index];
        render();
        break;

      case "cbt-submit-confirm":
        const unans = state.cbt.answers.filter(a => a == null).length;
        const msg = unans > 0
          ? `You have ${unans} unanswered question(s). Are you sure you want to submit?`
          : "Are you sure you want to submit your CBT exam paper now?";
        if (confirm(msg)) {
          submitCbtExam();
        }
        break;

      case "add-roster-pupil":
        const pName = prompt("Enter Pupil Name:");
        if (pName && pName.trim()) {
          const c1 = Number(prompt("1st C.A. Score (out of 20):", "16") || 16);
          const c2 = Number(prompt("2nd C.A. Score (out of 20):", "15") || 15);
          const ex = Number(prompt("Terminal Exam Score (out of 60):", "48") || 48);
          state.classRoster.push({
            id: "c-" + Date.now(),
            name: pName.trim(),
            grade: state.examSetter.grade,
            arm: "Primary " + state.examSetter.grade + " Gold",
            ca1: Math.min(20, c1),
            ca2: Math.min(20, c2),
            exam: Math.min(60, ex)
          });
          localStorage.setItem("psq-class-roster-v2", JSON.stringify(state.classRoster));
          toast("Pupil record added to broadsheet.");
          render();
        }
        break;

      case "view-pupil-report":
        state.selectedPupilId = target.dataset.pid;
        state.screen = "pupil_report";
        render();
        break;

      case "export-class-csv":
        const computedList = state.classRoster.map(p => {
          const total = (p.ca1 || 0) + (p.ca2 || 0) + (p.exam || 0);
          const ng = getNigerianGrade(total);
          return [p.name, `Primary ${p.grade || 5}`, p.arm || "Arm", p.ca1 || 0, p.ca2 || 0, p.exam || 0, total, ng.grade, ng.remark];
        });
        const rows = [["Candidate Name", "Class", "Arm", "1st CA (20)", "2nd CA (20)", "Exam (60)", "Total (100)", "Grade", "Remark"]].concat(computedList);
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(x => `"${x}"`).join(",")).join("\n");
        const dlA = document.createElement("a");
        dlA.href = encodeURI(csvContent);
        dlA.download = `class-continuous-assessment-broadsheet-${new Date().toISOString().slice(0, 10)}.csv`;
        dlA.click();
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
          list.push({ id: newId, name: sName.trim(), grade: state.grade || 5, created: Date.now() });
          saveProfiles(list);
          toast("Student profile created: " + sName);
          render();
        }
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
        if (state.editModalOpen) {
          state.editModalOpen = false;
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
