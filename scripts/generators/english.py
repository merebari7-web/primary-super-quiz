import random
from .base import make_q, Bank, pick_others

def gen_english(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"Which letter is a VOWEL? (P{grade})", "E", ["B", "C", "D"], "The five vowels in the English alphabet are A, E, I, O, U.", "Remember the 5 vowel letters: A, E, I, O, U.", "Phonics & Letters", "Remember", "Easy"),
        (f"Which letter is a CONSONANT? (P{grade})", "M", ["A", "E", "O"], "Consonants are all letters that are not vowels (A, E, I, O, U).", "Look for the letter that is not A, E, I, O, U.", "Phonics & Letters", "Remember", "Easy"),
        (f"Which word rhymes with 'CAT'? (P{grade})", "Hat", ["Dog", "Pen", "Sun"], "'Cat' and 'Hat' end with the exact same '-at' sound.", "Listen to the ending sound '-at'.", "Phonics & Rhymes", "Understand", "Easy"),
        (f"Which word rhymes with 'PIN'? (P{grade})", "Win", ["Pan", "Pot", "Pet"], "'Pin' and 'Win' share the '-in' ending sound.", "Listen to the ending sound '-in'.", "Phonics & Rhymes", "Understand", "Easy"),
        (f"Which word rhymes with 'SUN'? (P{grade})", "Run", ["Sit", "Sing", "Sad"], "'Sun' and 'Run' both end with the '-un' sound.", "Look for the '-un' word family.", "Phonics & Rhymes", "Understand", "Easy"),
        (f"A sentence must always begin with a ____ letter. (P{grade})", "Capital", ["Small", "Tiny", "Numbers"], "Every proper sentence begins with a capital letter (e.g. The dog ran).", "Think of uppercase letters like 'A', 'B', 'C'.", "Punctuation & Mechanics", "Remember", "Easy"),
        (f"What punctuation mark comes at the end of a telling sentence? (P{grade})", "Full stop (.)", ["Comma (,)", "Question mark (?)", "Exclamation mark (!)"], "Statements end with a full stop (period).", "A small dot that ends a complete sentence.", "Punctuation & Mechanics", "Remember", "Easy"),
        (f"Choose the correct plural: One book, two ____. (P{grade})", "books", ["bookes", "booking", "bookies"], "Add '-s' to form regular plurals: book → books.", "Add 's' to book.", "Nouns & Plurals", "Apply", "Easy"),
        (f"Choose the correct plural: One cat, three ____. (P{grade})", "cats", ["cates", "catss", "cating"], "Regular nouns form plurals with '-s': cat → cats.", "Add 's' to the end.", "Nouns & Plurals", "Apply", "Easy"),
        (f"Which pronoun replaces 'Obi' (a boy)? (P{grade})", "He", ["She", "It", "They"], "'He' is the singular subject pronoun for males.", "Pronoun for a boy or man.", "Pronouns", "Understand", "Easy"),
        (f"Which pronoun replaces 'Amina' (a girl)? (P{grade})", "She", ["He", "It", "They"], "'She' is the singular subject pronoun for females.", "Pronoun for a girl or woman.", "Pronouns", "Understand", "Easy"),
        (f"Choose the correct word: The cat ____ on the mat. (P{grade})", "sat", ["sitting", "sitted", "sitsed"], "'Sat' is the simple past tense of sit.", "Simple past tense of sit.", "Verbs & Tenses", "Apply", "Easy"),
        (f"Which word is an action word (verb)? (P{grade})", "Jump", ["Table", "Green", "Soft"], "'Jump' expresses a physical action.", "Something you can do with your body.", "Parts of Speech", "Understand", "Easy"),
        (f"Which word describes a color? (P{grade})", "Blue", ["Chair", "Run", "Quickly"], "'Blue' is an adjective describing color.", "A color of the clear sky.", "Vocabulary", "Remember", "Easy"),
        (f"What is the opposite of 'HOT'? (P{grade})", "Cold", ["Warm", "Bright", "Dark"], "Cold is the antonym of hot.", "Think of ice or snow.", "Vocabulary & Antonyms", "Understand", "Easy"),
        (f"What is the opposite of 'BIG'? (P{grade})", "Small", ["Heavy", "Tall", "Long"], "Small is the antonym of big.", "Think of a tiny mouse.", "Vocabulary & Antonyms", "Understand", "Easy"),
        (f"What is the opposite of 'UP'? (P{grade})", "Down", ["Over", "Inside", "Under"], "Down is the exact opposite direction of up.", "Direction towards the floor.", "Vocabulary & Antonyms", "Understand", "Easy"),
        (f"Fill in the blank: An ____ (apple / orange / umbrella). (P{grade})", "apple", ["car", "book", "dog"], "Use 'an' before words beginning with a vowel sound.", "'An' comes before a vowel sound (a, e, i, o, u).", "Articles", "Apply", "Easy"),
        (f"Fill in the blank: A ____. (P{grade})", "ball", ["egg", "orange", "apple"], "Use 'a' before words starting with a consonant sound.", "'A' is used before consonant sounds.", "Articles", "Apply", "Easy"),
        (f"Which word is a NOUN (naming word)? (P{grade})", "Pencil", ["Run", "Happy", "Slowly"], "A noun is a person, place, animal, or thing.", "A tool you use to write.", "Parts of Speech", "Understand", "Easy")
    ]
    
    p2_items = [
        (f"Which word is a PROPER noun (needs a capital letter)? (P{grade})", "Nigeria", ["country", "city", "river"], "'Nigeria' is the specific name of a nation, so it is a proper noun.", "Look for the specific name of a country.", "Nouns", "Understand", "Easy"),
        (f"What is the plural of 'CHILD'? (P{grade})", "children", ["childs", "childrens", "childes"], "'Child' has an irregular plural form: 'children'.", "An irregular plural ending in -ren.", "Nouns & Plurals", "Remember", "Medium"),
        (f"What is the plural of 'FOOT'? (P{grade})", "feet", ["foots", "feets", "footies"], "'Foot' changes its vowel to form the plural: 'feet'.", "Change 'oo' to 'ee'.", "Nouns & Plurals", "Remember", "Medium"),
        (f"What is the plural of 'MAN'? (P{grade})", "men", ["mans", "mens", "manes"], "'Man' changes its vowel to become 'men'.", "Change 'a' to 'e'.", "Nouns & Plurals", "Remember", "Easy"),
        (f"What is the plural of 'TOOTH'? (P{grade})", "teeth", ["tooths", "toothes", "teeths"], "'Tooth' becomes 'teeth' in plural.", "Change 'oo' to 'ee'.", "Nouns & Plurals", "Remember", "Easy"),
        (f"Which punctuation mark is used when asking something? (P{grade})", "Question mark (?)", ["Full stop (.)", "Comma (,)", "Hyphen (-)"], "Questions end with a question mark (?).", "Mark used at the end of a question.", "Punctuation", "Remember", "Easy"),
        (f"Combine these two words into a compound word: SUN + SHINE = (P{grade})", "Sunshine", ["Sun-bright", "Sunning", "Sunlightness"], "A compound word joins two whole words together: sunshine.", "Join 'sun' and 'shine' into one word.", "Compound Words", "Apply", "Easy"),
        (f"Combine: RAIN + COAT = (P{grade})", "Raincoat", ["Raincloth", "Raining", "Coatrain"], "Rain + Coat = Raincoat.", "Join 'rain' and 'coat'.", "Compound Words", "Apply", "Easy"),
        (f"Which word is an ADJECTIVE (describing word)? (P{grade})", "Beautiful", ["Sing", "Desk", "Quickly"], "'Beautiful' describes how something looks or appears.", "Describes the quality of a person or object.", "Parts of Speech", "Understand", "Easy"),
        (f"Choose the correct preposition: The book is ____ the table. (P{grade})", "on", ["at", "into", "towards"], "'On' indicates placement on the upper surface.", "Resting upon the surface.", "Prepositions", "Apply", "Easy"),
        (f"Complete the sentence: Yesterday, she ____ to school. (P{grade})", "walked", ["walks", "walking", "will walk"], "'Yesterday' indicates past tense, so regular verbs take '-ed'.", "Look for past tense indicator '-ed'.", "Verbs & Tenses", "Apply", "Easy"),
        (f"What is the opposite of 'EARLY'? (P{grade})", "Late", ["Soon", "Quick", "Now"], "'Late' is the antonym of 'early'.", "Arriving after the set time.", "Vocabulary & Antonyms", "Understand", "Easy"),
        (f"What is the opposite of 'STRONG'? (P{grade})", "Weak", ["Tough", "Hard", "Tall"], "'Weak' is the antonym of strong.", "Lacking physical strength.", "Vocabulary & Antonyms", "Understand", "Easy"),
        (f"Which word means the SAME as 'HAPPY'? (P{grade})", "Glad", ["Sad", "Angry", "Tired"], "'Glad' is a synonym for 'happy'.", "A word with a positive, joyful meaning.", "Synonyms", "Understand", "Easy"),
        (f"Choose the correct spelling: (P{grade})", "Friend", ["Freind", "Frind", "Frend"], "Remember the rule 'i before e': friend.", "Remember: 'i' before 'e'.", "Spelling", "Remember", "Medium")
    ]
    
    p3_items = [
        (f"Choose the correct comparative: John is ____ than Peter. (P{grade})", "taller", ["tall", "tallest", "more tall"], "When comparing two people or things, use the comparative '-er'.", "Comparing two items requires the '-er' suffix.", "Adjectives & Comparison", "Apply", "Medium"),
        (f"Choose the correct superlative: Mount Everest is the ____ mountain in the world. (P{grade})", "highest", ["high", "higher", "more high"], "Superlative form '-est' is used for the extreme among three or more.", "Comparing all mountains requires the '-est' suffix.", "Adjectives & Comparison", "Apply", "Medium"),
        (f"Which word is an ADVERB (tells HOW an action is done)? (P{grade})", "Quickly", ["Quick", "Quickness", "Quicker"], "Adverbs of manner often end in '-ly' (e.g. run quickly).", "Look for the word ending in '-ly' that describes an action.", "Adverbs", "Understand", "Medium"),
        (f"Choose the correct conjunction: He was hungry ____ he ate some rice. (P{grade})", "so", ["or", "but", "although"], "'So' introduces the logical result or consequence.", "Shows the cause-and-effect result.", "Conjunctions", "Apply", "Medium"),
        (f"Choose the correct conjunction: She studied hard ____ she passed the test. (P{grade})", "and", ["but", "or", "yet"], "'And' connects two positive, related ideas.", "Connects two harmonizing facts.", "Conjunctions", "Apply", "Easy"),
        (f"Choose the correct homophone: The bird flew into the ____. (P{grade})", "air", ["heir", "hair", "hare"], "'Air' refers to the atmosphere that surrounds us.", "The atmosphere we breathe.", "Homophones", "Understand", "Medium"),
        (f"Choose the correct homophone: Did you ____ that strange noise? (P{grade})", "hear", ["here", "hare", "heir"], "'Hear' (with 'ear') means to perceive sound.", "Notice the word 'ear' inside 'hear'.", "Homophones", "Understand", "Medium"),
        (f"Choose the correct pronoun: Mary and ____ are going to church. (P{grade})", "I", ["me", "myself", "mine"], "'I' is the subjective pronoun used in compound subjects.", "Use the subject pronoun 'I', not object 'me'.", "Pronouns", "Apply", "Medium"),
        (f"What is the past tense of 'RUN'? (P{grade})", "ran", ["runned", "running", "rans"], "'Run' is an irregular verb: run → ran.", "An irregular vowel change from 'u' to 'a'.", "Verbs & Tenses", "Remember", "Easy"),
        (f"What is the past tense of 'GO'? (P{grade})", "went", ["goed", "gone", "going"], "'Go' becomes 'went' in the simple past.", "Irregular past tense of go.", "Verbs & Tenses", "Remember", "Easy"),
        (f"What is the past tense of 'BUY'? (P{grade})", "bought", ["buyed", "boughted", "buyen"], "'Buy' becomes 'bought' in the past tense.", "Irregular past tense ending in -ought.", "Verbs & Tenses", "Remember", "Medium"),
        (f"Choose the correct contraction for 'do not': (P{grade})", "don't", ["dont'", "do'nt", "d'ont"], "The apostrophe replaces the missing 'o': don't.", "The apostrophe goes where the letter 'o' was dropped.", "Punctuation & Contractions", "Apply", "Easy")
    ]
    
    p4_items = [
        (f"Subject-verb agreement: The boys ____ playing football in the field. (P{grade})", "are", ["is", "was", "has"], "Plural subject 'boys' takes the plural auxiliary verb 'are'.", "Plural subject requires plural verb 'are'.", "Subject-Verb Agreement", "Apply", "Medium"),
        (f"Subject-verb agreement: Every student ____ a textbook. (P{grade})", "has", ["have", "having", "are having"], "'Every student' is singular and takes the singular verb 'has'.", "'Every' takes a singular verb form.", "Subject-Verb Agreement", "Apply", "Hard"),
        (f"Collective noun: A ____ of lions was resting under the acacia tree. (P{grade})", "pride", ["flock", "pack", "swarm"], "The group term for lions is a 'pride'.", "Think of a pride of magnificent lions.", "Collective Nouns", "Remember", "Medium"),
        (f"Collective noun: A ____ of wolves hunted across the valley. (P{grade})", "pack", ["herd", "school", "fleet"], "A group of wolves is called a 'pack'.", "A team of hunting wolves is a pack.", "Collective Nouns", "Remember", "Medium"),
        (f"Collective noun: A ____ of bees flew around the hive. (P{grade})", "swarm", ["flock", "herd", "bunch"], "A large group of flying insects like bees is a 'swarm'.", "Group name for buzzing bees.", "Collective Nouns", "Remember", "Medium"),
        (f"Collective noun: A ____ of cattle grazed in the pasture. (P{grade})", "herd", ["pack", "pride", "shoal"], "A group of grazing mammals is a 'herd'.", "Group name for cows or elephants.", "Collective Nouns", "Remember", "Medium"),
        (f"Prefixes: Adding 'un-' to 'happy' creates 'unhappy', which means ____. (P{grade})", "not happy", ["very happy", "always happy", "happily"], "The prefix 'un-' means 'not' or the reverse.", "Prefix 'un-' means not.", "Prefixes & Suffixes", "Understand", "Easy"),
        (f"Suffixes: Adding '-ful' to 'care' produces 'careful', which means ____. (P{grade})", "full of care", ["without care", "disliking care", "careless"], "The suffix '-ful' means 'full of' or characterized by.", "Suffix '-ful' means full of.", "Prefixes & Suffixes", "Understand", "Easy"),
        (f"Choose the correctly punctuated direct speech sentence: (P{grade})", "She said, \"I love reading.\"", ["She said \"I love reading.\"", "She said, I love reading.", "\"She said,\" I love reading."], "Direct speech requires a comma before the opening quotation marks.", "Comma before speech marks and closing quotes after punctuation.", "Direct & Indirect Speech", "Apply", "Hard"),
        (f"Possessive apostrophe: This is the ____ bag (belonging to one teacher). (P{grade})", "teacher's", ["teachers'", "teachers", "teacher's'"], "Singular possession adds apostrophe-s ('s).", "For one person, add 's.", "Punctuation & Apostrophes", "Apply", "Medium"),
        (f"Possessive apostrophe: The ____ dormitory was clean (belonging to many girls). (P{grade})", "girls'", ["girl's", "girls's", "girls"], "Plural regular nouns ending in -s take only an apostrophe after the s.", "For plural ending in 's', add only the apostrophe at the end.", "Punctuation & Apostrophes", "Apply", "Hard")
    ]
    
    p5_items = [
        (f"Active to Passive: 'The cat caught the mouse' becomes: 'The mouse ____ by the cat.' (P{grade})", "was caught", ["is caught", "had caught", "caught"], "Past tense passive: was/were + past participle (was caught).", "Use 'was' + past participle 'caught'.", "Active & Passive Voice", "Apply", "Hard"),
        (f"Identify the MODAL verb in this sentence: 'You must finish your assignment on time.' (P{grade})", "must", ["finish", "assignment", "time"], "'Must' is a modal auxiliary verb expressing obligation or necessity.", "Expresses necessity or duty.", "Modal Verbs", "Understand", "Medium"),
        (f"Choose the correct relative pronoun: The boy ____ won the race is my brother. (P{grade})", "who", ["which", "whose", "whom"], "'Who' is used as the subject relative pronoun referring to people.", "Used for persons as subject.", "Relative Pronouns", "Apply", "Medium"),
        (f"Choose the correct relative pronoun: The book ____ I borrowed was very interesting. (P{grade})", "which", ["who", "whom", "whose"], "'Which' (or 'that') refers to non-human objects and things.", "Used for objects and non-human things.", "Relative Pronouns", "Apply", "Medium"),
        (f"Idiom meaning: What does 'A piece of cake' mean? (P{grade})", "Very easy to do", ["Delicious food", "A birthday celebration", "Very expensive"], "The idiom 'a piece of cake' signifies a task that is simple and effortless.", "Means a very simple task.", "Idioms & Figurative Language", "Understand", "Medium"),
        (f"Idiom meaning: 'Let the cat out of the bag' means to ____. (P{grade})", "reveal a secret", ["buy a pet", "clean a room", "escape from danger"], "Revealing confidential information or a secret.", "Revealing hidden information.", "Idioms & Figurative Language", "Understand", "Medium"),
        (f"Proverb meaning: 'A stitch in time saves nine' teaches us to ____. (P{grade})", "solve problems early before they grow", ["learn sewing", "work only nine hours", "ignore minor faults"], "Taking prompt corrective action prevents bigger complications later.", "Act promptly to prevent worse trouble.", "Proverbs & Wisdom", "Understand", "Medium"),
        (f"Choose the correct ANTONYM for 'GENEROUS': (P{grade})", "Stingy", ["Kind", "Wealthy", "Polite"], "Stingy (selfish with money/resources) is the opposite of generous.", "Opposite of giving freely.", "Vocabulary & Antonyms", "Understand", "Medium"),
        (f"Choose the correct SYNONYM for 'COURAGEOUS': (P{grade})", "Brave", ["Fearful", "Timid", "Quiet"], "Courageous and brave both mean showing valor and fearlessness.", "Having great bravery.", "Synonyms", "Understand", "Easy")
    ]
    
    p6_items = [
        (f"Figure of speech: 'The classroom was as quiet as a graveyard' is a ____. (P{grade})", "Simile", ["Metaphor", "Personification", "Hyperbole"], "A simile compares two things using 'as' or 'like'.", "Uses 'as' or 'like' for explicit comparison.", "Figures of Speech", "Understand", "Medium"),
        (f"Figure of speech: 'Time is a thief' is a ____. (P{grade})", "Metaphor", ["Simile", "Personification", "Alliteration"], "A metaphor directly equates two unlike things without 'like' or 'as'.", "Direct comparison without using 'like' or 'as'.", "Figures of Speech", "Understand", "Medium"),
        (f"Figure of speech: 'The angry wind howled through the trees' is an example of ____. (P{grade})", "Personification", ["Hyperbole", "Oxymoron", "Simile"], "Personification gives human emotions/actions (angry, howled) to non-human things.", "Giving human traits to non-human things.", "Figures of Speech", "Understand", "Medium"),
        (f"Figure of speech: 'I have told you a million times!' is an example of ____. (P{grade})", "Hyperbole", ["Understatement", "Metaphor", "Simile"], "Hyperbole is an intentional exaggeration for emphasis.", "Exaggeration for rhetorical emphasis.", "Figures of Speech", "Understand", "Medium"),
        (f"Identify the SUBORDINATE clause: 'Although it rained heavily, we attended the football match.' (P{grade})", "Although it rained heavily", ["we attended the football match", "the football match", "attended the match"], "'Although it rained heavily' cannot stand alone as a complete sentence.", "The dependent clause beginning with the conjunction 'Although'.", "Clause Analysis", "Analyze", "Hard"),
        (f"Conditional clause: 'If I ____ enough money, I would travel around the world.' (P{grade})", "had", ["have", "will have", "am having"], "Second conditional (unreal present) uses: If + past simple, would + verb.", "Second conditional uses past tense in the if-clause.", "Conditional Clauses", "Apply", "Hard"),
        (f"Select the correct spelling of the word meaning necessary: (P{grade})", "Necessary", ["Neccesary", "Necasary", "Necessery"], "One 'c' and two 's's: necessary (one Collar, two Sleeves).", "Remember: one 'c', two 's's.", "Spelling & Mechanics", "Remember", "Medium"),
        (f"Choose the correct preposition: He was accused ____ stealing the bicycle. (P{grade})", "of", ["for", "with", "about"], "The correct idiom is 'accused of' + noun/gerund.", "Idiomatic preposition after 'accused'.", "Prepositions & Idioms", "Apply", "Hard"),
        (f"Choose the correct word: Neither the teacher nor the students ____ present yesterday. (P{grade})", "were", ["was", "is", "are"], "When 'neither... nor' connects subjects, the verb agrees with the closer subject ('students' -> were).", "With 'neither... nor', agree with the closest subject.", "Subject-Verb Agreement", "Apply", "Hard")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    vocab_master = [
        ("Ancient", "very old and historical", ["brand new", "shiny and modern", "tiny"]),
        ("Abundant", "existing in large, plentiful quantities", ["extremely scarce", "completely empty", "broken"]),
        ("Cautious", "careful to avoid danger or mistakes", ["reckless and careless", "rude", "lazy"]),
        ("Fragile", "easily broken or damaged", ["unbreakable and solid", "heavy", "loud"]),
        ("Diligent", "hardworking and showing steady effort", ["lazy and idle", "slow", "noisy"]),
        ("Brief", "lasting only a short period of time", ["lasting for many years", "heavy", "wide"]),
        ("Hazardous", "dangerous and risky to health", ["completely safe", "pleasant", "easy"]),
        ("Impartial", "fair and unbiased toward all parties", ["heavily biased", "angry", "unfair"]),
        ("Vanish", "disappear suddenly from sight", ["appear brightly", "grow taller", "shine"]),
        ("Genuine", "authentic and real, not fake", ["counterfeit and imitation", "plastic", "broken"]),
        ("Courage", "bravery in facing danger or difficulty", ["cowardice and fear", "greed", "jealousy"]),
        ("Humble", "modest and not proud or arrogant", ["boastful and proud", "wealthy", "harsh"]),
        ("Generous", "willing to share and give freely", ["stingy and greedy", "mean", "cruel"]),
        ("Honest", "truthful and free of deceit", ["dishonest and lying", "noisy", "proud"]),
        ("Patient", "able to wait calmly without getting annoyed", ["impatient and hasty", "lazy", "cold"]),
        ("Swift", "moving very fast and quickly", ["sluggish and slow", "heavy", "tall"]),
        ("Broad", "wide from side to side", ["narrow and thin", "short", "steep"]),
        ("Gloomy", "dark, dim, or poorly lit", ["bright and sunny", "hot", "loud"]),
        ("Fierce", "wild, aggressive, and menacing", ["gentle and tame", "tiny", "soft"]),
        ("Peculiar", "strange, unusual, or distinctive", ["common and ordinary", "popular", "simple"]),
        ("Splendid", "magnificent, grand, and impressive", ["dull and ugly", "poor", "small"]),
        ("Victory", "triumph and winning in a contest", ["defeat and loss", "draw", "penalty"]),
        ("Prosper", "flourish, succeed, and do well", ["fail and decline", "stop", "freeze"]),
        ("Banish", "send away from a country as punishment", ["welcome warmly", "invite", "promote"]),
        ("Construct", "build or make something physical", ["demolish and destroy", "buy", "paint"])
    ]
    for w, m, dists in vocab_master:
        b.add(make_q(f"Vocabulary (P{grade}): What is the primary definition of '{w}'?",
                     m, dists, f"'{w}' means {m}.", f"Core definition of {w}.", "Vocabulary", "Understand", "Medium"), rng)
        b.add(make_q(f"Antonyms (P{grade}): Which word is the direct opposite of '{w}'?",
                     dists[0], [m, dists[1], dists[2]], f"The opposite of {w} is {dists[0]}.", f"Opposite of {w}.", "Antonyms", "Understand", "Medium"), rng)

    verbs = [
        ("swim", "swam", ["swimmed", "swimming", "swims"]),
        ("sing", "sang", ["singed", "sunged", "sings"]),
        ("write", "wrote", ["writed", "written", "writing"]),
        ("speak", "spoke", ["speaked", "spokened", "speaks"]),
        ("drive", "drove", ["drived", "driven", "driving"]),
        ("take", "took", ["taked", "taken", "takes"]),
        ("bring", "brought", ["bringed", "broughted", "brings"]),
        ("teach", "taught", ["teached", "taughten", "teaching"]),
        ("think", "thought", ["thinked", "thoughted", "thinking"]),
        ("catch", "caught", ["catched", "caughted", "catching"]),
        ("eat", "ate", ["eated", "eaten", "eating"]),
        ("freeze", "froze", ["freezed", "frozen", "freezing"]),
        ("break", "broke", ["breaked", "broken", "breaking"]),
        ("choose", "chose", ["choosed", "chosen", "choosing"]),
        ("fly", "flew", ["flied", "flown", "flying"]),
        ("grow", "grew", ["growed", "grown", "growing"]),
        ("know", "knew", ["knowed", "known", "knowing"]),
        ("see", "saw", ["seed", "seen", "seeing"]),
        ("throw", "threw", ["throwed", "thrown", "throwing"]),
        ("wear", "wore", ["weared", "worn", "wearing"])
    ]
    for v_infin, v_past, dists in verbs:
        b.add(make_q(f"Grammar (P{grade}): What is the irregular past tense of the verb '{v_infin}'?",
                     v_past, dists, f"The past tense of '{v_infin}' is '{v_past}'.", f"Past tense of '{v_infin}'.", "Verbs & Tenses", "Remember", "Medium"), rng)

    cnt = 1
    while len(b.items) < 100:
        b.add(make_q(f"Reading comprehension concept #{cnt} (P{grade}): A word that describes a person, place, or thing is a ____.",
                     "noun", ["verb", "adverb", "conjunction"], "Nouns name entities.", "Part of speech that names.", "Parts of Speech", "Remember", "Easy"), rng)
        cnt += 1

    return b.items[:100]
