import random
from .base import make_q, Bank, pick_others

def gen_verbal(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    # 1. Analogies (25 items)
    analogies = [
        ("Dog is to Puppy as Cat is to ____.", "Kitten", ["Cub", "Calf", "Chick"]),
        ("Cow is to Calf as Sheep is to ____.", "Lamb", ["Kid", "Foal", "Piglet"]),
        ("Bird is to Nest as Bee is to ____.", "Hive", ["Den", "Burrow", "Stable"]),
        ("Doctor is to Hospital as Teacher is to ____.", "School", ["Court", "Farm", "Market"]),
        ("Author is to Book as Sculptor is to ____.", "Statue", ["Painting", "Novel", "Song"]),
        ("Eye is to Sight as Ear is to ____.", "Hearing", ["Smell", "Taste", "Touch"]),
        ("Pen is to Write as Scissors is to ____.", "Cut", ["Glue", "Draw", "Stitch"]),
        ("Fish is to Swim as Bird is to ____.", "Fly", ["Crawl", "Walk", "Run"]),
        ("Knife is to Cut as Spoon is to ____.", "Scoop", ["Peel", "Chop", "Grate"]),
        ("Car is to Road as Train is to ____.", "Track", ["Water", "Sky", "Runway"]),
        ("Carpenter is to Wood as Blacksmith is to ____.", "Iron", ["Cloth", "Paper", "Clay"]),
        ("Sun is to Day as Moon is to ____.", "Night", ["Morning", "Afternoon", "Dusk"]),
        ("Foot is to Shoe as Hand is to ____.", "Glove", ["Sock", "Belt", "Hat"]),
        ("Head is to Cap as Finger is to ____.", "Ring", ["Necklace", "Bracelet", "Shoe"]),
        ("Clock is to Time as Thermometer is to ____.", "Temperature", ["Distance", "Weight", "Speed"]),
        ("Oven is to Bake as Refrigerator is to ____.", "Cool", ["Heat", "Fry", "Boil"]),
        ("Pilot is to Aeroplane as Captain is to ____.", "Ship", ["Bicycle", "Car", "Train"]),
        ("Horse is to Foal as Duck is to ____.", "Duckling", ["Cub", "Calf", "Puppy"]),
        ("Lion is to Pride as Wolf is to ____.", "Pack", ["Herd", "Flock", "Swarm"]),
        ("Artist is to Paintbrush as Writer is to ____.", "Pen", ["Hammer", "Needle", "Spanner"]),
        ("Spider is to Web as Bird is to ____.", "Nest", ["Den", "Kennel", "Burrow"]),
        ("Book is to Read as Song is to ____.", "Sing", ["Paint", "Cook", "Drive"]),
        ("King is to Queen as Prince is to ____.", "Princess", ["Duchess", "Baroness", "Empress"]),
        ("Day is to Sun as Night is to ____.", "Stars", ["Clouds", "Rain", "Fog"]),
        ("Bread is to Bakery as Medicine is to ____.", "Pharmacy", ["Bakery", "Garage", "Airport"])
    ]
    for stem, ans, dists in analogies:
        b.add(make_q(f"Analogy: {stem} (Grade {grade})", ans, dists,
                     f"In this verbal relationship, {ans} completes the pair correctly based on function or category.",
                     "Analyze the relationship in the first pair to find the corresponding match.", "Analogies", "Understand", "Medium"), rng)

    # 2. Odd One Out (20 items)
    odd_groups = [
        ("Which word is the ODD one out in Group 1?", "Chair", ["Apple", "Orange", "Banana"]),
        ("Which word is the ODD one out in Group 2?", "Fish", ["Dog", "Cat", "Goat"]),
        ("Which word is the ODD one out in Group 3?", "Carrot", ["Mango", "Pineapple", "Pawpaw"]),
        ("Which word is the ODD one out in Group 4?", "Triangle", ["Square", "Rectangle", "Circle"]),
        ("Which word is the ODD one out in Group 5?", "Doctor", ["Nurse", "Pharmacist", "Pilot"]),
        ("Which word is the ODD one out in Group 6?", "Lagos", ["London", "Paris", "Berlin"]),
        ("Which word is the ODD one out in Group 7?", "Iron", ["Gold", "Silver", "Plastic"]),
        ("Which word is the ODD one out in Group 8?", "Running", ["Jumping", "Hopping", "Sleeping"]),
        ("Which word is the ODD one out in Group 9?", "Eagle", ["Hawk", "Falcon", "Crocodile"]),
        ("Which word is the ODD one out in Group 10?", "Rose", ["Lily", "Tulip", "Cabbage"]),
        ("Which word is the ODD one out in Group 11?", "Violin", ["Guitar", "Cello", "Drum"]),
        ("Which word is the ODD one out in Group 12?", "Kerosene", ["Petrol", "Diesel", "Water"]),
        ("Which word is the ODD one out in Group 13?", "Fork", ["Spoon", "Knife", "Blanket"]),
        ("Which word is the ODD one out in Group 14?", "Yam", ["Cassava", "Potato", "Apple"]),
        ("Which word is the ODD one out in Group 15?", "Hammer", ["Chisel", "Saw", "Pillow"]),
        ("Which word is the ODD one out in Group 16?", "Shirt", ["Trousers", "Dress", "Television"]),
        ("Which word is the ODD one out in Group 17?", "January", ["March", "July", "Tuesday"]),
        ("Which word is the ODD one out in Group 18?", "Red", ["Blue", "Yellow", "Heavy"]),
        ("Which word is the ODD one out in Group 19?", "Nigeria", ["Ghana", "Kenya", "England"]),
        ("Which word is the ODD one out in Group 20?", "Computer", ["Laptop", "Tablet", "Bicycle"])
    ]
    for stem, ans, dists in odd_groups:
        b.add(make_q(f"{stem} [P{grade}]", ans, dists,
                     f"'{ans}' does not belong to the category shared by the other three items.",
                     "Find the item that does not share the common semantic category.", "Classification", "Analyze", "Medium"), rng)

    # 3. Alphabet Code Substitution (26 letters)
    for pos in range(1, 27):
        letter = chr(64 + pos)
        # Choose 3 unique distractor numbers between 1 and 26 that are not pos
        all_nums = [str(x) for x in range(1, 27) if x != pos]
        dists = rng.sample(all_nums, 3)
        b.add(make_q(f"Alphabet coding (A=1, B=2, C=3...): What is the numerical code for '{letter}'? (P{grade})",
                     str(pos), dists, f"'{letter}' is letter number {pos} in alphabetical order from A to Z.",
                     f"Count the position of letter {letter} starting with A as 1.", "Letter Codes", "Apply", "Easy"), rng)

    # 4. Anagrams and Letter Rearrangements (10 items)
    anagrams = [
        ("Rearrange the scrambled letters into a domestic animal: T A C", "CAT", ["ACT", "TAC", "ATC"]),
        ("Rearrange the scrambled letters into a large mammal: N O I L", "LION", ["LOIN", "NOIL", "OLIN"]),
        ("Rearrange the scrambled letters into a tropical fruit: G O M A N", "MANGO", ["AMONG", "GNOMA", "MAGON"]),
        ("Rearrange the scrambled letters into a learning place: O O L C H S", "SCHOOL", ["CHOLOS", "SOCHLO", "LOOHCS"]),
        ("Rearrange the scrambled letters into an organ of sight: E Y E", "EYE", ["YEE", "EEY", "YEY"]),
        ("Rearrange the scrambled letters into an African country: A N G H A", "GHANA", ["AGNAH", "HANG", "HAGAN"]),
        ("Rearrange the scrambled letters into a celestial body: A R S T", "STAR", ["TSAR", "RATS", "TARS"]),
        ("Rearrange the scrambled letters into a writing liquid: K N I", "INK", ["KIN", "NIK", "IKN"]),
        ("Rearrange the scrambled letters into a body part: H A N D", "HAND", ["DAHN", "ANDH", "NAHD"]),
        ("Rearrange the scrambled letters into a time of day: T H G I N", "NIGHT", ["THING", "THIGN", "GHINT"])
    ]
    for stem, ans, dists in anagrams:
        b.add(make_q(f"{stem} (Level {grade})", ans, dists,
                     f"The correctly unscrambled word matching the description is {ans}.",
                     "Rearrange the given letters into a meaningful English word.", "Anagrams", "Apply", "Medium"), rng)

    # 5. Syllable counting (10 items)
    sylls = [
        ("ELEPHANT", "3 syllables", ["2 syllables", "4 syllables", "1 syllable"]),
        ("COMMUNICATION", "5 syllables", ["4 syllables", "6 syllables", "3 syllables"]),
        ("WATER", "2 syllables", ["1 syllable", "3 syllables", "4 syllables"]),
        ("DICTIONARY", "4 syllables", ["3 syllables", "5 syllables", "2 syllables"]),
        ("HIPPOPOTAMUS", "5 syllables", ["4 syllables", "6 syllables", "3 syllables"]),
        ("COMPUTER", "3 syllables", ["2 syllables", "4 syllables", "1 syllable"]),
        ("SUN", "1 syllable", ["2 syllables", "3 syllables", "0 syllables"]),
        ("BEAUTIFUL", "3 syllables", ["2 syllables", "4 syllables", "1 syllable"]),
        ("EDUCATION", "4 syllables", ["3 syllables", "5 syllables", "2 syllables"]),
        ("NIGERIA", "4 syllables", ["3 syllables", "2 syllables", "5 syllables"])
    ]
    for w, ans, dists in sylls:
        b.add(make_q(f"Syllables: How many syllables (sound beats) are in the word '{w}'? [Class {grade}]",
                     ans, dists, f"The word '{w}' contains {ans} when pronounced aloud.",
                     "Count the distinct vowel sound beats when saying the word slowly.", "Syllables", "Understand", "Easy"), rng)

    # 6. Compound Words & Word Logic (9 items)
    compound_words = [
        ("Which word joins with 'SUN' to form a single compound word?", "FLOWER (Sunflower)", ["TREE", "RIVER", "BIRD"]),
        ("Which word joins with 'RAIN' to form a protective outdoor gear word?", "COAT (Raincoat)", ["SHIRT", "CAP", "GLOVE"]),
        ("Which word joins with 'TOOTH' to form a dental cleaning item?", "BRUSH (Toothbrush)", ["COMB", "SOAP", "TOWEL"]),
        ("Which word joins with 'BUTTER' to form an insect name?", "FLY (Butterfly)", ["BEE", "ANT", "WASP"]),
        ("Which word joins with 'BED' to form a sleeping room word?", "ROOM (Bedroom)", ["DOOR", "WINDOW", "GARDEN"]),
        ("Which word joins with 'BASKET' to form a popular team ball sport?", "BALL (Basketball)", ["NET", "RING", "SHOE"]),
        ("Which word joins with 'FOOT' to form a global field sport game?", "BALL (Football)", ["HAND", "LEG", "HEAD"]),
        ("Which word joins with 'FIRE' to form a brave emergency rescue worker?", "FIGHTER (Firefighter)", ["DRIVER", "CLEANER", "BAKER"]),
        ("Which word joins with 'NEWS' to form a daily printed publication?", "PAPER (Newspaper)", ["BOOK", "LETTER", "PEN"])
    ]
    for stem, ans, dists in compound_words:
        b.add(make_q(f"Compound Words: {stem} (P{grade})", ans, dists,
                     f"Combining the two words forms the compound noun '{ans}'.",
                     "Think of a single word that joins with the prompt word to make a valid compound noun.", "Compound Words", "Understand", "Easy"), rng)

    return b.items[:100]
