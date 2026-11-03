# ==================================================
# HYBRID RECOMMENDER
# PrepMind AI
# ==================================================

import numpy as np
import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity

from src.database import (
    load_students,
    load_content,
    load_interactions
)

try:
    from src.difficulty_engine import get_adaptive_difficulty
except Exception:
    get_adaptive_difficulty = None


# ==================================================
# CONFIGURATION
# ==================================================

CONTENT_WEIGHT = 0.60
COLLABORATIVE_WEIGHT = 0.40

DEFAULT_TOP_N = 6

DIFFICULTY_LEVELS = {
    "Easy": 1,
    "Medium": 2,
    "Hard": 3,
    "Advanced": 4
}

CONTENT_TYPE_SCORES = {
    "Lecture": 10,
    "Video": 10,
    "Notes": 10,
    "Practice": 25,
    "Question": 25,
    "DPP": 30,
    "PYQ": 35,
    "Mock Test": 35,
    "Test": 35
}


# ==================================================
# SAFE DATA LOADING
# ==================================================

def _safe_load_students():

    try:

        students = load_students()

        if students is None:
            return pd.DataFrame()

        return students.copy()

    except Exception as error:

        print(
            "Student data loading error:",
            error
        )

        return pd.DataFrame()


def _safe_load_content():

    try:

        content = load_content()

        if content is None:
            return pd.DataFrame()

        return content.copy()

    except Exception as error:

        print(
            "Content data loading error:",
            error
        )

        return pd.DataFrame()


def _safe_load_interactions():

    try:

        interactions = load_interactions()

        if interactions is None:
            return pd.DataFrame()

        return interactions.copy()

    except Exception as error:

        print(
            "Interaction data loading error:",
            error
        )

        return pd.DataFrame()


# ==================================================
# CLEAN DATAFRAME
# ==================================================

def _remove_duplicate_columns(
    dataframe
):

    if dataframe is None:
        return pd.DataFrame()

    dataframe = dataframe.copy()

    # ------------------------------------------------
    # IMPORTANT FIX
    #
    # Duplicate column names can make:
    #
    # dataframe["difficulty"]
    #
    # return a DataFrame instead of a Series.
    #
    # This was causing:
    #
    # Cannot set a DataFrame with multiple columns
    # to the single column difficulty_score
    # ------------------------------------------------

    dataframe = dataframe.loc[
        :,
        ~dataframe.columns.duplicated(
            keep="first"
        )
    ].copy()

    return dataframe


# ==================================================
# NORMALIZE COLUMN NAMES
# ==================================================

def _normalize_columns(
    dataframe
):

    dataframe = _remove_duplicate_columns(
        dataframe
    )

    dataframe.columns = [
        str(column).strip()
        for column in dataframe.columns
    ]

    return dataframe


# ==================================================
# ENSURE REQUIRED CONTENT COLUMNS
# ==================================================

def _prepare_content_dataframe(
    content
):

    content = _normalize_columns(
        content
    )

    if content.empty:
        return content

    # ------------------------------------------------
    # Required fallback columns
    # ------------------------------------------------

    if "content_id" not in content.columns:

        content["content_id"] = (
            content.index.astype(str)
        )

    if "topic" not in content.columns:

        content["topic"] = "General"

    if "subject" not in content.columns:

        content["subject"] = "General"

    if "content_type" not in content.columns:

        content["content_type"] = "Practice"

    if "difficulty" not in content.columns:

        content["difficulty"] = "Medium"

    # ------------------------------------------------
    # Clean values
    # ------------------------------------------------

    content["content_id"] = (
        content["content_id"]
        .astype(str)
        .str.strip()
    )

    content["topic"] = (
        content["topic"]
        .fillna("General")
        .astype(str)
        .str.strip()
    )

    content["subject"] = (
        content["subject"]
        .fillna("General")
        .astype(str)
        .str.strip()
    )

    content["content_type"] = (
        content["content_type"]
        .fillna("Practice")
        .astype(str)
        .str.strip()
    )

    content["difficulty"] = (
        content["difficulty"]
        .fillna("Medium")
        .astype(str)
        .str.strip()
    )

    # ------------------------------------------------
    # Keep first copy of every content item
    # ------------------------------------------------

    content = content.drop_duplicates(
        subset=["content_id"],
        keep="first"
    ).copy()

    return content


# ==================================================
# PREPARE INTERACTIONS
# ==================================================

