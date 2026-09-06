/* ==========================================================================
   PRIMARY SUPER QUIZ - GLOBAL CURRICULUM & INSTITUTIONAL CONFIGURATION
   Universal Primary 1–6 (Basic 1–6) Standards & Pedagogical Frameworks
   ========================================================================== */

window.GRADE_INFO = {
  1: { label: "Primary 1 (Basic 1)", ages: "6–7 years", blurb: "Foundations: phonics, numbers, 5 senses, hygiene, family and community.", international: "Basic 1 / Grade 1 / Year 2 / KS1 / IB PYP Early Primary" },
  2: { label: "Primary 2 (Basic 2)", ages: "7–8 years", blurb: "Building blocks: operations, grammar, plant/animal life, safety and measurement.", international: "Basic 2 / Grade 2 / Year 3 / KS1 / IB PYP Stage 2" },
  3: { label: "Primary 3 (Basic 3)", ages: "8–9 years", blurb: "Core skills: multiplication, fractions, ecosystems, local history and civic duties.", international: "Basic 3 / Grade 3 / Year 4 / KS2 / IB PYP Stage 3" },
  4: { label: "Primary 4 (Basic 4)", ages: "9–10 years", blurb: "Deeper inquiry: decimals, geometry, human body systems, heritage and cyber safety.", international: "Basic 4 / Grade 4 / Year 5 / KS2 / IB PYP Stage 4" },
  5: { label: "Primary 5 (Basic 5)", ages: "10–11 years", blurb: "Critical thinking: percentages, governance, circuits, agriculture, consumer rights and African history.", international: "Basic 5 / Grade 5 / Year 6 / KS2 / IB PYP Stage 5" },
  6: { label: "Primary 6 (Basic 6)", ages: "11–12 years", blurb: "Mastery & Common Entrance (NCEE/NECO/CAS): algebra, astronomy, world civics, logic and comprehensive revision.", international: "Basic 6 / Grade 6 / Year 7 / KS2-3 / IB PYP Exhibition" }
};

window.SUBJECTS = {
  english:       { name: "English Studies",            short: "English",     icon: "📘", hue: 210, group: "core", desc: "Phonics, grammar, vocabulary, tenses, reading comprehension, idioms and composition." },
  maths:         { name: "Mathematics",                short: "Maths",       icon: "➗", hue: 160, group: "core", desc: "Arithmetic, geometry, fractions, percentages, algebra, measurement, CPA bar modeling and statistics." },
  science:       { name: "Basic Science",              short: "Science",     icon: "🔬", hue: 85,  group: "core", desc: "Living things, human body systems, forces, energy, earth, environment, biomes and space." },
  social:        { name: "Social Studies",             short: "Social",      icon: "🌍", hue: 25,  group: "core", desc: "Family, culture, leadership, Nigerian geography, 36 states/FCT, resources and global institutions." },
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
  { grade: "A", min: 75, max: 100, label: "Distinction / Excellent", remark: "Outstanding performance! Shows exceptional conceptual mastery and analytical depth." },
  { grade: "B", min: 65, max: 74, label: "Very Good / Commendable", remark: "Very commendable performance. Demonstrated solid understanding and problem-solving skills." },
  { grade: "C", min: 50, max: 64, label: "Credit / Good", remark: "Satisfactory performance. Capable of higher achievement with regular retrieval practice." },
  { grade: "D", min: 40, max: 49, label: "Pass / Fair", remark: "Fair attempt. Needs targeted revision in core foundational concepts." },
  { grade: "F", min: 0, max: 39, label: "Needs Targeted Revision / Fail", remark: "Below required standard. Requires intensive remedial scaffolding and spaced review." }
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
      { q: "1a. Write 1,456 in expanded form (Thousands, Hundreds, Tens, Units). (2 marks)\n1b. Find the difference between 800 and 467. Show your vertical working. (3 marks)", answer: "1a. 1000 + 400 + 50 + 6 (2 marks)\n1b. 800 - 467 = 333 (Working shown with borrowing: 3 marks)" },
      { q: "2a. Multiply 34 by 6. Show all steps. (2 marks)\n2b. A school bus carries 42 pupils. How many pupils will 5 identical school buses carry? (3 marks)", answer: "2a. 34 × 6 = (30 × 6) + (4 × 6) = 180 + 24 = 204 (2 marks)\n2b. 42 × 5 = 210 pupils (3 marks)" },
      { q: "3a. Simplify the fraction: 12/16 to its lowest terms. (2 marks)\n3b. Calculate the perimeter of a rectangle with length 14 cm and width 8 cm. (3 marks)", answer: "3a. Divide numerator and denominator by 4: 12/16 = 3/4 (2 marks)\n3b. Perimeter = 2 × (L + W) = 2 × (14 + 8) = 2 × 22 = 44 cm (3 marks)" }
    ],
    4: [
      { q: "1a. Find the Highest Common Factor (HCF) of 24 and 36. (3 marks)\n1b. Find the Least Common Multiple (LCM) of 6, 8, and 12. (2 marks)", answer: "1a. Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24; Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. HCF = 12 (3 marks)\n1b. Multiples: 24 (2 marks)" },
      { q: "2a. Add the fractions: 3/5 + 1/4. (2 marks)\n2b. A trader bought a bag of rice for ₦32,000 and sold it for ₦38,500. Calculate the profit made. (3 marks)", answer: "2a. LCM of 5 and 4 = 20. (12 + 5)/20 = 17/20 (2 marks)\n2b. Profit = Selling Price - Cost Price = ₦38,500 - ₦32,000 = ₦6,500 (3 marks)" },
      { q: "3a. Convert 0.75 to a common fraction in its lowest term. (2 marks)\n3b. The area of a square field is 64 m². Find the length of one side and its perimeter. (3 marks)", answer: "3a. 75/100 = 3/4 (2 marks)\n3b. Side = √64 = 8 m. Perimeter = 4 × 8 = 32 m (3 marks)" }
    ],
    5: [
      { q: "1a. Calculate 35% of ₦12,000. Show clear working. (2 marks)\n1b. Simplify: 2 1/3 + 3 1/2 - 1 1/4. (3 marks)", answer: "1a. (35/100) × ₦12,000 = 35 × 120 = ₦4,200 (2 marks)\n1b. LCM = 12. (7/3 + 7/2 - 5/4) = (28 + 42 - 15)/12 = 55/12 = 4 7/12 (3 marks)" },
      { q: "2a. Find the simple interest on ₦50,000 for 3 years at 5% per annum. (Formula: I = (P × R × T)/100). (3 marks)\n2b. If 8 exercise books cost ₦2,400, find the cost of 15 exercise books. (2 marks)", answer: "2a. I = (50,000 × 5 × 3)/100 = ₦7,500 (3 marks)\n2b. 1 book = ₦2,400 / 8 = ₦300. 15 books = 15 × ₦300 = ₦4,500 (2 marks)" },
      { q: "3a. Find the volume of a rectangular cuboid with length 10 cm, width 6 cm, and height 4 cm. (2 marks)\n3b. The mean of five numbers (12, 18, x, 24, 16) is 18. Find the value of x. (3 marks)", answer: "3a. Volume = L × W × H = 10 × 6 × 4 = 240 cm³ (2 marks)\n3b. Sum = 18 × 5 = 90. (12 + 18 + 24 + 16) = 70. x = 90 - 70 = 20 (3 marks)" }
    ],
    6: [
      { q: "1a. Solve the linear equation: 4x - 7 = 2x + 13. (3 marks)\n1b. Express the ratio 45 minutes to 2 hours in its simplest form. (2 marks)", answer: "1a. 4x - 2x = 13 + 7 => 2x = 20 => x = 10 (3 marks)\n1b. 2 hours = 120 mins. 45:120 = divide by 15 = 3:8 (2 marks)" },
      { q: "2a. A cylindrical water tank has a base radius of 7 cm and a height of 20 cm. Calculate its total volume (Use π = 22/7, V = πr²h). (3 marks)\n2b. A car travels a distance of 280 km in 3 hours 30 minutes. Calculate its average speed in km/h. (2 marks)", answer: "2a. V = (22/7) × 7 × 7 × 20 = 22 × 7 × 20 = 3,080 cm³ (3 marks)\n2b. Time = 3.5 hours. Speed = Distance / Time = 280 / 3.5 = 80 km/h (2 marks)" },
      { q: "3a. In a class of 40 pupils, 60% are girls. How many boys are in the class? (2 marks)\n3b. The scores of 8 pupils in a mathematics test are: 14, 18, 15, 12, 18, 19, 16, 18. Find: (i) The Mode, (ii) The Median. (3 marks)", answer: "3a. Girls = 60% of 40 = 24 girls. Boys = 40 - 24 = 16 boys (2 marks)\n3b. (i) Mode = 18 (appears 3 times); (ii) Ordered: 12, 14, 15, 16, 18, 18, 18, 19. Median = (16 + 18)/2 = 17 (3 marks)" }
    ]
  },
  english: {
    3: [
      { q: "1a. Write out five nouns in the following sentence: 'The clever pupil took his book, pencil, and bag to the classroom.' (2.5 marks)\n1b. Give the plural forms of: (i) Child, (ii) Tooth, (iii) Box, (iv) Loaf, (v) City. (2.5 marks)", answer: "1a. pupil, book, pencil, bag, classroom (2.5 marks)\n1b. (i) Children, (ii) Teeth, (iii) Boxes, (iv) Loaves, (v) Cities (2.5 marks)" }
    ],
    5: [
      { q: "1a. Change the following sentences from Active Voice to Passive Voice: (3 marks)\n(i) Musa kicked the football.\n(ii) The headmaster praised the punctual pupils.\n(iii) The chef cooked delicious jollof rice.\n1b. Give the antonyms (opposites) of: (i) Ancient, (ii) Expand, (iii) Humble. (2 marks)", answer: "1a. (i) The football was kicked by Musa. (ii) The punctual pupils were praised by the headmaster. (iii) Delicious jollof rice was cooked by the chef. (3 marks)\n1b. (i) Modern, (ii) Contract/Shrink, (iii) Proud/Arrogant (2 marks)" },
      { q: "2. Composition Writing (10 marks):\nWrite a descriptive composition of not less than 120 words on the topic: 'My Favorite Teacher'. Include their name, appearance, subject taught, and why you admire them.", answer: "Marking criteria: Content & relevance (3 marks), Organization & paragraphing (2 marks), Vocabulary & sentence structure (3 marks), Grammar, spelling & punctuation (2 marks)." }
    ]
  },
  science: {
    4: [
      { q: "1a. State the three states of matter and give two everyday examples of each. (3 marks)\n1b. What are living things? List four characteristics of living things (MR NIGER D). (2 marks)", answer: "1a. Solid (wood, stone), Liquid (water, milk), Gas (oxygen, steam) (3 marks)\n1b. Movement, Respiration, Nutrition, Irritability, Growth, Excretion, Reproduction (2 marks)" }
    ],
    6: [
      { q: "1a. Differentiate between renewable and non-renewable energy sources with one Nigerian example each. (3 marks)\n1b. State the major function of: (i) Red blood cells, (ii) The lungs. (2 marks)", answer: "1a. Renewable naturally replenishes (solar, hydro); Non-renewable is exhaustible (crude oil, coal) (3 marks)\n1b. (i) Transport oxygen to body tissues; (ii) Gaseous exchange / oxygenating blood (2 marks)" }
    ]
  }
};

