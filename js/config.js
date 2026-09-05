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
  { note: "₦100", color: "Brown & Green", portrait: "Chief Obafemi Awolowo", role: "Premier of Western Nigeria who introduced Free Universal Primary Education in 1955", reverse: "Zuma Rock in Niger State & Traditional Dancers" },
  { note: "₦200", color: "Brown & Pink", portrait: "Sir Ahmadu Bello (Sardauna of Sokoto)", role: "Premier of Northern Nigeria and champion of education & agriculture", reverse: "Agricultural pyramids of Groundnuts, Cattle, and Cotton" },
  { note: "₦500", color: "Blue & Cyan", portrait: "Dr. Nnamdi Azikiwe (Zik of Africa)", role: "First President of Nigeria (1963) and foremost nationalist leader", reverse: "Offshore Oil Rig producing crude petroleum" },
  { note: "₦1000", color: "Dark Blue & Gold", portrait: "Alhaji Aliyu Mai-Bornu & Dr. Clement Isong", role: "First and second indigenous Governors of the Central Bank of Nigeria (CBN)", reverse: "Central Bank of Nigeria (CBN) National Headquarters, Abuja" }
];

/* ==========================================================================
   SOLAR SYSTEM ASTRONOMICAL DATA
   ========================================================================== */

window.SOLAR_SYSTEM_DATA = [
  { name: "Mercury", order: 1, type: "Terrestrial", distance: "57.9M km", diameter: "4,879 km", moons: 0, temp: "-180°C to 430°C", fact: "Smallest planet and closest to the Sun; has no atmosphere." },
  { name: "Venus", order: 2, type: "Terrestrial", distance: "108.2M km", diameter: "12,104 km", moons: 0, temp: "465°C (Hottest)", fact: "Has a runaway greenhouse effect; rotates backwards (East to West)." },
  { name: "Earth", order: 3, type: "Terrestrial", distance: "149.6M km", diameter: "12,742 km", moons: 1, temp: "-88°C to 58°C", fact: "Only known planet with liquid oceans and thriving living organisms." },
  { name: "Mars", order: 4, type: "Terrestrial", distance: "227.9M km", diameter: "6,779 km", moons: 2, temp: "-140°C to 20°C", fact: "Known as the Red Planet due to iron oxide (rust) on its surface." },
  { name: "Jupiter", order: 5, type: "Gas Giant", distance: "778.6M km", diameter: "139,820 km", moons: 95, temp: "-110°C", fact: "Largest planet in solar system; Great Red Spot is a giant spinning storm." },
  { name: "Saturn", order: 6, type: "Gas Giant", distance: "1.43B km", diameter: "116,460 km", moons: 146, temp: "-140°C", fact: "Famous for spectacular rings made of billions of ice chunks and dust." },
  { name: "Uranus", order: 7, type: "Ice Giant", distance: "2.87B km", diameter: "50,724 km", moons: 28, temp: "-195°C", fact: "Rotates completely on its side; pale cyan color from methane gas." },
  { name: "Neptune", order: 8, type: "Ice Giant", distance: "4.50B km", diameter: "49,244 km", moons: 16, temp: "-200°C", fact: "Farthest planet from the Sun; has supersonic winds exceeding 2,000 km/h." }
];

/* ==========================================================================
   HUMAN BODY SYSTEMS EXPLORER
   ========================================================================== */

window.HUMAN_BODY_SYSTEMS = [
  { name: "Skeletal System", icon: "🦴", organs: "206 Bones, Cartilage, Joints, Ligaments", function: "Supports the body structure, protects delicate internal organs (e.g. ribcage protects heart/lungs), and allows movement.", healthTip: "Consume calcium-rich foods like milk, fish, and beans for strong bone density." },
  { name: "Circulatory System", icon: "❤️", organs: "Heart, Arteries, Veins, Capillaries, Blood", function: "Pumps oxygen and nutrients through blood vessels to all body cells and removes carbon dioxide waste.", healthTip: "Exercise regularly (aerobic running/skipping) to keep your cardiac heart muscle fit." },
  { name: "Respiratory System", icon: "🫁", organs: "Nose, Trachea (Windpipe), Bronchi, Lungs, Alveoli", function: "Inhales fresh oxygen into the bloodstream and exhales carbon dioxide waste gas.", healthTip: "Avoid breathing smoke, dust, and toxic fumes; practice deep breathing in fresh air." },
  { name: "Digestive System", icon: "🍏", organs: "Mouth (Teeth/Saliva), Oesophagus, Stomach, Small & Large Intestine, Liver", function: "Breaks down ingested food into simple soluble nutrients that body cells can absorb for energy.", healthTip: "Chew food thoroughly before swallowing and drink plenty of clean water daily." },
  { name: "Nervous System", icon: "🧠", organs: "Brain, Spinal Cord, Peripheral Nerves", function: "Controls all conscious thought, memory, reflexes, motor movements, and receives 5-sense sensory signals.", healthTip: "Get 8 to 10 hours of sound sleep each night for neural brain repair and memory consolidation." }
];

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
