from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
import sqlite3

auth = Blueprint("auth", __name__)

def get_db():
    return sqlite3.connect("hdis.db")

# =====================================================
# REGISTER
# =====================================================
@auth.route("/api/register", methods=["POST"])
def register():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not name or not email or not password or not role:
        return jsonify({"error": "All fields are required"}), 400

    if role not in ["user", "admin"]:
        return jsonify({"error": "Invalid role"}), 400

    hashed_password = generate_password_hash(password)

    db = get_db()
    cur = db.cursor()
    cur.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        (name, email, hashed_password, role)
    )
    db.commit()
    db.close()

    return jsonify({"message": "User registered successfully"})

# =====================================================
# LOGIN ✅ FIXED
# =====================================================
@auth.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    cur = db.cursor()
    cur.execute(
        "SELECT id, name, password, role FROM users WHERE email = ?",
        (email,)
    )
    user = cur.fetchone()
    db.close()

    if not user or not check_password_hash(user[2], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ BACK TO STRING ID (MATCHES app.py)
    token = create_access_token(identity=str(user[0]))

    return jsonify({
        "token": token,
        "name": user[1],
        "role": user[3]
    })