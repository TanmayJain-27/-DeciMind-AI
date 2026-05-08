import pickle
import pandas as pd

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import psycopg2
import os

from ml_engine.predict import predict_override
from auth import auth

# XAI
from explain.explain_finance import explain_finance
from explain.explain_healthcare import explain_healthcare
from explain.explain_hr import explain_hr
from explain.explain_cyber import explain_cybersecurity
from explain.explain_education import explain_education

app = Flask(__name__)

# ✅ FIXED CORS FOR LOCAL + DEPLOYED FRONTEND
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

app.config["JWT_SECRET_KEY"] = "hdis-secret-key"
jwt = JWTManager(app)

app.register_blueprint(auth)

# =========================
# POSTGRES DATABASE
# =========================
DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db():
    return psycopg2.connect(DATABASE_URL)

# =========================
# AUTO CREATE TABLES
# =========================
def init_db():
    db = get_db()
    cur = db.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS decision_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        domain TEXT,
        ai_decision TEXT,
        confidence REAL,
        human_decision TEXT,
        reason TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    db.commit()
    db.close()

init_db()

# =========================
# LOAD MODELS
# =========================
finance_model = pickle.load(open("ml_models/finance.pkl", "rb"))
health_model = pickle.load(open("ml_models/health.pkl", "rb"))
hr_model = pickle.load(open("ml_models/hr.pkl", "rb"))
cyber_model = pickle.load(open("ml_models/cyber.pkl", "rb"))
edu_model = pickle.load(open("ml_models/edu.pkl", "rb"))

# =========================
# LOG FUNCTION
# =========================
def save_log(domain, decision, score):
    db = get_db()
    cur = db.cursor()

    cur.execute("""
    INSERT INTO decision_logs 
    (user_id, domain, ai_decision, confidence, human_decision, reason, timestamp)
    VALUES (%s, %s, %s, %s, %s, %s, NOW())
    """, (
        1,
        domain,
        decision,
        score,
        None,
        None
    ))

    db.commit()
    db.close()

