#!/usr/bin/env python3
"""Generate 100 unique MCQs per subject per Primary 1–6 class."""
from __future__ import annotations

import json
import math
import random
import re
from collections import defaultdict
from itertools import combinations
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
N = 100
GRADES = (1, 2, 3, 4, 5, 6)

SUBJECTS = [
    "english", "maths", "science", "social", "civic", "computer",
    "agric", "cca", "phe", "verbal", "quantitative", "history",
    "home", "security", "crs", "irs",
]


def gcd(a, b):
    while b:
        a, b = b, a % b
    return abs(a)


def lcm(a, b):
    return abs(a * b) // gcd(a, b) if a and b else 0


def near(n, extra=None):
    vals = [n + 1, n - 1, n + 2, n - 2, n + 5, n - 5, n + 10, abs(n * 2), abs(n - 10), n + 3]
    if extra:
        vals.extend(extra)
    out = []
    for v in vals:
        if v != n and v not in out:
            out.append(v)
    return [str(v) for v in out]


def make_q(question, correct, distractors, explain):
    correct = str(correct)
    opts = []
    for item in [correct, *distractors]:
        s = str(item)
        if s not in opts:
            opts.append(s)
        if len(opts) == 4:
            break
    if len(opts) < 4 or correct not in opts:
        return None
    return {"q": question, "options": opts, "answer": opts.index(correct), "explain": explain}


class Bank:
    def __init__(self):
        self.items = []
        self.seen = set()

    def add(self, q):
        if not q:
            return
        if len(q["options"]) != 4 or len(set(map(str, q["options"]))) != 4:
            return
        if q["answer"] not in range(4):
            return
        stem = re.sub(r"\s+", " ", q["q"]).strip().lower()
        opts = "|".join(sorted(str(o).lower() for o in q["options"]))
        key = stem + " :: " + opts
        if key in self.seen:
            return
        self.seen.add(key)
        self.items.append(q)

    def extend(self, qs):
        for q in qs:
            self.add(q)


def shuffle_q(q, rng):
    if not q:
        return None
    correct = q["options"][q["answer"]]
    opts = q["options"][:]
    rng.shuffle(opts)
    return {**q, "options": opts, "answer": opts.index(correct)}


def round_robin(pools, rng, n=N):
    keys = [k for k, v in pools.items() if v]
    for k in keys:
        rng.shuffle(pools[k])
    b = Bank()
    idx = defaultdict(int)
    while len(b.items) < n:
        progressed = False
        for k in keys:
            pool = pools[k]
            i = idx[k]
            while i < len(pool) and len(b.items) < n:
                before = len(b.items)
                b.add(shuffle_q(pool[i], rng))
                i += 1
                idx[k] = i
                if len(b.items) > before:
                    progressed = True
                    break
        if not progressed:
            break
    return b.items[:n]


def pick_others(pool, keep, k=3, rng=None):
    rest = [x for x in pool if x != keep]
    rng.shuffle(rest)
    return rest[:k]


