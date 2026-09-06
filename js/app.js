(function () {
  const app = document.getElementById("app");
  const canvas = document.getElementById("confetti");
  const LETTERS = ["A", "B", "C", "D"];
  const bankCache = {};
  const SK = "psq-settings-v3";
  const EMPTY_PROGRESS = {
    xp: 0, streak: 0, lastDay: "", quizzes: 0, badges: [],
    best: {}, history: [], missed: {}, dailyDate: "", dailyBest: 0,
    weekKey: "", weekQuizzes: 0, lastRank: "hatchling", days: {},
    studySec: 0, studyByDay: {}, favs: []
  };

  const settings = loadJSON(SK, { sound: true, tts: false, dark: false, large: false, music: true, contrast: false, autoDark: false, focus: false, calm: false, readable: false });
  let progress = EMPTY_PROGRESS;

  const state = {
    screen: "home",
    name: localStorage.getItem("psq-name") || "",
    grade: (function () {
      const n = Number(localStorage.getItem("psq-grade") || "");
      return n >= 1 && n <= 6 ? n : null;
    })(),
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
    pendingLightning: false,
    react: null,
    paused: false,
    reviewFilter: "all",
    usedHint: false,
    hintText: "",
    lightning: false,
    quizStartedAt: 0,
    elapsedSec: 0,
    flagged: {},
    renamingProfile: false
  };

  let audioCtx = null;
  let music = null;
  let confettiTimer = null;
  let tickTimer = null;
  let clockTimer = null;
  let toastTimer = null;
  let reactTimer = null;
  let speakTimer = null;
  let ttsWatch = null;
  let gsiInited = false;
  let deferredInstall = null;

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
    if (u && u.sub) return u.sub;
    ensureProfiles();
    return localStorage.getItem("psq-profile-id") || "p1";
  }
  function listProfiles() { return loadJSON("psq-profiles-v1", []); }
  function saveProfiles(list) { localStorage.setItem("psq-profiles-v1", JSON.stringify(list)); }
  function ensureProfiles() {
    let list = loadJSON("psq-profiles-v1", null);
    if (list && list.length) {
      const id = localStorage.getItem("psq-profile-id");
      if (!id || !list.some(function (p) { return p.id === id; })) {
        localStorage.setItem("psq-profile-id", list[0].id);
      }
      return list;
    }
    const id = "p1";
    list = [{
      id: id,
      name: localStorage.getItem("psq-name") || "Pupil",
      grade: Number(localStorage.getItem("psq-grade") || "") || null
    }];
    saveProfiles(list);
    localStorage.setItem("psq-profile-id", id);
    const oldP = localStorage.getItem("psq-progress-v3-guest");
    if (oldP && !localStorage.getItem("psq-progress-v3-" + id)) {
      localStorage.setItem("psq-progress-v3-" + id, oldP);
    }
    const oldR = localStorage.getItem("psq-resume-v3-guest");
    if (oldR && !localStorage.getItem("psq-resume-v3-" + id)) {
      localStorage.setItem("psq-resume-v3-" + id, oldR);
    }
    return list;
  }
  function touchProfile() {
    if (currentUser()) return;
    const id = localStorage.getItem("psq-profile-id");
    saveProfiles(ensureProfiles().map(function (p) {
      if (p.id === id) {
        p.name = state.name || p.name;
        p.grade = state.grade || p.grade;
      }
      return p;
    }));
  }
  function switchProfile(id) {
    if (currentUser()) { toast("Sign out first to switch sibling profiles."); return; }
    touchProfile();
    const next = ensureProfiles().find(function (p) { return p.id === id; });
    if (!next) return;
    localStorage.setItem("psq-profile-id", id);
    state.name = next.name || "";
    state.grade = next.grade || null;
    localStorage.setItem("psq-name", state.name);
    if (state.grade) localStorage.setItem("psq-grade", String(state.grade));
    else localStorage.removeItem("psq-grade");
    loadProgress();
    toast("Now playing as " + (state.name || "pupil"));
  }
  function schoolName() {
    return (localStorage.getItem("psq-school") || "").trim();
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
    if (!Array.isArray(progress.favs)) progress.favs = [];
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
      /* One Tap off: it duplicates the button and is too pushy in a classroom. */
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
    let dark = !!settings.dark;
    if (settings.autoDark && window.matchMedia) {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.classList.toggle("large", !!settings.large);
    document.documentElement.classList.toggle("contrast", !!settings.contrast);
    document.documentElement.classList.toggle("focus-ui", !!settings.focus);
    document.documentElement.classList.toggle("calm", !!settings.calm);
    document.documentElement.classList.toggle("readable", !!settings.readable);
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

  const MUSIC_VOL = 0.038;

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
    filter.frequency.value = 920;
    filter.Q.value = 0.55;

    const delay1 = audioCtx.createDelay(2);
    delay1.delayTime.value = 0.52;
    const fb1 = audioCtx.createGain();
    fb1.gain.value = 0.18;
    const wet1 = audioCtx.createGain();
    wet1.gain.value = 0.22;
    const delay2 = audioCtx.createDelay(2);
    delay2.delayTime.value = 1.04;
    const fb2 = audioCtx.createGain();
    fb2.gain.value = 0.12;
    const wet2 = audioCtx.createGain();
    wet2.gain.value = 0.14;

    filter.connect(master);
    filter.connect(delay1);
    delay1.connect(fb1); fb1.connect(delay1);
    delay1.connect(wet1); wet1.connect(master);
    filter.connect(delay2);
    delay2.connect(fb2); fb2.connect(delay2);
    delay2.connect(wet2); wet2.connect(master);
    master.connect(audioCtx.destination);

    const lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.045;
    const lfoG = audioCtx.createGain();
    lfoG.gain.value = 260;
    lfo.connect(lfoG);
    lfoG.connect(filter.frequency);
    lfo.start();

    function makePad(type, gain) {
      const o = audioCtx.createOscillator();
      o.type = type;
      o.frequency.value = 196;
      const g = audioCtx.createGain();
      g.gain.value = gain;
      o.connect(g); g.connect(filter);
      o.start();
      return o;
    }
    const padA = makePad("sine", 0.11);
    const padB = makePad("sine", 0.07);
    const padC = makePad("triangle", 0.035);
    const sub = makePad("sine", 0.09);
    const pads = [padA, padB, padC, sub];

    function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    const chords = [
      [55, 59, 62, 43],
      [52, 55, 59, 40],
      [48, 52, 55, 36],
      [50, 54, 57, 38]
    ];
    const melody = [
      64,62,59,62, 64,67,64,0, 62,59,57,55, 59,62,64,0,
      67,64,62,64, 67,69,67,0, 64,62,59,57, 55,57,59,0,
      72,71,67,64, 62,64,67,0, 69,67,64,62, 60,62,64,0,
      66,69,67,64, 62,64,66,0, 67,64,62,59, 57,62,55,0,
      64,0,62,59, 64,67,0,64, 62,0,59,57, 59,62,0,0,
      67,64,0,64, 67,0,69,67, 64,62,59,0, 55,0,59,0,
      72,0,71,67, 64,67,0,0, 69,67,64,0, 60,64,0,0,
      66,69,0,67, 64,62,66,0, 67,0,64,62, 59,57,55,0
    ];
    const bassPat = [
      55,0,59,0,62,0,55,0,
      52,0,55,0,59,0,52,0,
      48,0,52,0,55,0,48,0,
      50,0,54,0,57,0,50,0
    ];

    let step = 0;
    let nextT = audioCtx.currentTime + 0.4;
    const beat = 0.64;

    function toneAt(time, midi, dur, peak, type) {
      if (!midi) return;
      const f = hz(midi);
      const o = audioCtx.createOscillator();
      o.type = type || "sine";
      o.frequency.setValueAtTime(f, time);
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(peak, time + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      o.connect(g); g.connect(filter);
      o.start(time);
      o.stop(time + dur + 0.04);
      const h = audioCtx.createOscillator();
      h.type = "sine";
      h.frequency.setValueAtTime(f * 2.003, time);
      const hg = audioCtx.createGain();
      hg.gain.setValueAtTime(0.0001, time);
      hg.gain.exponentialRampToValueAtTime(peak * 0.18, time + 0.018);
      hg.gain.exponentialRampToValueAtTime(0.0001, time + dur * 0.45);
      h.connect(hg); hg.connect(filter);
      h.start(time);
      h.stop(time + dur * 0.5);
    }

    function setChord(time, idx) {
      const c = chords[idx];
      padA.frequency.setTargetAtTime(hz(c[0]), time, 0.4);
      padB.frequency.setTargetAtTime(hz(c[1]), time, 0.45);
      padC.frequency.setTargetAtTime(hz(c[2]), time, 0.5);
      sub.frequency.setTargetAtTime(hz(c[3]), time, 0.55);
    }

    function schedule() {
      if (!music) return;
      const horizon = audioCtx.currentTime + 2.1;
      while (nextT < horizon) {
        const chord = Math.floor(step / 16) % 4;
        if (step % 16 === 0) setChord(nextT, chord);
        const n = melody[step % melody.length];
        const long = n && melody[(step + 1) % melody.length] === 0;
        const peak = (step % 8 === 0 ? 0.072 : 0.055);
        toneAt(nextT, n, long ? 1.7 : 1.15, peak, "sine");
        const b = bassPat[step % bassPat.length];
        if (b) toneAt(nextT, b, 1.7, 0.04, "sine");
        if (step % 32 === 24) toneAt(nextT, 79, 2.2, 0.018, "sine");
        nextT += beat;
        step += 1;
      }
      music.timer = setTimeout(schedule, 480);
    }

    music = { master: master, pads: pads, extra: [lfo], timer: null };
    master.gain.linearRampToValueAtTime(MUSIC_VOL, audioCtx.currentTime + 4.2);
    schedule();
  }
  function stopMusic() {
    if (!music) return;
    clearTimeout(music.timer);
    const m = music;
    music = null;
    if (!audioCtx) return;
    m.master.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.32);
    setTimeout(function () {
      m.pads.forEach(function (p) { try { p.stop(); } catch (e) {} });
      (m.extra || []).forEach(function (p) { try { p.stop(); } catch (e) {} });
      try { m.master.disconnect(); } catch (e) {}
    }, 1000);
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
  function gradeLetter(pct) {
    if (pct >= 80) return { mark: "A", label: "Excellent" };
    if (pct >= 70) return { mark: "B", label: "Very good" };
    if (pct >= 55) return { mark: "C", label: "Good" };
    if (pct >= 40) return { mark: "D", label: "Fair" };
    return { mark: "E", label: "Keep practising" };
  }
  function gradeScaleNote() {
    return "A 80%+ · B 70–79 · C 55–69 · D 40–54 · E below 40. Practice grades only — not an official examination.";
  }
  function nextLearnStep(pct, missedN) {
    if (missedN) return "Next step: open Review, read each explanation, then try a short Practice paper on the same topic.";
    if (pct >= 80) return "Next step: this set is secure. Stretch with a longer paper, or practise a weaker subject.";
    if (pct >= 55) return "Next step: one more short Practice paper on the same subject will raise this.";
    return "Next step: stay in Practice mode. Read the explanation after every miss before you go on.";
  }
  function masteryList(grade) {
    return Object.keys(window.SUBJECTS).map(function (k) {
      const s = window.SUBJECTS[k];
      const b = progress.best[grade + "/" + k];
      return { k: k, name: s.name, icon: s.icon, pct: b ? b.pct : null, score: b ? b.score : null, total: b ? b.total : null };
    });
  }
  function etaMinutes(n) {
    const per = state.mode === "timed" ? secondsFor() : (state.grade && state.grade <= 2 ? 28 : 22);
    return Math.max(1, Math.round((n || state.length || 10) * per / 60));
  }
  function secondsFor() {
    if (state.lightning) return 12;
    return state.grade && state.grade <= 2 ? 45 : 30;
  }
  function greeting() {
    const h = new Date().getHours();
    const hi = h < 12 ? "Good morning" : h < 16 ? "Good afternoon" : "Good evening";
    const n = state.name || (state.user && state.user.given_name) || "friend";
    return hi + ", " + n;
  }
  function fmtClock(sec) {
    sec = Math.max(0, Math.round(Number(sec) || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function isFav(k) {
    return (progress.favs || []).indexOf(k) >= 0;
  }
  function toggleFav(k) {
    const a = (progress.favs || []).slice();
    const i = a.indexOf(k);
    if (i >= 0) a.splice(i, 1); else a.push(k);
    progress.favs = a;
    saveProgress();
  }
  function fmtDur(sec) {
    sec = Math.max(0, Math.round(Number(sec) || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m >= 60) return Math.floor(m / 60) + "h " + (m % 60) + "m";
    if (m) return m + " min";
    return s + "s";
  }
  function accuracyPct() {
    const h = progress.history || [];
    if (!h.length) return null;
    const tot = h.reduce(function (s, x) { return s + (x.total || 0); }, 0);
    const sc = h.reduce(function (s, x) { return s + (x.score || 0); }, 0);
    return tot ? Math.round((sc / tot) * 100) : null;
  }
  function todayStudy() {
    return (progress.studyByDay && progress.studyByDay[todayKey()]) || 0;
  }
  function hintFor(q) {
    if (!q) return "Look for the choice that matches what you learnt in class.";
    let e = String(q.explain || "");
    const ans = q.options && q.options[q.answer] != null ? String(q.options[q.answer]) : "";
    if (ans) {
      try {
        e = e.replace(new RegExp(ans.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "___");
      } catch (err) {}
    }
    e = e.replace(/the (correct )?answer is[^.]*\.?/ig, "").replace(/\s+/g, " ").trim();
    if (e.length > 120) e = e.slice(0, 118) + "…";
    return e || "Cross out the option that cannot be right. Then choose.";
  }
  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || !!window.navigator.standalone;
  }
  function installBanner() {
    if (!deferredInstall || isStandalone()) return "";
    return `<div class="install-bar no-print">
      <span>Add Super Quiz to your home screen</span>
      <button class="btn btn-sun" data-action="install">Install</button>
    </div>`;
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
    if (state.lightning) xp += 15;
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
    const sec = Math.max(0, Math.round((Date.now() - (state.quizStartedAt || Date.now())) / 1000));
    state.elapsedSec = sec;
    progress.studySec = (progress.studySec || 0) + sec;
    if (!progress.studyByDay) progress.studyByDay = {};
    progress.studyByDay[todayKey()] = (progress.studyByDay[todayKey()] || 0) + sec;
    if (state.lightning && pct >= 60) awardBadge("bolt");
    if (!state.usedHint && pct >= 80 && total >= 10) awardBadge("independent");
    if (progress.studySec >= 1800) awardBadge("bookworm");
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
      usedSkip: state.usedSkip, usedHint: state.usedHint, daily: state.daily,
      lightning: state.lightning, hidden: state.hidden, quizStartedAt: state.quizStartedAt,
      flagged: state.flagged || {}
    }));
  }

  function svgIco(name) {
    const d = {
      back: '<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/>',
      user: '<circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5.5 19c.8-3 3-4.5 6.5-4.5s5.7 1.5 6.5 4.5"/>',
      chart: '<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M5 19V10M12 19V5M19 19v-7"/>',
      gear: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.4 6.4l1.6 1.6M16 16l1.6 1.6M17.6 6.4L16 8M8 16l-1.6 1.6"/>',
      music: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M9 18V7l10-2v11"/><circle cx="7" cy="18" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="16" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/>',
      sound: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M5 10v4h3l4 3V7L8 10H5z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 9.5a4 4 0 010 5"/>',
      mute: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M5 10v4h3l4 3V7L8 10H5z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 10l4 4M20 10l-4 4"/>'
    };
    return '<svg class="ico-svg" viewBox="0 0 24 24" aria-hidden="true">' + (d[name] || "") + "</svg>";
  }
  function topbar(backScreen) {
    const left = backScreen
      ? `<button class="icon-btn" data-go="${backScreen}" aria-label="Back">${svgIco("back")}</button>`
      : `<div class="brand"><img src="images/icon-192.png" alt=""> Super Quiz</div>`;
    return `
      ${netBanner()}
      <div class="topbar no-print">
        ${left}
        <div class="ghost-row">
          ${state.user && state.user.picture
            ? `<button class="avatar-btn" data-go="account" title="${esc(state.user.name)}" aria-label="Account"><img referrerpolicy="no-referrer" src="${esc(state.user.picture)}" alt=""></button>`
            : `<button class="icon-btn" data-go="account" title="Sign in" aria-label="Account">${svgIco("user")}</button>`}
          <button class="icon-btn" data-go="dashboard" title="Progress" aria-label="Progress">${svgIco("chart")}</button>
          <button class="icon-btn" data-go="settings" title="Settings" aria-label="Settings">${svgIco("gear")}</button>
          <button class="icon-btn ${settings.music ? "" : "off"}" data-action="toggle-music" title="Music" aria-label="Music" aria-pressed="${settings.music}">${svgIco("music")}</button>
          <button class="icon-btn" data-action="toggle-sound" aria-label="Sound">${svgIco(settings.sound ? "sound" : "mute")}</button>
        </div>
      </div>`;
  }

  function toastEl() {
    return `<div class="toast" id="toast" role="status" aria-live="polite" ${state.toast ? "" : "hidden"}>${esc(state.toast)}</div>`;
  }
  function netBanner() {
    if (navigator.onLine) return "";
    return `<div class="net-banner">You’re offline. Saved questions still work.</div>`;
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
  function crumbs(parts) {
    return `<nav class="crumbs" aria-label="Breadcrumb">${parts.map(function (p, i) {
      const last = i === parts.length - 1;
      if (!last && p.go) return `<button type="button" data-go="${p.go}">${esc(p.label)}</button><span aria-hidden="true">/</span>`;
      return `<span>${esc(p.label)}</span>`;
    }).join("")}</nav>`;
  }
  function updateBanner() {
    if (!state.updateReady) return "";
    return `<div class="install-bar no-print"><span>A new version is ready</span><button class="btn btn-sun" data-action="reload">Refresh</button></div>`;
  }
  function parentRecapText() {
    const r = rankFor(progress.xp);
    const acc = accuracyPct();
    return (state.name || "Your child") + " practised on Primary Super Quiz. " +
      r.icon + " " + r.name + " · " + progress.xp + " XP · streak " + progress.streak +
      " days · " + progress.quizzes + " quizzes" +
      (acc != null ? " · " + acc + "% accuracy (" + gradeLetter(acc).mark + ")" : "") +
      " · " + fmtDur(progress.studySec || 0) + " study time. " +
      location.href.split("#")[0];
  }
  function helpEl() {
    if (!state.helpOpen) return "";
    return `
      <div class="onboard" role="dialog" aria-modal="true" aria-label="Help" data-action="close-help">
        <div class="onboard-card">
          <h2>Quick help</h2>
          <p>A B C D — choose an answer<br>H — hint · F — flag · P — pause · N or Enter — next<br>After an answer, swipe left for next<br>? — this help</p>
          <p>Teachers: print an exam paper from the subject screen, and a progress report from My progress.</p>
          <button class="btn btn-primary" data-action="close-help">Close</button>
        </div>
      </div>`;
  }
  function siteFooter() {
    return `
      <footer class="site-footer">
        <div class="foot-brand">
          <img src="images/icon-192.png" alt="">
          <div>
            <strong>Primary Super Quiz</strong>
            <p>Free primary practice for classrooms and families. No ads. Works offline.</p>
          </div>
        </div>
        <nav class="foot-nav" aria-label="About this site">
          <button type="button" data-go="teachers">For teachers</button>
          <button type="button" data-go="parents">For families</button>
          <button type="button" data-go="why">Why it works</button>
          <button type="button" data-go="how">How it works</button>
          <button type="button" data-go="access">Accessibility</button>
          <button type="button" data-go="faq">FAQ</button>
          <button type="button" data-go="about">About</button>
          <button type="button" data-go="privacy">Privacy</button>
          <button type="button" data-go="news">What’s new</button>
          <button type="button" data-action="open-help">Help</button>
          <button type="button" data-go="dashboard">Progress</button>
          <button type="button" data-go="settings">Settings</button>
        </nav>
        <p class="site-foot">© merebari web 2026. All rights reserved. Independent practice — not an official exam paper.</p>
      </footer>`;
  }
  function renderNews() {
    return `
      <div class="wrap">
        ${topbar("home")}
        <article class="prose">
          <p class="kicker">Updates</p>
          <h2 class="section-title">What’s new</h2>
          <h3>September 2026</h3>
          <ul>
            <li>For teachers, families, accessibility, and a plain-language “Why it works” page.</li>
            <li>Teacher reports now show strengths, gaps and a recommended next step.</li>
            <li>Results include a learning next step and the A–E practice scale.</li>
            <li>Star subjects, flag questions, sibling rename, quiz clock and today’s plan.</li>
            <li>Layouts fit phones, tablets and landscape. Works offline after the first visit.</li>
          </ul>
          <p>Hard-refresh (Ctrl+Shift+R) if a button looks old.</p>
          <div class="home-actions">
            <button class="btn btn-primary" data-go="home">Back to home</button>
          </div>
        </article>
        ${siteFooter()}${toastEl()}
      </div>`;
  }
  function profileRow() {
    if (currentUser()) return "";
    const list = ensureProfiles();
    const cur = localStorage.getItem("psq-profile-id");
    const chips = list.map(function (p) {
      return `<span class="profile-chip ${p.id === cur ? "on" : ""}">
        <button type="button" data-profile="${esc(p.id)}">${esc(p.name || "Pupil")}</button>
        ${p.id === cur ? `<button type="button" class="chip-x" data-action="rename-profile" aria-label="Rename">✎</button>` : ""}
        ${list.length > 1 ? `<button type="button" class="chip-x" data-del-profile="${esc(p.id)}" aria-label="Remove ${esc(p.name)}">×</button>` : ""}
      </span>`;
    }).join("");
    return `
      <div class="profile-row" aria-label="Pupils on this device">
        ${chips}
        ${list.length < 6 ? `<button type="button" class="profile-chip add" data-action="add-profile">+ Sibling</button>` : ""}
        ${state.addingProfile ? `<span class="profile-add"><input id="new-pupil" type="text" maxlength="24" placeholder="Sibling’s name"><button class="btn btn-sun" data-action="save-profile">Add</button></span>` : ""}
        ${state.renamingProfile ? `<span class="profile-add"><input id="rename-pupil" type="text" maxlength="24" value="${esc(state.name || "")}"><button class="btn btn-sun" data-action="save-rename">Save name</button></span>` : ""}
      </div>`;
  }
  function planCard() {
    if (!state.grade) return "";
    return `
      <div class="coach-card plan">
        <div>
          <p class="kicker" style="margin:0">Today’s plan</p>
          <strong>10 quiet questions</strong>
          <p>About eight minutes. Starts with your weaker subject.</p>
        </div>
        <button class="btn btn-primary" data-action="plan-play">Start</button>
      </div>`;
  }
  function coachCard() {
    if (!state.grade || !progress.quizzes) return "";
    const k = weakestSubject(state.grade);
    const s = window.SUBJECTS[k];
    const missedN = (progress.missed[state.grade] || []).length;
    return `
      <div class="coach-card">
        <div>
          <p class="kicker" style="margin:0">Coach</p>
          <strong>Practise ${esc(s ? s.name : k)}</strong>
          <p>${missedN ? missedN + " missed questions are waiting." : "Your lowest score in this class."}</p>
        </div>
        <button class="btn btn-sun" data-action="coach-play">Start</button>
      </div>`;
  }
  function dailyEta() {
    if (progress.dailyDate !== todayKey()) return "10 fresh mixed questions";
    const n = new Date();
    const t = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
    const min = Math.max(1, Math.round((t - n) / 60000));
    const h = Math.floor(min / 60);
    const m = min % 60;
    return "Done today · new in " + (h ? h + "h " : "") + m + "m";
  }
  function weekActivity() {
    const days = progress.studyByDay || {};
    const vals = [];
    let max = 1;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      const v = days[k] || 0;
      if (v > max) max = v;
      vals.push({ k: k, v: v, label: ["S", "M", "T", "W", "T", "F", "S"][d.getDay()] });
    }
    return `<div class="week-act" aria-label="Study time this week">${vals.map(function (x) {
      const h = Math.max(6, Math.round((x.v / max) * 46));
      return `<span title="${x.k}: ${fmtDur(x.v)}"><i style="height:${h}px"></i>${x.label}</span>`;
    }).join("")}</div>`;
  }
  function renderFaq() {
    return `
      <div class="wrap">
        ${topbar("home")}
        <article class="prose">
          <p class="kicker">FAQ</p>
          <h2 class="section-title">Common questions</h2>
          <h3>Is this free?</h3>
          <p>Yes, for pupils, families and teachers. Please do not copy or republish the questions or pictures.</p>
          <h3>Is this an official exam or NERDC paper?</h3>
          <p>No. It is independent practice on typical Nigerian Primary 1–6 topics. Scores are for learning, not certification.</p>
          <h3>Can teachers outside Nigeria use it?</h3>
          <p>Yes, as English-medium primary practice (ages about 6–12) covering language, mathematics, science and related topics. It is designed around the Nigerian primary classroom, not a global syllabus.</p>
          <h3>Does it work without internet?</h3>
          <p>After the first visit, the app and saved questions stay on the device. Open it once online so it can install. This matters in classrooms with weak connectivity.</p>
          <h3>Where is my score saved?</h3>
          <p>On this device, in the browser. There is no pupil database on a server. Google Sign-In is optional and only labels progress on this phone.</p>
          <h3>How should a teacher use it in a lesson?</h3>
          <p>Ten questions as a starter, Practice mode for teaching, Exam mode for a mock, and Print homework from missed items. See <button type="button" data-go="teachers">For teachers</button>.</p>
          <h3>Can I star a subject?</h3>
          <p>Yes. Tap the star on a subject card. ★ Fav keeps those subjects on this device.</p>
          <div class="home-actions">
            <button class="btn btn-primary" data-go="home">Back to home</button>
            <button class="btn btn-ghost" data-action="open-help">Keyboard help</button>
          </div>
        </article>
        ${siteFooter()}${toastEl()}
      </div>`;
  }
  function renderHow() {
    return `
      <div class="wrap">
        ${topbar("home")}
        <article class="prose">
          <p class="kicker">Guide</p>
          <h2 class="section-title">How it works</h2>
          <h3>1. Pick the class</h3>
          <p>Primary 1 to Primary 6 (about ages 6–12). Questions get harder as you go up.</p>
          <h3>2. Choose a subject</h3>
          <p>English, Mathematics, Basic Science and 13 more — 100 questions in each class. Stems get harder as the class goes up. Star the ones you use often.</p>
          <h3>3. Choose a purpose</h3>
          <p><strong>Practice</strong> is formative: mark and explain at once. <strong>Exam</strong> withholds hints until the end, like a paper. <strong>Timed</strong> builds pace. Flag a hard item to review later.</p>
          <h3>4. Review and return</h3>
          <p>Read why an answer is right. Missed items are saved. A short daily session beats a long cram. Print a teacher report when you need evidence for a parent or school.</p>
          <div class="home-actions">
            <button class="btn btn-primary" data-go="home">Back to home</button>
          </div>
        </article>
        ${siteFooter()}${toastEl()}
      </div>`;
  }
  function renderAbout() {
    return `
      <div class="wrap">
        ${topbar("home")}
        <article class="prose">
          <p class="kicker">merebari web</p>
          <h2 class="section-title">About Primary Super Quiz</h2>
          <p>A free, classroom-ready practice room for English-medium primary learning. It is designed around Nigerian Primary 1–6 — 16 subjects, 100 questions in each class, 9,600 items — and is usable anywhere similar topics are taught to children about 6–12 years old.</p>
          <p>The aim is low-stakes retrieval: short quizzes, explanations, missed-item review, and printable papers for rooms that share one printer more often than they share one tablet each.</p>
          <div class="callout"><strong>What this is not.</strong> It is not an official NERDC, ministry, WAEC or common-entrance paper. It does not certify a pupil. Practice grades (A–E) are for learning conversations only.</div>
          <p>Progress stays on this device. There are no adverts and no pupil database on a server. Install it on a phone and it works offline after the first visit.</p>
          <p>© merebari web 2026. All rights reserved. Teachers and pupils may use the live quiz. Please do not copy, edit or republish the questions or artwork without permission.</p>
          <div class="home-actions">
            <button class="btn btn-primary" data-go="home">Start practising</button>
            <button class="btn btn-ghost" data-go="teachers">For teachers</button>
            <button class="btn btn-ghost" data-go="why">Why it works</button>
          </div>
        </article>
        ${siteFooter()}${toastEl()}
      </div>`;
  }
  function renderPrivacy() {
    return `
      <div class="wrap">
        ${topbar("home")}
        <article class="prose">
          <p class="kicker">Privacy</p>
          <h2 class="section-title">How we handle data</h2>
          <p>This app is built for children. We do not run a pupil database on a server, and we do not show adverts.</p>
          <ul>
            <li>Name, XP, badges, streak and missed questions are saved in this browser (local storage) only.</li>
            <li>Google Sign-In is optional. If used, Google shares name, email and photo with this page so progress can be labelled on this device. Scores are not uploaded to us.</li>
            <li>We do not sell information. There are no ad or analytics trackers in this app.</li>
            <li>Sibling profiles stay on this phone. A downloaded backup is a file you keep.</li>
            <li>Reset progress in Settings clears quiz data on this device.</li>
          </ul>
          <p>Schools should follow their own device and safeguarding policy. Younger pupils can play as guests with only a first name.</p>
          <p>Questions and pictures are © merebari web 2026. All rights reserved.</p>
          <div class="home-actions">
            <button class="btn btn-primary" data-go="home">Back to home</button>
          </div>
        </article>
        ${siteFooter()}${toastEl()}
      </div>`;
  }

  function renderTeachers() {
    return `
      <div class="wrap">
        ${topbar("home")}
        <article class="prose">
          <p class="kicker">Educators</p>
          <h2 class="section-title">For teachers</h2>
          <p>Use this as a 10-minute lesson starter, a homework sheet, or a mock paper — not as a high-stakes test. One shared phone or a printed page is enough.</p>
          <div class="callout"><strong>Classroom recipe.</strong> Practice mode to teach. Exam mode to simulate a paper. Print homework from missed items. Focus mode on a projector.</div>
          <h3>In a lesson</h3>
          <ul>
            <li>Pick the class, then 10 questions in Practice mode as a starter. Treat that score as a snapshot, not a term grade.</li>
            <li>Read the explanation aloud after a miss. That is the teaching moment.</li>
            <li>Flag items you want to revisit. Review them at the end.</li>
            <li>Turn on Focus mode and Larger text in Settings for a shared screen.</li>
          </ul>
          <h3>On paper</h3>
          <p>From the subject screen: <strong>Print exam</strong> gives an 80-question paper with an answer key. <strong>Print homework</strong> reprints recent misses. My progress has a printable report with strengths, gaps and a next step.</p>
          <h3>Low connectivity</h3>
          <p>Open the site once online. After that it works offline on that device. Sibling profiles keep more than one child on the same phone.</p>
          <p>Questions are written to rise with the class — Primary 6 is not a reprint of Primary 1 stems. They are original practice items, not past papers.</p>
          <p class="cite">Independent practice only. Not an official NERDC or common-entrance paper.</p>
          <div class="home-actions">
            <button class="btn btn-primary" data-action="start">Open the class list</button>
            <button class="btn btn-ghost" data-go="why">Why it works</button>
            <button class="btn btn-ghost" data-go="access">Accessibility</button>
          </div>
        </article>
        ${siteFooter()}${toastEl()}
      </div>`;
  }
  function renderParents() {
    return `
      <div class="wrap">
        ${topbar("home")}
        <article class="prose">
          <p class="kicker">Families</p>
          <h2 class="section-title">For families</h2>
          <p>Eight to ten quiet minutes most days is enough. Sit nearby for Primary 1–2. Let older children try first, then review the misses together.</p>
          <h3>A simple routine</h3>
          <ul>
            <li>Use Practice mode until the child can explain a miss.</li>
            <li>Try Today’s plan or Daily Challenge when you are short of time.</li>
            <li>Open My progress to see which subjects need another look.</li>
            <li>WhatsApp parent recap shares a short summary from this device — scores are not sent to a website.</li>
          </ul>
          <div class="callout"><strong>No account required.</strong> Type a first name and play as a guest. Progress stays on this phone. Google Sign-In is optional.</div>
          <p>This is practice, not a school report card. A low score means “try this topic again”, not “you are behind.”</p>
          <div class="home-actions">
            <button class="btn btn-primary" data-go="home">Start at home</button>
            <button class="btn btn-ghost" data-go="privacy">Privacy</button>
          </div>
        </article>
        ${siteFooter()}${toastEl()}
      </div>`;
  }
  function renderWhy() {
    return `
      <div class="wrap">
        ${topbar("home")}
        <article class="prose">
          <p class="kicker">Learning science</p>
          <h2 class="section-title">Why this works</h2>
          <p>The design follows well-established findings in educational psychology. It is not a replacement for a teacher, and it has not been claimed as a randomised trial of this app.</p>
          <p>Items are original practice MCQs that get harder from Primary 1 to Primary 6. They are not past questions from NERDC, WAEC or any ministry paper.</p>
          <h3>Retrieval practice</h3>
          <p>Trying to answer a question — even when it is hard — strengthens memory more than re-reading notes. Practice and Daily Challenge are built for that.</p>
          <p class="cite">Roediger, H. L., &amp; Karpicke, J. D. (2006). Test-enhanced learning. <em>Psychological Science</em>.</p>
          <h3>Corrective feedback</h3>
          <p>Practice mode marks at once and shows why. Exam mode withholds that until the end, which is closer to a real paper. Both have a place.</p>
          <p class="cite">Black, P., &amp; Wiliam, D. (1998). Assessment and classroom learning. <em>Assessment in Education</em>.</p>
          <h3>Spacing and return</h3>
          <p>Short sessions across days beat one long cram. Missed items are saved so the same idea can be tried again later.</p>
          <p class="cite">Dunlosky, J., et al. (2013). Improving students’ learning with effective learning techniques. <em>Psychological Science in the Public Interest</em>.</p>
          <h3>Interleaving</h3>
          <p>Champion Mix and Smart Practice mix topics. Switching subjects is harder in the moment and often better for later recall.</p>
          <div class="callout"><strong>Use with a grown-up nearby for younger pupils.</strong> The explanation after a miss is the lesson — not the XP.</div>
          <div class="home-actions">
            <button class="btn btn-primary" data-go="teachers">For teachers</button>
            <button class="btn btn-ghost" data-go="home">Start practising</button>
          </div>
        </article>
        ${siteFooter()}${toastEl()}
      </div>`;
  }
  function renderAccess() {
    return `
      <div class="wrap">
        ${topbar("home")}
        <article class="prose">
          <p class="kicker">Inclusion</p>
          <h2 class="section-title">Accessibility</h2>
          <p>The quiz should be usable in a classroom, at home, and with a keyboard only. Settings stay on this device.</p>
          <ul>
            <li><strong>Keyboard:</strong> A–D or 1–4 to answer, H hint, F flag, P pause, N or Enter next, ? help, Esc closes help.</li>
            <li><strong>Read aloud:</strong> tap 🔊 on a question. Auto-read is optional in Settings.</li>
            <li><strong>Display:</strong> larger text, more line spacing, high contrast, dark mode, match the phone’s light/dark, reduce motion, focus mode.</li>
            <li><strong>Touch:</strong> main buttons are at least 48px. After an answer, swipe left for next (not in Exam mode).</li>
            <li><strong>Skip link:</strong> “Skip to content” appears when you tab from the top of the page.</li>
            <li><strong>No account:</strong> guests can play with a first name. Google is optional.</li>
          </ul>
          <p>If something blocks a pupil in your class, use Practice mode, Larger text and Read aloud first. Print papers remain available when a screen is not the right tool.</p>
          <div class="home-actions">
            <button class="btn btn-primary" data-go="settings">Open settings</button>
            <button class="btn btn-ghost" data-action="open-help">Keyboard help</button>
          </div>
        </article>
        ${siteFooter()}${toastEl()}
      </div>`;
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
      { title: "Welcome", body: "Free practice for Primary 1–6. Short quizzes, explanations and printable papers. No ads.", img: "images/mascot.png" },
      { title: "How we learn", body: "Practice marks at once. Exam waits until the end. Tap 🔊 to hear a question. Missed items are saved to try again.", img: "images/owl-yes.jpg" },
      { title: "You’re ready", body: "Type a first name, or play as a guest. Teachers can print papers and a learning report from the class screen.", img: "images/trophy.png" }
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
           <div><strong>Continue quiz</strong><p>${esc(subjectName(resume.subject))} · ${esc(resume.mode || "practice")} · Q${(resume.index || 0) + 1}/${resume.questions.length}</p></div>
           <button class="btn btn-sun" data-action="resume">Resume</button>
         </div>` : "";
    return `
      <div class="wrap">
        ${updateBanner()}
        ${installBanner()}
        ${topbar(null)}
        ${onboardEl()}
        ${helpEl()}
        ${cont}
        ${state.name && state.grade ? `<div class="continue-banner">
           <div><strong>Back to class</strong><p>${esc(window.GRADE_INFO[state.grade].label)} · ${esc(state.name)}</p></div>
           <button class="btn btn-primary" data-action="jump-class">Open</button>
         </div>` : ""}
        ${profileRow()}
        <section class="hero">
          <div>
            <div class="kicker">${esc(greeting())} · Primary 1–6 · Offline ready</div>
            <h1>Primary Super Quiz</h1>
            <p class="lead">Calm, free practice for English-medium primary classrooms — designed around Nigerian Primary 1–6, with explanations, missed-item review and printable papers. No ads.</p>
            <div class="stats">
              <span class="chip">${nSub} subjects</span>
              <span class="chip">9,600 questions</span>
              <span class="chip">Exam · Timed · Daily</span>
              <span class="chip">Works offline</span>
            </div>
            <div class="hero-cta">
              <button class="btn btn-primary" data-action="start">Start practising →</button>
              <button class="btn btn-ghost" data-go="teachers">For teachers</button>
            </div>
          </div>
          <div class="hero-art">
            <img src="images/hero-kids.jpg" alt="Children taking a quiz together">
            <span class="art-badge">Primary 1–6</span>
          </div>
        </section>
        <div class="home-grid">
          ${rankCard()}
          ${weekCard()}
        </div>
        <div class="home-stats">
          <div class="stat-tile"><b>${progress.xp}</b><span>XP</span></div>
          <div class="stat-tile"><b>${progress.streak}🔥</b><span>Day streak</span></div>
          <div class="stat-tile"><b>${progress.quizzes}</b><span>Quizzes</span></div>
          <div class="stat-tile"><b>${accuracyPct() == null ? "—" : accuracyPct() + "%"}</b><span>Accuracy</span></div>
          <div class="stat-tile"><b>${fmtDur(todayStudy())}</b><span>Today</span></div>
        </div>
        ${streakDots()}
        <div class="play-row">
          <button class="play-tile daily" data-action="daily">
            <span>☀️</span>
            <strong>Daily Challenge</strong>
            <p>${dailyEta()}</p>
          </button>
          <button class="play-tile smart" data-action="smart">
            <span>🧠</span>
            <strong>Smart Practice</strong>
            <p>Coach picks your weak spots</p>
          </button>
          <button class="play-tile bolt" data-action="lightning">
            <span>⚡</span>
            <strong>Lightning 5</strong>
            <p>Five questions · 12 seconds each</p>
          </button>
        </div>
        ${coachCard()}
        ${planCard()}
        <div class="home-panel panel-rel">
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
        <section class="trust-row" aria-label="Highlights">
          <div><b>16</b><span>subjects</span></div>
          <div><b>9,600</b><span>questions</span></div>
          <div><b>P1–P6</b><span>every class</span></div>
          <div><b>Offline</b><span>after first visit</span></div>
        </section>
        <h2 class="section-title" style="margin-top:28px">How it works</h2>
        <div class="how-grid">
          <article><span>1</span><h3>Pick your class</h3><p>Primary 1 to 6. The questions match the year.</p></article>
          <article><span>2</span><h3>Choose a subject</h3><p>English, Maths, Science and 13 more — 100 each.</p></article>
          <article><span>3</span><h3>Review and return</h3><p>Read why, retry misses, print a learning report.</p></article>
        </div>
        <section class="pedagogy" aria-label="How this helps learning">
          <div><b>Retrieve</b><span>Answering beats re-reading notes.</span></div>
          <div><b>Correct</b><span>Practice mode explains at once.</span></div>
          <div><b>Return</b><span>Missed items are saved for another try.</span></div>
        </section>
        <div class="audience">
          <div class="aud-card">
            <h3>Pupils</h3>
            <p>Short quizzes, hints, Daily Challenge and Read aloud. A streak on this device — not a public leaderboard.</p>
          </div>
          <button class="aud-card" type="button" data-go="teachers">
            <h3>Teachers</h3>
            <p>Lesson starters, printable papers with an answer key, and a report of strengths and gaps.</p>
          </button>
          <button class="aud-card" type="button" data-go="parents">
            <h3>Families</h3>
            <p>Eight quiet minutes most days. No account required. Scores stay on this phone.</p>
          </button>
        </div>
        ${siteFooter()}
        ${toastEl()}
      </div>`;
  }

  function renderGrades() {
    const stats = {};
    (progress.history || []).forEach(function (h) {
      const gg = h.grade;
      if (!stats[gg]) stats[gg] = { n: 0, best: 0 };
      stats[gg].n += 1;
      if ((h.pct || 0) > stats[gg].best) stats[gg].best = h.pct;
    });
    const cards = [1, 2, 3, 4, 5, 6].map(function (g) {
      const info = window.GRADE_INFO[g];
      const st = stats[g];
      const meta = st
        ? st.n + " quiz" + (st.n === 1 ? "" : "zes") + " · best " + st.best + "% " + gradeLetter(st.best).mark
        : "Not started yet";
      return `
        <button class="card-btn g${g}${state.grade === g ? " on" : ""}" data-grade="${g}">
          <div class="grade-no">${g}</div>
          <h3>${info.label}</h3>
          <p>${info.ages} · ${info.blurb}</p>
          <p class="grade-meta">${state.grade === g ? "Your class · " : ""}${meta}</p>
        </button>`;
    }).join("");
    return `
      <div class="wrap">
        ${topbar("home")}
        ${crumbs([{ label: "Home", go: "home" }, { label: "Class" }])}
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
    }).join("") + `<button class="filter-chip ${state.group === "fav" ? "on" : ""}" data-group="fav">★ Fav</button>`;
    const cards = Object.keys(window.SUBJECTS).filter(function (k) {
      const s = window.SUBJECTS[k];
      if (state.group === "fav") { if (!isFav(k)) return false; }
      else if (state.group !== "all" && s.group !== state.group) return false;
      if (q && (s.name + s.short).toLowerCase().indexOf(q) < 0) return false;
      return true;
    }).map(function (k) {
      const s = window.SUBJECTS[k];
      const best = progress.best[g + "/" + k];
      const star = best ? "★".repeat(starsFor(best.pct)) + "☆".repeat(3 - starsFor(best.pct)) : "☆☆☆";
      const fav = isFav(k);
      return `
        <div class="subj-wrap">
          <button type="button" class="fav-pin ${fav ? "on" : ""}" data-fav="${k}" aria-pressed="${fav}" aria-label="${fav ? "Unstar" : "Star"} ${s.name}">${fav ? "★" : "☆"}</button>
          <button class="card-btn subject-card" style="--accent:hsl(${s.hue},55%,38%)" data-pick-subject="${k}">
            <div class="subj-icon">${s.icon}</div>
            <h3>${s.name}</h3>
            <p>100 questions · <span class="stars-mini">${star}</span>${best ? " " + best.pct + "%" : ""}</p>
            ${best ? `<div class="mastery" aria-hidden="true"><i style="width:${Math.max(6, best.pct)}%"></i></div>` : ""}
          </button>
        </div>`;
    }).join("");
    const missedN = (progress.missed[g] || []).length;
    return `
      <div class="wrap">
        ${topbar("grade")}
        ${crumbs([{ label: "Home", go: "home" }, { label: "Class", go: "grade" }, { label: window.GRADE_INFO[g].label }])}
        <p class="kicker">${window.GRADE_INFO[g].label}</p>
        <h2 class="section-title">Choose a subject</h2>
        <input class="search" id="subj-search" type="search" placeholder="Search subjects…" value="${esc(state.query)}">
        <div class="filter-row">${chips}</div>
        <div class="grid-subjects">
          ${cards || (state.group === "fav"
            ? `<div class="empty-state" style="grid-column:1/-1"><strong>No favourites yet</strong><p>Tap the star on a subject you use often. It will stay on this device.</p></div>`
            : "<p class='sub'>No subjects match.</p>")}
          ${state.group === "fav" || q ? "" : `<button class="card-btn mix-card" data-pick-subject="mix">
            <div><h3>Champion Mix 🏆</h3><p>A mixed paper from every subject in this class.</p></div>
            <span class="btn btn-sun" style="pointer-events:none">Play mix</span>
          </button>
          <button class="card-btn smart-card" data-pick-subject="smart">
            <div><h3>Smart Practice 🧠</h3><p>Missed questions plus your weakest subjects.</p></div>
            <span class="btn btn-primary" style="pointer-events:none">Coach pick</span>
          </button>`}
        </div>
        <div class="teacher-row no-print">
          <div>
            <strong>Practice missed · Teachers</strong>
            <p class="sub" style="margin:0">${missedN} saved mistakes for this class. Print an 80-question paper with answers.</p>
          </div>
          <div class="ghost-row">
            <button class="btn btn-ghost" data-pick-subject="missed" ${missedN ? "" : "disabled"}>Retry missed</button>
            <button class="btn btn-ghost" data-action="print-homework" ${missedN ? "" : "disabled"}>Print homework</button>
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
      return `<button class="${cls}" data-length="${n}"><strong>${n}</strong><span>${label}</span><em>~${etaMinutes(n)} min</em></button>`;
    }).join("");
    const modes = [
      { id: "practice", title: "Practice", desc: "Formative: mark and explain at once. Best for teaching." },
      { id: "exam", title: "Exam", desc: "No hints until the end. Use for a mock paper." },
      { id: "timed", title: "Timed", desc: secondsFor() + " seconds each. Builds pace, not a race." }
    ].map(function (m) {
      return `<button class="mode-card ${state.mode === m.id ? "on" : ""}" data-mode="${m.id}"><h4>${m.title}</h4><p>${m.desc}</p></button>`;
    }).join("");
    return `
      <div class="wrap">
        ${topbar("subject")}
        ${crumbs([{ label: "Home", go: "home" }, { label: "Class", go: "grade" }, { label: "Subjects", go: "subject" }, { label: name }])}
        <p class="kicker">${window.GRADE_INFO[state.grade].label} · ${esc(name)}</p>
        <h2 class="section-title">Set up your quiz</h2>
        <p class="sub">Choose a purpose and length. About ${etaMinutes(state.length)} minutes. Practice grades are for learning, not a school report.</p>
        <div class="mode-grid">${modes}</div>
        <div class="length-grid">${buttons}</div>
        <div class="setup-meta">
          <span>${state.length} questions</span>
          <span>${esc(state.mode)}</span>
          <span>~${etaMinutes(state.length)} min</span>
        </div>
        <div style="margin-top:16px">
          <button class="btn btn-primary" data-action="begin" ${state.loading ? "disabled" : ""}>${state.loading ? "Loading…" : "Start quiz →"}</button>
        </div>
        ${state.error ? `<div class="feedback no" style="margin-top:12px"><p>${esc(state.error)}</p><button class="btn btn-ghost" data-action="begin" style="margin-top:8px">Try again</button></div>` : ""}
        ${toastEl()}
      </div>`;
  }

  function renderQuiz() {
    const q = state.questions[state.index];
    if (!q) return `<div class="wrap">${topbar("length")}<div class="empty-state"><strong>No questions</strong><p>This paper did not load. Go back and try again.</p><button class="btn btn-primary" data-go="length">Back to setup</button></div></div>`;
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
        <button class="${cls}" data-opt="${i}" ${state.revealed && !exam ? "disabled" : ""} ${exam && state.picked[state.index] === i ? "aria-pressed=\"true\"" : ""}>
          <span class="badge">${LETTERS[i]}</span>
          <span>${esc(opt)}</span>
        </button>`;
    }).join("");
    let feedback = "";
    if (showMark) {
      const ok = state.picked[state.index] === q.answer;
      feedback = `<div class="feedback ${ok ? "ok" : "no"}" role="status">${ok ? "Yes! " : "Not quite. The answer is <strong>" + esc(q.options[q.answer]) + "</strong>. "}${q.explain ? `<p class="explain-label"><span class="kicker">Explanation</span> ${esc(q.explain)}</p>` : ""}</div>`;
    }
    const canNext = exam ? state.picked[state.index] != null || state.revealed : state.revealed;
    const nextLabel = state.index === total - 1 ? "See my score" : "Next →";
    const timer = state.mode === "timed"
      ? `<div class="timer-wrap ${state.timer <= 8 ? "warn" : ""}">⏱ ${state.paused ? "Paused" : state.timer + "s"}</div>
         <button class="life" data-action="${state.paused ? "resume-quiz" : "pause-quiz"}">${state.paused ? "▶ Resume" : "⏸ Pause"}</button>` : "";
    return `
      <div class="wrap${settings.focus ? " focus-quiz" : ""}">
        ${topbar("length")}
        ${crumbs([{ label: "Home", go: "home" }, { label: subjectName(state.subject) }, { label: "Q" + (state.index + 1) }])}
        ${helpEl()}
        <div class="quiz-head">
          <div class="progress-meta">${iconFor(q.subject || state.subject)} ${esc(subj ? subj.name : subjectName(state.subject))} · P${state.grade}</div>
          <div class="ghost-row">
            ${state.combo >= 2 ? `<span class="combo">🔥 x${state.combo}</span>` : ""}
            ${timer}
            <div class="progress-meta" id="sess-clock">🕒 ${fmtClock((Date.now() - (state.quizStartedAt || Date.now())) / 1000)}</div>
            <div class="progress-meta">${state.index + 1} / ${total}</div>
          </div>
        </div>
        ${state.paused ? `<div class="pause-banner">Quiz paused. Timer is stopped.</div>` : ""}
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Quiz progress"><span style="width:${pct}%"></span></div>
        <div class="q-card">
          <div class="q-label">Question ${state.index + 1} of ${total} · ${state.lightning ? "lightning" : state.mode}</div>
          <h2 class="question">${esc(q.q)}</h2>
          <div class="options">${options}</div>
          ${state.hintText && !showMark ? `<div class="hint-box">💡 ${esc(state.hintText)}</div>` : ""}
          ${feedback}
          <div class="lifelines">
            <button class="life life-speak" data-action="speak">🔊 Read aloud</button>
            <button class="life" data-action="hint" ${state.usedHint || exam || showMark ? "disabled" : ""}>Hint</button>
            <button class="life" data-action="fifty" ${state.used5050 || exam ? "disabled" : ""}>50 / 50</button>
            <button class="life" data-action="skip" ${state.usedSkip ? "disabled" : ""}>Skip</button>
            <button class="life ${state.flagged[state.index] ? "on" : ""}" data-action="flag">${state.flagged[state.index] ? "★ Flagged" : "☆ Flag"}</button>
          </div>
          <div class="quiz-actions">
            ${canNext ? `<button class="btn btn-primary" data-action="next">${nextLabel}</button>` : ""}
            <button class="btn btn-ghost" data-action="quit-quiz">Quit</button>
          </div>
          <p class="key-hint no-print">Tip: A–D to answer · H hint · F flag · P pause · 🔊 reads the question</p>
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
    const gl = gradeLetter(pct);
    const primaryNext = total - n
      ? `<button class="btn btn-primary" data-action="practice-missed">Practice missed</button>`
      : `<button class="btn btn-primary" data-action="coach-play">Next practice</button>`;
    return `
      <div class="wrap">
        ${topbar("subject")}
        <div class="result">
          ${img}
          <p class="kicker">${window.GRADE_INFO[state.grade].label} · ${esc(subjectName(state.subject))} · ${state.lightning ? "lightning" : state.mode}</p>
          <h2 class="section-title">${esc(state.name || "Well done")}</h2>
          <div class="letter-mark" aria-label="Grade ${gl.mark}, ${gl.label}">${gl.mark}</div>
          <p class="letter-label">${esc(gl.label)}</p>
          <div class="score-num">${n}<span style="font-size:.45em;color:var(--muted)"> / ${total}</span></div>
          <div class="metric-grid">
            <div><b>${pct}%</b><span>Score</span></div>
            <div><b>${stars}★</b><span>Stars</span></div>
            <div><b>x${state.maxCombo || 0}</b><span>Best combo</span></div>
            <div><b>${state.elapsedSec ? fmtClock(state.elapsedSec) : "—"}</b><span>Time</span></div>
          </div>
          <p class="xp-pop">+${state.xpGained} XP · Total ${progress.xp}</p>
          ${state.rankedUp ? `<div class="rank-up">${state.rankedUp.icon} New rank: <strong>${esc(state.rankedUp.name)}</strong></div>` : ""}
          <p class="score-msg">${messageFor(pct)}</p>
          <p class="learn-next">${nextLearnStep(pct, total - n)}</p>
          <p class="scale-note">${gradeScaleNote()}</p>
          ${total < 20 ? `<p class="scale-note">A ${total}-question paper is a snapshot. Use Review and a longer paper before judging mastery.</p>` : total < 40 ? `<p class="scale-note">This is a short paper. A longer set gives a steadier picture of what is secure.</p>` : ""}
          <div class="split-bar" aria-hidden="true"><i style="width:${pct}%"></i></div>
          <p class="sub" style="margin:8px 0 0">${n} correct · ${total - n} to review</p>
          ${badges ? `<div class="stats" style="justify-content:center">${badges}</div>` : ""}
          <div class="actions">
            ${primaryNext}
            <button class="btn btn-ghost" data-action="review">Review answers</button>
            <button class="btn btn-sun" data-action="whatsapp">WhatsApp</button>
            <button class="btn btn-ghost" data-action="speak">🔊 Read score</button>
            <button class="btn btn-ghost" data-action="certificate">Certificate</button>
            <button class="btn btn-ghost" data-action="share">Share</button>
            <button class="btn btn-ghost" data-action="again">Play again</button>
            <button class="btn btn-ghost" data-go="subject">New subject</button>
          </div>
        </div>
        ${toastEl()}
      </div>`;
  }

  function renderReview() {
    const filter = state.reviewFilter || "all";
    const qy = (state.reviewQuery || "").toLowerCase();
    const missedN = state.questions.filter(function (q, i) { return state.picked[i] !== q.answer; }).length;
    const items = state.questions.map(function (q, i) {
      const ok = state.picked[i] === q.answer;
      if (filter === "missed" && ok) return "";
      if (filter === "correct" && !ok) return "";
      if (filter === "flagged" && !state.flagged[i]) return "";
      if (qy && (q.q + " " + q.options.join(" ") + " " + (q.explain || "")).toLowerCase().indexOf(qy) < 0) return "";
      const opts = q.options.map(function (opt, oi) {
        let cls = "rev-opt";
        if (oi === q.answer) cls += " good";
        else if (oi === state.picked[i]) cls += " bad";
        return `<div class="${cls}"><b>${LETTERS[oi]}</b> ${esc(opt)}</div>`;
      }).join("");
      return `
        <article class="review-item">
          <span class="tag ${ok ? "ok" : "no"}">${ok ? "Correct" : "Missed"}</span>${state.flagged[i] ? `<span class="tag">★ Flagged</span>` : ""}
          <h4>${i + 1}. ${esc(q.q)}</h4>
          <div class="review-opts">${opts}</div>
          <p class="explain-label" style="color:var(--muted);margin-top:8px"><span class="kicker">Explanation</span> ${esc(q.explain)}</p>
        </article>`;
    }).join("") || `<div class="empty-state"><strong>Nothing in this filter</strong><p>Try All, or search a word from the question.</p></div>`;
    return `
      <div class="wrap">
        ${topbar("result")}
        <h2 class="section-title">Answer review</h2>
        <p class="sub">Read why each answer is right, then try again.</p>
        <input class="search" id="review-search" type="search" placeholder="Search this paper…" value="${esc(state.reviewQuery || "")}">
        <div class="filter-row">
          <button class="filter-chip ${filter === "all" ? "on" : ""}" data-filter="all">All ${state.questions.length}</button>
          <button class="filter-chip ${filter === "missed" ? "on" : ""}" data-filter="missed">Missed ${missedN}</button>
          <button class="filter-chip ${filter === "correct" ? "on" : ""}" data-filter="correct">Correct ${state.questions.length - missedN}</button>
          <button class="filter-chip ${filter === "flagged" ? "on" : ""}" data-filter="flagged">Flagged ${Object.keys(state.flagged || {}).length}</button>
        </div>
        ${items}
        <div class="actions" style="margin-top:8px">
          <button class="btn btn-primary" data-go="result">Back to score</button>
          ${missedN ? `<button class="btn btn-sun" data-action="practice-missed">Practice missed</button>` : ""}
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
    const gl = gradeLetter(pct);
    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="result" aria-label="Back">${svgIco("back")}</button>
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
            ${schoolName() ? `<p>${esc(schoolName())}</p>` : ""}
            <p>has completed the <strong>${esc(subjectName(state.subject))}</strong> quiz<br>for <strong>${window.GRADE_INFO[state.grade].label}</strong></p>
            <div class="cert-grade" aria-label="Grade ${gl.mark}">${gl.mark}</div>
            <p class="letter-label">${esc(gl.label)}</p>
            <p style="margin:8px 0;font-weight:800;font-size:20px">${n} / ${total} · ${pct}%</p>
            <p>${todayPretty()} · ${state.xpGained} XP earned</p>
            <p style="margin-top:18px;font-weight:800;color:var(--teal)">Well done — keep learning.</p>
            <p class="cert-copy">Independent practice · not an official examination · © merebari web 2026</p>
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
      const pick = state.grade ? `type="button" data-pick-subject="${k}" aria-label="Practise ${esc(s.name)}"` : "";
      const tag = state.grade ? "button" : "div";
      return `<${tag} class="dash-cell" ${pick} title="${esc(s.name)}"><span class="ico">${s.icon}</span>${s.short}<div class="stars-mini">${"★".repeat(st)}${"☆".repeat(3 - st)}</div></${tag}>`;
    }).join("");
    const badges = window.BADGES.map(function (b) {
      const on = progress.badges.indexOf(b.id) >= 0;
      return `<div class="badge-card ${on ? "" : "off"}"><div class="bi">${b.icon}</div><h4>${b.name}</h4><p>${b.desc}</p></div>`;
    }).join("");
    const recent = (progress.history || []).slice(0, 8).map(function (h) {
      return `<li>${h.date} · P${h.grade} ${esc(subjectName(h.subject))} · ${h.score}/${h.total} (${h.pct}% ${gradeLetter(h.pct).mark})</li>`;
    }).join("");
    const empty = !progress.quizzes
      ? `<div class="empty-state">
           <strong>Your first star is waiting</strong>
           <p>Take a short practice quiz. Scores, badges and this week’s chart will appear here.</p>
           <button class="btn btn-primary" data-action="start">Start practising →</button>
         </div>`
      : "";
    return `
      <div class="wrap">
        ${topbar("home")}
        <p class="kicker">${esc(state.name || "Pupil")}</p>
        <h2 class="section-title">My progress</h2>
        ${empty}
        <div class="home-stats">
          <div class="stat-tile"><b>${progress.xp}</b><span>XP</span></div>
          <div class="stat-tile"><b>${progress.streak}</b><span>Streak</span></div>
          <div class="stat-tile"><b>${progress.badges.length}/${window.BADGES.length}</b><span>Badges</span></div>
          <div class="stat-tile"><b>${accuracyPct() == null ? "—" : accuracyPct() + "%"}</b><span>Accuracy</span></div>
          <div class="stat-tile"><b>${fmtDur(progress.studySec || 0)}</b><span>Study time</span></div>
        </div>
        <p class="sub" style="margin-top:18px">Mastery for Primary ${g} (pick a class first for other years).</p>
        <div class="dash-grid">${cells}</div>
        <h3 class="section-title" style="font-size:24px;margin-top:28px">Badges</h3>
        <div class="badge-grid">${badges}</div>
        <h3 class="section-title" style="font-size:24px;margin-top:28px">This week</h3>
        ${weekActivity()}
        <h3 class="section-title" style="font-size:24px;margin-top:28px">Recent</h3>
        ${recent ? `<ul class="sub">${recent}</ul>` : `<p class="sub">No quizzes yet — start one and it will show here.</p>`}
        <div class="actions" style="margin-top:16px">
          <button class="btn btn-primary" data-go="report">Teacher report</button>
          <button class="btn btn-sun" data-action="parent-recap">WhatsApp parent</button>
        </div>
        ${siteFooter()}
        ${toastEl()}
      </div>`;
  }

  function renderReport() {
    ensureWeek();
    const r = rankFor(progress.xp);
    const g = state.grade || 1;
    const mastery = masteryList(g);
    const tried = mastery.filter(function (r) { return r.pct != null; }).slice().sort(function (a, b) { return a.pct - b.pct; });
    const gaps = tried.slice(0, 3);
    const strengths = tried.slice().sort(function (a, b) { return b.pct - a.pct; }).slice(0, 3);
    const allRows = mastery.slice().sort(function (a, b) {
      const ap = a.pct == null ? -1 : a.pct;
      const bp = b.pct == null ? -1 : b.pct;
      return bp - ap;
    }).map(function (r) {
      const gl = r.pct == null ? "—" : gradeLetter(r.pct).mark;
      return `<tr><td>${r.icon} ${esc(r.name)}</td><td>${r.pct == null ? "Not yet" : r.pct + "%"}</td><td>${r.pct == null ? "—" : r.score + "/" + r.total}</td><td>${gl}</td></tr>`;
    }).join("");
    const rows = (progress.history || []).slice(0, 20).map(function (h) {
      return `<tr><td>${esc(h.date)}</td><td>P${h.grade}</td><td>${esc(subjectName(h.subject))}</td><td>${h.mode}</td><td>${h.score}/${h.total}</td><td>${h.pct}% ${gradeLetter(h.pct).mark}</td></tr>`;
    }).join("") || `<tr><td colspan="6">No quizzes yet.</td></tr>`;
    const avg = (progress.history || []).length
      ? Math.round((progress.history.reduce(function (s, h) { return s + (h.pct || 0); }, 0) / progress.history.length))
      : 0;
    const rec = !tried.length
      ? "Begin with a 10-question Practice paper in English or Mathematics."
      : (gaps.length
        ? "Next: short Practice papers in " + gaps.map(function (r) { return r.name; }).join(", ") + "."
        : "Coverage is even. Stretch with a longer paper or an exam-mode mock.");
    return `
      <div class="wrap report">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="dashboard" aria-label="Back">${svgIco("back")}</button>
          <button class="btn btn-primary" data-action="print">Print report</button>
        </div>
        <header class="exam-head">
          <h2>Primary Super Quiz — Learning report</h2>
          <p>${esc(state.name || "Pupil")}${schoolName() ? " · " + esc(schoolName()) : ""} · ${window.GRADE_INFO[g].label}</p>
          <p>${esc(r.icon + " " + r.name)} · ${progress.xp} XP · ${todayPretty()}</p>
        </header>
        <div class="exam-meta">
          <span>Quizzes: ${progress.quizzes}</span>
          <span>Streak: ${progress.streak} days</span>
          <span>Average: ${avg}%${avg ? " " + gradeLetter(avg).mark : ""}</span>
          <span>This week: ${progress.weekQuizzes || 0}/${window.WEEK_GOAL || 5}</span>
          <span>Study time: ${fmtDur(progress.studySec || 0)}</span>
        </div>
        ${!progress.quizzes ? `<div class="empty-state no-print"><strong>No quizzes yet</strong><p>Play a paper and this report will fill in for a parent or teacher.</p></div>` : ""}
        <p class="callout"><strong>Recommended next step.</strong> ${esc(rec)}</p>
        ${strengths.length ? `<h3 class="exam-block">Strengths</h3><p>${strengths.map(function (r) { return r.name + " " + r.pct + "% " + gradeLetter(r.pct).mark; }).join(" · ")}</p>` : ""}
        ${gaps.length ? `<h3 class="exam-block">Gaps to revisit</h3><p>${gaps.map(function (r) { return r.name + " " + r.pct + "% " + gradeLetter(r.pct).mark; }).join(" · ")}</p>` : ""}
        <h3 class="exam-block">Mastery by subject (Primary ${g})</h3>
        <div class="table-scroll">
        <table class="report-table">
          <thead><tr><th>Subject</th><th>Best</th><th>Score</th><th>Grade</th></tr></thead>
          <tbody>${allRows}</tbody>
        </table>
        </div>
        <h3 class="exam-block">Recent quizzes</h3>
        <div class="table-scroll">
        <table class="report-table">
          <thead><tr><th>Date</th><th>Class</th><th>Subject</th><th>Mode</th><th>Score</th><th>%</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        </div>
        <p class="note-box">Independent practice on this device. Not a standardised test or official school grade. ${gradeScaleNote()} Badges: ${progress.badges.length}/${window.BADGES.length}.</p>
        <p class="site-foot">© merebari web 2026</p>
      </div>`;
  }

  function renderAccount() {
    const u = state.user;
    return `
      <div class="wrap">
        ${topbar("home")}
        <h2 class="section-title">Account</h2>
        <p class="sub">Progress stays on this device. Google is optional.</p>
        ${u ? `
          <div class="signed-box" style="margin:16px 0">
            <img class="signed-pic" referrerpolicy="no-referrer" src="${esc(u.picture || "images/icon-192.png")}" alt="">
            <div>
              <strong>${esc(u.name)}</strong>
              <p class="sub" style="margin:0">${esc(u.email)}</p>
            </div>
          </div>
          <p class="sub">${progress.xp} XP · ${progress.quizzes} quizzes on this phone.</p>
          <button class="btn btn-coral" data-action="signout">Sign out</button>
        ` : `
          <div class="signed-box" style="margin:16px 0">
            <div>
              <strong>${esc(state.name || "Guest")}</strong>
              <p class="sub" style="margin:0">${progress.xp} XP · saved on this device</p>
            </div>
          </div>
          <p class="sub">Sign in with Google to label this phone’s scores. Younger pupils can skip this and keep playing as a guest.</p>
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
        <p class="set-head">Sound</p>
        <div class="settings-list">
          ${row("sound", "Sound effects")}
          ${row("music", "Soft background music")}
          ${row("tts", "Auto-read each question")}
        </div>
        <p class="set-head">Display</p>
        <div class="settings-list">
          ${row("dark", "Dark mode")}
          ${row("autoDark", "Match phone light / dark")}
          ${row("large", "Larger text")}
          ${row("contrast", "High contrast")}
          ${row("focus", "Focus mode in quizzes")}
          ${row("calm", "Reduce motion")}
          ${row("readable", "More line spacing")}
        </div>
        <p class="set-head">Classroom</p>
        <p class="sub">Focus mode, larger text and extra line spacing help on a shared screen. School name appears on certificates and reports.</p>
        <label class="field" for="school">School name (optional, on certificates)</label>
        <input id="school" class="search" type="text" maxlength="80" placeholder="e.g. St Mary’s Primary School" value="${esc(schoolName())}">
        <button class="btn btn-ghost" data-action="save-school" style="margin-top:8px">Save school</button>
        <p class="set-head">Google</p>
        <p class="sub">Teachers: create an OAuth Client ID, then paste it here. Origins to allow: <code>https://merebari7-web.github.io</code> and <code>http://localhost:8080</code>.</p>
        <label class="field" for="cid">Google Client ID</label>
        <input id="cid" class="search" type="text" placeholder="123456789-abc.apps.googleusercontent.com" value="${esc(cid)}">
        <button class="btn btn-primary" data-action="save-cid" style="margin-top:8px">Save Client ID</button>
        <p class="set-head">Data</p>
        <p class="sub">Save a copy before you change phones. Import restores this pupil’s scores on this device.</p>
        <div class="ghost-row" style="flex-wrap:wrap;margin-bottom:12px">
          <button class="btn btn-ghost" data-action="export-backup">Download backup</button>
          <label class="btn btn-ghost" for="backup-file">Import backup</label>
          <input id="backup-file" type="file" accept="application/json" hidden>
        </div>
        <p class="sub" style="margin-top:16px"><button type="button" data-go="teachers">Teachers</button> · <button type="button" data-go="access">Accessibility</button> · <button type="button" data-go="privacy">Privacy</button> · <button type="button" data-go="about">About</button></p>
        <p class="sub" style="margin-top:22px">Install this quiz on your phone from the browser menu → Add to Home Screen. It works offline after the first visit.</p>
        <button class="btn btn-ghost" data-action="reset-progress">Reset progress</button>
        ${siteFooter()}
        ${toastEl()}
      </div>`;
  }

  function renderHomework() {
    const g = state.grade || 1;
    const missed = (progress.missed[g] || []).slice(-20);
    if (!missed.length) {
      return `<div class="wrap">${topbar("subject")}
        <div class="empty-state">
          <strong>No homework yet</strong>
          <p>Missed questions from this class will appear here as a printable retry sheet.</p>
          <button class="btn btn-primary" data-go="subject">Choose a subject</button>
        </div>
      </div>`;
    }
    const body = missed.map(function (q, i) {
      const opts = (q.options || []).map(function (o, n) {
        return `<div class="exam-opt">${LETTERS[n]}. ${esc(o)}</div>`;
      }).join("");
      return `<article class="exam-q"><p>${i + 1}. ${esc(q.q)}</p>${opts}</article>`;
    }).join("");
    const key = missed.map(function (q, i) {
      const letter = LETTERS[q.answer] || "?";
      return `<div>${i + 1}. ${letter}</div>`;
    }).join("");
    return `
      <div class="wrap">
        <div class="topbar no-print">
          <button class="icon-btn" data-go="subject" aria-label="Back">${svgIco("back")}</button>
          <button class="btn btn-primary" data-action="print">Print homework</button>
        </div>
        <header class="exam-head">
          <h2>Primary Super Quiz — Homework</h2>
          <p>${esc(state.name || "Pupil")}${schoolName() ? " · " + esc(schoolName()) : ""} · ${window.GRADE_INFO[g].label}</p>
          <p>Retry these missed questions. Circle A, B, C or D.</p>
        </header>
        <div class="exam-meta">
          <span>Name: ${esc(state.name || "______________________________")}</span>
          <span>Date: ______________</span>
          <span>Score: ______ / ${missed.length}</span>
        </div>
        ${body}
        <section class="answer-key">
          <h2>Answer key — for the teacher only</h2>
          <div class="key-grid">${key}</div>
        </section>
        <p class="site-foot">© merebari web 2026</p>
      </div>`;
  }
  function renderExam() {
    const paper = state.examPaper;
    if (!paper) {
      return `<div class="wrap">${topbar("subject")}
        <div class="empty-state">
          <strong>${state.loading ? "Preparing the paper…" : "No paper yet"}</strong>
          <p>${state.loading ? "Five questions from each subject — about a minute." : esc(state.error || "Print an exam from the subject screen.")}</p>
          ${state.loading ? "" : `<button class="btn btn-primary" data-action="print-exam">Try again</button>`}
        </div>
      </div>`;
    }
    const g = state.grade;
    let body = "", key = "", total = 0;
    paper.forEach(function (block) {
      body += `<h3 class="exam-block">${esc(block.name)}</h3>`;
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
          <button class="icon-btn" data-go="subject" aria-label="Back">${svgIco("back")}</button>
          <button class="btn btn-primary" data-action="print">Print paper</button>
        </div>
        <header class="exam-head">
          <h2>Primary Super Quiz — Examination Paper</h2>
          <p>${window.GRADE_INFO[g].label}${schoolName() ? " · " + esc(schoolName()) : ""}</p>
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
  function stopClock() { clearInterval(clockTimer); clockTimer = null; }
  function startClock() {
    if (state.screen !== "quiz") return;
    if (clockTimer) return;
    clockTimer = setInterval(function () {
      if (state.screen !== "quiz" || state.paused) return;
      const el = document.getElementById("sess-clock");
      if (el) el.textContent = "🕒 " + fmtClock((Date.now() - (state.quizStartedAt || Date.now())) / 1000);
    }, 1000);
  }

  function startTick() {
    if (state.mode !== "timed" || state.screen !== "quiz" || state.paused) return;
    if (tickTimer) return;
    if (!state.timer || state.timer < 0) state.timer = secondsFor();
    tickTimer = setInterval(function () {
      state.timer -= 1;
      const el = document.querySelector(".timer-wrap");
      if (el) {
        el.textContent = "⏱ " + state.timer + "s";
        el.classList.toggle("warn", state.timer <= 8);
      }
      if (settings.sound && (state.timer === 8 || state.timer === 5 || (state.timer <= 3 && state.timer > 0))) {
        tone(state.timer <= 3 ? 920 : 740, 0.05, "sine", 0.028);
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
      exam: renderExam, homework: renderHomework, dashboard: renderDashboard, settings: renderSettings, account: renderAccount, report: renderReport,
      about: renderAbout, privacy: renderPrivacy, how: renderHow, faq: renderFaq, news: renderNews,
      teachers: renderTeachers, parents: renderParents, why: renderWhy, access: renderAccess
    };
    app.innerHTML = (map[state.screen] || renderHome)();
    document.documentElement.dataset.screen = state.screen || "home";
    const titles = {
      home: "Primary Super Quiz · Primary 1–6 classroom practice",
      about: "About · Primary Super Quiz",
      privacy: "Privacy · Primary Super Quiz",
      how: "How it works · Primary Super Quiz",
      faq: "FAQ · Primary Super Quiz",
      news: "What’s new · Primary Super Quiz",
      dashboard: "My progress · Primary Super Quiz",
      settings: "Settings · Primary Super Quiz",
      account: "Account · Primary Super Quiz",
      grade: "Choose class · Primary Super Quiz",
      subject: "Subjects · Primary Super Quiz",
      length: "Set up quiz · Primary Super Quiz",
      quiz: "Quiz · Primary Super Quiz",
      result: "Results · Primary Super Quiz",
      review: "Answer review · Primary Super Quiz",
      certificate: "Certificate · Primary Super Quiz",
      exam: "Exam paper · Primary Super Quiz",
      homework: "Homework · Primary Super Quiz",
      report: "Learning report · Primary Super Quiz",
      teachers: "For teachers · Primary Super Quiz",
      parents: "For families · Primary Super Quiz",
      why: "Why it works · Primary Super Quiz",
      access: "Accessibility · Primary Super Quiz"
    };
    document.title = titles[state.screen] || "Primary Super Quiz";
    const hashScreens = { home: 1, about: 1, privacy: 1, how: 1, faq: 1, news: 1, settings: 1, dashboard: 1, account: 1, teachers: 1, parents: 1, why: 1, access: 1 };
    if (hashScreens[state.screen]) {
      const h = "#" + state.screen;
      if (location.hash !== h) try { history.replaceState(null, "", h); } catch (e) {}
    }
    app.classList.remove("enter");
    try { void app.offsetWidth; } catch (e) {}
    app.classList.add("enter");
    if (state.loading) {
      const ov = document.createElement("div");
      ov.className = "loading-overlay";
      ov.setAttribute("role", "status");
      ov.setAttribute("aria-live", "polite");
      ov.innerHTML = "<img class=\"boot-mark\" src=\"images/icon-192.png\" alt=\"\"><div class=\"spinner\" aria-hidden=\"true\"></div><p>" + (state.screen === "exam" ? "Preparing the exam paper…" : "Loading questions…") + "</p>";
      app.appendChild(ov);
    }
    if (state.helpOpen && !app.querySelector('[aria-label="Help"]')) {
      app.insertAdjacentHTML("beforeend", helpEl());
    }
    if (state.screen === "home" || state.screen === "account") mountGoogleButton();
    if (state.screen === "home") {
      const input = document.getElementById("pupil-name");
      if (input) {
        input.addEventListener("input", function () { state.name = input.value; });
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") startFromHome(); });
      }
    }
    if (state.screen === "home") {
      const np = document.getElementById("new-pupil");
      if (np) {
        np.focus();
        np.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            const btn = app.querySelector('[data-action="save-profile"]');
            if (btn) btn.click();
          }
        });
      }
      const rp = document.getElementById("rename-pupil");
      if (rp) {
        rp.focus();
        rp.select();
        rp.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            const btn = app.querySelector('[data-action="save-rename"]');
            if (btn) btn.click();
          }
        });
      }
    }
    if (state.screen === "review") {
      const rs = document.getElementById("review-search");
      if (rs) {
        rs.addEventListener("input", function () {
          state.reviewQuery = rs.value;
          const sel = rs.selectionStart;
          render();
          const n = document.getElementById("review-search");
          if (n) { n.focus(); n.setSelectionRange(sel, sel); }
        });
      }
    }
    if (state.screen === "settings") {
      const bf = document.getElementById("backup-file");
      if (bf) {
        bf.addEventListener("change", function () {
          const file = bf.files && bf.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function () {
            try {
              const data = JSON.parse(String(reader.result || "{}"));
              if (!data || !data.progress) { toast("That file is not a Super Quiz backup."); return; }
              progress = Object.assign({}, EMPTY_PROGRESS, data.progress);
              saveProgress();
              if (data.name) { state.name = data.name; localStorage.setItem("psq-name", data.name); }
              if (data.grade) { state.grade = Number(data.grade); localStorage.setItem("psq-grade", String(data.grade)); }
              if (data.school) localStorage.setItem("psq-school", data.school);
              toast("Backup restored.");
              render();
            } catch (err) { toast("Could not read that backup."); }
          };
          reader.readAsText(file);
        });
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
      stopClock();
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
    touchProfile();
    if (state.grade >= 1 && state.grade <= 6) {
      state.screen = "subject";
      prefetchGrade(state.grade);
    } else {
      state.screen = "grade";
    }
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
      state.usedHint = false;
      state.hintText = "";
      state.flagged = {};
      state.combo = 0;
      state.maxCombo = 0;
      state.newBadges = [];
      state.daily = !!opts.daily;
      state.lightning = !!opts.lightning;
      if (state.lightning) {
        state.length = 5;
        state.mode = "timed";
        if (!state.subject || state.subject === "daily") state.subject = "mix";
      }
      state.paused = false;
      state.timer = secondsFor();
      state.reviewFilter = "all";
      state.quizStartedAt = Date.now();
      state.elapsedSec = 0;
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
    state.paused = false;
    state.hintText = "";
    state.timer = secondsFor();
    stopTick();
    hideReact();
    saveResume();
    render();
  }

  function pickOption(i) {
    if (state.paused) return;
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

  function resultShareText() {
    const n = score(); const total = state.questions.length;
    const pct = Math.round((n / Math.max(1, total)) * 100);
    return (state.name || "I") + " scored " + n + "/" + total + " (" + pct + "% · Grade " + gradeLetter(pct).mark +
      ") in " + subjectName(state.subject) + " · Primary " + state.grade + " on Primary Super Quiz!";
  }
  async function shareResult() {
    const text = resultShareText();
    const url = location.href.split("#")[0];
    if (navigator.share) {
      try { await navigator.share({ title: "Primary Super Quiz", text: text, url: url }); return; } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(text + " " + url);
      toast("Copied your result. Paste it anywhere.");
    } catch (e) { toast(text); }
  }
  function shareWhatsApp() {
    const url = location.href.split("#")[0];
    window.open("https://wa.me/?text=" + encodeURIComponent(resultShareText() + " " + url), "_blank");
  }

  let swipeX = 0;
  app.addEventListener("touchstart", function (e) {
    if (state.screen !== "quiz" || !e.changedTouches || !e.changedTouches[0]) return;
    swipeX = e.changedTouches[0].clientX;
  }, { passive: true });
  app.addEventListener("touchend", function (e) {
    if (state.screen !== "quiz" || !e.changedTouches || !e.changedTouches[0]) return;
    const dx = e.changedTouches[0].clientX - swipeX;
    if (dx < -72 && state.revealed && state.mode !== "exam") {
      const btn = app.querySelector('[data-action="next"]');
      if (btn) btn.click();
    }
  }, { passive: true });

  app.addEventListener("click", function (e) {
    const t = e.target.closest("[data-go], [data-action], [data-grade], [data-pick-subject], [data-length], [data-opt], [data-mode], [data-group], [data-toggle], [data-filter], [data-profile], [data-del-profile], [data-fav]");
    if (!t) return;
    ensureAudio();

    if (t.dataset.go) {
      if (state.screen === "quiz" && t.dataset.go !== "quiz") {
        if (!confirm("Leave this quiz? You can resume from home.")) return;
      }
      state.screen = t.dataset.go; render(); return;
    }
    if (t.dataset.profile) {
      switchProfile(t.dataset.profile);
      state.screen = "home";
      render();
      return;
    }
    if (t.dataset.delProfile) {
      const id = t.dataset.delProfile;
      const list = ensureProfiles();
      if (list.length < 2) { toast("Keep at least one pupil on this phone."); return; }
      if (!confirm("Remove this pupil’s scores from this phone?")) return;
      const next = list.filter(function (p) { return p.id !== id; });
      saveProfiles(next);
      try {
        localStorage.removeItem("psq-progress-v3-" + id);
        localStorage.removeItem("psq-resume-v3-" + id);
      } catch (err) {}
      if (localStorage.getItem("psq-profile-id") === id) switchProfile(next[0].id);
      render();
      return;
    }
    if (t.dataset.grade) {
      state.grade = Number(t.dataset.grade);
      localStorage.setItem("psq-grade", String(state.grade));
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
      if (state.pendingLightning) {
        state.pendingLightning = false;
        state.subject = "mix";
        state.length = 5;
        state.mode = "timed";
        beginQuiz({ lightning: true });
        return;
      }
      state.screen = "subject";
      render();
      return;
    }
    if (t.dataset.group) { state.group = t.dataset.group; render(); return; }
    if (t.dataset.filter) { state.reviewFilter = t.dataset.filter; render(); return; }
    if (t.dataset.fav) {
      toggleFav(t.dataset.fav);
      render();
      return;
    }
    if (t.dataset.pickSubject) {
      state.subject = t.dataset.pickSubject;
      if (state.subject && state.subject !== "daily") localStorage.setItem("psq-subject", state.subject);
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
    if (action === "lightning") {
      if (!state.name) { startFromHome(); if (!state.name) return; }
      state.screen = "grade";
      state.pendingLightning = true;
      render();
    }
    if (action === "hint" && !state.usedHint && state.mode !== "exam" && !state.revealed) {
      const qh = state.questions[state.index];
      state.usedHint = true;
      state.hintText = hintFor(qh);
      render();
    }
    if (action === "install" && deferredInstall) {
      deferredInstall.prompt();
      deferredInstall.userChoice.then(function () { deferredInstall = null; render(); }).catch(function () {});
    }
    if (action === "reload") { location.reload(); return; }
    if (action === "open-help") { state.helpOpen = true; render(); return; }
    if (action === "close-help") { state.helpOpen = false; render(); return; }
    if (action === "jump-class") {
      if (!state.grade) { state.screen = "grade"; render(); return; }
      prefetchGrade(state.grade);
      state.screen = "subject";
      render();
    }
    if (action === "parent-recap") {
      const msg = parentRecapText();
      window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
    }
    if (action === "quit-quiz") {
      if (!confirm("Leave this quiz? You can resume from home.")) return;
      stopTick();
      saveResume();
      state.screen = "subject";
      render();
    }
    if (action === "plan-play") {
      if (!state.grade) { state.screen = "grade"; render(); return; }
      state.subject = weakestSubject(state.grade);
      state.length = 10;
      state.mode = "practice";
      beginQuiz({});
    }
    if (action === "print-homework") {
      if (!state.grade) { state.screen = "grade"; render(); return; }
      state.screen = "homework";
      render();
    }
    if (action === "export-backup") {
      try {
        const blob = new Blob([JSON.stringify({
          v: 1,
          saved: new Date().toISOString(),
          name: state.name,
          grade: state.grade,
          school: schoolName(),
          progress: progress
        }, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "primary-super-quiz-backup.json";
        a.click();
        toast("Backup downloaded.");
      } catch (err) { toast("Could not download a backup."); }
    }
    if (action === "coach-play") {
      if (!state.grade) { state.screen = "grade"; render(); return; }
      const missedN = (progress.missed[state.grade] || []).length;
      state.subject = missedN ? "missed" : weakestSubject(state.grade);
      state.length = 20;
      state.mode = "practice";
      beginQuiz({});
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
    if (action === "again") beginQuiz({ daily: state.daily, lightning: state.lightning });
    if (action === "print-exam") buildExam();
    if (action === "print") window.print();
    if (action === "save-cert") saveCertPng();
    if (action === "share") shareResult();
    if (action === "whatsapp") shareWhatsApp();
    if (action === "pause-quiz") { state.paused = true; stopTick(); render(); }
    if (action === "resume-quiz") { state.paused = false; startTick(); render(); }
    if (action === "practice-missed") {
      if (!state.grade) { state.screen = "grade"; render(); return; }
      state.subject = "missed";
      state.length = 20;
      state.mode = "practice";
      beginQuiz({});
    }
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
    if (action === "rename-profile") { state.renamingProfile = true; render(); }
    if (action === "save-rename") {
      const box = document.getElementById("rename-pupil");
      const name = (box ? box.value : "").trim();
      if (!name) { toast("Type a name."); return; }
      state.name = name;
      localStorage.setItem("psq-name", name);
      state.renamingProfile = false;
      touchProfile();
      toast("Name saved.");
      render();
    }
    if (action === "flag") {
      if (state.flagged[state.index]) delete state.flagged[state.index];
      else state.flagged[state.index] = true;
      saveResume();
      render();
    }
    if (action === "add-profile") { state.addingProfile = true; render(); }
    if (action === "save-profile") {
      const box = document.getElementById("new-pupil");
      const name = (box ? box.value : "").trim();
      if (!name) { toast("Type the sibling’s name."); return; }
      const list = ensureProfiles();
      if (list.length >= 6) { toast("This phone already has 6 pupils."); return; }
      touchProfile();
      const id = "p" + Date.now().toString(36);
      list.push({ id: id, name: name, grade: null });
      saveProfiles(list);
      state.addingProfile = false;
      switchProfile(id);
      state.screen = "home";
      render();
    }
    if (action === "save-school") {
      const box = document.getElementById("school");
      localStorage.setItem("psq-school", box ? box.value.trim() : "");
      toast("School name saved for certificates.");
    }
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
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || (e.target && e.target.isContentEditable)) return;
    if (e.key === "Escape") {
      if (state.helpOpen) { state.helpOpen = false; render(); return; }
      if (!localStorage.getItem("psq-onboard-v1")) {
        localStorage.setItem("psq-onboard-v1", "1");
        render();
        return;
      }
      return;
    }
    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      state.helpOpen = !state.helpOpen;
      render();
      return;
    }
    if (state.screen !== "quiz") return;
    if (e.key === "h" || e.key === "H") {
      const btn = app.querySelector('[data-action="hint"]');
      if (btn && !btn.disabled) btn.click();
      return;
    }
    if (e.key === "f" || e.key === "F") {
      const btn = app.querySelector('[data-action="flag"]');
      if (btn) btn.click();
      return;
    }
    if (e.key === "p" || e.key === "P") {
      const btn = app.querySelector('[data-action="pause-quiz"], [data-action="resume-quiz"]');
      if (btn) btn.click();
      return;
    }
    if (state.revealed && state.mode !== "exam" && (e.key === "Enter" || e.key === " " || e.key === "n" || e.key === "N")) {
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
      if (state.screen === "quiz" && state.mode === "timed" && !state.paused) {
        state.paused = true;
        state.autoPaused = true;
        stopTick();
      }
    } else {
      try { if (window.speechSynthesis && speechSynthesis.paused) speechSynthesis.resume(); } catch (e) {}
      if (state.autoPaused) {
        state.autoPaused = false;
        if (state.screen === "quiz") render();
      }
    }
    if (!settings.music || !music) return;
    setMusicGain(document.hidden ? 0 : MUSIC_VOL, 0.2);
  });
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredInstall = e;
    if (state.screen === "home") render();
  });
  window.addEventListener("appinstalled", function () {
    deferredInstall = null;
  });
  window.addEventListener("online", function () { toast("Back online."); });
  window.addEventListener("offline", function () { toast("You’re offline. You can keep playing."); render(); });
  window.addEventListener("beforeprint", function () { if (music) setMusicGain(0, 0.05); });
  window.addEventListener("afterprint", function () {
    if (settings.music && music && !document.hidden) setMusicGain(MUSIC_VOL, 0.3);
  });

  function blockImageCopy(e) {
    const t = e.target;
    if (!t) return;
    const tag = t.tagName;
    if (tag === "IMG" || tag === "CANVAS" || (t.closest && t.closest("img, .hero-art, .react-pop, .certificate, .brand, .mascot-float, .signed-pic, .q-card img"))) {
      e.preventDefault();
    }
  }
  document.addEventListener("contextmenu", blockImageCopy);
  document.addEventListener("dragstart", blockImageCopy);
  document.addEventListener("selectstart", function (e) {
    if (e.target && e.target.tagName === "IMG") e.preventDefault();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(function (reg) {
      if (reg.waiting && navigator.serviceWorker.controller) state.updateReady = true;
      reg.addEventListener("updatefound", function () {
        const w = reg.installing;
        if (!w) return;
        w.addEventListener("statechange", function () {
          if (w.state === "installed" && navigator.serviceWorker.controller) {
            state.updateReady = true;
            if (state.screen === "home") render();
          }
        });
      });
    }).catch(function () {});
  }
  ["images/owl-yes.jpg", "images/owl-no.jpg"].forEach(function (src) {
    const im = new Image(); im.src = src;
  });

  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (settings.autoDark) applyChrome();
    });
  } catch (e) {}
  var HASH_OK = { home: 1, about: 1, privacy: 1, how: 1, faq: 1, news: 1, settings: 1, dashboard: 1, account: 1, teachers: 1, parents: 1, why: 1, access: 1 };
  window.addEventListener("hashchange", function () {
    const s = (location.hash || "").replace("#", "");
    if (HASH_OK[s] && state.screen !== s) { state.screen = s; render(); }
  });
  var boot = (location.hash || "").replace("#", "");
  if (HASH_OK[boot]) state.screen = boot;

  render();
})();