/* ==========================================================================
   5E INSTRUCTIONAL MODEL LESSON PLAN TEMPLATES (TEACHER PREPARATION ENGINE)
   ========================================================================== */

window.LESSON_PLAN_TEMPLATES = {
  maths_p5_percentages: {
    title: "Understanding & Calculating Percentages of Quantities",
    subject: "Mathematics",
    grade: 5,
    duration: "45 Minutes",
    standards: "NERDC UBE Basic 5; Cambridge Stage 5; US CCSS 5.NF / 6.RP",
    objectives: [
      "Define percentage as 'parts per hundred' (100).",
      "Convert common fractions (e.g., 1/2, 1/4, 3/4) to equivalent percentages.",
      "Calculate percentages of whole amounts in practical everyday contexts (e.g. 25% of ₦4,000)."
    ],
    materials: "Hundred-grid squares, fraction-percentage equivalency cards, play currency (Naira), Whiteboard.",
    steps: {
      engage: "Display a 100-grid with 50 squares shaded. Ask pupils: 'What fraction is shaded? How many out of 100? What symbol represents this in shops during a sales discount?' (5 Mins)",
      explore: "Pupils in pairs use 100-grids to shade 25%, 50%, and 75%. They deduce the fractional equivalents (1/4, 1/2, 3/4) using concrete bar visualizers. (10 Mins)",
      explain: "Teacher guides the formal rule: 'Percent (%) means divide by 100. To find 20% of ₦1,500, calculate (20/100) × 1500 = ₦300.' Model 2 worked examples on the board. (10 Mins)",
      elaborate: "Real-world word problem: 'A stationery store offers a 15% back-to-school discount on a school bag costing ₦6,000. How much money is saved?' Pupils solve on rough work scratchpads. (12 Mins)",
      evaluate: "Formative exit ticket: Solve 10% of ₦800 and 75% of 40 kg. Teacher records formative mastery radar. (8 Mins)"
    },
    differentiation: {
      support: "Use 10% benchmark strategy (find 10% by dividing by 10, then multiply).",
      extension: "Calculate multi-step percentage increase/decrease on market commodity prices."
    }
  },
  science_p4_ecosystem: {
    title: "Food Chains, Trophic Levels & Energy Flow in Nigerian Biomes",
    subject: "Basic Science",
    grade: 4,
    duration: "45 Minutes",
    standards: "NERDC Basic 4 Science; NGSS 4-LS1 / 5-LS2; Cambridge Primary Stage 4",
    objectives: [
      "Distinguish between producers, consumers (herbivores, carnivores), and decomposers.",
      "Construct a valid 4-stage food chain showing the direction of energy flow (arrows)."
    ],
    materials: "Ecosystem animal cards (Grass, Locust, Lizard, Hawk, Fungi), string for food webs.",
    steps: {
      engage: "Ask: 'Where does a green plant get its energy to make food? What happens to that energy when a grasshopper eats the leaf?' (5 Mins)",
      explore: "Learners arrange living organism picture cards into a logical feeding sequence in groups of four. (10 Mins)",
      explain: "Teacher clarifies: 'Arrows in a food chain mean IS EATEN BY and show the direction of energy flow from Producer → Primary Consumer → Secondary Consumer → Apex Predator.' (10 Mins)",
      elaborate: "Construct a Guinea Savannah food chain: Grass → Grasshopper → Toad → Snake → Hawk. Discuss what happens if all toads disappear. (12 Mins)",
      evaluate: "Formative 5-question quick quiz on trophic levels and draw an aquatic pond food chain. (8 Mins)"
    },
    differentiation: {
      support: "Provide word bank with color-coded producer/consumer category labels.",
      extension: "Introduce the 10% ecological energy transfer rule between trophic levels."
    }
  },
  english_p3_adjectives: {
    title: "Descriptive Adjectives & Sensory Imagery in Creative Writing",
    subject: "English Studies",
    grade: 3,
    duration: "40 Minutes",
    standards: "NERDC Basic 3 English; Cambridge Primary Stage 3; UK National Curriculum KS1/2 ELA",
    objectives: [
      "Identify descriptive adjectives that appeal to the 5 senses (sight, touch, smell, sound, taste).",
      "Construct vivid sentences replacing dull words (e.g. 'big', 'nice') with precise adjectives (e.g. 'gigantic', 'delicious')."
    ],
    materials: "Sensory mystery box with real classroom objects (feather, lime, velvet cloth, bell), adjective word bank.",
    steps: {
      engage: "Teacher holds up a mystery box. A student touches an object inside without looking and describes it using 3 descriptive words (e.g., 'fuzzy', 'soft', 'light'). (5 Mins)",
      explore: "Pupils work in pairs with sensory flashcards, sorting words into Sight, Touch, Sound, Taste, and Smell columns. (10 Mins)",
      explain: "Teacher models sentence enhancement: 'The dog barked' becomes 'The ferocious brown dog barked loudly.' Discuss how adjectives make writing vivid for the reader. (10 Mins)",
      elaborate: "Pupils write a 3-sentence description of a traditional Nigerian festival dish (e.g., hot jollof rice or crispy puff-puff) using at least 4 sensory adjectives. (10 Mins)",
      evaluate: "Exit ticket: Circle all adjectives in 3 test sentences on the whiteboard. (5 Mins)"
    },
    differentiation: {
      support: "Provide a color-coded adjective bank with pictorial clues.",
      extension: "Challenge students to use comparative and superlative adjective forms (sweet, sweeter, sweetest)."
    }
  },
  computer_p5_cyber_safety: {
    title: "Digital Citizenship, Strong Passwords & Online Privacy",
    subject: "Computer Studies (ICT)",
    grade: 5,
    duration: "40 Minutes",
    standards: "NERDC Basic 5 ICT; UK Computing KS2; ISTE Digital Citizen Standards",
    objectives: [
      "Define personal identifiable information (PII) and explain why it must never be shared publicly online.",
      "Evaluate password strength and generate an unbreakable 8+ character alphanumeric password."
    ],
    materials: "Laminated scenario flashcards (Phishing, cyberbullying, password sharing), interactive digital safety checklist.",
    steps: {
      engage: "Show a padlock and ask: 'Why do we lock our front door? How do we lock our personal information on the internet?' (5 Mins)",
      explore: "Learners review 4 mock social media messages and identify security red flags (asking for home address, school name, phone number, or passwords). (10 Mins)",
      explain: "Teacher introduces the '3-Rule Digital Shield': (1) Keep PII private, (2) Use strong passwords with numbers & symbols, (3) Tell a trusted adult immediately if anything feels unsafe. (10 Mins)",
      elaborate: "Pupils practice creating a secure 'Pass-Phrase' by combining 3 unrelated words with numbers and symbols (e.g., 'Green#Lion!99'). (10 Mins)",
      evaluate: "Complete a 5-item diagnostic CBT cyber safety challenge on Super Quiz. (5 Mins)"
    },
    differentiation: {
      support: "Use mnemonic acronym 'S.A.F.E.' (Secret, Adult, Friends only, Exit).",
      extension: "Analyze real-world 2-factor authentication (2FA) and encryption concepts."
    }
  }
};

