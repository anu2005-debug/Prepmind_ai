import pandas as pd


def recommend_content(student_id):
    interactions = pd.read_csv("data/interactions.csv")
    content = pd.read_csv("data/content.csv")

    # Get student's interactions
    student_data = interactions[
        interactions["student_id"] == student_id
    ]

    # Connect interactions with content information
    student_data = student_data.merge(
        content,
        on="content_id"
    )

    # Calculate average score for each topic
    topic_scores = (
        student_data
        .groupby("topic")["score"]
        .mean()
        .reset_index()
    )

    # Find weak topics
    weak_topics = topic_scores[
        topic_scores["score"] < 60
    ]

    # Get student's exam
    student_exam = student_data["exam"].iloc[0]

    # Find content for weak topics and student's exam
    recommendations = content[
        (content["topic"].isin(weak_topics["topic"])) &
        (content["exam"] == student_exam)
    ].copy()

    # Remove already attempted content
    attempted_content = student_data["content_id"].tolist()

    recommendations = recommendations[
        ~recommendations["content_id"].isin(attempted_content)
    ].copy()

    # Find preferred difficulty for each weak topic
    def get_preferred_difficulty(topic):
        score = weak_topics[
            weak_topics["topic"] == topic
        ]["score"].iloc[0]

        if score < 40:
            return "Easy"
        elif score <= 60:
            return "Medium"
        else:
            return "Hard"

    recommendations["preferred_difficulty"] = recommendations[
        "topic"
    ].apply(get_preferred_difficulty)

    # Check difficulty match
    recommendations["difficulty_match"] = (
        recommendations["difficulty"]
        == recommendations["preferred_difficulty"]
    )

    # Calculate topic weakness score
    def get_weakness_score(topic):
        score = weak_topics[
            weak_topics["topic"] == topic
        ]["score"].iloc[0]

        return 100 - score

    recommendations["weakness_score"] = recommendations[
        "topic"
    ].apply(get_weakness_score)

    # Give points for difficulty match
    recommendations["difficulty_score"] = (
        recommendations["difficulty_match"].astype(int) * 30
    )

    # Give points based on content type
    content_type_scores = {
        "Lecture": 20,
        "DPP": 25,
        "Practice": 25,
        "PYQ": 30
    }

    recommendations["content_type_score"] = recommendations[
        "content_type"
    ].map(content_type_scores).fillna(10)

    # Final recommendation score
    recommendations["recommendation_score"] = (
        recommendations["weakness_score"] * 0.5
        + recommendations["difficulty_score"]
        + recommendations["content_type_score"]
    )

    # Sort highest score first
    recommendations = recommendations.sort_values(
    "recommendation_score",
    ascending=False
    ).reset_index(drop=True)

    # Add recommendation rank
    recommendations["rank"] = range(1, len(recommendations) + 1)

    return recommendations


# Test
student_id = "S001"

recommendations = recommend_content(student_id)

print("\nRecommended Content for", student_id)

print(
    recommendations[
        [
            "rank",
            "content_id",
            "exam",
            "subject",
            "topic",
            "content_type",
            "difficulty",
            "preferred_difficulty",
            "recommendation_score"
        ]
    ]
)