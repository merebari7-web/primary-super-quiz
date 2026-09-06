import random
from .base import make_q, Bank, pick_others

def gen_cca(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"The three PRIMARY colors in fine art that cannot be created by mixing other colors are ____. (P{grade})", "Red, Blue, and Yellow", ["Green, Orange, and Purple", "Black, White, and Grey", "Pink, Brown, and Violet"], "Red, Blue, and Yellow are the fundamental primary pigments.", "Red, Blue, and Yellow.", "Color Theory", "Remember", "Easy"),
        (f"Which of these is a PRIMARY color? (P{grade})", "Red", ["Green", "Orange", "Purple"], "Red is one of the three primary colors.", "Fundamental primary color.", "Color Theory", "Remember", "Easy"),
        (f"Which tool do artists use to apply paint onto paper or canvas? (P{grade})", "Paintbrush", ["Hammer", "Screwdriver", "Needle"], "A paintbrush transfers paint bristles to surface.", "Tool with bristles for painting.", "Art Tools & Materials", "Remember", "Easy"),
        (f"Artworks made by molding soft, wet earth and baking it are made from ____. (P{grade})", "clay", ["glass", "metal", "plastic"], "Clay is molded into pottery and terracotta sculptures.", "Malleable natural earth.", "Crafts & Modelling", "Understand", "Easy")
    ]
    
    p2_items = [
        (f"Mixing the primary colors RED and YELLOW produces the secondary color ____. (P{grade})", "Orange", ["Green", "Purple", "Brown"], "Red + Yellow = Orange.", "Result of mixing red and yellow.", "Color Theory", "Apply", "Easy"),
        (f"Mixing the primary colors BLUE and YELLOW produces the secondary color ____. (P{grade})", "Green", ["Orange", "Purple", "Pink"], "Blue + Yellow = Green.", "Result of mixing blue and yellow.", "Color Theory", "Apply", "Easy"),
        (f"Mixing the primary colors RED and BLUE produces the secondary color ____. (P{grade})", "Purple (Violet)", ["Green", "Orange", "Yellow"], "Red + Blue = Purple.", "Result of mixing red and blue.", "Color Theory", "Apply", "Easy"),
        (f"A traditional African percussion instrument played by beating with hands or sticks is a ____. (P{grade})", "drum (talking drum)", ["piano", "violin", "flute"], "Drums provide rhythmic drive across African cultures.", "Beaten with sticks or hands.", "Music & Instruments", "Remember", "Easy")
    ]
    
    p3_items = [
        (f"An artwork created by pasting small pieces of colored paper, fabric, or photos onto a backing is a ____. (P{grade})", "collage", ["sculpture", "fresco", "relief"], "Collage involves gluing mixed media onto a two-dimensional base.", "Pasting cut papers/fabric.", "Art Techniques", "Understand", "Medium"),
        (f"The Japanese traditional craft of folding paper into decorative shapes without cutting is called ____. (P{grade})", "origami", ["calligraphy", "batik", "weaving"], "Origami creates animals, flowers, and geometric models via paper folds.", "Japanese paper folding.", "Crafts & Culture", "Remember", "Medium"),
        (f"The highness or lowness of a musical tone or sound is known as ____. (P{grade})", "pitch", ["tempo", "volume", "timbre"], "Pitch corresponds to the frequency of sound wave vibrations.", "How high or low a note sounds.", "Music Theory", "Understand", "Medium"),
        (f"The speed or pace at which a piece of music is performed is called ____. (P{grade})", "tempo", ["pitch", "dynamics", "harmony"], "Tempo (allegro, andante, etc.) dictates performance speed.", "Speed of musical beats.", "Music Theory", "Remember", "Medium")
    ]
    
    p4_items = [
        (f"The traditional Nigerian resist-dyeing cloth art technique (famous in Abeokuta) is called ____. (P{grade})", "Tie and Dye (Adire)", ["Embroidery", "Knitting", "Mosaic"], "Adire fabrics use raffia ties or starch resist to create patterns with indigo dye.", "Resist-dyeing method for patterns.", "Textile Arts", "Remember", "Medium"),
        (f"Famous ancient bronze and terracotta sculptures dating back over 2,000 years in Nigeria originated from the ____ culture. (P{grade})", "Nok", ["Viking", "Roman", "Maya"], "Nok culture (Kaduna/Plateau) produced ancient terra-cotta sculptures.", "Ancient Nigerian terra-cotta culture.", "Art History & Heritage", "Remember", "Medium"),
        (f"The world-renowned bronze head casting and ivory carvings originated from the historic Kingdom of ____. (P{grade})", "Benin", ["Ghana", "Songhai", "Mali"], "Benin Court bronze castings are celebrated worldwide for masterly metallurgy.", "Ancient kingdom famous for bronze heads.", "Art History & Heritage", "Remember", "Medium"),
        (f"In drama and theatre, the person who writes the script or play is called a ____. (P{grade})", "playwright", ["choreographer", "sculptor", "conductor"], "A playwright crafts dramatic dialogues and stage directions.", "Writer of stage plays.", "Theatre & Drama", "Remember", "Easy")
    ]
    
    p5_items = [
        (f"The art of designing and arranging dance steps, patterns, and movements for a performance is ____. (P{grade})", "choreography", ["cinematography", "typography", "calligraphy"], "Choreographers compose dance routines and rhythmic staging.", "Designing dance movements.", "Dance & Performing Arts", "Remember", "Medium"),
        (f"Adding WHITE to a color to make it lighter creates a ____. (P{grade})", "tint", ["shade", "tone", "complement"], "A tint is a hue lightened by adding white (e.g. pink is a tint of red).", "Lightened with white.", "Color Theory", "Understand", "Medium"),
        (f"Adding BLACK to a color to make it darker creates a ____. (P{grade})", "shade", ["tint", "hue", "saturation"], "A shade is a hue darkened by the addition of black pigment.", "Darkened with black.", "Color Theory", "Understand", "Medium"),
        (f"The seven sol-fa musical notes in order are: Do, Re, Mi, Fa, So, La, ____, Do. (P{grade})", "Ti", ["Ka", "Lo", "Nu"], "The solfège scale culminates with 'Ti' before returning to tonic 'Do'.", "The 7th sol-fa note.", "Music Theory", "Remember", "Easy"),
        (f"A traditional annual fishing and cultural festival held in Kebbi State, Nigeria is the ____ festival. (P{grade})", "Argungu", ["New Yam", "Eyo", "Osun-Osogbo"], "The Argungu International Fishing Festival draws thousands of fishermen.", "Famous fishing festival in Kebbi.", "Cultural Festivals", "Remember", "Medium")
    ]
    
    p6_items = [
        (f"A visual art form that creates three-dimensional (3D) objects having height, width, and depth is ____. (P{grade})", "sculpture", ["drawing", "printmaking", "photography"], "Sculptures occupy real 3D physical volume in space.", "3-dimensional artwork.", "Visual Arts", "Understand", "Easy"),
        (f"The technique of depicting three-dimensional depth and distance on a flat 2D surface is called ____. (P{grade})", "perspective (and shading)", ["abstraction", "monochrome", "collage"], "Perspective uses vanishing points and scale to create realistic depth illusions.", "Technique for depth on flat surfaces.", "Drawing Techniques", "Understand", "Medium"),
        (f"The legal right granted to an artist or author preventing unauthorized reproduction of their creative work is ____. (P{grade})", "copyright", ["patent", "trademark", "royalty"], "Copyright safeguards original intellectual and creative properties.", "Protects artistic and literary work.", "Arts & Ethics", "Remember", "Medium"),
        (f"Famous Yoruba cultural festival celebrated in Lagos featuring white-clad masquerades with tall staffs is the ____ festival. (P{grade})", "Eyo", ["Argungu", "Durbar", "Calabar Carnival"], "Eyo festival is a historic royal cultural pageant in Lagos Island.", "Lagos masquerade with white flowing robes.", "Cultural Festivals", "Remember", "Medium"),
        (f"The grand equestrian (horseback) cultural festival celebrated across Northern Nigerian emirates during Eid is the ____. (P{grade})", "Durbar", ["New Yam", "Osun-Osogbo", "Ofala"], "The Durbar displays regal cavalry, traditional music, and emirate pageantry.", "Grand horse riding festival in Northern Nigeria.", "Cultural Festivals", "Remember", "Medium")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    instruments = [
        ("Talking drum (Gangan / Kalangu)", "an hourglass-shaped drum whose pitch changes by squeezing leather cords", ["a brass horn", "a wooden keyboard", "a single string"]),
        ("Kakaki", "a very long metal royal trumpet used in Northern Nigerian ceremonies", ["a thumb piano", "a clay rattle", "a stone drum"]),
        ("Shekere", "a dried gourd covered with a woven bead net shaken for rhythm", ["a bowed fiddle", "a flute", "a brass bell"]),
        ("Ogene", "a traditional forged iron double-bell gong played in Igbo music", ["a wooden flute", "a skin drum", "a string harp"]),
        ("Goje", "a traditional one- or two-stringed bowed fiddle with a gourd resonator", ["a brass horn", "a large drum", "an iron bell"]),
        ("Udu", "a water jug clay vessel drum tapped to produce deep bass tones", ["a wooden whistle", "a guitar", "a brass trumpet"])
    ]
    for iname, idefn, dists in instruments:
        b.add(make_q(f"Traditional instrument (P{grade}): What is a {iname}?",
                     idefn, dists, f"The {iname} is {idefn}.", f"Description of {iname}.", "Traditional Music", "Understand", "Medium"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Art and design principle #{counter} (P{grade}): The visual element of art concerned with the surface quality (smooth, rough, bumpy) is called ____.",
                     "texture", ["melody", "tempo", "volume"], "Texture describes the tactile surface feel of an artwork.", "Surface feel of an object.", "Elements of Art", "Remember", "Easy"), rng)
        counter += 1

    return b.items[:100]