/* ==========================================================================
   2D & 3D GEOMETRY SHAPES DATABASE
   ========================================================================== */

window.GEOMETRY_SHAPES_DATA = [
  { name: "Equilateral Triangle", type: "2D", sides: 3, vertices: 3, angles: "All 3 angles equal (60° each, sum = 180°)", symmetry: 3, formula: "Area = (1/2) × base × height", realLife: "Yield traffic sign, triangular musical instrument" },
  { name: "Square", type: "2D", sides: 4, vertices: 4, angles: "4 equal right angles (90° each, sum = 360°)", symmetry: 4, formula: "Perimeter = 4s; Area = s²", realLife: "Chessboard square, floor tile, window pane" },
  { name: "Rectangle", type: "2D", sides: 4, vertices: 4, angles: "4 equal right angles (90° each)", symmetry: 2, formula: "Perimeter = 2(L + W); Area = L × W", realLife: "Classroom chalkboard, textbook cover, door" },
  { name: "Parallelogram", type: "2D", sides: 4, vertices: 4, angles: "Opposite angles are equal", symmetry: 0, formula: "Area = base × perpendicular height", realLife: "Roof structure slants, building facade panels" },
  { name: "Trapezium (Trapezoid)", type: "2D", sides: 4, vertices: 4, angles: "1 pair of parallel opposite sides", symmetry: 1, formula: "Area = (1/2)(a + b) × h", realLife: "Bridge truss beams, popcorn bucket cross-section" },
  { name: "Rhombus", type: "2D", sides: 4, vertices: 4, angles: "Opposite angles equal; 4 equal sides", symmetry: 2, formula: "Area = (1/2) × d₁ × d₂", realLife: "Kite diamond shape, road warning diamond signs" },
  { name: "Circle", type: "2D", sides: 1, vertices: 0, angles: "360° full rotation", symmetry: "Infinite", formula: "Circumference = 2πr; Area = πr²", realLife: "Wall clock, bicycle wheel, ₦1 coin" },
  { name: "Cube", type: "3D", faces: 6, edges: 12, vertices: 8, net: "6 equal square faces", formula: "Surface Area = 6s²; Volume = s³", realLife: "Playing dice, Rubik's cube, sugar cube" },
  { name: "Cuboid (Rectangular Prism)", type: "3D", faces: 6, edges: 12, vertices: 8, net: "6 rectangular faces", formula: "Volume = L × W × H", realLife: "Matchbox, shoe box, brick, classroom cupboard" },
  { name: "Cylinder", type: "3D", faces: 3, edges: 2, vertices: 0, net: "2 circular bases + 1 rectangular curved face", formula: "Volume = πr²h", realLife: "Milk tin, canned tomato paste, drum, pipe" },
  { name: "Cone", type: "3D", faces: 2, edges: 1, vertices: 1, net: "1 circular base + 1 sector circular face", formula: "Volume = (1/3)πr²h", realLife: "Ice cream cone, party hat, traffic cone" },
  { name: "Sphere", type: "3D", faces: 1, edges: 0, vertices: 0, net: "Continuous curved surface", formula: "Volume = (4/3)πr³", realLife: "Football, planet Earth, orange, marble" },
  { name: "Triangular Prism", type: "3D", faces: 5, edges: 9, vertices: 6, net: "2 triangular bases + 3 rectangular faces", formula: "Volume = (1/2) × b × h × Length", realLife: "Toblerone chocolate box, camping tent, roof attic" },
  { name: "Square Pyramid", type: "3D", faces: 5, edges: 8, vertices: 5, net: "1 square base + 4 triangular faces", formula: "Volume = (1/3) × Base Area × Height", realLife: "Great Pyramids of Giza, Egyptian monuments" }
];