def _prepare_interactions_dataframe(
    interactions
):

    interactions = _normalize_columns(
        interactions
    )

    if interactions.empty:
        return interactions

    if "student_id" not in interactions.columns:
        interactions["student_id"] = ""

    if "content_id" not in interactions.columns:
        interactions["content_id"] = ""

    if "score" not in interactions.columns:
        interactions["score"] = 0

    interactions["student_id"] = (
        interactions["student_id"]
        .astype(str)
        .str.strip()
    )

    interactions["content_id"] = (
        interactions["content_id"]
        .astype(str)
        .str.strip()
    )

    interactions["score"] = pd.to_numeric(
        interactions["score"],
        errors="coerce"
    ).fillna(0)

    return interactions


# ==================================================
# GET PREFERRED DIFFICULTY
# ==================================================

def _get_preferred_difficulty(
    student_id,
    interactions
):

    # ------------------------------------------------
    # First try existing difficulty engine
    # ------------------------------------------------

    if get_adaptive_difficulty is not None:

        try:

            difficulty = (
                get_adaptive_difficulty(
                    student_id
                )
            )

            if isinstance(
                difficulty,
                str
            ):

                if difficulty in DIFFICULTY_LEVELS:

                    return difficulty

        except Exception as error:

            print(
                "Adaptive difficulty error:",
                error
            )

    # ------------------------------------------------
    # Fallback based on student's average score
    # ------------------------------------------------

    student_interactions = (
        interactions[
            interactions["student_id"]
            == str(student_id)
        ]
        .copy()
    )

    if student_interactions.empty:

        return "Medium"

    average_score = (
        student_interactions["score"]
        .mean()
    )

    if pd.isna(average_score):

        return "Medium"

    if average_score < 50:

        return "Easy"

    if average_score < 70:

        return "Medium"

    if average_score < 85:

        return "Hard"

    return "Advanced"


# ==================================================
# CALCULATE WEAKNESS SCORES
# ==================================================

def _calculate_topic_weakness(
    student_id,
    interactions,
    content
):

    content = content.copy()

    # Default weakness
    # for completely unseen topics.
    content["weakness_score"] = 50.0

    student_interactions = (
        interactions[
            interactions["student_id"]
            == str(student_id)
        ]
        .copy()
    )

    if student_interactions.empty:

        return content

    # ------------------------------------------------
    # Merge student's interactions with content
    # ------------------------------------------------

    interaction_content = student_interactions[
        ["content_id", "score"]
    ].copy()

    interaction_content = (
        interaction_content.merge(
            content[
                [
                    "content_id",
                    "topic"
                ]
            ],
            on="content_id",
            how="left"
        )
    )

    if interaction_content.empty:

        return content

    # ------------------------------------------------
    # Average performance per topic
    # ------------------------------------------------

    topic_scores = (
        interaction_content
        .dropna(subset=["topic"])
        .groupby("topic")["score"]
        .mean()
    )

    # ------------------------------------------------
    # Convert performance into weakness
    #
    # Score 90 -> weakness 10
    # Score 60 -> weakness 40
    # Score 20 -> weakness 80
    # ------------------------------------------------

    for topic, average_score in topic_scores.items():

        weakness = max(
            0.0,
            min(
                100.0,
                100.0 - float(average_score)
            )
        )

        content.loc[
            content["topic"] == topic,
            "weakness_score"
        ] = weakness

    return content


# ==================================================
# CALCULATE DIFFICULTY SCORE
# ==================================================

def _calculate_difficulty_score(
    row,
    difficulty_levels
):

    content_difficulty = str(
        row.get(
            "difficulty",
            "Medium"
        )
    ).strip()

    preferred_difficulty = str(
        row.get(
            "preferred_difficulty",
            "Medium"
        )
    ).strip()

    content_level = (
        difficulty_levels.get(
            content_difficulty,
            2
        )
    )

    preferred_level = (
        difficulty_levels.get(
            preferred_difficulty,
            2
        )
    )

    # Exact preferred difficulty
    if (
        content_level
        == preferred_level
    ):

        return 40.0

    # One level below target
    if (
        content_level
        == preferred_level - 1
    ):

        return 15.0

    # Other difficulty
    return 0.0


# ==================================================
# CONTENT-BASED SCORING
# ==================================================

