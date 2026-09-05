import re
import random

def make_q(question: str, correct: str, distractors: list[str], explain: str,
           hint: str = "", topic: str = "General", bloom: str = "Understand",
           difficulty: str = "Medium") -> dict | None:
    question = re.sub(r"\s+", " ", str(question)).strip()
    correct = str(correct).strip()
    opts = [correct]
    for d in distractors:
        s = str(d).strip()
        if s and s not in opts:
            opts.append(s)
        if len(opts) == 4:
            break
    if len(opts) < 4 or correct not in opts:
        return None
    if not hint:
        hint = f"Recall the core rules and principles of {topic}."
    return {
        "q": question,
        "options": opts,
        "answer": 0,
        "explain": explain.strip(),
        "hint": hint.strip(),
        "topic": topic.strip(),
        "bloom": bloom.strip(),
        "difficulty": difficulty.strip()
    }

class Bank:
    def __init__(self):
        self.items = []
        self.seen_stems = set()

    def add(self, q: dict | None, rng: random.Random) -> bool:
        if not q:
            return False
        # Normalize stem for deduplication
        stem_norm = re.sub(r"[^a-zA-Z0-9]+", "", q["q"]).lower()
        if stem_norm in self.seen_stems:
            return False
        opts = list(q["options"])
        if len(opts) != 4 or len(set(opts)) != 4:
            return False
        correct = opts[q["answer"]]
        rng.shuffle(opts)
        q_copy = dict(q)
        q_copy["options"] = opts
        q_copy["answer"] = opts.index(correct)
        self.seen_stems.add(stem_norm)
        self.items.append(q_copy)
        return True

    def extend(self, qs: list[dict], rng: random.Random):
        for q in qs:
            self.add(q, rng)

def near(n: int, extra: list[int] | None = None) -> list[str]:
    vals = [n + 1, n - 1, n + 2, n - 2, n + 5, n - 5, n + 10, abs(n * 2), abs(n - 10), n + 3, n + 4, max(1, n - 3), n + 7, n - 4]
    if extra:
        vals.extend(extra)
    out = []
    for v in vals:
        if v != n and v not in out:
            out.append(v)
    return [str(v) for v in out]

def pick_others(pool: list[str], keep: str, k: int = 3, rng: random.Random | None = None) -> list[str]:
    rest = [x for x in pool if str(x).strip() != str(keep).strip()]
    if rng:
        rng.shuffle(rest)
    return rest[:k]

def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return abs(a)

def lcm(a: int, b: int) -> int:
    return abs(a * b) // gcd(a, b) if a and b else 0
