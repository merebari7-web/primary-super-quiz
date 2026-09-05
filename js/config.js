window.GRADE_INFO = {
  1: { label: "Primary 1 (Basic 1)", ages: "6–7 years", blurb: "Foundations: phonics, numbers, 5 senses, hygiene and community.", international: "Basic 1 / Grade 1 / Year 2 / KS1" },
  2: { label: "Primary 2 (Basic 2)", ages: "7–8 years", blurb: "Building blocks: operations, grammar, plant/animal life and safety.", international: "Basic 2 / Grade 2 / Year 3 / KS1" },
  3: { label: "Primary 3 (Basic 3)", ages: "8–9 years", blurb: "Core skills: multiplication, fractions, ecosystems, local history and civic duty.", international: "Basic 3 / Grade 3 / Year 4 / KS2" },
  4: { label: "Primary 4 (Basic 4)", ages: "9–10 years", blurb: "Deeper inquiry: decimals, geometry, human body systems, Nigerian heritage and safety.", international: "Basic 4 / Grade 4 / Year 5 / KS2" },
  5: { label: "Primary 5 (Basic 5)", ages: "10–11 years", blurb: "Critical thinking: percentages, governance, circuits, agriculture, consumer rights and African history.", international: "Basic 5 / Grade 5 / Year 6 / KS2" },
  6: { label: "Primary 6 (Basic 6)", ages: "11–12 years", blurb: "Mastery & Common Entrance (NCEE/NECO/CAS): algebra, astronomy, world civics, logic and comprehensive revision.", international: "Basic 6 / Grade 6 / Year 7 / KS2-3" }
};

window.SUBJECTS = {
  english:       { name: "English Studies",            short: "English",     icon: "📘", hue: 210, group: "core", desc: "Phonics, grammar, vocabulary, tenses, reading comprehension, idioms and composition." },
  maths:         { name: "Mathematics",                short: "Maths",       icon: "➗", hue: 160, group: "core", desc: "Arithmetic, geometry, fractions, percentages, algebra, measurement and statistics." },
  science:       { name: "Basic Science",              short: "Science",     icon: "🔬", hue: 85,  group: "core", desc: "Living things, human body systems, forces, energy, earth, environment and space." },
  social:        { name: "Social Studies",             short: "Social",      icon: "🌍", hue: 25,  group: "core", desc: "Family, culture, leadership, Nigerian geography, 36 states/FCT, resources and governance." },
  civic:         { name: "Civic Education",            short: "Civic",       icon: "🇳🇬", hue: 145, group: "core", desc: "National symbols, democracy, rule of law, Nigerian constitution, human rights and duties." },
  computer:      { name: "Computer Studies (ICT)",     short: "Computer",    icon: "💻", hue: 200, group: "practical", desc: "Hardware, operating systems, internet safety, MS Office, coding concepts and algorithms." },
  agric:         { name: "Agricultural Science",       short: "Agric",       icon: "🌾", hue: 90,  group: "practical", desc: "Crop classification, soil science, farm tools, animal husbandry, weeds and pests." },
  cca:           { name: "Cultural & Creative Arts",   short: "CCA",         icon: "🎨", hue: 330, group: "practical", desc: "Color theory, sculpture, Nigerian traditional music, drama, crafts and cultural heritage." },
  phe:           { name: "Physical & Health Education",short: "PHE",         icon: "⚽", hue: 12,  group: "practical", desc: "Athletics, ball games, gymnastics, personal hygiene, first aid and fitness." },
  home:          { name: "Home Economics",             short: "Home Econ.",  icon: "🏠", hue: 30,  group: "practical", desc: "Nutrition, food preservation, sewing, clothing care, home management and consumer rights." },
  history:       { name: "History",                    short: "History",     icon: "🏛️", hue: 28,  group: "humanities", desc: "Nok culture, Benin bronzes, Oyo Empire, 1914 Amalgamation, nationalist heroes and independence." },
  verbal:        { name: "Verbal Reasoning",           short: "Verbal",      icon: "🔤", hue: 260, group: "reasoning", desc: "Word analogies, letter codes, syllogisms, classification, synonyms and ciphers." },
  quantitative:  { name: "Quantitative Reasoning",     short: "Quant",       icon: "🔢", hue: 175, group: "reasoning", desc: "Number patterns, symbolic operations, function machines, logic matrices and spatial math." },
  security:      { name: "Security Education",         short: "Security",    icon: "🛡️", hue: 0,   group: "civic", desc: "Personal safety, stranger danger, road safety (FRSC), cyber security and emergency agencies." },
  crs:           { name: "Christian Religious Studies",short: "CRS",         icon: "✝️", hue: 45,  group: "religion", desc: "Creation, Old Testament patriarchs, ministry/parables of Jesus Christ, early Church and ethics." },
  irs:           { name: "Islamic Religious Studies",  short: "IRS",         icon: "☪️", hue: 155, group: "religion", desc: "Tawhid, 5 Pillars of Islam, 6 Articles of Faith, Surahs, Seerah of Prophet (SAW) and Akhlaq." }
};