def _calculate_content_scores(
    student_id,
    content,
    interactions
):

    content_recommendations = (
        _prepare_content_dataframe(
            content
        )
    )

    if content_recommendations.empty:

        return content_recommendations

    # ------------------------------------------------
    # Remove content already completed
    # ------------------------------------------------

    student_interactions = (
        interactions[
            interactions["student_id"]
            == str(student_id)
        ]
    )

    completed_content_ids = set(
        student_interactions[
            "content_id"
        ]
        .astype(str)
        .tolist()
    )

    content_recommendations = (
        content_recommendations[
            ~content_recommendations[
                "content_id"
            ].isin(
                completed_content_ids
            )
        ]
        .copy()
    )

    # ------------------------------------------------
    # If everything was completed, recommend all
    # content again rather than returning nothing.
    # ------------------------------------------------

    if content_recommendations.empty:

        content_recommendations = (
            content.copy()
        )

        content_recommendations = (
            _prepare_content_dataframe(
                content_recommendations
            )
        )

    # ------------------------------------------------
    # Preferred difficulty
    # ------------------------------------------------

    preferred_difficulty = (
        _get_preferred_difficulty(
            student_id,
            interactions
        )
    )

    content_recommendations[
        "preferred_difficulty"
    ] = preferred_difficulty

    # ------------------------------------------------
    # Topic weakness
    # ------------------------------------------------

    content_recommendations = (
        _calculate_topic_weakness(
            student_id,
            interactions,
            content_recommendations
        )
    )

    # ------------------------------------------------
    # Difficulty match
    # ------------------------------------------------

    content_recommendations[
        "difficulty_match"
    ] = (
        content_recommendations[
            "difficulty"
        ]
        == content_recommendations[
            "preferred_difficulty"
        ]
    )

    # ------------------------------------------------
    # Difficulty score
    # ------------------------------------------------

    content_recommendations[
        "difficulty_score"
    ] = (
        content_recommendations.apply(
            lambda row:
                _calculate_difficulty_score(
                    row,
                    DIFFICULTY_LEVELS
                ),
            axis=1
        )
        .astype(float)
    )

    # ------------------------------------------------
    # Content type score
    # ------------------------------------------------

    content_recommendations[
        "content_type_score"
    ] = (
        content_recommendations[
            "content_type"
        ]
        .map(
            CONTENT_TYPE_SCORES
        )
        .fillna(10.0)
        .astype(float)
    )

    # ------------------------------------------------
    # Final content score
    # ------------------------------------------------

    content_recommendations[
        "content_score"
    ] = (
        content_recommendations[
            "weakness_score"
        ].astype(float)
        * 0.5
        +
        content_recommendations[
            "content_type_score"
        ].astype(float)
        +
        content_recommendations[
            "difficulty_score"
        ].astype(float)
    )

    # ------------------------------------------------
    # Normalize content score to 0-100
    # ------------------------------------------------

    max_content_score = (
        content_recommendations[
            "content_score"
        ].max()
    )

    if (
        pd.isna(max_content_score)
        or max_content_score <= 0
    ):

        content_recommendations[
            "content_score"
        ] = 0.0

    else:

        content_recommendations[
            "content_score"
        ] = (
            content_recommendations[
                "content_score"
            ]
            / max_content_score
            * 100
        )

    return content_recommendations


# ==================================================
# COLLABORATIVE FILTERING SCORE
# ==================================================

