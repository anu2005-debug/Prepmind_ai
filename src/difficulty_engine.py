import pandas as pd

from src.database import load_interactions, load_content


def get_adaptive_difficulty(student_id, topic):

    interactions = load_interactions()
    content = load_content()

    student_data = interactions[
        interactions["student_id"] == student_id
    ]

    student_data = student_data.merge(
        content[["content_id", "topic"]],
        on="content_id",
        how="left"
    )

    topic_data = student_data[
        student_data["topic"] == topic
    ].copy()

    if topic_data.empty:
        return "Easy"

    topic_data = topic_data.sort_values(
        "timestamp",
        ascending=False
    )

    average_score = topic_data["score"].mean()
    recent_score = topic_data.iloc[0]["score"]

    if average_score < 40 or recent_score < 40:
        difficulty = "Easy"

    elif average_score < 60 or recent_score < 60:
        difficulty = "Medium"

    elif average_score < 80 or recent_score < 80:
        difficulty = "Hard"

    else:
        difficulty = "Advanced"

    return difficulty


if __name__ == "__main__":

    student_id = "S001"
    topic = "Calculus"

    difficulty = get_adaptive_difficulty(
        student_id,
        topic
    )

    print(
        f"Adaptive difficulty for {student_id} "
        f"in {topic}: {difficulty}"
    )