window.GOOGLE_CLIENT_ID = "648029341991-33dnroul54f7kvam3nd5gbd8l8lmvc45.apps.googleusercontent.com";

window.QUIZ_LENGTHS = [10, 20, 30, 40, 50, 60, 80, 100];
window.QUESTIONS_PER_SUBJECT = 100;
window.WEEK_GOAL = 5;

/* ==========================================================================
   NIGERIAN EXAM & CONTINUOUS ASSESSMENT SYSTEM CONFIGURATION (NERDC / SUBEB)
   ========================================================================== */

window.NIGERIAN_EXAM_TYPES = [
  { id: "first_term", name: "1st Term Examination", defaultTime: "1 Hour 30 Mins", marksSecA: 40, marksSecB: 20, totalMarks: 60 },
  { id: "second_term", name: "2nd Term Examination", defaultTime: "1 Hour 30 Mins", marksSecA: 40, marksSecB: 20, totalMarks: 60 },
  { id: "third_term", name: "3rd Term (Promotion) Examination", defaultTime: "1 Hour 30 Mins", marksSecA: 40, marksSecB: 20, totalMarks: 60 },
  { id: "ca1", name: "1st Continuous Assessment (C.A. 1) Test", defaultTime: "45 Minutes", marksSecA: 15, marksSecB: 5, totalMarks: 20 },
  { id: "ca2", name: "2nd Continuous Assessment (Mid-Term C.A. 2) Test", defaultTime: "45 Minutes", marksSecA: 15, marksSecB: 5, totalMarks: 20 },
  { id: "ncee_mock", name: "National Common Entrance Exam (NCEE / NECO) Mock", defaultTime: "2 Hours", marksSecA: 60, marksSecB: 0, totalMarks: 60 },
  { id: "state_ce", name: "State Common Entrance / Placement Mock Exam", defaultTime: "1 Hour 45 Mins", marksSecA: 50, marksSecB: 10, totalMarks: 60 }
];

window.NIGERIAN_SESSIONS = ["2025/2026", "2026/2027", "2027/2028", "2024/2025"];

window.NIGERIAN_NCEE_BUNDLES = [
  { id: "paper1", name: "Paper I: English Studies & National Values (Social, Civic, Security)", subjects: ["english", "social", "civic", "security"], defaultCount: 60 },
  { id: "paper2", name: "Paper II: Mathematics & Basic Science and Technology", subjects: ["maths", "science", "computer", "phe"], defaultCount: 60 },
  { id: "paper3", name: "Paper III: Quantitative & Verbal Reasoning Skills", subjects: ["quantitative", "verbal"], defaultCount: 60 },
  { id: "paper4", name: "Paper IV: Pre-Vocational Studies (Agric, Home Econ), CCA & Religion", subjects: ["agric", "home", "cca", "crs"], defaultCount: 60 }
];

window.NIGERIAN_GRADING = [
  { grade: "A", min: 75, max: 100, label: "Distinction / Excellent", remark: "Outstanding performance! Shows exceptional conceptual mastery." },
  { grade: "B", min: 65, max: 74, label: "Very Good / Commendable", remark: "Very commendable performance. Demonstrated solid understanding." },
  { grade: "C", min: 50, max: 64, label: "Credit / Good", remark: "Satisfactory performance. Capable of higher achievement with regular practice." },
  { grade: "D", min: 40, max: 49, label: "Pass / Fair", remark: "Fair attempt. Needs targeted revision in core foundational topics." },
  { grade: "F", min: 0, max: 39, label: "Needs Targeted Revision / Fail", remark: "Below required standard. Requires intensive remedial support and study." }
];

