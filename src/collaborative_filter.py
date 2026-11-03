import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


# Load interactions
interactions = pd.read_csv("data/interactions.csv")

# Create student-content interaction matrix
interaction_matrix = interactions.pivot_table(
    index="student_id",
    columns="content_id",
    values="score",
    fill_value=0
)


# Target student
student_id = "S001"


# Calculate similarity of target student with all students
student_vector = interaction_matrix.loc[[student_id]]

similarities = cosine_similarity(
    student_vector,
    interaction_matrix
)[0]


# Convert similarity results into a Series
similarity_df = pd.Series(
    similarities,
    index=interaction_matrix.index
)


# Remove the target student
similar_students = similarity_df.drop(student_id)


# Select top 3 similar students
top_students = similar_students.sort_values(
    ascending=False
).head(3)

print("\nTop Similar Students:")
print(top_students)


# Get the target student's exam
students = pd.read_csv("data/students.csv")

student_exam = students[
    students["student_id"] == student_id
]["exam"].iloc[0]


# Get content interacted with by similar students
similar_student_ids = top_students.index.tolist()

similar_interactions = interactions[
    interactions["student_id"].isin(similar_student_ids)
].copy()


# Get content already used by target student
student_content = interactions[
    interactions["student_id"] == student_id
]["content_id"].tolist()


# Remove content already used by target student
collaborative_recommendations = similar_interactions[
    ~similar_interactions["content_id"].isin(student_content)
].copy()


# Keep only content for the same exam
content = pd.read_csv("data/content.csv")

collaborative_recommendations = collaborative_recommendations.merge(
    content[
        [
            "content_id",
            "exam",
            "subject",
            "topic",
            "content_type",
            "difficulty"
        ]
    ],
    on="content_id"
)


collaborative_recommendations = collaborative_recommendations[
    collaborative_recommendations["exam"] == student_exam
]


# Calculate collaborative recommendation score
collaborative_recommendations["similarity"] = (
    collaborative_recommendations["student_id"]
    .map(top_students)
)

collaborative_recommendations["collaborative_score"] = (
    collaborative_recommendations["score"]
    * collaborative_recommendations["similarity"]
)


# Sort highest score first
collaborative_recommendations = (
    collaborative_recommendations
    .sort_values(
        "collaborative_score",
        ascending=False
    )
    .drop_duplicates("content_id")
)


print("\nCollaborative Recommendations:")

print(
    collaborative_recommendations[
        [
            "content_id",
            "exam",
            "subject",
            "topic",
            "content_type",
            "difficulty",
            "student_id",
            "score",
            "similarity",
            "collaborative_score"
        ]
    ]
)