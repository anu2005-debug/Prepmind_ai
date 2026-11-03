import pandas as pd

from src.database import load_interactions, load_content


def find_knowledge_gaps(student_id):

    interactions = load_interactions()
    content = load_content()

    student_data = interactions[
        interactions["student_id"] == student_id
    ]

    student_data = student_data.merge(
        content,
        on="content_id"
    )

    topic_scores = (
        student_data
        .groupby("topic")["score"]
        .mean()
        .reset_index()
    )

    knowledge_gaps = topic_scores[
        topic_scores["score"] < 60
    ]

    return knowledge_gaps.sort_values("score")


if __name__ == "__main__":

    student_id = "S001"

    gaps = find_knowledge_gaps(student_id)

    print("Knowledge Gaps for", student_id)
    print(gaps)