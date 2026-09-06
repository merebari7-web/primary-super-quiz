(function () {
  "use strict";

  const app = document.getElementById("app");
  const canvas = document.getElementById("confetti");
  const LETTERS = ["A", "B", "C", "D"];
  const bankCache = {};
  const SK = "psq-settings-v7";

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
    screen: "home", // "home", "grade", "subject", "topics", "length", "quiz", "result", "review", "flashcards", "curriculum", "why", "privacy", "account", "teachers", "exam_setter", "exam_preview", "omr_sheet", "marking_scheme", "pupil_report", "cbt_hall", "broadsheet", "exam_library", "projector", "report", "certificate", "settings", "lab", "duel", "teams", "worksheet_gen", "analytics"
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
    classRoster: loadJSON("psq-class-roster-v3", [
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
    // LEARNING LAB & MANIPULATIVES STATE
    // ==========================================
    lab: {
      tab: "frac",
      shapeFilter: "all",
      elementSearch: "",
      timelineSearch: "", // "frac", "abacus", "times", "sieve", "clock", "unit", "states", "naira", "solar", "body"
      fracNum: 3,
      fracDen: 4,
      abacusTh: 2,
      abacusH: 4,
      abacusT: 5,
      abacusU: 8,
      timesRow: 6,
      timesCol: 7,
      sieveFilter: "all",
      clockHour: 3,
      clockMinute: 30,
      unitCat: "length",
      unitVal: 100,
      unitFrom: "m",
      unitTo: "cm",
      stateZone: "all",
      selectedState: null,
      selectedNote: "₦100",
      selectedPlanet: "Earth",
      selectedBodySys: "Circulatory System"
    },

    // ==========================================
    // 2-PLAYER SPEED DUEL STATE
    // ==========================================
    duel: {
      active: false,
      p1Name: "Player 1 (Blue)",
      p2Name: "Player 2 (Red)",
      p1Score: 0,
      p2Score: 0,
      p1Streak: 0,
      p2Streak: 0,
      questions: [],
      index: 0,
      winner: null,
      p1Choice: null,
      p2Choice: null,
      roundOver: false
    },

    // ==========================================
    // CLASSROOM SMARTBOARD TEAM STATE
    // ==========================================
    teams: {
      teamEmerald: { name: "Team Emerald", score: 0, color: "#10b981" },
      teamSapphire: { name: "Team Sapphire", score: 0, color: "#0284c7" },
      teamRuby: { name: "Team Ruby", score: 0, color: "#e11d48" },
      teamAmber: { name: "Team Amber", score: 0, color: "#f59e0b" },
      timer: 30,
      timerRunning: false,
      currentQ: null
    },

    // ==========================================
    // WORKSHEET GENERATOR STATE
    // ==========================================
    worksheet: {
      grade: 5,
      subject: "maths",
      count: 20,
      includeKey: true,
      includeSpace: true,
      title: "Classroom Practice Worksheet",
      questions: []
    },

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
    // 5E LESSON PLAN STUDIO STATE
    // ==========================================
    lessonPlans: {
      activeTemplate: "maths_p5_percentages",
      customSubject: "maths",
      customGrade: 5,
      customTopic: "Fractions & Decimals",
      customDuration: "45 Minutes"
    },

    // ==========================================
    // PSYCHOMETRIC ITEM ANALYSIS STATE
    // ==========================================
    itemAnalysis: {
      selectedSubject: "maths",
      selectedGrade: 5,
      sampleSize: 120,
      activeItemIndex: 0
    },

    curriculumTab: "nerdc",
    curriculumCrosswalkA: "nerdc",
    curriculumCrosswalkB: "cambridge",
    whyTab: "compendium",

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
  let teamTimerInterval = null;
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

  function progressKey() { return "psq-progress-v7-" + uid(); }

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
  function playBuzzer() { playTone(150, 0.4, "sawtooth", 0.12); }

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
  function stopTeamTimer() { clearInterval(teamTimerInterval); teamTimerInterval = null; }

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
      localStorage.setItem("psq-class-roster-v3", JSON.stringify(state.classRoster));
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
     LEARNING LAB & MANIPULATIVES CANVAS RENDERERS
     ========================================================================== */

  function renderFractionCanvas() {
    const cvs = document.getElementById("frac-canvas");
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const num = Math.min(state.lab.fracNum, state.lab.fracDen);
    const den = state.lab.fracDen;

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Draw Fraction Pie (Left)
    const centerX = 120, centerY = 120, radius = 90;
    const sliceAngle = (2 * Math.PI) / den;

    for (let i = 0; i < den; i++) {
      const start = i * sliceAngle - Math.PI / 2;
      const end = (i + 1) * sliceAngle - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = i < num ? "#0e7c76" : "#f1f5f9";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#0f172a";
      ctx.stroke();
    }

    // Draw Fraction Bar Strip (Right)
    const barX = 260, barY = 70, barW = 280, barH = 100;
    const segmentW = barW / den;

    for (let i = 0; i < den; i++) {
      ctx.beginPath();
      ctx.rect(barX + (i * segmentW), barY, segmentW, barH);
      ctx.fillStyle = i < num ? "#e9a825" : "#f1f5f9";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0f172a";
      ctx.stroke();

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px Nunito, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`1/${den}`, barX + (i * segmentW) + (segmentW / 2), barY + (barH / 2) + 5);
    }
  }

  function renderClockCanvas() {
    const cvs = document.getElementById("clock-canvas");
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const cx = 150, cy = 150, r = 120;
    const h = state.lab.clockHour % 12;
    const m = state.lab.clockMinute;

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Clock Face Dial
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#0e7c76";
    ctx.stroke();

    // Hour Markers & Numbers
    for (let i = 1; i <= 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      const nx = cx + (r - 24) * Math.cos(angle);
      const ny = cy + (r - 24) * Math.sin(angle) + 6;
      ctx.font = "bold 18px Fredoka, Nunito, sans-serif";
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.fillText(String(i), nx, ny);
    }

    // Hour Hand (Short & Thick)
    const hourAngle = ((h + m / 60) * Math.PI) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (r - 55) * Math.cos(hourAngle), cy + (r - 55) * Math.sin(hourAngle));
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#e07a5f";
    ctx.stroke();

    // Minute Hand (Long & Lean)
    const minAngle = (m * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (r - 28) * Math.cos(minAngle), cy + (r - 28) * Math.sin(minAngle));
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0e7c76";
    ctx.stroke();

    // Center Pin
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, 2 * Math.PI);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
  }

  function renderRadarCanvas() {
    const cvs = document.getElementById("radar-canvas");
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const cx = 180, cy = 180, r = 130;
    const labels = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];
    const values = [0.85, 0.90, 0.75, 0.70, 0.65, 0.80]; // Normalized Mastery [0.0 - 1.0]

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Concentric Web Rings
    for (let ring = 1; ring <= 4; ring++) {
      const ringR = (r / 4) * ring;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 2;
        const x = cx + ringR * Math.cos(a);
        const y = cy + ringR * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Axes & Labels
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      ctx.strokeStyle = "#cbd5e1";
      ctx.stroke();

      const lx = cx + (r + 28) * Math.cos(a);
      const ly = cy + (r + 28) * Math.sin(a) + 4;
      ctx.font = "bold 12px Nunito, sans-serif";
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.fillText(labels[i], lx, ly);
    }

    // Data Polygon Fill
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 2;
      const dataR = r * values[i];
      const x = cx + dataR * Math.cos(a);
      const y = cy + dataR * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(14, 124, 118, 0.35)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0e7c76";
    ctx.stroke();
  }

  /* ==========================================================================
     LEARNING LAB & MANIPULATIVES VIEW
     ========================================================================== */

  function renderLab() {
    const tab = state.lab.tab || "frac";

    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Interactive Learning Lab & Manipulatives" }])}
        <div class="kicker">Primary STEM &amp; Humanities Manipulatives</div>
        <h2 class="section-title">Interactive Learning Lab</h2>
        <p class="sub">Hands-on visual tools to develop conceptual understanding across Mathematics, Science, and Social Studies.</p>

        <div class="chip-group" style="margin-bottom:20px;">
          <button class="chip ${tab === "frac" ? "on" : ""}" data-set-lab-tab="frac">🍰 Fraction Visualizer</button>
          <button class="chip ${tab === "abacus" ? "on" : ""}" data-set-lab-tab="abacus">🧮 Place Value Abacus</button>
          <button class="chip ${tab === "times" ? "on" : ""}" data-set-lab-tab="times">✖️ Times Table Matrix</button>
          <button class="chip ${tab === "sieve" ? "on" : ""}" data-set-lab-tab="sieve">🔢 Prime Sieve</button>
          <button class="chip ${tab === "clock" ? "on" : ""}" data-set-lab-tab="clock">🕒 Telling Time Clock</button>
          <button class="chip ${tab === "unit" ? "on" : ""}" data-set-lab-tab="unit">💱 Unit &amp; Currency Converter</button>
          <button class="chip ${tab === "states" ? "on" : ""}" data-set-lab-tab="states">🌍 36 States &amp; FCT</button>
          <button class="chip ${tab === "naira" ? "on" : ""}" data-set-lab-tab="naira">🇳🇬 Banknotes &amp; Heroes</button>
          <button class="chip ${tab === "solar" ? "on" : ""}" data-set-lab-tab="solar">☀️ Solar System</button>
          <button class="chip ${tab === "body" ? "on" : ""}" data-set-lab-tab="body">🫁 Organ Systems</button>
        </div>

        ${tab === "frac" ? renderLabFraction() :
          tab === "abacus" ? renderLabAbacus() :
          tab === "times" ? renderLabTimesTable() :
          tab === "sieve" ? renderLabSieve() :
          tab === "clock" ? renderLabClock() :
          tab === "unit" ? renderLabUnit() :
          tab === "states" ? renderLabStates() :
          tab === "naira" ? renderLabNaira() :
          tab === "solar" ? renderLabSolar() :
          renderLabBody()}
      </div>`;
  }

  function renderLabFraction() {
    const num = Math.min(state.lab.fracNum, state.lab.fracDen);
    const den = state.lab.fracDen;
    const decimal = (num / den).toFixed(2);
    const pct = Math.round((num / den) * 100);

    return `
      <div class="lab-panel">
        <h3>🍰 Fraction Visualizer &amp; Equal Parts Cutter</h3>
        <p class="sub">Adjust the numerator and denominator to see the fraction circle pie, fraction bar, and equivalent percentage.</p>

        <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;margin:16px 0;">
          <div>
            <label><strong>Numerator (Parts Chosen): ${num}</strong></label>
            <input type="range" id="frac-num-range" min="1" max="${den}" value="${num}" style="width:100%;max-width:240px;display:block;">
          </div>
          <div>
            <label><strong>Denominator (Total Equal Parts): ${den}</strong></label>
            <input type="range" id="frac-den-range" min="2" max="12" value="${den}" style="width:100%;max-width:240px;display:block;">
          </div>
        </div>

        <div class="lab-canvas-container">
          <canvas id="frac-canvas" width="580" height="240"></canvas>
        </div>

        <div class="metric-grid" style="margin-top:16px;">
          <div><b>${num} / ${den}</b><span>Common Fraction</span></div>
          <div><b>${decimal}</b><span>Decimal Value</span></div>
          <div><b>${pct}%</b><span>Percentage</span></div>
          <div><b>${num > 1 && den % num === 0 ? `1 / ${den / num}` : `${num}/${den}`}</b><span>Simplified Form</span></div>
        </div>
      </div>`;
  }

  function renderLabAbacus() {
    const { abacusTh, abacusH, abacusT, abacusU } = state.lab;
    const totalVal = (abacusTh * 1000) + (abacusH * 100) + (abacusT * 10) + abacusU;

    return `
      <div class="lab-panel">
        <h3>🧮 Interactive Place Value Abacus &amp; Base-10 Blocks</h3>
        <p class="sub">Click '+' and '-' on each column to build place value quantities up to Thousands.</p>

        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:16px;text-align:center;margin:24px 0;">
          <div class="stat-tile" style="border-top:6px solid #0e7c76;">
            <strong>Thousands (Th)</strong>
            <div style="font-size:2.4rem;font-weight:900;color:var(--teal);margin:8px 0;">${abacusTh}</div>
            <div style="display:flex;gap:6px;justify-content:center;">
              <button class="btn btn-ghost btn-sm" data-action="abacus-adj" data-col="Th" data-val="-1">-</button>
              <button class="btn btn-primary btn-sm" data-action="abacus-adj" data-col="Th" data-val="1">+</button>
            </div>
          </div>
          <div class="stat-tile" style="border-top:6px solid #0284c7;">
            <strong>Hundreds (H)</strong>
            <div style="font-size:2.4rem;font-weight:900;color:#0284c7;margin:8px 0;">${abacusH}</div>
            <div style="display:flex;gap:6px;justify-content:center;">
              <button class="btn btn-ghost btn-sm" data-action="abacus-adj" data-col="H" data-val="-1">-</button>
              <button class="btn btn-primary btn-sm" data-action="abacus-adj" data-col="H" data-val="1">+</button>
            </div>
          </div>
          <div class="stat-tile" style="border-top:6px solid #e9a825;">
            <strong>Tens (T)</strong>
            <div style="font-size:2.4rem;font-weight:900;color:#d97706;margin:8px 0;">${abacusT}</div>
            <div style="display:flex;gap:6px;justify-content:center;">
              <button class="btn btn-ghost btn-sm" data-action="abacus-adj" data-col="T" data-val="-1">-</button>
              <button class="btn btn-sun btn-sm" data-action="abacus-adj" data-col="T" data-val="1">+</button>
            </div>
          </div>
          <div class="stat-tile" style="border-top:6px solid #e07a5f;">
            <strong>Units (U)</strong>
            <div style="font-size:2.4rem;font-weight:900;color:#e07a5f;margin:8px 0;">${abacusU}</div>
            <div style="display:flex;gap:6px;justify-content:center;">
              <button class="btn btn-ghost btn-sm" data-action="abacus-adj" data-col="U" data-val="-1">-</button>
              <button class="btn btn-coral btn-sm" data-action="abacus-adj" data-col="U" data-val="1">+</button>
            </div>
          </div>
        </div>

        <div class="q-card" style="background:var(--card-alt);margin-top:16px;">
          <h4>Standard Notation: <span style="font-size:1.6rem;color:var(--teal);">${totalVal.toLocaleString()}</span></h4>
          <p style="font-size:1.05rem;margin-top:6px;"><strong>Expanded Form:</strong> ${abacusTh * 1000} + ${abacusH * 100} + ${abacusT * 10} + ${abacusU}</p>
        </div>
      </div>`;
  }

  function renderLabTimesTable() {
    const curR = state.lab.timesRow;
    const curC = state.lab.timesCol;
    const prod = curR * curC;

    let tableHtml = "<tr><th>×</th>";
    for (let c = 1; c <= 12; c++) tableHtml += `<th>${c}</th>`;
    tableHtml += "</tr>";

    for (let r = 1; r <= 12; r++) {
      tableHtml += `<tr><th>${r}</th>`;
      for (let c = 1; c <= 12; c++) {
        const val = r * c;
        let cls = "";
        if (r === curR && c === curC) cls = "highlight-active";
        else if (r === curR || c === curC) cls = "highlight-factor";
        else if (r === c) cls = "square-num";
        tableHtml += `<td class="${cls}" data-action="set-times-cell" data-r="${r}" data-c="${c}">${val}</td>`;
      }
      tableHtml += "</tr>";
    }

    return `
      <div class="lab-panel">
        <h3>✖️ Interactive 12×12 Multiplication Times Table Matrix</h3>
        <p class="sub">Click any cell to highlight the factor intersection, visual array, and square numbers.</p>

        <div class="hint-box" style="font-size:1.1rem;margin-bottom:12px;">
          🎯 <strong>${curR} × ${curC} = ${prod}</strong> (${curR === curC ? "Perfect Square Number!" : `${curR} groups of ${curC}`})
        </div>

        <div class="times-grid-wrapper">
          <table class="times-table">${tableHtml}</table>
        </div>
      </div>`;
  }

  function renderLabSieve() {
    const filter = state.lab.sieveFilter;
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

    let cellsHtml = "";
    for (let i = 1; i <= 100; i++) {
      let cls = "sieve-cell";
      if (i === 1) cls += " one";
      else if (primes.indexOf(i) >= 0) cls += " prime";
      else cls += " composite";
      cellsHtml += `<div class="${cls}">${i}</div>`;
    }

    return `
      <div class="lab-panel">
        <h3>🔢 Sieve of Eratosthenes (Prime Numbers 1–100)</h3>
        <p class="sub">Prime numbers (highlighted green) have exactly two factors: 1 and itself.</p>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
          <span class="chip on" style="background:#10b981;border-color:#059669;">25 Prime Numbers (Green)</span>
          <span class="chip" style="background:var(--card-alt);">74 Composite Numbers (Grey)</span>
          <span class="chip" style="background:#fef08a;color:#854d0e;">1 (Neither Prime nor Composite)</span>
        </div>

        <div class="sieve-grid">${cellsHtml}</div>
      </div>`;
  }

  function renderLabClock() {
    const h = state.lab.clockHour;
    const m = state.lab.clockMinute;
    const ampm = h >= 12 ? "PM" : "AM";
    const dispH = h % 12 === 0 ? 12 : h % 12;
    const dispM = m < 10 ? "0" + m : m;

    let timeInWords = "";
    if (m === 0) timeInWords = `${dispH} o'clock`;
    else if (m === 15) timeInWords = `Quarter past ${dispH}`;
    else if (m === 30) timeInWords = `Half past ${dispH}`;
    else if (m === 45) timeInWords = `Quarter to ${(dispH % 12) + 1}`;
    else if (m < 30) timeInWords = `${m} minutes past ${dispH}`;
    else timeInWords = `${60 - m} minutes to ${(dispH % 12) + 1}`;

    return `
      <div class="lab-panel">
        <h3>🕒 Telling Time &amp; Analog Clock Trainer</h3>
        <p class="sub">Adjust the hands to practice reading 12-hour analog and digital time.</p>

        <div class="lab-canvas-container">
          <canvas id="clock-canvas" width="300" height="300"></canvas>
        </div>

        <div class="q-card" style="text-align:center;background:var(--card-alt);margin:16px 0;">
          <div style="font-size:2.2rem;font-weight:900;color:var(--teal);">${dispH}:${dispM} ${ampm}</div>
          <p style="font-size:1.15rem;font-weight:700;color:var(--ink);margin-top:4px;">"${timeInWords}"</p>
        </div>

        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" data-action="adj-clock" data-type="h" data-val="-1">-1 Hour</button>
          <button class="btn btn-primary btn-sm" data-action="adj-clock" data-type="h" data-val="1">+1 Hour</button>
          <button class="btn btn-ghost btn-sm" data-action="adj-clock" data-type="m" data-val="-15">-15 Mins</button>
          <button class="btn btn-sun btn-sm" data-action="adj-clock" data-type="m" data-val="15">+15 Mins</button>
          <button class="btn btn-ghost btn-sm" data-action="adj-clock" data-type="m" data-val="-5">-5 Mins</button>
          <button class="btn btn-ghost btn-sm" data-action="adj-clock" data-type="m" data-val="5">+5 Mins</button>
        </div>
      </div>`;
  }

  function renderLabUnit() {
    const val = state.lab.unitVal || 100;
    const cat = state.lab.unitCat || "length";

    let resultTxt = "";
    if (cat === "length") {
      resultTxt = `${val} meters (m) = ${val * 100} centimeters (cm) = ${val * 1000} millimeters (mm) = ${(val / 1000).toFixed(3)} kilometers (km)`;
    } else if (cat === "mass") {
      resultTxt = `${val} kilograms (kg) = ${val * 1000} grams (g) = ${(val / 1000).toFixed(3)} metric tonnes`;
    } else if (cat === "currency") {
      resultTxt = `₦${val.toLocaleString()} Nigerian Naira = ${(val / 1500).toFixed(2)} US Dollars ($) = ${(val / 1950).toFixed(2)} British Pounds (£) = ${val * 100} Kobo`;
    } else {
      resultTxt = `${val} Litres (L) = ${val * 1000} Millilitres (ml) = ${val * 100} Centilitres (cl)`;
    }

    return `
      <div class="lab-panel">
        <h3>💱 Universal Primary Unit &amp; Currency Converter</h3>
        <p class="sub">Convert standard metric units of measurement and Nigerian currency.</p>

        <div style="display:flex;gap:12px;margin:16px 0;flex-wrap:wrap;">
          <button class="chip ${cat === "length" ? "on" : ""}" data-set-unit-cat="length">📏 Length (m, cm, km)</button>
          <button class="chip ${cat === "mass" ? "on" : ""}" data-set-unit-cat="mass">⚖️ Mass (g, kg, tonnes)</button>
          <button class="chip ${cat === "capacity" ? "on" : ""}" data-set-unit-cat="capacity">🧪 Capacity (L, ml, cl)</button>
          <button class="chip ${cat === "currency" ? "on" : ""}" data-set-unit-cat="currency">💵 Currency (₦ Naira, $, £)</button>
        </div>

        <div style="margin:16px 0;">
          <label><strong>Input Value:</strong></label>
          <input type="number" id="lab-unit-input" class="edit-input" style="max-width:240px;display:block;" value="${val}">
        </div>

        <div class="feedback ok" style="font-size:1.15rem;font-weight:700;">
          ${esc(resultTxt)}
        </div>
      </div>`;
  }

  function renderLabStates() {
    const zone = state.lab.stateZone || "all";
    const allStates = window.NIGERIAN_STATES || [];
    const filtered = zone === "all" ? allStates : allStates.filter(s => s.zone === zone);

    return `
      <div class="lab-panel">
        <h3>🌍 36 Nigerian States &amp; FCT Geopolitical Explorer</h3>
        <p class="sub">Explore capitals, state slogans, natural mineral/agricultural resources, and historical landmarks.</p>

        <div class="chip-group" style="margin-bottom:16px;">
          <button class="chip ${zone === "all" ? "on" : ""}" data-set-state-zone="all">All States (36 + FCT)</button>
          <button class="chip ${zone === "North Central" ? "on" : ""}" data-set-state-zone="North Central">North Central</button>
          <button class="chip ${zone === "North East" ? "on" : ""}" data-set-state-zone="North East">North East</button>
          <button class="chip ${zone === "North West" ? "on" : ""}" data-set-state-zone="North West">North West</button>
          <button class="chip ${zone === "South East" ? "on" : ""}" data-set-state-zone="South East">South East</button>
          <button class="chip ${zone === "South South" ? "on" : ""}" data-set-state-zone="South South">South South</button>
          <button class="chip ${zone === "South West" ? "on" : ""}" data-set-state-zone="South West">South West</button>
        </div>

        <div class="states-grid">
          ${filtered.map(function (s) {
            return `
              <div class="state-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <strong style="font-size:1.15rem;color:var(--teal);">${esc(s.state)}</strong>
                  <span class="chip" style="font-size:0.75rem;">${esc(s.zone)}</span>
                </div>
                <p><strong>Capital:</strong> ${esc(s.capital)}</p>
                <p style="font-style:italic;color:var(--muted);margin:4px 0;">"${esc(s.slogan)}"</p>
                <p style="font-size:0.85rem;margin-top:6px;"><strong>Resources:</strong> ${esc(s.resources)}</p>
                <p style="font-size:0.85rem;margin-top:4px;"><strong>Landmark:</strong> ${esc(s.landmark)}</p>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  function renderLabNaira() {
    const list = window.NAIRA_CURRENCY_BANK || [];

    return `
      <div class="lab-panel">
        <h3>🇳🇬 Nigerian Banknotes &amp; National Heroes Guide</h3>
        <p class="sub">Discover the historical nationalist heroes, cultural heritage icons, and reverse artwork on Nigerian currency.</p>

        <div class="currency-grid">
          ${list.map(function (n) {
            return `
              <div class="currency-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <span style="font-size:1.8rem;font-weight:900;color:var(--teal);">${esc(n.note)}</span>
                  <span class="chip">${esc(n.color)}</span>
                </div>
                <h4 style="font-size:1.1rem;margin-bottom:4px;">Portrait: ${esc(n.portrait)}</h4>
                <p style="font-size:0.85rem;color:var(--muted);margin-bottom:8px;">${esc(n.role)}</p>
                <div style="background:var(--card-alt);padding:8px;border-radius:6px;font-size:0.82rem;">
                  <strong>Reverse Artwork:</strong> ${esc(n.reverse)}
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  function renderLabSolar() {
    const list = window.SOLAR_SYSTEM_DATA || [];

    return `
      <div class="lab-panel">
        <h3>☀️ Solar System &amp; Planetary Science Explorer</h3>
        <p class="sub">Order from the Sun, diameters, surface temperatures, moons, and astronomical facts.</p>

        <div class="grid-grades" style="margin-top:16px;">
          ${list.map(function (p) {
            return `
              <div class="card-btn">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <h4>#${p.order} ${esc(p.name)}</h4>
                  <span class="chip">${esc(p.type)}</span>
                </div>
                <p style="font-size:0.88rem;margin:8px 0;"><strong>Distance from Sun:</strong> ${esc(p.distance)}</p>
                <p style="font-size:0.88rem;margin-bottom:4px;"><strong>Diameter:</strong> ${esc(p.diameter)} · <strong>Moons:</strong> ${p.moons}</p>
                <p style="font-size:0.88rem;color:var(--coral);margin-bottom:8px;"><strong>Avg Temperature:</strong> ${esc(p.temp)}</p>
                <p style="font-size:0.85rem;background:var(--card-alt);padding:8px;border-radius:6px;">${esc(p.fact)}</p>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  function renderLabBody() {
    const list = window.HUMAN_BODY_SYSTEMS || [];

    return `
      <div class="lab-panel">
        <h3>🫁 Human Body Systems &amp; Health Habits</h3>
        <p class="sub">Major biological organ systems, physiological functions, and primary health advice.</p>

        <div style="display:flex;flex-direction:column;gap:16px;margin-top:16px;">
          ${list.map(function (sys) {
            return `
              <div class="q-card" style="border-left:6px solid var(--teal);">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                  <span style="font-size:2rem;">${sys.icon}</span>
                  <h3 style="font-size:1.3rem;">${esc(sys.name)}</h3>
                </div>
                <p style="font-size:0.95rem;"><strong>Major Organs:</strong> ${esc(sys.organs)}</p>
                <p style="font-size:0.95rem;margin:6px 0;"><strong>Function:</strong> ${esc(sys.function)}</p>
                <div class="feedback ok" style="margin-top:8px;font-size:0.88rem;">
                  <strong>💡 Health &amp; Hygiene Tip:</strong> ${esc(sys.healthTip)}
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  /* ==========================================================================
     2-PLAYER HEAD-TO-HEAD SPEED DUEL
     ========================================================================== */

  async function startDuelMatch() {
    const g = state.grade || 5;
    const subjs = ["maths", "english", "science", "social", "quantitative"];
    const s = shuffle(subjs)[0];

    try {
      const bank = await loadBank(g, s);
      state.duel.questions = shuffle(bank).slice(0, 10);
      state.duel.index = 0;
      state.duel.p1Score = 0;
      state.duel.p2Score = 0;
      state.duel.p1Streak = 0;
      state.duel.p2Streak = 0;
      state.duel.winner = null;
      state.duel.p1Choice = null;
      state.duel.p2Choice = null;
      state.duel.roundOver = false;
      state.duel.active = true;
      state.screen = "duel";
      render();
    } catch (e) { toast("Could not initialize Duel."); }
  }

  function submitDuelAnswer(player, optIdx) {
    const d = state.duel;
    if (d.roundOver) return;

    const curQ = d.questions[d.index];
    const isCorrect = (optIdx === curQ.answer);

    if (player === 1 && d.p1Choice == null) {
      d.p1Choice = optIdx;
      if (isCorrect) {
        d.p1Score += 10 + (d.p1Streak * 2);
        d.p1Streak += 1;
        playCorrect();
      } else {
        d.p1Streak = 0;
        playWrong();
      }
    } else if (player === 2 && d.p2Choice == null) {
      d.p2Choice = optIdx;
      if (isCorrect) {
        d.p2Score += 10 + (d.p2Streak * 2);
        d.p2Streak += 1;
        playCorrect();
      } else {
        d.p2Streak = 0;
        playWrong();
      }
    }

    if (d.p1Choice != null && d.p2Choice != null) {
      d.roundOver = true;
    }

    render();
  }

  function nextDuelRound() {
    const d = state.duel;
    d.p1Choice = null;
    d.p2Choice = null;
    d.roundOver = false;

    if (d.index < d.questions.length - 1) {
      d.index += 1;
      render();
    } else {
      if (d.p1Score > d.p2Score) d.winner = d.p1Name;
      else if (d.p2Score > d.p1Score) d.winner = d.p2Name;
      else d.winner = "It's a Tie!";
      playBadgeFanfare();
      render();
      launchConfetti();
    }
  }

  function renderDuel() {
    const d = state.duel;
    if (!d.active || !d.questions.length) {
      return `
        <div class="wrap">
          ${renderTopBar("home")}
          ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "2-Player Speed Duel" }])}
          <div class="hero">
            <div>
              <div class="kicker">Head-to-Head Pass &amp; Play</div>
              <h1>2-Player Classroom Speed Duel</h1>
              <p class="lead">Compete with a classmate or sibling on the same screen! Answer 10 rapid-fire questions to see who has the fastest retrieval speed and streak accuracy.</p>
              <button class="btn btn-primary btn-sm" data-action="launch-duel" style="margin-top:16px;">Begin Speed Duel ⚔️</button>
            </div>
            <div class="hero-art"><img src="images/hero-kids.jpg" alt="Students competing"></div>
          </div>
        </div>`;
    }

    if (d.winner) {
      return `
        <div class="wrap">
          <div class="result">
            <div class="letter-mark">🏆</div>
            <div class="kicker">Match Concluded</div>
            <h2 class="section-title">Winner: ${esc(d.winner)}</h2>
            <div class="metric-grid" style="margin:24px 0;">
              <div><b>${d.p1Score} pts</b><span>${esc(d.p1Name)}</span></div>
              <div><b>${d.p2Score} pts</b><span>${esc(d.p2Name)}</span></div>
            </div>
            <div style="display:flex;gap:12px;justify-content:center;">
              <button class="btn btn-primary" data-action="launch-duel">Rematch ⚔️</button>
              <button class="btn btn-ghost" data-go="home">Home 🏠</button>
            </div>
          </div>
        </div>`;
    }

    const q = d.questions[d.index];

    return `
      <div class="wrap">
        <div class="topbar no-print">
          <div><strong>Duel Round ${d.index + 1} of ${d.questions.length}</strong></div>
          <button class="btn btn-ghost btn-sm" data-action="quit-duel">✕ Exit Match</button>
        </div>

        <div class="q-card" style="text-align:center;">
          <span class="badge-tag">${esc(q.topic || "Speed Item")}</span>
          <h2 style="font-size:1.6rem;margin:12px 0;">${esc(q.q)}</h2>
        </div>

        <div class="duel-container">
          <!-- Player 1 Side -->
          <div class="duel-player-p1">
            <div class="duel-score-banner">
              <strong style="color:var(--sky);font-size:1.2rem;">${esc(d.p1Name)}</strong>
              <span class="chip on" style="background:var(--sky);">${d.p1Score} Pts (🔥 ${d.p1Streak})</span>
            </div>
            <div class="options">
              ${q.options.map((opt, oi) => {
                let cls = "opt";
                if (d.p1Choice === oi) cls += (oi === q.answer ? " correct" : " wrong");
                return `<button class="${cls}" data-action="duel-p1-pick" data-opt="${oi}" ${d.p1Choice != null ? "disabled" : ""}><span class="badge">${LETTERS[oi]}</span><span>${esc(opt)}</span></button>`;
              }).join("")}
            </div>
          </div>

          <!-- Player 2 Side -->
          <div class="duel-player-p2">
            <div class="duel-score-banner">
              <strong style="color:var(--coral);font-size:1.2rem;">${esc(d.p2Name)}</strong>
              <span class="chip on" style="background:var(--coral);">${d.p2Score} Pts (🔥 ${d.p2Streak})</span>
            </div>
            <div class="options">
              ${q.options.map((opt, oi) => {
                let cls = "opt";
                if (d.p2Choice === oi) cls += (oi === q.answer ? " correct" : " wrong");
                return `<button class="${cls}" data-action="duel-p2-pick" data-opt="${oi}" ${d.p2Choice != null ? "disabled" : ""}><span class="badge">${LETTERS[oi]}</span><span>${esc(opt)}</span></button>`;
              }).join("")}
            </div>
          </div>
        </div>

        ${d.roundOver ? `
          <div style="text-align:center;margin-top:24px;">
            <button class="btn btn-primary" data-action="duel-next" style="font-size:1.1rem;padding:12px 32px;">Next Round →</button>
          </div>
        ` : ""}
      </div>`;
  }

  /* ==========================================================================
     CLASSROOM SMARTBOARD TEAM SCOREBOARD & BUZZER VIEW
     ========================================================================== */

  function renderTeams() {
    const tm = state.teams;

    return `
      <div class="wrap">
        ${renderTopBar("teachers")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Teacher Hub", go: "teachers" }, { label: "Smartboard Team Buzzer" }])}
        <div class="kicker">Interactive Classroom Gamification</div>
        <h2 class="section-title">Smartboard Team Scoreboard &amp; Live Buzzer</h2>
        <p class="sub">Organize your classroom into 4 competing houses/teams with live score adjusters and buzzer sound effects.</p>

        <div class="team-scoreboard">
          <div class="team-card emerald">
            <h4 style="color:#10b981;">🟢 Emerald House</h4>
            <div class="team-score-val" style="color:#10b981;">${tm.teamEmerald.score}</div>
            <div style="display:flex;gap:4px;justify-content:center;">
              <button class="btn btn-ghost btn-sm" data-action="adj-team" data-t="Emerald" data-v="-5">-5</button>
              <button class="btn btn-primary btn-sm" data-action="adj-team" data-t="Emerald" data-v="10">+10</button>
            </div>
          </div>
          <div class="team-card sapphire">
            <h4 style="color:#0284c7;">🔵 Sapphire House</h4>
            <div class="team-score-val" style="color:#0284c7;">${tm.teamSapphire.score}</div>
            <div style="display:flex;gap:4px;justify-content:center;">
              <button class="btn btn-ghost btn-sm" data-action="adj-team" data-t="Sapphire" data-v="-5">-5</button>
              <button class="btn btn-primary btn-sm" data-action="adj-team" data-t="Sapphire" data-v="10">+10</button>
            </div>
          </div>
          <div class="team-card ruby">
            <h4 style="color:#e11d48;">🔴 Ruby House</h4>
            <div class="team-score-val" style="color:#e11d48;">${tm.teamRuby.score}</div>
            <div style="display:flex;gap:4px;justify-content:center;">
              <button class="btn btn-ghost btn-sm" data-action="adj-team" data-t="Ruby" data-v="-5">-5</button>
              <button class="btn btn-coral btn-sm" data-action="adj-team" data-t="Ruby" data-v="10">+10</button>
            </div>
          </div>
          <div class="team-card amber">
            <h4 style="color:#d97706;">🟡 Amber House</h4>
            <div class="team-score-val" style="color:#d97706;">${tm.teamAmber.score}</div>
            <div style="display:flex;gap:4px;justify-content:center;">
              <button class="btn btn-ghost btn-sm" data-action="adj-team" data-t="Amber" data-v="-5">-5</button>
              <button class="btn btn-sun btn-sm" data-action="adj-team" data-t="Amber" data-v="10">+10</button>
            </div>
          </div>
        </div>

        <div class="q-card" style="text-align:center;padding:32px;">
          <button class="btn btn-coral btn-sm" data-action="sound-buzzer" style="font-size:1.3rem;padding:16px 36px;border-radius:9999px;">🚨 SOUND BUZZER</button>
          <button class="btn btn-sun btn-sm" data-action="sound-fanfare" style="font-size:1.3rem;padding:16px 36px;border-radius:9999px;margin-left:12px;">🎺 TEAM CHEER</button>
        </div>
      </div>`;
  }

  /* ==========================================================================
     ADVANCED PSYCHOMETRIC & LEARNING ANALYTICS VIEW
     ========================================================================== */

  function renderAnalytics() {
    const g = state.grade || 5;
    const days30 = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10);
      return { date: d, count: progress.studyByDay[d] ? Math.round(progress.studyByDay[d] / 60) : 0 };
    });

    return `
      <div class="wrap">
        ${renderTopBar("home")}
        ${renderBreadcrumbs([{ label: "Home", go: "home" }, { label: "Advanced Psychometric Analytics" }])}
        <div class="kicker">Psychometrics &amp; Item Response Profiling</div>
        <h2 class="section-title">Cognitive Domain Mastery Radar &amp; Velocity</h2>
        <p class="sub">In-depth psychometric analysis of cognitive taxonomy performance and 30-day retrieval habit consistency.</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px;">
          <div class="q-card" style="text-align:center;">
            <h3>📊 Bloom's Taxonomy Cognitive Radar</h3>
            <p class="sub">Visual distribution across lower-order and higher-order thinking skills.</p>
            <div class="lab-canvas-container">
              <canvas id="radar-canvas" width="360" height="360"></canvas>
            </div>
          </div>

          <div class="q-card">
            <h3>🗓️ 30-Day Learning Velocity Heatmap</h3>
            <p class="sub">Daily study minutes logged on this device.</p>
            <div style="display:grid;grid-template-columns:repeat(6, 1fr);gap:8px;margin-top:16px;">
              ${days30.map(d => {
                const bg = d.count > 15 ? "#0e7c76" : d.count > 5 ? "#10b981" : d.count > 0 ? "#a7f3d0" : "var(--line)";
                const col = d.count > 5 ? "#ffffff" : "#0f172a";
                return `
                  <div style="background:${bg};color:${col};padding:8px 4px;border-radius:6px;text-align:center;font-size:0.75rem;">
                    <strong>${d.date.slice(5)}</strong><br>${d.count}m
                  </div>`;
              }).join("")}
            </div>
          </div>
        </div>
      </div>`;
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
     QUIZ RESULT VIEW
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
          <div class="card-btn" data-go="teams">
            <h3>🏫 3. Smartboard Team Scoreboard &amp; Buzzer</h3>
            <p>Gamify whole-class review with 4 House Teams, timer, sound buzzer, and scoreboards.</p>
          </div>
          <div class="card-btn" data-go="projector">
            <h3>📽️ 4. Smartboard Inquiry Projector</h3>
            <p>High-visibility classroom projection mode for smartboards and live class polling.</p>
          </div>
          <div class="card-btn" data-go="analytics">
            <h3>📊 5. Psychometric Radar &amp; Velocity</h3>
            <p>Cognitive domain radar charts, 30-day learning velocity heatmap, and calibration curves.</p>
          </div>
          <div class="card-btn" data-action="export-class-csv">
            <h3>📥 6. Export Class CSV Gradebook</h3>
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
    }).join("");

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
          <button class="icon-btn" data-go="lab" title="Interactive Manipulatives & STEM Lab">🧪 Lab</button>
          <button class="icon-btn" data-go="duel" title="2-Player Speed Duel">⚔️ Duel</button>
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
              <button class="btn btn-ghost" data-go="lab">🧪 Learning Lab</button>
              <button class="btn btn-ghost" data-go="duel">⚔️ 2-Player Duel</button>
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
          <div class="play-tile" style="border-top:5px solid #8b5cf6;background:#f5f3ff;" data-go="lab">
            <span class="ico">🧪</span>
            <strong>STEM Learning Lab</strong>
            <p>Interactive fraction visualizers, place value abacus, clock trainer, and 36 states explorer.</p>
          </div>
          <div class="play-tile" style="border-top:5px solid #e07a5f;background:#fff1f2;" data-go="duel">
            <span class="ico">⚔️</span>
            <strong>2-Player Speed Duel</strong>
            <p>Pass-and-play split-screen race between two pupils on the same tablet or desktop.</p>
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

  function renderFooter() {
    return `
      <footer class="site-footer no-print" style="border-top:2px solid var(--line);margin-top:48px;padding-top:24px;text-align:center;color:var(--muted);font-size:0.9rem;">
        <p><strong>Primary Super Quiz</strong> · World-Class Universal Primary 1–6 (Basic 1–6) Educational Platform</p>
        <p style="margin-top:6px;">16 Subjects · 9,600 Unique Questions · Official Nigerian Exam Setter · Free &amp; Offline PWA</p>
        <div style="display:flex;gap:14px;justify-content:center;margin-top:12px;flex-wrap:wrap;">
          <button class="crumbs button" data-go="exam_setter">Set Nigerian Exam</button> ·
          <button class="crumbs button" data-go="lab">Learning Lab</button> ·
          <button class="crumbs button" data-go="duel">2-Player Duel</button> ·
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
     IN-APP LOADING OVERLAY & EDUCATIONAL TIPS
     ========================================================================== */

  function renderLoadingOverlay(msg) {
    const tips = [
      "Active retrieval practice strengthens neural pathways and memory consolidation.",
      "Desirable difficulty: solving challenging problems accelerates durable learning.",
      "Take your time to eliminate unlikely options using the 50:50 tool.",
      "Nigeria comprises 36 States and the Federal Capital Territory (FCT Abuja).",
      "Using the interactive Whiteboard Scratchpad improves problem-solving accuracy.",
      "Spacing your study sessions across the week prevents the forgetting curve.",
      "Dual-coding: pairing visual representations with equations deepens schema construction."
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    return `
      <div class="in-app-loading-overlay">
        <div class="in-app-loading-card">
          <div class="in-app-spinner-box">
            <div class="in-app-spinner"></div>
            <div class="in-app-spinner-icon">🦉</div>
          </div>
          <h3 class="text-xl font-black text-gray-900 mt-4">${esc(msg || "Loading Questions & Resources...")}</h3>
          <p class="text-xs text-gray-500 mt-1">Calibrating questions and psychometric parameters...</p>
          <div class="mt-4 p-3.5 rounded-xl bg-teal-50 border border-teal-100 text-xs text-teal-900 text-left flex items-start gap-2.5">
            <span class="text-base">💡</span>
            <div>
              <span class="font-bold">Pedagogical Tip:</span>
              <span>${esc(tip)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     MAIN ROUTING RENDERER
     ========================================================================== */

  function render() {
    if (!app) return;
    let html = "";
    if (state.loading) {
      html = renderTopBar("home") + renderLoadingOverlay(state.loadingMsg || "Loading Questions & Resources...");
      app.innerHTML = html;
      window.scrollTo(0, 0);
      return;
    }
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
      case "lesson_plans": html = renderLessonPlans(); break;
      case "item_analysis": html = renderItemAnalysis(); break;
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
      case "lab": html = renderLab(); break;
      case "duel": html = renderDuel(); break;
      case "teams": html = renderTeams(); break;
      case "analytics": html = renderAnalytics(); break;
      default: html = renderHome();
    }
    app.innerHTML = html;
    window.scrollTo(0, 0);

    if (state.screen === "quiz" && state.scratchpadOpen) {
      setTimeout(initScratchpadCanvas, 100);
    }
    if (state.screen === "lab") {
      if (state.lab.tab === "frac") setTimeout(renderFractionCanvas, 50);
      else if (state.lab.tab === "clock") setTimeout(renderClockCanvas, 50);
    }
    if (state.screen === "analytics") {
      setTimeout(renderRadarCanvas, 50);
    }
  }

  /* ==========================================================================
     GLOBAL EVENT LISTENERS & DELEGATION
     ========================================================================== */

  document.addEventListener("click", function (e) {
    const target = e.target.closest("[data-action], [data-go], [data-set-grade], [data-pick-subj], [data-drill-subj], [data-start-topic-quiz], [data-set-group], [data-set-len], [data-set-mode], [data-opt], [data-set-conf], [data-set-stool], [data-set-scolor], [data-rate-card], [data-set-theme], [data-set-font], [data-set-cur-tab], [data-set-why-tab], [data-switch-profile], [data-set-rfilter], [data-set-lab-tab], [data-set-unit-cat], [data-set-state-zone], [data-set-shape-filter], [data-select-lesson-template]");
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

    if (target.dataset.setLabTab) {
      state.lab.tab = target.dataset.setLabTab;
      render();
      return;
    }

    if (target.dataset.setUnitCat) {
      state.lab.unitCat = target.dataset.setUnitCat;
      render();
      return;
    }

    if (target.dataset.setStateZone) {
      state.lab.stateZone = target.dataset.setStateZone;
      render();
      return;
    }

    if (target.dataset.setShapeFilter) {
      state.lab.shapeFilter = target.dataset.setShapeFilter;
      render();
      return;
    }

    if (target.dataset.selectLessonTemplate) {
      state.lessonPlans.activeTemplate = target.dataset.selectLessonTemplate;
      render();
      return;
    }

    if (target.dataset.setWhyTab) {
      state.whyTab = target.dataset.setWhyTab;
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
      // LAB MANIPULATIVES ACTIONS
      // ==========================================
      case "abacus-adj":
        const col = target.dataset.col;
        const v = Number(target.dataset.val);
        if (col === "Th") state.lab.abacusTh = Math.max(0, Math.min(9, state.lab.abacusTh + v));
        else if (col === "H") state.lab.abacusH = Math.max(0, Math.min(9, state.lab.abacusH + v));
        else if (col === "T") state.lab.abacusT = Math.max(0, Math.min(9, state.lab.abacusT + v));
        else if (col === "U") state.lab.abacusU = Math.max(0, Math.min(9, state.lab.abacusU + v));
        render();
        break;

      case "set-times-cell":
        state.lab.timesRow = Number(target.dataset.r);
        state.lab.timesCol = Number(target.dataset.c);
        render();
        break;

      case "adj-clock":
        const cType = target.dataset.type;
        const cVal = Number(target.dataset.val);
        if (cType === "h") {
          state.lab.clockHour = (state.lab.clockHour + cVal + 24) % 24;
        } else if (cType === "m") {
          let newM = state.lab.clockMinute + cVal;
          if (newM >= 60) {
            newM %= 60;
            state.lab.clockHour = (state.lab.clockHour + 1) % 24;
          } else if (newM < 0) {
            newM = (newM + 60) % 60;
            state.lab.clockHour = (state.lab.clockHour + 23) % 24;
          }
          state.lab.clockMinute = newM;
        }
        render();
        break;

      // ==========================================
      // 2-PLAYER DUEL ACTIONS
      // ==========================================
      case "launch-duel":
        startDuelMatch();
        break;

      case "duel-p1-pick":
        submitDuelAnswer(1, Number(target.dataset.opt));
        break;

      case "duel-p2-pick":
        submitDuelAnswer(2, Number(target.dataset.opt));
        break;

      case "duel-next":
        nextDuelRound();
        break;

      case "quit-duel":
        state.duel.active = false;
        state.screen = "home";
        render();
        break;

      // ==========================================
      // CLASSROOM TEAMS ACTIONS
      // ==========================================
      case "adj-team":
        const tmKey = "team" + target.dataset.t;
        const tmV = Number(target.dataset.v);
        if (state.teams[tmKey]) {
          state.teams[tmKey].score = Math.max(0, state.teams[tmKey].score + tmV);
          if (tmV > 0) playCorrect();
          render();
        }
        break;

      case "sound-buzzer":
        playBuzzer();
        break;

      case "sound-fanfare":
        playBadgeFanfare();
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
          localStorage.setItem("psq-class-roster-v3", JSON.stringify(state.classRoster));
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
    if (e.target.id === "frac-num-range") {
      state.lab.fracNum = Number(e.target.value);
      renderFractionCanvas();
    }
    if (e.target.id === "frac-den-range") {
      state.lab.fracDen = Number(e.target.value);
      if (state.lab.fracNum > state.lab.fracDen) state.lab.fracNum = state.lab.fracDen;
      render();
    }
    if (e.target.id === "lab-unit-input") {
      state.lab.unitVal = Number(e.target.value) || 0;
      render();
      const el = document.getElementById("lab-unit-input");
      if (el) el.focus();
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

  // Keyboard Shortcuts (Universal Accessibility & 2-Player Duel)
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
    } else if (state.screen === "duel" && !state.duel.roundOver) {
      // Player 1 Keys: Q, W, E, R
      if (key === "Q") submitDuelAnswer(1, 0);
      else if (key === "W") submitDuelAnswer(1, 1);
      else if (key === "E") submitDuelAnswer(1, 2);
      else if (key === "R") submitDuelAnswer(1, 3);
      // Player 2 Keys: U, I, O, P
      else if (key === "U") submitDuelAnswer(2, 0);
      else if (key === "I") submitDuelAnswer(2, 1);
      else if (key === "O") submitDuelAnswer(2, 2);
      else if (key === "P") submitDuelAnswer(2, 3);
    }
  });

  // Service Worker Registration for 100% Offline PWA functionality
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }

  // Initial Boot Render & Loader Dismissal
  render();

  const initLoader = document.getElementById("initial-loader");
  if (initLoader) {
    setTimeout(function () {
      initLoader.classList.add("loaded");
      setTimeout(function () {
        if (initLoader.parentNode) initLoader.parentNode.removeChild(initLoader);
      }, 500);
    }, 350);
  }

})();
