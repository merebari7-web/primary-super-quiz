#!/usr/bin/env python3
"""
Primary Super Quiz - Master Bank Generator & Validator
Generates 100 unique, curriculum-aligned, pedagogically rigorous MCQs
per subject (16 subjects) per class (Primary 1–6) = 9,600 questions in total.
"""
from __future__ import annotations

import json
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

from generators.maths import gen_maths
from generators.quantitative import gen_quant
from generators.english import gen_english
from generators.verbal import gen_verbal
from generators.science import gen_science
from generators.social import gen_social
from generators.civic import gen_civic
from generators.computer import gen_computer
from generators.agric import gen_agric
from generators.cca import gen_cca
from generators.phe import gen_phe
from generators.history import gen_history
from generators.home import gen_home
from generators.security import gen_security
from generators.crs import gen_crs
from generators.irs import gen_irs

SUBJECT_GENS = {
    "maths": gen_maths,
    "quantitative": gen_quant,
    "english": gen_english,
    "verbal": gen_verbal,
    "science": gen_science,
    "social": gen_social,
    "civic": gen_civic,
    "computer": gen_computer,
    "agric": gen_agric,
    "cca": gen_cca,
    "phe": gen_phe,
    "history": gen_history,
    "home": gen_home,
    "security": gen_security,
    "crs": gen_crs,
    "irs": gen_irs
}

GRADES = (1, 2, 3, 4, 5, 6)

def main():
    print("=" * 60)
    print("Generating 9,600 Curriculum-Aligned Primary Questions...")
    print("=" * 60)
    
    rng_master = random.Random(20260905)
    total_generated = 0
    errors = 0

    for grade in GRADES:
        grade_dir = DATA / f"p{grade}"
        grade_dir.mkdir(parents=True, exist_ok=True)
        
        for subj_key, gen_fn in SUBJECT_GENS.items():
            seed = grade * 1000 + hash(subj_key) % 10000
            rng = random.Random(seed)
            
            items = gen_fn(grade, rng)
            
            # Strict validation
            if len(items) != 100:
                print(f"[ERROR] {grade_dir.name}/{subj_key}.json has {len(items)} items instead of 100!")
                errors += 1
                
            stems = set()
            for idx, q in enumerate(items):
                stem_norm = q["q"].strip().lower()
                if stem_norm in stems:
                    print(f"[ERROR] Duplicate stem in {grade_dir.name}/{subj_key}.json item {idx}: {q['q']}")
                    errors += 1
                stems.add(stem_norm)
                
                if len(q["options"]) != 4:
                    print(f"[ERROR] Item {idx} in {grade_dir.name}/{subj_key}.json does not have 4 options.")
                    errors += 1
                if q["answer"] not in range(4):
                    print(f"[ERROR] Item {idx} answer index {q['answer']} invalid in {grade_dir.name}/{subj_key}.json")
                    errors += 1
                if not q.get("explain"):
                    print(f"[ERROR] Item {idx} has missing explanation.")
                    errors += 1
                if not q.get("hint"):
                    print(f"[ERROR] Item {idx} has missing hint.")
                    errors += 1
                if not q.get("topic"):
                    print(f"[ERROR] Item {idx} has missing topic.")
                    errors += 1

            out_path = grade_dir / f"{subj_key}.json"
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(items, f, ensure_ascii=False, indent=2)
                
            total_generated += len(items)

    print("-" * 60)
    print(f"Generation complete: {total_generated} items across {len(GRADES) * len(SUBJECT_GENS)} files.")
    if errors == 0:
        print("[SUCCESS] All 9,600 questions generated with 100% uniqueness and zero errors!")
    else:
        print(f"[FAILURE] Found {errors} validation errors.")
        sys.exit(1)

if __name__ == "__main__":
    main()
