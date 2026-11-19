"""Place this file at src/practice_questions.py

In src/api.py:
    from src.practice_questions import router as practice_router, ensure_practice_questions_schema, grade_answer
    app.include_router(practice_router)
and call ensure_practice_questions_schema() inside startup_event().
"""
import math
import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException

from src.database import get_connection

router = APIRouter(prefix="/practice", tags=["practice"])

QUESTIONS_PER_CHAPTER = 30

# The React page uses these labels for question types.
TYPE_LABELS = {
    "mcq": "MCQ",
    "multiple": "Multiple Correct",
    "numerical": "Numerical",
}


def exam_family(exam: str) -> str:
    """JEE Main / JEE Advanced share one question bank."""
    value = (exam or "").strip().upper()
    return "JEE" if value.startswith(("JEE", "WBJEE")) else value


# JEE Advanced uses different chapter names from JEE Main. These point each
# Advanced chapter at the Main chapter(s) holding the questions.
CHAPTER_ALIASES = {
    ("Physics", "General Physics and Measurement"): ["Units and Measurements"],
    ("Physics", "Mechanical Properties of Matter"): ["Properties of Solids and Liquids"],
    ("Physics", "Thermal Physics"): ["Thermodynamics", "Kinetic Theory of Gases"],
    ("Physics", "Magnetism"): ["Magnetic Effects of Current and Magnetism"],
    ("Physics", "Electromagnetic Induction"): ["Electromagnetic Induction and AC"],
    ("Physics", "Alternating Current"): ["Electromagnetic Induction and AC"],
    ("Physics", "Modern Physics"): ["Dual Nature of Matter and Radiation", "Atoms and Nuclei"],
    ("Chemistry", "Basic Concepts"): ["Some Basic Concepts of Chemistry"],
    ("Chemistry", "Chemical Bonding"): ["Chemical Bonding and Molecular Structure"],
    ("Chemistry", "Chemical and Ionic Equilibrium"): ["Equilibrium"],
    ("Chemistry", "Redox Reactions"): ["Redox Reactions and Electrochemistry"],
    ("Chemistry", "Electrochemistry"): ["Redox Reactions and Electrochemistry"],
    ("Chemistry", "Periodic Properties"): ["Classification of Elements and Periodicity"],
    ("Chemistry", "Basic Organic Chemistry"): ["Some Basic Principles of Organic Chemistry"],
    ("Chemistry", "Organic Compounds with Functional Groups"): [
        "Organic Compounds Containing Halogens",
        "Organic Compounds Containing Oxygen",
        "Organic Compounds Containing Nitrogen",
    ],
    ("Mathematics", "Complex Numbers"): ["Complex Numbers and Quadratic Equations"],
    ("Mathematics", "Analytical Geometry"): ["Coordinate Geometry"],
    ("Mathematics", "Differential Calculus"): ["Limits, Continuity and Differentiability"],
    ("Mathematics", "Vectors"): ["Vector Algebra"],
    ("Mathematics", "Probability"): ["Statistics and Probability"],
}



# WBJEE chapter names -> JEE bank chapters.
WBJEE_ALIASES = {
    ("Physics", "Physical World, Units and Measurements"): ["Units and Measurements"],
    ("Physics", "Properties of Matter"): ["Properties of Solids and Liquids"],
    ("Physics", "Heat and Thermodynamics"): ["Thermodynamics", "Kinetic Theory of Gases"],
    ("Physics", "Semiconductor Electronics"): ["Electronic Devices"],
    ("Chemistry", "Chemical Energetics"): ["Chemical Thermodynamics"],
    ("Chemistry", "Chemical Equilibrium"): ["Equilibrium"],
    ("Chemistry", "Periodic Table"): ["Classification of Elements and Periodicity"],
    ("Chemistry", "s-, p-, d- and f-Block Elements"): ["Hydrogen and s-Block Elements", "p-Block Elements", "d- and f-Block Elements"],
    ("Chemistry", "Organic Chemistry Basics"): ["Some Basic Principles of Organic Chemistry"],
    ("Chemistry", "Organic Functional Groups"): ["Organic Compounds Containing Halogens", "Organic Compounds Containing Oxygen", "Organic Compounds Containing Nitrogen"],
    ("Chemistry", "Polymers and Biomolecules"): ["Biomolecules"],
    ("Mathematics", "Quadratic Equations"): ["Complex Numbers and Quadratic Equations"],
    ("Mathematics", "Logarithms"): ["Algebra"],
    ("Mathematics", "Permutation and Combination"): ["Permutations and Combinations"],
}
CHAPTER_ALIASES.update(WBJEE_ALIASES)


def resolve_chapters(subject: str, chapter: str):
    return CHAPTER_ALIASES.get((subject.strip(), chapter.strip())) or [chapter.strip()]


