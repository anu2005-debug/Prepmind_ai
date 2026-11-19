"""Run from the project root:  python -m scripts.seed_questions
Loads every JSON file in data/questions/ into practice_questions and
reports any chapter that does not have exactly 30 questions."""
import json
from pathlib import Path

from src.database import get_connection
from src.practice_questions import ensure_practice_questions_schema, QUESTIONS_PER_CHAPTER

QUESTIONS_DIR = Path("data/questions")


def main():
    ensure_practice_questions_schema()
    connection = get_connection()
    cursor = connection.cursor()
    inserted = 0

    for path in sorted(QUESTIONS_DIR.glob("*.json")):
        for q in json.loads(path.read_text(encoding="utf-8")):
            cursor.execute("""
                INSERT INTO practice_questions
                    (exam, subject, chapter, question_type, question_text,
                     options, correct_answer, explanation, difficulty)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (exam, subject, chapter, question_text) DO NOTHING
            """, (
                q.get("exam", "JEE"), q["subject"], q["chapter"],
                q["question_type"], q["question_text"],
                json.dumps(q["options"]) if q.get("options") else None,
                q["correct_answer"], q.get("explanation"),
                q.get("difficulty", "medium"),
            ))
            inserted += cursor.rowcount
    connection.commit()

    cursor.execute("""
        SELECT subject, chapter, COUNT(*) FROM practice_questions
        GROUP BY subject, chapter ORDER BY subject, chapter
    """)
    print(f"Inserted {inserted} new questions.\n")
    for subject, chapter, count in cursor.fetchall():
        flag = "" if count == QUESTIONS_PER_CHAPTER else f"  <-- needs {QUESTIONS_PER_CHAPTER - count} more" if count < QUESTIONS_PER_CHAPTER else "  <-- over 30"
        print(f"{subject:12} {chapter:40} {count}{flag}")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    main()