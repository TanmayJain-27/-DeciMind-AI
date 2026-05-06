def explain_cybersecurity(d):
    factors = []

    if int(d.get("amount", 0)) > 50000:
        factors.append({
            "feature": "Transaction Amount",
            "impact": "+30",
            "reason": "High-value transaction"
        })

    if int(d.get("loginAttempts", 0)) > 3:
        factors.append({
            "feature": "Login Attempts",
            "impact": "+20",
            "reason": "Multiple failed login attempts"
        })

    if d.get("ipRisk") == "high":
        factors.append({
            "feature": "IP Risk",
            "impact": "+25",
            "reason": "High-risk IP address detected"
        })

    if d.get("deviceTrust") == "untrusted":
        factors.append({
            "feature": "Device Trust",
            "impact": "+25",
            "reason": "Unrecognized or new device"
        })

    summary = "High fraud probability detected" if len(factors) >= 2 else "Transaction appears safe"

    return {
        "summary": summary,
        "factors": factors
    }