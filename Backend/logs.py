import requests
import random
import time

BASE = "http://127.0.0.1:5000"

def finance():
    return requests.post(f"{BASE}/api/loan-predict", json={
        "income": random.randint(200000, 900000),
        "creditScore": random.randint(500, 800),
        "loanAmount": random.randint(50000, 600000),
        "employment": random.choice(["employed", "unemployed"])
    })

def health():
    return requests.post(f"{BASE}/api/health-risk", json={
        "age": random.randint(20, 90),
        "heartRate": random.randint(60, 120),
        "bloodPressure": random.randint(90, 180),
        "oxygenLevel": random.randint(80, 100),
        "existingCondition": random.choice(["yes", "no"])
    })

def hr():
    return requests.post(f"{BASE}/api/hr-evaluate", json={
        "experience": random.randint(0, 10),
        "skillMatch": random.randint(0, 100),
        "companyTier": random.choice(["high", "low"]),
        "resumeText": "python java react sql"
    })

def cyber():
    return requests.post(f"{BASE}/api/fraud-check", json={
        "amount": random.randint(1000, 100000),
        "loginAttempts": random.randint(1, 6),
        "ipRisk": random.choice(["low", "high"]),
        "deviceTrust": random.choice(["trusted", "untrusted"])
    })

def edu():
    return requests.post(f"{BASE}/api/student-risk", json={
        "attendance": random.randint(40, 100),
        "internalMarks": random.randint(0, 100),
        "assignmentCompletion": random.randint(0, 100),
        "familySupport": random.choice(["yes", "no"])
    })


functions = [finance, health, hr, cyber, edu]

print("🚀 Generating logs...")

for i in range(200):  # 🔥 increase this number for more logs
    random.choice(functions)()
    time.sleep(0.1)

print("✅ Logs generated successfully")