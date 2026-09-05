import random
from .base import make_q, Bank, near, pick_others

def gen_quant(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    if grade == 1:
        # P1 Pattern sequences and missing number
        for step in [1, 2, 3, 5, 10]:
            for start in range(1, 25):
                seq = [start + i * step for i in range(4)]
                ans = start + 4 * step
                b.add(make_q(f"Find the next number in sequence: {seq[0]}, {seq[1]}, {seq[2]}, {seq[3]}, ____ (P1)",
                             str(ans), near(ans),
                             f"The pattern adds {step} each time: {seq[3]} + {step} = {ans}.",
                             f"Notice how much is added between each consecutive number (+{step}).",
                             "Number Sequences", "Apply", "Easy"), rng)
        for a in range(1, 20):
            for ans in range(1, 20):
                total = a + ans
                b.add(make_q(f"Fill in the missing box: {a} + [ ? ] = {total} (P1)",
                             str(ans), near(ans),
                             f"{total} - {a} = {ans}, so the missing number is {ans}.",
                             f"Subtract {a} from {total}.",
                             "Missing Operations", "Apply", "Easy"), rng)
    elif grade == 2:
        # P2 Skip counting, doubling, missing subtrahend
        for step in [2, 3, 4, 5, 10]:
            for start in range(2, 30):
                seq = [start + i * step for i in range(4)]
                ans = start + 4 * step
                b.add(make_q(f"Complete the pattern: {seq[0]}, {seq[1]}, {seq[2]}, {seq[3]}, ____ (P2)",
                             str(ans), near(ans),
                             f"Pattern increases by {step}: {seq[3]} + {step} = {ans}.",
                             f"Look at the constant difference (+{step}).",
                             "Number Sequences", "Apply", "Medium"), rng)
        for n in range(2, 40):
            ans = n * 2
            b.add(make_q(f"If double of 4 is 8, what is double of {n}? (P2)",
                         str(ans), near(ans),
                         f"Doubling means multiplying by 2: {n} × 2 = {ans}.",
                         f"Multiply {n} by 2.",
                         "Doubling & Halving", "Apply", "Easy"), rng)
        for total in range(20, 60):
            for sub in range(2, 18):
                ans = total - sub
                b.add(make_q(f"Find the missing number in: {total} - [ ? ] = {ans} (P2)",
                             str(sub), near(sub),
                             f"{total} - {ans} = {sub}.",
                             f"Subtract the result from {total}.",
                             "Missing Operations", "Apply", "Medium"), rng)
    elif grade == 3:
        # P3 Multi-step rules, magic squares, triangular relationships
        for a in range(2, 12):
            for b_val in range(2, 12):
                ans = a * b_val + 2
                b.add(make_q(f"If [A ★ B] = (A × B) + 2, calculate: [ {a} ★ {b_val} ] (P3)",
                             str(ans), near(ans),
                             f"Apply rule: ({a} × {b_val}) + 2 = {a*b_val} + 2 = {ans}.",
                             f"Multiply the two numbers then add 2.",
                             "Symbolic Logic", "Apply", "Medium"), rng)
        for start in range(5, 50):
            seq = [start, start + 3, start + 7, start + 12]
            ans = start + 18
            b.add(make_q(f"Find the next term in the growing series starting at {start}: {seq[0]}, {seq[1]}, {seq[2]}, {seq[3]}, ____ (P3)",
                         str(ans), near(ans),
                         f"The difference grows: +3, +4, +5, so next is +6: {seq[3]} + 6 = {ans}.",
                         "Look at how the step size increases each time (+3, +4, +5...).",
                         "Growing Patterns", "Analyze", "Hard"), rng)
    elif grade == 4:
        for x in range(2, 15):
            for y in range(2, 10):
                ans = (x + y) * 2
                b.add(make_q(f"Rule: A ◈ B = 2 × (A + B). Evaluate: {x} ◈ {y} = (P4)",
                             str(ans), near(ans),
                             f"2 × ({x} + {y}) = 2 × {x+y} = {ans}.",
                             f"First add {x} and {y}, then multiply by 2.",
                             "Symbolic Logic", "Apply", "Medium"), rng)
        for a in range(3, 15):
            for b_val in range(2, 8):
                ans = (a * b_val) - 3
                b.add(make_q(f"If P ⧫ Q = (P × Q) - 3, calculate the value of {a} ⧫ {b_val}: (P4)",
                             str(ans), near(ans),
                             f"({a} × {b_val}) - 3 = {a*b_val} - 3 = {ans}.",
                             "Multiply first, then subtract 3.",
                             "Symbolic Logic", "Apply", "Medium"), rng)
    elif grade == 5:
        for p in range(2, 12):
            for q in range(2, 12):
                ans = (p * 3) + (q * 2)
                b.add(make_q(f"Given that X ⊛ Y = 3X + 2Y, calculate: {p} ⊛ {q} = (P5)",
                             str(ans), near(ans),
                             f"3({p}) + 2({q}) = {3*p} + {2*q} = {ans}.",
                             f"Multiply {p} by 3 and {q} by 2, then sum.",
                             "Algebraic Patterns", "Apply", "Hard"), rng)
        for a in range(2, 15):
            ans = a * a + a
            b.add(make_q(f"If 2 ⇒ 6, 3 ⇒ 12, 4 ⇒ 20, what is the output for {a} ⇒ ____? (P5)",
                         str(ans), near(ans),
                         f"Rule: n × (n + 1). For {a}: {a} × {a+1} = {ans}.",
                         f"Multiply {a} by the number that comes after it ({a+1}).",
                         "Pattern Discovery", "Analyze", "Hard"), rng)
    else:
        for m in range(3, 12):
            for n in range(2, 10):
                ans = (m * m) - (n * n) if m > n else (m * m) + (n * n)
                sym = "⊖" if m > n else "⊕"
                b.add(make_q(f"If A {sym} B = A² {'-' if m > n else '+'} B², evaluate {m} {sym} {n}: (P6)",
                             str(ans), near(ans),
                             f"{m}² {'-' if m > n else '+'} {n}² = {m*m} {'-' if m > n else '+'} {n*n} = {ans}.",
                             f"Square both numbers then {'subtract' if m > n else 'add'}.",
                             "Higher Order Reasoning", "Apply", "Hard"), rng)
        for x in range(2, 20):
            ans = (x * 4) + 10
            b.add(make_q(f"In a number machine, input N outputs (4N + 10). What is output for N = {x}? (P6)",
                         str(ans), near(ans),
                         f"4({x}) + 10 = {4*x} + 10 = {ans}.",
                         f"Multiply {x} by 4, then add 10.",
                         "Function Machines", "Apply", "Hard"), rng)

    counter = 1
    while len(b.items) < 100:
        x = counter + 1
        k = (counter % 7) + 2
        ans = x * k + counter
        b.add(make_q(f"Find the value of [ {x} ⨀ {k} ] case #{counter} if A ⨀ B = (A × B) + {counter} (P{grade}):",
                     str(ans), near(ans), f"({x} × {k}) + {counter} = {ans}.", "Multiply and add.",
                     "Symbolic Logic", "Apply", "Medium"), rng)
        counter += 1

    return b.items[:100]
