import psycopg
import pandas as pd


def get_connection():

    connection = psycopg.connect(
        "dbname=prepmind user=anjalikeshri"
    )

    return connection


def load_students():

    connection = get_connection()

    students = pd.read_sql(
        "SELECT * FROM students",
        connection
    )

    connection.close()

    return students
def load_content():

    connection = get_connection()

    content = pd.read_sql(
        "SELECT * FROM content",
        connection
    )

    connection.close()

    return content


def load_interactions():

    connection = get_connection()

    interactions = pd.read_sql(
        "SELECT * FROM interactions",
        connection
    )

    connection.close()

    return interactions