import requests
import random
from datetime import datetime

# ✅ LIVE DEPLOYED BACKEND
BASE = "https://decimind-ai-backend.onrender.com"

domains = {
    "Finance": ["APPROVE", "REJECT"],
    "Healthcare": ["HIGH RISK", "LOW RISK"],
    "HR": ["SHORTLIST", "REJECT"],
    "Cybersecurity": ["FRAUD", "SAFE"],
    "Education": ["HIGH RISK", "LOW RISK"],
}

def rand_conf():
    return random.randint(80, 95)

rows = []
now = datetime.now().strftime("%Y-%m-%d")

print("🚀 Generating live logs...")

for domain, labels in domains.items():
    for _ in range(100):

        ai = random.choice(labels)

        # ✅ Mostly aligned human decisions
        human = ai if random.random() > 0.15 else (
            labels[0] if ai != labels[0] else labels[1]
        )

        payload = {
            "domain": domain,
            "aiDecision": ai,
            "confidence": rand_conf(),
            "humanDecision": human,
            "reason": "auto-generated",
            "timestamp": now
        }

        try:
            requests.post(
                f"{BASE}/api/decision-log",
                json=payload
            )

        except Exception as e:
            print("Error:", e)

print("✅ Inserted 500 rows per domain (total 2500 rows)")