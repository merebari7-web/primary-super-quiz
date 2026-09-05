window.GRADE_INFO = {
  1: { label: "Primary 1", ages: "6–7 years", blurb: "Foundations: phonics, numbers, 5 senses and our community.", international: "Grade 1 / Year 2 / Key Stage 1" },
  2: { label: "Primary 2", ages: "7–8 years", blurb: "Building blocks: operations, grammar, plant/animal life and safety.", international: "Grade 2 / Year 3 / Key Stage 1" },
  3: { label: "Primary 3", ages: "8–9 years", blurb: "Core skills: multiplication, fractions, ecosystems and local history.", international: "Grade 3 / Year 4 / Key Stage 2" },
  4: { label: "Primary 4", ages: "9–10 years", blurb: "Deeper inquiry: decimals, geometry, human body and Nigerian heritage.", international: "Grade 4 / Year 5 / Key Stage 2" },
  5: { label: "Primary 5", ages: "10–11 years", blurb: "Critical thinking: percentages, governance, circuits and African history.", international: "Grade 5 / Year 6 / Key Stage 2" },
  6: { label: "Primary 6", ages: "11–12 years", blurb: "Mastery & Common Entrance: algebra, astronomy, world civics and logic.", international: "Grade 6 / Year 7 / Key Stage 2/3" }
};

window.SUBJECTS = {
  english:       { name: "English Language",           short: "English",     icon: "📘", hue: 210, group: "core", desc: "Phonics, grammar, vocabulary, tenses, reading comprehension and mechanics." },
  maths:         { name: "Mathematics",                short: "Maths",       icon: "➗", hue: 160, group: "core", desc: "Arithmetic, geometry, fractions, algebra, measurement and statistics." },
  science:       { name: "Basic Science",              short: "Science",     icon: "🔬", hue: 85,  group: "core", desc: "Living things, human body systems, forces, energy, earth and space." },
  social:        { name: "Social Studies",             short: "Social",      icon: "🌍", hue: 25,  group: "core", desc: "Family, community, geography, states, continents and governance." },
  civic:         { name: "Civic Education",            short: "Civic",       icon: "🇳🇬", hue: 145, group: "core", desc: "National symbols, democracy, rule of law, human rights and duties." },
  computer:      { name: "Computer Studies",           short: "Computer",    icon: "💻", hue: 200, group: "practical", desc: "Hardware, operating systems, internet safety, coding concepts and algorithms." },
  agric:         { name: "Agricultural Science",       short: "Agric",       icon: "🌾", hue: 90,  group: "practical", desc: "Crop classification, soil science, farm tools, animal husbandry and ecology." },
  cca:           { name: "Cultural & Creative Arts",   short: "CCA",         icon: "🎨", hue: 330, group: "practical", desc: "Color theory, sculpture, traditional music, drama, and cultural heritage." },
  phe:           { name: "Physical & Health Education",short: "PHE",         icon: "⚽", hue: 12,  group: "practical", desc: "Movement skills, athletics, team sports, hygiene, first aid and fitness." },
  home:          { name: "Home Economics",             short: "Home Econ.",  icon: "🏠", hue: 30,  group: "practical", desc: "Nutrition, cooking methods, clothing care, home management and budgeting." },
  history:       { name: "History",                    short: "History",     icon: "🏛️", hue: 28,  group: "humanities", desc: "Nok culture, Benin bronze, amalgamation, independence heroes and world history." },
  verbal:        { name: "Verbal Reasoning",           short: "Verbal",      icon: "🔤", hue: 260, group: "reasoning", desc: "Word analogies, anagrams, letter codes, syllogisms and classification." },
  quantitative:  { name: "Quantitative Reasoning",     short: "Quant",       icon: "🔢", hue: 175, group: "reasoning", desc: "Number ladders, symbolic operations, function machines and spatial logic." },
  security:      { name: "Security Education",         short: "Security",    icon: "🛡️", hue: 0,   group: "civic", desc: "Personal safety, traffic rules, emergency numbers, cyber safety and disaster prep." },
  crs:           { name: "Christian Religious Studies",short: "CRS",         icon: "✝️", hue: 45,  group: "religion", desc: "Creation, Old Testament patriarchs, life of Christ, parables and Christian ethics." },
  irs:           { name: "Islamic Religious Studies",  short: "IRS",         icon: "☪️", hue: 155, group: "religion", desc: "Tawhid, 5 Pillars, 6 Articles of Faith, Surahs, Seerah of the Prophet (SAW) and Akhlaq." }
};

window.GOOGLE_CLIENT_ID = "648029341991-33dnroul54f7kvam3nd5gbd8l8lmvc45.apps.googleusercontent.com";

window.QUIZ_LENGTHS = [10, 20, 50, 100];
window.QUESTIONS_PER_SUBJECT = 100;
window.WEEK_GOAL = 5;

window.RANKS = [
  { id: "hatchling", name: "Hatchling", min: 0, icon: "🐣", blurb: "Every champion starts with a single step." },
  { id: "spark", name: "Curious Spark", min: 100, icon: "✨", blurb: "Igniting the fire of daily learning." },
  { id: "explorer", name: "Knowledge Explorer", min: 300, icon: "🧭", blurb: "Navigating across all curriculum domains." },
  { id: "scholar", name: "Junior Scholar", min: 650, icon: "📗", blurb: "Demonstrating deep conceptual mastery." },
  { id: "star", name: "Academic Star", min: 1200, icon: "🌟", blurb: "Consistently high accuracy and strong reasoning." },
  { id: "champion", name: "Grand Champion", min: 2000, icon: "🏆", blurb: "Exam-ready excellence across all 16 subjects." },
  { id: "legend", name: "Super Legend", min: 3500, icon: "👑", blurb: "Master of primary learning and global standards." }
];