/* ==========================================================================
   NIGERIAN 36 STATES & FCT GEOPOLITICAL DIRECTORY & RESOURCES
   ========================================================================== */

window.NIGERIAN_STATES = [
  { state: "Abia", capital: "Umuahia", zone: "South East", slogan: "God's Own State", resources: "Crude oil, Palm oil, Cassava, Limestone", landmark: "National War Museum, Umuahia" },
  { state: "Adamawa", capital: "Yola", zone: "North East", slogan: "Land of Beauty", resources: "Cattle, Cotton, Maize, Groundnut", landmark: "Sukur Cultural Landscape (UNESCO)" },
  { state: "Akwa Ibom", capital: "Uyo", zone: "South South", slogan: "Land of Promise", resources: "Petroleum, Natural gas, Palm oil, Seafood", landmark: "Ibom Tropicana, Godswill Akpabio Stadium" },
  { state: "Anambra", capital: "Awka", zone: "South East", slogan: "Light of the Nation", resources: "Natural gas, Palm oil, Cassava, Rice", landmark: "Ogbunike Caves, Onitsha Main Market" },
  { state: "Bauchi", capital: "Bauchi", zone: "North East", slogan: "Pearl of Tourism", resources: "Livestock, Sorghum, Millet, Gypsum", landmark: "Yankari National Park & Wikki Warm Springs" },
  { state: "Bayelsa", capital: "Yenagoa", zone: "South South", slogan: "Glory of All Lands", resources: "Petroleum, Natural gas, Palm oil, Fish", landmark: "Oloibiri First Oil Well Museum" },
  { state: "Benue", capital: "Makurdi", zone: "North Central", slogan: "Food Basket of the Nation", resources: "Yam, Soya beans, Cassava, Citrus, Limestone", landmark: "River Benue, Ikwe Holiday Resort" },
  { state: "Borno", capital: "Maiduguri", zone: "North East", slogan: "Home of Peace", resources: "Gum Arabic, Groundnuts, Fish, Cattle", landmark: "Lake Chad Basin, Shehu's Palace" },
  { state: "Cross River", capital: "Calabar", zone: "South South", slogan: "The People's Paradise", resources: "Cocoa, Rubber, Oil palm, Limestone", landmark: "Obudu Mountain Resort, Calabar Slave History Museum" },
  { state: "Delta", capital: "Asaba", zone: "South South", slogan: "The Big Heart", resources: "Crude oil, Natural gas, Rubber, Timber", landmark: "River Niger Bridge Asaba, Nana Palace Koko" },
  { state: "Ebonyi", capital: "Abakaliki", zone: "South East", slogan: "Salt of the Nation", resources: "Lead, Zinc, Salt, Rice, Yam", landmark: "Abakaliki Green Lake, Amanchor Cave" },
  { state: "Edo", capital: "Benin City", zone: "South South", slogan: "Heart Beat of the Nation", resources: "Crude oil, Rubber, Timber, Limestone", landmark: "Benin Moat, Oba's Palace, National Museum" },
  { state: "Ekiti", capital: "Ado-Ekiti", zone: "South West", slogan: "Land of Honour and Integrity", resources: "Cocoa, Timber, Kolanut, Granite", landmark: "Ikogosi Warm and Cold Springs" },
  { state: "Enugu", capital: "Enugu", zone: "South East", slogan: "Coal City State", resources: "Coal, Limestone, Iron ore, Cashew", landmark: "Awhum Waterfall, Ngwo Pine Forest & Caves" },
  { state: "FCT Abuja", capital: "Abuja", zone: "North Central", slogan: "Centre of Unity", resources: "Marble, Clay, Tantalite, Horticulture", landmark: "Zuma Rock, Aso Rock, National Mosque & Christian Centre" },
  { state: "Gombe", capital: "Gombe", zone: "North East", slogan: "Jewel in the Savannah", resources: "Cotton, Maize, Groundnut, Gypsum", landmark: "Tomb of Bubayero, Ashaka Cement Works" },
  { state: "Imo", capital: "Owerri", zone: "South East", slogan: "Eastern Heartland", resources: "Crude oil, Palm oil, Rubber, Natural gas", landmark: "Oguta Lake Holiday Resort, Nekede Zoo" },
  { state: "Jigawa", capital: "Dutse", zone: "North West", slogan: "The New World", resources: "Groundnut, Sorghum, Sesame, Cattle", landmark: "Dutse Rock Formations, Baturiya Bird Sanctuary" },
  { state: "Kaduna", capital: "Kaduna", zone: "North West", slogan: "Centre of Learning", resources: "Cotton, Ginger, Maize, Clay, Gold", landmark: "Nok Village Terra Cotta, Kajuru Castle" },
  { state: "Kano", capital: "Kano", zone: "North West", slogan: "Centre of Commerce", resources: "Groundnuts, Leather, Textiles, Sorghum", landmark: "Ancient Kano City Walls, Kurmi Market, Emir Palace" },
  { state: "Katsina", capital: "Katsina", zone: "North West", slogan: "Home of Hospitality", resources: "Cotton, Groundnuts, Millet, Kaolin", landmark: "Gobarau Minaret, Kusugu Well Daura" },
  { state: "Kebbi", capital: "Birnin Kebbi", zone: "North West", slogan: "Land of Equity", resources: "Rice, Fish, Wheat, Gold, Livestock", landmark: "Argungu International Fishing Festival" },
  { state: "Kogi", capital: "Lokoja", zone: "North Central", slogan: "The Confluence State", resources: "Iron ore, Limestone, Coal, Cashew, Yam", landmark: "Confluence of Rivers Niger and Benue, Lord Lugard Rest House" },
  { state: "Kwara", capital: "Ilorin", zone: "North Central", slogan: "State of Harmony", resources: "Cashew, Cocoa, Shea butter, Marble", landmark: "Esie Soapstone Museum, Owu Waterfalls" },
  { state: "Lagos", capital: "Ikeja", zone: "South West", slogan: "Centre of Excellence", resources: "Fish, Coconut, Commerce, Crude oil", landmark: "National Theatre Iganmu, Lekki Conservation Centre, Badagry Slave Route" },
  { state: "Nasarawa", capital: "Lafia", zone: "North Central", slogan: "Home of Solid Minerals", resources: "Barytes, Salt, Columbite, Cassava", landmark: "Farin Ruwa Waterfalls, Eggon Hills" },
  { state: "Niger", capital: "Minna", zone: "North Central", slogan: "The Power State", resources: "Hydro-electric power (Kainji, Shiroro, Jebba), Rice, Yam, Gold", landmark: "Zuma Rock, Gurara Waterfalls, Kainji National Park" },
  { state: "Ogun", capital: "Abeokuta", zone: "South West", slogan: "Gateway State", resources: "Limestone, Cocoa, Kolanut, Rubber", landmark: "Olumo Rock, Bilikisu Sungbo Shrine" },
  { state: "Ondo", capital: "Akure", zone: "South West", slogan: "Sunshine State", resources: "Cocoa, Bitumen, Crude oil, Timber", landmark: "Idanre Hills (UNESCO Tentative), Owo Museum of Antiquities" },
  { state: "Osun", capital: "Osogbo", zone: "South West", slogan: "State of the Living Spring", resources: "Cocoa, Gold, Cassava, Kolanut", landmark: "Osun-Osogbo Sacred Grove (UNESCO), Erin-Ijesha Waterfalls" },
  { state: "Oyo", capital: "Ibadan", zone: "South West", slogan: "Pace Setter State", resources: "Cocoa, Cassava, Maize, Marble", landmark: "Cocoa House (First skyscraper in West Africa), Bower's Tower, UI Zoo" },
  { state: "Plateau", capital: "Jos", zone: "North Central", slogan: "Home of Peace and Tourism", resources: "Tin, Columbite, Irish potato, Vegetables", landmark: "Shere Hills, Kurra Falls, Jos Wildlife Park" },
  { state: "Rivers", capital: "Port Harcourt", zone: "South South", slogan: "Treasure Base of the Nation", resources: "Crude oil, Natural gas, Palm oil, Seafood", landmark: "Isaac Boro Garden, Port Harcourt Tourist Beach" },
  { state: "Sokoto", capital: "Sokoto", zone: "North West", slogan: "Seat of the Caliphate", resources: "Livestock, Leather, Phosphate, Millet", landmark: "Sultan's Palace, Hubbare (Usman dan Fodio Tomb)" },
  { state: "Taraba", capital: "Jalingo", zone: "North East", slogan: "Nature's Gift to the Nation", resources: "Tea, Timber, Cattle, Coffee, Rice", landmark: "Mambilla Plateau, Gashaka-Gumti National Park" },
  { state: "Yobe", capital: "Damaturu", zone: "North East", slogan: "Pride of the Sahel", resources: "Gum Arabic, Groundnut, Potash, Livestock", landmark: "Dufuna Canoe (Oldest boat in Africa ~8,000 years old)" },
  { state: "Zamfara", capital: "Gusau", zone: "North West", slogan: "Farming is Our Pride", resources: "Gold, Lead, Cotton, Groundnut, Livestock", landmark: "Kiyawa City Walls, Namu Wood Carving" }
];