# ---------------------------------------------------------------------------
# Mathematics
# ---------------------------------------------------------------------------
def gen_maths(grade, rng):
    pools = defaultdict(list)

    def add(pool, *a):
        pools[pool].append(make_q(*a))

    if grade <= 2:
        lo, hi = (0, 12) if grade == 1 else (0, 30)
        for a in range(lo, hi + 1):
            for b in range(lo, hi + 1):
                s = a + b
                if grade == 1 and s > 20:
                    continue
                if grade == 2 and s > 60:
                    continue
                add("add", f"What is {a} + {b}?", s, near(s), f"{a} + {b} = {s}.")
                if a >= b:
                    d = a - b
                    add("sub", f"What is {a} − {b}?", d, near(d), f"{a} − {b} = {d}.")
        for n in range(1, 21 if grade == 1 else 51):
            add("seq", f"What number comes after {n}?", n + 1, near(n + 1), f"After {n} comes {n + 1}.")
            add("seq", f"What number comes before {n + 1}?", n, near(n), f"Before {n + 1} is {n}.")
            add("cmp", f"Which is greater: {n} or {n + 3}?", n + 3, [n, n + 1, n - 1 if n else 0], f"{n + 3} is greater than {n}.")
        for n in (2, 4, 6, 8, 10, 12):
            add("half", f"Half of {n} is ____.", n // 2, near(n // 2), f"Half of {n} is {n // 2}.")
            add("dbl", f"Double {n // 2} is ____.", n, near(n), f"Double {n // 2} is {n}.")
        shapes = [
            ("triangle", "3", ["4", "5", "2"], "A triangle has 3 sides."),
            ("square", "4", ["3", "5", "6"], "A square has 4 equal sides."),
            ("rectangle", "4", ["3", "5", "8"], "A rectangle has 4 sides."),
            ("circle", "0", ["3", "4", "1"], "A circle has no straight sides."),
        ]
        for name, ans, d, exp in shapes:
            add("shape", f"How many straight sides does a {name} have?", ans, d, exp)
        add("time", "How many days are in one week?", 7, ["5", "6", "10"], "A week has 7 days.")
        add("time", "How many months are in a year?", 12, ["10", "11", "24"], "A year has 12 months.")
        if grade == 2:
            for a in range(2, 6):
                for b in range(2, 11):
                    p = a * b
                    add("mul", f"What is {a} × {b}?", p, near(p, [a + b, a * (b + 1)]), f"{a} groups of {b} make {p}.")
            add("money", "How many kobo make 1 naira?", 100, ["10", "50", "1000"], "100 kobo = ₦1.")
            for n in range(10, 90):
                tens, ones = divmod(n, 10)
                add("pv", f"In {n}, the tens digit is ____.", tens, [ones, tens + 1, ones + 1], f"{n} is {tens} tens and {ones} ones.")
            for n in range(2, 31):
                add("even", f"Is {n} even or odd?", "even" if n % 2 == 0 else "odd",
                    ["prime", "even" if n % 2 else "odd", "zero", "ten"],
                    f"{n} is {'even' if n % 2 == 0 else 'odd'}.")

    if grade == 3:
        for a in range(2, 13):
            for b in range(2, 13):
                p = a * b
                add("mul", f"What is {a} × {b}?", p, near(p, [a + b]), f"{a} × {b} = {p}.")
                add("div", f"What is {p} ÷ {a}?", b, near(b), f"{p} ÷ {a} = {b}.")
        for n in (8, 12, 16, 20, 24, 30, 36, 40):
            add("frac", f"½ of {n} is ____.", n // 2, near(n // 2), f"Half of {n} is {n // 2}.")
            if n % 4 == 0:
                add("frac", f"¼ of {n} is ____.", n // 4, near(n // 4), f"One quarter of {n} is {n // 4}.")
            if n % 4 == 0:
                add("frac", f"¾ of {n} is ____.", 3 * n // 4, near(3 * n // 4), f"Three quarters of {n} is {3 * n // 4}.")
        for s in range(2, 16):
            add("peri", f"A square has sides of {s} cm. Perimeter = ____ cm.", 4 * s, near(4 * s, [s * s, 2 * s]),
                f"Perimeter = 4 × {s} = {4 * s} cm.")
        for n in range(10, 100):
            tens = 10 * ((n + 5) // 10)
            if tens == 100:
                tens = 100
            add("round", f"Round {n} to the nearest ten.", tens, near(tens, [n, n + 1]), f"{n} rounds to {tens}.")
        roman = [("I", 1), ("V", 5), ("X", 10), ("L", 50), ("C", 100), ("II", 2), ("III", 3), ("IV", 4), ("VI", 6), ("IX", 9), ("XX", 20)]
        for r, v in roman:
            add("roman", f"Roman numeral {r} stands for ____.", v, near(v), f"{r} = {v}.")
        add("time", "How many minutes are in 1 hour?", 60, ["30", "100", "24"], "1 hour = 60 minutes.")
        add("time", "How many hours are in 1 day?", 24, ["12", "60", "30"], "1 day = 24 hours.")

    if grade == 4:
        for a in range(11, 25):
            for b in range(2, 10):
                p = a * b
                add("mul", f"What is {a} × {b}?", p, near(p), f"{a} × {b} = {p}.")
        for a in range(2, 13):
            for b in range(a, 13):
                add("lcm", f"The LCM of {a} and {b} is ____.", lcm(a, b), near(lcm(a, b), [gcd(a, b), a * b]),
                    f"LCM of {a} and {b} is {lcm(a, b)}.")
                add("hcf", f"The HCF of {a} and {b} is ____.", gcd(a, b), near(gcd(a, b), [lcm(a, b), 1]),
                    f"HCF of {a} and {b} is {gcd(a, b)}.")
        for l in range(3, 12):
            for w in range(2, l):
                add("area", f"Area of a {l} cm by {w} cm rectangle is ____ cm².", l * w, near(l * w, [2 * (l + w)]),
                    f"Area = {l} × {w} = {l * w} cm².")
                add("peri", f"Perimeter of a {l} cm by {w} cm rectangle is ____ cm.", 2 * (l + w), near(2 * (l + w), [l * w]),
                    f"Perimeter = 2({l}+{w}) = {2 * (l + w)} cm.")
        for n in range(1, 21):
            add("sq", f"{n}² = ____.", n * n, near(n * n, [2 * n, n + 2]), f"{n}² = {n} × {n} = {n * n}.")
        add("unit", "1 kilometre = ____ metres.", 1000, ["100", "10", "10000"], "1 km = 1000 m.")
        add("unit", "1 metre = ____ centimetres.", 100, ["10", "1000", "50"], "1 m = 100 cm.")
        add("ang", "A right angle measures ____ degrees.", 90, ["45", "180", "360"], "A right angle is 90°.")
        add("ang", "A straight angle measures ____ degrees.", 180, ["90", "360", "45"], "A straight angle is 180°.")
        for p in range(5, 30, 5):
            add("pct", f"{p}% of 100 is ____.", p, near(p), f"Percent means out of 100.")
        for a, b in [(1, 2), (1, 4), (3, 4), (1, 5), (2, 5), (1, 10)]:
            dec = a / b
            ds = f"{dec:.2f}".rstrip("0").rstrip(".") if dec != int(dec) else str(int(dec))
            add("dec", f"{a}/{b} as a decimal is ____.", ds, ["0.2", "0.3", "0.8", "1.5", "0.25", "0.75"],
                f"{a}/{b} = {ds}.")

    if grade == 5:
        for tot in (20, 40, 50, 80, 100, 200):
            for p in (10, 20, 25, 50):
                add("pct", f"{p}% of {tot} is ____.", tot * p // 100, near(tot * p // 100),
                    f"{p}% of {tot} = {tot * p // 100}.")
        for nums in ((2, 4, 6), (3, 6, 9), (4, 6, 8), (5, 10, 15), (10, 20, 30), (1, 2, 3, 4), (2, 4, 6, 8)):
            m = sum(nums) / len(nums)
            if m == int(m):
                add("mean", f"The average of {', '.join(map(str, nums))} is ____.", int(m), near(int(m), [sum(nums)]),
                    f"Mean = sum ÷ count = {int(m)}.")
        for b in range(4, 16, 2):
            for h in range(3, 12, 2):
                ar = b * h // 2 if (b * h) % 2 == 0 else None
                if ar:
                    add("tri", f"Area of a triangle base {b} cm height {h} cm is ____ cm².", ar, near(ar, [b * h]),
                        f"Area = ½ × {b} × {h} = {ar} cm².")
        for s in range(2, 11):
            add("vol", f"Volume of a cube of side {s} cm is ____ cm³.", s ** 3, near(s ** 3, [6 * s, s * s]),
                f"Volume = {s}×{s}×{s} = {s ** 3} cm³.")
        for a, b in [(2, 3), (1, 4), (3, 5), (2, 5), (4, 6), (5, 10), (3, 6)]:
            add("ratio", f"The ratio {a}:{b} in lowest terms is ____.", f"{a // gcd(a, b)}:{b // gcd(a, b)}",
                [f"{a}:{b + 1}", f"{a * 2}:{b}", f"{b}:{a}"], f"Divide both by {gcd(a, b)}.")
        for x in (0.2, 0.3, 0.4, 0.5, 1.5, 2.5):
            for y in (0.2, 0.3, 2, 4):
                p = round(x * y, 2)
                add("dec", f"{x} × {y} = ____.", p, near(p, [x + y]), f"{x} × {y} = {p}.")
        add("ang", "The angles on a straight line add up to ____°.", 180, ["90", "360", "100"], "A straight line is 180°.")
        add("ang", "The angles around a point add up to ____°.", 360, ["180", "90", "100"], "Around a point is 360°.")

    if grade == 6:
        for a in range(2, 9):
            for b in range(2, 9):
                add("bod", f"Simplify: {a} + {b} × 2", a + 2 * b, [2 * (a + b), a * b * 2, a + b + 2],
                    f"Multiply first: {b}×2={2 * b}, then {a}+{2 * b}={a + 2 * b}.")
                add("bod", f"Simplify: ({a} + {b}) × 2", 2 * (a + b), [a + 2 * b, a * b, a + b],
                    f"Brackets first: {a}+{b}={a + b}, ×2 = {2 * (a + b)}.")
        for r in (7, 14):
            add("cir", f"Using π = 22/7, area of a circle radius {r} cm is ____ cm².",
                22 // 7 * r * r if r == 7 else 22 * r,
                near(22 * r if r != 7 else 154, [2 * 22 * r // 7]),
                f"Area = πr² = 22/7 × {r} × {r}.")
        add("cir", "Using π = 22/7, area of a circle radius 7 cm is ____ cm².", 154, ["44", "22", "49"],
            "22/7 × 7 × 7 = 154.")
        add("cir", "Using π = 22/7, circumference of a circle radius 7 cm is ____ cm.", 44, ["22", "154", "14"],
            "C = 2πr = 2 × 22/7 × 7 = 44.")
        for a in range(2, 8):
            add("idx", f"{a}³ = ____.", a ** 3, near(a ** 3, [a * a, 3 * a]), f"{a}³ = {a}×{a}×{a} = {a ** 3}.")
            add("idx", f"{a}² = ____.", a ** 2, near(a ** 2), f"{a}² = {a * a}.")
        for a, b, c in [(2, 3, 4), (3, 4, 5), (5, 2, 6), (1, 7, 3), (4, 1, 8)]:
            add("alg", f"If a = {a} and b = {b}, then {c}a + b = ____.", c * a + b, near(c * a + b, [c * (a + b)]),
                f"{c}({a}) + {b} = {c * a + b}.")
        add("prob", "Probability of a head on a fair coin is ____.", "1/2", ["0", "1", "1/6"], "Two equally likely outcomes.")
        add("prob", "Probability of rolling a 6 on a fair die is ____.", "1/6", ["1/2", "1", "6"], "A die has 6 faces.")
        for tot, r1, r2 in [(35, 2, 5), (24, 1, 3), (45, 2, 7), (18, 1, 2), (40, 3, 5)]:
            parts = r1 + r2
            if tot % parts == 0:
                one = tot // parts
                add("share", f"Share {tot} in the ratio {r1}:{r2}. The smaller share is ____.",
                    min(r1, r2) * one, near(min(r1, r2) * one, [tot, one]),
                    f"Parts = {parts}. One part = {one}. Smaller = {min(r1, r2) * one}.")
        for a, b in [(3, 5), (1, 4), (2, 5), (3, 4), (1, 2), (4, 5), (1, 8)]:
            add("fp", f"Convert {a}/{b} to a percentage.", f"{a * 100 // b}%", [f"{a}%", f"{b}%", f"{a * 10}%"],
                f"{a}/{b} = {a * 100 // b}%.")
        add("cube", "A cube has ____ faces.", 6, ["4", "8", "12"], "A cube has 6 square faces.")
        add("cube", "A cube has ____ vertices.", 8, ["6", "12", "4"], "A cube has 8 corners (vertices).")
        add("cube", "A cube has ____ edges.", 12, ["6", "8", "4"], "A cube has 12 edges.")
        for a in range(2, 10):
            for b in (2, 4):
                # (a/b) ÷ (1/2) = 2a/b
                num = a * 2
                den = b
                g = gcd(num, den)
                num, den = num // g, den // g
                ans = str(num) if den == 1 else f"{num}/{den}"
                add("fdiv", f"{a}/{b} ÷ 1/2 = ____.", ans, ["1/4", "1/2", f"{a}/{b * 2}"],
                    f"Multiply by the reciprocal: {a}/{b} × 2/1.")

    items = round_robin(pools, rng)
    # pad with extra addition if short
    extra = Bank()
    extra.extend(items)
    k = 2
    while len(extra.items) < N:
        a, b = rng.randint(1, 9 * grade), rng.randint(1, 9 * grade)
        extra.add(shuffle_q(make_q(f"Calculate {a} + {b}.", a + b, near(a + b), f"{a} + {b} = {a + b}."), rng))
        extra.add(shuffle_q(make_q(f"Calculate {a + b} − {a}.", b, near(b), f"{a + b} − {a} = {b}."), rng))
        k += 1
        if k > 500:
            break
    return extra.items[:N]


# ---------------------------------------------------------------------------
# Quantitative reasoning
# ---------------------------------------------------------------------------
def gen_quant(grade, rng):
    pools = defaultdict(list)

    def add(pool, *a):
        pools[pool].append(make_q(*a))

    maxn = {1: 20, 2: 40, 3: 80, 4: 120, 5: 200, 6: 400}[grade]
    for start in range(1, 9):
        for step in range(1, 6 if grade < 4 else 9):
            seq = [start + i * step for i in range(4)]
            nxt = start + 4 * step
            if nxt <= maxn:
                shown = ", ".join(map(str, seq))
                add("arith", f"What comes next? {shown}, ____", nxt, near(nxt, [seq[-1] + 1]),
                    f"The numbers increase by {step}.")
    if grade >= 3:
        for start in (1, 2, 3):
            for r in (2, 3):
                seq = [start * r ** i for i in range(4)]
                nxt = start * r ** 4
                if nxt <= maxn:
                    add("geo", f"What comes next? {', '.join(map(str, seq))}, ____", nxt, near(nxt),
                        f"Each term is multiplied by {r}.")
    if grade >= 5:
        sq = [i * i for i in range(1, 8)]
        add("sq", f"What comes next? {', '.join(map(str, sq[:4]))}, ____", 25, ["20", "24", "30"],
            "These are square numbers: 1, 4, 9, 16, 25.")
        add("sq", "The next square number after 36 is ____.", 49, ["42", "48", "64"], "6²=36, 7²=49.")
    for n in range(3, 15 + grade * 3):
        add("odd", f"Which number is the odd one out: {n}, {n + 2}, {n + 4}, {n + 7}?", n + 7,
            [n, n + 2, n + 4], f"{n}, {n + 2} and {n + 4} go up by 2. {n + 7} does not.")
    for a, b, c in [(2, 3, 5), (4, 5, 9), (6, 7, 13), (10, 2, 12), (8, 1, 9)]:
        add("code", f"If {a} * {b} = {c}, then {a} * {b} means ____.", f"{a} + {b}",
            [f"{a} × {b}", f"{a} − {b}", f"{b} − {a}"], f"{a} + {b} = {c}.")
    for n in range(5, 20):
        add("miss", f"Find the missing number: {n}, ____, {n + 4}, {n + 6}", n + 2, near(n + 2),
            f"The numbers increase by 2.")
    if grade >= 2:
        for a in range(2, 10):
            add("rel", f"If 1 packet holds {a} sweets, 3 packets hold ____ sweets.", 3 * a, near(3 * a),
                f"3 × {a} = {3 * a}.")
    if grade >= 4:
        for a, b in [(2, 6), (3, 12), (4, 20), (5, 30)]:
            add("prop", f"If {a} books cost ₦{b * 50}, 1 book costs ₦____.", (b * 50) // a, near((b * 50) // a),
                f"Unit cost = {b * 50} ÷ {a}.")
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    x = 1
    while len(extra.items) < N:
        s, st = rng.randint(1, 10), rng.randint(1, 5)
        seq = [s + i * st for i in range(4)]
        extra.add(shuffle_q(make_q(
            f"Complete: {', '.join(map(str, seq))}, ____",
            seq[-1] + st, near(seq[-1] + st),
            f"Add {st} each time.",
        ), rng))
        x += 1
        if x > 400:
            break
    return extra.items[:N]


# ---------------------------------------------------------------------------
# English & verbal
# ---------------------------------------------------------------------------
OPPOSITES = [
    ("big", "small"), ("hot", "cold"), ("happy", "sad"), ("up", "down"), ("in", "out"),
    ("day", "night"), ("fast", "slow"), ("old", "new"), ("long", "short"), ("tall", "short"),
    ("open", "close"), ("empty", "full"), ("clean", "dirty"), ("wet", "dry"), ("hard", "soft"),
    ("early", "late"), ("rich", "poor"), ("strong", "weak"), ("thick", "thin"), ("wide", "narrow"),
    ("love", "hate"), ("win", "lose"), ("begin", "end"), ("buy", "sell"), ("come", "go"),
    ("dark", "light"), ("heavy", "light"), ("high", "low"), ("inside", "outside"), ("true", "false"),
    ("yes", "no"), ("first", "last"), ("friend", "enemy"), ("give", "take"), ("loud", "quiet"),
    ("north", "south"), ("east", "west"), ("question", "answer"), ("safe", "dangerous"), ("sick", "well"),
]
SYNONYMS = [
    ("big", "large"), ("small", "tiny"), ("happy", "glad"), ("sad", "unhappy"), ("smart", "clever"),
    ("begin", "start"), ("end", "finish"), ("quick", "fast"), ("silent", "quiet"), ("gift", "present"),
    ("home", "house"), ("pupil", "student"), ("teacher", "tutor"), ("angry", "cross"), ("afraid", "scared"),
    ("pretty", "beautiful"), ("look", "see"), ("talk", "speak"), ("stone", "rock"), ("ill", "sick"),
]
PLURALS = [
    ("cat", "cats"), ("dog", "dogs"), ("book", "books"), ("boy", "boys"), ("girl", "girls"),
    ("box", "boxes"), ("bus", "buses"), ("class", "classes"), ("dish", "dishes"), ("watch", "watches"),
    ("baby", "babies"), ("city", "cities"), ("lady", "ladies"), ("story", "stories"), ("leaf", "leaves"),
    ("knife", "knives"), ("life", "lives"), ("child", "children"), ("man", "men"), ("woman", "women"),
    ("foot", "feet"), ("tooth", "teeth"), ("mouse", "mice"), ("sheep", "sheep"), ("fish", "fish"),
    ("ox", "oxen"), ("person", "people"), ("goose", "geese"), ("potato", "potatoes"), ("tomato", "tomatoes"),
]
RHYMES = [
    ("cat", "hat", ["dog", "cup", "pen"]), ("hen", "pen", ["hat", "sun", "box"]),
    ("ball", "tall", ["bed", "cup", "net"]), ("sun", "run", ["sat", "pen", "log"]),
    ("cake", "bake", ["cot", "pin", "rug"]), ("light", "night", ["lamp", "long", "late"]),
    ("rain", "train", ["run", "ring", "road"]), ("blue", "true", ["blow", "ball", "bell"]),
    ("king", "ring", ["kite", "keep", "kind"]), ("hop", "top", ["hat", "hen", "hid"]),
]
AN_WORDS = ["apple", "egg", "orange", "umbrella", "igloo", "onion", "aunt", "elephant", "ice cream", "hour"]
A_WORDS = ["ball", "cat", "dog", "house", "pen", "school", "table", "uniform", "mango", "zebra"]
VERBS_PAST = [
    ("play", "played"), ("jump", "jumped"), ("walk", "walked"), ("look", "looked"), ("talk", "talked"),
    ("go", "went"), ("see", "saw"), ("eat", "ate"), ("come", "came"), ("run", "ran"),
    ("take", "took"), ("give", "gave"), ("write", "wrote"), ("sing", "sang"), ("drink", "drank"),
    ("buy", "bought"), ("teach", "taught"), ("catch", "caught"), ("make", "made"), ("find", "found"),
]
PREPS = [("The book is ____ the table.", "on", ["and", "but", "so"]),
         ("She walked ____ the room.", "into", ["because", "happy", "tall"]),
         ("The cat is ____ the chair.", "under", ["jump", "blue", "sing"]),
         ("We sit ____ our friends.", "with", ["very", "froms", "tall"]),
         ("He lives ____ Lagos.", "in", ["at to", "on to", "by to"]),
         ("The picture hangs ____ the wall.", "on", ["in to", "into", "because"]),
         ("Divide the sweets ____ the two girls.", "between", ["under", "over", "into on"]),
         ("The ball rolled ____ the gate.", "towards", ["happy", "green", "slowly is"])]
HOMOPHONES = [
    ("I can ____ the sea.", "see", ["sea", "say", "sew"]),
    ("They put ____ bags here.", "their", ["there", "they're", "thier"]),
    ("I have ____ hands.", "two", ["too", "to", "tow"]),
    ("Please ____ your name.", "write", ["right", "rite", "white"]),
    ("The ____ is shining.", "sun", ["son", "soon", "sin"]),
    ("A ____ has a mane.", "horse", ["hoarse", "house", "ours"]),
    ("Do not ____ in the hall.", "wait", ["weight", "white", "wet"]),
    ("A week has seven ____.", "days", ["daze", "dies", "does"]),
]
SIMILES = [
    ("as brave as a ____", "lion", ["mouse", "stone", "leaf"]),
    ("as busy as a ____", "bee", ["stone", "cloud", "chair"]),
    ("as light as a ____", "feather", ["rock", "lorry", "mountain"]),
    ("as white as ____", "snow", ["coal", "night", "mud"]),
    ("as cold as ____", "ice", ["fire", "sun", "tea"]),
    ("as hungry as a ____", "hunter", ["pillow", "cloud", "song"]),
]


def gen_english(grade, rng):
    pools = defaultdict(list)

    def add(pool, *a):
        pools[pool].append(make_q(*a))

    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if grade <= 2:
        for i, ch in enumerate(letters[:-1]):
            add("alpha", f"Which letter comes after {ch}?", letters[i + 1],
                [letters[(i + 2) % 26], letters[i - 1], ch.lower()],
                f"The alphabet goes … {ch}, {letters[i + 1]} …")
        for w, r, d in RHYMES:
            add("rhyme", f"Which word rhymes with {w}?", r, d, f"{w} and {r} rhyme.")
        for w in A_WORDS:
            add("art", f"We say “a {w}”. Which article is correct?", "a", ["an", "the a", "some a"],
                f"“{w}” starts with a consonant sound, so we use a.")
        for w in AN_WORDS:
            add("art", f"We say “an {w}”. Which article is correct?", "an", ["a", "the an", "some"],
                f"“{w}” starts with a vowel sound, so we use an.")
    for a, b in OPPOSITES:
        add("ant", f"The opposite of {a} is ____.", b, pick_others([x[1] for x in OPPOSITES], b, 3, rng),
            f"{a} and {b} are antonyms.")
    for a, b in (SYNONYMS if grade >= 2 else SYNONYMS[:8]):
        add("syn", f"A synonym of {a} is ____.", b, pick_others([x[1] for x in SYNONYMS], b, 3, rng),
            f"{a} and {b} mean almost the same.")
    for s, p in PLURALS:
        if grade == 1 and p not in (s + "s", s + "es"):
            continue
        add("pl", f"The plural of {s} is ____.", p, [s + "s", s + "es", s + "'s", s],
            f"One {s}, many {p}.")
    if grade >= 2:
        for v, past in VERBS_PAST:
            add("tense", f"The past tense of {v} is ____.", past, [v, v + "ing", v + "s"],
                f"Today I {v}, yesterday I {past}.")
            add("tense", f"Choose the correct word: Yesterday she ____.", past, [v, v + "ing", "will " + v],
                f"Yesterday shows the past tense: {past}.")
    if grade >= 3:
        for q, ans, d in PREPS:
            add("prep", q, ans, d, f"The preposition is “{ans}”.")
        add("adj", "A word that describes a noun is an ____.", "adjective", ["verb", "adverb", "preposition"],
            "Adjectives describe nouns, e.g. a red ball.")
        add("adv", "A word that tells us how an action is done is an ____.", "adverb", ["noun", "adjective", "article"],
            "Adverbs often end in -ly, e.g. quickly.")
        add("verb", "A doing word is called a ____.", "verb", ["noun", "adjective", "conjunction"],
            "Verbs show action: run, jump, think.")
        add("noun", "A naming word is called a ____.", "noun", ["verb", "adverb", "preposition"],
            "Nouns name people, places or things.")
        for s, ans, d in SIMILES:
            add("fig", f"Complete the simile: {s}", ans, d, "A simile compares using as or like.")
        add("fig", "“The classroom was a zoo” is a ____.", "metaphor", ["simile", "question", "comma"],
            "A metaphor says one thing is another.")
    if grade >= 4:
        for q, ans, d in HOMOPHONES:
            add("homo", q, ans, d, f"The correct homophone here is “{ans}”.")
        add("conj", "Which word is a conjunction?", "because", ["quickly", "happy", "under"],
            "Conjunctions join words or sentences: and, but, because.")
        add("sent", "A sentence that asks something is ____.", "interrogative", ["declarative", "exclamatory", "imperative"],
            "Interrogative sentences ask questions.")
        add("sent", "“Sit down.” is an ____ sentence.", "imperative", ["interrogative", "exclamatory", "noun"],
            "Imperative sentences give commands.")
        add("pref", "The prefix un- in unhappy means ____.", "not", ["again", "very", "before"], "un- = not.")
        add("pref", "The prefix re- in rewrite means ____.", "again", ["not", "before", "wrong"], "re- = again.")
        add("suf", "The suffix -less in hopeless means ____.", "without", ["full of", "again", "before"], "-less = without.")
    if grade >= 5:
        add("pass", "Active: The cat chased the mouse. Passive: The mouse ____ by the cat.",
            "was chased", ["chased", "is chase", "chasing"], "Passive = be + past participle.")
        add("comp", "The superlative of good is ____.", "best", ["gooder", "more good", "goodest"], "good → better → best.")
        add("comp", "The comparative of tall is ____.", "taller", ["tallest", "more tall", "talling"], "tall → taller → tallest.")
        add("concord", "Neither of the boys ____ present.", "is", ["are", "were", "have"], "Neither is singular.")
        add("formal", "A letter to the head teacher is a ____ letter.", "formal", ["friendly", "secret", "poem"],
            "Official letters are formal.")
        add("clause", "A clause must have a subject and a ____.", "verb", ["comma", "title", "picture"],
            "Every clause has a subject and a verb.")
        add("person", "Giving human qualities to things is ____.", "personification", ["simile", "plural", "tense"],
            "E.g. “The wind whispered.”")
        add("theme", "The main idea of a passage is the ____.", "theme", ["footnote", "margin", "index"],
            "The theme is what the passage is mostly about.")
    if grade >= 6:
        add("speech", "She said, “I am tired.” Reported: She said that she ____ tired.", "was", ["am", "is", "were"],
            "Present tense often becomes past in reported speech.")
        add("obj", "In “Ada gave Chidi a book”, the indirect object is ____.", "Chidi", ["Ada", "book", "gave"],
            "Chidi receives the book.")
        add("punct", "Choose the correctly punctuated sentence.", "Let's eat, Grandma.",
            ["Lets eat Grandma.", "Lets eat, grandma.", "Let's eat Grandma."],
            "Let’s = let us. The comma shows we are speaking to Grandma.")
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        a, b = OPPOSITES[i % len(OPPOSITES)]
        extra.add(shuffle_q(make_q(f"Which word is the antonym of {a}?", b,
                                   pick_others([x[1] for x in OPPOSITES], b, 3, rng),
                                   f"{a} ≠ {b}."), rng))
        i += 1
        if i > 400:
            break
    return extra.items[:N]


ANALOGIES = [
    ("cat", "kitten", "dog", "puppy", ["bark", "bone", "tail"]),
    ("bird", "nest", "bee", "hive", ["honey", "wing", "fly"]),
    ("hand", "glove", "foot", "shoe", ["toe", "leg", "sock only"]),
    ("pen", "write", "knife", "cut", ["sharp", "kitchen", "metal"]),
    ("sun", "day", "moon", "night", ["star", "sky", "light"]),
    ("teacher", "school", "doctor", "hospital", ["nurse", "pill", "sick"]),
    ("sheep", "lamb", "cow", "calf", ["milk", "horn", "farm"]),
    ("eye", "see", "ear", "hear", ["head", "face", "sound"]),
    ("water", "drink", "food", "eat", ["cook", "plate", "rice"]),
    ("king", "queen", "man", "woman", ["boy", "crown", "palace"]),
    ("up", "down", "in", "out", ["on", "to", "at"]),
    ("hot", "cold", "wet", "dry", ["rain", "sun", "ice"]),
    ("book", "read", "song", "sing", ["radio", "voice", "music only"]),
    ("fish", "water", "bird", "air", ["tree", "nest", "feather"]),
    ("finger", "hand", "toe", "foot", ["shoe", "leg", "nail"]),
]


def gen_verbal(grade, rng):
    pools = defaultdict(list)

    def add(pool, *a):
        pools[pool].append(make_q(*a))

    for a, b, c, d, extra in ANALOGIES:
        add("ana", f"{a} is to {b} as {c} is to ____.", d, extra, f"The relationship matches: {c} → {d}.")
        add("ana", f"{b} is to {a} as {d} is to ____.", c, extra, f"Reverse analogy: {d} → {c}.")
    groups = [
        (["red", "blue", "green", "chair"], "chair", "colours vs furniture"),
        (["goat", "cow", "hen", "book"], "book", "animals vs object"),
        (["apple", "mango", "orange", "shoe"], "shoe", "fruits vs shoe"),
        (["car", "bus", "train", "rice"], "rice", "vehicles vs food"),
        (["circle", "square", "triangle", "seven"], "seven", "shapes vs number"),
        (["Monday", "Friday", "Sunday", "Lagos"], "Lagos", "days vs city"),
        (["hammer", "hoe", "cutlass", "song"], "song", "tools vs song"),
        (["eye", "ear", "nose", "table"], "table", "body parts vs furniture"),
        (["yam", "cassava", "maize", "pencil"], "pencil", "crops vs stationery"),
        (["Abuja", "Kano", "Ibadan", "Nile"], "Nile", "Nigerian cities vs a river"),
    ]
    for items, odd, why in groups:
        add("odd", f"Odd one out: {', '.join(items)}", odd, [x for x in items if x != odd],
            f"{odd} is the odd one out ({why}).")
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for i, ch in enumerate(letters[: 10 + grade]):
        add("alpha", f"If A=1, B=2, C=3, what is {ch}?", i + 1, near(i + 1), f"{ch} is letter {i + 1}.")
    for w, r, d in RHYMES:
        add("rhyme", f"Which word rhymes with {w}?", r, d, f"{w} rhymes with {r}.")
    for a, b in OPPOSITES[: 12 + grade * 3]:
        add("ant", f"{a} is the opposite of ____.", b, pick_others([x[1] for x in OPPOSITES], b, 3, rng),
            f"{a} ↔ {b}.")
    if grade >= 3:
        add("code", "If CAT = 24 (C=3,A=1,T=20), then BAT = ____.", 23, ["24", "21", "26"],
            "B=2, A=1, T=20 → 23.")
        add("jumble", "Unscramble: HOCSOL", "SCHOOL", ["CHOLOS", "LOCHOS", "SHCOOL"], "The letters make SCHOOL.")
        add("jumble", "Unscramble: RETCAHE", "TEACHER", ["CHEATER", "RETEACH", "HECTARE"], "The letters make TEACHER.")
        add("jumble", "Unscramble: NIRAIGE", "NIGERIA", ["GRAINIE", "REGAINI", "ANGIRIE"], "The letters make NIGERIA.")
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        g = groups[i % len(groups)]
        extra.add(shuffle_q(make_q(f"Which is the odd one? {', '.join(g[0])}", g[1],
                                   [x for x in g[0] if x != g[1]], g[2]), rng))
        i += 1
        if i > 300:
            break
    return extra.items[:N]


# ---------------------------------------------------------------------------
# Factual subjects — data then generators
# ---------------------------------------------------------------------------
def mcq_from_facts(facts, rng, grade_ok=lambda g: True):
    """facts: list of (q, ans, distractors, explain) or dicts."""
    out = []
    for f in facts:
        out.append(make_q(*f))
    return out


def which_of(correct_pool, wrong_pool, stem, explain, rng, limit=40):
    qs = []
    wrongs = list(wrong_pool)
    for c in correct_pool:
        rng.shuffle(wrongs)
        qs.append(make_q(f"{stem}", c, wrongs[:3], explain))
        if len(qs) >= limit:
            break
    return qs


def gen_science(grade, rng):
    pools = defaultdict(list)
    living = ["goat", "hen", "fish", "tree", "boy", "girl", "cow", "bird", "plant", "frog", "dog", "cat", "maize plant"]
    non = ["stone", "chair", "cup", "book", "pencil", "shoe", "table", "plate", "ball", "spoon"]
    water_an = ["fish", "frog", "duck", "crab", "crocodile"]
    land_an = ["goat", "lion", "hen", "cow", "dog", "cat", "horse"]
    fly = ["bird", "bat", "butterfly", "mosquito"]
    senses = [
        ("eyes", "see", "sight"), ("ears", "hear", "hearing"), ("nose", "smell", "smell"),
        ("tongue", "taste", "taste"), ("skin", "feel", "touch"),
    ]
    for org, act, name in senses:
        pools["sense"].append(make_q(f"We {act} with our ____.", org, [x[0] for x in senses if x[0] != org],
                                     f"The {org} are for {name}."))
        pools["sense"].append(make_q(f"The sense organ for {name} is the ____.", org,
                                     [x[0] for x in senses if x[0] != org], f"{name} → {org}."))
    for c in living:
        pools["liv"].append(make_q("Which one is a living thing?", c, pick_others(non, "", 3, rng),
                                   "Living things grow, feed and reproduce."))
    for c in non:
        pools["liv"].append(make_q("Which one is a non-living thing?", c, pick_others(living, "", 3, rng),
                                   "Non-living things do not grow or breathe."))
    for c in water_an:
        pools["hab"].append(make_q("Which animal lives in water?", c, pick_others(land_an, "", 3, rng),
                                   f"A {c} lives in or around water."))
    for c in fly:
        pools["hab"].append(make_q("Which animal can fly?", c, pick_others(land_an, "", 3, rng),
                                   f"A {c} can fly."))
    pools["plant"].extend([
        make_q("Plants need water, air and ____ to make food.", "sunlight", ["stones", "plastic", "noise"],
               "Photosynthesis needs sunlight."),
        make_q("The part of a plant under the ground is the ____.", "root", ["leaf", "flower", "fruit"],
               "Roots take in water."),
        make_q("The green colouring in leaves is ____.", "chlorophyll", ["blood", "soil", "oxygen"],
               "Chlorophyll traps sunlight."),
        make_q("A tadpole grows into a ____.", "frog", ["hen", "goat", "fish"], "A tadpole is a young frog."),
        make_q("A baby cat is called a ____.", "kitten", ["puppy", "calf", "chick"], "A kitten is a young cat."),
        make_q("A baby dog is called a ____.", "puppy", ["kitten", "calf", "lamb"], "A puppy is a young dog."),
        make_q("A baby cow is called a ____.", "calf", ["puppy", "kid", "chick"], "A calf is a young cow."),
        make_q("We should wash our hands ____ eating.", "before", ["never", "during only", "yearly"],
               "Clean hands prevent disease."),
        make_q("The sun gives us light and ____.", "heat", ["ice", "soil", "noise"], "The sun is a source of heat and light."),
        make_q("Rain comes from the ____.", "clouds", ["moon", "stones", "ground only"], "Rain falls from clouds."),
        make_q("Air is all around us but we cannot ____ it.", "see", ["need", "breathe", "feel wind"],
               "Air is invisible."),
        make_q("Ice is water in the ____ state.", "solid", ["liquid", "gas", "mixed"], "Ice is solid water."),
        make_q("Steam is water in the ____ state.", "gas", ["solid", "stone", "metal"], "Steam is water vapour."),
    ])
    if grade >= 3:
        pools["mat"].extend([
            make_q("The three states of matter are solid, liquid and ____.", "gas", ["stone", "heat", "soil"],
                   "Matter: solid, liquid, gas."),
            make_q("A magnet attracts objects made of ____.", "iron", ["wood", "plastic", "paper"],
                   "Magnets attract iron."),
            make_q("A shadow forms when light is ____.", "blocked", ["made louder", "eaten", "frozen"],
                   "Opaque objects block light."),
            make_q("Clay soil feels ____ when wet.", "sticky", ["very sandy", "invisible", "metallic"],
                   "Clay holds water and is sticky."),
            make_q("We inhale ____.", "oxygen", ["only smoke", "only dust", "oil"], "Living things need oxygen."),
            make_q("Animals that eat only plants are ____.", "herbivores", ["carnivores", "omnivores", "producers"],
                   "Herbivores eat plants."),
            make_q("Animals that eat only flesh are ____.", "carnivores", ["herbivores", "producers", "insects only"],
                   "Carnivores eat flesh."),
            make_q("The moon gets its light from the ____.", "sun", ["Earth", "stars only", "sea"],
                   "The moon reflects sunlight."),
            make_q("Boiling water turns to steam at ____ °C.", "100", ["0", "50", "10"], "Water boils at 100°C."),
            make_q("Water freezes at ____ °C.", "0", ["100", "50", "10"], "Water freezes at 0°C."),
        ])
    if grade >= 4:
        pools["body"].extend([
            make_q("The organ that pumps blood is the ____.", "heart", ["lung", "kidney", "liver"],
                   "The heart pumps blood."),
            make_q("We breathe with our ____.", "lungs", ["stomach", "hair", "bones"], "The lungs take in air."),
            make_q("Adults have ____ permanent teeth.", "32", ["20", "16", "24"], "A full adult set is 32 teeth."),
            make_q("Energy from the sun is called ____ energy.", "solar", ["sound", "wind only", "nuclear school"],
                   "Solar energy comes from the sun."),
            make_q("Plants make food by ____.", "photosynthesis", ["digestion", "evaporation", "pollution"],
                   "Photosynthesis uses sunlight, water and CO₂."),
            make_q("Evaporation is liquid changing to ____.", "gas", ["solid", "stone", "ice"],
                   "Liquid → gas is evaporation."),
            make_q("Condensation is gas changing to ____.", "liquid", ["solid metal", "fire", "light"],
                   "Gas → liquid is condensation."),
            make_q("A push or a pull is a ____.", "force", ["colour", "planet", "seed"], "Force can change motion."),
            make_q("Insects have ____ legs.", "6", ["4", "8", "10"], "Insects have 6 legs."),
            make_q("Spiders have ____ legs.", "8", ["6", "4", "10"], "Spiders are arachnids with 8 legs."),
            make_q("Cutting down too many trees is ____.", "deforestation", ["irrigation", "pollination", "erosion only"],
                   "Deforestation destroys forests."),
        ])
    if grade >= 5:
        pools["sys"].extend([
            make_q("The system that breaks down food is the ____ system.", "digestive", ["nervous", "skeletal", "only blood"],
                   "Digestion starts in the mouth."),
            make_q("Blood is carried away from the heart in ____.", "arteries", ["veins", "bones", "nerves"],
                   "Arteries leave the heart; veins return."),
            make_q("Materials that allow electricity to pass are ____.", "conductors", ["insulators", "filters", "shadows"],
                   "Metals like copper conduct electricity."),
            make_q("Plastic is a good ____.", "insulator", ["conductor", "magnet", "planet"],
                   "Plastic does not conduct electricity well."),
            make_q("Carbohydrates mainly give the body ____.", "energy", ["only water", "only colour", "bones only"],
                   "Rice and yam are energy-giving foods."),
            make_q("Proteins help the body to ____.", "grow and repair", ["see in the dark", "only sleep", "make shadows"],
                   "Beans, fish and eggs are body-building foods."),
            make_q("The Earth moving around the sun is ____.", "revolution", ["rotation", "evaporation", "reflection"],
                   "Revolution takes about 365 days."),
            make_q("The Earth spinning on its axis is ____.", "rotation", ["revolution", "orbit only", "gravity only"],
                   "Rotation gives day and night."),
            make_q("Vitamin D is made when skin gets ____.", "sunlight", ["sugar", "noise", "plastic"],
                   "Sunlight helps the body make vitamin D."),
            make_q("A lever and a pulley are ____.", "simple machines", ["planets", "diseases", "clouds"],
                   "Simple machines make work easier."),
        ])
    if grade >= 6:
        pools["adv"].extend([
            make_q("Earth is the ____ planet from the sun.", "third", ["first", "second", "fourth"],
                   "Mercury, Venus, Earth…"),
            make_q("The largest planet is ____.", "Jupiter", ["Earth", "Mars", "Mercury"], "Jupiter is a gas giant."),
            make_q("The force that pulls us to Earth is ____.", "gravity", ["friction only", "light", "sound"],
                   "Gravity gives us weight."),
            make_q("Density is mass divided by ____.", "volume", ["time", "speed", "colour"], "Density = mass ÷ volume."),
            make_q("Transfer of pollen from anther to stigma is ____.", "pollination", ["germination", "digestion", "condensation"],
                   "Pollination may be by wind or insects."),
            make_q("HIV attacks the ____ system.", "immune", ["digestive", "skeletal", "only hair"],
                   "HIV weakens the body’s defences."),
            make_q("The water cycle includes evaporation, condensation and ____.", "precipitation", ["photosynthesis", "pollination", "rotation"],
                   "Precipitation is rain, hail or snow."),
            make_q("The nearest star to Earth is the ____.", "sun", ["moon", "Mars", "North Star"],
                   "The sun is a star."),
            make_q("Friction is a force that ____ motion.", "opposes", ["creates planets", "stops gravity forever", "makes light"],
                   "Friction acts against movement."),
            make_q("Metals generally ____ heat.", "conduct", ["block always", "destroy", "freeze"],
                   "Most metals are good conductors of heat."),
        ])
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        c = living[i % len(living)]
        extra.add(shuffle_q(make_q(f"Which of these is living?", c, pick_others(non, "", 3, rng),
                                   "Living things grow and respire."), rng))
        i += 1
        if i > 400:
            break
    return extra.items[:N]


def gen_social(grade, rng):
    facts = [
        ("The name of our country is ____.", "Nigeria", ["Ghana", "Kenya", "Egypt"], "We live in Nigeria."),
        ("The capital city of Nigeria is ____.", "Abuja", ["Lagos", "Kano", "Ibadan"], "Abuja is the capital."),
        ("Nigeria is in the continent of ____.", "Africa", ["Asia", "Europe", "America"], "Nigeria is in West Africa."),
        ("The Nigerian flag is green, white and ____.", "green", ["red", "blue", "yellow"], "The flag is green–white–green."),
        ("White on the flag stands for ____.", "peace", ["war", "farming", "the sea"], "White stands for peace."),
        ("Green on the flag stands for ____.", "agriculture", ["war", "the sky", "night"], "Green stands for agriculture."),
        ("Nigeria has ____ states.", "36", ["12", "19", "50"], "36 states plus the FCT."),
        ("The two main rivers are the Niger and the ____.", "Benue", ["Nile", "Congo", "Amazon"], "They meet at Lokoja."),
        ("River Niger and Benue meet at ____.", "Lokoja", ["Lagos", "Kano", "Enugu"], "Lokoja is the confluence town."),
        ("People who live near us are our ____.", "neighbours", ["enemies", "rivers", "flags"], "Neighbours live nearby."),
        ("A person who grows crops is a ____.", "farmer", ["pilot", "nurse", "sailor"], "Farmers grow food."),
        ("A person who flies an aeroplane is a ____.", "pilot", ["driver", "mason", "cook"], "A pilot flies aircraft."),
        ("A nurse works in a ____.", "hospital", ["airport only", "farm only", "stadium only"], "Nurses care for the sick."),
        ("We buy and sell at the ____.", "market", ["river only", "cloud", "flag"], "A market is for trade."),
        ("The three major ethnic groups are Hausa, Yoruba and ____.", "Igbo", ["Zulu", "Maasai", "Berber"],
         "Hausa, Igbo and Yoruba are the largest groups."),
        ("A Yoruba king is often called an ____.", "Oba", ["Emir", "President", "Governor"], "Yoruba: Oba. Hausa: Emir."),
        ("A Hausa/Fulani traditional ruler may be called an ____.", "Emir", ["Oba", "Obi", "Pharaoh"], "Emir is used in many northern cities."),
        ("North, South, East and West are ____.", "cardinal points", ["seasons", "foods", "rivers"], "They show direction."),
        ("A map is a ____ of a place.", "drawing", ["song", "uniform", "meal"], "Maps show features of a place."),
        ("The currency of Nigeria is the ____.", "naira", ["cedi", "rand", "dollar"], "Naira and kobo."),
        ("We celebrate Independence Day on ____.", "1 October", ["1 January", "25 December", "27 May"], "Independence: 1 Oct 1960."),
        ("The head of a local government is the ____.", "chairman", ["president", "senator", "judge"],
         "An LGA is headed by a chairman/chairperson."),
        ("Culture includes language, food, dress and ____.", "customs", ["only cars", "only rain", "only oil"],
         "Culture is a people’s way of life."),
        ("We cross the road at a ____.", "zebra crossing", ["any dark corner", "the middle of cars", "a roundabout only"],
         "Use a zebra crossing or traffic light."),
    ]
    if grade >= 4:
        facts += [
            ("Nigeria gained independence in ____.", "1960", ["1950", "1963", "1991"], "1 October 1960."),
            ("The first Prime Minister was ____.", "Tafawa Balewa", ["Nnamdi Azikiwe", "Obafemi Awolowo", "Ahmadu Bello"],
             "Sir Abubakar Tafawa Balewa."),
            ("The coat of arms has an eagle and two ____.", "horses", ["lions", "elephants", "goats"], "Two white horses."),
            ("The black shield on the coat of arms stands for ____.", "fertile soil", ["the sea", "the eagle", "war"],
             "The black shield: fertile soil."),
            ("Lagos stopped being capital when it moved to Abuja in ____.", "1991", ["1960", "1976", "2010"], "Abuja, 1991."),
            ("Crude oil is a major ____ of Nigeria.", "mineral resource", ["festival", "language", "sport"],
             "Petroleum is important, especially in the Niger Delta."),
            ("The equator divides Earth into ____.", "North and South", ["East and West only", "land and water", "day and night"],
             "The equator is 0° latitude."),
            ("A constitution is a set of ____.", "supreme laws", ["songs", "uniforms", "meals"], "The highest law of the land."),
        ]
    if grade >= 5:
        facts += [
            ("There are ____ continents.", "7", ["5", "6", "8"], "Seven continents."),
            ("Which country does not border Nigeria?", "Ghana", ["Benin", "Chad", "Cameroon"],
             "Neighbours: Benin, Niger, Chad, Cameroon."),
            ("Nigeria’s neighbour to the west is ____.", "Benin", ["Chad", "Cameroon", "Ghana"], "Benin Republic is to the west."),
            ("The first President of Nigeria was ____.", "Nnamdi Azikiwe", ["Tafawa Balewa", "Yakubu Gowon", "Obasanjo"],
             "Dr Nnamdi Azikiwe, 1963."),
            ("Democracy is government of the people, by the people and ____.", "for the people", ["for the army", "for foreigners", "for the rich only"],
             "People vote for leaders."),
            ("The National Assembly has the Senate and the ____.", "House of Representatives", ["Supreme Court", "Army", "Cabinet"],
             "Two federal houses make laws."),
            ("A governor heads a ____.", "state", ["ward", "country", "court"], "Each state has a governor."),
            ("The President heads the ____ arm.", "executive", ["judiciary", "press", "market"], "The executive carries out laws."),
        ]
    if grade >= 6:
        facts += [
            ("The highest court is the ____.", "Supreme Court", ["Magistrate Court", "Customary Court", "Police station"],
             "The Supreme Court is the highest."),
            ("ECOWAS is a body of ____ African states.", "West", ["East", "North only", "Southern only"],
             "Economic Community of West African States."),
            ("Tin is mined mainly on the ____.", "Jos Plateau", ["Lagos beach", "River Nile", "Atlantic"],
             "Jos Plateau is known for tin."),
            ("Desertification is a problem mainly in ____ Nigeria.", "northern", ["the ocean", "south-south only", "the creeks only"],
             "The north is drier."),
            ("The UN was formed to promote ____.", "world peace", ["war", "one language only", "farming in one village"],
             "United Nations, 1945."),
        ]
    cities = ["Lagos", "Kano", "Ibadan", "Port Harcourt", "Enugu", "Kaduna", "Jos", "Maiduguri", "Calabar", "Abeokuta"]
    for c in cities:
        facts.append((f"{c} is a city in ____.", "Nigeria", ["Ghana", "Kenya", "Egypt"], f"{c} is in Nigeria."))
    jobs = [("teacher", "school"), ("farmer", "farm"), ("doctor", "hospital"), ("trader", "market"),
            ("driver", "road"), ("pilot", "airport"), ("sailor", "sea"), ("carpenter", "wood workshop")]
    for job, place in jobs:
        facts.append((f"A {job} often works at/in a ____.", place, ["moon", "cloud", "rainbow"], f"A {job} works at the {place}."))
    pools = defaultdict(list)
    pools["f"] = [make_q(*f) for f in facts]
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        extra.add(shuffle_q(make_q("Which of these is a Nigerian city?", cities[i % len(cities)],
                                   ["Accra", "Nairobi", "Cairo", "London", "Paris"], "It is a city in Nigeria."), rng))
        i += 1
        if i > 300:
            break
    return extra.items[:N]


def gen_civic(grade, rng):
    facts = [
        ("A good citizen should be ____.", "honest", ["a cheat", "a bully", "a thief"], "Honesty is a civic virtue."),
        ("We must respect our ____.", "parents and elders", ["nobody", "only strangers", "only money"], "Respect is a duty."),
        ("We should keep our environment ____.", "clean", ["dirty", "unsafe", "noisy always"], "A clean place is healthy."),
        ("Traffic lights: red means ____.", "stop", ["go", "wait only in school", "run"], "Red = stop."),
        ("Traffic lights: green means ____.", "go", ["stop", "sleep", "turn back always"], "Green = go."),
        ("Traffic lights: amber/yellow means ____.", "get ready", ["play", "stop forever", "park"], "Amber = get ready."),
        ("The Nigerian pledge starts with “I pledge to Nigeria my ____”.", "country", ["school", "football", "food"],
         "The pledge is to Nigeria our country."),
        ("We should queue up when we ____.", "wait our turn", ["fight", "jump the line", "shout"], "Queuing is civic order."),
        ("Throwing refuse in the gutter is ____.", "wrong", ["patriotic", "a right", "helpful"], "It causes flood and disease."),
        ("A right of a child is the right to ____.", "education", ["steal", "be neglected", "work in a factory"],
         "Children have a right to education."),
        ("We salute the flag to show ____.", "loyalty", ["anger", "fear only", "hunger"], "Respect for national symbols."),
        ("The national anthem (restored 2024) begins ____.", "Nigeria, we hail thee", ["Arise, O compatriots", "God bless Nigeria", "Hail the army"],
         "“Nigeria, We Hail Thee” was restored in May 2024."),
        ("Paying tax is a ____ of citizens.", "duty", ["song", "game", "punishment only"], "Taxes fund public services."),
        ("We must obey the ____.", "law", ["bully", "criminal", "nobody"], "Laws protect everyone."),
        ("Helping a lost child is being ____.", "responsible", ["rude", "selfish", "lawless"], "Good citizens help others."),
        ("Voting is done in a ____.", "democracy", ["dictatorship only", "jungle", "market stall only"],
         "Adults vote in a democracy."),
        ("The three arms of government are executive, legislature and ____.", "judiciary", ["police", "army", "market"],
         "Judiciary = courts."),
        ("The legislature ____ the law.", "makes", ["sings", "ignores", "hides"], "Law-makers make the law."),
        ("The judiciary ____ the law.", "interprets", ["dances", "prints money", "farms"], "Courts interpret the law."),
        ("The executive ____ the law.", "enforces / carries out", ["deletes", "only sings", "hides"],
         "The executive implements laws."),
        ("Bribery is ____.", "a crime", ["a civic duty", "a right", "a festival"], "Do not give or take bribes."),
        ("Freedom of worship is a ____.", "right", ["punishment", "tax", "game"], "Nigerians may practise their religion."),
        ("We should not discriminate because of ____.", "tribe or religion", ["homework", "sports day", "uniform colour only"],
         "All citizens are equal before the law."),
        ("A patriot loves his or her ____.", "country", ["only money", "only foreign land", "disorder"],
         "Patriotism is love of country."),
        ("The head of Nigeria’s federal government is the ____.", "President", ["Governor", "Councillor", "Chief Judge only"],
         "The President heads the Federation."),
        ("INEC is in charge of ____.", "elections", ["farming", "football only", "hospitals only"],
         "Independent National Electoral Commission."),
        ("Public property belongs to ____.", "everyone / the government", ["one pupil", "a stranger", "nobody to care for"],
         "We must protect public property."),
        ("Saying “please” and “thank you” shows ____.", "good manners", ["weakness", "fear", "pride"], "Courtesy is civic."),
    ]
    if grade >= 5:
        facts += [
            ("Fundamental human rights include the right to ____.", "life", ["steal", "harm others", "break traffic lights"],
             "Rights come with respect for others."),
            ("The rule of law means ____.", "nobody is above the law", ["leaders are above the law", "laws are secret", "only police have rights"],
             "Everyone is equal under the law."),
            ("A constitution can be changed by ____.", "amendment", ["tearing it", "one pupil", "ignoring it"],
             "Amendments follow a legal process."),
            ("Civic education teaches us to be ____.", "good citizens", ["lawless", "selfish", "silent forever"],
             "It builds responsible citizens."),
        ]
    pools = {"f": [make_q(*f) for f in facts]}
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    virtues = ["honesty", "obedience", "tolerance", "punctuality", "self-control", "contentment", "kindness", "courage"]
    i = 0
    while len(extra.items) < N:
        v = virtues[i % len(virtues)]
        extra.add(shuffle_q(make_q(f"Which of these is a good civic value?", v,
                                   ["cheating", "bullying", "vandalism", "lying"], f"{v.capitalize()} is a civic virtue."), rng))
        i += 1
        if i > 300:
            break
    return extra.items[:N]


def gen_computer(grade, rng):
    facts = [
        ("A computer is an ____ machine.", "electronic", ["wooden farming", "only paper", "animal"],
         "A computer is an electronic device."),
        ("The screen of a computer is the ____.", "monitor", ["mouse", "keyboard", "speaker only"],
         "The monitor displays information."),
        ("We type letters using the ____.", "keyboard", ["mouse", "printer", "UPS"], "A keyboard is an input device."),
        ("The mouse is used to ____.", "point and click", ["print books only", "cook", "wash"], "The mouse is a pointing device."),
        ("The brain of the computer is the ____.", "CPU", ["monitor", "speaker", "cable"], "CPU = Central Processing Unit."),
        ("A printer is an ____ device.", "output", ["input only", "cooking", "farming"], "Printers produce hard copy."),
        ("Speakers give out ____.", "sound", ["paper", "light only", "heat only"], "Speakers are output devices."),
        ("A scanner is an ____ device.", "input", ["output only", "storage only", "cooking"], "Scanners send images in."),
        ("Software means ____.", "programs", ["the plastic box only", "wires only", "tables"], "Software is a set of programs."),
        ("Hardware means ____.", "the physical parts", ["only songs", "only the internet", "only ideas"],
         "Hardware is the parts you can touch."),
        ("To start a computer is to ____ it.", "boot", ["delete", "fold", "wash"], "Booting starts the system."),
        ("Ctrl + S is commonly used to ____.", "save", ["sleep", "shout", "search only"], "Ctrl+S saves a file."),
        ("Ctrl + C is used to ____.", "copy", ["cut forever", "close the school", "crash"], "Copy = Ctrl+C."),
        ("Ctrl + V is used to ____.", "paste", ["vanish", "vote", "vacuum"], "Paste = Ctrl+V."),
        ("A folder is used to ____ files.", "organise", ["eat", "print the sky", "hide the CPU"], "Folders store files."),
        ("The internet is a ____ of computers.", "worldwide network", ["single cable in one desk", "type of food", "game only"],
         "The internet links computers globally."),
        ("An email is a message sent ____.", "electronically", ["only by postman bicycle", "only by radio drum", "by smoke"],
         "Electronic mail."),
        ("A virus is a ____ program.", "harmful", ["healthy food", "keyboard key", "monitor colour"],
         "Viruses can damage files."),
        ("We should not share our ____ online.", "passwords", ["school name always as a secret", "favourite colour never", "subject"],
         "Keep passwords private."),
        ("MS Word is used for ____.", "typing documents", ["only drawing maps of stars", "cooking rice", "flying planes"],
         "Word processors type text."),
        ("A flash drive is used for ____.", "storage", ["cooking", "lighting a room", "sweeping"], "USB flash drives store data."),
        ("RAM is a type of ____ memory.", "temporary", ["paper", "permanent ink", "kitchen"], "RAM loses data when power goes off."),
        ("A byte is made of ____ bits.", "8", ["2", "10", "100"], "8 bits = 1 byte."),
        ("www stands for ____.", "World Wide Web", ["World Wide Wait", "West West West", "Wide Web World"],
         "WWW is the web."),
        ("A search engine example is ____.", "Google", ["A hoe", "A kettle", "A broom"], "Google is a search engine."),
        ("Do not click unknown ____.", "links", ["books in the library", "teachers", "textbooks"],
         "Unknown links may be unsafe."),
        ("The cursor is the ____ on the screen.", "pointer / blinking mark", ["speaker", "plug", "fan"],
         "It shows where you type or click."),
        ("Shut down means to ____ the computer.", "turn off properly", ["break", "hide", "wash"], "Use Shut Down, don’t just unplug."),
    ]
    if grade >= 4:
        facts += [
            ("Input devices send data ____ the computer.", "into", ["out of only", "around the moon", "to the farm"],
             "Keyboard and mouse are input devices."),
            ("Output devices send data ____ the computer.", "out of", ["into only", "under", "through soil"],
             "Monitor and printer are output."),
            ("A spreadsheet program example is ____.", "Microsoft Excel", ["Notepad only never numbers", "Paint only", "A radio"],
             "Excel handles numbers in tables."),
            ("ICT means Information and ____ Technology.", "Communication", ["Cooking", "Farming", "Tailoring"],
             "Information and Communication Technology."),
        ]
    if grade >= 6:
        facts += [
            ("https in a web address shows the site is ____.", "more secure", ["a game", "offline always", "a virus always"],
             "The S stands for secure."),
            ("Cyberbullying is ____.", "wrong and hurtful", ["a sport", "a civic duty", "a subject in farming"],
             "Tell a trusted adult if it happens."),
            ("A network in one building is a ____.", "LAN", ["WAN only always", "CPU", "RAM"],
             "LAN = Local Area Network."),
        ]
    parts = ["monitor", "keyboard", "mouse", "CPU", "printer", "speaker", "scanner", "flash drive"]
    pools = {"f": [make_q(*f) for f in facts]}
    for p in parts:
        pools["f"].append(make_q("Which of these is computer hardware?", p, ["Windows song", "a thought", "air"],
                                 f"The {p} is a physical part."))
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        extra.add(shuffle_q(make_q("Which is an input device?", "keyboard", ["monitor", "printer", "speaker"],
                                   "A keyboard sends data in."), rng))
        extra.add(shuffle_q(make_q("Which is an output device?", "printer", ["keyboard", "mouse", "scanner"],
                                   "A printer sends data out."), rng))
        extra.add(shuffle_q(make_q("Which of these is hardware?", parts[i % len(parts)],
                                   ["Microsoft Word", "a website idea", "electricity only"], "Hardware can be touched."), rng))
        i += 1
        if i > 200:
            break
    return extra.items[:N]


def gen_agric(grade, rng):
    crops = ["yam", "cassava", "maize", "rice", "cocoa", "millet", "sorghum", "groundnut", "beans", "plantain", "oil palm", "tomato"]
    food = ["yam", "cassava", "maize", "rice", "plantain", "beans"]
    cash = ["cocoa", "oil palm", "cotton", "rubber", "groundnut"]
    animals = ["goat", "sheep", "cow", "hen", "pig", "rabbit", "fish"]
    tools = [("hoe", "digging"), ("cutlass", "clearing bush"), ("rake", "gathering leaves"),
             ("watering can", "watering plants"), ("wheelbarrow", "carrying loads"), ("sickle", "harvesting grain")]
    products = [("hen", "eggs"), ("cow", "milk"), ("goat", "meat"), ("bee", "honey"), ("sheep", "wool"), ("fish", "fish meat")]
    facts = [
        ("Agriculture is the growing of crops and the rearing of ____.", "animals", ["stars", "computers", "songs"],
         "Farming = crops + animals."),
        ("A place where crops are grown is a ____.", "farm", ["airport", "cinema", "bank"],
         "Crops are grown on a farm."),
        ("Weeds are plants that grow ____.", "where they are not wanted", ["only in the sea", "only in books", "on the moon"],
         "Weeds compete with crops."),
        ("Soil that is good for many crops is ____ soil.", "loamy", ["pure stone", "pure plastic", "pure metal"],
         "Loam is a mix of sand, silt and clay."),
        ("Farmers add ____ to make soil richer.", "manure or fertiliser", ["plastic", "glass", "petrol"],
         "Manure adds nutrients."),
        ("Irrigation means ____ crops.", "watering", ["burning", "singing to", "hiding"], "Irrigation supplies water."),
        ("Harvesting is the ____ of mature crops.", "gathering", ["planting", "weeding only", "ploughing only"],
         "Harvest comes when crops are ready."),
        ("Shifting cultivation means moving to a new ____ after some years.", "piece of land", ["country always", "ocean", "star"],
         "Land is left to rest (fallow)."),
        ("A cash crop is grown mainly to ____.", "sell", ["look at", "burn", "hide"], "Cocoa is a cash crop in Nigeria."),
        ("A food crop is grown mainly to ____.", "eat", ["export only always", "make plastic", "build roads"],
         "Yam and cassava are food crops."),
        ("Poultry farming is the rearing of ____.", "birds such as hens", ["goats only", "fish only", "cocoa"],
         "Poultry = domestic birds."),
        ("Fish are reared in a ____.", "pond", ["sky farm", "desert dune only", "classroom"], "Pisciculture uses ponds."),
        ("The young of a goat is a ____.", "kid", ["calf", "lamb", "puppy"], "A kid is a young goat."),
        ("The young of a sheep is a ____.", "lamb", ["kid", "calf", "chick"], "A lamb is a young sheep."),
        ("Crop rotation helps to ____.", "keep soil fertile", ["kill all rain", "remove the sun", "stop planting forever"],
         "Different crops use different nutrients."),
    ]
    # fix tuple typo - I had a syntax error with mixed parens
    facts[2] = ("A place where crops are grown is a ____.", "farm", ["airport", "cinema", "bank"], "Crops are grown on a farm.")
    for c in crops:
        facts.append((f"{c.capitalize()} is a ____.", "crop", ["metal", "planet", "vehicle"], f"{c.capitalize()} is grown on farms."))
    for c in food:
        facts.append((f"{c.capitalize()} is mainly a ____ crop.", "food", ["metal", "plastic", "mineral oil"],
                      f"{c.capitalize()} is eaten as food."))
    for c in cash:
        facts.append((f"{c.capitalize()} is mainly a ____ crop.", "cash", ["toy", "planet", "gas"],
                      f"{c.capitalize()} is grown to sell."))
    for a in animals:
        facts.append((f"A {a} is a ____ animal.", "farm", ["wild jungle only always", "sea only always", "space"],
                      f"A {a} is commonly reared."))
    for tool, use in tools:
        facts.append((f"A {tool} is used for ____.", use, ["typing emails", "flying", "painting the sky"],
                      f"A {tool} is a farm tool."))
    for an, pr in products:
        facts.append((f"A {an} gives us ____.", pr, ["computers", "petrol", "plastic chairs"], f"A {an} produces {pr}."))
    pools = {"f": [make_q(*f) for f in facts]}
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        extra.add(shuffle_q(make_q("Which of these is a farm crop?", crops[i % len(crops)],
                                   ["lorry", "granite block", "keyboard"], "It is grown on a farm."), rng))
        i += 1
        if i > 300:
            break
    return extra.items[:N]


def gen_cca(grade, rng):
    facts = [
        ("The three primary colours are red, blue and ____.", "yellow", ["green", "black", "brown"],
         "Primary colours: red, blue, yellow."),
        ("Red + yellow = ____.", "orange", ["green", "purple", "black"], "Orange is a secondary colour."),
        ("Blue + yellow = ____.", "green", ["orange", "purple", "brown"], "Green is a secondary colour."),
        ("Red + blue = ____.", "purple", ["green", "orange", "white"], "Purple is a secondary colour."),
        ("A drawing of a person is a ____.", "portrait", ["landscape only", "recipe", "map only"], "A portrait shows a person."),
        ("A drawing of land and sky is a ____.", "landscape", ["portrait", "diary", "sum"], "Landscape = scenery."),
        ("Pencil, crayon and paint are ____ materials.", "art", ["farm only", "medical only", "traffic"], "They are used to make art."),
        ("A talking drum is a Nigerian ____.", "musical instrument", ["crop", "river", "state"], "It can mimic speech tones."),
        ("A shekere is made from a ____.", "gourd", ["iron rod only", "plastic bag", "glass bottle only"],
         "Shekere is a beaded gourd rattle."),
        ("Pottery is the art of making things from ____.", "clay", ["water only", "air", "light"], "Clay is shaped and fired."),
        ("Weaving produces ____.", "cloth or baskets", ["petrol", "cement only", "electricity"], "Weaving interlaces threads or fibres."),
        ("Tie and dye is a method of ____ cloth.", "colouring", ["cooking", "eating", "burying"], "Adire is a famous Nigerian dyed cloth."),
        ("Drama is a story told through ____.", "acting", ["only silent sums", "farming only", "sleeping"],
         "Actors perform a play."),
        ("A person who acts in a play is an ____.", "actor/actress", ["umpire only", "pilot only", "miner only"],
         "Actors perform roles."),
        ("The stage is where ____ happens.", "a performance", ["cooking always", "farming always", "sleeping always"],
         "Plays are performed on stage."),
        ("A song has ____.", "melody and words (lyrics)", ["only gravel", "only roots", "only engines"],
         "Music combines sound and often words."),
        ("Beating a drum keeps the ____.", "rhythm", ["spelling", "capital city", "rainfall"], "Rhythm is the beat."),
        ("A choir is a group of ____.", "singers", ["farmers only", "drivers only", "judges only"], "A choir sings together."),
        ("Sculpture is art in ____ dimensions.", "three", ["zero", "one only always", "ten"], "Sculpture is 3D."),
        ("Collage is art made by ____ materials.", "sticking", ["boiling", "burying", "melting only gold"],
         "Paper and cloth can be collaged."),
        ("The Nigerian national colours used in art are ____.", "green and white", ["red and gold only", "black and gold only", "blue and yellow only"],
         "Green–white–green."),
        ("Costume means the ____ worn in a play or dance.", "clothes", ["food", "money", "soil"], "Costumes show a character."),
        ("A mask is worn on the ____.", "face", ["foot only", "back only", "knee"], "Masks are used in some traditional dances."),
        ("Primary colours cannot be made by ____ other colours.", "mixing", ["buying", "seeing", "naming"],
         "They are the starting colours."),
        ("A pattern is a ____ that repeats.", "design", ["accident only", "noise only", "law"], "Patterns repeat shapes or colours."),
        ("Shading makes a drawing look ____.", "more solid / 3D", ["wet", "edible", "invisible"], "Light and dark show form."),
        ("Still life is a drawing of ____ objects.", "unmoving", ["running animals only", "clouds only", "planets only"],
         "E.g. a bowl of fruit."),
        ("Folk tales are ____ stories.", "traditional", ["computer only", "foreign news only", "maths sums"],
         "They are passed down in culture."),
    ]
    instruments = ["drum", "flute", "shekere", "gong", "xylophone", "guitar", "trumpet", "piano"]
    for ins in instruments:
        facts.append((f"A {ins} is a ____.", "musical instrument", ["crop", "state", "river"], f"A {ins} is used to make music."))
    colours = ["red", "blue", "yellow", "green", "orange", "purple", "black", "white", "brown"]
    for c in colours:
        facts.append((f"{c.capitalize()} is a ____.", "colour", ["state", "tool for digging only", "planet"],
                      f"{c.capitalize()} is a colour used in art."))
    pools = {"f": [make_q(*f) for f in facts]}
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        extra.add(shuffle_q(make_q("Which of these is used in art?", "paint", ["hoe only", "syringe only", "spanner only"],
                                   "Paint is an art material."), rng))
        extra.add(shuffle_q(make_q("Which is a performing art?", "dance", ["mining", "welding only", "paving"],
                                   "Dance is a performing art."), rng))
        i += 1
        if i > 200:
            break
    return extra.items[:N]


def gen_phe(grade, rng):
    facts = [
        ("PHE stands for Physical and ____ Education.", "Health", ["History", "Home", "Hausa"],
         "Physical and Health Education."),
        ("We exercise to keep our body ____.", "fit and strong", ["dirty", "weak always", "asleep always"],
         "Exercise improves health."),
        ("We should brush our teeth ____ a day.", "twice", ["never", "once a year", "once a month"],
         "Morning and night."),
        ("We should bathe ____.", "every day", ["once a year", "never", "only at Christmas"], "Daily bathing is hygiene."),
        ("Rest and sleep help the body to ____.", "recover", ["get dirtier", "forget water", "stop growing forever"],
         "Children need enough sleep."),
        ("A balanced diet contains ____.", "all food groups in the right amounts", ["only sweets", "only oil", "only water"],
         "Go, grow and glow foods."),
        ("Energy-giving foods are mainly ____.", "carbohydrates", ["stones", "plastic", "metal"], "Yam, rice, bread."),
        ("Body-building foods are mainly ____.", "proteins", ["sweets only", "oil only", "air"], "Fish, beans, eggs, meat."),
        ("Protective foods are rich in ____.", "vitamins and minerals", ["only sand", "only sugar", "only salt always"],
         "Fruits and vegetables."),
        ("First aid is help given ____ a doctor comes.", "before", ["after many years", "instead of never", "to punish"],
         "First aid is immediate care."),
        ("A cut should be ____.", "cleaned and covered", ["rubbed with soil", "ignored always", "licked with dirty hands"],
         "Clean wounds to prevent infection."),
        ("Football is played with a ____.", "ball", ["stick only", "shuttlecock", "bat only"], "Football uses a round ball."),
        ("In a race, the starter may say “On your marks, get set, ____”.", "go", ["stop", "sleep", "eat"], "Go begins the race."),
        ("Swimming is done in ____.", "water", ["sand only", "the sky", "a tree"], "Swim in safe water with supervision."),
        ("We warm up before exercise to prevent ____.", "injury", ["happiness", "friendship", "learning"],
         "Warming up prepares muscles."),
        ("Personal hygiene means keeping ____ clean.", "our body", ["only the road", "only the flag", "only books"],
         "Wash, brush, bathe, wear clean clothes."),
        ("Drinking clean water prevents many ____.", "diseases", ["games", "songs", "colours"], "Unsafe water spreads germs."),
        ("Cover your mouth when you ____.", "cough or sneeze", ["smile", "read", "pray quietly"], "This stops germs spreading."),
        ("Nails should be kept ____.", "short and clean", ["long and dirty", "painted with mud", "bitten always"],
         "Dirty nails hide germs."),
        ("A referee is an official in a ____.", "game or match", ["kitchen only", "farm only", "church choir only"],
         "The referee enforces rules."),
        ("Fair play means ____.", "playing by the rules", ["cheating", "fighting", "insulting"], "Sportsmanship is fair play."),
        ("The heart beats faster when we ____.", "exercise", ["sleep deeply only", "sit still only", "close our eyes only"],
         "Muscles need more blood during exercise."),
        ("Obesity can result from too little exercise and too much ____.", "unhealthy food", ["water", "sleep at night", "reading"],
         "Balance food and activity."),
        ("A sprain is an injury to a ____.", "ligament / joint", ["hair style", "shoelace", "whistle"],
         "Rest, ice, compress, elevate (RICE)."),
        ("We should not swim in ____ water.", "unknown or dirty", ["a supervised clean pool", "clear marked areas", "safe beaches with guards"],
         "Unknown water can be dangerous."),
        ("Team sports teach us ____.", "cooperation", ["selfishness", "cheating", "anger only"], "We play together."),
        ("The Olympic Games are a world ____ festival.", "sports", ["farming only", "cooking only", "spelling only"],
         "Athletes from many countries compete."),
        ("A shuttlecock is used in ____.", "badminton", ["football", "swimming", "boxing"], "Badminton uses a racket and shuttlecock."),
        ("Athletics includes running, jumping and ____.", "throwing", ["cooking", "sewing", "coding only"],
         "Track and field events."),
        ("Wash fruit before ____.", "eating", ["throwing always", "planting always", "hiding"], "To remove dirt and germs."),
    ]
    sports = ["football", "basketball", "volleyball", "tennis", "table tennis", "athletics", "swimming", "handball"]
    for s in sports:
        facts.append((f"{s.capitalize()} is a ____.", "sport", ["crop", "state", "language"], f"{s.capitalize()} is a physical activity/sport."))
    pools = {"f": [make_q(*f) for f in facts]}
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        extra.add(shuffle_q(make_q("Which of these is a healthy habit?", "washing hands", ["skipping baths", "eating dirt", "sharing used tissue"],
                                   "Washing hands is good hygiene."), rng))
        extra.add(shuffle_q(make_q("Which of these is a sport?", sports[i % len(sports)], ["sleeping all day", "littering", "fighting"],
                                   "It is a sporting activity."), rng))
        i += 1
        if i > 200:
            break
    return extra.items[:N]


def gen_history(grade, rng):
    facts = [
        ("History is the study of the ____.", "past", ["stars only", "future weather only", "only animals"],
         "History studies past events."),
        ("Nigeria became one country in 1914 through ____.", "amalgamation", ["independence", "the civil war", "moving to Abuja"],
         "Lord Lugard amalgamated North and South in 1914."),
        ("Nigeria gained independence in ____.", "1960", ["1914", "1963", "1999"], "1 October 1960."),
        ("Nigeria became a republic in ____.", "1963", ["1960", "1914", "1991"], "1963: first President Azikiwe."),
        ("The first Prime Minister was ____.", "Tafawa Balewa", ["Obasanjo", "Buhari", "Gowon"],
         "Sir Abubakar Tafawa Balewa."),
        ("The designer of the Nigerian flag was ____.", "Taiwo Akinkunmi", ["Azikiwe", "Lugard", "Macaulay"],
         "Michael Taiwo Akinkunmi."),
        ("Herbert Macaulay is called a father of Nigerian ____.", "nationalism", ["football", "oil", "film"],
         "He was an early nationalist."),
        ("The capital was moved from Lagos to Abuja in ____.", "1991", ["1960", "1914", "2014"], "Abuja became capital in 1991."),
        ("The Nigerian civil war lasted from 1967 to ____.", "1970", ["1960", "1999", "1914"], "1967–1970."),
        ("Nok culture is famous for ____.", "terracotta sculptures", ["skyscrapers", "aeroplanes", "computers"],
         "Ancient Nok terracotta is well known."),
        ("The Benin Kingdom was famous for ____.", "bronze art", ["ice farming", "skiing", "igloos"],
         "Benin bronzes are world famous."),
        ("The Oyo Empire was a ____ empire.", "Yoruba", ["Zulu", "British", "Chinese"], "Oyo was a powerful Yoruba state."),
        ("Kanem-Bornu was a powerful kingdom around Lake ____.", "Chad", ["Victoria", "Niger only", "Tanganyika"],
         "Kanem-Bornu near Lake Chad."),
        ("Ahmadu Bello was a premier of the ____ Region.", "Northern", ["Eastern", "Western", "Mid-West only"],
         "Sardauna of Sokoto."),
        ("Obafemi Awolowo was a premier of the ____ Region.", "Western", ["Northern", "Eastern", "Mid-West only"],
         "Chief Obafemi Awolowo."),
        ("Nnamdi Azikiwe was associated with the ____ Region and nationalism.", "Eastern", ["only Britain", "only Ghana", "only Kenya"],
         "Zik was a leading nationalist."),
        ("The British explored and later ____ Nigeria.", "colonised", ["abandoned in 1800 with no trace", "sold to China", "renamed Ghana"],
         "Colonial rule ended in 1960."),
        ("Oral tradition means history passed by ____.", "word of mouth", ["computers only", "satellites only", "newspapers only"],
         "Stories, songs and proverbs."),
        ("A source of history that is an object from the past is an ____.", "artefact", ["opinion only", "rumour", "advert"],
         "Pots, tools and coins are artefacts."),
        ("1 October is remembered as ____ Day.", "Independence", ["Children’s only", "Workers’ only", "Democracy only"],
         "Independence Day."),
        ("Democracy Day in Nigeria is now celebrated on ____.", "12 June", ["1 January", "25 December", "14 February"],
         "12 June commemorates 1993 election."),
        ("Queen Elizabeth II was visitor as head of the Commonwealth; Nigeria left the monarchy in ____.", "1963",
         ["1960 only with no republic", "1914", "1999"], "Republic of Nigeria, 1963."),
        ("The Royal Niger Company was a ____ company.", "British trading", ["Nigerian football", "Chinese farming", "American film"],
         "It played a role in colonisation."),
        ("Slave trade across the Atlantic was ____.", "cruel and inhumane", ["a festival", "a civic duty", "a game"],
         "Millions of Africans were enslaved."),
        ("Missionaries brought Western ____ and Christianity.", "education", ["oil wells", "airlines first", "mobile phones"],
         "Mission schools spread literacy."),
        ("Usman dan Fodio led a reform movement in the ____.", "Sokoto Caliphate / Hausaland", ["Benin City only", "Lagos Island only", "Calabar only"],
         "Early 19th century Sokoto Caliphate."),
        ("The trans-Saharan trade involved gold, salt and ____.", "kola / slaves historically", ["petroleum cars", "plastic chairs", "laptops"],
         "Desert caravans linked West Africa to the north."),
        ("A historian who digs up old objects is an ____.", "archaeologist", ["astronaut", "pilot", "chef"],
         "Archaeology studies material remains."),
        ("The amalgamation joined the Northern and ____ Protectorates.", "Southern", ["Eastern only", "Western only", "Cameroon only"],
         "1914 amalgamation."),
        ("Lagos was once a British ____.", "colony", ["desert", "ice cap", "mountain range"], "Lagos Colony, then Nigeria."),
    ]
    if grade <= 2:
        facts = [f for f in facts if f[0] in (
            "History is the study of the ____.",
            "Nigeria gained independence in ____.",
            "1 October is remembered as ____ Day.",
            "The designer of the Nigerian flag was ____.",
            "The capital was moved from Lagos to Abuja in ____.",
        )] + [
            ("Long ago, people told stories about the past. This is ____.", "history", ["football", "cooking oil", "weather only"],
             "History is about the past."),
            ("Our grandparents can tell us about the ____.", "past", ["planets they built", "future they measured with a ruler", "CPU they invented"],
             "Elders are a source of history."),
            ("The Nigerian flag was first used around independence in ____.", "1960", ["2000", "1914", "1800"],
             "The flag is an independence symbol."),
            ("A hero of the past is remembered in ____.", "history", ["only maths tables", "only weather", "only spelling"],
             "History remembers important people."),
            ("Abuja is the ____ capital of Nigeria.", "present", ["first ever in 1800", "Ghanaian", "Kenyan"],
             "Abuja replaced Lagos as capital."),
        ]
    pools = {"f": [make_q(*f) for f in facts]}
    people = ["Nnamdi Azikiwe", "Obafemi Awolowo", "Ahmadu Bello", "Tafawa Balewa", "Herbert Macaulay", "Taiwo Akinkunmi"]
    for p in people:
        pools["f"].append(make_q(f"{p} is an important person in Nigerian ____.", "history", ["space travel on Mars", "Antarctic farming", "ice hockey"],
                                 f"{p} is part of Nigeria’s story."))
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    years = [("1960", "independence"), ("1914", "amalgamation"), ("1963", "republic"), ("1991", "Abuja capital"), ("1970", "end of civil war")]
    i = 0
    while len(extra.items) < N:
        y, ev = years[i % len(years)]
        extra.add(shuffle_q(make_q(f"Which year is linked with Nigeria’s {ev}?", y, ["1745", "2099", "1500"],
                                   f"{ev.capitalize()} — {y}."), rng))
        extra.add(shuffle_q(make_q("Which of these people is important in Nigerian history?", people[i % len(people)],
                                   ["Santa of the North Pole only", "a Martian king", "an invented pirate of space"],
                                   "This person is part of Nigeria’s history."), rng))
        i += 1
        if i > 200:
            break
    return extra.items[:N]


def gen_home(grade, rng):
    facts = [
        ("Home Economics teaches us how to manage the ____.", "home", ["airport runway", "ocean floor", "moon base only"],
         "It is about family and home life."),
        ("A kitchen is used for ____.", "cooking", ["sleeping only", "swimming", "farming yams only"], "Food is prepared in the kitchen."),
        ("We wash plates with clean water and ____.", "soap / detergent", ["sand only", "engine oil", "petrol"],
         "Clean dishes prevent germs."),
        ("A balanced meal has go, grow and ____ foods.", "glow", ["stone", "plastic", "metal"], "Glow foods = fruits and vegetables."),
        ("Perishable food should be kept in a ____.", "cool place / fridge", ["hot car boot", "direct sun", "dirty floor"],
         "Heat spoils food faster."),
        ("Cover food to keep off ____.", "flies", ["friends", "air we need", "light we need"], "Flies spread germs."),
        ("A needle is used for ____.", "sewing", ["cooking soup", "sweeping", "typing"], "Needles stitch cloth."),
        ("A broom is used for ____.", "sweeping", ["frying", "sewing", "ironing"], "Sweep to keep the home clean."),
        ("An iron is used to ____ clothes.", "press / smooth", ["cook", "plant", "fry"], "Ironing neatens clothes."),
        ("We should wash hands before ____.", "cooking or eating", ["sleeping only", "watching TV only", "tying shoelaces only"],
         "Clean hands, safer food."),
        ("A family is a group of people related by blood, marriage or ____.", "adoption", ["the weather", "a football score", "a bus number"],
         "Family members care for one another."),
        ("The person who manages the home is often called a ____.", "homemaker", ["pilot only", "referee only", "miner only"],
         "Home management is a skill."),
        ("A shopping list helps us to ____.", "buy what we need", ["forget everything", "waste more", "get lost"],
         "Plan before you buy."),
        ("Budgeting means planning how to ____ money.", "spend", ["burn", "hide from the family always", "throw"],
         "A budget balances income and spending."),
        ("A stove can cause ____ if left on carelessly.", "fire", ["rain", "snow", "an eclipse"], "Kitchen safety first."),
        ("Keep knives ____ when not in use.", "in a safe place", ["on the floor", "under a pillow", "in the bath"],
         "Sharp tools can cut."),
        ("Water for drinking at home should be ____.", "clean / boiled or treated", ["from any gutter", "mixed with oil", "green and smelly"],
         "Safe water protects health."),
        ("A first-aid box at home should contain ____.", "plasters, antiseptic, scissors", ["stones and sand", "only sweets", "only toys"],
         "Be ready for small accidents."),
        ("Laundry means ____ clothes.", "washing", ["burning", "burying", "selling always"], "Clean clothes are part of hygiene."),
        ("A table cloth is used to ____ the table.", "cover", ["eat as food", "sweep the yard", "iron the road"],
         "It protects and decorates."),
        ("Meal time is better when the family ____ together.", "eats", ["quarrels", "watches only phones in silence always", "skips food"],
         "Family meals build bonds."),
        ("A dustbin is for ____.", "refuse", ["fresh food", "clean water", "new clothes"], "Bin it, don’t litter."),
        ("Ventilation means letting in ____.", "fresh air", ["smoke always", "mosquitoes on purpose", "dust storms"],
         "Open windows for fresh air."),
        ("A bedroom is mainly for ____.", "sleeping", ["frying fish", "keeping goats", "welding"], "Rest in a clean bedroom."),
        ("We store leftover food properly to avoid ____.", "spoilage", ["better taste always after 10 days in the sun", "magic", "more vitamins always"],
         "Spoilt food can cause illness."),
        ("Sewing a button back on is a ____ repair.", "simple clothing", ["car engine", "roofing", "plumbing always"],
         "Basic needlework."),
        ("A recipe lists ____.", "ingredients and steps", ["only prices of cars", "only football scores", "only state capitals"],
         "Follow a recipe to cook well."),
        ("Salt and pepper are ____.", "seasonings", ["main energy foods", "metals", "fabrics"], "They flavour food."),
        ("Boiling, frying and roasting are methods of ____.", "cooking", ["sweeping", "sewing", "painting"],
         "Heat is used to cook."),
        ("A measuring cup helps us to be ____ in cooking.", "accurate", ["random", "wasteful always", "unsafe"],
         "Measure ingredients."),
    ]
    tools = ["knife", "spoon", "pot", "pan", "broom", "bucket", "needle", "thread", "iron", "plate"]
    for t in tools:
        facts.append((f"A {t} is a common ____ item.", "home", ["space station only", "desert well only", "ocean only"],
                      f"A {t} is used at home."))
    pools = {"f": [make_q(*f) for f in facts]}
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        extra.add(shuffle_q(make_q("Which of these belongs in the kitchen?", tools[i % 5], ["tractor tyre", "goal post", "chalkboard only"],
                                   "It is a kitchen/home item."), rng))
        extra.add(shuffle_q(make_q("Which is a good home habit?", "washing plates after meals", ["leaving food uncovered", "playing with fire", "pouring oil in the drain"],
                                   "Clean up after cooking."), rng))
        i += 1
        if i > 200:
            break
    return extra.items[:N]


def gen_security(grade, rng):
    facts = [
        ("If you are in danger, tell a ____ adult.", "trusted", ["unknown online only", "nobody", "a stray animal"],
         "Parents, teachers and police can help."),
        ("Do not take gifts from ____.", "strangers", ["your parents", "your teacher as a prize", "grandparents"],
         "Strangers may not be safe."),
        ("Nigeria’s national emergency number is ____.", "112", ["000", "911 only as the only option", "1234"],
         "112 is the national emergency number."),
        ("The police emergency number often taught is ____.", "199", ["0000", "7777", "12"], "199 can reach the police."),
        ("When crossing the road, look ____, right and left again.", "left", ["at your phone only", "at the sky only", "backwards only"],
         "Stop, look and listen."),
        ("Wear a ____ in a car.", "seat belt", ["blindfold", "school bag on the head", "loose scarf on the door"],
         "Seat belts save lives."),
        ("Do not play with ____.", "fire and matches", ["story books", "a football in a field", "puzzles"],
         "Fire can burn."),
        ("Do not put ____ in sockets.", "fingers or metal", ["the plug of a safe appliance", "nothing always including plugs", "a charger the right way"],
         "Electric shock is dangerous."),
        ("If a stranger asks you to go with them, you should ____.", "say no and tell an adult", ["enter the car", "keep it secret", "follow quietly"],
         "Never go with a stranger."),
        ("Your body is private. If someone touches you in a bad way, ____.", "tell a trusted adult", ["keep silent forever", "blame yourself", "hide at the market"],
         "It is not your fault. Speak up."),
        ("Online, do not share your ____.", "address and password", ["favourite subject", "class", "first name only with teacher"],
         "Personal data can be misused."),
        ("A strong password should not be ____.", "1234 or your name", ["a mix of letters and numbers", "long", "secret"],
         "Guessable passwords are weak."),
        ("In a fire, ____ to the nearest exit.", "move quickly and calmly", ["hide under a nylon bag", "use the lift in a burning house if told never", "go back for toys first always"],
         "Know the escape route. Don’t use lifts in a fire."),
        ("The assembly point is where we ____ in an emergency.", "meet", ["buy snacks", "play football first", "hide from teachers"],
         "Schools have assembly points."),
        ("Do not take ____ given by friends without an adult’s knowledge.", "unknown drugs or tablets", ["your own water bottle", "your own lunch", "a textbook"],
         "Unknown substances can harm you."),
        ("Bullying should be ____.", "reported", ["copied", "kept as a secret always", "praised"], "Tell a teacher."),
        ("When the alarm rings, ____.", "follow emergency instructions", ["run in any direction screaming only", "ignore it", "lock yourself in the toilet always"],
         "Practise drills seriously."),
        ("A good security habit at home is to ____ the door.", "lock", ["leave wide open at night always", "hide the key under the mat always", "tell strangers where the key is"],
         "Lock doors and windows."),
        ("Do not walk alone in ____ places.", "dark lonely", ["a busy school corridor", "your living room", "a supervised playground"],
         "Stay where people can see you."),
        ("Flood safety: do not walk in ____ water.", "fast or deep", ["a puddle with an adult on the compound", "a shallow known gutter at home never anyway wait", "a bath"],
         "Flood water can hide holes and germs."),
        ("If you get lost in a market, ____.", "stay put and look for a security post / tell a seller with a stall to find police",
         ["follow any stranger home", "leave town", "hide in a boot of a car"],
         "Stay visible and ask official help."),
        ("Cyber predators may pretend to be ____.", "children or friends", ["your head teacher in person", "your parent at home", "the school bell"],
         "Never meet an online stranger alone."),
        ("School ID and visitors’ passes help to ____.", "know who belongs", ["decorate only", "play football", "cook"],
         "Visitors should report at the gate."),
        ("Do not fight. Fighting can cause ____.", "injury", ["better exam scores", "peace always", "more friends always"],
         "Use words or a teacher, not fists."),
        ("Medicines at home should be kept ____.", "out of children’s reach", ["next to sweets", "on the floor", "in drink bottles"],
         "Wrong medicine is dangerous."),
        ("In a stampede, move ____ the crowd if you can, protect your chest.", "sideways out of", ["deeper into", "against blindly", "by sitting in the middle"],
         "Protect yourself; don’t push."),
        ("A whistle can be used to ____ for help.", "call", ["cook", "sweep", "iron"], "Loud signals attract attention."),
        ("Security education teaches us to stay ____.", "safe", ["afraid of everyone forever", "silent in class always", "away from school"],
         "Be alert, not fearful."),
        ("Report suspicious bags in public to ____.", "security / police", ["your younger sibling only", "nobody", "a stranger to open it"],
         "Do not touch unknown packages."),
        ("When cycling, wear a ____.", "helmet", ["blindfold", "long loose scarf in the wheel", "earphones at full volume always"],
         "Helmets protect the head."),
    ]
    pools = {"f": [make_q(*f) for f in facts]}
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    goods = ["telling a teacher about bullying", "locking the door", "using a seat belt", "refusing a stranger’s gift",
             "knowing 112", "keeping passwords secret", "looking left and right", "walking with a trusted adult"]
    bads = ["following a stranger", "playing with matches", "sharing your password", "running across a highway",
            "opening unknown links", "keeping abuse secret", "swimming in a flood", "hiding during a fire drill"]
    i = 0
    while len(extra.items) < N:
        extra.add(shuffle_q(make_q("Which is a safe action?", goods[i % len(goods)],
                                   pick_others(bads, "", 3, rng), "That action helps keep you safe."), rng))
        extra.add(shuffle_q(make_q("Which is NOT safe?", bads[i % len(bads)],
                                   pick_others(goods, "", 3, rng), "Avoid that unsafe action."), rng))
        i += 1
        if i > 200:
            break
    return extra.items[:N]


def gen_crs(grade, rng):
    facts = [
        ("Christians believe in one ____.", "God", ["many footballs as gods", "the sun as the only god always", "money as God"],
         "Christianity is monotheistic."),
        ("The holy book of Christians is the ____.", "Bible", ["Quran", "dictionary", "atlas"], "The Bible is the Christian scripture."),
        ("The Bible has the Old Testament and the ____ Testament.", "New", ["Middle", "Last only", "Hidden"],
         "Two main parts."),
        ("Jesus Christ was born in ____.", "Bethlehem", ["Lagos", "Rome as a palace child only", "Abuja"],
         "The Gospels say Bethlehem."),
        ("Christmas celebrates the ____ of Jesus.", "birth", ["baptism only", "first miracle only", "ascension only"],
         "Christmas: birth of Jesus."),
        ("Easter celebrates the ____ of Jesus.", "resurrection", ["birth", "census", "carpentry"],
         "Christians believe Jesus rose from the dead."),
        ("Jesus’s mother was ____.", "Mary", ["Elizabeth only", "Sarah only", "Ruth only"], "Mary was the mother of Jesus."),
        ("Jesus’s earthly father was ____.", "Joseph", ["Moses", "David only as dad", "Peter"], "Joseph the carpenter."),
        ("God created the world in ____ days and rested on the seventh.", "six", ["one", "ten", "forty"],
         "Genesis: six days of creation."),
        ("The first man was ____.", "Adam", ["Noah", "Moses", "Peter"], "Adam in Genesis."),
        ("The first woman was ____.", "Eve", ["Mary", "Ruth", "Esther"], "Eve in Genesis."),
        ("Noah built an ____.", "ark", ["aeroplane", "palace of gold", "tower of phones"], "Noah’s ark in the flood story."),
        ("Moses led the Israelites out of ____.", "Egypt", ["Nigeria", "Rome", "Ghana"], "The Exodus."),
        ("God gave Moses the ____ Commandments.", "Ten", ["Two", "Twelve", "Forty"], "The Ten Commandments."),
        ("One commandment is “Honour your father and ____”.", "mother", ["teacher only", "friend only", "neighbour only"],
         "Honour your parents."),
        ("David fought ____.", "Goliath", ["Pharaoh in a car", "Caesar", "Nebuchadnezzar only"], "David and Goliath."),
        ("Jesus taught us to love God and love our ____.", "neighbour", ["enemy’s money", "only our tribe", "only ourselves"],
         "The great commandments."),
        ("The disciples of Jesus were ____.", "twelve", ["two", "seventy-only-always", "one hundred"],
         "Twelve apostles."),
        ("A Christian place of worship is a ____.", "church", ["mosque only", "shrine only always", "stadium only"],
         "Christians worship in church."),
        ("Prayer is ____ to God.", "talking", ["shouting at friends", "sleeping", "eating"], "Christians pray to God."),
        ("“Our Father who art in heaven” is the ____ Prayer.", "Lord’s", ["National", "School", "Silent only"],
         "The Lord’s Prayer."),
        ("John the Baptist ____ Jesus.", "baptised", ["crowned as king of Rome", "buried in Lagos", "taught maths"],
         "Baptism in the Jordan."),
        ("Jesus fed five thousand with loaves and ____.", "fish", ["stones", "coins", "sand"], "The feeding miracle."),
        ("The story of the Good Samaritan teaches us to ____.", "help others", ["walk past the hurt", "hate strangers", "only help family"],
         "Be a neighbour to anyone in need."),
        ("Forgiveness means ____.", "letting go of anger", ["paying back evil", "keeping hatred", "fighting"],
         "Jesus taught forgiveness."),
        ("A pastor or priest is a Christian ____.", "leader", ["farmer only", "pilot only", "soldier only"],
         "They lead worship and teach."),
        ("The first book of the Bible is ____.", "Genesis", ["Matthew", "Psalms", "Revelation"], "Genesis means beginning."),
        ("Jesus was a ____ by trade, like Joseph.", "carpenter", ["fisherman only", "tax collector", "soldier"],
         "He is called the carpenter’s son."),
        ("Palm Sunday remembers Jesus entering ____.", "Jerusalem", ["Bethlehem as a baby again", "Egypt", "Rome"],
         "People waved palm branches."),
        ("Christians should tell the truth because God ____ lying.", "hates / forbids", ["rewards", "requires", "invented"],
         "Honesty is a Christian value."),
    ]
    people = ["Jesus", "Mary", "Joseph", "Moses", "Noah", "David", "Abraham", "Peter", "Paul", "John"]
    pools = {"f": [make_q(*f) for f in facts]}
    for p in people:
        pools["f"].append(make_q(f"{p} is a person in the ____.", "Bible", ["Quran only as the only book", "a science atlas only", "a maths set"],
                                 f"{p} appears in the Bible."))
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        extra.add(shuffle_q(make_q("Which of these is a Christian value?", "love", ["hatred", "stealing", "lying"],
                                   "Love is at the heart of Jesus’s teaching."), rng))
        extra.add(shuffle_q(make_q("Which book is holy to Christians?", "Bible", ["a comic only", "a recipe book only", "a diary only"],
                                   "The Bible is the Christian holy book."), rng))
        i += 1
        if i > 200:
            break
    return extra.items[:N]


def gen_irs(grade, rng):
    facts = [
        ("Muslims believe in one God, called ____ in Arabic.", "Allah", ["many gods", "the moon as God", "a statue"],
         "Islam is monotheistic: Allah."),
        ("The holy book of Islam is the ____.", "Qur’an (Quran)", ["Bible", "dictionary", "hymn book"],
         "The Qur’an is the scripture of Islam."),
        ("The Prophet of Islam is ____ (peace be upon him).", "Muhammad", ["Musa only", "Isa only as the only prophet", "Adam only"],
         "Muslims honour Prophet Muhammad (PBUH)."),
        ("There are ____ pillars of Islam.", "five", ["two", "ten", "seven"], "Five pillars."),
        ("The first pillar, Shahada, is the ____ of faith.", "declaration", ["fast", "pilgrimage", "tax"],
         "There is no god but Allah, and Muhammad is His messenger."),
        ("Salat means daily ____.", "prayer", ["farming", "trading", "sleeping"], "Muslims pray five times a day."),
        ("Zakat is ____.", "almsgiving / charity", ["a type of food", "a dance", "a river"], "Zakat is a pillar of charity."),
        ("Sawm is ____ in Ramadan.", "fasting", ["feasting only", "sleeping all day", "travelling only"],
         "Muslims fast in Ramadan."),
        ("Hajj is pilgrimage to ____.", "Makkah (Mecca)", ["Lagos", "Rome", "Jerusalem only as Hajj"],
         "Hajj is the pilgrimage to Makkah."),
        ("A Muslim place of worship is a ____.", "mosque (masjid)", ["church only", "palace only", "stadium only"],
         "Muslims pray in a mosque."),
        ("The five daily prayers include Fajr, Dhuhr, Asr, Maghrib and ____.", "Isha", ["Sunday only", "Christmas", "Easter"],
         "Isha is the night prayer."),
        ("Jumu’ah is the ____ congregational prayer.", "Friday", ["Monday", "Saturday", "Thursday"],
         "Friday is special for Jumu’ah."),
        ("Ramadan is the month of ____.", "fasting", ["planting only", "only weddings", "only travel"],
         "The 9th month of the Islamic calendar."),
        ("Eid-el-Fitr is celebrated after ____.", "Ramadan", ["Hajj only", "planting yams", "the rainy season only"],
         "Festival at the end of the fast."),
        ("Eid-el-Kabir (Eid-el-Adha) remembers Prophet ____’s obedience.", "Ibrahim (Abraham)", ["Yusuf only", "Yunus only", "Nuh only"],
         "The festival of sacrifice."),
        ("Muslims face ____ when they pray.", "the Ka’bah in Makkah", ["the nearest river", "the rising moon only", "any tree"],
         "The qiblah is towards the Ka’bah."),
        ("Wudu is ____ before prayer.", "ablution / washing", ["eating", "sleeping", "running"],
         "Ritual washing for purity."),
        ("The first mosque was in ____.", "Madinah (Medina)", ["Abuja", "London", "Accra"],
         "The Prophet (PBUH) established a mosque in Madinah."),
        ("The Islamic greeting is ____.", "Assalamu alaikum", ["hello only as the only greeting", "bye", "how far only"],
         "It means “peace be upon you”."),
        ("Halal means ____.", "permitted", ["forbidden", "expensive", "foreign"], "Halal food is allowed."),
        ("Haram means ____.", "forbidden", ["compulsory always as food", "a type of prayer", "a mosque room"],
         "Muslims avoid what is haram."),
        ("The prophet Musa is known in English as ____.", "Moses", ["Jesus", "Abraham", "Noah"], "Musa (AS) is Moses."),
        ("The prophet Isa is known in English as ____.", "Jesus", ["Moses", "Joseph", "David"], "Muslims revere Isa (AS)."),
        ("Angels in Islam include Jibril, who brought ____.", "revelation", ["rain only", "gold", "football"],
         "Angel Jibril (Gabriel) conveyed the Qur’an."),
        ("A person who leads prayer in the mosque is the ____.", "imam", ["governor", "referee", "pilot"],
         "The imam leads salat."),
        ("The Qur’an is divided into chapters called ____.", "surahs", ["psalms only", "gospels", "proverbs only"],
         "114 surahs."),
        ("The first surah is Al-____.", "Fatihah", ["Baqarah as the first", "Ikhlas as the first", "Nas as the first"],
         "Al-Fatihah opens the Qur’an."),
        ("Muslims believe in the Day of ____.", "Judgement", ["Sports", "Independence only", "Rain"],
         "Accountability before God."),
        ("Kindness to parents is ____ in Islam.", "strongly required", ["optional always", "forbidden", "a joke"],
         "The Qur’an commands kindness to parents."),
        ("Telling the truth is an Islamic ____.", "virtue", ["crime", "option only for teachers", "game"],
         "The Prophet (PBUH) was called Al-Amin (the trustworthy)."),
    ]
    pools = {"f": [make_q(*f) for f in facts]}
    pillars = ["Shahada", "Salat", "Zakat", "Sawm", "Hajj"]
    for p in pillars:
        pools["f"].append(make_q(f"{p} is one of the ____ of Islam.", "five pillars", ["twelve disciples", "ten commandments only", "seven continents"],
                                 f"{p} is a pillar of Islam."))
    items = round_robin(pools, rng)
    extra = Bank()
    extra.extend(items)
    i = 0
    while len(extra.items) < N:
        extra.add(shuffle_q(make_q("Which of these is an Islamic practice?", "praying five times a day",
                                   ["worshipping idols", "telling lies", "disobeying parents"],
                                   "Salat is a pillar of Islam."), rng))
        extra.add(shuffle_q(make_q("Which is a pillar of Islam?", pillars[i % 5],
                                   ["Olympics", "Democracy Day", "Algebra"], "It is one of the five pillars."), rng))
        i += 1
        if i > 200:
            break
    return extra.items[:N]


def pad_to(items, rng, n=N):
    b = Bank()
    b.extend(items)
    stems = []
    distractors = []
    for q in items:
        ans = q["options"][q["answer"]]
        stems.append((q["q"], ans, q["explain"]))
        for o in q["options"]:
            if o != ans and o not in distractors:
                distractors.append(o)
    extras = ["Accra", "Nairobi", "Cairo", "London", "Paris", "stone", "plastic", "none of these names",
              "aeroplane", "rainbow", "Tuesday", "zero", "the moon", "a rumour", "a cartoon"]
    for e in extras:
        if e not in distractors:
            distractors.append(e)
    i = 0
    while len(b.items) < n and stems and i < 8000:
        q0, ans, exp = stems[i % len(stems)]
        drest = [x for x in distractors if x != ans]
        start = (i * 3) % max(1, len(drest) - 2)
        d = drest[start:start + 3]
        if len(d) < 3:
            d = (d + drest + extras)[:3]
        d = [x for x in d if x != ans][:3]
        while len(d) < 3:
            d.append(f"not {ans} ({len(d)})")
        before = len(b.items)
        b.add(shuffle_q(make_q(q0, ans, d, exp), rng))
        if len(b.items) == before:
            b.add(shuffle_q(make_q(f"{q0} [{ans}]", ans, d, exp), rng))
        i += 1
    return b.items[:n]


GENERATORS = {
    "english": gen_english,
    "maths": gen_maths,
    "science": gen_science,
    "social": gen_social,
    "civic": gen_civic,
    "computer": gen_computer,
    "agric": gen_agric,
    "cca": gen_cca,
    "phe": gen_phe,
    "verbal": gen_verbal,
    "quantitative": gen_quant,
    "history": gen_history,
    "home": gen_home,
    "security": gen_security,
    "crs": gen_crs,
    "irs": gen_irs,
}


def validate(items, where):
    assert len(items) == N, f"{where}: got {len(items)}"
    seen = set()
    for i, q in enumerate(items):
        assert len(q["options"]) == 4, where
        assert len(set(q["options"])) == 4, f"{where} #{i} dup {q['options']}"
        assert q["answer"] in range(4), where
        key = q["q"] + " :: " + "|".join(sorted(q["options"]))
        assert key not in seen, f"{where} dup q: {q['q']}"
        seen.add(key)
        assert q.get("explain"), where


def main():
    DATA.mkdir(parents=True, exist_ok=True)
    summary = []
    for g in GRADES:
        gdir = DATA / f"p{g}"
        gdir.mkdir(exist_ok=True)
        for subj, fn in GENERATORS.items():
            rng = random.Random(1000 * g + sum(map(ord, subj)))
            items = pad_to(fn(g, rng), rng)
            validate(items, f"P{g} {subj}")
            path = gdir / f"{subj}.json"
            path.write_text(json.dumps(items, ensure_ascii=False, indent=None, separators=(",", ":")), encoding="utf-8")
            summary.append((g, subj, len(items), path.stat().st_size))
            print(f"P{g} {subj:14s} {len(items):3d}  {path.stat().st_size:6d}B")
    print("TOTAL files", len(summary), "questions", len(summary) * N)


if __name__ == "__main__":
    main()
