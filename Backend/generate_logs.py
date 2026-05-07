import requests
import random
import time

BASE = "https://decimind-ai-backend.onrender.com"

domains = {
    "Finance": ["APPROVE", "REJECT"],
    "Healthcare": ["HIGH RISK", "LOW RISK"],
    "HR": ["SHORTLIST", "REJECT"],
    "Cybersecurity": ["FRAUD", "SAFE"],
    "Education": ["HIGH RISK", "LOW RISK"],
}

print("🚀 Generating live logs...")

for domain, labels in domains.items():

    for _ in range(100):

        ai = random.choice(labels)

        payload = {
            "domain": domain,
            "aiDecision": ai,
            "confidence": random.randint(40, 95),
            "humanDecision": ai,
            "reason": "auto-generated",
            "timestamp": "2026-05-07"
        }

        try:
            requests.post(
                f"{BASE}/api/decision-log",
                json=payload
            )

        except Exception as e:
            print("Error:", e)

        time.sleep(0.05)

print("✅ Logs inserted successfully")