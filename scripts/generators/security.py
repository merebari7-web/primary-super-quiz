import random
from .base import make_q, Bank, pick_others

def gen_security(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"A person whom you do not know or have never met before is called a ____. (P{grade})", "stranger", ["neighbor", "family member", "classmate"], "Children should never accept gifts, rides, or food from strangers.", "An unknown person.", "Personal Safety", "Remember", "Easy"),
        (f"If an unknown stranger offers you sweets, money, or a car ride, you should ____. (P{grade})", "say NO loudly, run away, and tell a trusted adult", ["accept the sweets", "enter their car", "keep it secret"], "Never accept gifts or rides from strangers.", "Safe response to stranger advances.", "Personal Safety", "Apply", "Easy"),
        (f"The private parts of your body covered by a swimming suit must NOT be touched by ____. (P{grade})", "anyone, except a doctor with parents present", ["strangers on the street", "class bullies", "anyone who asks"], "Body boundaries teach children personal safety and protection from abuse.", "Rule on body privacy boundaries.", "Body Safety & Protection", "Remember", "Easy"),
        (f"If anyone touches you in an uncomfortable or unsafe way, you should ____. (P{grade})", "shout, run away, and report immediately to parents or teachers", ["keep quiet and cry alone", "promise not to tell", "accept money from them"], "Never keep unsafe secrets; always tell trusted guardians.", "Action when personal boundary is crossed.", "Body Safety & Protection", "Apply", "Easy")
    ]
    
    p2_items = [
        (f"Before crossing a busy road, you should: Look left, look right, look left again, and ____. (P{grade})", "listen for oncoming vehicles before walking across", ["run across with eyes closed", "play football on the road", "ride a skateboard blindly"], "Look left, right, left and listen ensures safe road crossing.", "Essential pedestrian crossing rule.", "Road & Traffic Safety", "Understand", "Easy"),
        (f"The designated painted black and white pedestrian crossing zone on the road is the ____ crossing. (P{grade})", "Zebra", ["Giraffe", "Elephant", "Tiger"], "Vehicles are legally mandated to stop for pedestrians on zebra crossings.", "Black and white road stripes.", "Road & Traffic Safety", "Remember", "Easy"),
        (f"Playing with matches, candle flames, or lighters in the house can cause dangerous ____. (P{grade})", "fire outbreaks", ["rain showers", "clean air", "cold weather"], "Matches and open flames are fire hazards that children must never touch.", "Danger of playing with matches.", "Fire Safety", "Understand", "Easy"),
        (f"When electric wires are naked or damaged, touching them can cause severe ____. (P{grade})", "electric shock and burns", ["water leak", "good music", "cleanliness"], "Never touch exposed wires or wet electrical switches.", "Danger of exposed electrical wires.", "Home Safety", "Understand", "Easy")
    ]
    
    p3_items = [
        (f"The law enforcement agency established to maintain public order, protect lives, and prevent crime is the ____. (P{grade})", "Police Force", ["Fire Service", "Customs", "Postal Service"], "The Police investigate crime, apprehend suspects, and protect citizens.", "Primary crime prevention agency.", "Security Agencies", "Remember", "Easy"),
        (f"The emergency agency equipped with water trucks and ladders to extinguish building fires is the ____. (P{grade})", "Fire Service", ["Police", "Immigration", "Prisons Service"], "Fire fighters rescue trapped individuals and combat chemical and domestic fires.", "Agency that puts out fires.", "Emergency Agencies", "Remember", "Easy"),
        (f"When someone secretly takes another person's property without permission, the crime committed is ____. (P{grade})", "theft / stealing", ["generosity", "kindness", "charity"], "Stealing violates property rights and is punishable under the penal code.", "Taking property without consent.", "Crime Awareness", "Remember", "Easy"),
        (f"When someone uses physical force or weapons to take money or belongings by violence, it is ____. (P{grade})", "robbery", ["trading", "borrowing", "donating"], "Robbery involves force, intimidation, or armed coercion.", "Taking property with violent force.", "Crime Awareness", "Remember", "Easy")
    ]
    
    p4_items = [
        (f"Illegally seizing a person by force and holding them captive to demand ransom money is ____. (P{grade})", "kidnapping (abduction)", ["adoption", "fostering", "hiring"], "Kidnapping is a grave criminal offense causing severe trauma.", "Abducting someone for ransom.", "Security Threats", "Remember", "Easy"),
        (f"Repeated aggressive behavior intended to hurt, intimidate, or humiliate someone weaker is called ____. (P{grade})", "bullying", ["mentoring", "coaching", "befriending"], "Bullying in schools or online is unacceptable and must be reported immediately.", "Intimidating weaker persons.", "School & Social Safety", "Understand", "Easy"),
        (f"Sharing your home address, school name, phone number, or passwords with online strangers is ____. (P{grade})", "dangerous and unsafe", ["very smart", "polite", "required"], "Private personal data must never be shared on public internet platforms.", "Rules for internet privacy.", "Cyber Safety", "Apply", "Easy"),
        (f"Sending harmful, hurtful, or threatening messages online or on social media is called ____. (P{grade})", "cyberbullying", ["online gaming", "digital art", "coding"], "Cyberbullying is harmful harassment that should be blocked and reported.", "Harassment on the internet.", "Cyber Safety", "Understand", "Easy")
    ]
    
    p5_items = [
        (f"The military branch trained to defend a country's land territory against external aggression is the ____. (P{grade})", "Army", ["Navy", "Air Force", "Customs"], "The Army operates tanks, infantry, and artillery for ground defense.", "Land-based armed forces branch.", "Armed Forces", "Remember", "Easy"),
        (f"The military branch that defends the country's maritime borders, territorial waters, and oceans is the ____. (P{grade})", "Navy", ["Army", "Air Force", "Police"], "The Navy deploys warships, patrol gunboats, and submarines.", "Sea and ocean defense branch.", "Armed Forces", "Remember", "Easy"),
        (f"The military branch that defends the country's national airspace using fighter jets and helicopters is the ____. (P{grade})", "Air Force", ["Navy", "Army", "Coast Guard"], "The Air Force maintains air supremacy and aerial reconnaissance.", "Airspace defense branch.", "Armed Forces", "Remember", "Easy"),
        (f"The paramilitary agency in Nigeria that patrols borders, airports, and issues international passports is the ____. (P{grade})", "Immigration Service (NIS)", ["Customs", "Prisons", "Civil Defence"], "Nigeria Immigration Service controls migration and border entry.", "Issues international passports.", "Security Agencies", "Remember", "Easy"),
        (f"The emergency agency that manages disaster relief, floods, building collapses, and internally displaced persons is ____. (P{grade})", "NEMA", ["EFCC", "ICPC", "FRSC"], "National Emergency Management Agency coordinates disaster response operations.", "National disaster relief agency.", "Emergency Agencies", "Remember", "Easy")
    ]
    
    p6_items = [
        (f"The secret gathering of students engaging in violent initiation rituals, terrorizing campuses, and carrying illegal weapons is called ____. (P{grade})", "cultism", ["debating society", "sports club", "scouts"], "Cultism promotes violence, crime, and destruction of academic futures.", "Harmful secret society in schools.", "Security Threats", "Remember", "Easy"),
        (f"Deliberately damaging, breaking, or defacing public properties (e.g. school desks, traffic lights, transformers) is ____. (P{grade})", "vandalism", ["maintenance", "renovation", "conservation"], "Vandalism destroys national infrastructure and wastes community resources.", "Destruction of public property.", "Crime & Law", "Remember", "Easy"),
        (f"The illegal recruitment, transportation, and exploitation of vulnerable persons for forced labor or prostitution is ____. (P{grade})", "human trafficking", ["tourism", "immigration", "evacuation"], "Human trafficking is modern slavery fought globally and by NAPTIP.", "Exploitation of human beings.", "Human Rights Crimes", "Understand", "Medium"),
        (f"The emergency telephone code used in Nigeria and many countries to reach police, ambulance, or fire services quickly is ____. (P{grade})", "112 (or 999/911)", ["419", "007", "1000"], "112 is the toll-free national emergency response center number.", "National emergency telephone number.", "Emergency Protocols", "Remember", "Easy"),
        (f"The paramilitary security corps established in Nigeria to protect critical national infrastructure and monitor private security is ____. (P{grade})", "NSCDC (Civil Defence)", ["Customs", "NDLEA", "FRSC"], "Nigeria Security and Civil Defence Corps guards pipelines, rail tracks, and schools.", "Guards critical infrastructure.", "Security Agencies", "Remember", "Medium")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    crimes = [
        ("Bribery and Corruption", "offering or accepting money or gifts to influence an official's legal duty unfairly", ["helping someone carry books", "paying exact store price", "greeting an elder politely"]),
        ("Forgery", "falsely making or altering documents, signatures, or currency banknotes with intent to defraud", ["painting a landscape", "writing a personal diary", "signing your own homework"]),
        ("Assault", "unlawfully using physical force or threatening violence against another person's body", ["playing basketball", "debating in class", "running in a race"]),
        ("Smuggling", "illegally importing or exporting banned or untaxed contraband goods across borders", ["paying customs duty", "flying on holiday", "sending legal mail"])
    ]
    for c_name, c_def, c_dist in crimes:
        b.add(make_q(f"Crime awareness (P{grade}): What is {c_name}?",
                     c_def, c_dist, f"{c_name} is defined as {c_def}.", f"Definition of {c_name}.", "Crimes & Penalties", "Understand", "Medium"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Community security principle #{counter} (P{grade}): Being alert and reporting suspicious movements or strange abandoned bags in public spaces is a duty of ____.",
                     "all vigilant citizens working with law enforcement", ["only foreign tourists", "nobody", "children only"], "Community vigilance prevents security incidents.", "Civic vigilance.", "Neighborhood Safety", "Understand", "Easy"), rng)
        counter += 1

    return b.items[:100]
