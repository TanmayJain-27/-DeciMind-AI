import sqlite3
import pandas as pd
import joblib
import os

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score


# ==============================
# PATH CONFIG (IMPORTANT)
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "../../hdis.db")
MODEL_DIR = os.path.join(BASE_DIR, "../models")
MODEL_PATH = os.path.join(MODEL_DIR, "education.pkl")


# ==============================
# LOAD DATA
# ==============================
def load_data():
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"❌ Database not found at {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)

    query = """
    SELECT ai_decision, confidence, human_decision
    FROM decision_logs
    WHERE domain LIKE '%Education%'
    """

    df = pd.read_sql(query, conn)
    conn.close()

    print("📊 ROWS FOUND:", len(df))
    print(df.head(3))

    return df


# ==============================
# FEATURE ENGINEERING
# ==============================
def prepare_features(df):
    # Target: did human override AI?
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
        print("❌ Not enough data to train Education ML model (need ≥5)")
        return

    X, y = prepare_features(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )

    model = LogisticRegression()
    model.fit(X_train, y_train)

    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"✅ Education ML Model Accuracy: {acc:.2f}")

    # Ensure model directory exists
    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(model, MODEL_PATH)
    print(f"💾 Model saved at: {MODEL_PATH}")


# ==============================
# RUN
# ==============================
if __name__ == "__main__":
    train()