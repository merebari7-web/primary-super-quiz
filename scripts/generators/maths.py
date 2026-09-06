import random
from .base import make_q, Bank, near, pick_others, gcd, lcm

def gen_maths(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    if grade == 1:
        # P1 Addition & Subtraction
        for _ in range(35):
            x = rng.randint(1, 10)
            y = rng.randint(1, 10)
            ans = x + y
            b.add(make_q(f"What is {x} + {y}? (P1)", str(ans), near(ans),
                         f"{x} plus {y} equals {ans}.", f"Count {y} more steps forward from {x}.",
                         "Addition", "Apply", "Easy"), rng)
        for _ in range(35):
            x = rng.randint(4, 18)
            y = rng.randint(1, x)
            ans = x - y
            b.add(make_q(f"What is {x} - {y}? (P1)", str(ans), near(ans),
                         f"{x} take away {y} leaves {ans}.", f"Count backward {y} steps from {x}.",
                         "Subtraction", "Apply", "Easy"), rng)
        # Shapes & Geometry
        shape_facts = [
            ("How many sides does a triangle have? (P1)", "3", ["4", "5", "2"], "A triangle always has 3 straight sides.", "Think of the prefix 'tri' meaning three.", "Geometry", "Remember", "Easy"),
            ("How many sides does a rectangle have? (P1)", "4", ["3", "5", "6"], "A rectangle has 4 sides (2 long, 2 short).", "Count the corners of a standard door.", "Geometry", "Remember", "Easy"),
            ("How many corners does a square have? (P1)", "4", ["3", "5", "0"], "A square has 4 equal corners (vertices).", "Think of a box or tile.", "Geometry", "Remember", "Easy"),
            ("Which shape has NO straight sides? (P1)", "Circle", ["Square", "Triangle", "Rectangle"], "A circle is round with zero straight sides.", "Think of a round wheel or coin.", "Geometry", "Understand", "Easy"),
            ("Which shape has 4 equal sides? (P1)", "Square", ["Triangle", "Circle", "Oval"], "All four sides of a square are equal in length.", "All four sides must be the same length.", "Geometry", "Understand", "Easy"),
            ("Which number comes right after 19? (P1)", "20", ["18", "21", "29"], "Counting forward: 18, 19, 20.", "Add 1 to 19.", "Number Sense", "Remember", "Easy"),
            ("Which number is the smallest? (P1)", "3", ["9", "12", "7"], "3 represents the least quantity.", "Look for the number closest to zero.", "Number Sense", "Understand", "Easy"),
            ("Which number is the largest? (P1)", "25", ["15", "19", "21"], "25 has the greatest value among these.", "Compare the tens and units.", "Number Sense", "Understand", "Easy"),
            ("What is 10 plus 10? (P1)", "20", ["15", "25", "30"], "10 + 10 = 20 (two tens make twenty).", "Double 10.", "Addition", "Apply", "Easy"),
            ("How many days are in a week? (P1)", "7", ["5", "6", "8"], "There are 7 days from Sunday to Saturday.", "Name them: Sunday to Saturday.", "Measurement", "Remember", "Easy"),
            ("If you have 5 oranges and eat 2, how many oranges are left? (P1)", "3", ["2", "4", "7"], "5 minus 2 leaves 3 oranges.", "Subtract 2 from 5.", "Word Problems", "Apply", "Easy"),
            ("What is 2 + 2 + 2? (P1)", "6", ["4", "8", "5"], "2 + 2 + 2 = 6 (three groups of two).", "Add the twos step by step.", "Addition", "Apply", "Easy"),
            ("Which object is shaped like a ball? (P1)", "Sphere", ["Cube", "Cone", "Cylinder"], "A 3D ball shape is called a sphere.", "Think of a globe or soccer ball.", "Geometry", "Understand", "Easy"),
            ("How many fingers are on two hands? (P1)", "10", ["5", "8", "12"], "Each hand has 5 fingers: 5 + 5 = 10.", "Count 5 on each hand.", "Counting", "Remember", "Easy"),
            ("What is the ordinal word for number 1? (P1)", "First", ["Second", "Third", "Fourth"], "Number 1 in rank is first (1st).", "The beginning position.", "Number Sense", "Remember", "Easy"),
            ("What is the ordinal word for number 2? (P1)", "Second", ["First", "Third", "Last"], "Number 2 in rank is second (2nd).", "Position after first.", "Number Sense", "Remember", "Easy"),
            ("What is 15 - 5? (P1)", "10", ["5", "12", "20"], "15 - 5 = 10.", "Take away the units 5 from 15.", "Subtraction", "Apply", "Easy"),
            ("How many months are in a year? (P1)", "12", ["10", "7", "14"], "There are 12 months from January to December.", "Count January through December.", "Measurement", "Remember", "Easy"),
            ("If a clock short hand points to 3 and long hand points to 12, what time is it? (P1)", "3 o'clock", ["12 o'clock", "6 o'clock", "9 o'clock"], "When the minute hand is at 12, it is the exact hour.", "Look at where the short hour hand points.", "Time", "Understand", "Easy"),
            ("Which is heavier: an elephant or an ant? (P1)", "Elephant", ["Ant", "Both same", "Neither"], "An elephant has vastly more mass than an ant.", "Think of their actual body size.", "Measurement", "Understand", "Easy")
        ]
        for f in shape_facts:
            b.add(make_q(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]), rng)

    elif grade == 2:
        # 2-digit addition and subtraction, 2x, 3x, 5x, 10x tables
        for _ in range(30):
            x = rng.randint(12, 50)
            y = rng.randint(10, 45)
            ans = x + y
            b.add(make_q(f"Find the sum of {x} and {y}: (P2)", str(ans), near(ans),
                         f"{x} + {y} = {ans}.", f"Add units then tens: ({x%10}+{y%10}) + ({x//10}+{y//10})0.",
                         "Addition", "Apply", "Medium"), rng)
        for _ in range(25):
            x = rng.randint(30, 99)
            y = rng.randint(10, x - 5)
            ans = x - y
            b.add(make_q(f"Calculate {x} - {y}: (P2)", str(ans), near(ans),
                         f"{x} - {y} = {ans}.", f"Subtract the ones first, then subtract the tens.",
                         "Subtraction", "Apply", "Medium"), rng)
        for _ in range(20):
            x = rng.choice([2, 3, 4, 5, 10])
            y = rng.randint(2, 10)
            ans = x * y
            b.add(make_q(f"What is {x} × {y}? (P2)", str(ans), near(ans),
                         f"{x} multiplied by {y} is {ans}.", f"Think of {y} groups of {x}.",
                         "Multiplication", "Apply", "Medium"), rng)
        p2_facts = [
            ("What is half (1/2) of 20? (P2)", "10", ["5", "15", "8"], "Half of 20 means dividing 20 by 2 = 10.", "Divide 20 into 2 equal parts.", "Fractions", "Understand", "Easy"),
            ("What is half (1/2) of 14? (P2)", "7", ["6", "8", "12"], "14 divided by 2 = 7.", "What number added to itself equals 14?", "Fractions", "Understand", "Easy"),
            ("How many centimeters (cm) are in 1 meter? (P2)", "100 cm", ["10 cm", "50 cm", "1000 cm"], "There are 100 centimeters in one meter.", "The prefix 'centi' means one-hundredth.", "Measurement", "Remember", "Easy"),
            ("What is 15 divided by 3? (P2)", "5", ["3", "4", "6"], "15 ÷ 3 = 5 because 5 × 3 = 15.", "How many 3s make 15?", "Division", "Apply", "Easy"),
            ("How many hours are in one complete day? (P2)", "24 hours", ["12 hours", "18 hours", "30 hours"], "One full day consists of 24 hours.", "12 hours of day + 12 hours of night.", "Time", "Remember", "Easy"),
            ("Which 3D shape looks like a can of soft drink? (P2)", "Cylinder", ["Cube", "Cone", "Sphere"], "A cylinder has circular flat ends and curved sides.", "Notice the two round flat circular faces.", "Geometry", "Understand", "Easy"),
            ("How many minutes are in one hour? (P2)", "60 minutes", ["30 minutes", "100 minutes", "45 minutes"], "There are 60 minutes in an hour.", "The minute hand completes a full 60-minute loop.", "Time", "Remember", "Easy"),
            ("If Mary buys 3 pencils at ₦20 each, how much does she pay in total? (P2)", "₦60", ["₦50", "₦70", "₦40"], "3 × ₦20 = ₦60.", "Multiply 3 by 20.", "Money", "Apply", "Medium"),
            ("Which number is an EVEN number? (P2)", "18", ["15", "21", "27"], "Even numbers end in 0, 2, 4, 6, or 8.", "Check the last digit for divisibility by 2.", "Number Sense", "Understand", "Easy"),
            ("Which number is an ODD number? (P2)", "23", ["14", "20", "28"], "Odd numbers end in 1, 3, 5, 7, or 9.", "Check if it can be split evenly into pairs.", "Number Sense", "Understand", "Easy"),
            ("What is one quarter (1/4) of 16? (P2)", "4", ["2", "8", "6"], "16 divided by 4 = 4.", "Divide 16 into 4 equal shares.", "Fractions", "Apply", "Medium")
        ]
        for f in p2_facts:
            b.add(make_q(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]), rng)

    elif grade == 3:
        # P3 Times tables 6-12, division with remainders, fractions, perimeter, time
        for _ in range(25):
            x = rng.randint(6, 12)
            y = rng.randint(3, 12)
            ans = x * y
            b.add(make_q(f"Evaluate: {x} × {y} (P3)", str(ans), near(ans),
                         f"{x} × {y} = {ans}.", f"Use times tables or repeated addition of {x}.",
                         "Multiplication", "Apply", "Medium"), rng)
        for _ in range(20):
            d = rng.randint(3, 9)
            q = rng.randint(4, 12)
            r = rng.randint(1, d - 1)
            total = d * q + r
            ans = f"{q} remainder {r}"
            dists = [f"{q+1} remainder {r}", f"{q} remainder {r+1}", f"{q-1} remainder {r}"]
            b.add(make_q(f"Divide {total} by {d}: (P3)", ans, dists,
                         f"{total} = ({d} × {q}) + {r}, so {total} ÷ {d} = {q} R {r}.",
                         f"Find how many times {d} goes into {total} without exceeding.",
                         "Division", "Apply", "Medium"), rng)
        for _ in range(20):
            L = rng.randint(5, 15)
            W = rng.randint(2, L - 1)
            perim = 2 * (L + W)
            b.add(make_q(f"Find the perimeter of a rectangle with length {L} cm and width {W} cm: (P3)",
                         f"{perim} cm", [f"{perim+2} cm", f"{perim-4} cm", f"{L*W} cm"],
                         f"Perimeter = 2 × (Length + Width) = 2 × ({L} + {W}) = {perim} cm.",
                         "Add all four outer sides together: L + W + L + W.",
                         "Perimeter & Area", "Apply", "Medium"), rng)
        p3_facts = [
            ("Which fraction is equivalent to 1/2? (P3)", "2/4", ["1/3", "2/5", "3/8"], "Multiplying numerator and denominator by 2 gives 2/4.", "Multiply both top and bottom by 2.", "Fractions", "Understand", "Medium"),
            ("How many grams (g) make 1 kilogram (kg)? (P3)", "1,000 g", ["100 g", "500 g", "10,000 g"], "1 kilogram = 1,000 grams.", "The prefix 'kilo' means 1,000.", "Measurement", "Remember", "Easy"),
            ("What is the place value of 7 in 3,745? (P3)", "Hundreds", ["Tens", "Thousands", "Units"], "In 3,745, 7 is in the hundreds position (700).", "From right to left: Units, Tens, Hundreds, Thousands.", "Number Sense", "Understand", "Easy"),
            ("How many seconds are in 3 minutes? (P3)", "180 seconds", ["120 seconds", "240 seconds", "300 seconds"], "3 × 60 seconds = 180 seconds.", "Multiply 3 minutes by 60 seconds.", "Time", "Apply", "Medium"),
            ("What fraction of a day is 6 hours? (P3)", "1/4", ["1/2", "1/3", "1/6"], "6 hours out of 24 hours = 6/24 = 1/4.", "Divide 6 by 24 and simplify.", "Fractions", "Understand", "Medium"),
            ("If a square has side length 6 cm, what is its perimeter? (P3)", "24 cm", ["36 cm", "18 cm", "12 cm"], "Perimeter of square = 4 × side = 4 × 6 = 24 cm.", "Add the 4 equal sides: 6 + 6 + 6 + 6.", "Perimeter & Area", "Apply", "Medium"),
            ("How many milliliters (ml) are in 1 liter (l)? (P3)", "1,000 ml", ["100 ml", "500 ml", "10,000 ml"], "1 liter equals 1,000 milliliters.", "The prefix 'milli' means one-thousandth.", "Measurement", "Remember", "Easy"),
            ("A baker made 48 pies and packed them into boxes of 6. How many boxes did he fill? (P3)", "8 boxes", ["6 boxes", "7 boxes", "9 boxes"], "48 ÷ 6 = 8 boxes.", "Divide total pies by pies per box.", "Word Problems", "Apply", "Medium"),
            ("Which symbol correctly compares: 3/5 ____ 2/5? (P3)", ">", ["<", "=", "≤"], "3/5 is greater than 2/5 because 3 > 2.", "Since denominators are equal, compare numerators.", "Fractions", "Understand", "Easy")
        ]
        for f in p3_facts:
            b.add(make_q(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]), rng)

    elif grade == 4:
        for _ in range(25):
            L = rng.randint(4, 12)
            W = rng.randint(3, 10)
            area = L * W
            b.add(make_q(f"Find the area of a rectangle with length {L} cm and width {W} cm: (P4)",
                         f"{area} cm²", [f"{area+4} cm²", f"{2*(L+W)} cm²", f"{area-3} cm²"],
                         f"Area = Length × Width = {L} × {W} = {area} cm².",
                         "Multiply length by width.", "Perimeter & Area", "Apply", "Medium"), rng)
        for _ in range(20):
            x = rng.randint(15, 60)
            y = rng.randint(4, 12)
            ans = x * y
            b.add(make_q(f"Calculate the product of {x} and {y}: (P4)", str(ans), near(ans),
                         f"{x} × {y} = {ans}.", f"Multiply {x} by {y} using long multiplication.",
                         "Multiplication", "Apply", "Medium"), rng)
        p4_facts = [
            ("What is the Roman numeral for 50? (P4)", "L", ["X", "C", "D"], "In Roman numerals: L = 50, C = 100, D = 500.", "L stands for 50.", "Roman Numerals", "Remember", "Easy"),
            ("What is the Roman numeral for 100? (P4)", "C", ["L", "M", "X"], "C represents 100 (from Latin centum).", "Think of century (100 years).", "Roman Numerals", "Remember", "Easy"),
            ("Convert the Roman numeral XXIV to an Arabic number: (P4)", "24", ["19", "26", "29"], "XX = 20, IV = 4; 20 + 4 = 24.", "XX is 20 and IV is 4.", "Roman Numerals", "Understand", "Medium"),
            ("An angle that measures exactly 90 degrees is called a ____ angle. (P4)", "Right", ["Acute", "Obtuse", "Reflex"], "A 90° angle forms a square corner called a right angle.", "Think of a perpendicular L-shape.", "Geometry", "Remember", "Easy"),
            ("An angle smaller than 90 degrees is called an ____ angle. (P4)", "Acute", ["Obtuse", "Right", "Reflex"], "Acute angles measure between 0° and 90°.", "Think 'a-cute' (small) angle.", "Geometry", "Remember", "Easy"),
            ("An angle greater than 90 degrees but less than 180 degrees is an ____ angle. (P4)", "Obtuse", ["Acute", "Straight", "Right"], "Obtuse angles are between 90° and 180°.", "Wider than a square right angle.", "Geometry", "Remember", "Easy"),
            ("Simplify the fraction: 12/16 (P4)", "3/4", ["2/3", "4/5", "1/2"], "Divide numerator and denominator by their GCD (4): 12÷4 / 16÷4 = 3/4.", "Divide both numbers by 4.", "Fractions", "Apply", "Medium"),
            ("Add the decimals: 0.4 + 0.35 = (P4)", "0.75", ["0.39", "0.79", "0.70"], "0.40 + 0.35 = 0.75.", "Line up the decimal points and add.", "Decimals", "Apply", "Medium"),
            ("Convert 3/4 to a decimal: (P4)", "0.75", ["0.34", "0.50", "0.80"], "3 ÷ 4 = 0.75.", "Divide 3 by 4.", "Fractions & Decimals", "Understand", "Medium"),
            ("Find the LCM (Lowest Common Multiple) of 4 and 6: (P4)", "12", ["24", "6", "8"], "Multiples of 4: 4, 8, 12; multiples of 6: 6, 12. Smallest common is 12.", "List the multiples of both numbers.", "Factors & Multiples", "Apply", "Medium"),
            ("Find the HCF (Highest Common Factor) of 12 and 18: (P4)", "6", ["3", "2", "9"], "Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. Highest common factor is 6.", "Find the largest number that divides both evenly.", "Factors & Multiples", "Apply", "Medium"),
            ("What is the area of a square with side length 8 cm? (P4)", "64 cm²", ["32 cm²", "16 cm²", "48 cm²"], "Area of square = side² = 8 × 8 = 64 cm².", "Multiply the side by itself.", "Perimeter & Area", "Apply", "Medium"),
            ("If 1 book costs ₦450, what is the cost of 4 books? (P4)", "₦1,800", ["₦1,600", "₦1,950", "₦1,500"], "4 × ₦450 = ₦1,800.", "Multiply 450 by 4.", "Money", "Apply", "Medium")
        ]
        for f in p4_facts:
            b.add(make_q(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]), rng)

    elif grade == 5:
        for _ in range(25):
            pct = rng.choice([10, 20, 25, 50, 75])
            val = rng.choice([40, 60, 80, 100, 120, 200, 400])
            ans = int((pct / 100) * val)
            b.add(make_q(f"Find {pct}% of {val}: (P5)", str(ans), near(ans),
                         f"{pct}% of {val} = ({pct}/100) × {val} = {ans}.",
                         f"Convert {pct}% to fraction ({pct}/100) and multiply by {val}.",
                         "Percentages", "Apply", "Medium"), rng)
        for _ in range(20):
            L = rng.randint(4, 10)
            W = rng.randint(3, 8)
            H = rng.randint(2, 6)
            vol = L * W * H
            b.add(make_q(f"Find the volume of a cuboid with length {L} cm, width {W} cm, and height {H} cm: (P5)",
                         f"{vol} cm³", [f"{vol+10} cm³", f"{vol-8} cm³", f"{2*(L*W + W*H + L*H)} cm³"],
                         f"Volume = L × W × H = {L} × {W} × {H} = {vol} cm³.",
                         "Multiply length by width by height.", "Volume & Capacity", "Apply", "Medium"), rng)
        p5_facts = [
            ("Which of these numbers is a PRIME number? (P5)", "17", ["15", "21", "27"], "17 has only two factors: 1 and 17 itself.", "A prime number is only divisible by 1 and itself.", "Number Sense", "Understand", "Medium"),
            ("What is the sum of angles inside any triangle? (P5)", "180 degrees", ["90 degrees", "270 degrees", "360 degrees"], "The interior angles of any triangle always add up to 180°.", "Think: half of a rectangle's 360°.", "Geometry", "Remember", "Easy"),
            ("A triangle with all three sides equal in length is called an ____ triangle. (P5)", "Equilateral", ["Isosceles", "Scalene", "Right-angled"], "An equilateral triangle has 3 equal sides and three 60° angles.", "Prefix 'equi' means equal.", "Geometry", "Remember", "Easy"),
            ("A triangle with two equal sides is called an ____ triangle. (P5)", "Isosceles", ["Equilateral", "Scalene", "Obtuse"], "An isosceles triangle has 2 equal sides and 2 equal base angles.", "Look for two matching side lengths.", "Geometry", "Remember", "Easy"),
            ("Angles on a straight line add up to ____ degrees. (P5)", "180°", ["90°", "270°", "360°"], "Angles forming a straight line sum to 180°.", "A straight line is a half-turn (180°).", "Geometry", "Remember", "Easy"),
            ("Share ₦1,500 between Ada and Obi in the ratio 2:3. What is Obi's share? (P5)", "₦900", ["₦600", "₦750", "₦800"], "Total parts = 2 + 3 = 5. Obi's share = (3/5) × ₦1,500 = ₦900.", "Calculate Obi's 3 parts out of 5 total parts.", "Ratio & Proportion", "Apply", "Hard"),
            ("What is the Roman numeral for 1,000? (P5)", "M", ["D", "C", "L"], "In Roman numerals, M = 1,000 (from mille).", "Think of millennium (1,000 years).", "Roman Numerals", "Remember", "Easy"),
            ("Find the area of a triangle with base 10 cm and height 6 cm: (P5)", "30 cm²", ["60 cm²", "16 cm²", "20 cm²"], "Area = 1/2 × base × height = 1/2 × 10 × 6 = 30 cm².", "Take half of base multiplied by height.", "Perimeter & Area", "Apply", "Medium"),
            ("Express 0.65 as a percentage: (P5)", "65%", ["6.5%", "650%", "0.65%"], "0.65 × 100% = 65%.", "Multiply by 100 and add % symbol.", "Percentages", "Understand", "Easy"),
            ("Find the average (mean) of 4, 8, and 12: (P5)", "8", ["6", "10", "24"], "Sum = 4 + 8 + 12 = 24. Average = 24 ÷ 3 = 8.", "Add the values and divide by the count of numbers (3).", "Statistics", "Apply", "Medium")
        ]
        for f in p5_facts:
            b.add(make_q(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]), rng)

    elif grade == 6:
        for _ in range(25):
            a = rng.randint(2, 6)
            x_ans = rng.randint(3, 10)
            c = rng.randint(1, 15)
            rhs = a * x_ans + c
            b.add(make_q(f"Solve for x: {a}x + {c} = {rhs} (P6)", str(x_ans), near(x_ans),
                         f"{a}x = {rhs} - {c} = {rhs - c}, so x = {rhs - c} ÷ {a} = {x_ans}.",
                         f"Subtract {c} from {rhs}, then divide by {a}.",
                         "Algebra", "Apply", "Hard"), rng)
        for _ in range(20):
            speed = rng.choice([40, 50, 60, 70, 80])
            time = rng.choice([2, 3, 4, 5])
            dist = speed * time
            b.add(make_q(f"A car travels at {speed} km/h for {time} hours. What distance does it cover? (P6)",
                         f"{dist} km", [f"{dist+20} km", f"{dist-30} km", f"{speed+time} km"],
                         f"Distance = Speed × Time = {speed} × {time} = {dist} km.",
                         "Multiply speed by time.", "Speed, Distance & Time", "Apply", "Medium"), rng)
        p6_facts = [
            ("Calculate the circumference of a circle with radius 7 cm (Use π = 22/7): (P6)", "44 cm", ["22 cm", "88 cm", "154 cm"], "Circumference = 2 × π × r = 2 × (22/7) × 7 = 44 cm.", "Use formula C = 2 × π × r.", "Circle Geometry", "Apply", "Hard"),
            ("Calculate the area of a circle with radius 7 cm (Use π = 22/7): (P6)", "154 cm²", ["44 cm²", "308 cm²", "77 cm²"], "Area = π × r² = (22/7) × 7 × 7 = 154 cm².", "Use formula Area = π × r².", "Circle Geometry", "Apply", "Hard"),
            ("Calculate the simple interest on ₦10,000 at 5% per annum for 3 years: (P6)", "₦1,500", ["₦500", "₦1,000", "₦2,000"], "Interest = (P × R × T) / 100 = (10000 × 5 × 3) / 100 = ₦1,500.", "Use formula I = (P × R × T) / 100.", "Commercial Arithmetic", "Apply", "Hard"),
            ("Find the median of the data set: 3, 5, 7, 9, 11 (P6)", "7", ["5", "9", "35"], "The median is the middle value in an ordered set: 7.", "Identify the middle number in order.", "Statistics", "Understand", "Medium"),
            ("What is the mode of this set of numbers: 4, 6, 4, 8, 4, 9, 7? (P6)", "4", ["6", "8", "7"], "The mode is the most frequently occurring value: 4 appears 3 times.", "Find the number that appears most often.", "Statistics", "Understand", "Easy"),
            ("If a standard fair six-sided die is rolled, what is the probability of rolling a 4? (P6)", "1/6", ["1/4", "1/2", "4/6"], "There is 1 favorable outcome out of 6 possible outcomes = 1/6.", "One specific face out of 6 total faces.", "Probability", "Understand", "Medium"),
            ("A trader bought a bag for ₦4,000 and sold it for ₦5,000. What is his percentage profit? (P6)", "25%", ["20%", "15%", "30%"], "Profit = ₦1,000. Percentage profit = (1000 / 4000) × 100% = 25%.", "Profit over Cost Price multiplied by 100%.", "Commercial Arithmetic", "Apply", "Hard"),
            ("What is the value of 5³ (5 cubed)? (P6)", "125", ["15", "75", "25"], "5³ = 5 × 5 × 5 = 125.", "Multiply 5 by itself three times.", "Exponents & Powers", "Apply", "Medium"),
            ("The sum of angles in any four-sided polygon (quadrilateral) is ____ degrees. (P6)", "360°", ["180°", "270°", "540°"], "All quadrilaterals have interior angle sum equal to 360°.", "Divide it into 2 triangles: 2 × 180° = 360°.", "Geometry", "Remember", "Medium"),
            ("Express 3/8 as a percentage: (P6)", "37.5%", ["38%", "35%", "32.5%"], "3/8 = 0.375 = 37.5%.", "Divide 3 by 8 and multiply by 100%.", "Percentages", "Apply", "Medium")
        ]
        for f in p6_facts:
            b.add(make_q(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]), rng)

    counter = 1
    while len(b.items) < 100:
        a = counter * 3 + 7 + grade * 10
        c = counter * 2 + 5 + grade * 5
        ans = a + c
        b.add(make_q(f"Arithmetic problem #{counter} (P{grade}): Calculate the exact sum of {a} and {c}:",
                     str(ans), near(ans), f"{a} + {c} = {ans}.", "Add the numbers carefully.",
                     "Arithmetic Operations", "Apply", "Medium"), rng)
        counter += 1

    return b.items[:100]