def ensure_practice_questions_schema():
    connection = cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS practice_questions (
                question_id SERIAL PRIMARY KEY,
                exam VARCHAR(50) NOT NULL DEFAULT 'JEE',
                subject VARCHAR(50) NOT NULL,
                chapter VARCHAR(255) NOT NULL,
                question_type VARCHAR(30) NOT NULL,   -- mcq | multiple | numerical
                question_text TEXT NOT NULL,
                options JSONB,                        -- {"A": "...", "B": "..."} (null for numerical)
                correct_answer TEXT NOT NULL,         -- "B" | "A,C" | "15"
                explanation TEXT,
                difficulty VARCHAR(20) DEFAULT 'medium',
                UNIQUE (exam, subject, chapter, question_text)
            )
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_practice_questions_chapter
            ON practice_questions (exam, subject, chapter)
        """)
        connection.commit()
    except Exception as error:
        if connection:
            connection.rollback()
        print("Practice questions schema error:", error)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def grade_answer(question_type: str, selected: Optional[str], correct: str) -> bool:
    """Server-side grading. Never trust is_correct from the client."""
    if selected is None or not str(selected).strip():
        return False
    selected = str(selected).strip()
    kind = (question_type or "").lower()

    if kind == "numerical":
        try:
            return math.isclose(float(selected), float(correct),
                                rel_tol=1e-3, abs_tol=0.01)
        except ValueError:
            return False

    if kind == "multiple":
        chosen = {s.strip().upper() for s in selected.split(",") if s.strip()}
        right = {s.strip().upper() for s in correct.split(",") if s.strip()}
        return chosen == right

    return selected.upper() == correct.strip().upper()


@router.get("/questions")
def get_practice_questions(exam: str, subject: str, chapter: Optional[str] = None):
    """Return up to 30 questions WITHOUT answers.

    With a chapter: that chapter's questions in a fixed order.
    Without a chapter: a random mix from the whole subject.
    Options are returned as an ordered list (position 0 = A, 1 = B, ...).
    """
    connection = cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()

        if chapter and chapter.strip():
            chapters = resolve_chapters(subject, chapter)
            cursor.execute("""
                SELECT question_id, subject, chapter, question_type,
                       question_text, options, difficulty
                FROM practice_questions
                WHERE exam = %s AND subject = %s AND chapter = ANY(%s)
                ORDER BY CASE WHEN cardinality(%s::text[]) > 1 THEN random() END,
                         question_id
                LIMIT %s
            """, (exam_family(exam), subject.strip(), chapters, chapters,
                  QUESTIONS_PER_CHAPTER))
        else:
            cursor.execute("""
                SELECT question_id, subject, chapter, question_type,
                       question_text, options, difficulty
                FROM practice_questions
                WHERE exam = %s AND subject = %s
                ORDER BY random()
                LIMIT %s
            """, (exam_family(exam), subject.strip(), QUESTIONS_PER_CHAPTER))

        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(
                status_code=404,
                detail="No practice questions available for this chapter yet."
            )

        questions = []
        for r in rows:
            options = r[5] or {}
            questions.append({
                "id": r[0],
                "subject": r[1],
                "chapter": r[2],
                "type": TYPE_LABELS.get(r[3], "MCQ"),
                "question": r[4],
                "options": [options[key] for key in sorted(options)],
                "difficulty": r[6],
            })

        return {
            "test_id": str(uuid.uuid4()),
            "exam": exam_family(exam),
            "subject": subject,
            "chapter": chapter or None,
            "total_questions": len(questions),
            "questions": questions,
        }
    except HTTPException:
        raise
    except Exception as error:
        print("Get practice questions error:", repr(error))
        raise HTTPException(status_code=500, detail="Unable to load questions.")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@router.get("/counts")
def get_practice_counts(exam: str):
    """Questions available per subject and chapter (capped at 30)."""
    connection = cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT subject, chapter, LEAST(COUNT(*), %s)
            FROM practice_questions
            WHERE exam = %s
            GROUP BY subject, chapter
        """, (QUESTIONS_PER_CHAPTER, exam_family(exam)))

        counts = {}
        for subject, chapter, total in cursor.fetchall():
            counts.setdefault(subject, {})[chapter] = int(total)

        for (subject, alias), targets in CHAPTER_ALIASES.items():
            found = sum(counts.get(subject, {}).get(t, 0) for t in targets)
            if found:
                counts.setdefault(subject, {})[alias] = min(found, QUESTIONS_PER_CHAPTER)

        return {"exam": exam_family(exam), "counts": counts}
    except Exception as error:
        print("Get practice counts error:", repr(error))
        raise HTTPException(status_code=500, detail="Unable to load question counts.")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()