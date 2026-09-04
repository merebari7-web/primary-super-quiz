(function () {
  const app = document.getElementById("app");
  const canvas = document.getElementById("confetti");
  const LETTERS = ["A", "B", "C", "D"];
  const bankCache = {};
  const SK = "psq-settings-v3";
  const EMPTY_PROGRESS = {
    xp: 0, streak: 0, lastDay: "", quizzes: 0, badges: [],
    best: {}, history: [], missed: {}, dailyDate: "", dailyBest: 0,
    weekKey: "", weekQuizzes: 0, lastRank: "hatchling", days: {}
  };

  const settings = loadJSON(SK, { sound: true, tts: false, dark: false, large: false, music: true });
  let progress = EMPTY_PROGRESS;

  const state = {
    screen: "home",
    name: localStorage.getItem("psq-name") || "",
    grade: null,
    subject: null,
    group: "all",
    query: "",
    length: 20,
    mode: "practice",
    questions: [],
    index: 0,
    picked: [],
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
    timer: 0,
    xpGained: 0,
    newBadges: [],
    examPaper: null,
    user: null,
    pendingDaily: false,
    react: null
  };

  let audioCtx = null;
  let music = null;
  let confettiTimer = null;
  let tickTimer = null;
  let toastTimer = null;
  let reactTimer = null;
  let speakTimer = null;
  let ttsWatch = null;
  let gsiInited = false;

  applyChrome();

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
  function saveSettings() { localStorage.setItem(SK, JSON.stringify(settings)); }
  function currentUser() {
    try {
      const u = JSON.parse(localStorage.getItem("psq-user") || "null");
      return u && u.sub ? u : null;
    } catch (e) { return null; }
  }
  function uid() {
    const u = currentUser();
    return u ? u.sub : "guest";
  }
  function progressKey() { return "psq-progress-v3-" + uid(); }
  function resumeKey() { return "psq-resume-v3-" + uid(); }
  function saveProgress() { localStorage.setItem(progressKey(), JSON.stringify(progress)); }
  function loadProgress() {
    let p = loadJSON(progressKey(), null);
    if (!p && uid() === "guest") p = loadJSON("psq-progress-v3", null);
    progress = Object.assign({}, EMPTY_PROGRESS, p || {});
    if (!progress.missed) progress.missed = {};
    if (!progress.best) progress.best = {};
    if (!progress.history) progress.history = [];
    if (!progress.badges) progress.badges = [];
  }
  function googleClientId() {
    return (localStorage.getItem("psq-google-client-id") || window.GOOGLE_CLIENT_ID || "").trim();
  }
  function parseJwt(token) {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = part + "===".slice((part.length + 3) % 4);
    return JSON.parse(atob(pad));
  }
  function applyUser(user) {
    state.user = user;
    if (user) {
      localStorage.setItem("psq-user", JSON.stringify(user));
      state.name = user.name || state.name;
      localStorage.setItem("psq-name", state.name);
    } else {
      localStorage.removeItem("psq-user");
    }
    loadProgress();
  }
  function onGoogleCredential(resp) {
    try {
      const p = parseJwt(resp.credential);
      applyUser({
        sub: p.sub,
        name: p.name || p.given_name || "Pupil",
        email: p.email || "",
        picture: p.picture || "",
        exp: p.exp || 0
      });
      toast("Signed in as " + state.user.name);
      render();
    } catch (err) {
      toast("Google sign-in failed. Try again.");
    }
  }
  function loadGsi(cb) {
    if (window.google && google.accounts && google.accounts.id) { cb(); return; }
    const existing = document.getElementById("gsi-script");
    if (existing) {
      existing.addEventListener("load", cb);
      return;
    }
    const s = document.createElement("script");
    s.id = "gsi-script";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = cb;
    s.onerror = function () { toast("Could not reach Google. Check your internet."); };
    document.head.appendChild(s);
  }
  function mountGoogleButton() {
    const slot = document.getElementById("google-btn");
    if (!slot) return;
    const cid = googleClientId();
    if (!cid) return;
    loadGsi(function () {
      if (!window.google || !google.accounts || !google.accounts.id) return;
      const el = document.getElementById("google-btn");
      if (!el) return;
      if (!gsiInited) {
        google.accounts.id.initialize({
          client_id: cid,
          callback: onGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: "popup",
          context: "signin"
        });
        gsiInited = true;
      }
      el.innerHTML = "";
      google.accounts.id.renderButton(el, {
        type: "standard",
        theme: settings.dark ? "filled_black" : "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
        logo_alignment: "left",
        width: Math.min(320, el.clientWidth || 280)
      });
      try { google.accounts.id.prompt(); } catch (e) {}
    });
  }
  function signOutGoogle() {
    const cid = googleClientId();
    if (window.google && google.accounts && google.accounts.id && cid) {
      try { google.accounts.id.disableAutoSelect(); } catch (e) {}
    }
    applyUser(null);
    state.name = localStorage.getItem("psq-name") || "";
    toast("Signed out. Guest progress is separate.");
    state.screen = "home";
    render();
  }
  loadProgress();
  state.user = currentUser();
  if (state.user && state.user.name) state.name = state.user.name;

  function applyChrome() {
    document.documentElement.dataset.theme = settings.dark ? "dark" : "light";
    document.documentElement.classList.toggle("large", !!settings.large);
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

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function weekKey() {
    const d = new Date();
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const ys = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    const w = Math.ceil((((t - ys) / 86400000) + 1) / 7);
    return t.getUTCFullYear() + "-W" + w;
  }
  function ensureWeek() {
    const k = weekKey();
    if (progress.weekKey !== k) {
      progress.weekKey = k;
      progress.weekQuizzes = 0;
    }
  }
  function rankFor(xp) {
    const ranks = window.RANKS || [];
    let r = ranks[0] || { id: "hatchling", name: "Hatchling", min: 0, icon: "🐣" };
    for (let i = 0; i < ranks.length; i++) if (xp >= ranks[i].min) r = ranks[i];
    return r;
  }
  function nextRank(xp) {
    const ranks = window.RANKS || [];
    for (let i = 0; i < ranks.length; i++) if (xp < ranks[i].min) return ranks[i];
    return null;
  }
  function weakestList(grade) {
    return Object.keys(window.SUBJECTS).map(function (k) {
      const b = progress.best[grade + "/" + k];
      return { k: k, pct: b ? b.pct : 35 };
    }).sort(function (a, b) { return a.pct - b.pct; }).map(function (x) { return x.k; });
  }
  function weakestSubject(grade) {
    return weakestList(grade)[0] || "maths";
  }
  function prefetchGrade(g) {
    ["english", "maths", "science", "civic"].forEach(function (s) {
      fetchBank(g, s).catch(function () {});
    });
  }
  function streakDots() {
    const days = progress.days || {};
    const items = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      const label = ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];
      items.push(`<span class="dot ${days[k] ? "on" : ""}" title="${k}">${label}</span>`);
    }
    return `<div class="streak-dots" aria-label="Last 7 days">${items.join("")}</div>`;
  }

  function prepareQuestion(q, subject) {
    const answerText = q.options[q.answer];
    const options = shuffle(q.options);
    return {
      q: q.q, options: options, answer: options.indexOf(answerText),
      explain: q.explain, subject: subject
    };
  }

  async function fetchBank(grade, subject) {
    const key = grade + "/" + subject;
    if (!bankCache[key]) {
      const res = await fetch("data/p" + grade + "/" + subject + ".json");
      if (!res.ok) throw new Error("Could not load " + subject);
      bankCache[key] = await res.json();
    }
    return bankCache[key];
  }

  async function loadQuiz(grade, subject, length, seeded) {
    const rng = seeded ? mulberry32(seeded) : Math.random;
    function shuf(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
    if (subject === "mix" || subject === "daily") {
      const keys = Object.keys(window.SUBJECTS);
      const picked = [];
      const per = Math.max(1, Math.ceil(length / keys.length));
      for (let i = 0; i < keys.length; i++) {
        const bank = shuf(await fetchBank(grade, keys[i]));
        bank.slice(0, per).forEach(function (q) { picked.push(prepareQuestion(q, keys[i])); });
      }
      return shuf(picked).slice(0, length);
    }
    if (subject === "missed") {
      const bag = progress.missed[grade] || [];
      if (!bag.length) throw new Error("No missed questions yet for this class. Play a quiz first.");
      return shuf(bag).slice(0, Math.min(length, bag.length)).map(function (q) {
        return prepareQuestion(q, q.subject || "mix");
      });
    }
    if (subject === "smart") {
      const picked = [];
      const bag = shuf(progress.missed[grade] || []);
      bag.slice(0, Math.ceil(length / 2)).forEach(function (q) {
        picked.push(prepareQuestion(q, q.subject || "mix"));
      });
      const keys = weakestList(grade).slice(0, 3);
      const use = keys.length ? keys : Object.keys(window.SUBJECTS).slice(0, 3);
      const per = Math.max(2, Math.ceil((length - picked.length) / use.length));
      for (let i = 0; i < use.length; i++) {
        const bank = shuf(await fetchBank(grade, use[i]));
        bank.slice(0, per).forEach(function (q) { picked.push(prepareQuestion(q, use[i])); });
      }
      if (!picked.length) throw new Error("Play a quiz first so the coach can pick your weak spots.");
      return shuf(picked).slice(0, length);
    }
    const bank = shuf(await fetchBank(grade, subject));
    return bank.slice(0, Math.min(length, bank.length)).map(function (q) {
      return prepareQuestion(q, subject);
    });
  }

  const MUSIC_VOL = 0.04;

  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    if (settings.music) startMusic();
    unlockSpeech();
  }
  function setMusicGain(v, t) {
    if (!music || !audioCtx) return;
    music.master.gain.cancelScheduledValues(audioCtx.currentTime);
    music.master.gain.setTargetAtTime(v, audioCtx.currentTime, t || 0.25);
  }
  function duckMusic(on) {
    if (!settings.music || !music) return;
    setMusicGain(on ? 0.01 : (document.hidden ? 0 : MUSIC_VOL), 0.18);
  }
  function startMusic() {
    if (!settings.music || !audioCtx) return;
    if (music) {
      if (!document.hidden) setMusicGain(MUSIC_VOL, 0.5);
      return;
    }
    const master = audioCtx.createGain();
    master.gain.value = 0;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1550;
    filter.Q.value = 0.65;
    const delay = audioCtx.createDelay();
    delay.delayTime.value = 0.32;
    const fb = audioCtx.createGain();
    fb.gain.value = 0.2;
    filter.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(master);
    filter.connect(master);
    master.connect(audioCtx.destination);

    function padOsc(freq, type, gain) {
      const o = audioCtx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.value = gain;
      o.connect(g); g.connect(filter);
      o.start();
      return o;
    }
    const pads = [
      padOsc(130.81, "sine", 0.2),
      padOsc(196.00, "sine", 0.11),
      padOsc(164.81, "triangle", 0.05)
    ];

    const melody = [
      261.63, 329.63, 392.00, 329.63,
      440.00, 392.00, 329.63, 293.66,
      261.63, 293.66, 329.63, 392.00,
      329.63, 293.66, 261.63, 0,
      392.00, 440.00, 523.25, 440.00,
      392.00, 329.63, 349.23, 329.63,
      261.63, 329.63, 293.66, 246.94,
      261.63, 0, 196.00, 261.63
    ];
    let step = 0;
    let nextT = audioCtx.currentTime + 0.08;
    const beat = 0.48;

    function pluck(time, freq) {
      if (!freq) return;
      const o = audioCtx.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(freq, time);
      o.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 0.985), time + 0.45);
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.16, time + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.75);
      o.connect(g); g.connect(filter);
      o.start(time);
      o.stop(time + 0.78);
    }

    function schedule() {
      if (!music) return;
      const horizon = audioCtx.currentTime + 1.5;
      while (nextT < horizon) {
        pluck(nextT, melody[step % melody.length]);
        if (step % 8 === 0) pluck(nextT, 196.00);
        nextT += beat;
        step += 1;
      }
      music.timer = setTimeout(schedule, 380);
    }

    music = { master: master, pads: pads, timer: null };
    master.gain.linearRampToValueAtTime(MUSIC_VOL, audioCtx.currentTime + 2.4);
    schedule();
  }
  function stopMusic() {
    if (!music) return;
    clearTimeout(music.timer);
    const m = music;
    music = null;
    if (!audioCtx) return;
    m.master.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.18);
    setTimeout(function () {
      m.pads.forEach(function (p) { try { p.stop(); } catch (e) {} });
      try { m.master.disconnect(); } catch (e) {}
    }, 700);
  }

  function tone(freq, dur, type, gain) {
    if (!settings.sound || !audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain || 0.07, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  }
  function playCorrect() {
    tone(523.25, 0.12, "triangle", 0.06);
    setTimeout(function () { tone(659.25, 0.12, "triangle", 0.06); }, 90);
    setTimeout(function () { tone(783.99, 0.18, "triangle", 0.07); }, 180);
  }
  function playWrong() { tone(196, 0.22, "square", 0.04); }

  function ttsVoices() {
    try { return window.speechSynthesis.getVoices() || []; } catch (e) { return []; }
  }
  function pickVoice() {
    const voices = ttsVoices();
    if (!voices.length) return null;
    let best = null, score = -1;
    voices.forEach(function (v) {
      const lang = (v.lang || "").toLowerCase();
      const name = (v.name || "").toLowerCase();
      let n = 0;
      if (lang.indexOf("en-ng") === 0) n = 100;
      else if (lang.indexOf("en-gb") === 0 || name.indexOf("uk ") >= 0 || name.indexOf("british") >= 0) n = 90;
      else if (lang.indexOf("en-au") === 0) n = 80;
      else if (lang.indexOf("en-us") === 0) n = 70;
      else if (lang.indexOf("en") === 0) n = 50;
      if (name.indexOf("female") >= 0 || name.indexOf("samantha") >= 0 || name.indexOf("zira") >= 0) n += 3;
      if (n > score) { score = n; best = v; }
    });
    return score > 0 ? best : voices[0];
  }
  function unlockSpeech() {
    if (!window.speechSynthesis) return;
    try {
      ttsVoices();
      if (speechSynthesis.paused) speechSynthesis.resume();
    } catch (e) {}
  }
  function stopTtsWatch() {
    clearInterval(ttsWatch);
    ttsWatch = null;
  }
  function startTtsWatch() {
    stopTtsWatch();
    ttsWatch = setInterval(function () {
      if (!window.speechSynthesis) { stopTtsWatch(); return; }
      if (speechSynthesis.speaking && speechSynthesis.paused) speechSynthesis.resume();
      if (!speechSynthesis.speaking && !speechSynthesis.pending) stopTtsWatch();
    }, 3500);
  }
  function cleanSpeech(s) {
    return String(s || "")
      .replace(/&amp;/g, " and ")
      .replace(/[–—]/g, ", ")
      .replace(/×|✕|⋅/g, " times ")
      .replace(/÷/g, " divided by ")
      .replace(/−/g, " minus ")
      .replace(/(^|[\s(])\+(?=\s|\d)/g, "$1 plus ")
      .replace(/=/g, " equals ")
      .replace(/%/g, " percent ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function quizSpeechParts(full) {
    const q = state.questions[state.index];
    if (!q) return [];
    const total = state.questions.length;
    const hide = state.hidden[state.index] || [];
    const exam = state.mode === "exam";
    const parts = [];
    parts.push("Question " + (state.index + 1) + " of " + total + ".");
    parts.push(subjectName(q.subject || state.subject) + ".");
    if (state.mode === "timed" && state.timer) parts.push(state.timer + " seconds left.");
    const stem = cleanSpeech(q.q);
    parts.push(/[?!.]$/.test(stem) ? stem : stem + "?");
    const shown = [];
    q.options.forEach(function (o, i) {
      if (hide.indexOf(i) < 0) shown.push({ i: i, t: cleanSpeech(o) });
    });
    if (shown.length) {
      parts.push("The choices on the screen are.");
      shown.forEach(function (o) {
        parts.push("Option " + LETTERS[o.i] + ": " + o.t + ".");
      });
    }
    if (exam && state.picked[state.index] != null && state.picked[state.index] >= 0) {
      parts.push("You have selected option " + LETTERS[state.picked[state.index]] + ".");
    }
    if (state.revealed && !exam) {
      const pick = state.picked[state.index];
      const ok = pick === q.answer;
      if (ok) parts.push("Yes, that is correct.");
      else {
        if (pick == null || pick < 0) parts.push("Not quite. No answer was chosen.");
        else parts.push("Not quite. You chose option " + LETTERS[pick] + ", " + cleanSpeech(q.options[pick]) + ".");
        parts.push("The correct answer is option " + LETTERS[q.answer] + ", " + cleanSpeech(q.options[q.answer]) + ".");
      }
      if (q.explain) parts.push(cleanSpeech(q.explain));
      if (full) {
        parts.push(state.index < total - 1 ? "Tap next for the next question." : "Tap see my score.");
      }
    } else if (full && !exam) {
      parts.push("Tap A, B, C or D to answer.");
    }
    return parts.filter(function (p) { return p && p.length > 1; });
  }
  function resultSpeechParts() {
    const total = state.questions.length;
    const n = score();
    const pct = Math.round((n / Math.max(1, total)) * 100);
    const parts = [
      (state.name || "Well done") + ".",
      window.GRADE_INFO[state.grade] ? window.GRADE_INFO[state.grade].label + "." : "",
      subjectName(state.subject) + ".",
      "You scored " + n + " out of " + total + ", " + pct + " percent.",
      starsFor(pct) + " star" + (starsFor(pct) === 1 ? "" : "s") + ".",
      "You earned " + state.xpGained + " XP. Total " + progress.xp + " XP.",
      messageFor(pct)
    ];
    if (state.rankedUp) parts.push("New rank: " + state.rankedUp.name + ".");
    return parts.filter(Boolean);
  }
  function speak(text, force) {
    speakParts([cleanSpeech(text)], force);
  }
  function speakParts(parts, force) {
    if (!force && !settings.tts) return;
    const list = (parts || []).map(function (p) { return cleanSpeech(p); }).filter(Boolean);
    if (!list.length) return;
    if (!window.speechSynthesis) {
      if (force) toast("This browser cannot read aloud. Try Chrome, Edge or Safari.");
      return;
    }
    unlockSpeech();
    speakGen += 1;
    const gen = speakGen;
    clearTimeout(speakTimer);
    try { speechSynthesis.cancel(); } catch (e) {}
    let i = 0;
    const go = function () {
      if (gen !== speakGen) return;
      if (i >= list.length) {
        duckMusic(false);
        stopTtsWatch();
        return;
      }
      try { if (speechSynthesis.paused) speechSynthesis.resume(); } catch (e) {}
      const u = new SpeechSynthesisUtterance(list[i]);
      i += 1;
      const v = pickVoice();
      if (v) {
        u.voice = v;
        u.lang = v.lang || "en-GB";
      } else {
        u.lang = "en-GB";
      }
      u.rate = 0.88;
      u.pitch = 1.02;
      u.volume = 1;
      u.onend = function () { go(); };
      u.onerror = function () { if (gen === speakGen) go(); };
      try {
        if (i === 1) duckMusic(true);
        speechSynthesis.speak(u);
        startTtsWatch();
      } catch (err) {
        duckMusic(false);
        if (force) toast("Could not start read aloud. Tap 🔊 again.");
      }
    };
    if (force) go();
    else speakTimer = setTimeout(go, 80);
  }
  function speakScreen(force) {
    if (state.screen === "quiz") speakParts(quizSpeechParts(!!force), force);
    else if (state.screen === "result") speakParts(resultSpeechParts(), true);
    else if (force) toast("Open a question, then tap Read aloud.");
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
    if (key === "daily") return "Daily Challenge";
    if (key === "missed") return "Missed questions";
    if (key === "smart") return "Smart Practice";
    return window.SUBJECTS[key] ? window.SUBJECTS[key].name : key;
  }
  function iconFor(key) {
    if (key === "mix" || key === "daily") return "🏆";
    if (key === "missed") return "🎯";
    return window.SUBJECTS[key] ? window.SUBJECTS[key].icon : "⭐";
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
  function secondsFor() {
    return state.grade && state.grade <= 2 ? 45 : 30;
  }

  function toast(msg) {
    state.toast = msg;
    const el = document.getElementById("toast");
    if (el) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      render();
    }
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      state.toast = "";
      const t = document.getElementById("toast");
      if (t) t.hidden = true;
    }, 2800);
  }

  function awardBadge(id) {
    if (progress.badges.indexOf(id) >= 0) return;
    progress.badges.push(id);
    const b = window.BADGES.find(function (x) { return x.id === id; });
    state.newBadges.push(id);
    if (b) toast(b.icon + " Badge unlocked: " + b.name);
  }

  function updateStreak() {
    const day = todayKey();
    if (progress.lastDay === day) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yk = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
    progress.streak = progress.lastDay === yk ? progress.streak + 1 : 1;
    progress.lastDay = day;
    if (!progress.days) progress.days = {};
    progress.days[day] = 1;
    if (progress.streak >= 3) awardBadge("streak3");
    if (progress.streak >= 7) awardBadge("streak7");
  }

  function recordResult() {
    const total = state.questions.length;
    const n = score();
    const pct = Math.round((n / total) * 100);
    let xp = n * 10 + state.maxCombo * 2;
    if (pct === 100) xp += 40;
    if (state.daily) xp += 25;
    if (state.mode === "timed") xp += 10;
    if (state.mode === "exam") xp += 15;
    if (state.subject === "smart") xp += 20;
    const prevRank = rankFor(progress.xp);
    progress.xp += xp;
    progress.quizzes += 1;
    ensureWeek();
    progress.weekQuizzes = (progress.weekQuizzes || 0) + 1;
    updateStreak();
    const newRank = rankFor(progress.xp);
    state.rankedUp = newRank.id !== prevRank.id ? newRank : null;
    if (state.rankedUp) progress.lastRank = newRank.id;
    const key = state.grade + "/" + state.subject;
    const prev = progress.best[key];
    if (!prev || pct > prev.pct) progress.best[key] = { pct: pct, score: n, total: total };
    progress.history.unshift({
      date: todayKey(), grade: state.grade, subject: state.subject,
      score: n, total: total, mode: state.mode, pct: pct
    });
    progress.history = progress.history.slice(0, 80);

    const missed = progress.missed[state.grade] || [];
    state.questions.forEach(function (q, i) {
      if (state.picked[i] !== q.answer) {
        missed.push({ q: q.q, options: q.options, answer: q.answer, explain: q.explain, subject: q.subject });
      }
    });
    progress.missed[state.grade] = missed.slice(-80);

    awardBadge("first");
    if (pct === 100) awardBadge("perfect");
    if (total >= 100) awardBadge("hundred");
    if (state.mode === "exam") awardBadge("exam");
    if (state.mode === "timed" && pct >= 70) awardBadge("speed");
    if (state.daily && n >= 8) {
      awardBadge("daily");
      progress.dailyDate = todayKey();
      progress.dailyBest = Math.max(progress.dailyBest || 0, n);
    }
    if (progress.xp >= 500) awardBadge("scholar");
    if (progress.xp >= 1500) awardBadge("champion");
    state.xpGained = xp;
    saveProgress();
    localStorage.removeItem(resumeKey());
  }

  function saveResume() {
    if (state.screen !== "quiz" || !state.questions.length) return;
    localStorage.setItem(resumeKey(), JSON.stringify({
      name: state.name, grade: state.grade, subject: state.subject, length: state.length,
      mode: state.mode, questions: state.questions, index: state.index, picked: state.picked,
      combo: state.combo, maxCombo: state.maxCombo, used5050: state.used5050,
      usedSkip: state.usedSkip, daily: state.daily, hidden: state.hidden
    }));
  }

  function topbar(backScreen) {
    const left = backScreen
      ? `<button class="icon-btn" data-go="${backScreen}" aria-label="Back">←</button>`
      : `<div class="brand"><img src="images/mascot.png" alt=""> Super Quiz</div>`;
    return `
      <div class="topbar no-print">
        ${left}
        <div class="ghost-row">
          ${state.user && state.user.picture
            ? `<button class="avatar-btn" data-go="account" title="${esc(state.user.name)}" aria-label="Account"><img referrerpolicy="no-referrer" src="${esc(state.user.picture)}" alt=""></button>`
            : `<button class="icon-btn" data-go="account" title="Sign in" aria-label="Account">👤</button>`}
          <button class="icon-btn" data-go="dashboard" title="Progress" aria-label="Progress">📊</button>
          <button class="icon-btn" data-go="settings" title="Settings" aria-label="Settings">⚙️</button>
          <button class="icon-btn ${settings.music ? "" : "off"}" data-action="toggle-music" title="Music" aria-label="Music" aria-pressed="${settings.music}">🎵</button>
          <button class="icon-btn" data-action="toggle-sound" aria-label="Sound">${settings.sound ? "🔊" : "🔇"}</button>
        </div>
      </div>`;
  }

  function toastEl() {
    return `<div class="toast" id="toast" ${state.toast ? "" : "hidden"}>${esc(state.toast)}</div>`;
  }

  const YES_LINES = ["Yes!", "Brilliant!", "You got it!", "Well done!", "Champion!", "Super star!"];
  const NO_LINES = ["Oops!", "Almost!", "Keep going!", "Nice try!", "Next one!"];

  function showReact(ok, timedOut) {
    const title = timedOut
      ? "Time’s up!"
      : (ok ? YES_LINES[Math.floor(Math.random() * YES_LINES.length)]
            : NO_LINES[Math.floor(Math.random() * NO_LINES.length)]);
    state.react = {
      ok: !!ok,
      title: title,
      sub: ok ? "That’s the right answer." : (timedOut ? "Try the next question." : "Look at the green answer.")
    };
    clearTimeout(reactTimer);
    reactTimer = setTimeout(hideReact, ok ? 1700 : 1900);
  }
  function hideReact() {
    clearTimeout(reactTimer);
    if (!state.react) return;
    state.react = null;
    const el = document.getElementById("react-pop");
    if (el) el.remove();
  }
  function reactPopup() {
    const r = state.react;
    if (!r) return "";
    const img = r.ok ? "images/owl-yes.jpg" : "images/owl-no.jpg";
    return `
      <div class="react-pop ${r.ok ? "yes" : "no"}" id="react-pop" data-action="dismiss-react" role="dialog" aria-live="polite">
        <div class="react-card">
          <img src="${img}" alt="">
          <h3>${esc(r.title)}</h3>
          <p>${esc(r.sub)}</p>
          <span>Tap to continue</span>
        </div>
      </div>`;
  }
  function siteFooter() {
    return `<p class="site-foot">© merebari web 2026</p>`;
  }
  function googleAuthBlock() {
    if (state.user) {
      return `
        <div class="signed-box">
          <img class="signed-pic" referrerpolicy="no-referrer" src="${esc(state.user.picture || "images/icon-192.png")}" alt="">
          <div>
            <strong>Hi, ${esc(state.user.name)}</strong>
            <p class="sub" style="margin:0">${esc(state.user.email || "Signed in with Google")}</p>
          </div>
          <button class="btn btn-ghost" data-action="signout">Sign out</button>
        </div>`;
    }
    return `
      <p class="field">Sign in with Google</p>
      <div id="google-btn" class="google-slot"></div>
      ${googleClientId() ? "" : `<button class="google-fake" data-action="need-google" type="button">
        <span class="g-icon" aria-hidden="true"></span> Sign in with Google
      </button>
      <p class="sub" style="margin:8px 0 0">A teacher pastes a Google Client ID in Settings once. Younger pupils can skip this.</p>`}
      <div class="or-line"><span>or play as guest</span></div>`;
  }
  function rankCard() {
    ensureWeek();
    const r = rankFor(progress.xp);
    const nxt = nextRank(progress.xp);
    const span = nxt ? Math.max(1, nxt.min - r.min) : 1;
    const pct = nxt ? Math.min(100, Math.round(((progress.xp - r.min) / span) * 100)) : 100;
    return `
      <div class="rank-card">
        <div class="rank-ico" aria-hidden="true">${r.icon}</div>
        <div>
          <p class="kicker" style="margin:0">${esc(r.name)}</p>
          <strong>${progress.xp} XP</strong>
          <p class="sub" style="margin:4px 0 8px">${nxt ? (nxt.min - progress.xp) + " XP to " + nxt.name : "Max rank unlocked."}</p>
          <div class="xp-track" aria-label="Rank progress"><i style="width:${pct}%"></i></div>
        </div>
      </div>`;
  }
  function weekCard() {
    ensureWeek();
    const goal = window.WEEK_GOAL || 5;
    const n = progress.weekQuizzes || 0;
    const pct = Math.min(100, Math.round((n / goal) * 100));
    return `
      <div class="week-card">
        <div class="week-top">
          <strong>This week</strong>
          <span>${n} / ${goal} quizzes</span>
        </div>
        <div class="xp-track week"><i style="width:${pct}%"></i></div>
      </div>`;
  }
  function onboardEl() {
    if (localStorage.getItem("psq-onboard-v1")) return "";
    const steps = [
      { title: "Hello, champion!", body: "9,600 questions for Nigerian Primary 1–6. Earn XP, climb ranks and collect badges.", img: "images/mascot.png" },
      { title: "How to play", body: "Practice for instant help. Exam is like a real test. Timed makes you think fast. Tap 🔊 Read aloud any time.", img: "images/owl-yes.jpg" },
      { title: "You’re ready", body: "Type your name to start. Teachers can print papers and a progress report. Younger pupils can play as guests.", img: "images/trophy.png" }
    ];
    const i = state.onboardStep || 0;
    const s = steps[i];
    return `
      <div class="onboard" role="dialog" aria-modal="true" aria-label="Welcome">
        <div class="onboard-card">
          <img src="${s.img}" alt="">
          <h2>${s.title}</h2>
          <p>${s.body}</p>
          <div class="onboard-dots">${steps.map(function (_, n) { return `<i class="${n === i ? "on" : ""}"></i>`; }).join("")}</div>
          <div class="home-actions">
            ${i < steps.length - 1
              ? `<button class="btn btn-primary" data-action="onboard-next">Next</button>
                 <button class="btn btn-ghost" data-action="onboard-skip">Skip</button>`
              : `<button class="btn btn-primary" data-action="onboard-skip">Let’s learn!</button>`}
          </div>
        </div>
      </div>`;
  }

  function renderHome() {
    const resume = loadJSON(resumeKey(), null);
    const nSub = Object.keys(window.SUBJECTS).length;
    const cont = resume && resume.questions && resume.questions.length
      ? `<div class="continue-banner">
           <div><strong>Continue quiz</strong><p>${esc(subjectName(resume.subject))} · Q${(resume.index || 0) + 1}/${resume.questions.length}</p></div>
           <button class="btn btn-sun" data-action="resume">Resume</button>
         </div>` : "";
    return `
      <div class="wrap">
        ${topbar(null)}
        ${onboardEl()}
        ${cont}
        <section class="hero">
          <div>
            <div class="kicker">Primary 1 – 6 · Nigeria · Offline ready</div>
            <h1>Primary Super Quiz</h1>
            <p class="lead">Every class, every subject — 100 questions each. Practice, sit a timed paper, or take the Daily Challenge.</p>
            <div class="stats">
              <span class="chip">${nSub} subjects</span>
              <span class="chip">9,600 questions</span>
              <span class="chip">Exam · Timed · Daily</span>
              <span class="chip">Installable app</span>
            </div>
          </div>
          <div class="hero-art"><img src="images/hero-kids.jpg" alt="Children taking a quiz together"></div>
        </section>
        <div class="home-grid">
          ${rankCard()}
          ${weekCard()}
        </div>
        <div class="home-stats">
          <div class="stat-tile"><b>${progress.xp}</b><span>XP</span></div>
          <div class="stat-tile"><b>${progress.streak}🔥</b><span>Day streak</span></div>
          <div class="stat-tile"><b>${progress.quizzes}</b><span>Quizzes</span></div>
        </div>
        ${streakDots()}
        <div class="play-row">
          <button class="play-tile daily" data-action="daily">
            <span>☀️</span>
            <strong>Daily Challenge</strong>
            <p>${progress.dailyDate === todayKey() ? "Done today — play again?" : "10 fresh mixed questions"}</p>
          </button>
          <button class="play-tile smart" data-action="smart">
            <span>🧠</span>
            <strong>Smart Practice</strong>
            <p>Coach picks your weak spots</p>
          </button>
        </div>
        <div class="home-panel panel-rel" style="margin-top:18px;background:var(--card);border:3px solid var(--line);border-radius:28px;padding:22px;box-shadow:var(--shadow);">
          <img class="mascot-float" src="images/mascot.png" alt="">
          ${googleAuthBlock()}
          ${state.user ? "" : `
            <label class="field" for="pupil-name">What is your name?</label>
            <input id="pupil-name" type="text" maxlength="40" placeholder="Type your name" value="${esc(state.name)}" autocomplete="name">
          `}
          <div class="home-actions">
            <button class="btn btn-primary" data-action="start">Let’s go! →</button>
            <button class="btn btn-ghost" data-go="dashboard">My progress</button>
          </div>
        </div>
        ${siteFooter()}
        ${toastEl()}
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
        <p class="kicker">Hello, ${esc(state.name || "friend")} · ${progress.xp} XP</p>
        <h2 class="section-title">Which class are you in?</h2>
        <p class="sub">Pick your class. Questions get harder from Primary 1 to Primary 6.</p>
        <div class="grid-grades">${cards}</div>
        ${toastEl()}
      </div>`;
  }

  function renderSubjects() {
    const g = state.grade;
    const q = (state.query || "").toLowerCase();
    const chips = window.SUBJECT_GROUPS.map(function (gr) {
      return `<button class="filter-chip ${state.group === gr.id ? "on" : ""}" data-group="${gr.id}">${gr.label}</button>`;
    }).join("");
    const cards = Object.keys(window.SUBJECTS).filter(function (k) {
      const s = window.SUBJECTS[k];
      if (state.group !== "all" && s.group !== state.group) return false;
      if (q && (s.name + s.short).toLowerCase().indexOf(q) < 0) return false;
      return true;
    }).map(function (k) {
      const s = window.SUBJECTS[k];
      const best = progress.best[g + "/" + k];
      const star = best ? "★".repeat(starsFor(best.pct)) + "☆".repeat(3 - starsFor(best.pct)) : "☆☆☆";
      return `
        <button class="card-btn subject-card" style="--accent:hsl(${s.hue},55%,38%)" data-pick-subject="${k}">
          <div class="subj-icon">${s.icon}</div>
          <h3>${s.name}</h3>
          <p>100 questions · <span class="stars-mini">${star}</span>${best ? " " + best.pct + "%" : ""}</p>
        </button>`;
    }).join("");
    const missedN = (progress.missed[g] || []).length;
    return `
      <div class="wrap">
        ${topbar("grade")}
        <p class="kicker">${window.GRADE_INFO[g].label}</p>
        <h2 class="section-title">Choose a subject</h2>
        <input class="search" id="subj-search" type="search" placeholder="Search subjects…" value="${esc(state.query)}">
        <div class="filter-row">${chips}</div>
        <div class="grid-subjects">
          ${cards || "<p class='sub'>No subjects match.</p>"}
          <button class="card-btn mix-card" data-pick-subject="mix">
            <div><h3>Champion Mix 🏆</h3><p>A mixed paper from every subject in this class.</p></div>
            <span class="btn btn-sun" style="pointer-events:none">Play mix</span>
          </button>
          <button class="card-btn smart-card" data-pick-subject="smart">
            <div><h3>Smart Practice 🧠</h3><p>Missed questions plus your weakest subjects.</p></div>
            <span class="btn btn-primary" style="pointer-events:none">Coach pick</span>
          </button>
        </div>
        <div class="teacher-row no-print">
          <div>
            <strong>Practice missed · Teachers</strong>
            <p class="sub" style="margin:0">${missedN} saved mistakes for this class. Print an 80-question paper with answers.</p>
          </div>
          <div class="ghost-row">
            <button class="btn btn-ghost" data-pick-subject="missed" ${missedN ? "" : "disabled"}>Retry missed</button>
            <button class="btn btn-ghost" data-action="print-exam">Print exam</button>
          </div>
        </div>
        ${toastEl()}
      </div>`;
  }

  function renderLength() {
    const name = subjectName(state.subject);
    const buttons = window.QUIZ_LENGTHS.map(function (n) {
      const label = n === 10 ? "Quick" : n === 20 ? "Standard" : n === 50 ? "Long" : "Full paper";
      const cls = "btn length-btn " + (state.length === n ? "btn-primary" : "btn-ghost");
      return `<button class="${cls}" data-length="${n}"><strong>${n}</strong><span>${label}</span></button>`;
    }).join("");
    const modes = [
      { id: "practice", title: "Practice", desc: "Instant marking and a short explanation." },
      { id: "exam", title: "Exam", desc: "No hints until the end. Like a real test." },
      { id: "timed", title: "Timed", desc: secondsFor() + " seconds per question. Think fast." }
    ].map(function (m) {
      return `<button class="mode-card ${state.mode === m.id ? "on" : ""}" data-mode="${m.id}"><h4>${m.title}</h4><p>${m.desc}</p></button>`;
    }).join("");
    return `
      <div class="wrap">
        ${topbar("subject")}
        <p class="kicker">${window.GRADE_INFO[state.grade].label} · ${esc(name)}</p>
        <h2 class="section-title">Set up your quiz</h2>
        <p class="sub">Choose a mode, then how many questions.</p>
        <div class="mode-grid">${modes}</div>
        <div class="length-grid">${buttons}</div>
        <div style="margin-top:16px">
          <button class="btn btn-primary" data-action="begin">${state.loading ? "Loading…" : "Start quiz →"}</button>
        </div>
        ${state.error ? `<p class="feedback no" style="margin-top:12px">${esc(state.error)}</p>` : ""}
        ${toastEl()}
      </div>`;
  }

  function renderQuiz() {
    const q = state.questions[state.index];
    if (!q) return `<div class="wrap">${topbar("length")}<p>No questions.</p></div>`;
    const total = state.questions.length;
    const pct = Math.round((state.index / total) * 100);
    const subj = window.SUBJECTS[q.subject] || window.SUBJECTS[state.subject];
    const hide = state.hidden[state.index] || [];
    const exam = state.mode === "exam";
    const showMark = state.revealed && !exam;
    const options = q.options.map(function (opt, i) {
      if (hide.indexOf(i) >= 0) return "";
      let cls = "opt";
      if (showMark) {
        if (i === q.answer) cls += " correct";
        else if (i === state.picked[state.index]) cls += " wrong";
        else cls += " dim";
      } else if (exam && state.picked[state.index] === i) cls += " correct";
      return `
        <button class="${cls}" data-opt="${i}" ${state.revealed && !exam ? "disabled" : ""}>
          <span class="badge">${LETTERS[i]}</span>
          <span>${esc(opt)}</span>
        </button>`;
    }).join("");
    let feedback = "";
    if (showMark) {
      const ok = state.picked[state.index] === q.answer;
      feedback = `<div class="feedback ${ok ? "ok" : "no"}">${ok ? "Yes! " : "Not quite. The answer is <strong>" + esc(q.options[q.answer]) + "</strong>. "}${esc(q.explain)}</div>`;
    }
    const canNext = exam ? state.picked[state.index] != null || state.revealed : state.revealed;
    const nextLabel = state.index === total - 1 ? "See my score" : "Next →";
    const timer = state.mode === "timed"
      ? `<div class="timer-wrap ${state.timer <= 8 ? "warn" : ""}">⏱ ${state.timer}s</div>` : "";
    return `
      <div class="wrap">
        ${topbar("length")}
        <div class="quiz-head">
          <div class="progress-meta">${iconFor(q.subject || state.subject)} ${esc(subj ? subj.name : subjectName(state.subject))} · P${state.grade}</div>
          <div class="ghost-row">
            ${state.combo >= 2 ? `<span class="combo">🔥 x${state.combo}</span>` : ""}
            ${timer}
            <div class="progress-meta">${state.index + 1} / ${total}</div>
          </div>
        </div>
        <div class="bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
        <div class="q-card">
          <div class="q-label">Question ${state.index + 1} · ${state.mode}</div>
          <h2 class="question">${esc(q.q)}</h2>
          <div class="options">${options}</div>
          ${feedback}
          <div class="lifelines">
            <button class="life life-speak" data-action="speak">🔊 Read aloud</button>
            <button class="life" data-action="fifty" ${state.used5050 || exam ? "disabled" : ""}>50 / 50</button>
            <button class="life" data-action="skip" ${state.usedSkip ? "disabled" : ""}>Skip</button>
          </div>
          <div class="quiz-actions">
            ${canNext ? `<button class="btn btn-primary" data-action="next">${nextLabel}</button>` : ""}
            <button class="btn btn-ghost" data-go="subject">Quit</button>
          </div>
          <p class="key-hint no-print">Tip: press A, B, C or D · 🔊 reads the question</p>
        </div>
        ${reactPopup()}
        ${toastEl()}
      </div>`;
  }

  function renderResult() {
    const total = state.questions.length;
    const n = score();
    const pct = Math.round((n / total) * 100);
    const stars = starsFor(pct);
    const img = pct >= 70
      ? '<img class="trophy" src="images/trophy.png" alt="Trophy">'
      : '<img class="stars" src="images/stars.png" alt="Stars">';
    const badges = state.newBadges.map(function (id) {
      const b = window.BADGES.find(function (x) { return x.id === id; });
      return b ? `<span class="chip">${b.icon} ${b.name}</span>` : "";
    }).join("");
    return `
      <div class="wrap">
        ${topbar("subject")}
        <div class="result">
          ${img}
          <p class="kicker">${window.GRADE_INFO[state.grade].label} · ${esc(subjectName(state.subject))} · ${state.mode}</p>
          <h2 class="section-title">${esc(state.name || "Well done")}</h2>
          <div class="score-num">${n}<span style="font-size:.45em;color:var(--muted)"> / ${total}</span></div>
          <p style="font-weight:800;margin-top:4px">${pct}% · ${stars} star${stars === 1 ? "" : "s"} · Best combo x${state.maxCombo}</p>
          <p class="xp-pop">+${state.xpGained} XP · Total ${progress.xp}</p>
          ${state.rankedUp ? `<div class="rank-up">${state.rankedUp.icon} New rank: <strong>${esc(state.rankedUp.name)}</strong></div>` : ""}
          <p class="score-msg">${messageFor(pct)}</p>
          ${badges ? `<div class="stats" style="justify-content:center">${badges}</div>` : ""}
          <div class="actions">
            <button class="btn btn-primary" data-action="review">Review answers</button>
            <button class="btn btn-ghost" data-action="speak">🔊 Read score</button>
            <button class="btn btn-sun" data-action="certificate">Certificate</button>
            <button class="btn btn-ghost" data-action="share">Share</button>
            <button class="btn btn-ghost" data-action="again">Play again</button>
            <button class="btn btn-ghost" data-go="subject">New subject</button>
          </div>
        </div>
        ${toastEl()}
      </div>`;
  }

  function renderReview() {
    const items = state.questions.map(function (q, i) {
      const ok = state.picked[i] === q.answer;
      const chosen = state.picked[i] == null ? "—" : q.options[state.picked[i]];
      return `
        <article class="review-item">
          <span class="tag ${ok ? "ok" : "no"}">${ok ? "Correct" : "Missed"}</span>
          <h4>${i + 1}. ${esc(q.q)}</h4>
          <p>Your answer: <strong>${esc(chosen)}</strong></p>
          ${ok ? "" : `<p>Correct answer: <strong>${esc(q.options[q.answer])}</strong></p>`}
          <p style="color:var(--muted);margin-top:6px">${esc(q.explain)}</p>
        </article>`;
    }).join("");
    return `
      <div class="wrap">
        ${topbar("result")}
        <h2 class="section-title">Answer review</h2>
        <p class="sub">Read why each answer is right, then try again.</p>
        ${items}
        <div class="actions" style="margin-top:8px">
          <button class="btn btn-primary" data-go="result">Back to score</button>
        </div>
      </div>`;
  }

  function todayPretty() {
    try {
      return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) { return "3 September 2026"; }
  }

  function renderCertificate() {
    const total = state.questions.length;
    const n = score();
    const pct = Math.round((n / total) * 100);
    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="result" aria-label="Back">←</button>
          <div class="ghost-row">
            <button class="btn btn-ghost" data-action="save-cert">Download PNG</button>
            <button class="btn btn-primary" data-action="print">Print</button>
          </div>
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
            <p>${todayPretty()} · ${state.xpGained} XP earned</p>
            <p style="margin-top:18px;font-weight:800;color:var(--teal)">Well done — keep learning.</p>
            <p class="cert-copy">© merebari web 2026</p>
          </div>
        </div>
      </div>`;
  }

  function renderDashboard() {
    const g = state.grade || 1;
    const cells = Object.keys(window.SUBJECTS).map(function (k) {
      const s = window.SUBJECTS[k];
      const best = progress.best[g + "/" + k];
      const st = best ? starsFor(best.pct) : 0;
      return `<div class="dash-cell" title="${s.name}"><span class="ico">${s.icon}</span>${s.short}<div class="stars-mini">${"★".repeat(st)}${"☆".repeat(3 - st)}</div></div>`;
    }).join("");
    const badges = window.BADGES.map(function (b) {
      const on = progress.badges.indexOf(b.id) >= 0;
      return `<div class="badge-card ${on ? "" : "off"}"><div class="bi">${b.icon}</div><h4>${b.name}</h4><p>${b.desc}</p></div>`;
    }).join("");
    const recent = (progress.history || []).slice(0, 8).map(function (h) {
      return `<li>${h.date} · P${h.grade} ${esc(subjectName(h.subject))} · ${h.score}/${h.total} (${h.pct}%)</li>`;
    }).join("") || "<li>No quizzes yet.</li>";
    return `
      <div class="wrap">
        ${topbar("home")}
        <p class="kicker">${esc(state.name || "Pupil")}</p>
        <h2 class="section-title">My progress</h2>
        <div class="home-stats">
          <div class="stat-tile"><b>${progress.xp}</b><span>XP</span></div>
          <div class="stat-tile"><b>${progress.streak}</b><span>Streak</span></div>
          <div class="stat-tile"><b>${progress.badges.length}/${window.BADGES.length}</b><span>Badges</span></div>
        </div>
        <p class="sub" style="margin-top:18px">Mastery for Primary ${g} (pick a class first for other years).</p>
        <div class="dash-grid">${cells}</div>
        <h3 class="section-title" style="font-size:24px;margin-top:28px">Badges</h3>
        <div class="badge-grid">${badges}</div>
        <h3 class="section-title" style="font-size:24px;margin-top:28px">Recent</h3>
        <ul class="sub">${recent}</ul>
        ${siteFooter()}
        ${toastEl()}
      </div>`;
  }

  function renderReport() {
    ensureWeek();
    const r = rankFor(progress.xp);
    const g = state.grade || 1;
    const weak = weakestList(g).slice(0, 4).map(function (k) {
      const b = progress.best[g + "/" + k];
      const s = window.SUBJECTS[k];
      return `<tr><td>${s ? s.icon + " " + s.name : k}</td><td>${b ? b.pct + "%" : "Not yet"}</td><td>${b ? b.score + "/" + b.total : "—"}</td></tr>`;
    }).join("");
    const rows = (progress.history || []).slice(0, 20).map(function (h) {
      return `<tr><td>${esc(h.date)}</td><td>P${h.grade}</td><td>${esc(subjectName(h.subject))}</td><td>${h.mode}</td><td>${h.score}/${h.total}</td><td>${h.pct}%</td></tr>`;
    }).join("") || `<tr><td colspan="6">No quizzes yet.</td></tr>`;
    const avg = (progress.history || []).length
      ? Math.round((progress.history.reduce(function (s, h) { return s + (h.pct || 0); }, 0) / progress.history.length))
      : 0;
    return `
      <div class="wrap report">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="dashboard" aria-label="Back">←</button>
          <button class="btn btn-primary" data-action="print">Print report</button>
        </div>
        <header class="exam-head">
          <h2>Primary Super Quiz — Progress report</h2>
          <p>${esc(state.name || "Pupil")} · ${esc(r.icon + " " + r.name)} · ${progress.xp} XP</p>
          <p>${todayPretty()} · © merebari web 2026</p>
        </header>
        <div class="exam-meta">
          <span>Quizzes: ${progress.quizzes}</span>
          <span>Streak: ${progress.streak} days</span>
          <span>Average: ${avg}%</span>
          <span>This week: ${progress.weekQuizzes || 0}/${window.WEEK_GOAL || 5}</span>
        </div>
        <h3 style="margin:16px 0 8px">Focus subjects (Primary ${g})</h3>
        <table class="report-table">
          <thead><tr><th>Subject</th><th>Best</th><th>Score</th></tr></thead>
          <tbody>${weak}</tbody>
        </table>
        <h3 style="margin:18px 0 8px">Recent quizzes</h3>
        <table class="report-table">
          <thead><tr><th>Date</th><th>Class</th><th>Subject</th><th>Mode</th><th>Score</th><th>%</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="sub" style="margin-top:18px">Badges: ${progress.badges.length}/${window.BADGES.length} · Keep practising a little every day.</p>
      </div>`;
  }

  function renderAccount() {
    const u = state.user;
    return `
      <div class="wrap">
        ${topbar("home")}
        <h2 class="section-title">Account</h2>
        ${u ? `
          <div class="signed-box" style="margin:16px 0">
            <img class="signed-pic" referrerpolicy="no-referrer" src="${esc(u.picture || "images/icon-192.png")}" alt="">
            <div>
              <strong>${esc(u.name)}</strong>
              <p class="sub" style="margin:0">${esc(u.email)}</p>
            </div>
          </div>
          <p class="sub">Your XP, badges and missed questions are saved for this Google account on this device.</p>
          <button class="btn btn-coral" data-action="signout">Sign out</button>
        ` : `
          <p class="sub">Sign in with Google to keep your name and progress on this device. Younger pupils can skip this and play as a guest.</p>
          <div id="google-btn" class="google-slot"></div>
          ${googleClientId() ? "" : `<button class="google-fake" data-action="need-google" type="button">
            <span class="g-icon" aria-hidden="true"></span> Sign in with Google
          </button>`}
          <p class="sub" style="margin-top:16px">No Google account? Go back and type a name.</p>
        `}
        ${siteFooter()}
        ${toastEl()}
      </div>`;
  }

  function renderSettings() {
    function row(key, label) {
      return `<div class="set-row"><span>${label}</span><button class="toggle ${settings[key] ? "on" : ""}" data-toggle="${key}" aria-pressed="${settings[key]}"><i></i></button></div>`;
    }
    const cid = googleClientId();
    return `
      <div class="wrap">
        ${topbar("home")}
        <h2 class="section-title">Settings</h2>
        <p class="sub">These stay on this device.</p>
        <div class="settings-list">
          ${row("sound", "Sound effects")}
          ${row("music", "Soft background music")}
          ${row("tts", "Auto-read each question")}
          ${row("dark", "Dark mode")}
          ${row("large", "Larger text")}
        </div>
        <h3 class="section-title" style="font-size:24px;margin-top:28px">Google Sign-In</h3>
        <p class="sub">Teachers: create an OAuth Client ID, then paste it here. Origins to allow: <code>https://merebari7-web.github.io</code> and <code>http://localhost:8080</code>.</p>
        <label class="field" for="cid">Google Client ID</label>
        <input id="cid" class="search" type="text" placeholder="123456789-abc.apps.googleusercontent.com" value="${esc(cid)}">
        <button class="btn btn-primary" data-action="save-cid" style="margin-top:8px">Save Client ID</button>
        <p class="sub" style="margin-top:22px">Install this quiz on your phone from the browser menu → Add to Home Screen. It works offline after the first visit.</p>
        <button class="btn btn-ghost" data-action="reset-progress">Reset progress</button>
        ${siteFooter()}
        ${toastEl()}
      </div>`;
  }

  function renderExam() {
    const paper = state.examPaper;
    if (!paper) {
      return `<div class="wrap">${topbar("subject")}<p class="sub">${state.loading ? "Preparing the exam paper…" : esc(state.error || "No paper loaded.")}</p></div>`;
    }
    const g = state.grade;
    let body = "", key = "", total = 0;
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
    return `
      <div class="wrap exam">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="subject" aria-label="Back">←</button>
          <button class="btn btn-primary" data-action="print">Print paper</button>
        </div>
        <header class="exam-head">
          <h2>Primary Super Quiz — Examination Paper</h2>
          <p>${window.GRADE_INFO[g].label}</p>
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
        <p class="site-foot">© merebari web 2026</p>
      </div>`;
  }

  function stopTick() { clearInterval(tickTimer); tickTimer = null; }

  function startTick() {
    stopTick();
    if (state.mode !== "timed" || state.screen !== "quiz") return;
    state.timer = secondsFor();
    tickTimer = setInterval(function () {
      state.timer -= 1;
      const el = document.querySelector(".timer-wrap");
      if (el) {
        el.textContent = "⏱ " + state.timer + "s";
        el.classList.toggle("warn", state.timer <= 8);
      }
      if (state.timer <= 0) {
        stopTick();
        if (!state.revealed) {
          if (state.picked[state.index] == null) state.picked[state.index] = -1;
          state.revealed = true;
          state.combo = 0;
          playWrong();
          if (state.mode === "timed") {
            showReact(false, true);
            render();
            reactTimer = setTimeout(function () { goNext(true); }, 1400);
            return;
          }
        }
        render();
      }
    }, 1000);
  }

  function render() {
    const map = {
      home: renderHome, grade: renderGrades, subject: renderSubjects, length: renderLength,
      quiz: renderQuiz, result: renderResult, review: renderReview, certificate: renderCertificate,
      exam: renderExam, dashboard: renderDashboard, settings: renderSettings, account: renderAccount, report: renderReport
    };
    app.innerHTML = (map[state.screen] || renderHome)();
    if (state.screen === "home" || state.screen === "account") mountGoogleButton();
    if (state.screen === "home") {
      const input = document.getElementById("pupil-name");
      if (input) {
        input.addEventListener("input", function () { state.name = input.value; });
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") startFromHome(); });
      }
    }
    if (state.screen === "subject") {
      const s = document.getElementById("subj-search");
      if (s) {
        s.addEventListener("input", function () {
          state.query = s.value;
          const sel = s.selectionStart;
          render();
          const n = document.getElementById("subj-search");
          if (n) { n.focus(); n.setSelectionRange(sel, sel); }
        });
      }
    }
    if (state.screen === "quiz") {
      startTick();
      if (settings.tts) {
        const q = state.questions[state.index];
        if (q && !state.revealed && state.spokenFor !== state.index) {
          state.spokenFor = state.index;
          speakParts(quizSpeechParts(false), false);
        }
      }
    } else {
      stopTick();
      stopTtsWatch();
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
    }
    if (state.screen === "result") {
      const pct = Math.round((score() / Math.max(1, state.questions.length)) * 100);
      if (pct >= 70 || state.rankedUp) launchConfetti();
    } else stopConfetti();
    if (state.screen !== "subject") window.scrollTo(0, 0);
  }

  function startFromHome() {
    const input = document.getElementById("pupil-name");
    if (state.user && state.user.name) {
      state.name = state.user.name;
    } else {
      state.name = (input ? input.value : state.name).trim();
    }
    if (!state.name) {
      if (input) { input.focus(); input.style.borderColor = "#d4573e"; }
      return;
    }
    localStorage.setItem("psq-name", state.name);
    state.screen = "grade";
    render();
  }

  async function beginQuiz(opts) {
    opts = opts || {};
    state.loading = true;
    state.error = "";
    render();
    try {
      const seed = opts.daily
        ? (state.grade * 100000 + Number(todayKey().replace(/-/g, "")))
        : 0;
      state.questions = await loadQuiz(state.grade, state.subject, state.length, seed || null);
      state.index = 0;
      state.picked = [];
      state.revealed = false;
      state.hidden = {};
      state.used5050 = false;
      state.usedSkip = false;
      state.combo = 0;
      state.maxCombo = 0;
      state.newBadges = [];
      state.daily = !!opts.daily;
      state.screen = "quiz";
      saveResume();
    } catch (err) {
      state.error = err.message || "Could not load the quiz.";
      state.screen = state.subject ? "length" : "grade";
    }
    state.loading = false;
    render();
  }

  function finishQuiz() {
    stopTick();
    hideReact();
    recordResult();
    state.screen = "result";
    render();
  }

  function goNext(fromTimer) {
    if (state.index >= state.questions.length - 1) {
      finishQuiz();
      return;
    }
    state.index += 1;
    state.revealed = false;
    hideReact();
    saveResume();
    render();
  }

  function pickOption(i) {
    if (state.mode === "exam") {
      state.picked[state.index] = i;
      render();
      return;
    }
    if (state.revealed) return;
    state.picked[state.index] = i;
    state.revealed = true;
    const ok = i === state.questions[state.index].answer;
    if (ok) {
      state.combo += 1;
      if (state.combo > state.maxCombo) state.maxCombo = state.combo;
      playCorrect();
    } else {
      state.combo = 0;
      playWrong();
    }
    showReact(ok, false);
    saveResume();
    render();
  }

  async function buildExam() {
    state.loading = true; state.error = ""; state.examPaper = null; state.screen = "exam"; render();
    try {
      const keys = Object.keys(window.SUBJECTS);
      const paper = [];
      for (let i = 0; i < keys.length; i++) {
        const bank = await fetchBank(state.grade, keys[i]);
        paper.push({ key: keys[i], name: window.SUBJECTS[keys[i]].name, questions: shuffle(bank).slice(0, 5) });
      }
      state.examPaper = paper;
    } catch (err) { state.error = err.message || "Could not build the paper."; }
    state.loading = false; render();
  }

  function launchConfetti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const colors = ["#0e7c76", "#e9a825", "#e07a5f", "#3d8b6e", "#fff"];
    const bits = [];
    for (let i = 0; i < 90; i++) {
      bits.push({
        x: Math.random() * canvas.width, y: -20 - Math.random() * canvas.height * 0.4,
        r: 4 + Math.random() * 6, c: colors[i % colors.length],
        vy: 2 + Math.random() * 3.5, vx: -1.5 + Math.random() * 3, a: Math.random() * Math.PI
      });
    }
    cancelAnimationFrame(confettiTimer);
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bits.forEach(function (b) {
        b.x += b.vx; b.y += b.vy; b.a += 0.08;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a);
        ctx.fillStyle = b.c; ctx.fillRect(-b.r, -b.r / 2, b.r * 2, b.r); ctx.restore();
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

  async function saveCertPng() {
    const c = document.createElement("canvas");
    c.width = 1400; c.height = 990;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fffdf6"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#0e7c76"; ctx.lineWidth = 18; ctx.strokeRect(40, 40, c.width - 80, c.height - 80);
    ctx.lineWidth = 4; ctx.strokeRect(70, 70, c.width - 140, c.height - 140);
    ctx.fillStyle = "#0e7c76"; ctx.font = "700 22px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("PRIMARY SUPER QUIZ", c.width / 2, 160);
    ctx.fillStyle = "#1c2834"; ctx.font = "700 54px serif";
    ctx.fillText("Certificate of Achievement", c.width / 2, 240);
    ctx.font = "28px sans-serif"; ctx.fillText("This is to certify that", c.width / 2, 330);
    ctx.fillStyle = "#e07a5f"; ctx.font = "italic 64px serif";
    ctx.fillText(state.name || "A brilliant pupil", c.width / 2, 430);
    ctx.fillStyle = "#1c2834"; ctx.font = "28px sans-serif";
    const n = score(); const total = state.questions.length;
    const pct = Math.round((n / total) * 100);
    ctx.fillText("completed " + subjectName(state.subject) + " · " + window.GRADE_INFO[state.grade].label, c.width / 2, 510);
    ctx.font = "700 40px sans-serif";
    ctx.fillText("Score " + n + " / " + total + "  (" + pct + "%)", c.width / 2, 600);
    ctx.font = "24px sans-serif"; ctx.fillText(todayPretty(), c.width / 2, 680);
    ctx.fillStyle = "#0e7c76"; ctx.font = "700 26px sans-serif";
    ctx.fillText("Well done — keep learning.", c.width / 2, 780);
    c.toBlob(function (blob) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "certificate-" + (state.name || "pupil") + ".png";
      a.click();
    });
  }

  async function shareResult() {
    const n = score(); const total = state.questions.length;
    const text = (state.name || "I") + " scored " + n + "/" + total + " in " + subjectName(state.subject) +
      " (Primary " + state.grade + ") on Primary Super Quiz!";
    const url = location.href.split("#")[0];
    if (navigator.share) {
      try { await navigator.share({ title: "Primary Super Quiz", text: text, url: url }); return; } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(text + " " + url);
      toast("Copied your result. Paste it anywhere.");
    } catch (e) { toast(text); }
  }

  app.addEventListener("click", function (e) {
    const t = e.target.closest("[data-go], [data-action], [data-grade], [data-pick-subject], [data-length], [data-opt], [data-mode], [data-group], [data-toggle]");
    if (!t) return;
    ensureAudio();

    if (t.dataset.go) { state.screen = t.dataset.go; render(); return; }
    if (t.dataset.grade) {
      state.grade = Number(t.dataset.grade);
      prefetchGrade(state.grade);
      if (state.pendingDaily) {
        state.pendingDaily = false;
        state.subject = "daily";
        state.length = 10;
        state.mode = "practice";
        beginQuiz({ daily: true });
        return;
      }
      if (state.pendingSmart) {
        state.pendingSmart = false;
        state.subject = "smart";
        state.length = 20;
        state.mode = "practice";
        beginQuiz({});
        return;
      }
      state.screen = "subject";
      render();
      return;
    }
    if (t.dataset.group) { state.group = t.dataset.group; render(); return; }
    if (t.dataset.pickSubject) {
      state.subject = t.dataset.pickSubject;
      state.screen = "length";
      state.error = "";
      if (state.subject === "daily") { state.length = 10; state.mode = "practice"; }
      if (state.subject === "smart") { state.length = 20; state.mode = "practice"; }
      render(); return;
    }
    if (t.dataset.length) { state.length = Number(t.dataset.length); render(); return; }
    if (t.dataset.mode) { state.mode = t.dataset.mode; render(); return; }
    if (t.dataset.opt != null) { pickOption(Number(t.dataset.opt)); return; }
    if (t.dataset.toggle) {
      settings[t.dataset.toggle] = !settings[t.dataset.toggle];
      saveSettings(); applyChrome();
      if (t.dataset.toggle === "music") {
        if (settings.music) startMusic(); else stopMusic();
      }
      render(); return;
    }

    const action = t.dataset.action;
    if (action === "start") startFromHome();
    if (action === "toggle-sound") { settings.sound = !settings.sound; saveSettings(); render(); }
    if (action === "toggle-music") {
      settings.music = !settings.music;
      saveSettings();
      if (settings.music) startMusic(); else stopMusic();
      render();
    }
    if (action === "begin") { unlockSpeech(); beginQuiz({ daily: state.subject === "daily" }); }
    if (action === "daily") {
      if (!state.name) { startFromHome(); if (!state.name) return; }
      state.screen = "grade";
      state.pendingDaily = true;
      render();
    }
    if (action === "smart") {
      if (!state.name) { startFromHome(); if (!state.name) return; }
      state.screen = "grade";
      state.pendingSmart = true;
      render();
    }
    if (action === "onboard-next") {
      state.onboardStep = (state.onboardStep || 0) + 1;
      render();
    }
    if (action === "onboard-skip") {
      localStorage.setItem("psq-onboard-v1", "1");
      render();
    }
    if (action === "resume") {
      const r = loadJSON(resumeKey(), null);
      if (r && r.questions) {
        Object.assign(state, r);
        state.screen = "quiz";
        state.revealed = false;
        render();
      }
    }
    if (action === "next") goNext();
    if (action === "review") { state.screen = "review"; render(); }
    if (action === "certificate") { state.screen = "certificate"; render(); }
    if (action === "again") beginQuiz({ daily: state.daily });
    if (action === "print-exam") buildExam();
    if (action === "print") window.print();
    if (action === "save-cert") saveCertPng();
    if (action === "share") shareResult();
    if (action === "speak") speakScreen(true);
    if (action === "fifty" && !state.used5050 && state.mode !== "exam") {
      const q = state.questions[state.index];
      const wrong = [0, 1, 2, 3].filter(function (i) { return i !== q.answer; });
      state.hidden[state.index] = shuffle(wrong).slice(0, 2);
      state.used5050 = true;
      render();
    }
    if (action === "skip" && !state.usedSkip) {
      state.usedSkip = true;
      state.picked[state.index] = state.picked[state.index] == null ? -1 : state.picked[state.index];
      goNext();
    }
    if (action === "reset-progress") {
      if (confirm("Erase XP, badges and history on this device?")) {
        localStorage.removeItem(progressKey());
        localStorage.removeItem(resumeKey());
        location.reload();
      }
    }
    if (action === "signout") signOutGoogle();
    if (action === "need-google") {
      state.screen = "settings";
      toast("Paste your Google Client ID here, then return home to sign in.");
      render();
    }
    if (action === "dismiss-react") { hideReact(); return; }
    if (action === "save-cid") {
      const box = document.getElementById("cid");
      const val = box ? box.value.trim() : "";
      if (!val || val.indexOf(".apps.googleusercontent.com") < 0) {
        toast("That does not look like a Google Client ID.");
        return;
      }
      localStorage.setItem("psq-google-client-id", val);
      gsiInited = false;
      toast("Saved. Go home and tap Sign in with Google.");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (state.screen !== "quiz") return;
    if (state.revealed && state.mode !== "exam" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      const btn = app.querySelector('[data-action="next"]');
      if (btn) btn.click();
      return;
    }
    const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
    if (map[e.key] != null) {
      const btn = app.querySelector('[data-opt="' + map[e.key] + '"]');
      if (btn) btn.click();
    }
  });

  if (window.speechSynthesis && speechSynthesis.addEventListener) {
    speechSynthesis.addEventListener("voiceschanged", function () { ttsVoices(); });
    try { ttsVoices(); } catch (e) {}
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      try { if (window.speechSynthesis) speechSynthesis.pause(); } catch (e) {}
    } else {
      try { if (window.speechSynthesis && speechSynthesis.paused) speechSynthesis.resume(); } catch (e) {}
    }
    if (!settings.music || !music) return;
    setMusicGain(document.hidden ? 0 : MUSIC_VOL, 0.2);
  });
  window.addEventListener("beforeprint", function () { if (music) setMusicGain(0, 0.05); });
  window.addEventListener("afterprint", function () {
    if (settings.music && music && !document.hidden) setMusicGain(MUSIC_VOL, 0.3);
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
  ["images/owl-yes.jpg", "images/owl-no.jpg"].forEach(function (src) {
    const im = new Image(); im.src = src;
  });

  render();
})();
