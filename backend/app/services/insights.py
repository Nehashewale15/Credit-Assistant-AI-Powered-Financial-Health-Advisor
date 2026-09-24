from typing import List
from app.schemas.dashboard import InsightItem
from app.services.calculations import calculate_dti, calculate_utilization, calculate_available_credit

def generate_insights(profile, score_history=None) -> List[InsightItem]:
    insights = []
    
    if not profile:
        return [
            InsightItem(
                id="no_profile",
                title="Complete Your Financial Profile",
                why_it_matters="Financial metrics provide clarity on your debt capacity and credit health.",
                simple_explanation="You have not completed your financial setup yet.",
                suggested_action="Fill in your income, credit limit, and current debt details to unlock customized credit insights.",
                severity="info"
            )
        ]

    dti = calculate_dti(profile.monthly_debt, profile.monthly_income)
    utilization = calculate_utilization(profile.outstanding_credit, profile.credit_limit)
    available = calculate_available_credit(profile.credit_limit, profile.outstanding_credit)

    # 1. Credit Utilization Analysis
    if utilization >= 70:
        insights.append(InsightItem(
            id="util_critical",
            title="High Revolving Credit Utilization",
            why_it_matters="High revolving utilization (above 70%) signals potential over-reliance on credit to lenders.",
            simple_explanation=f"Your reported credit utilization is currently {utilization:.1f}%, which is significantly above recommended guidelines.",
            suggested_action="Consider making partial repayments to bring utilization below 30% of your total credit limit.",
            severity="critical"
        ))
    elif utilization >= 30:
        insights.append(InsightItem(
            id="util_warning",
            title="Moderate Credit Utilization",
            why_it_matters="Keeping credit utilization below 30% helps maintain positive credit health indicators.",
            simple_explanation=f"Your credit utilization is {utilization:.1f}%. Staying lower reduces monthly finance charges.",
            suggested_action="Aim to lower outstanding card balances or avoid high single-transaction card purchases.",
            severity="warning"
        ))
    else:
        insights.append(InsightItem(
            id="util_good",
            title="Healthy Credit Utilization Level",
            why_it_matters="Low credit utilization (<30%) demonstrates prudent credit usage to financial institutions.",
            simple_explanation=f"Your utilization is {utilization:.1f}%, which is within healthy educational parameters.",
            suggested_action="Maintain this habit by paying full balance before statement due dates.",
            severity="info"
        ))

    # 2. Debt-to-Income (DTI) Analysis
    if dti >= 50:
        insights.append(InsightItem(
            id="dti_critical",
            title="Elevated Debt-to-Income (DTI) Ratio",
            why_it_matters="A DTI over 50% means more than half of your gross income goes toward existing EMIs and obligations.",
            simple_explanation=f"Your current DTI is {dti:.1f}%. High fixed debt leaves limited cash flow for essentials and savings.",
            suggested_action="Focus on snowball/avalanche debt reduction strategies or avoid taking on new loans.",
            severity="critical"
        ))
    elif dti >= 35:
        insights.append(InsightItem(
            id="dti_warning",
            title="Moderate Debt Burden",
            why_it_matters="A DTI between 35% and 50% indicates moderate monthly financial commitments.",
            simple_explanation=f"Your monthly EMI obligations represent {dti:.1f}% of your monthly income (₹{profile.monthly_debt:,.0f} of ₹{profile.monthly_income:,.0f}).",
            suggested_action="Prioritize high-interest loans for prepayment when extra funds become available.",
            severity="warning"
        ))
    else:
        insights.append(InsightItem(
            id="dti_good",
            title="Balanced Debt-to-Income Ratio",
            why_it_matters="A low DTI ratio provides strong financial flexibility and emergency savings capability.",
            simple_explanation=f"Only {dti:.1f}% of your income is allocated to debt payments.",
            suggested_action="Continue allocating surplus funds toward emergency reserves and long-term goals.",
            severity="info"
        ))

    # 3. Missed Payments Analysis
    if profile.missed_payments > 0:
        insights.append(InsightItem(
            id="missed_payments_alert",
            title="Recent Missed Payment Record",
            why_it_matters="Timely payment history is one of the most vital factors in long-term credit discipline.",
            simple_explanation=f"You reported {profile.missed_payments} missed or delayed payment(s) in recent periods.",
            suggested_action="Set up automated mandate payments (NACH / Auto-debit) to avoid missing future due dates.",
            severity="critical" if profile.missed_payments > 1 else "warning"
        ))

    # 4. Score History Trend Analysis
    if score_history and len(score_history) >= 2:
        latest_score = score_history[-1].score
        prev_score = score_history[-2].score
        score_diff = latest_score - prev_score
        
        if score_diff < -15:
            insights.append(InsightItem(
                id="score_declining",
                title="Recent Credit Score Decline Detected",
                why_it_matters="Understanding score changes helps identify recent credit events.",
                simple_explanation=f"Your score decreased by {abs(score_diff)} points (from {prev_score} to {latest_score}).",
                suggested_action="Review recent credit card utilization changes or billing statement dates.",
                severity="warning"
            ))
        elif score_diff > 10:
            insights.append(InsightItem(
                id="score_improving",
                title="Positive Score Trajectory",
                why_it_matters="Consistently improving credit habits build long-term financial health.",
                simple_explanation=f"Your recorded score increased by +{score_diff} points over the previous period.",
                suggested_action="Keep maintaining timely repayments and low revolving balances.",
                severity="info"
            ))

    return insights
