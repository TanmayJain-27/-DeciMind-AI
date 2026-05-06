import sqlite3
import pandas as pd
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score


# ==============================
# LOAD DATA
# ==============================
def load_data():
    conn = sqlite3.connect("hdis.db")

    query = """
    SELECT
        ai_decision,
        confidence,
        human_decision
    FROM decision_logs
    WHERE domain LIKE '%Healthcare%'
    """

    df = pd.read_sql(query, conn)
    conn.close()

    print("ROWS FOUND:", len(df))
    if len(df) > 0:
        print(df.head(3))

    return df


# ==============================
# FEATURE ENGINEERING
# ==============================
def prepare_features(df):
    # Label: was AI overridden?
    df["override"] = (df["ai_decision"] != df["human_decision"]).astype(int)

    # Encode AI decision
    le = LabelEncoder()
    df["ai_decision_enc"] = le.fit_transform(df["ai_decision"])

    X = df[["confidence", "ai_decision_enc"]]
    y = df["override"]

    return X, y


# ==============================
# TRAIN MODEL
# ==============================
def train():
    df = load_data()

    if len(df) < 5:
        print("❌ Not enough data to train Healthcare ML model")
        return

    X, y = prepare_features(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LogisticRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    print(f"✅ Healthcare ML Model Accuracy: {acc:.2f}")

    import os
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "healthcare.pkl")

    joblib.dump(model, MODEL_PATH)
    print("💾 Model saved:", MODEL_PATH)


# ==============================
# RUN
# ==============================
if __name__ == "__main__":
    train()