import random
from .base import make_q, Bank, pick_others

def gen_social(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"A family consisting of father, mother, and their children is called a ____ family. (P{grade})", "nuclear", ["extended", "compound", "royal"], "A nuclear family is the basic domestic unit made of parents and offspring.", "Parents and children living together.", "Family & Community", "Remember", "Easy"),
        (f"Your father's brother is your ____. (P{grade})", "uncle", ["aunt", "nephew", "cousin"], "An uncle is the brother of your mother or father.", "Brother of your father or mother.", "Family & Relationships", "Remember", "Easy"),
        (f"Your mother's sister is your ____. (P{grade})", "aunt", ["niece", "uncle", "sister"], "An aunt is the sister of either parent.", "Sister of your father or mother.", "Family & Relationships", "Remember", "Easy"),
        (f"The child of your aunt or uncle is your ____. (P{grade})", "cousin", ["nephew", "niece", "sibling"], "A cousin is the child of your uncle or aunt.", "Aunt's or uncle's child.", "Family & Relationships", "Remember", "Easy"),
        (f"Which of these is a place where we buy and sell food and household goods? (P{grade})", "Market", ["Police station", "Post office", "Hospital"], "A market is a central place of trade.", "Where goods are traded.", "Community & Economy", "Remember", "Easy"),
        (f"Where do sick people go to receive medical care from doctors and nurses? (P{grade})", "Hospital", ["Stadium", "Bank", "Cinema"], "Hospitals provide medical diagnosis, treatment, and nursing care.", "Medical treatment center.", "Community Services", "Remember", "Easy")
    ]
    
    p2_items = [
        (f"The traditional ruler in Yoruba land is called an ____. (P{grade})", "Oba", ["Emir", "Obi", "Sultan"], "Oba is the royal title for traditional monarchs in Yoruba kingdoms.", "Title of traditional ruler in Western Nigeria.", "Culture & Traditions", "Remember", "Easy"),
        (f"The traditional Islamic ruler in Northern Nigeria is called an ____. (P{grade})", "Emir", ["Oba", "Obi", "Ovie"], "Emir is the title used for monarchs of Northern emirates.", "Monarch in Northern emirates.", "Culture & Traditions", "Remember", "Easy"),
        (f"The traditional ruler in Igbo land is often titled an ____. (P{grade})", "Obi / Eze", ["Emir", "Oba", "Alake"], "Obi or Eze is the royal title of monarchs in Igbo communities.", "Monarch in Igbo culture.", "Culture & Traditions", "Remember", "Easy"),
        (f"Which of these is a traditional mode of transportation across desert regions? (P{grade})", "Camel", ["Bicycle", "Canoe", "Helicopter"], "Camels are well adapted to survive arid deserts with little water.", "The 'ship of the desert'.", "Transportation & Geography", "Understand", "Easy")
    ]
    
    p3_items = [
        (f"Nigeria is located in the continent of ____. (P{grade})", "Africa", ["Asia", "Europe", "South America"], "Nigeria is situated in West Africa along the Gulf of Guinea.", "The second-largest continent.", "Geography & Continents", "Remember", "Easy"),
        (f"The Federal Capital Territory (FCT) and capital city of Nigeria is ____. (P{grade})", "Abuja", ["Lagos", "Kano", "Port Harcourt"], "Abuja became the official capital city of Nigeria in December 1991.", "The central planned capital city.", "National Geography", "Remember", "Easy"),
        (f"The two major rivers that meet at the confluence town of Lokoja are River Niger and River ____. (P{grade})", "Benue", ["Cross River", "Ogun", "Kaduna"], "River Niger and River Benue converge at Lokoja to form a Y-shaped drainage basin.", "The major eastern tributary meeting Niger.", "Rivers & Topography", "Remember", "Easy"),
        (f"The confluence of River Niger and River Benue is located at ____. (P{grade})", "Lokoja (Kogi State)", ["Minna", "Enugu", "Calabar"], "Lokoja in Kogi State is famous for the meeting point of both great rivers.", "Capital of Kogi State.", "Rivers & Topography", "Remember", "Easy")
    ]
    
    p4_items = [
        (f"How many administrative states make up the Federal Republic of Nigeria? (P{grade})", "36 states", ["30 states", "32 states", "40 states"], "Nigeria has 36 states and one Federal Capital Territory (Abuja).", "Three dozen states.", "Governance & Geography", "Remember", "Easy"),
        (f"The main natural mineral resource that forms the backbone of Nigeria's export economy is ____. (P{grade})", "crude oil (petroleum)", ["diamonds", "copper", "silver"], "Crude oil found in the Niger Delta is Nigeria's chief export commodity.", "Fossil fuel drilled in the Niger Delta.", "Natural Resources & Economy", "Remember", "Easy"),
        (f"Which body of water borders the southern coast of Nigeria? (P{grade})", "Atlantic Ocean (Gulf of Guinea)", ["Pacific Ocean", "Indian Ocean", "Mediterranean Sea"], "Nigeria's southern coastline faces the Gulf of Guinea in the Atlantic Ocean.", "Ocean touching West Africa.", "Geography", "Remember", "Easy"),
        (f"The vegetation zone in southern coastal Nigeria dominated by swamps and mangrove trees is the ____. (P{grade})", "mangrove swamp", ["sahel savannah", "desert", "tundra"], "The coastal Niger Delta is characterized by lush mangrove ecosystems.", "Coastal wetland forest.", "Vegetation & Environment", "Understand", "Medium")
    ]
    
    p5_items = [
        (f"The three arms of government in a democratic state are the Executive, Legislature, and ____. (P{grade})", "Judiciary", ["Police", "Military", "Press"], "The Judiciary interprets the laws made by the legislature and enforced by the executive.", "The branch of courts and judges.", "Government & Democracy", "Remember", "Easy"),
        (f"The arm of government responsible for making national laws is the ____. (P{grade})", "Legislature (National Assembly)", ["Executive", "Judiciary", "Civil Service"], "The Legislature (Senate and House of Representatives) debates and passes bills into law.", "Parliament / National Assembly.", "Government & Democracy", "Understand", "Easy"),
        (f"The arm of government responsible for implementing and enforcing laws is the ____. (P{grade})", "Executive", ["Judiciary", "Legislature", "Auditor-General"], "The Executive (President, Governors, Ministers) administers the laws.", "Led by the President or Governor.", "Government & Democracy", "Understand", "Easy"),
        (f"The arm of government responsible for interpreting laws and settling legal disputes is the ____. (P{grade})", "Judiciary (Courts)", ["Executive", "Legislature", "Electoral Commission"], "Courts of law and judges interpret the constitution and punish lawbreakers.", "System of courts and judges.", "Government & Democracy", "Understand", "Easy")
    ]
    
    p6_items = [
        (f"How many continents are on planet Earth? (P{grade})", "7", ["5", "6", "8"], "The seven continents are Africa, Antarctica, Asia, Europe, North America, Oceania/Australia, and South America.", "Count Africa, Asia, Europe, Americas...", "World Geography", "Remember", "Easy"),
        (f"Which is the largest continent in the world by both area and population? (P{grade})", "Asia", ["Africa", "North America", "Europe"], "Asia covers over 44 million km² and hosts over 4.5 billion people.", "Continent with China and India.", "World Geography", "Remember", "Easy"),
        (f"Which is the largest ocean in the world covering over 30% of the Earth's surface? (P{grade})", "Pacific Ocean", ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], "The Pacific Ocean is the world's largest and deepest body of water.", "Largest ocean.", "World Geography", "Remember", "Easy"),
        (f"The international organization formed in 1945 to maintain global peace and security is the ____. (P{grade})", "United Nations (UN)", ["African Union (AU)", "ECOWAS", "OPEC"], "The UN was created after WWII with 193 member states.", "Headquartered in New York.", "International Organizations", "Remember", "Medium"),
        (f"The regional economic union of 15 West African states is called ____. (P{grade})", "ECOWAS", ["AU", "SADC", "ASEAN"], "The Economic Community of West African States was founded in 1975 in Lagos.", "West African regional community.", "International Organizations", "Remember", "Medium"),
        (f"The African Union (AU) headquarters is located in ____. (P{grade})", "Addis Ababa (Ethiopia)", ["Abuja (Nigeria)", "Cairo (Egypt)", "Nairobi (Kenya)"], "The AU is headquartered in Addis Ababa, Ethiopia.", "Capital city of Ethiopia.", "International Organizations", "Remember", "Medium")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    state_caps = [
        ("Lagos State", "Ikeja"), ("Oyo State", "Ibadan"), ("Kano State", "Kano"),
        ("Rivers State", "Port Harcourt"), ("Enugu State", "Enugu"), ("Kaduna State", "Kaduna"),
        ("Borno State", "Maiduguri"), ("Delta State", "Asaba"), ("Cross River State", "Calabar"),
        ("Edo State", "Benin City"), ("Plateau State", "Jos"), ("Ogun State", "Abeokuta"),
        ("Ondo State", "Akure"), ("Kwara State", "Ilorin"), ("Benue State", "Makurdi"),
        ("Anambra State", "Awka"), ("Imo State", "Owerri"), ("Abia State", "Umuahia"),
        ("Sokoto State", "Sokoto"), ("Katsina State", "Katsina"), ("Bauchi State", "Bauchi"),
        ("Adamawa State", "Yola"), ("Akwa Ibom State", "Uyo"), ("Bayelsa State", "Yenagoa"),
        ("Ebonyi State", "Abakaliki"), ("Ekiti State", "Ado-Ekiti"), ("Gombe State", "Gombe"),
        ("Jigawa State", "Dutse"), ("Kebbi State", "Birnin Kebbi"), ("Kogi State", "Lokoja"),
        ("Nasarawa State", "Lafia"), ("Niger State", "Minna"), ("Osun State", "Osogbo"),
        ("Taraba State", "Jalingo"), ("Yobe State", "Damaturu"), ("Zamfara State", "Gusau")
    ]
    for st, cap in state_caps:
        other_caps = [c for s, c in state_caps if c != cap]
        rng.shuffle(other_caps)
        b.add(make_q(f"State geography (P{grade}): What is the administrative capital of {st}?",
                     cap, other_caps[:3],
                     f"The administrative capital of {st} is {cap}.", f"Administrative seat of {st}.",
                     "States & Capitals", "Remember", "Easy"), rng)

    world_caps = [
        ("Ghana", "Accra"), ("Kenya", "Nairobi"), ("South Africa", "Pretoria"),
        ("Egypt", "Cairo"), ("United Kingdom", "London"), ("United States", "Washington, D.C."),
        ("France", "Paris"), ("Japan", "Tokyo"), ("Canada", "Ottawa"), ("China", "Beijing"),
        ("Germany", "Berlin"), ("Brazil", "Brasília"), ("India", "New Delhi"), ("Australia", "Canberra")
    ]
    for cnt, cap in world_caps:
        dists = [c for cn, c in world_caps if c != cap]
        rng.shuffle(dists)
        b.add(make_q(f"World geography (P{grade}): What is the official capital city of {cnt}?",
                     cap, dists[:3], f"{cap} is the capital of {cnt}.", f"Capital city of {cnt}.",
                     "World Geography", "Remember", "Easy"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Social studies concept #{counter} (P{grade}): The total way of life of a group of people, including their language, food, and dress, is their ____.",
                     "culture", ["climate", "currency", "altitude"], "Culture encompasses social behaviors, arts, and customs.", "Way of life of a people.", "Culture & Society", "Remember", "Easy"), rng)
        counter += 1

    return b.items[:100]
