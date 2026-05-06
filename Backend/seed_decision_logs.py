# seed_decision_logs.py
# Run this ONCE to add sample data
# Command: python seed_decision_logs.py

import sqlite3
import random
from datetime import datetime, timedelta

DB_PATH = "hdis.db"

DOMAINS = {
    "Finance": ["APPROVE", "REJECT"],
    "Healthcare": ["HIGH RISK", "LOW RISK"],
    "HR": ["SHORTLIST", "REJECT"],
    "Cybersecurity": ["FRAUD", "SAFE"],
    "Education": ["HIGH RISK", "LOW RISK"],
}

REASONS = [
    "Manual review required",
    "AI confidence borderline",
    "Policy based override",
    "Exceptional case",
    "Human domain expertise applied",
]

def seed():
    db = sqlite3.connect(DB_PATH)
    cur = db.cursor()

    # 🔥 HARD FIX: ensure user exists
    cur.execute("SELECT id FROM users ORDER BY id ASC LIMIT 1")
    row = cur.fetchone()

    if not row:
        print("❌ No users found. Register at least one user first.")
        return

    user_id = row[0]
    now = datetime.utcnow()

    inserted = 0

    for domain, decisions in DOMAINS.items():
        for _ in range(50):
            ai_decision = random.choice(decisions)

            if random.random() < 0.3:
                human_decision = decisions[0] if ai_decision == decisions[1] else decisions[1]
                reason = random.choice(REASONS)
            else:
                human_decision = ai_decision
                reason = "AI decision accepted"

            confidence = random.randint(50, 95)
            timestamp = (now - timedelta(days=random.randint(0, 30))).isoformat()

            cur.execute("""
                INSERT INTO decision_logs
                (user_id, domain, ai_decision, confidence,
                 human_decision, reason, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                domain,
                ai_decision,
                confidence,
                human_decision,
                reason,
                timestamp
            ))

            inserted += 1

    db.commit()
    db.close()

    print(f"✅ SUCCESS: Inserted {inserted} decision log entries")

if __name__ == "__main__":
    seed()