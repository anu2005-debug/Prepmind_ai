"""Keep first 15 questions of each of the 4 files, delete the rest from DB (JEE + NEET) and JSON.
Dry run by default:  python -m scripts.trim_to_30
Apply:               python -m scripts.trim_to_30 --apply"""
import json, shutil, sys
from pathlib import Path
from src.database import get_connection

APPLY = "--apply" in sys.argv
FILES = {
    "data/questions/jee_physics_ray_optics.json": "Optics",
    "data/questions/jee_physics_wave_optics.json": "Optics",
    "data/questions/jee_physics_oscillations.json": "Oscillations and Waves",
    "data/questions/jee_physics_waves.json": "Oscillations and Waves",
}
KEEP = 15

conn = get_connection()
cur = conn.cursor()
plans = []
for path, chapter in FILES.items():
    qs = json.loads(Path(path).read_text(encoding="utf-8"))
    keep, drop = qs[:KEEP], qs[KEEP:]
    plans.append((path, chapter, keep, [q["question_text"] for q in drop]))
    print(f"{path}: {len(qs)} -> keep {len(keep)}, drop {len(drop)}")

if not APPLY:
    print("\nDry run only. Re-run with --apply to make changes.")
else:
    for path, chapter, keep, drop_texts in plans:
        shutil.copy(path, path + ".bak")
        cur.execute(
            """DELETE FROM practice_questions
               WHERE subject='Physics' AND chapter=%s
                 AND question_text = ANY(%s)""",
            (chapter, drop_texts),
        )
        print(f"deleted {cur.rowcount} rows for {Path(path).name}")
        Path(path).write_text(json.dumps(keep, ensure_ascii=False, indent=1), encoding="utf-8")
    conn.commit()

cur.execute("""SELECT exam, chapter, COUNT(*) FROM practice_questions
               WHERE chapter IN ('Optics','Oscillations and Waves')
               GROUP BY exam, chapter ORDER BY chapter, exam""")
print("\nCurrent counts:")
for r in cur.fetchall():
    print(r)
