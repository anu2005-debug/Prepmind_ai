from src.database import get_connection

conn = get_connection()
cur = conn.cursor()

print("Counts by exam for the 60-question chapters:")
cur.execute("""
    SELECT exam, subject, chapter, COUNT(*) FROM practice_questions
    WHERE subject='Physics' AND chapter IN ('Optics','Oscillations and Waves')
    GROUP BY exam, subject, chapter ORDER BY chapter, exam
""")
for r in cur.fetchall():
    print(r)

print("\nSame question text appearing more than once within a chapter (any exam):")
cur.execute("""
    SELECT chapter, question_text, COUNT(*), array_agg(exam)
    FROM practice_questions
    WHERE subject='Physics' AND chapter IN ('Optics','Oscillations and Waves')
    GROUP BY chapter, question_text HAVING COUNT(*) > 1
    LIMIT 10
""")
rows = cur.fetchall()
print(len(rows), "shown (max 10)")
for r in rows:
    print(r)

print("\nExam totals across all chapters:")
cur.execute("SELECT exam, subject, COUNT(*) FROM practice_questions GROUP BY exam, subject ORDER BY exam, subject")
for r in cur.fetchall():
    print(r)