# =========================
# CREATE DECISION LOG API
# =========================
@app.route("/api/decision-log", methods=["POST"])
def create_decision_log():
    d = request.json

    db = get_db()
    cur = db.cursor()

    cur.execute("""
    INSERT INTO decision_logs
    (user_id, domain, ai_decision, confidence, human_decision, reason, timestamp)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        1,
        d.get("domain"),
        d.get("aiDecision"),
        d.get("confidence"),
        d.get("humanDecision"),
        d.get("reason"),
        d.get("timestamp")
    ))

    db.commit()
    db.close()

    return jsonify({
        "message": "Log created successfully"
    })

# =========================
# FINANCE
# =========================
@app.route("/api/loan-predict", methods=["POST"])
def loan_predict():
    d = request.json
    score = 0

    if int(d.get("income", 0)) > 500000:
        score += 30

    if int(d.get("creditScore", 0)) > 700:
        score += 30

    if int(d.get("loanAmount", 0)) < int(d.get("income", 0)) * 2:
        score += 20

    if d.get("employment") != "unemployed":
        score += 20

    decision = "APPROVE" if score >= 60 else "REJECT"

    input_data = {
        "age": int(d.get("age", 0)),
        "income": int(d.get("income", 0)),
        "credit_score": int(d.get("creditScore", 0)),
        "loan_amount": int(d.get("loanAmount", 0)),
        "employment_status": "Employed" if d.get("employment") != "unemployed" else "Unemployed"
    }

    df = pd.DataFrame([input_data])
    df = pd.get_dummies(df)

    for col in finance_model.feature_names_in_:
        if col not in df.columns:
            df[col] = 0

    df = df[finance_model.feature_names_in_]

    ml_pred = finance_model.predict(df)[0]
    ml_decision = "APPROVE" if ml_pred == 1 else "REJECT"
    ml_confidence = round(max(finance_model.predict_proba(df)[0]) * 100, 2)

    save_log("Finance", decision, score)

    return jsonify({
        "decision": decision,
        "mlDecision": ml_decision,
        "mlConfidence": ml_confidence,
        "confidence": score,
        **predict_override("Finance", decision, score),
        "xai": explain_finance(d)
    })

# =========================
# HEALTHCARE
# =========================
@app.route("/api/health-risk", methods=["POST"])
def health_risk():
    d = request.json
    score = 0

    if int(d.get("age", 0)) > 60:
        score += 15

    if int(d.get("heartRate", 0)) > 100:
        score += 15

    if int(d.get("bloodPressure", 0)) > 140:
        score += 15

    if int(d.get("oxygenLevel", 0)) < 92:
        score += 15

    if d.get("existingCondition") == "yes":
        score += 10

    decision = "HIGH RISK" if score >= 60 else "LOW RISK"

    input_data = {
        "age": int(d.get("age", 0)),
        "heart_rate": int(d.get("heartRate", 0)),
        "blood_pressure": int(d.get("bloodPressure", 0)),
        "oxygen": int(d.get("oxygenLevel", 0)),
        "existing_condition": 1 if d.get("existingCondition") == "yes" else 0,
        "smoking": 0,
        "alcohol": 0,
        "bmi": 25
    }

    df = pd.DataFrame([input_data])

    for col in health_model.feature_names_in_:
        if col not in df.columns:
            df[col] = 0

    df = df[health_model.feature_names_in_]

    ml_pred = health_model.predict(df)[0]
    ml_decision = "HIGH RISK" if ml_pred == 1 else "LOW RISK"
    ml_confidence = round(max(health_model.predict_proba(df)[0]) * 100, 2)

    save_log("Healthcare", decision, score)

    return jsonify({
        "decision": decision,
        "mlDecision": ml_decision,
        "mlConfidence": ml_confidence,
        "confidence": score,
        **predict_override("Healthcare", decision, score),
        "xai": explain_healthcare(d)
    })

# =========================
# HR
# =========================
@app.route("/api/hr-evaluate", methods=["POST"])
def hr_evaluate():
    d = request.json
    score = 0

    if int(d.get("experience", 0)) >= 5:
        score += 30

    if int(d.get("skillMatch", 0)) >= 60:
        score += 30

    if d.get("education") in ["master", "phd"]:
        score += 20

    decision = "SHORTLIST" if score >= 60 else "REJECT"

    input_data = {
        "experience": int(d.get("experience", 0)),
        "skill_match": int(d.get("skillMatch", 0)),
        "education_Master": 1 if d.get("education") == "master" else 0,
        "education_Bachelor": 1 if d.get("education") == "bachelor" else 0,
        "company_type_Startup": 1 if d.get("companyTier") == "low" else 0,
        "company_type_Corporate": 1 if d.get("companyTier") == "high" else 0
    }

    df = pd.DataFrame([input_data])
    df = df[hr_model.feature_names_in_]

    ml_pred = hr_model.predict(df)[0]
    ml_decision = "SHORTLIST" if ml_pred == 1 else "REJECT"
    ml_confidence = round(max(hr_model.predict_proba(df)[0]) * 100, 2)

    save_log("HR", decision, score)

    return jsonify({
        "decision": decision,
        "mlDecision": ml_decision,
        "mlConfidence": ml_confidence,
        "confidence": score,
        "xai": explain_hr(d)
    })

# =========================
# CYBERSECURITY
# =========================
@app.route("/api/fraud-check", methods=["POST"])
def fraud_check():
    d = request.json
    score = 0

    if int(d.get("amount", 0)) > 50000:
        score += 30

    if int(d.get("loginAttempts", 0)) > 3:
        score += 20

    decision = "FRAUD" if score >= 60 else "SAFE"

    input_data = {
        "transaction_amount": int(d.get("amount", 0)),
        "failed_logins": int(d.get("loginAttempts", 0)),
        "ip_risk": 1 if d.get("ipRisk") == "high" else 0,
        "device_trust": 1 if d.get("deviceTrust") == "untrusted" else 0
    }

    df = pd.DataFrame([input_data])
    df = df[cyber_model.feature_names_in_]

    ml_pred = cyber_model.predict(df)[0]
    ml_decision = "FRAUD" if ml_pred == 1 else "SAFE"
    ml_confidence = round(max(cyber_model.predict_proba(df)[0]) * 100, 2)

    save_log("Cybersecurity", decision, score)

    return jsonify({
        "decision": decision,
        "mlDecision": ml_decision,
        "mlConfidence": ml_confidence,
        "confidence": score,
        "xai": explain_cybersecurity(d)
    })

# =========================
# EDUCATION
# =========================
@app.route("/api/student-risk", methods=["POST"])
def student_risk():
    d = request.json
    score = 0

    if int(d.get("attendance", 0)) < 75:
        score += 30

    if int(d.get("internalMarks", 0)) < 40:
        score += 30

    decision = "HIGH RISK" if score >= 60 else "LOW RISK"

    input_data = {
        "attendance": int(d.get("attendance", 0)),
        "marks": int(d.get("internalMarks", 0)),
        "assignment": int(d.get("assignmentCompletion", 0)),
        "support": 1 if d.get("familySupport") == "yes" else 0
    }

    df = pd.DataFrame([input_data])
    df = df[edu_model.feature_names_in_]

    ml_pred = edu_model.predict(df)[0]
    ml_decision = "HIGH RISK" if ml_pred == 1 else "LOW RISK"
    ml_confidence = round(max(edu_model.predict_proba(df)[0]) * 100, 2)

    save_log("Education", decision, score)

    return jsonify({
        "decision": decision,
        "mlDecision": ml_decision,
        "mlConfidence": ml_confidence,
        "confidence": score,
        "xai": explain_education(d)
    })

# =========================
# ADMIN APIs
# =========================
@app.route("/api/decision-logs")
def decision_logs():
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        SELECT domain, ai_decision, confidence, timestamp
        FROM decision_logs
        ORDER BY timestamp DESC
    """)

    rows = cur.fetchall()
    db.close()

    return jsonify({
        "logs": [
            {
                "domain": r[0],
                "aiDecision": r[1],
                "confidence": r[2],
                "timestamp": r[3]
            } for r in rows
        ]
    })

@app.route("/api/admin/metrics")
def admin_metrics():
    db = get_db()
    cur = db.cursor()

    cur.execute("SELECT COUNT(*) FROM decision_logs")
    total = cur.fetchone()[0]

    db.close()

    return jsonify({
        "total": total
    })

@app.route("/")
def home():
    return "HDIS Backend Running 🚀"

# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(debug=True)