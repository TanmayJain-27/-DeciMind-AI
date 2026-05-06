def explain_education(d):
    factors = []

    if int(d.get("attendance", 0)) < 75:
        factors.append({
            "feature": "Attendance",
            "impact": "+30",
            "reason": "Attendance below 75%"
        })

    if int(d.get("internalMarks", 0)) < 40:
        factors.append({
            "feature": "Internal Marks",
            "impact": "+30",
            "reason": "Low internal assessment scores"
        })

    if int(d.get("assignmentCompletion", 0)) < 60:
        factors.append({
            "feature": "Assignments",
            "impact": "+20",
            "reason": "Low assignment completion rate"
        })

    if d.get("familySupport") == "no":
        factors.append({
            "feature": "Support System",
            "impact": "+20",
            "reason": "Lack of family or academic support"
        })

    summary = "Student at academic risk" if len(factors) >= 2 else "Student performance within acceptable range"

    return {
        "summary": summary,
        "factors": factors
    }