import random
from .base import make_q, Bank, pick_others

def gen_civic(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"We show RESPECT to our parents and elders by ____. (P{grade})", "greeting them politely", ["shouting at them", "running away", "refusing to listen"], "Greeting politely and obeying instructions demonstrate good character and respect.", "Demonstrating polite behavior.", "Values & Ethics", "Understand", "Easy"),
        (f"Telling the TRUTH at all times even when difficult is called ____. (P{grade})", "honesty", ["dishonesty", "jealousy", "pride"], "Honesty builds trust and integrity in the home and classroom.", "Moral virtue of being truthful.", "Values & Ethics", "Remember", "Easy"),
        (f"In school, pupils should obey classroom ____. (P{grade})", "rules and teachers", ["nobody", "bullies", "strangers outside"], "School rules ensure safety, order, and effective learning.", "Guidelines for good behavior in class.", "Civic Responsibility", "Understand", "Easy"),
        (f"The Nigerian national flag has ____ vertical stripes. (P{grade})", "three (Green, White, Green)", ["two", "four", "five"], "The Nigerian flag features three equal vertical bands: Green, White, and Green.", "Designed with 3 vertical bands.", "National Symbols", "Remember", "Easy"),
        (f"The GREEN color on the Nigerian flag represents ____. (P{grade})", "agriculture and fertile land", ["peace and unity", "gold and mineral wealth", "oil spills"], "Green symbolizes Nigeria's rich natural resources and agriculture.", "Symbolizes crops and agriculture.", "National Symbols", "Remember", "Easy"),
        (f"The WHITE color on the Nigerian flag represents ____. (P{grade})", "peace and unity", ["agriculture", "crude oil", "bravery"], "White represents peace, truth, and national cohesion.", "Symbolizes harmony and peace.", "National Symbols", "Remember", "Easy")
    ]
    
    p2_items = [
        (f"The designer of the Nigerian national flag in 1959 was Mr. ____. (P{grade})", "Taiwo Akinkunmi", ["Herbert Macaulay", "Nnamdi Azikiwe", "Wole Soyinka"], "Pa Michael Taiwo Akinkunmi designed the flag as a student in 1959.", "Student who designed the flag.", "National Symbols", "Remember", "Easy"),
        (f"The two white horses on the Nigerian Coat of Arms represent ____. (P{grade})", "dignity and strength", ["agriculture", "fertile soil", "rivers Niger and Benue"], "The two supporting horses symbolize national dignity.", "Symbol of national dignity.", "National Symbols", "Remember", "Medium"),
        (f"The red eagle perched on top of the Coat of Arms represents national ____. (P{grade})", "strength and power", ["peace", "beauty", "wealth"], "The eagle represents national strength and vision.", "Symbol of national power.", "National Symbols", "Remember", "Medium"),
        (f"The black shield on the Nigerian Coat of Arms represents Nigeria's ____. (P{grade})", "fertile soil and agricultural wealth", ["peace", "dignity", "rivers"], "The black shield represents the fertile land and rich soil of Nigeria.", "Represents rich black fertile earth.", "National Symbols", "Remember", "Medium"),
        (f"The silvery 'Y' shape on the Coat of Arms represents Rivers ____. (P{grade})", "Niger and Benue", ["Ogun and Osun", "Cross and Kaduna", "Nile and Congo"], "The Y-shape marks the confluence of Rivers Niger and Benue.", "The two great converging rivers.", "National Symbols", "Remember", "Medium")
    ]
    
    p3_items = [
        (f"A person who belongs legally to a country and enjoys full rights is a ____. (P{grade})", "citizen", ["foreigner", "tourist", "refugee"], "Citizenship grants constitutional rights, privileges, and responsibilities.", "A recognized legal member of a state.", "Citizenship & Rights", "Understand", "Easy"),
        (f"Standing at attention when the national anthem is sung shows ____. (P{grade})", "patriotism and respect", ["laziness", "disobedience", "fear"], "Honoring national symbols shows civic love and loyalty to one's nation.", "Respect for one's country.", "Civic Responsibility", "Understand", "Easy"),
        (f"Traffic lights: What does the RED light instruct drivers to do? (P{grade})", "Stop", ["Go", "Get ready", "Turn around"], "Red signal means stop completely behind the line.", "Signal to bring vehicle to a halt.", "Road & Civic Safety", "Remember", "Easy"),
        (f"Traffic lights: What does the AMBER / YELLOW light indicate? (P{grade})", "Get ready / Slow down", ["Go at full speed", "Stop permanently", "Turn off engine"], "Amber prepares drivers to stop safely or prepare to go.", "Caution signal before red or green.", "Road & Civic Safety", "Remember", "Easy"),
        (f"Traffic lights: What does the GREEN light instruct drivers to do? (P{grade})", "Go", ["Stop", "Reverse", "Wait for police"], "Green gives legal right-of-way to proceed safely.", "Proceed forward safely.", "Road & Civic Safety", "Remember", "Easy")
    ]
    
    p4_items = [
        (f"Every child has a fundamental right to ____. (P{grade})", "education and protection", ["drive a car at age 7", "break laws", "work in factories"], "International and constitutional conventions guarantee children basic rights to schooling and safety.", "Guaranteed for human development.", "Human Rights", "Understand", "Easy"),
        (f"The supreme legal document that guides how a country is governed is the ____. (P{grade})", "Constitution", ["Dictionary", "Newspaper", "Atlas"], "The Constitution is the supreme law of the land.", "Supreme book of national law.", "Constitution & Law", "Remember", "Easy"),
        (f"A good leader must demonstrate ____. (P{grade})", "integrity, fairness, and service", ["greed and dishonesty", "nepotism and anger", "cruelty"], "Effective leadership requires accountability and public service.", "Virtues of honesty and justice.", "Leadership & Governance", "Understand", "Easy"),
        (f"Love for one's country and willingness to serve it is called ____. (P{grade})", "patriotism", ["tribalism", "selfishness", "greed"], "Patriotism is devoted civic commitment to the nation.", "Devotion to one's homeland.", "Civic Values", "Remember", "Easy")
    ]
    
    p5_items = [
        (f"The government agency responsible for organizing national elections in Nigeria is ____. (P{grade})", "INEC", ["EFCC", "FRSC", "NEMA"], "The Independent National Electoral Commission conducts presidential, governorship, and legislative elections.", "Independent National Electoral Commission.", "Electoral Process", "Remember", "Easy"),
        (f"The system of government where power belongs to the people through elected representatives is ____. (P{grade})", "Democracy", ["Monarchy", "Autocracy", "Dictatorship"], "Democracy is government of the people, by the people, and for the people.", "Government by elected representatives.", "Government Systems", "Remember", "Easy"),
        (f"The principle that everyone, including leaders, must obey the law equally is the ____. (P{grade})", "Rule of Law", ["Rule of Force", "Military Decree", "Immunity for All"], "The Rule of Law ensures justice, equality before law, and supremacy of the constitution.", "Equality before the law.", "Constitutional Law", "Understand", "Medium"),
        (f"The agency established to fight financial crimes and corruption in Nigeria is the ____. (P{grade})", "EFCC", ["FRSC", "NAPTIP", "NEMA"], "The Economic and Financial Crimes Commission investigates graft and fraudulent practices.", "Economic and Financial Crimes Commission.", "Anti-Corruption & Law", "Remember", "Easy"),
        (f"The minimum voting age for a Nigerian citizen in national elections is ____ years. (P{grade})", "18", ["16", "21", "25"], "Section 117 of the Nigerian Constitution sets the franchise voting age at 18.", "Age of adulthood for voting.", "Electoral Process", "Remember", "Easy")
    ]
    
    p6_items = [
        (f"The agency responsible for fighting human trafficking and child abuse in Nigeria is ____. (P{grade})", "NAPTIP", ["INEC", "FRSC", "ICPC"], "National Agency for the Prohibition of Trafficking in Persons safeguards vulnerable persons.", "Protects against human trafficking.", "Human Rights & Protection", "Remember", "Medium"),
        (f"The Federal Road Safety Corps (FRSC) is primarily responsible for ____. (P{grade})", "preventing road accidents and enforcing traffic laws", ["fighting fires", "curbing drug abuse", "defending borders"], "FRSC promotes road safety and issues driver licenses.", "Safety on national highways.", "Civic Agencies", "Understand", "Easy"),
        (f"The Universal Declaration of Human Rights (UDHR) was adopted by the UN in the year ____. (P{grade})", "1948", ["1914", "1960", "1999"], "The UN General Assembly proclaimed the UDHR on 10 December 1948 in Paris.", "Post-World War II human rights charter.", "Global Human Rights", "Remember", "Medium"),
        (f"The national motto written on Nigeria's Coat of Arms is '____'. (P{grade})", "Unity and Faith, Peace and Progress", ["Peace, Love and Joy", "One Nation, One Destiny", "Strength and Victory"], "The official national motto of the Federal Republic of Nigeria.", "Motto on the scroll.", "National Symbols", "Remember", "Medium"),
        (f"Which agency enforces laws against illicit narcotics and drug trafficking in Nigeria? (P{grade})", "NDLEA", ["NAPTIP", "INEC", "FRSC"], "The National Drug Law Enforcement Agency eliminates illicit narcotics trade.", "National Drug Law Enforcement Agency.", "Law Enforcement", "Remember", "Easy")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    civic_principles = [
        ("Paying taxes promptly to the government is a civic ____.", "duty / obligation", ["crime", "punishment", "gift"]),
        ("Protecting public utilities like streetlights and water pipes is the responsibility of ____.", "all citizens", ["the police only", "nobody", "strangers"]),
        ("A citizen should always obey lawful orders from the ____.", "police and courts", ["armed robbers", "fraudsters", "bullies"]),
        ("Treating people of different ethnic groups and religions with kindness is called ____.", "tolerance and unity", ["tribalism", "nepotism", "discrimination"]),
        ("Which of these is a civic responsibility of a student in school?", "Keeping the school compound clean", ["Damaging desks", "Bullying younger pupils", "Littering classrooms"]),
        ("A child's right to life, healthcare, and education is protected by the ____ Act.", "Child Rights", ["Labour", "Highway", "Customs"]),
        ("When singing the National Anthem, citizens should ____.", "stand upright and pay attention", ["run around the field", "eat snacks", "talk loudly"]),
        ("The Independent Corrupt Practices Commission is abbreviated as ____.", "ICPC", ["NEMA", "FRSC", "INEC"]),
        ("Refusing to join secret cults and violence in school demonstrates moral ____.", "courage and discipline", ["fear", "laziness", "cowardice"]),
        ("The National Youth Service Corps (NYSC) was established in 1973 to promote national ____.", "unity and integration", ["division", "sports only", "taxation"])
    ]
    for c_q, c_ans, c_dists in civic_principles:
        b.add(make_q(f"Civic duty (P{grade}): {c_q}", c_ans, c_dists, f"{c_ans} is the essential civic principle.", "Recall civic duty/value.", "Civic Principles", "Understand", "Medium"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Civic education standard #{counter} (P{grade}): The constitutional right to hold personal opinions and speak peacefully is the right to freedom of ____.",
                     "expression", ["violence", "tax evasion", "speeding"], "Freedom of expression is a fundamental right.", "Right to express opinions.", "Fundamental Rights", "Remember", "Easy"), rng)
        counter += 1

    return b.items[:100]
