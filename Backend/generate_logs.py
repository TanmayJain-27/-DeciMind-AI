import sqlite3
import random
from datetime import datetime

conn = sqlite3.connect("hdis.db")
cur = conn.cursor()

domains = {
    "Finance": ["APPROVE", "REJECT"],
    "Healthcare": ["HIGH RISK", "LOW RISK"],
    "HR": ["SHORTLIST", "REJECT"],
    "Cybersecurity": ["FRAUD", "SAFE"],
    "Education": ["HIGH RISK", "LOW RISK"],
}

def rand_conf():
    return random.randint(30, 95)

def maybe_override(ai):
    # ~30% overrides
    return ai if random.random() > 0.3 else random.choice(
        [d for d in ["APPROVE","REJECT","HIGH RISK","LOW RISK","SHORTLIST","FRAUD","SAFE"] if d != ai]
    )

rows = []
now = datetime.now().strftime("%Y-%m-%d")

for domain, labels in domains.items():
    for _ in range(500):
        ai = random.choice(labels)
        human = ai if random.random() > 0.3 else (labels[0] if ai != labels[0] else labels[1])

        rows.append((
            1,                  # user_id
            domain,
            ai,
            rand_conf(),
            human,
            "auto-generated",
            now
        ))

cur.executemany("""
INSERT INTO decision_logs (user_id, domain, ai_decision, confidence, human_decision, reason, timestamp)
VALUES (?, ?, ?, ?, ?, ?, ?)
""", rows)

conn.commit()
conn.close()

print("✅ Inserted 500 rows per domain (total 2500 rows)")