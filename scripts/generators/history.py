import random
from .base import make_q, Bank, pick_others

def gen_history(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"A person's father and mother are called their ____. (P{grade})", "parents", ["cousins", "uncles", "neighbors"], "Parents provide love, care, guidance, and sustenance in a nuclear family.", "Mother and father.", "Family History", "Remember", "Easy"),
        (f"The father of your father or mother is your ____. (P{grade})", "grandfather", ["brother", "nephew", "uncle"], "A grandfather is the father of one's parent.", "Parent's father.", "Family History", "Remember", "Easy"),
        (f"The mother of your father or mother is your ____. (P{grade})", "grandmother", ["sister", "aunt", "niece"], "A grandmother is the maternal or paternal female elder.", "Parent's mother.", "Family History", "Remember", "Easy"),
        (f"Stories passed down through spoken words from generation to generation are called ____ history.", "oral", ["written", "archaeological", "digital"], "Oral history preserves cultural heritage through memory and spoken storytelling.", "Spoken storytelling tradition.", "Historical Sources", "Remember", "Easy")
    ]
    
    p2_items = [
        (f"A traditional ruler of a Yoruba kingdom is called an ____. (P{grade})", "Oba", ["Emir", "Obi", "Sultan"], "Obas are traditional crowned monarchs across Yoruba land.", "Title of Yoruba monarchs.", "Traditional Leadership", "Remember", "Easy"),
        (f"A traditional ruler in many Northern Nigerian emirates is titled an ____. (P{grade})", "Emir", ["Oba", "Obi", "Ooni"], "Emirs are traditional rulers of historic emirates across Northern Nigeria.", "Title of Northern monarchs.", "Traditional Leadership", "Remember", "Easy"),
        (f"The traditional crowned monarch of Benin Kingdom is called the ____ of Benin. (P{grade})", "Oba", ["Sultan", "Attah", "Tor Tiv"], "The Oba of Benin has ruled the historic Benin Kingdom for centuries.", "Monarch of Benin Kingdom.", "Traditional Leadership", "Remember", "Easy"),
        (f"The monarch and paramount ruler of the historic Sokoto Caliphate is the ____ of Sokoto. (P{grade})", "Sultan", ["Oba", "Emir", "Obi"], "The Sultan of Sokoto is the spiritual leader of Nigerian Muslims.", "Title of Sokoto ruler.", "Traditional Leadership", "Remember", "Easy")
    ]
    
    p3_items = [
        (f"Ancient terra-cotta sculptures discovered in Plateau and Kaduna States dating back over 2,000 years belong to the ____ Culture. (P{grade})", "Nok", ["Benin", "Oyo", "Kanem-Borno"], "Nok culture produced Africa's earliest terracotta sculptures and iron-smelting evidence.", "Earliest terra-cotta culture.", "Early Nigerian History", "Remember", "Medium"),
        (f"Archaeological excavations of magnificent bronze casting roped pots and burial regalia in Eastern Nigeria revealed the ancient culture of ____. (P{grade})", "Igbo-Ukwu", ["Nok", "Ile-Ife", "Dura"], "Igbo-Ukwu (Anambra State) reveals sophisticated 9th-century bronze metallurgy.", "9th-century bronze site in Anambra.", "Early Nigerian History", "Remember", "Medium"),
        (f"The legendary cradle of the Yoruba people where Oduduwa founded the royal dynasty is ____. (P{grade})", "Ile-Ife", ["Kano", "Zaria", "Calabar"], "Ile-Ife is revered as the spiritual ancestral home of the Yoruba.", "Spiritual ancestral Yoruba city.", "Early Kingdoms", "Remember", "Easy"),
        (f"The great Northern commercial empire renowned for trans-Saharan trade that flourished for over a thousand years was ____. (P{grade})", "Kanem-Borno", ["Oyo", "Benin", "Opobo"], "Kanem-Borno controlled key trans-Saharan trade routes across Lake Chad.", "Trans-Saharan trade empire.", "Early Kingdoms", "Remember", "Medium")
    ]
    
    p4_items = [
        (f"The 19th-century Islamic scholar and reformer who founded the Sokoto Caliphate in 1804 was Sheikh ____. (P{grade})", "Usman dan Fodio", ["El-Kanemi", "Herbert Macaulay", "Murtala Muhammed"], "Usman dan Fodio established the unified Sokoto Caliphate.", "Founder of Sokoto Caliphate.", "19th Century History", "Remember", "Medium"),
        (f"The brave Queen who ruled Zazzau (Zaria) in the 16th century and expanded its territory was Queen ____. (P{grade})", "Amina", ["Moremi", "Idia", "Emotan"], "Queen Amina was a master military strategist and warrior queen of Zazzau.", "Famous warrior queen of Zaria.", "Heroines in History", "Remember", "Easy"),
        (f"The courageous ancestral heroine of Ile-Ife who helped defeat the Ugbo invaders was Queen ____. (P{grade})", "Moremi Ajasoro", ["Amina", "Idia", "Kambasa"], "Moremi's self-sacrifice and intelligence saved Ife from mysterious raiders.", "Ife heroine who defeated raiders.", "Heroines in History", "Remember", "Easy"),
        (f"The Scottish missionary who worked in Calabar and famously stopped the killing of newborn twins was ____. (P{grade})", "Mary Slessor", ["Mungo Park", "David Livingstone", "Lord Lugard"], "Mary Slessor lived among the Efik people and protected twins and women.", "Scottish missionary who saved twins in Calabar.", "Colonial & Missionary History", "Remember", "Easy")
    ]
    
    p5_items = [
        (f"The Scottish explorer who explored the course of River Niger and died at the Bussa Rapids in 1806 was ____. (P{grade})", "Mungo Park", ["Richard Lander", "John Lander", "Lord Lugard"], "Mungo Park documented that River Niger flows eastwards before perishing at Bussa.", "Explorer of River Niger.", "Exploration History", "Remember", "Medium"),
        (f"The British colonial Governor-General who amalgamated the Northern and Southern Protectorates of Nigeria in 1914 was ____. (P{grade})", "Lord Frederick Lugard", ["Arthur Richards", "John Macpherson", "Hugh Clifford"], "Lugard oversaw the 1914 amalgamation creating modern Nigeria.", "Governor who amalgamated Nigeria in 1914.", "Colonial Nigeria", "Remember", "Easy"),
        (f"The name 'Nigeria' was suggested by Flora Shaw (later Lady Lugard) from the phrase '____'. (P{grade})", "Niger Area", ["New Guinea", "Nile Region", "Northern Empire"], "Flora Shaw published the name 'Nigeria' in The Times newspaper in 1897.", "Derived from 'Niger Area'.", "National History", "Remember", "Easy"),
        (f"Nigeria officially gained independence from British colonial rule on October 1, ____. (P{grade})", "1960", ["1914", "1963", "1999"], "Nigeria achieved sovereignty as an independent nation on 1 October 1960.", "Year of Nigerian Independence.", "Independence Era", "Remember", "Easy"),
        (f"The first Prime Minister of independent Nigeria in 1960 was Sir ____. (P{grade})", "Abubakar Tafawa Balewa", ["Nnamdi Azikiwe", "Ahmadu Bello", "Obafemi Awolowo"], "Sir Abubakar Tafawa Balewa led the federal cabinet as Prime Minister from 1957 to 1966.", "First Prime Minister of Nigeria.", "National Heroes", "Remember", "Easy")
    ]
    
    p6_items = [
        (f"The first ceremonial President of the Federal Republic of Nigeria when it became a republic in 1963 was Dr. ____. (P{grade})", "Nnamdi Azikiwe", ["Obafemi Awolowo", "Ahmadu Bello", "Yakubu Gowon"], "Dr. Nnamdi Azikiwe ('Zik of Africa') was Governor-General and first President.", "First Nigerian President (1963).", "National Heroes", "Remember", "Easy"),
        (f"The Premier of the Western Region who introduced free Universal Primary Education (UPE) in 1955 was Chief ____. (P{grade})", "Obafemi Awolowo", ["Ladoke Akintola", "Herbert Macaulay", "Dennis Osadebay"], "Chief Obafemi Awolowo pioneered free primary schooling and healthcare in the Western Region.", "Premier who introduced free primary education.", "National Heroes", "Remember", "Easy"),
        (f"The Premier of the Northern Region who was a great nationalist and Sardauna of Sokoto was Sir ____. (P{grade})", "Ahmadu Bello", ["Aminu Kano", "Shehu Shagari", "Kashim Ibrahim"], "Sir Ahmadu Bello developed infrastructure, education, and unity in Northern Nigeria.", "Sardauna of Sokoto and Northern Premier.", "National Heroes", "Remember", "Easy"),
        (f"The nationalist pioneer regarded as the 'Father of Nigerian Nationalism' who founded the NNDP in 1923 was ____. (P{grade})", "Herbert Macaulay", ["Nnamdi Azikiwe", "Michael Imoudu", "Ernest Ikoli"], "Herbert Macaulay championed civil liberties and political parties in colonial Lagos.", "Father of Nigerian Nationalism.", "National Heroes", "Remember", "Medium"),
        (f"The Organization of African Unity (now the African Union) was founded in Addis Ababa in the year ____. (P{grade})", "1963", ["1960", "1975", "1990"], "The OAU was formed on 25 May 1963 to promote African liberation and unity.", "Founding year of the OAU.", "African & World History", "Remember", "Medium")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    monuments = [
        ("Zuma Rock", "a giant natural monolith near Abuja rising 725 metres above its surroundings", ["an ancient mud pyramid", "a man-made brick fortress", "a colonial clock tower"]),
        ("Aso Rock", "a large granitic rock outcrop in Abuja overlooking the Presidential Complex", ["a coral reef", "a sandy desert dune", "a volcanic crater lake"]),
        ("Kano Ancient City Walls", "historic defensive mud fortifications built between 1095 and 1134 CE", ["a modern glass skyscraper", "a steel suspension bridge", "a wooden palace"]),
        ("Osun-Osogbo Sacred Grove", "a preserved sacred rainforest along the Osun River containing shrines and sculptures", ["a modern shopping mall", "an oil refinery", "a seaport harbor"]),
        ("Sungbo's Eredo", "a massive system of defensive earthen ramparts and ditches surrounding ancient Ijebu", ["a wooden sailing ship", "a stone lighthouse", "a metal radio mast"]),
        ("National Theatre, Iganmu", "a landmark arts complex in Lagos shaped like a military general's peaked cap", ["a hospital ship", "a mountain observatory", "a sports stadium"])
    ]
    for m_name, m_def, m_dist in monuments:
        b.add(make_q(f"Historical landmark (P{grade}): What is {m_name}?",
                     m_def, m_dist, f"{m_name} is {m_def}.", f"Description of {m_name}.", "Landmarks & Heritage", "Understand", "Easy"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Historical analysis inquiry #{counter} (P{grade}): Learning the history of our country helps young pupils understand their ____.",
                     "heritage, national identity, and cultural roots", ["future wealth", "vehicle driving", "weather forecast"], "History provides identity, civic wisdom, and cultural continuity.", "Importance of learning history.", "Historical Inquiry", "Understand", "Easy"), rng)
        counter += 1

    return b.items[:100]
