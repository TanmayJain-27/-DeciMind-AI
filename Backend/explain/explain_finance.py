def explain_finance(d):
    factors = []

    income = int(d.get("income", 0))
    credit = int(d.get("creditScore", 0))
    loan = int(d.get("loanAmount", 0))
    employment = d.get("employment")

    if income > 500000:
        factors.append({
            "feature": "Income",
            "impact": "+30",
            "reason": "Annual income above ₹5,00,000"
        })

    if credit > 700:
        factors.append({
            "feature": "Credit Score",
            "impact": "+30",
            "reason": "Credit score above 700"
        })

    if loan < income * 2:
        factors.append({
            "feature": "Loan Amount",
            "impact": "+20",
            "reason": "Loan amount within safe income ratio"
        })

    if employment != "unemployed":
        factors.append({
            "feature": "Employment Status",
            "impact": "+20",
            "reason": "Applicant is employed"
        })

    summary = "Strong financial profile" if len(factors) >= 3 else "Weak financial indicators"

    return {
        "summary": summary,
        "factors": factors
    }