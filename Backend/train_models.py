import sqlite3
import pandas as pd
from sklearn.linear_model import LogisticRegression
import pickle

conn = sqlite3.connect("hdis.db")

def train_model(table, features, target, model_name):
    df = pd.read_sql(f"SELECT * FROM {table}", conn)

    if len(df) < 50:
        print(f"⚠️ Not enough data for {model_name}")
        return

    df = pd.get_dummies(df)

    X = df[features]
    y = df[target]

    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)

    pickle.dump(model, open(f"ml_models/{model_name}.pkl", "wb"))
    print(f"✅ {model_name} trained")


# =========================
# FINANCE
# =========================
train_model(
    "finance_data",
    ["age","income","credit_score","loan_amount",
     "employment_status_Employed","employment_status_Unemployed"],
    "decision",
    "finance"
)

# =========================
# HEALTHCARE
# =========================
train_model(
    "health_data",
    ["age","heart_rate","blood_pressure","oxygen",
     "existing_condition","smoking","alcohol","bmi"],
    "decision",
    "health"
)

# =========================
# HR
# =========================
train_model(
    "hr_data",
    ["experience","skill_match",
     "education_Bachelor","education_Master",
     "company_type_Startup","company_type_Corporate"],
    "decision",
    "hr"
)

# =========================
# CYBER
# =========================
train_model(
    "cyber_data",
    ["transaction_amount","failed_logins","ip_risk","device_trust"],
    "decision",
    "cyber"
)

# =========================
# EDUCATION
# =========================
train_model(
    "edu_data",
    ["attendance","marks","assignment","support"],
    "decision",
    "edu"
)

print("\n🚀 ALL MODELS TRAINED SUCCESSFULLY")