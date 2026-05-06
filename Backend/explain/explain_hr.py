def explain_hr(d):
    factors = []

    resume = d.get("resumeText", "").lower()
    experience = int(d.get("experience", 0))
    skill_match = int(d.get("skillMatch", 0))
    education = d.get("education")
    company_tier = d.get("companyTier")

    if any(skill in resume for skill in ["python", "java", "react", "sql"]):
        factors.append({
            "feature": "Resume Skills",
            "impact": "+30",
            "reason": "Relevant technical skills detected"
        })

    if experience >= 5:
        factors.append({
            "feature": "Experience",
            "impact": "+25",
            "reason": "More than 5 years of experience"
        })

    if education in ["master", "phd"]:
        factors.append({
            "feature": "Education",
            "impact": "+20",
            "reason": "Advanced academic qualification"
        })

    if skill_match >= 70:
        factors.append({
            "feature": "Skill Match",
            "impact": "+15",
            "reason": "High skill-job match percentage"
        })

    if company_tier == "high":
        factors.append({
            "feature": "Company Tier",
            "impact": "+10",
            "reason": "Experience in top-tier companies"
        })

    summary = "Strong candidate profile" if len(factors) >= 3 else "Candidate does not meet hiring threshold"

    return {
        "summary": summary,
        "factors": factors
    }