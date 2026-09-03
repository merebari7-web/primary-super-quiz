window.GRADE_INFO = {
  1: { label: "Primary 1", ages: "6–7 years", blurb: "First steps: letters, numbers and our world." },
  2: { label: "Primary 2", ages: "7–8 years", blurb: "Building blocks of language, maths and community." },
  3: { label: "Primary 3", ages: "8–9 years", blurb: "Times tables, tenses, maps and magnets." },
  4: { label: "Primary 4", ages: "9–10 years", blurb: "Fractions, Nigeria’s story and the body." },
  5: { label: "Primary 5", ages: "10–11 years", blurb: "Percentages, government and good health." },
  6: { label: "Primary 6", ages: "11–12 years", blurb: "Common-entrance practice across every subject." }
};

window.SUBJECTS = {
  english:       { name: "English Language",           short: "English",     icon: "📘", hue: 210, group: "core" },
  maths:         { name: "Mathematics",                short: "Maths",       icon: "➗", hue: 160, group: "core" },
  science:       { name: "Basic Science",              short: "Science",     icon: "🔬", hue: 85,  group: "core" },
  social:        { name: "Social Studies",             short: "Social",      icon: "🌍", hue: 25,  group: "core" },
  civic:         { name: "Civic Education",            short: "Civic",       icon: "🇳🇬", hue: 145, group: "core" },
  computer:      { name: "Computer Studies",           short: "Computer",    icon: "💻", hue: 200, group: "practical" },
  agric:         { name: "Agricultural Science",       short: "Agric",       icon: "🌾", hue: 90,  group: "practical" },
  cca:           { name: "Cultural & Creative Arts",   short: "CCA",         icon: "🎨", hue: 330, group: "practical" },
  phe:           { name: "Physical & Health Education",short: "PHE",         icon: "⚽", hue: 12,  group: "practical" },
  home:          { name: "Home Economics",             short: "Home Econ.",  icon: "🏠", hue: 30,  group: "practical" },
  history:       { name: "History",                    short: "History",     icon: "🏛️", hue: 28,  group: "humanities" },
  verbal:        { name: "Verbal Reasoning",           short: "Verbal",      icon: "🔤", hue: 260, group: "reasoning" },
  quantitative:  { name: "Quantitative Reasoning",     short: "Quant",       icon: "🔢", hue: 175, group: "reasoning" },
  security:      { name: "Security Education",         short: "Security",    icon: "🛡️", hue: 0,   group: "civic" },
  crs:           { name: "Christian Religious Studies",short: "CRS",         icon: "✝️", hue: 45,  group: "religion" },
  irs:           { name: "Islamic Religious Studies",  short: "IRS",         icon: "☪️", hue: 155, group: "religion" }
};

window.QUIZ_LENGTHS = [10, 20, 50, 100];
window.QUESTIONS_PER_SUBJECT = 100;

window.SUBJECT_GROUPS = [
  { id: "all", label: "All" },
  { id: "core", label: "Core" },
  { id: "practical", label: "Practical" },
  { id: "reasoning", label: "Reasoning" },
  { id: "humanities", label: "Humanities" },
  { id: "civic", label: "Civic" },
  { id: "religion", label: "Religion" }
];

window.BADGES = [
  { id: "first", name: "First Star", desc: "Finish your first quiz", icon: "⭐" },
  { id: "perfect", name: "Perfect Paper", desc: "Score 100% on a quiz", icon: "💯" },
  { id: "streak3", name: "On a Roll", desc: "Play 3 days in a row", icon: "🔥" },
  { id: "streak7", name: "Week Warrior", desc: "Play 7 days in a row", icon: "🗓️" },
  { id: "hundred", name: "Century", desc: "Sit a full 100-question paper", icon: "📜" },
  { id: "daily", name: "Daily Hero", desc: "Score 8/10 or better on the Daily Challenge", icon: "☀️" },
  { id: "scholar", name: "Scholar", desc: "Reach 500 XP", icon: "📚" },
  { id: "champion", name: "Champion", desc: "Reach 1,500 XP", icon: "🏆" },
  { id: "exam", name: "Exam Ready", desc: "Finish an exam-mode quiz", icon: "📝" },
  { id: "speed", name: "Quick Thinker", desc: "Finish a timed quiz at 70%+", icon: "⚡" }
];
