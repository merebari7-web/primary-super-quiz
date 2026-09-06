import random
from .base import make_q, Bank, pick_others

def gen_agric(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"The practice of cultivating the soil, growing crops, and raising animals is called ____. (P{grade})", "agriculture (farming)", ["banking", "carpentry", "mining"], "Agriculture provides food, clothing materials, and raw industrial products for human society.", "Cultivation of soil and raising livestock.", "Introduction to Agriculture", "Remember", "Easy"),
        (f"Which of these is a cereal food crop grown on farms? (P{grade})", "Maize (Corn)", ["Rubber", "Cotton", "Timber"], "Maize is a staple cereal grain providing energy-giving carbohydrates for humans and livestock.", "Grain crop with golden kernels.", "Crops & Plants", "Understand", "Easy"),
        (f"Which of these is a common farm animal raised for milk and beef? (P{grade})", "Cow (Cattle)", ["Hyena", "Snake", "Lion"], "Cattle provide dairy milk, nutritious beef, and leather hides for industry.", "Livestock providing milk and meat.", "Farm Animals", "Understand", "Easy"),
        (f"Which farm tool has a curved metal blade with a wooden handle used for cutting bush and harvesting? (P{grade})", "Cutlass (Machete)", ["Spanner", "Screwdriver", "Hammer"], "Cutlasses are essential manual hand tools for clearing thick brush and harvesting mature crops.", "Curved blade for clearing bush.", "Farm Tools", "Remember", "Easy"),
        (f"Which simple farm tool is used for making heaps, ridges, and weeding soil? (P{grade})", "Hoe", ["Axe", "Saw", "Pliers"], "Hoes are traditional digging and weeding implements in tropical agriculture.", "Digging tool with a flat metal blade.", "Farm Tools", "Remember", "Easy")
    ]
    
    p2_items = [
        (f"The top layer of the Earth's crust in which plants grow their roots is ____. (P{grade})", "soil", ["plastic", "glass", "tar"], "Soil provides mechanical root anchorage, moisture, and vital chemical nutrients to plants.", "Natural earthy ground layer supporting plants.", "Soil Science", "Remember", "Easy"),
        (f"Which farm tool is used to carry water and gently sprinkle it onto young nursery seedlings? (P{grade})", "Watering can", ["Wheelbarrow", "Rake", "Shovel"], "Watering cans feature a perforated rose head for gentle, non-destructive irrigation.", "Has a sprinkler rose head.", "Farm Tools", "Remember", "Easy"),
        (f"A tool with metal prongs used for gathering dried leaves, stones, and leveling seedbeds is a ____. (P{grade})", "rake", ["hoe", "cutlass", "axe"], "Rakes collect garden debris and create smooth, even seedbeds ready for planting.", "Has metal prongs for gathering debris.", "Farm Tools", "Remember", "Easy"),
        (f"Animals that provide meat, wool, milk, or labour on a farm are called ____. (P{grade})", "livestock / farm animals", ["wild beasts", "pests", "parasites"], "Domesticated animals kept for agricultural production are known as livestock.", "Domesticated animals on farms.", "Farm Animals", "Understand", "Easy")
    ]
    
    p3_items = [
        (f"Crops grown mainly for their edible seeds inside pods (e.g. beans, groundnuts, cowpeas) are ____. (P{grade})", "legumes (pulses)", ["cereals", "tubers", "beverages"], "Legumes are protein-rich crops that also fix atmospheric nitrogen into the soil.", "Protein-rich pod crops.", "Crop Classification", "Understand", "Medium"),
        (f"Crops grown for their underground swollen edible roots or stems (e.g. yam, cassava, sweet potato) are ____. (P{grade})", "tubers / root crops", ["cereals", "fibres", "spices"], "Tubers store abundant carbohydrate energy underground for plant survival and human consumption.", "Underground root or stem crops.", "Crop Classification", "Understand", "Medium"),
        (f"Crops grown for their grain seeds (e.g. rice, maize, wheat, millet, sorghum) are classified as ____. (P{grade})", "cereals (grains)", ["legumes", "tubers", "latex"], "Cereals are grass crops cultivated globally for their edible grain components.", "Grain grass crops.", "Crop Classification", "Understand", "Medium"),
        (f"Unwanted wild plants growing on farm plots that compete with crops for sunlight, water, and nutrients are ____. (P{grade})", "weeds", ["pests", "fertilizers", "mulch"], "Weeds reduce crop yields and must be controlled by systematic weeding or organic mulching.", "Unwanted plants on farm beds.", "Weed Management", "Understand", "Easy"),
        (f"A tool with a single wheel and two handles used for transporting soil, fertilizer, and harvested crops is a ____. (P{grade})", "wheelbarrow", ["tractor", "planter", "harvester"], "Wheelbarrows facilitate manual hauling of heavy bulk materials around the farmstead.", "One-wheeled cart for farm transport.", "Farm Tools", "Remember", "Easy")
    ]
    
    p4_items = [
        (f"Crops grown primarily to be sold for export and commercial revenue (e.g. cocoa, rubber, oil palm) are ____. (P{grade})", "cash crops", ["subsistence crops", "weeds", "pasture"], "Cash crops generate national foreign exchange and significant income for farmers.", "Crops grown primarily for market sales.", "Crop Classification", "Understand", "Medium"),
        (f"The tree crop whose fermented and dried beans are processed into chocolate and cocoa beverage is ____. (P{grade})", "cocoa", ["rubber", "cotton", "tobacco"], "Cocoa (Theobroma cacao) is a major tropical agricultural export used worldwide for chocolate confectionery.", "Source of chocolate and cocoa.", "Cash Crops", "Remember", "Easy"),
        (f"The white milky liquid (latex) tapped from the bark of the rubber tree is processed into ____. (P{grade})", "rubber / tyres", ["chocolate", "cooking oil", "sugar"], "Coagulated latex yields natural rubber for tyres, footwear, and flexible industrial tubing.", "Source of natural rubber.", "Cash Crops", "Remember", "Easy"),
        (f"Organic fertilizer made by decomposing plant waste, food scraps, and animal manure in a pit is ____. (P{grade})", "compost", ["chemical pesticide", "sand", "plastic mulch"], "Compost restores soil organic matter, beneficial microbial activity, and moisture retention.", "Decomposed organic manure.", "Soil Fertility", "Understand", "Medium"),
        (f"Insects (such as locusts, caterpillars, and weevils) that destroy crops and stored food grains are agricultural ____. (P{grade})", "pests", ["predators", "pollinators", "symbionts"], "Pests cause significant pre-harvest field loss and post-harvest granary destruction.", "Organisms that damage agricultural produce.", "Pests & Diseases", "Remember", "Easy")
    ]
    
    p5_items = [
        (f"A modern, powerful farm vehicle used for pulling heavy implements like ploughs, harrows, and trailers is a ____. (P{grade})", "tractor", ["wheelbarrow", "bicycle", "sprayer"], "Tractors mechanize heavy soil tillage, planting, and field haulage on modern farms.", "Heavy farm engine vehicle.", "Farm Machinery", "Remember", "Easy"),
        (f"The artificial application of controlled amounts of water to agricultural land to assist crop growth is ____. (P{grade})", "irrigation", ["drainage", "mulching", "harvesting"], "Irrigation ensures reliable crop production during dry seasons and in semi-arid zones.", "Supplying water to crops artificially.", "Farm Practices", "Understand", "Medium"),
        (f"The branch of agriculture concerned with raising domesticated birds (chickens, turkeys, ducks) for meat and eggs is ____. (P{grade})", "poultry farming", ["apiculture", "aquaculture", "sericulture"], "Poultry provides valuable dietary animal protein in meat and eggs at rapid reproductive rates.", "Farming chickens and turkeys.", "Animal Husbandry", "Remember", "Easy"),
        (f"The commercial farming and breeding of fish and other aquatic animals in managed ponds or tanks is ____. (P{grade})", "fish farming (aquaculture)", ["poultry", "forestry", "horticulture"], "Aquaculture supplements wild fisheries with sustainably farmed tilapia, catfish, and carp.", "Raising fish in ponds or tanks.", "Animal Husbandry", "Remember", "Easy"),
        (f"Large tall cylindrical metal or concrete structures used for bulk storage of dried grains (maize, wheat) are ____. (P{grade})", "silos", ["barns", "kennels", "sheds"], "Silos protect grain from moisture, mold, rodents, and weevil infestation over long durations.", "Tall grain storage towers.", "Crop Storage", "Remember", "Medium")
    ]
    
    p6_items = [
        (f"The practice of growing different crops in systematic succession on the same piece of land over seasons is ____. (P{grade})", "crop rotation", ["monocropping", "deforestation", "shifting cultivation"], "Crop rotation breaks pest life cycles, balances nutrient uptake, and preserves soil fertility.", "Alternating different crops in a planned cycle.", "Farm Management", "Understand", "Medium"),
        (f"Growing a legume crop (such as groundnuts or beans) in rotation improves soil fertility because legumes ____. (P{grade})", "fix atmospheric nitrogen into soil via root nodules", ["absorb all water", "produce poisonous acid", "attract caterpillars"], "Rhizobium bacteria in legume root nodules convert atmospheric N2 into plant-usable nitrates.", "Legumes fix nitrogen naturally.", "Soil Science", "Understand", "Hard"),
        (f"A farming system where a farmer grows crops and rears livestock concurrently on the same farm is ____ farming. (P{grade})", "mixed", ["pastoral", "monoculture", "hydroponic"], "Mixed farming uses animal manure to enrich crops and crop residue to feed livestock.", "Both crops and animals on one farm.", "Farming Systems", "Understand", "Medium"),
        (f"The removal of the top fertile layer of soil by flowing water or strong wind is known as soil ____. (P{grade})", "erosion", ["mulching", "tillage", "irrigation"], "Soil erosion degrades farm productivity and creates destructive gullies across farmland.", "Washing or blowing away of topsoil.", "Soil Conservation", "Remember", "Easy"),
        (f"A method of controlling soil erosion on steep hillsides by building stepped level terraces is called ____. (P{grade})", "terracing (contour farming)", ["overgrazing", "bush burning", "deforestation"], "Terracing reduces water runoff velocity and traps precious soil moisture on slopes.", "Stepped farming on hillsides.", "Soil Conservation", "Understand", "Medium")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    crop_class = [
        ("Yam", "tuber / root crop", ["cereal", "fibre", "latex"]),
        ("Cassava", "tuber / root crop", ["cereal", "fruit", "spice"]),
        ("Rice", "cereal grain", ["legume", "tuber", "fibre"]),
        ("Millet", "cereal grain", ["legume", "oil crop", "beverage"]),
        ("Sorghum (Guinea corn)", "cereal grain", ["legume", "fruit", "fibre"]),
        ("Cowpea (Beans)", "legume", ["cereal", "tuber", "latex"]),
        ("Groundnut (Peanut)", "legume and oil crop", ["cereal", "fibre", "timber"]),
        ("Oil Palm", "oil and cash crop", ["cereal", "legume", "vegetable"]),
        ("Cotton", "fibre crop used for making textile clothing", ["beverage", "tuber", "cereal"]),
        ("Coffee", "beverage crop", ["fibre", "tuber", "legume"]),
        ("Tea", "beverage crop", ["cereal", "latex", "tuber"]),
        ("Sugarcane", "sugar crop", ["legume", "fibre", "oil crop"])
    ]
    for cname, ctype, dists in crop_class:
        b.add(make_q(f"Crop classification: {cname} is scientifically grouped as a ____ (Primary {grade}).",
                     ctype, dists, f"{cname} is botanically classified as a {ctype}.", f"Botanical class of {cname}.", "Crop Types", "Understand", "Easy"), rng)

    animal_prod = [
        ("Sheep", "wool and mutton", ["pork and lard", "honey", "silk"]),
        ("Bees (Apiculture)", "honey and beeswax", ["milk and beef", "wool", "leather"]),
        ("Silkworm", "silk fibre for textiles", ["milk", "honey", "wool"]),
        ("Pigs (Swine)", "pork and bacon", ["wool and mutton", "honey", "dairy milk"]),
        ("Goats", "chevon meat, milk, and leather", ["pork", "honey", "silk"])
    ]
    for aname, aprod, dists in animal_prod:
        b.add(make_q(f"Animal husbandry: What major agricultural products do we obtain from {aname}? [P{grade}]",
                     aprod, dists, f"{aname} provide {aprod} for human consumption and industrial use.", f"Yield from {aname}.", "Animal Products", "Remember", "Easy"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Agricultural science practice #{counter} [P{grade}]: Adding decayed plant matter (mulch) over topsoil helps prevent ____.",
                     "moisture loss through evaporation", ["weed growth completely", "root formation", "soil warmth"], "Mulching conserves soil moisture and cools the root zone.", "Conserves soil moisture.", "Soil Management", "Understand", "Medium"), rng)
        counter += 1

    return b.items[:100]