/* ==========================================================================
   NIGERIAN NAIRA BANKNOTES & NATIONAL HEROES GUIDE
   ========================================================================== */

window.NAIRA_CURRENCY_BANK = [
  { note: "₦5", color: "Mauve", portrait: "Sir Abubakar Tafawa Balewa", role: "First and only Prime Minister of Independent Nigeria (1960–1966)", reverse: "Nkpokiti Traditional Dancers of South-East Nigeria" },
  { note: "₦10", color: "Red-Brown", portrait: "Dr. Alvan Ikoku", role: "Pioneering educationist, activist, and champion of teachers' welfare", reverse: "Fulani Milk Maids carrying calabashes (North Nigeria)" },
  { note: "₦20", color: "Green", portrait: "General Murtala Ramat Muhammed", role: "Head of State who championed national discipline and civil service reform", reverse: "Ladi Kwali, famous Nigerian master potter from Abuja" },
  { note: "₦50", color: "Blue", portrait: "People of Nigeria (National Diversity)", role: "Portraits representing various Nigerian ethnic cultures", reverse: "Local Fishermen at Argungu Fishing Festival" },
  { note: "₦100", color: "Brown", portrait: "Chief Obafemi Awolowo", role: "Premier of Western Nigeria; architect of free universal primary education (1955)", reverse: "Zuma Rock in Niger State / Federal Capital Territory" },
  { note: "₦200", color: "Green-Blue", portrait: "Sir Ahmadu Bello (Sardauna of Sokoto)", role: "Premier of Northern Nigeria; pioneer of educational institutions in the North", reverse: "Agricultural Produce: Groundnut pyramids, cattle and grain sacks" },
  { note: "₦500", color: "Pink-Blue", portrait: "Dr. Nnamdi Azikiwe (Zik of Africa)", role: "First President of the Federal Republic of Nigeria (1963–1966)", reverse: "Offshore Oil Drilling Rig in the Niger Delta" },
  { note: "₦1000", color: "Dark Brown", portrait: "Alhaji Aliyu Mai-Bornu & Dr. Clement Isong", role: "First two indigenous Governors of the Central Bank of Nigeria (CBN)", reverse: "Central Bank of Nigeria (CBN) Corporate Headquarters in Abuja" }
];

/* ==========================================================================
   SOLAR SYSTEM PLANETARY DATA (PRIMARY ASTRONOMY)
   ========================================================================== */

