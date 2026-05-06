import pickle
import random
import numpy as np
from sklearn.linear_model import LogisticRegression

# ================= FINANCE =================
def train_finance():
    X, y = [], []

    for _ in range(1000):
        income = random.randint(100000, 1000000)
        credit = random.randint(300, 850)
        loan = random.randint(50000, 800000)
        emp = random.choice([0, 1])

        score = 0
        if income > 500000: score += 30
        if credit > 700: score += 30
        if loan < income * 2: score += 20
        if emp == 1: score += 20

        label = 1 if score >= 60 else 0

        # 🔥 add small randomness
        if random.random() < 0.1:
            label = 1 - label

        X.append([income, credit, loan, emp])
        y.append(label)

    model = LogisticRegression()
    model.fit(X, y)

    pickle.dump(model, open("ml_models/finance.pkl", "wb"))
    print("✅ Finance model trained")


# ================= HEALTH =================
def train_health():
    X, y = [], []

    for _ in range(1000):
        age = random.randint(20, 90)
        hr = random.randint(60, 130)
        bp = random.randint(90, 180)
        oxy = random.randint(80, 100)
        cond = random.choice([0, 1])

        score = 0
        if age > 60: score += 15
        if hr > 100: score += 15
        if bp > 140: score += 15
        if oxy < 92: score += 15
        if cond == 1: score += 20

        label = 1 if score >= 50 else 0

        if random.random() < 0.1:
            label = 1 - label

        X.append([age, hr, bp, oxy, cond])
        y.append(label)

    model = LogisticRegression()
    model.fit(X, y)

    pickle.dump(model, open("ml_models/health.pkl", "wb"))
    print("✅ Health model trained")


# ================= HR =================
def train_hr():
    X, y = [], []

    for _ in range(1000):
        exp = random.randint(0, 10)
        skill = random.randint(0, 100)
        tier = random.choice([0, 1])

        score = 0
        if exp >= 5: score += 30
        if skill >= 70: score += 40
        if tier == 1: score += 30

        label = 1 if score >= 60 else 0

        if random.random() < 0.1:
            label = 1 - label

        X.append([exp, skill, tier])
        y.append(label)

    model = LogisticRegression()
    model.fit(X, y)

    pickle.dump(model, open("ml_models/hr.pkl", "wb"))
    print("✅ HR model trained")


# ================= CYBER =================
def train_cyber():
    X, y = [], []

    for _ in range(1000):
        amt = random.randint(1000, 100000)
        attempts = random.randint(1, 6)
        ip = random.choice([0, 1])
        device = random.choice([0, 1])

        score = 0
        if amt > 50000: score += 30
        if attempts > 3: score += 20
        if ip == 1: score += 25
        if device == 1: score += 25

        label = 1 if score >= 60 else 0

        if random.random() < 0.1:
            label = 1 - label

        X.append([amt, attempts, ip, device])
        y.append(label)

    model = LogisticRegression()
    model.fit(X, y)

    pickle.dump(model, open("ml_models/cyber.pkl", "wb"))
    print("✅ Cyber model trained")


# ================= EDUCATION =================
def train_edu():
    X, y = [], []

    for _ in range(1000):
        att = random.randint(40, 100)
        marks = random.randint(0, 100)
        assign = random.randint(0, 100)
        support = random.choice([0, 1])

        score = 0
        if att < 75: score += 30
        if marks < 40: score += 30
        if assign < 60: score += 20
        if support == 0: score += 20

        label = 1 if score >= 60 else 0

        if random.random() < 0.1:
            label = 1 - label

        X.append([att, marks, assign, support])
        y.append(label)

    model = LogisticRegression()
    model.fit(X, y)

    pickle.dump(model, open("ml_models/edu.pkl", "wb"))
    print("✅ Education model trained")


# ================= RUN ALL =================
if __name__ == "__main__":
    train_finance()
    train_health()
    train_hr()
    train_cyber()
    train_edu()

    print("\n🔥 ALL MODELS TRAINED SUCCESSFULLY")