import random
from .base import make_q, Bank, pick_others

def gen_home(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"The place where family members live together, sleep, and feel safe is called a ____. (P{grade})", "home (house)", ["market", "bank", "garage"], "A home provides shelter, protection, and familial care.", "Living place of family.", "The Home & Family", "Remember", "Easy"),
        (f"The special room in the house where food is cooked and prepared is the ____. (P{grade})", "kitchen", ["bedroom", "bathroom", "verandah"], "The kitchen is equipped with cookers, pots, and food preparation surfaces.", "Room for cooking food.", "Rooms in the House", "Remember", "Easy"),
        (f"The room in the house where family members sleep and rest at night is the ____. (P{grade})", "bedroom", ["parlour (sitting room)", "toilet", "balcony"], "Bedrooms provide quiet, comfortable sleeping environments.", "Room for sleeping.", "Rooms in the House", "Remember", "Easy"),
        (f"We brush our teeth at least ____ times a day to prevent tooth decay and bad breath. (P{grade})", "two (morning and night)", ["once a month", "zero", "seven"], "Brushing twice daily cleans plaque and freshens breath.", "Recommended daily tooth brushing.", "Personal Hygiene", "Remember", "Easy"),
        (f"We wash our hands with clean water and ____ before eating and after using the toilet. (P{grade})", "soap", ["sand", "oil", "pepper"], "Soap and water wash away harmful disease-causing germs.", "Cleansing agent for handwashing.", "Personal Hygiene", "Remember", "Easy")
    ]
    
    p2_items = [
        (f"A small pointed metal tool with an eye at one end used for hand sewing is a ____. (P{grade})", "needle", ["nail", "hammer", "spanner"], "Needles carry thread through fabric to sew stitches.", "Tool with an eye for sewing.", "Sewing & Crafts", "Remember", "Easy"),
        (f"The small protective cap worn on the finger to push the needle safely while sewing is a ____. (P{grade})", "thimble", ["ring", "glove", "sock"], "Thimbles protect fingertips from needle pricks.", "Finger guard for sewing.", "Sewing & Crafts", "Remember", "Easy"),
        (f"Sharp metal cutting tools used for cutting cloth, paper, and threads are ____. (P{grade})", "scissors (shears)", ["knives", "saws", "chisels"], "Scissors have two pivoting blades for neat fabric cutting.", "Tool with 2 blades for cutting cloth.", "Sewing & Crafts", "Remember", "Easy"),
        (f"Clothes worn by pupils to school that look identical for everyone are school ____. (P{grade})", "uniforms", ["costumes", "pyjamas", "swimsuits"], "School uniforms promote neatness, equality, and school identity.", "Identical attire worn to school.", "Clothing & Textiles", "Remember", "Easy")
    ]
    
    p3_items = [
        (f"Foods that supply the body with energy to run, play, and learn (e.g. rice, yam, bread) are rich in ____. (P{grade})", "carbohydrates", ["vitamins only", "minerals only", "water only"], "Carbohydrates are the primary fuel for human metabolic energy.", "Energy-giving nutrients.", "Food & Nutrition", "Understand", "Easy"),
        (f"Foods that help the body grow strong muscles and repair damaged tissues (e.g. beans, eggs, meat, fish) are rich in ____. (P{grade})", "proteins", ["fats only", "cellulose only", "sugars only"], "Proteins build body cells, enzymes, and muscle tissue.", "Bodybuilding nutrients.", "Food & Nutrition", "Understand", "Easy"),
        (f"Fresh fruits and vegetables protect the body against illnesses because they are rich in ____. (P{grade})", "vitamins and minerals", ["sugar only", "harmful bacteria", "animal fats"], "Vitamins (A, C, D) boost the immune system and vision.", "Protective nutrients.", "Food & Nutrition", "Understand", "Easy"),
        (f"A meal that contains all the essential classes of nutrients in correct proportions is a ____ diet. (P{grade})", "balanced", ["heavy", "junk", "dry"], "Balanced diets maintain optimal growth, health, and vitality.", "Diet containing all nutrient groups.", "Food & Nutrition", "Understand", "Easy")
    ]
    
    p4_items = [
        (f"Cooking food by submerging it in boiling water (at 100°C) is called ____. (P{grade})", "boiling", ["frying", "baking", "roasting"], "Boiling cooks tubers, rice, and eggs thoroughly in water.", "Cooking in boiling water.", "Food Preparation", "Remember", "Easy"),
        (f"Cooking food in hot cooking oil or fat in a pan is called ____. (P{grade})", "frying", ["steaming", "boiling", "grilling"], "Frying (deep or shallow) crisps foods quickly at high heat.", "Cooking in hot oil.", "Food Preparation", "Remember", "Easy"),
        (f"Cooking food in dry heat inside an enclosed oven (e.g. bread, cake, pies) is called ____. (P{grade})", "baking", ["boiling", "steaming", "poaching"], "Baking utilizes hot convective air inside an oven.", "Cooking inside an oven.", "Food Preparation", "Remember", "Easy"),
        (f"Cooking food gently using the vapor steam rising from boiling water below without touching the water is ____. (P{grade})", "steaming (e.g. moin-moin)", ["roasting", "deep-frying", "smoking"], "Steaming preserves delicate vitamins and flavors in foods.", "Cooking with hot water vapor.", "Food Preparation", "Remember", "Easy")
    ]
    
    p5_items = [
        (f"Treating and storing food to prevent spoiling and microbial decay over long periods is food ____. (P{grade})", "preservation", ["contamination", "fermentation", "wasting"], "Preservation methods (drying, salting, refrigeration) extend shelf life.", "Keeping food safe from spoiling.", "Food Preservation", "Understand", "Medium"),
        (f"A natural method of food preservation that removes water content by exposing food to sunlight and breeze is ____. (P{grade})", "sun drying (dehydration)", ["refrigeration", "canning", "pasteurization"], "Sun drying inhibits bacterial and mold growth by eliminating moisture.", "Drying under the sun.", "Food Preservation", "Remember", "Easy"),
        (f"The date printed on packaged food items after which the food should NOT be eaten is the ____ date. (P{grade})", "expiry / 'best before'", ["manufacturing", "packaging", "import"], "Eating expired foods carries significant risk of food poisoning.", "Date after which food is unsafe.", "Consumer Education", "Remember", "Easy"),
        (f"A person who buys, uses goods, and pays for services to satisfy personal needs is a ____. (P{grade})", "consumer", ["producer", "retailer", "wholesaler"], "Consumers have rights to quality, safety, and accurate product information.", "Buyer and user of goods.", "Consumer Education", "Remember", "Easy")
    ]
    
    p6_items = [
        (f"A detailed financial plan that estimates income and allocates planned expenditures over a specific period is a ____. (P{grade})", "budget", ["receipt", "invoice", "loan"], "Budgeting prevents overspending and ensures savings.", "Plan for income and spending.", "Family Finance", "Understand", "Medium"),
        (f"The difference between money earned (income) and money spent (expenses) when money remains is called ____. (P{grade})", "savings (surplus)", ["debt", "loss", "tax"], "Savings provide financial security for future investments and emergencies.", "Money kept aside for future use.", "Family Finance", "Understand", "Easy"),
        (f"When family expenses exceed total family income, the family experiences a budget ____. (P{grade})", "deficit (debt)", ["surplus", "profit", "dividend"], "Deficits require borrowing or reducing non-essential expenditures.", "When spending exceeds earnings.", "Family Finance", "Understand", "Medium"),
        (f"A legal document acknowledging that money or goods have been received from a buyer is a ____. (P{grade})", "receipt", ["cheque", "letter", "advertisement"], "Receipts serve as proof of purchase and warranty protection.", "Proof of payment.", "Consumer Education", "Remember", "Easy")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    stains = [
        ("Grease / Oil stain", "wash with warm water, detergent, and degreasing soap", ["bleach with strong acid", "iron immediately", "soak in petrol"]),
        ("Fresh Blood stain", "soak and rinse in COLD salty water (hot water sets blood)", ["rinse in boiling water", "iron with hot iron", "rub with charcoal"]),
        ("Ink stain", "dab with methylated spirit or milk before laundering", ["burn with candle", "rub with mud", "leave under rain"]),
        ("Rust stain", "treat with lime / lemon juice and salt before washing", ["soak in oil", "pour sugar on it", "wash with muddy water"])
    ]
    for s_name, s_sol, s_dist in stains:
        b.add(make_q(f"Clothing maintenance (P{grade}): How should a {s_name} be treated on white cotton fabric?",
                     s_sol, s_dist, f"A {s_name} is removed by: {s_sol}.", f"Treatment for {s_name}.", "Clothing & Laundry", "Apply", "Medium"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Home management standard #{counter} (P{grade}): Maintaining daily cleanliness in the kitchen prevents infestation by ____.",
                     "disease-carrying pests like cockroaches, flies, and rodents", ["fresh air", "clean water", "good smells"], "Sanitation removes food debris that attracts pests.", "Prevents pests.", "Home Sanitation", "Understand", "Easy"), rng)
        counter += 1

    return b.items[:100]
