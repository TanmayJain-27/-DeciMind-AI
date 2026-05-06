def explain_healthcare(d):
    factors = []

    if int(d.get("age", 0)) > 60:
        factors.append({
            "feature": "Age",
            "impact": "+15",
            "reason": "Patient age above 60"
        })

    if int(d.get("heartRate", 0)) > 100:
        factors.append({
            "feature": "Heart Rate",
            "impact": "+15",
            "reason": "Abnormally high heart rate"
        })

    if int(d.get("bloodPressure", 0)) > 140:
        factors.append({
            "feature": "Blood Pressure",
            "impact": "+15",
            "reason": "High blood pressure detected"
        })

    if int(d.get("oxygenLevel", 0)) < 92:
        factors.append({
            "feature": "Oxygen Level",
            "impact": "+15",
            "reason": "Low oxygen saturation"
        })

    if d.get("existingCondition") == "yes":
        factors.append({
            "feature": "Existing Condition",
            "impact": "+10",
            "reason": "Patient has prior medical conditions"
        })

    summary = "Multiple clinical risk indicators detected" if len(factors) >= 3 else "Low immediate health risk"

    return {
        "summary": summary,
        "factors": factors
    }