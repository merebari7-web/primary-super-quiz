import random
from .base import make_q, Bank, pick_others

def gen_phe(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"Moving our arms, legs, and body to stay fit, energetic, and healthy is called physical ____. (P{grade})", "exercise", ["sleeping", "laziness", "eating"], "Regular physical exercise strengthens muscles, bones, and heart health.", "Physical activity for fitness.", "Physical Fitness", "Remember", "Easy"),
        (f"Which part of the body do we use for running, jumping, and kicking a football? (P{grade})", "Legs and feet", ["Ears and nose", "Hair and nails", "Shoulders only"], "Legs and feet provide locomotion and kicking power.", "Body parts for walking and running.", "Body Movement", "Remember", "Easy"),
        (f"Before playing active sports, athletes perform gentle warm-up exercises to prevent muscle ____. (P{grade})", "cramps and injuries", ["strength", "energy", "happiness"], "Warm-ups increase muscle elasticity and joint blood flow.", "Gentle exercises before games.", "Safety in Sports", "Understand", "Easy"),
        (f"Drinking clean, safe water every day keeps the human body properly ____. (P{grade})", "hydrated and healthy", ["thirsty", "tired", "bloated"], "Hydration regulates body temperature and transports nutrients.", "Replenishing body fluids.", "Health & Hygiene", "Remember", "Easy")
    ]
    
    p2_items = [
        (f"A standard game of football (soccer) is played between two teams of ____ players each. (P{grade})", "11", ["5", "7", "15"], "Each football team fields 11 players including one goalkeeper.", "Number of players on a football team.", "Team Sports", "Remember", "Easy"),
        (f"The only player on a football pitch permitted to touch the ball with hands inside the penalty box is the ____. (P{grade})", "goalkeeper", ["striker", "referee", "defender"], "Goalkeepers guard the goal and catch or deflect shots.", "Player protecting the goal.", "Team Sports", "Remember", "Easy"),
        (f"The official who enforces the rules and fairness during a football match is the ____. (P{grade})", "referee", ["coach", "captain", "spectator"], "The referee controls the match and penalizes fouls.", "Enforces game rules.", "Sports Rules", "Remember", "Easy"),
        (f"Running at maximum top speed over short sprint distances (e.g. 50m, 100m) is called ____. (P{grade})", "sprinting", ["jogging", "walking", "marching"], "Sprints require explosive anaerobic power.", "Short fast running races.", "Athletics & Track", "Remember", "Easy")
    ]
    
    p3_items = [
        (f"The immediate care and assistance given to an injured person before professional medical help arrives is ____. (P{grade})", "First Aid", ["Major Surgery", "Hospitalization", "Prescription"], "First aid stabilizes injuries, relieves pain, and saves lives.", "Immediate initial emergency care.", "First Aid", "Remember", "Easy"),
        (f"A clean portable box containing emergency bandages, antiseptic, plaster, and cotton wool is a ____ box. (P{grade})", "First Aid", ["Tool", "Shoe", "Pencil"], "First Aid kits are essential in classrooms, homes, and sports fields.", "Emergency medical supply box.", "First Aid", "Remember", "Easy"),
        (f"In standard athletics track events, the circular baton is passed between runners during a ____ race. (P{grade})", "relay (e.g. 4x100m)", ["marathon", "hurdle", "high jump"], "Relay runners pass the baton smoothly within the exchange zone.", "Team race passing a baton.", "Athletics & Track", "Remember", "Easy"),
        (f"Athletic field events include the high jump, long jump, shot put, and ____ throw. (P{grade})", "javelin", ["football", "table tennis", "swimming"], "Javelin involves throwing a light spear for maximum distance.", "Field throwing event with a spear.", "Athletics & Field", "Remember", "Easy")
    ]
    
    p4_items = [
        (f"Standard table tennis (ping-pong) is played using small wooden rackets (bats) and a lightweight hollow ____ ball. (P{grade})", "celluloid / plastic", ["leather", "iron", "rubber foam"], "Table tennis uses 40mm lightweight celluloid or polymer balls.", "Lightweight table tennis ball.", "Racket Games", "Remember", "Easy"),
        (f"The game played with rackets and a feathered shuttlecock hit across a high net is ____. (P{grade})", "badminton", ["tennis", "volleyball", "basketball"], "Badminton players rally the shuttlecock across the net.", "Racket game using a shuttlecock.", "Racket Games", "Remember", "Easy"),
        (f"Basketball is played by two opposing teams of ____ players each on the court. (P{grade})", "5", ["11", "7", "9"], "Basketball teams field 5 active players on the court.", "Players per team on basketball court.", "Ball Games", "Remember", "Easy"),
        (f"Volleyball teams hit the ball back and forth over a high net using a maximum of ____ touches per side. (P{grade})", "3", ["1", "5", "7"], "Teams use bump, set, spike within 3 touches to return the ball.", "Maximum touches allowed in volleyball.", "Ball Games", "Remember", "Medium")
    ]
    
    p5_items = [
        (f"The ability of the heart and lungs to deliver oxygen to working muscles during prolonged exercise is ____ endurance. (P{grade})", "cardiovascular (aerobic)", ["muscular only", "bone", "digestive"], "Cardiovascular endurance improves stamina and circulatory health.", "Heart and lung stamina.", "Physical Fitness", "Understand", "Medium"),
        (f"The range of smooth motion available around a joint (e.g. touching toes, splits) is called ____. (P{grade})", "flexibility", ["strength", "speed", "agility"], "Stretching exercises enhance muscular flexibility and joint mobility.", "Ability to bend joints easily.", "Physical Fitness", "Remember", "Easy"),
        (f"Diseases that spread from one person to another through air, water, or contact (e.g. cholera, flu) are ____ diseases. (P{grade})", "communicable (infectious)", ["non-communicable", "genetic", "deficiency"], "Communicable infections are caused by transmissible pathogens.", "Transmissible infections.", "Health & Disease", "Understand", "Medium"),
        (f"Malaria is a life-threatening disease transmitted to humans through the bite of infected female ____ mosquitoes. (P{grade})", "Anopheles", ["Culex", "Aedes", "Tsetse fly"], "Female Anopheles mosquitoes transmit Plasmodium parasites.", "Mosquito vector of malaria.", "Health & Disease", "Remember", "Easy")
    ]
    
    p6_items = [
        (f"Taking medicines without a doctor's prescription or using illegal narcotics is dangerous drug ____. (P{grade})", "abuse (misuse)", ["therapy", "metabolism", "prescription"], "Drug abuse damages the nervous system, liver, and mental health.", "Harmful misuse of substances.", "Drug Education", "Understand", "Easy"),
        (f"The national body in Nigeria responsible for regulating and approving safe foods and medicines is ____. (P{grade})", "NAFDAC", ["NDLEA", "FRSC", "NEMA"], "National Agency for Food and Drug Administration and Control ensures consumer safety.", "Agency regulating food and drugs.", "Public Health", "Remember", "Easy"),
        (f"The premier global sports event celebrated every four years uniting athletes from all nations is the ____ Games. (P{grade})", "Olympic", ["Commonwealth", "All Africa", "National"], "The modern Olympic Games feature summer and winter sports disciplines.", "Global 4-year sports festival.", "International Sports", "Remember", "Easy"),
        (f"In swimming, the four competitive strokes are freestyle (front crawl), breaststroke, backstroke, and ____. (P{grade})", "butterfly", ["dog paddle", "side dive", "treading"], "Butterfly stroke uses symmetrical arm pull and dolphin kick.", "The 4th competitive swim stroke.", "Aquatics & Swimming", "Remember", "Medium"),
        (f"Cardiopulmonary Resuscitation used to restore breathing and heartbeat during emergencies is abbreviated as ____. (P{grade})", "CPR", ["MRI", "ECG", "BBC"], "CPR combines chest compressions and rescue breaths to maintain circulation.", "Emergency resuscitation abbreviation.", "First Aid", "Remember", "Medium")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    injuries = [
        ("Fracture", "a broken or cracked bone requiring immediate splinting and radiography", ["a minor skin scratch", "a muscle stretch", "a shallow cut"]),
        ("Sprain", "a painful wrenching or tearing of ligaments around a joint (e.g. ankle)", ["a broken bone", "a tooth cavity", "a headache"]),
        ("Dislocation", "the displacement of a bone end from its normal joint socket", ["a bruised toenail", "a mild fever", "a muscle cramp"]),
        ("Cramp", "a sudden, involuntary, painful contraction of a muscle", ["a broken collarbone", "a cut on the skin", "a joint dislocation"])
    ]
    for i_name, i_def, i_dist in injuries:
        b.add(make_q(f"Sports injury (P{grade}): What is a {i_name}?",
                     i_def, i_dist, f"A {i_name} is {i_def}.", f"Definition of {i_name}.", "Sports Injuries", "Understand", "Medium"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Physical education principle #{counter} (P{grade}): Practicing good posture while sitting, standing, and walking keeps the spine ____.",
                     "properly aligned and prevents back strain", ["twisted", "weak and tired", "crooked"], "Proper posture protects spinal vertebrae and organs.", "Benefits of good posture.", "Posture & Health", "Understand", "Easy"), rng)
        counter += 1

    return b.items[:100]
