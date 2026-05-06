import sqlite3
import pandas as pd
import joblib
import os

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score


# ==============================
# DATABASE CONNECTION
# ==============================
def load_data():
    conn = sqlite3.connect("hdis.db")

    query = """
    SELECT
        ai_decision,
        confidence,
        human_decision,
        domain
    FROM decision_logs
    WHERE domain LIKE '%Finance%'
    """

    df = pd.read_sql(query, conn)
    conn.close()

    print("ROWS FOUND:", len(df))
    if len(df) > 0:
        print(df.head(3))
    else:
        print("❌ No Finance records found")

    return df


# ==============================
# FEATURE ENGINEERING
# ==============================
def prepare_features(df):
    # Label: override or not
    df["override"] = (df["ai_decision"] != df["human_decision"]).astype(int)

    # Encode AI decision
    le_decision = LabelEncoder()
    df["ai_decision_enc"] = le_decision.fit_transform(df["ai_decision"])

    X = df[[
        "confidence",
        "ai_decision_enc"
    ]]

    y = df["override"]

    return X, y


# ==============================
# TRAIN MODEL
# ==============================
def train():
    df = load_data()

    if len(df) < 5:
        print("❌ Not enough data to train Finance ML model (need ≥10)")
        return

    X, y = prepare_features(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LogisticRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    print(f"✅ Finance ML Model Accuracy: {acc:.2f}")

    # Ensure models directory exists
    model_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "models",
        "finance.pkl"
    )

    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)

    print("💾 Model saved:", model_path)


# ==============================
# RUN
# ==============================
if __name__ == "__main__":
    train()