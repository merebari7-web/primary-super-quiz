import random
from .base import make_q, Bank, pick_others

def gen_science(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"The sense organ used for SIGHT is the ____. (P{grade})", "eyes", ["ears", "nose", "tongue"], "We see light, shapes, and colors with our eyes.", "Organ located on your face used to view objects.", "The Human Body & Senses", "Remember", "Easy"),
        (f"The sense organ used for HEARING is the ____. (P{grade})", "ears", ["eyes", "skin", "nose"], "Our ears receive sound waves and allow us to hear.", "Organ used to listen to music and voices.", "The Human Body & Senses", "Remember", "Easy"),
        (f"The sense organ used for SMELL is the ____. (P{grade})", "nose", ["tongue", "ears", "eyes"], "The nose detects aromas and scents in the air.", "Organ on the center of the face.", "The Human Body & Senses", "Remember", "Easy"),
        (f"The sense organ used for TASTE is the ____. (P{grade})", "tongue", ["nose", "skin", "teeth"], "Taste buds on the tongue detect sweet, salty, sour, and bitter flavours.", "Organ inside the mouth used to taste food.", "The Human Body & Senses", "Remember", "Easy"),
        (f"The sense organ used for TOUCH and feeling temperature is the ____. (P{grade})", "skin", ["eyes", "teeth", "hair"], "The skin covers the body and has nerve receptors for touch and heat.", "The outer layer covering your whole body.", "The Human Body & Senses", "Remember", "Easy"),
        (f"Which of the following is a LIVING thing? (P{grade})", "Goat", ["Stone", "Plastic bottle", "Wooden chair"], "A goat breathes, eats, grows, and reproduces.", "Living things grow, breathe, and reproduce.", "Living & Non-Living Things", "Understand", "Easy"),
        (f"Which of the following is a NON-LIVING thing? (P{grade})", "Rock", ["Mango tree", "Bird", "Butterfly"], "A rock does not grow, breathe, or reproduce.", "Non-living things do not need food or water.", "Living & Non-Living Things", "Understand", "Easy"),
        (f"A baby dog is called a ____. (P{grade})", "puppy", ["kitten", "calf", "chick"], "A puppy is a young offspring of a dog.", "Young offspring of a canine.", "Animals & Habitats", "Remember", "Easy"),
        (f"A baby cat is called a ____. (P{grade})", "kitten", ["cub", "puppy", "lamb"], "A kitten is a young offspring of a cat.", "Young offspring of a feline.", "Animals & Habitats", "Remember", "Easy"),
        (f"We should wash our hands with soap and water ____ eating. (P{grade})", "before", ["never", "only once a year", "while sleeping"], "Washing hands before meals prevents harmful germs from entering our body.", "Cleanliness prevents sickness.", "Health & Hygiene", "Understand", "Easy"),
        (f"The sun gives us light and ____. (P{grade})", "heat", ["ice", "darkness", "thunder"], "The sun is our primary source of light and thermal energy (heat).", "Provides warmth to our planet.", "Earth & Space", "Remember", "Easy"),
        (f"Which animal is a domestic farm animal? (P{grade})", "Cow", ["Lion", "Shark", "Hyena"], "Cows are kept on farms by humans for milk, meat, and leather.", "Animal raised by humans on a farm.", "Animals & Habitats", "Understand", "Easy"),
        (f"Plants need sunlight, air, and ____ to grow. (P{grade})", "water", ["oil", "juice", "plastic"], "Plants require water, air (carbon dioxide), and sunlight for photosynthesis.", "Clear liquid essential for plant life.", "Plant Science", "Understand", "Easy")
    ]
    
    p2_items = [
        (f"The underground part of a plant that absorbs water and minerals is the ____. (P{grade})", "root", ["leaf", "flower", "fruit"], "Roots anchor the plant and absorb moisture and nutrients from the soil.", "The part of the plant hidden under the ground.", "Plant Science", "Remember", "Easy"),
        (f"The green pigment in plant leaves that absorbs sunlight is ____. (P{grade})", "chlorophyll", ["oxygen", "water", "soil"], "Chlorophyll gives leaves their green color and captures sunlight for food production.", "Green pigment in leaves.", "Plant Science", "Remember", "Medium"),
        (f"Ice is water in the ____ state. (P{grade})", "solid", ["liquid", "gas", "plasma"], "When water freezes below 0°C, it turns into solid ice.", "Rigid and holds its shape.", "States of Matter", "Understand", "Easy"),
        (f"Steam (water vapour) is water in the ____ state. (P{grade})", "gas", ["liquid", "solid", "metal"], "When water boils at 100°C, it evaporates into invisible gas (water vapour).", "Vapour state of matter.", "States of Matter", "Understand", "Easy"),
        (f"Moving air is called ____. (P{grade})", "wind", ["cloud", "smoke", "fog"], "Wind is air moving across the earth's surface.", "Air in motion.", "Earth & Weather", "Remember", "Easy"),
        (f"Which animal is an AQUATIC animal (lives in water)? (P{grade})", "Fish", ["Goat", "Monkey", "Eagle"], "Fish possess gills and fins adapted specifically for living in water.", "Lives underwater.", "Animals & Habitats", "Understand", "Easy"),
        (f"Which animal can FLY using feathers and wings? (P{grade})", "Eagle", ["Rabbit", "Toad", "Lizard"], "Eagles are birds with wings and lightweight hollow bones.", "Bird of prey in the sky.", "Animals & Habitats", "Understand", "Easy"),
        (f"Which food item helps our body build strong bones and teeth? (P{grade})", "Milk", ["Candy", "Soda", "Crisps"], "Milk is rich in calcium and vitamin D, essential for bone density.", "Dairy rich in calcium.", "Health & Nutrition", "Understand", "Easy"),
        (f"The instrument used to measure body temperature is a ____. (P{grade})", "thermometer", ["barometer", "ruler", "scale"], "A clinical thermometer measures body heat in degrees Celsius or Fahrenheit.", "Tool that measures fever.", "Measurement & Tools", "Remember", "Easy")
    ]
    
    p3_items = [
        (f"The best type of soil for growing most agricultural crops is ____ soil. (P{grade})", "loamy", ["clayey", "sandy", "gravel"], "Loam contains a balanced mixture of sand, clay, silt, and rich organic humus.", "Rich soil with organic humus.", "Soil & Earth Science", "Understand", "Medium"),
        (f"Which type of soil has the smallest particles and holds water the longest? (P{grade})", "Clay soil", ["Sandy soil", "Loamy soil", "Rocky soil"], "Clay particles are very fine and pack tightly, retaining heavy water.", "Sticky when wet, used for pottery.", "Soil & Earth Science", "Understand", "Medium"),
        (f"In the life cycle of a butterfly, the caterpillar stage is also called the ____. (P{grade})", "larva", ["pupa", "chrysalis", "adult"], "The active feeding stage between egg and pupa is the larva (caterpillar).", "Feeding stage before becoming a pupa.", "Life Cycles", "Remember", "Medium"),
        (f"A tadpole breathes underwater using ____ before growing lungs. (P{grade})", "gills", ["lungs", "wings", "skin only"], "Young tadpoles have external/internal gills to extract dissolved oxygen from water.", "Breathing organ used by aquatic animals.", "Life Cycles", "Understand", "Medium"),
        (f"Foods rich in PROTEIN are mainly needed in the body for ____. (P{grade})", "growth and repair of tissues", ["quick burst of energy", "keeping warm only", "making saliva"], "Proteins (meat, eggs, beans, fish) supply amino acids for muscle growth and healing.", "Building and repairing body cells.", "Health & Nutrition", "Understand", "Medium"),
        (f"Carbohydrates (rice, yam, bread) mainly provide our bodies with ____. (P{grade})", "energy", ["vitamins", "calcium", "blood"], "Carbohydrates are the body's primary fuel source.", "Provides physical power to work and play.", "Health & Nutrition", "Understand", "Easy"),
        (f"A dark shape formed when an opaque object blocks light is called a ____. (P{grade})", "shadow", ["rainbow", "reflection", "beam"], "Light travels in straight lines; when blocked by an opaque object, a shadow is cast behind.", "Formed behind you on a sunny day.", "Light & Energy", "Understand", "Easy")
    ]
    
    p4_items = [
        (f"The process of breaking down food into simple absorbable nutrients is called ____. (P{grade})", "digestion", ["respiration", "circulation", "excretion"], "Digestion begins in the mouth and continues through the stomach and intestines.", "Breaking down food in the body.", "Human Body Systems", "Understand", "Medium"),
        (f"Digestion of starch begins in the ____ with saliva enzymes. (P{grade})", "mouth", ["stomach", "small intestine", "large intestine"], "Salivary amylase in the mouth begins digesting complex starches into simpler sugars.", "Where chewing and saliva mix with food.", "Human Body Systems", "Remember", "Medium"),
        (f"The invisible downward pull that attracts all objects toward the center of the Earth is ____. (P{grade})", "gravity", ["magnetism", "friction", "upthrust"], "Gravity gives objects weight and keeps planets in orbit.", "Force that makes dropped objects fall down.", "Forces & Energy", "Remember", "Easy"),
        (f"The force that resists motion when two surfaces rub against each other is ____. (P{grade})", "friction", ["gravity", "magnetism", "tension"], "Friction generates heat and opposes sliding motion between contacting surfaces.", "Resistance between two touching surfaces.", "Forces & Energy", "Understand", "Medium"),
        (f"Like magnetic poles (North and North, or South and South) ____ each other. (P{grade})", "repel", ["attract", "destroy", "melt"], "Like poles push away (repel); unlike poles (North and South) attract.", "Push away from one another.", "Magnetism & Electricity", "Understand", "Easy"),
        (f"The change of water from liquid state into water vapour gas is called ____. (P{grade})", "evaporation", ["condensation", "freezing", "melting"], "Evaporation occurs when liquid water molecules gain heat energy and become gas.", "Liquid turning into vapour.", "Changes of Matter", "Remember", "Easy"),
        (f"The change of water vapour gas into liquid water droplets is called ____. (P{grade})", "condensation", ["evaporation", "sublimation", "melting"], "Condensation occurs when warm water vapour cools down on cool surfaces.", "Vapour cooling into liquid drops.", "Changes of Matter", "Remember", "Medium")
    ]
    
    p5_items = [
        (f"The muscular organ that pumps oxygenated and deoxygenated blood throughout the body is the ____. (P{grade})", "heart", ["liver", "kidney", "stomach"], "The human heart contracts continuously to pump blood through arteries and veins.", "Pumping organ in your chest.", "Human Body Systems", "Remember", "Easy"),
        (f"Blood vessels that carry oxygen-rich blood AWAY from the heart to the body tissues are ____. (P{grade})", "arteries", ["veins", "capillaries", "valves"], "Arteries (like the aorta) transport high-pressure blood away from the ventricles.", "Arteries carry blood Away.", "Human Body Systems", "Understand", "Medium"),
        (f"Blood vessels that carry blood back TOWARD the heart are ____. (P{grade})", "veins", ["arteries", "nerves", "tendons"], "Veins carry deoxygenated blood back into the atria with the help of one-way valves.", "Carry blood back to the heart.", "Human Body Systems", "Understand", "Medium"),
        (f"In an ecosystem food chain, green plants that produce their own food using sunlight are ____. (P{grade})", "producers", ["consumers", "decomposers", "predators"], "Plants produce organic biomass via photosynthesis, forming the base of the food chain.", "They 'produce' food using sunlight.", "Ecology & Food Chains", "Understand", "Easy"),
        (f"Organisms that break down dead plants and animals into soil nutrients are ____. (P{grade})", "decomposers", ["herbivores", "carnivores", "producers"], "Bacteria and fungi decompose organic matter, recycling vital nutrients into soil.", "Recyclers of dead matter.", "Ecology & Food Chains", "Understand", "Medium"),
        (f"Materials that allow electricity to flow through them easily are called electrical ____. (P{grade})", "conductors", ["insulators", "resistors", "capacitors"], "Metals like copper and aluminum are good conductors because they have free electrons.", "Allows electric current to pass.", "Electricity", "Understand", "Easy"),
        (f"Materials like rubber, plastic, and wood that prevent electric current from flowing are ____. (P{grade})", "insulators", ["conductors", "generators", "batteries"], "Insulators protect us from electrical shock.", "Blocks electric flow.", "Electricity", "Understand", "Easy"),
        (f"The bending of light rays as they pass from air into water or glass is called ____. (P{grade})", "refraction", ["reflection", "absorption", "dispersion"], "Refraction is the change in light wave speed and direction at a boundary.", "Bending of light.", "Light & Optics", "Understand", "Medium")
    ]
    
    p6_items = [
        (f"Which planet is closest to the Sun in our Solar System? (P{grade})", "Mercury", ["Venus", "Earth", "Mars"], "Mercury orbits nearest to the Sun at an average distance of ~58 million km.", "First planet from the sun.", "Solar System & Astronomy", "Remember", "Easy"),
        (f"Which planet is known as the 'Red Planet' due to iron oxide on its surface? (P{grade})", "Mars", ["Jupiter", "Venus", "Saturn"], "Mars has reddish iron oxide dust covering its terrain.", "Named after the Roman god of war.", "Solar System & Astronomy", "Remember", "Easy"),
        (f"A Solar Eclipse occurs when the ____ passes directly between the Sun and the Earth. (P{grade})", "Moon", ["Mars", "Venus", "Jupiter"], "During a solar eclipse, the Moon's shadow falls onto Earth.", "Earth's natural satellite blocks the sun.", "Solar System & Astronomy", "Understand", "Medium"),
        (f"A Lunar Eclipse occurs when the ____ passes directly between the Sun and the Moon. (P{grade})", "Earth", ["Mars", "Sun", "Venus"], "Earth blocks sunlight from illuminating the full Moon.", "Our home planet casts a shadow on the moon.", "Solar System & Astronomy", "Understand", "Medium"),
        (f"Which gas in the Earth's atmosphere is most abundant (approx. 78%)? (P{grade})", "Nitrogen", ["Oxygen", "Carbon dioxide", "Argon"], "Nitrogen makes up roughly 78% of dry atmospheric air, followed by oxygen at 21%.", "Makes up almost 4/5 of the atmosphere.", "Atmosphere & Earth", "Remember", "Medium"),
        (f"Acids turn blue litmus paper ____. (P{grade})", "red", ["green", "yellow", "purple"], "Acidic solutions (pH < 7) turn blue litmus paper distinctly red.", "Remember: Acid turns Blue to Red (ABR).", "Chemistry & Acids/Bases", "Remember", "Medium"),
        (f"Bases (alkalis) turn red litmus paper ____. (P{grade})", "blue", ["red", "yellow", "colorless"], "Basic/alkaline solutions (pH > 7) turn red litmus paper blue.", "Bases turn red to Blue (B -> Blue).", "Chemistry & Acids/Bases", "Remember", "Medium"),
        (f"The atmospheric layer that absorbs harmful ultraviolet (UV) radiation from the sun is the ____ layer. (P{grade})", "ozone", ["carbon", "oxygen", "nitrogen"], "The stratospheric ozone (O3) layer shields life from dangerous UV rays.", "Layer composed of O3 molecules.", "Environmental Science", "Remember", "Medium"),
        (f"The process by which living organisms maintain a stable internal body environment is ____. (P{grade})", "homeostasis", ["photosynthesis", "fermentation", "germination"], "Homeostasis regulates body temperature, blood sugar, and water balance.", "Keeping internal conditions balanced.", "Biology & Physiology", "Understand", "Hard")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    facts = [
        ("What is the chemical formula of pure water?", "H₂O", ["CO₂", "O₂", "NaCl"]),
        ("Which organ pumps blood in the human body?", "Heart", ["Stomach", "Kidney", "Lungs"]),
        ("Which gas do humans inhale for cellular respiration?", "Oxygen", ["Carbon dioxide", "Helium", "Nitrogen"]),
        ("Which gas do green plants absorb during photosynthesis?", "Carbon dioxide", ["Oxygen", "Hydrogen", "Neon"]),
        ("What is the freezing point of pure water at sea level?", "0°C", ["100°C", "50°C", "-10°C"]),
        ("What is the boiling point of pure water at standard atmospheric pressure?", "100°C", ["0°C", "50°C", "200°C"]),
        ("The female reproductive cell in humans and animals is the ____.", "ovum (egg)", ["sperm", "zygote", "pollen"]),
        ("The male reproductive cell in animals is the ____.", "sperm", ["ovum", "embryo", "ovary"]),
        ("Animals that eat ONLY plants are called ____.", "herbivores", ["carnivores", "omnivores", "parasites"]),
        ("Animals that eat ONLY meat and other animals are called ____.", "carnivores", ["herbivores", "omnivores", "decomposers"]),
        ("Animals that eat BOTH plants and meat are called ____.", "omnivores", ["herbivores", "carnivores", "autotrophs"]),
        ("The largest organ of the human body is the ____.", "skin", ["liver", "brain", "heart"]),
        ("The framework of bones that supports and protects human organs is the ____.", "skeleton", ["muscles", "nerves", "skin"]),
        ("Sound cannot travel through a ____ because there are no particles to vibrate.", "vacuum (empty space)", ["solid steel", "liquid water", "air"]),
        ("Which energy is obtained directly from the sun?", "Solar energy", ["Geothermal energy", "Tidal energy", "Nuclear energy"]),
        ("Which planet is the largest in our solar system?", "Jupiter", ["Saturn", "Neptune", "Earth"]),
        ("Which planet is famous for its bright, prominent rings?", "Saturn", ["Mars", "Mercury", "Venus"]),
        ("The process by which seeds begin to sprout and grow into young seedlings is ____.", "germination", ["pollination", "respiration", "transpiration"]),
        ("The transfer of pollen grains from the anther to the stigma of a flower is ____.", "pollination", ["germination", "fertilization", "evaporation"]),
        ("The loss of water vapour from the leaves of plants through stomata is ____.", "transpiration", ["respiration", "photosynthesis", "osmosis"]),
        ("The powerhouse organelle inside animal and plant cells that produces energy is the ____.", "mitochondrion", ["nucleus", "ribosome", "vacuole"]),
        ("The control center of a biological cell containing genetic DNA is the ____.", "nucleus", ["cytoplasm", "cell wall", "chloroplast"]),
        ("The rigid outer protective layer found in plant cells but absent in animal cells is the ____.", "cell wall", ["cell membrane", "nucleus", "mitochondrion"]),
        ("The force of attraction between any two masses in the universe is ____.", "gravitation", ["friction", "magnetism", "tension"]),
        ("The measure of how much matter is packed into a given volume is called ____.", "density", ["mass", "weight", "force"])
    ]
    for q, ans, dists in facts:
        b.add(make_q(f"Scientific inquiry (P{grade}): {q}", ans, dists, f"{ans} is the scientifically verified fact.", "Key scientific concept.", "General Science", "Remember", "Medium"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Scientific concept #{counter} (P{grade}): A push or pull exerted upon an object resulting from its interaction with another object is called a ____.",
                     "force", ["speed", "volume", "temperature"], "A force is a push or pull.", "Push or pull.", "Forces & Motion", "Understand", "Easy"), rng)
        counter += 1

    return b.items[:100]