window.SOLAR_SYSTEM_DATA = [
  { name: "Mercury", type: "Terrestrial Planet", dist: "57.9M km", orbit: "88 Earth days", moons: 0, gravity: "3.7 m/s²", fact: "Smallest planet and closest to the Sun; has extreme temperature swings from -180°C to 430°C." },
  { name: "Venus", type: "Terrestrial Planet", dist: "108.2M km", orbit: "225 Earth days", moons: 0, gravity: "8.87 m/s²", fact: "Hottest planet in the solar system (465°C) due to a runaway greenhouse effect with thick CO₂ clouds." },
  { name: "Earth", type: "Terrestrial Planet", dist: "149.6M km", orbit: "365.25 days", moons: 1, gravity: "9.8 m/s²", fact: "Our home planet; the only known celestial body in the universe supporting liquid water and life." },
  { name: "Mars", type: "Terrestrial Planet", dist: "227.9M km", orbit: "687 Earth days", moons: 2, gravity: "3.71 m/s²", fact: "Known as the 'Red Planet' due to iron oxide (rust) covering its dusty soil; home to Olympus Mons volcano." },
  { name: "Jupiter", type: "Gas Giant", dist: "778.6M km", orbit: "11.86 Earth years", moons: 95, gravity: "24.79 m/s²", fact: "Largest planet in the solar system; its Great Red Spot is a gigantic hurricane larger than planet Earth." },
  { name: "Saturn", type: "Gas Giant", dist: "1.43B km", orbit: "29.45 Earth years", moons: 146, gravity: "10.44 m/s²", fact: "Famous for its spectacular, wide system of rings made of billions of chunks of water ice, dust, and rock." },
  { name: "Uranus", type: "Ice Giant", dist: "2.87B km", orbit: "84 Earth years", moons: 28, gravity: "8.69 m/s²", fact: "Spins on its side at an extreme 98° tilt; appears pale cyan-blue due to atmospheric methane gas." },
  { name: "Neptune", type: "Ice Giant", dist: "4.50B km", orbit: "164.8 Earth years", moons: 16, gravity: "11.15 m/s²", fact: "Farthest major planet from the Sun; has supersonic wind storms exceeding 2,000 kilometers per hour." }
];

/* ==========================================================================
   HUMAN BODY ORGAN SYSTEMS (PRIMARY ANATOMY)
   ========================================================================== */

window.HUMAN_BODY_SYSTEMS = [
  { name: "Skeletal System", icon: "🦴", organs: "206 Bones, Cartilage, Joints, Ligaments", function: "Supports the body structure, protects delicate internal organs (e.g. ribcage protects heart/lungs), and allows movement.", healthTip: "Consume calcium-rich foods like milk, fish, and beans for strong bone density." },
  { name: "Circulatory System", icon: "❤️", organs: "Heart, Arteries, Veins, Capillaries, Blood", function: "Pumps oxygen and nutrients through blood vessels to all body cells and removes carbon dioxide waste.", healthTip: "Exercise regularly (aerobic running/skipping) to keep your cardiac heart muscle fit." },
  { name: "Respiratory System", icon: "🫁", organs: "Nose, Trachea (Windpipe), Bronchi, Lungs, Alveoli", function: "Inhales fresh oxygen into the bloodstream and exhales carbon dioxide waste gas.", healthTip: "Avoid breathing smoke, dust, and toxic fumes; practice deep breathing in fresh air." },
  { name: "Digestive System", icon: "🍏", organs: "Mouth (Teeth/Saliva), Oesophagus, Stomach, Small & Large Intestine, Liver", function: "Breaks down ingested food into simple soluble nutrients that body cells can absorb for energy.", healthTip: "Chew food thoroughly before swallowing and drink plenty of clean water daily." },
  { name: "Nervous System", icon: "🧠", organs: "Brain, Spinal Cord, Peripheral Nerves", function: "Controls all conscious thought, memory, reflexes, motor movements, and receives 5-sense sensory signals.", healthTip: "Get 8 to 10 hours of sound sleep each night for neural brain repair and memory consolidation." }
];

/* ==========================================================================
   PERIODIC TABLE ELEMENTS (PRIMARY SCIENCE LAB)
   ========================================================================== */

window.PERIODIC_TABLE_PRIMARY = [
  { num: 1, sym: "H", name: "Hydrogen", mass: "1.008", category: "Nonmetal", desc: "Lightest and most abundant element in the universe; combines with oxygen to form water (H₂O)." },
  { num: 2, sym: "He", name: "Helium", mass: "4.003", category: "Noble Gas", desc: "Lighter than air, non-flammable gas used to inflate party balloons and airships." },
  { num: 6, sym: "C", name: "Carbon", mass: "12.011", category: "Nonmetal", desc: "The foundation of all living matter on Earth; forms diamonds, graphite in pencils, and charcoal." },
  { num: 7, sym: "N", name: "Nitrogen", mass: "14.007", category: "Nonmetal", desc: "Makes up 78% of Earth's atmosphere; essential element in soil fertilizers for crop growth." },
  { num: 8, sym: "O", name: "Oxygen", mass: "15.999", category: "Nonmetal", desc: "Makes up 21% of air; required by humans and animals for aerobic cellular respiration." },
  { num: 11, sym: "Na", name: "Sodium", mass: "22.990", category: "Alkali Metal", desc: "Soft, highly reactive metal that joins with Chlorine to make ordinary table salt (NaCl)." },
  { num: 12, sym: "Mg", name: "Magnesium", mass: "24.305", category: "Alkaline Earth", desc: "Burns with an intense brilliant white light; central atom in chlorophyll for photosynthesis." },
  { num: 13, sym: "Al", name: "Aluminium", mass: "26.982", category: "Post-Transition", desc: "Lightweight, rust-resistant metal used for kitchen foil, beverage cans, and airplane bodies." },
  { num: 14, sym: "Si", name: "Silicon", mass: "28.085", category: "Metalloid", desc: "Found in beach sand (SiO₂); essential semiconductor in computer microprocessor chips." },
  { num: 15, sym: "P", name: "Phosphorus", mass: "30.974", category: "Nonmetal", desc: "Crucial for healthy bones and teeth; used in matchstick heads and agricultural fertilizers." },
  { num: 16, sym: "S", name: "Sulfur", mass: "32.06", category: "Nonmetal", desc: "Bright yellow solid found near volcanoes; used in medicines, matches, and car batteries." },
  { num: 17, sym: "Cl", name: "Chlorine", mass: "35.45", category: "Halogen", desc: "Greenish gas used in water treatment plants and swimming pools to disinfect bacteria." },
  { num: 19, sym: "K", name: "Potassium", mass: "39.098", category: "Alkali Metal", desc: "Vital mineral for heart and muscle function; abundantly found in ripe bananas." },
  { num: 20, sym: "Ca", name: "Calcium", mass: "40.078", category: "Alkaline Earth", desc: "Crucial for building and maintaining strong bones and teeth; found in milk and limestone." },
  { num: 26, sym: "Fe", name: "Iron", mass: "55.845", category: "Transition Metal", desc: "Strong structural metal used to make steel; carries oxygen in red blood cell haemoglobin." },
  { num: 29, sym: "Cu", name: "Copper", mass: "63.546", category: "Transition Metal", desc: "Reddish metal with exceptional electrical conductivity; used for domestic electrical wires." },
  { num: 30, sym: "Zn", name: "Zinc", mass: "65.38", category: "Transition Metal", desc: "Protective coating for galvanized roofing sheets to prevent rusting; supports immune health." },
  { num: 47, sym: "Ag", name: "Silver", mass: "107.87", category: "Precious Metal", desc: "Lustrous white precious metal with highest electrical conductivity; used for jewelry and mirrors." },
  { num: 79, sym: "Au", name: "Gold", mass: "196.97", category: "Precious Metal", desc: "Non-tarnishing malleable yellow precious metal; revered across world civilizations for millennia." }
];

