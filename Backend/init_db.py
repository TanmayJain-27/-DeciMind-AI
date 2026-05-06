import sqlite3

db = sqlite3.connect("hdis.db")
cur = db.cursor()

# USERS TABLE
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# DECISION LOGS TABLE (already discussed)
cur.execute("""
CREATE TABLE IF NOT EXISTS decision_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    domain TEXT,
    ai_decision TEXT,
    confidence INTEGER,
    human_decision TEXT,
    reason TEXT,
    timestamp TEXT
)
""")

db.commit()
db.close()

print("Database initialized successfully")