def _calculate_collaborative_scores(
    student_id,
    interactions,
    content_ids
):

    result = pd.DataFrame(
        {
            "content_id":
                list(content_ids),

            "collaborative_score":
                0.0
        }
    )

    if (
        interactions.empty
        or not content_ids
    ):

        return result

    # ------------------------------------------------
    # Interaction matrix
    # ------------------------------------------------

    interaction_matrix = (
        interactions.pivot_table(
            index="student_id",
            columns="content_id",
            values="score",
            aggfunc="mean",
            fill_value=0
        )
    )

    interaction_matrix = (
        _remove_duplicate_columns(
            interaction_matrix
        )
    )

    if interaction_matrix.empty:

        return result

    # ------------------------------------------------
    # Student does not yet exist in matrix
    # ------------------------------------------------

    if str(student_id) not in (
        interaction_matrix.index.astype(
            str
        )
    ):

        return result

    # ------------------------------------------------
    # Make sure student IDs are strings
    # ------------------------------------------------

    interaction_matrix.index = (
        interaction_matrix.index
        .astype(str)
    )

    student_id = str(student_id)

    if student_id not in interaction_matrix.index:

        return result

    # ------------------------------------------------
    # Student vector
    # ------------------------------------------------

    student_vector = (
        interaction_matrix.loc[
            [student_id]
        ]
    )

    # ------------------------------------------------
    # Cosine similarity
    # ------------------------------------------------

    similarities = cosine_similarity(
        student_vector,
        interaction_matrix
    )[0]

    similarity_series = pd.Series(
        similarities,
        index=interaction_matrix.index
    )

    # Remove self
    similarity_series = (
        similarity_series[
            similarity_series.index
            != student_id
        ]
    )

    if similarity_series.empty:

        return result

    # Only useful positive similarities
    similarity_series = (
        similarity_series[
            similarity_series > 0
        ]
    )

    if similarity_series.empty:

        return result

    # ------------------------------------------------
    # Weighted recommendation scores
    # ------------------------------------------------

    other_user_matrix = (
        interaction_matrix.loc[
            similarity_series.index
        ]
    )

    weighted_scores = (
        other_user_matrix.T
        .dot(
            similarity_series
        )
    )

    similarity_total = (
        similarity_series.sum()
    )

    if similarity_total <= 0:

        return result

    weighted_scores = (
        weighted_scores
        / similarity_total
    )

    # ------------------------------------------------
    # Keep only requested content
    # ------------------------------------------------

    weighted_scores.index = (
        weighted_scores.index
        .astype(str)
    )

    result_map = {}

    for content_id in content_ids:

        content_id = str(
            content_id
        )

        score = weighted_scores.get(
            content_id,
            0
        )

        result_map[
            content_id
        ] = float(score)

    result["content_id"] = (
        result["content_id"]
        .astype(str)
    )

    result["collaborative_score"] = (
        result["content_id"]
        .map(
            result_map
        )
        .fillna(0.0)
    )

    # ------------------------------------------------
    # Normalize collaborative score to 0-100
    # ------------------------------------------------

    max_score = (
        result[
            "collaborative_score"
        ].max()
    )

    if (
        pd.isna(max_score)
        or max_score <= 0
    ):

        result[
            "collaborative_score"
        ] = 0.0

    else:

        result[
            "collaborative_score"
        ] = (
            result[
                "collaborative_score"
            ]
            / max_score
            * 100
        )

    return result


# ==================================================
# RECOMMENDATION REASON
# ==================================================

def _generate_reason(
    row
):

    weakness_score = float(
        row.get(
            "weakness_score",
            0
        )
    )

    difficulty_match = bool(
        row.get(
            "difficulty_match",
            False
        )
    )

    collaborative_score = float(
        row.get(
            "collaborative_score",
            0
        )
    )

    if weakness_score >= 50:

        return (
            "Recommended because this topic "
            "is one of your weaker areas."
        )

    if collaborative_score >= 50:

        return (
            "Recommended because students "
            "with similar learning patterns "
            "performed well with this content."
        )

    if difficulty_match:

        return (
            "Recommended because its difficulty "
            "matches your current learning level."
        )

    return (
        "Recommended based on your learning "
        "activity and content relevance."
    )


# ==================================================
# FINAL HYBRID RECOMMENDER
# ==================================================

