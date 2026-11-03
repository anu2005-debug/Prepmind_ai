import pandas as pd

# Load datasets
students = pd.read_csv("data/students.csv")
content = pd.read_csv("data/content.csv")
interactions = pd.read_csv("data/interactions.csv")

# Display basic information
print("Students:")
print(students)

print("\nContent:")
print(content)

print("\nInteractions:")
print(interactions)

# Display dataset sizes
print("\nDataset Sizes:")
print("Students:", len(students))
print("Content:", len(content))
print("Interactions:", len(interactions))