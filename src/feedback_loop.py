import pandas as pd
from datetime import datetime


def update_student_performance(
    student_id,
    content_id,
    new_score,
    time_spent
):
    interactions = pd.read_csv("data/interactions.csv")
    content = pd.read_csv("data/content.csv")

    # Find the topic of the completed content
    content_info = content[
        content["content_id"] == content_id
    ]

    if content_info.empty:
        print("Content not found.")
        return

    topic = content_info.iloc[0]["topic"]

    # Get current date and time automatically
    current_timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    # Add new interaction
    new_interaction = pd.DataFrame([{
        "student_id": student_id,
        "content_id": content_id,
        "action": "completed",
        "score": new_score,
        "time_spent": time_spent,
        "timestamp": current_timestamp
    }])

    interactions = pd.concat(
        [interactions, new_interaction],
        ignore_index=True
    )

    # Save updated interactions
    interactions.to_csv(
        "data/interactions.csv",
        index=False
    )

    print("Performance updated successfully.")
    print("Student:", student_id)
    print("Topic:", topic)
    print("New Score:", new_score)
    print("Timestamp:", current_timestamp)


# Example:
# S001 completes Easy Calculus lecture C035
# update_student_performance(
#     "S001",
#     "C035",
#     75,
#     38
# )