from datetime import date

from src.database import get_connection


def add_feedback(
    student_id,
    content_id,
    score,
    time_spent
):

    connection = get_connection()

    cursor = connection.cursor()

    # Check whether this student already has feedback
    # for this content
    cursor.execute(
        """
        SELECT interaction_id
        FROM interactions
        WHERE student_id = %s
        AND content_id = %s
        ORDER BY interaction_id DESC
        LIMIT 1
        """,
        (student_id, content_id)
    )

    existing = cursor.fetchone()

    # If already exists, update the latest record
    if existing:

        interaction_id = existing[0]

        cursor.execute(
            """
            UPDATE interactions
            SET action = %s,
                score = %s,
                time_spent = %s,
                timestamp = %s
            WHERE interaction_id = %s
            """,
            (
                "completed",
                score,
                time_spent,
                date.today(),
                interaction_id
            )
        )

    # Otherwise add a new interaction
    else:

        cursor.execute(
            """
            INSERT INTO interactions
            (
                student_id,
                content_id,
                action,
                score,
                time_spent,
                timestamp
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                student_id,
                content_id,
                "completed",
                score,
                time_spent,
                date.today()
            )
        )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Feedback recorded successfully",
        "student_id": student_id,
        "content_id": content_id,
        "score": score,
        "time_spent": time_spent
    }