def calculate_dti(monthly_debt: float, monthly_income: float) -> float:
    if monthly_income <= 0:
        return 0.0
    return round((monthly_debt / monthly_income) * 100, 1)

def calculate_utilization(outstanding_credit: float, credit_limit: float) -> float:
    if credit_limit <= 0:
        return 0.0
    return round((outstanding_credit / credit_limit) * 100, 1)

def calculate_available_credit(credit_limit: float, outstanding_credit: float) -> float:
    return max(0.0, round(credit_limit - outstanding_credit, 2))

def compute_snapshot_delta(current_score: int, current_utilization: float, current_dti: float, current_debt: float, previous_snapshot) -> dict:
    if not previous_snapshot:
        return {
            "score_change": 0,
            "score_change_text": "No previous record",
            "utilization_change": 0.0,
            "dti_change": 0.0,
            "debt_change": 0.0
        }
    
    score_diff = current_score - previous_snapshot.credit_score
    score_text = f"+{score_diff}" if score_diff > 0 else (str(score_diff) if score_diff < 0 else "0 (No change)")
    
    return {
        "score_change": score_diff,
        "score_change_text": score_text,
        "utilization_change": round(current_utilization - previous_snapshot.utilization, 1),
        "dti_change": round(current_dti - previous_snapshot.dti, 1),
        "debt_change": round(current_debt - previous_snapshot.outstanding_debt, 2)
    }