/* ==========================================================================
   MATHEMATICS FORMULAS & CHEAT SHEET REFERENCE
   ========================================================================== */

window.MATH_FORMULAS_DATA = [
  { topic: "Perimeter", formulas: ["Square: P = 4 × side", "Rectangle: P = 2(Length + Width)", "Triangle: P = a + b + c", "Circle Circumference: C = 2πr = πd (where π ≈ 22/7 or 3.142)"] },
  { topic: "Area", formulas: ["Square: A = s²", "Rectangle: A = L × W", "Triangle: A = (1/2) × base × height", "Parallelogram: A = base × height", "Trapezium: A = (1/2)(a + b) × h", "Circle: A = πr²"] },
  { topic: "Volume", formulas: ["Cube: V = s³", "Cuboid: V = L × W × H", "Cylinder: V = πr²h", "Cone: V = (1/3)πr²h", "Sphere: V = (4/3)πr³"] },
  { topic: "Commercial Arithmetic", formulas: ["Profit = Selling Price - Cost Price", "Loss = Cost Price - Selling Price", "Percentage Profit = (Profit / Cost Price) × 100%", "Simple Interest: I = (P × R × T) / 100", "Total Amount: A = Principal + Interest"] },
  { topic: "Motion & Speed", formulas: ["Speed = Distance / Time", "Distance = Speed × Time", "Time = Distance / Speed", "Average Speed = Total Distance / Total Time"] },
  { topic: "Statistics", formulas: ["Mean (Average) = (Sum of all numbers) / (Count of numbers)", "Median = Middle number in an ordered set", "Mode = Most frequently occurring number", "Range = Highest value - Lowest value"] }
];

/* ==========================================================================
   NIGERIAN & WORLD PRIMARY HISTORY TIMELINE
   ========================================================================== */

window.HISTORY_TIMELINE_DATA = [
  { year: "500 BCE", event: "Nok Culture Flourishes", desc: "Earliest known terracotta sculptures and iron-smelting furnaces in Sub-Saharan Africa (Kaduna/Plateau State)." },
  { year: "900 CE", event: "Igbo-Ukwu Bronze Artistry", desc: "Sophisticated lost-wax bronze castings, glass beads, and ceremonial regalia discovered in Anambra State." },
  { year: "1180 CE", event: "Rise of the Kingdom of Benin", desc: "Oba Eweka I establishes the second dynasty; legendary bronze casting guilds and Benin City defensive moats." },
  { year: "1400 CE", event: "Expansion of Oyo Empire", desc: "Alaafin leadership with the Oyo Mesi council and the legendary cavalry military defense system." },
  { year: "1804 CE", event: "Sokoto Caliphate Established", desc: "Sheikh Usman Dan Fodio leads administrative, religious, and scholarly reforms across Northern Nigeria." },
  { year: "1861 CE", event: "Annexation of Lagos Colony", desc: "British crown establishes colonial rule over Lagos port under King Docemo treaty." },
  { year: "1914 CE", event: "Amalgamation of Nigeria", desc: "Lord Frederick Lugard merges Northern and Southern Protectorates into a single colony called Nigeria." },
  { year: "1955 CE", event: "Free Universal Primary Education", desc: "Chief Obafemi Awolowo launches the first free primary education scheme in Western Nigeria." },
  { year: "1960 CE", event: "Nigerian Independence (Oct 1)", desc: "Nigeria achieves sovereign independence from Great Britain; Sir Abubakar Tafawa Balewa becomes Prime Minister." },
  { year: "1963 CE", event: "First Republic Declared", desc: "Nigeria adopts a republican constitution; Dr. Nnamdi Azikiwe is inaugurated as first President." },
  { year: "1976 CE", event: "Creation of 19 States & FCT Abuja", desc: "General Murtala Muhammed expands states and initiates the relocation of federal capital to Abuja." },
  { year: "1999 CE", event: "Fourth Republic Democracy", desc: "Nigeria returns to stable democratic governance with a new constitution under President Olusegun Obasanjo." }
];

/* ==========================================================================
   INTERNATIONAL CURRICULA EQUIVALENCY MATRIX & CROSSWALK DATA
   ========================================================================== */

window.INTERNATIONAL_CURRICULA = {
  maths: {
    nerdc: "NERDC 9-Year Basic Education: Number & Numeration, Basic Operations, Measurement, Geometry, Data Presentation, Everyday Algebra.",
    cambridge: "Cambridge Primary Mathematics (0096): Number, Geometry & Measure, Statistics & Probability, Thinking & Working Mathematically.",
    uk_nc: "UK National Curriculum KS1/2: Number fluency, Fractions/Decimals, Ratio/Proportion, Measurement, Properties of Shapes, Statistics, Algebra.",
    us_ccss: "US Common Core (CCSS.MATH): Operations & Algebraic Thinking, Numbers in Base Ten, Fractions, Measurement & Data, Geometry.",
    ib_pyp: "IB Primary Years Programme: Data handling, Measurement, Shape & Space, Pattern & Function, Number systems.",
    essentialQuestions: "How do numbers represent quantities in our universe? How does spatial reasoning help us construct the built world?",
    enduringUnderstandings: "Mathematical operations represent real-world relationships and can be modeled with concrete, pictorial, and abstract representations."
  },
  english: {
    nerdc: "NERDC English Studies: Phonics, Phonemic Awareness, Grammatical Accuracy, Reading Comprehension, Literary Appreciation, Composition.",
    cambridge: "Cambridge Primary English (0058): Reading (Fiction/Non-fiction), Writing (Conventions & Composition), Speaking and Listening.",
    uk_nc: "UK National Curriculum KS1/2 English: Spoken language, Reading (word reading & comprehension), Writing (transcription, handwriting, composition).",
    us_ccss: "US Common Core (CCSS.ELA): Reading Literature/Informational, Foundational Skills, Writing, Speaking & Listening, Language Conventions.",
    ib_pyp: "IB PYP Language Scope & Sequence: Oral language (Listening & Speaking), Visual language (Viewing & Presenting), Written language (Reading & Writing).",
    essentialQuestions: "How do words shape human ideas and empathy? How does clear communication unite diverse global communities?",
    enduringUnderstandings: "Language is a structured, expressive system through which humans share information, preserve heritage, and solve problems."
  },
  science: {
    nerdc: "NERDC Basic Science & Technology: Living/Non-living things, Human Body, Ecosystems, Matter, Energy, Simple Machines, Earth & Space.",
    cambridge: "Cambridge Primary Science (0097): Biology, Chemistry, Physics, Earth and Space, Science in Context, Scientific Enquiry.",
    uk_nc: "UK National Curriculum KS1/2 Science: Working scientifically, Plants, Animals including humans, Everyday materials, Earth and space, Forces, Light, Sound.",
    us_ccss: "US NGSS (Next Generation Science Standards): Life Sciences (LS), Physical Sciences (PS), Earth & Space Sciences (ESS), Engineering Design (ETS).",
    ib_pyp: "IB PYP Science Scope & Sequence: Living things, Earth and space, Materials and matter, Forces and energy.",
    essentialQuestions: "How do living organisms adapt to survive in dynamic environments? What fundamental forces govern the universe?",
    enduringUnderstandings: "Scientific inquiry uses empirical evidence, systematic observation, and hypothesis testing to understand natural phenomena."
  },
  social: {
    nerdc: "NERDC Social Studies: Family, Culture & Social Values, Nigerian Geography & 36 States, Leadership, National Economy, Global Organizations.",
    cambridge: "Cambridge Primary Global Perspectives (0838): Research, Analysis, Evaluation, Reflection, Collaboration and Communication.",
    uk_nc: "UK National Curriculum KS1/2 Geography & Citizenship: Locational knowledge, Place knowledge, Human and physical geography, Fieldwork, Democratic values.",
    us_ccss: "US NCSS Social Studies Standards: Culture, Time/Continuity/Change, People/Places/Environments, Civic Ideals and Practices.",
    ib_pyp: "IB PYP Social Studies: Human systems and economic activities, Social organization and culture, Continuity and change through time, Human and natural environments.",
    essentialQuestions: "How does human geography influence cultural diversity and economic trade? What does it mean to be a responsible citizen?",
    enduringUnderstandings: "Communities thrive when diverse individuals cooperate, respect legal frameworks, and sustainably steward natural resources."
  }
};

