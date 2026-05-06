import joblib
import os
import numpy as np

# ==============================
# MODEL LOADER (SAFE)
# ==============================
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "models")

MODEL_MAP = {
    "Finance": "finance.pkl",
    "Healthcare": "healthcare.pkl",
    "HR": "hr.pkl",
    "Cybersecurity": "cyber.pkl",
    "Education": "education.pkl"
}

_loaded_models = {}


def load_model(domain):
    if domain not in MODEL_MAP:
        return None

    if domain in _loaded_models:
        return _loaded_models[domain]

    model_path = os.path.join(MODEL_DIR, MODEL_MAP[domain])

    if not os.path.exists(model_path):
        print(f"❌ Model not found for {domain}: {model_path}")
        return None

    model = joblib.load(model_path)
    _loaded_models[domain] = model
    print(f"✅ Loaded ML model for {domain}")
    return model


# ==============================
# PREDICT OVERRIDE RISK
# ==============================
def predict_override(domain, ai_decision, confidence):
    model = load_model(domain)

    if model is None:
        return {
            "override_risk": 0.0,
            "risk_level": "UNKNOWN",
            "message": "⚠️ ML model not available"
        }

    # Encode decision
    ai_decision_enc = 1 if ai_decision in ["APPROVE", "HIGH RISK", "SHORTLIST", "FRAUD"] else 0

    X = np.array([[confidence, ai_decision_enc]])
    prob = model.predict_proba(X)[0][1]

    if prob >= 0.7:
        level = "HIGH"
        msg = "⚠️ High chance of human override"
    elif prob >= 0.4:
        level = "MEDIUM"
        msg = "⚠️ Moderate override risk"
    else:
        level = "LOW"
        msg = "✅ Low override risk"

    return {
        "override_risk": round(float(prob), 2),
        "risk_level": level,
        "message": msg
    }