def hybrid_recommend(
    student_id,
    top_n=DEFAULT_TOP_N
):

    student_id = str(
        student_id
    ).strip()

    # ------------------------------------------------
    # Load datasets
    # ------------------------------------------------

    students = _safe_load_students()
    content = _safe_load_content()
    interactions = _safe_load_interactions()

    # Avoid unused-variable warning
    _ = students

    # ------------------------------------------------
    # Prepare data
    # ------------------------------------------------

    content = _prepare_content_dataframe(
        content
    )

    interactions = (
        _prepare_interactions_dataframe(
            interactions
        )
    )

    # ------------------------------------------------
    # No content available
    # ------------------------------------------------

    if content.empty:

        return []

    # ------------------------------------------------
    # Content scoring
    # ------------------------------------------------

    recommendations = (
        _calculate_content_scores(
            student_id,
            content,
            interactions
        )
    )

    if recommendations.empty:

        return []

    # ------------------------------------------------
    # Collaborative scoring
    # ------------------------------------------------

    collaborative = (
        _calculate_collaborative_scores(
            student_id,
            interactions,
            recommendations[
                "content_id"
            ].astype(str).tolist()
        )
    )

    # ------------------------------------------------
    # Final duplicate-column safety
    # ------------------------------------------------

    recommendations = (
        _remove_duplicate_columns(
            recommendations
        )
    )

    collaborative = (
        _remove_duplicate_columns(
            collaborative
        )
    )

    # ------------------------------------------------
    # Merge collaborative score
    # ------------------------------------------------

    recommendations["content_id"] = (
        recommendations[
            "content_id"
        ]
        .astype(str)
    )

    collaborative["content_id"] = (
        collaborative[
            "content_id"
        ]
        .astype(str)
    )

    recommendations = (
        recommendations.drop(
            columns=[
                "collaborative_score"
            ],
            errors="ignore"
        )
    )

    recommendations = (
        recommendations.merge(
            collaborative[
                [
                    "content_id",
                    "collaborative_score"
                ]
            ],
            on="content_id",
            how="left"
        )
    )

    recommendations[
        "collaborative_score"
    ] = (
        recommendations[
            "collaborative_score"
        ]
        .fillna(0.0)
        .astype(float)
    )

    # ------------------------------------------------
    # Hybrid score
    # ------------------------------------------------

    recommendations[
        "hybrid_score"
    ] = (
        recommendations[
            "content_score"
        ].astype(float)
        * CONTENT_WEIGHT
        +
        recommendations[
            "collaborative_score"
        ].astype(float)
        * COLLABORATIVE_WEIGHT
    )

    # ------------------------------------------------
    # Recommendation reason
    # ------------------------------------------------

    recommendations[
        "reason"
    ] = recommendations.apply(
        _generate_reason,
        axis=1
    )

    # ------------------------------------------------
    # Sort
    # ------------------------------------------------

    recommendations = (
        recommendations.sort_values(
            by="hybrid_score",
            ascending=False
        )
    )

    # ------------------------------------------------
    # Limit results
    # ------------------------------------------------

    recommendations = (
        recommendations.head(
            int(top_n)
        )
    )

    # ------------------------------------------------
    # Replace NaN values
    # ------------------------------------------------

    recommendations = (
        recommendations.replace(
            {
                np.nan: None
            }
        )
    )

    # ------------------------------------------------
    # Convert to frontend format
    # ------------------------------------------------

    output = []

    for _, row in recommendations.iterrows():

        hybrid_score = row.get(
            "hybrid_score",
            0
        )

        content_score = row.get(
            "content_score",
            0
        )

        collaborative_score = row.get(
            "collaborative_score",
            0
        )

        try:

            hybrid_score = round(
                float(
                    hybrid_score
                ),
                2
            )

        except Exception:

            hybrid_score = 0.0

        try:

            content_score = round(
                float(
                    content_score
                ),
                2
            )

        except Exception:

            content_score = 0.0

        try:

            collaborative_score = round(
                float(
                    collaborative_score
                ),
                2
            )

        except Exception:

            collaborative_score = 0.0

        output.append(
            {
                "content_id":
                    str(
                        row.get(
                            "content_id",
                            ""
                        )
                    ),

                "topic":
                    str(
                        row.get(
                            "topic",
                            "General"
                        )
                    ),

                "subject":
                    str(
                        row.get(
                            "subject",
                            "General"
                        )
                    ),

                "content_type":
                    str(
                        row.get(
                            "content_type",
                            "Practice"
                        )
                    ),

                "difficulty":
                    str(
                        row.get(
                            "difficulty",
                            "Medium"
                        )
                    ),

                "preferred_difficulty":
                    str(
                        row.get(
                            "preferred_difficulty",
                            "Medium"
                        )
                    ),

                "difficulty_match":
                    bool(
                        row.get(
                            "difficulty_match",
                            False
                        )
                    ),

                "weakness_score":
                    round(
                        float(
                            row.get(
                                "weakness_score",
                                0
                            )
                        ),
                        2
                    ),

                "content_score":
                    content_score,

                "collaborative_score":
                    collaborative_score,

                "hybrid_score":
                    hybrid_score,

                "reason":
                    str(
                        row.get(
                            "reason",
                            "Recommended for you."
                        )
                    )
            }
        )

    return output


# ==================================================
# BACKWARD-COMPATIBILITY WRAPPER
# ==================================================

def get_recommendations(
    student_id,
    top_n=DEFAULT_TOP_N
):

    return hybrid_recommend(
        student_id,
        top_n=top_n
    )