window.SUBJECT_GROUPS = [
  { id: "all", label: "All Subjects" },
  { id: "core", label: "Core" },
  { id: "practical", label: "Practical & Applied" },
  { id: "reasoning", label: "Logical Reasoning" },
  { id: "humanities", label: "Humanities" },
  { id: "civic", label: "Civic & Security" },
  { id: "religion", label: "Religious Studies" }
];

window.BADGES = [
  { id: "first", name: "First Star", desc: "Complete your first quiz paper", icon: "⭐", category: "milestone" },
  { id: "perfect", name: "Mastery 100%", desc: "Score 100% on any practice or exam paper", icon: "💯", category: "accuracy" },
  { id: "streak3", name: "3-Day Roll", desc: "Maintain a 3-day daily learning streak", icon: "🔥", category: "habit" },
  { id: "streak7", name: "Week Warrior", desc: "Maintain a 7-day daily learning streak", icon: "🗓️", category: "habit" },
  { id: "hundred", name: "Centurion", desc: "Complete a full 100-question marathon paper", icon: "📜", category: "endurance" },
  { id: "daily", name: "Daily Hero", desc: "Score 80%+ on the Daily Challenge", icon: "☀️", category: "challenge" },
  { id: "scholar", name: "Scholar", desc: "Accumulate 650 XP in your learning portfolio", icon: "📚", category: "milestone" },
  { id: "champion", name: "Grand Champion", desc: "Reach 2,000 XP in learning mastery", icon: "🏆", category: "milestone" },
  { id: "exam", name: "Exam Ready", desc: "Complete a formal timed Exam-mode paper", icon: "📝", category: "assessment" },
  { id: "speed", name: "Quick Thinker", desc: "Score 75%+ on a Timed speed round", icon: "⚡", category: "fluency" },
  { id: "week", name: "Goal Getter", desc: "Achieve the weekly goal of 5 completed quizzes", icon: "🎯", category: "habit" },
  { id: "smart", name: "Adaptive Mind", desc: "Complete an adaptive Smart Practice session", icon: "🧠", category: "learning" },
  { id: "mix", name: "Interleaved Thinker", desc: "Complete a multidisciplinary Champion Mix", icon: "🌈", category: "learning" },
  { id: "bolt", name: "Lightning Fast", desc: "Score 80%+ on a rapid Lightning 5 challenge", icon: "⚡", category: "fluency" },
  { id: "independent", name: "Independent Thinker", desc: "Score 85%+ on 10+ questions without hints", icon: "🦉", category: "autonomy" },
  { id: "bookworm", name: "Dedicated Scholar", desc: "Spend 30+ minutes in active study and retrieval", icon: "📖", category: "dedication" },
  { id: "flashcard", name: "Spaced Recall Master", desc: "Review 15+ flashcards in Spaced Repetition mode", icon: "🗂️", category: "memory" },
  { id: "calibrated", name: "Metacognitive Pro", desc: "Achieve 90%+ confidence calibration accuracy", icon: "🎯", category: "metacognition" },
  { id: "math_wizard", name: "Math Wizard", desc: "Achieve 85%+ in Mathematics or Quantitative Reasoning", icon: "📐", category: "subject" },
  { id: "science_whiz", name: "Curious Scientist", desc: "Achieve 85%+ in Basic Science or Agriculture", icon: "🔬", category: "subject" },
  { id: "word_master", name: "Literacy Champion", desc: "Achieve 85%+ in English Language or Verbal Reasoning", icon: "✍️", category: "subject" },
  { id: "civic_leader", name: "Civic Leader", desc: "Achieve 85%+ in Civic Education or Social Studies", icon: "🕊️", category: "subject" },
  { id: "scratchpad", name: "Problem Solver", desc: "Use the interactive Whiteboard / Scratchpad during a quiz", icon: "✏️", category: "tool" },
  { id: "growth_mindset", name: "Growth Mindset", desc: "Successfully correct 5 previously missed questions in Review", icon: "🌱", category: "growth" }
];

window.CURRICULUM_STANDARDS = {
  frameworks: [
    { id: "nerdc", name: "NERDC (Nigeria UBE Curriculum)", desc: "Universal Basic Education Curriculum Standards for Primary 1–6." },
    { id: "cambridge", name: "Cambridge Primary (Stages 1–6)", desc: "International primary frameworks in English, Mathematics, and Science." },
    { id: "uk_nc", name: "UK National Curriculum (KS1 & KS2)", desc: "Key Stage 1 (Years 1-2) and Key Stage 2 (Years 3-6) standards." },
    { id: "us_ccss", name: "US Common Core & NGSS", desc: "Elementary Math, ELA, and Next Generation Science Standards (Grades 1-6)." },
    { id: "ib_pyp", name: "IB Primary Years Programme (PYP)", desc: "Transdisciplinary inquiry-based themes for primary global learners." }
  ]
};