/* ==========================================================================
   NERDC CURRICULUM SECTION B (THEORY / ESSAY / SHOW WORKING) QUESTION REPOSITORY
   ========================================================================== */

window.NIGERIAN_THEORY_BANK = {
  maths: {
    1: [
      { q: "1a. Count and write down the numbers from 25 to 35 in order. (3 marks)\n1b. Draw 8 oranges and write the addition sentence: 5 oranges + 3 oranges = _____ oranges. (2 marks)", answer: "1a. 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35 (3 marks)\n1b. 8 drawings shown, 5 + 3 = 8 (2 marks)" },
      { q: "2a. Solve: 14 + 5 = _____ and 19 - 7 = _____ (2 marks)\n2b. Amina has 9 pencils. She gives 4 pencils to her brother Emeka. How many pencils does she have left? Show your working. (3 marks)", answer: "2a. 14 + 5 = 19; 19 - 7 = 12 (2 marks)\n2b. 9 - 4 = 5 pencils left (Working shown: 3 marks)" },
      { q: "3a. Name any two shapes you know (e.g. Circle, Square, Triangle). (2 marks)\n3b. Which number is greater: 48 or 84? Explain your answer. (3 marks)", answer: "3a. Any 2 valid geometric shapes (2 marks)\n3b. 84 is greater because 8 tens (80) is bigger than 4 tens (40) (3 marks)" }
    ],
    2: [
      { q: "1a. Write 248 in words and state the place value of the digit '4'. (3 marks)\n1b. Arrange the following numbers in ascending order (smallest to largest): 89, 45, 120, 67, 105. (2 marks)", answer: "1a. Two hundred and forty-eight. Place value of 4 is Tens (40). (3 marks)\n1b. 45, 67, 89, 105, 120 (2 marks)" },
      { q: "2a. Work out the sum: ₦150 + ₦350. (2 marks)\n2b. A baker made 45 meat pies in the morning and 38 meat pies in the afternoon. How many meat pies were made altogether? (3 marks)", answer: "2a. ₦150 + ₦350 = ₦500 (2 marks)\n2b. 45 + 38 = 83 meat pies altogether (3 marks)" },
      { q: "3a. Calculate: 5 × 6 = _____ and 24 ÷ 4 = _____ (2 marks)\n3b. How many sides and corners does a rectangle have? (3 marks)", answer: "3a. 30 and 6 (2 marks)\n3b. 4 straight sides and 4 square corners (right angles) (3 marks)" }
    ],
    3: [
      { q: "1a. Write 1,456 in expanded form (Thousands, Hundreds, Tens, Units). (2 marks)\n1b. Find the difference between 800 and 467. Show your vertical working. (3 marks)", answer: "1a. 1,000 + 400 + 50 + 6 (2 marks)\n1b. 800 - 467 = 333 (Working: 3 marks)" },
      { q: "2a. Simplify the fraction: 2/7 + 3/7 = _____ (2 marks)\n2b. If one exercise book costs ₦250, how much will 6 exercise books cost? Show your working. (3 marks)", answer: "2a. 5/7 (2 marks)\n2b. ₦250 × 6 = ₦1,500 (3 marks)" },
      { q: "3a. Convert 3 metres to centimetres (1m = 100cm). (2 marks)\n3b. Find the perimeter of a square garden whose side length is 7 metres. (Perimeter = 4 × Length). (3 marks)", answer: "3a. 3 × 100cm = 300cm (2 marks)\n3b. P = 4 × 7m = 28 metres (3 marks)" }
    ],
    4: [
      { q: "1a. Write in Roman Numerals: (i) 49 (ii) 94 (2 marks)\n1b. Find the Highest Common Factor (H.C.F.) and Lowest Common Multiple (L.C.M.) of 12 and 18. (3 marks)", answer: "1a. (i) XLIX (ii) XCIV (2 marks)\n1b. Factors of 12: 1,2,3,4,6,12; Factors of 18: 1,2,3,6,9,18 => HCF = 6; LCM = 36 (3 marks)" },
      { q: "2a. Convert 3/5 into a decimal number. (2 marks)\n2b. A rectangular classroom floor has a length of 12m and a width of 8m. Calculate (i) its perimeter, (ii) its area. (3 marks)", answer: "2a. 3 ÷ 5 = 0.6 (2 marks)\n2b. (i) Perimeter = 2(12 + 8) = 40m; (ii) Area = 12 × 8 = 96 m² (3 marks)" },
      { q: "3a. If 8 identical textbooks cost ₦12,000, find the cost of 5 textbooks. (3 marks)\n3b. Calculate the sum of 4.35 and 18.79. (2 marks)", answer: "3a. 1 textbook = 12000 ÷ 8 = ₦1,500. 5 textbooks = 1500 × 5 = ₦7,500 (3 marks)\n3b. 4.35 + 18.79 = 23.14 (2 marks)" }
    ],
    5: [
      { q: "1a. Simplify: 2 1/2 + 3 1/4 - 1 1/8. Show all working steps clearly. (3 marks)\n1b. Express 45% as a fraction in its lowest terms and as a decimal. (2 marks)", answer: "1a. Common denom = 8: 2 4/8 + 3 2/8 - 1 1/8 = (2+3-1) + (4+2-1)/8 = 4 5/8 (3 marks)\n1b. 45/100 = 9/20; Decimal = 0.45 (2 marks)" },
      { q: "2a. A trader bought a bag of onions for ₦30,000 and sold it for ₦37,500. Calculate (i) his profit, (ii) his percentage profit. (3 marks)\n2b. Calculate the simple interest on ₦50,000 borrowed for 2 years at 6% per annum. (Formula: I = PRT / 100). (2 marks)", answer: "2a. (i) Profit = 37,500 - 30,000 = ₦7,500; (ii) % Profit = (7500/30000) × 100% = 25% (3 marks)\n2b. I = (50000 × 6 × 2) / 100 = ₦6,000 (2 marks)" },
      { q: "3a. The angles in a triangle are 55°, 65°, and x°. Calculate the value of x°. (2 marks)\n3b. A car travels a distance of 240 kilometres in 3 hours. Calculate its average speed in km/h. (3 marks)", answer: "3a. Sum of angles in triangle = 180°. x = 180 - (55 + 65) = 180 - 120 = 60° (2 marks)\n3b. Speed = Distance ÷ Time = 240 km ÷ 3 h = 80 km/h (3 marks)" }
    ],
    6: [
      { q: "1a. Solve the simple algebraic equation: 4x + 15 = 39. (2 marks)\n1b. If 6 workers can complete a farm project in 10 days, how many days will 15 workers take working at the same rate? (3 marks)", answer: "1a. 4x = 39 - 15 = 24 => x = 24 ÷ 4 = 6 (2 marks)\n1b. Total man-days = 6 × 10 = 60 man-days. Days for 15 workers = 60 ÷ 15 = 4 days (3 marks)" },
      { q: "2a. Calculate the volume of a rectangular water tank of length 5m, breadth 3m, and height 2m. (2 marks)\n2b. The radius of a circular plate is 14 cm. Calculate (i) its circumference, (ii) its area. (Take π = 22/7). (3 marks)", answer: "2a. Volume = L × B × H = 5 × 3 × 2 = 30 m³ (2 marks)\n2b. (i) Circumference = 2πr = 2 × 22/7 × 14 = 88 cm; (ii) Area = πr² = 22/7 × 14 × 14 = 616 cm² (3 marks)" },
      { q: "3a. The test scores of 5 pupils in a Common Entrance mock are: 72, 85, 90, 68, and 85. Find: (i) the Mode, (ii) the Mean (average) score. (3 marks)\n3b. A shirt marked at ₦8,000 was sold at a 15% discount during a school promotion. How much did the customer pay? (2 marks)", answer: "3a. (i) Mode = 85 (appears twice); (ii) Mean = (72+85+90+68+85)/5 = 400/5 = 80 (3 marks)\n3b. Discount = 15% of 8000 = ₦1,200. Price paid = 8000 - 1200 = ₦6,800 (2 marks)" }
    ]
  },
  english: {
    1: [
      { q: "1a. Fill in the blank with 'a' or 'an': (i) _____ apple, (ii) _____ book, (iii) _____ umbrella. (3 marks)\n1b. Write the plural form of: (i) boy (ii) cat. (2 marks)", answer: "1a. (i) an (ii) a (iii) an (3 marks)\n1b. (i) boys (ii) cats (2 marks)" },
      { q: "2. Write three simple sentences about 'My School'. (5 marks)", answer: "Student writes 3 coherent sentences about school name, teacher, playground or learning (5 marks)" }
    ],
    4: [
      { q: "1a. Change the following sentences to the Simple Past Tense:\n(i) She eats rice every Sunday.\n(ii) The pupils go to school by bus. (2 marks)\n1b. Identify the parts of speech of the underlined words:\n(i) Ngozi ran *quickly* to catch the bus.\n(ii) The *brave* soldier protected the village. (3 marks)", answer: "1a. (i) She ate rice every Sunday. (ii) The pupils went to school by bus. (2 marks)\n1b. (i) quickly = Adverb (ii) brave = Adjective (3 marks)" },
      { q: "2. Write a short composition of at least 80 words on the topic: 'My Best Friend'. Include their name, appearance, and why you like them. (5 marks)", answer: "Well-structured essay with paragraphing, punctuation, and appropriate adjectives (5 marks)" }
    ],
    6: [
      { q: "1a. Rewrite the following active sentence in the Passive Voice: 'The headmaster punished the latecomers.' (2 marks)\n1b. Give the antonyms (opposites) of: (i) diligent, (ii) permanent, (iii) ancient. (3 marks)", answer: "1a. 'The latecomers were punished by the headmaster.' (2 marks)\n1b. (i) lazy/indolent, (ii) temporary, (iii) modern/recent (3 marks)" },
      { q: "2. Write a formal letter to your School Headteacher requesting permission to be absent from school for two days due to a family engagement. (5 marks)", answer: "Formal letter format: Two addresses, formal salutation, heading, polite body, and formal closing 'Yours faithfully' with signature (5 marks)" }
    ]
  },
  science: {
    2: [
      { q: "1a. State two living things and two non-living things found in your school compound. (2 marks)\n1b. Mention three parts of the human body and state the function of any one part. (3 marks)", answer: "1a. Living: Tree, Bird/Dog; Non-living: Desk, Stone/Chalkboard (2 marks)\n1b. Head, Eyes, Hands, Legs. Eyes for seeing, Legs for walking (3 marks)" }
    ],
    4: [
      { q: "1a. Define pollution. Name two types of pollution. (2 marks)\n1b. List three characteristics of living organisms (MR NIGER D). (3 marks)", answer: "1a. Pollution is the release of harmful substances into the environment. Air and water pollution (2 marks)\n1b. Movement, Respiration, Nutrition, Irritability, Growth, Excretion, Reproduction (3 marks)" },
      { q: "2a. What is a simple machine? Give two examples found in the home. (2 marks)\n2b. Explain why we must wash our hands before eating. (3 marks)", answer: "2a. A simple machine makes work easier (e.g. lever, wheelbarrow, scissors, knife) (2 marks)\n2b. To kill and wash away disease-causing germs/bacteria (3 marks)" }
    ],
    6: [
      { q: "1a. Differentiate between renewable and non-renewable energy sources with one Nigerian example each. (3 marks)\n1b. State the major function of: (i) Red blood cells, (ii) The lungs. (2 marks)", answer: "1a. Renewable energy naturally replenishes (solar/hydro); Non-renewable is exhaustible (crude oil/petroleum) (3 marks)\n1b. (i) Carry oxygen to body tissues; (ii) Gaseous exchange/oxygenating blood (2 marks)" },
      { q: "2a. List four planets in the solar system starting from the closest to the Sun. (2 marks)\n2b. Describe two practical ways of conserving water and electricity in our school. (3 marks)", answer: "2a. Mercury, Venus, Earth, Mars (2 marks)\n2b. Turning off taps when not in use; switching off lights and appliances when leaving classrooms (3 marks)" }
    ]
  },
  social: {
    3: [
      { q: "1a. What is a family? Differentiate between a nuclear family and an extended family. (3 marks)\n1b. Mention two qualities of a good leader in our community. (2 marks)", answer: "1a. Family is a group of people related by blood, marriage or adoption. Nuclear = father, mother, children; Extended includes grandparents, uncles, aunts (3 marks)\n1b. Honesty, fairness, courage, humility (2 marks)" }
    ],
    5: [
      { q: "1a. How many States and Local Government Areas (LGAs) are there in Nigeria? Name the Federal Capital Territory. (3 marks)\n1b. Mention two major mineral resources in Nigeria and the states where they are found. (2 marks)", answer: "1a. 36 States, 774 Local Government Areas, Abuja FCT (3 marks)\n1b. Crude oil (Delta/Rivers), Limestone (Kogi/Ogun), Coal (Enugu) (2 marks)" },
      { q: "2a. State three functions of the Nigerian Police Force. (3 marks)\n2b. Define culture and name two ethnic groups in Nigeria. (2 marks)", answer: "2a. Maintaining law and order, protecting lives and property, preventing crime (3 marks)\n2b. Culture is the total way of life of a people. Hausa, Yoruba, Igbo, Nupe, Fulani, etc. (2 marks)" }
    ]
  },
  civic: {
    4: [
      { q: "1a. What is Civic Education? State two reasons why we study Civic Education. (3 marks)\n1b. Mention three national symbols of Nigeria. (2 marks)", answer: "1a. Civic education teaches rights and duties of citizens. Fosters patriotism and good leadership (3 marks)\n1b. National Flag, National Anthem, Coat of Arms, National Pledge (2 marks)" }
    ],
    6: [
      { q: "1a. Explain the three arms of government in Nigeria and state the main duty of each arm. (3 marks)\n1b. Mention three fundamental human rights guaranteed by the Nigerian Constitution. (2 marks)", answer: "1a. (i) Legislature (makes laws), (ii) Executive (implements/enforces laws), (iii) Judiciary (interprets laws/punishes lawbreakers) (3 marks)\n1b. Right to life, right to education, right to personal liberty, freedom of expression (2 marks)" }
    ]
  },
  agric: {
    5: [
      { q: "1a. Differentiate between subsistence agriculture and commercial agriculture. (3 marks)\n1b. Name two cereal crops and two tuber crops grown in Nigeria. (2 marks)", answer: "1a. Subsistence is farming mainly for family food; Commercial is large-scale farming for profit/sale (3 marks)\n1b. Cereals: Maize, Rice, Guinea corn; Tubers: Yam, Cassava, Sweet potato (2 marks)" },
      { q: "2a. What are farm weeds? State two damages caused by weeds to crops. (3 marks)\n2b. Mention two farm tools used for clearing bush and digging soil. (2 marks)", answer: "2a. Unwanted plants on a farm. Compete with crops for nutrients/sunlight; harbor crop pests (3 marks)\n2b. Cutlass/machete, Hoe, Spade, Pickaxe (2 marks)" }
    ]
  },
  history: {
    5: [
      { q: "1a. In what year was Northern and Southern Nigeria amalgamated, and who was the British Governor-General that carried it out? (2 marks)\n1b. Mention three ancient Nigerian civilizations renowned for traditional art and sculpture. (3 marks)", answer: "1a. 1914 by Lord Frederick Lugard (2 marks)\n1b. Nok Culture, Benin Kingdom (bronzes), Igbo-Ukwu, Ife Kingdom (terracotta) (3 marks)" },
      { q: "2a. Name three Nigerian nationalist leaders who fought for Nigeria's independence in 1960. (3 marks)\n2b. On what exact date did Nigeria gain independence from British colonial rule? (2 marks)", answer: "2a. Dr. Nnamdi Azikiwe, Sir Abubakar Tafawa Balewa, Chief Obafemi Awolowo, Sir Ahmadu Bello, Herbert Macaulay (3 marks)\n2b. October 1, 1960 (2 marks)" }
    ]
  }
};

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