/* ==========================================================================
   LEARNING SCIENCE COMPENDIUM & ACADEMIC WHITE PAPER REFERENCES
   ========================================================================== */

window.LEARNING_SCIENCE_RESEARCH = [
  {
    author: "Roediger & Karpicke (2006)",
    title: "The Power of Testing: Basic Research and Implications for Educational Practice",
    journal: "Perspectives on Psychological Science",
    principle: "The Testing Effect / Active Retrieval Practice",
    effectSize: "d = 0.74 (Strong)",
    finding: "Actively retrieving information from memory produces superior long-term retention compared to passive re-reading or re-studying.",
    application: "Primary Super Quiz requires learners to actively recall and generate answers, strengthening neural pathways and consolidating long-term memory."
  },
  {
    author: "Bjork & Bjork (1994, 2011)",
    title: "Desirable Difficulties in Learning: Making Storage and Retrieval Dynamic",
    journal: "Cognitive Psychology in Educational Practice",
    principle: "Desirable Difficulties, Spacing & Interleaving",
    effectSize: "d = 0.65 (Strong)",
    finding: "Introducing spacing and interleaving different subject topics creates initial effort that dramatically accelerates durable learning.",
    application: "The 'Champion Mix' mode interleaves multiple subject domains, preventing rote memorization and training cognitive flexibility."
  },
  {
    author: "Sweller, J. (1988, 2011)",
    title: "Cognitive Load Theory and Instructional Design",
    journal: "Educational Psychology Review",
    principle: "Cognitive Load Theory (Intrinsic, Extraneous, Germane)",
    effectSize: "d = 0.58 (Moderate-Strong)",
    finding: "Working memory is severely limited (4±1 chunks). Minimizing extraneous visual clutter frees working memory for germane schema building.",
    application: "Clean typography, step-by-step visual hints, and distraction-free CBT layouts prevent extraneous cognitive overload in young pupils."
  },
  {
    author: "Mayer, R. E. (2009, 2020)",
    title: "Multimedia Learning: Principles for Digital Educational Design",
    journal: "Cambridge University Press",
    principle: "Dual-Coding & Multimedia Principles",
    effectSize: "d = 0.72 (Strong)",
    finding: "Humans learn significantly better from coordinated words and pictures than from words alone (Spatial Contiguity & Modality principles).",
    application: "Interactive concrete manipulatives (Abacus, Fraction strips, Geometry shapes, Solar System) pair visual representations with mathematical notation."
  },
  {
    author: "Vygotsky, L. S. (1978)",
    title: "Mind in Society: The Development of Higher Psychological Processes",
    journal: "Harvard University Press",
    principle: "Zone of Proximal Development (ZPD) & Dynamic Scaffolding",
    effectSize: "d = 0.68 (Strong)",
    finding: "Optimal learning occurs in the sweet spot between what a child can do independently and what they can achieve with targeted guidance.",
    application: "Our Smart Practice engine dynamically diagnoses knowledge frontiers, delivering calibrated hints, 50:50 eliminations, and conceptual explanations."
  },
  {
    author: "Dweck, C. S. (2006)",
    title: "Mindset: The New Psychology of Success",
    journal: "Random House / Educational Leadership",
    principle: "Growth Mindset & Mastery-Oriented Feedback",
    effectSize: "d = 0.49 (Moderate)",
    finding: "Praising effort, strategic problem-solving, and remediation of errors builds academic resilience and willingness to embrace challenges.",
    application: "Our post-test review highlights 'Growth Opportunities', rewards persistence streaks, and celebrates conceptual improvement rather than fixed intelligence."
  },
  {
    author: "Hattie, J. (2009, 2023)",
    title: "Visible Learning: The Sequel - A Synthesis of Over 2,100 Meta-Analyses",
    journal: "Routledge",
    principle: "Formative Evaluation & Timely Pedagogical Feedback",
    effectSize: "d = 0.73 (High Impact)",
    finding: "Immediate, specific, task-level formative feedback is one of the single most powerful instructional interventions known to educational science.",
    application: "Instant explanatory rationales and psychometric difficulty indices are immediately accessible to learners upon submitting responses."
  }
];

/* ==========================================================================
   BLOOM'S TAXONOMY COGNITIVE LEVELS & ACTION VERBS
   ========================================================================== */

window.BLOOMS_TAXONOMY_DESCRIPTORS = {
  Remember: { level: 1, color: "#3b82f6", verbs: "Define, identify, list, name, recall, state, recognize", prompt: "Pupil recalls foundational facts, definitions, formulas, and vocabulary." },
  Understand: { level: 2, color: "#10b981", verbs: "Describe, explain, summarize, translate, paraphrase, classify", prompt: "Pupil interprets meaning, compares concepts, and summarizes main ideas." },
  Apply: { level: 3, color: "#f59e0b", verbs: "Calculate, solve, demonstrate, compute, execute, implement", prompt: "Pupil applies mathematical procedures and rules to solve real-world problems." },
  Analyze: { level: 4, color: "#8b5cf6", verbs: "Differentiate, distinguish, examine, categorize, contrast, diagnose", prompt: "Pupil breaks down complex information, identifies cause-and-effect, and detects errors." },
  Evaluate: { level: 5, color: "#ec4899", verbs: "Assess, justify, judge, critique, defend, prioritize, rate", prompt: "Pupil makes reasoned judgments based on standards, evidence, and criteria." },
  Create: { level: 6, color: "#ef4444", verbs: "Design, construct, compose, generate, formulate, plan", prompt: "Pupil combines disparate elements into a novel cohesive structure or solution." }
};

/* ==========================================================================
   RANKS, BADGES, AND GROUPS
   ========================================================================== */

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
