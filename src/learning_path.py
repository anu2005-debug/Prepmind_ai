import pandas as pd

from src.database import (
    load_students,
    load_content,
    load_interactions
)

from src.difficulty_engine import get_adaptive_difficulty


def generate_learning_path(student_id):

    students = load_students()
    content = load_content()
    interactions = load_interactions()

    student_exam = students[
        students["student_id"] == student_id
    ]["exam"].iloc[0]

    student_data = interactions[
        interactions["student_id"] == student_id
    ]

    student_data = student_data.merge(
        content,
        on="content_id",
        how="left"
    )

    topic_scores = (
        student_data
        .groupby("topic")["score"]
        .mean()
        .reset_index()
    )

    learning_path = []

    content_order = {
        "Lecture": 1,
        "Practice": 2,
        "DPP": 3,
        "PYQ": 4
    }

    attempted_content = student_data["content_id"].tolist()

    for _, row in topic_scores.iterrows():

        topic = row["topic"]
        score = row["score"]

        difficulty = get_adaptive_difficulty(
            student_id,
            topic
        )

        topic_content = content[
            (content["topic"] == topic) &
            (content["difficulty"] == difficulty) &
            (content["exam"] == student_exam)
        ].copy()

        topic_content = topic_content[
            ~topic_content["content_id"].isin(
                attempted_content
            )
        ].copy()

        topic_content["order"] = (
            topic_content["content_type"]
            .map(content_order)
        )

        topic_content = topic_content.sort_values("order")

        for _, resource in topic_content.iterrows():

            learning_path.append({
                "topic": topic,
                "current_score": score,
                "difficulty": difficulty,
                "content_id": resource["content_id"],
                "content_type": resource["content_type"],
                "duration": resource["duration"]
            })

    return pd.DataFrame(learning_path)


if __name__ == "__main__":

    student_id = "S001"

    path = generate_learning_path(student_id)

    print("\nPersonalized Learning Path:")
    print(path)