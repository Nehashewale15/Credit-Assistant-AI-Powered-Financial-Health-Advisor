import json
import logging
from typing import Dict, Any, List
from app.core.config import settings
from app.schemas.ai import AIAnalysisResponse
from app.services.calculations import calculate_dti, calculate_utilization, calculate_available_credit

logger = logging.getLogger("credit_assistant.gemini")

SYSTEM_PROMPT = """
You are Credit Assistant, an expert educational credit-health advisor tailored for individuals navigating the Indian financial landscape.

Your Mission:
Provide clear, practical, and highly personalized educational credit-health advice based strictly on the financial metrics provided by the user.

CRITICAL COMPLIANCE RULES:
1. NEVER claim to calculate or determine an official CIBIL, Experian, or credit-bureau score. Explicitly state that scores are user-reported.
2. ALWAYS frame all feedback as educational guidance and NOT regulated professional financial or investment advice.
3. NEVER ask for sensitive financial credentials (PIN, CVV, OTP, banking passwords, net-banking logins).
4. NEVER fabricate banking regulations or guarantee specific point-score increases.
5. Provide monetary figures in Indian Rupees (₹).
6. Format your output strictly in valid JSON matching the specified JSON schema.

JSON Output Schema:
{
  "summary": "A 2-3 sentence overview of the user's current credit health situation based on their DTI and utilization.",
  "key_factors": [
    "Key factor 1 explaining an observed metric",
    "Key factor 2 explaining another metric",
    "Key factor 3 regarding repayment history or goal"
  ],
  "action_plan": [
    "Step 1: Specific prioritized action",
    "Step 2: Specific prioritized action",
    "Step 3: Specific prioritized action",
    "Step 4: Specific prioritized action",
    "Step 5: Specific prioritized action"
  ],
  "explanation": "A comprehensive, encouraging educational explanation (3-4 paragraphs) breaking down why these steps matter for Indian borrowers."
}
"""

def generate_gemini_analysis(user_name: str, profile: Any) -> AIAnalysisResponse:
    dti = calculate_dti(profile.monthly_debt, profile.monthly_income)
    utilization = calculate_utilization(profile.outstanding_credit, profile.credit_limit)
    available_credit = calculate_available_credit(profile.credit_limit, profile.outstanding_credit)

    user_context_prompt = f"""
User Profile Data:
- Name: {user_name}
- Self-Reported Credit Score: {profile.credit_score}
- Monthly Income: ₹{profile.monthly_income:,.2f}
- Monthly Essential Expenses: ₹{profile.monthly_expenses:,.2f}
- Monthly EMI / Debt Obligations: ₹{profile.monthly_debt:,.2f}
- Total Credit Limit: ₹{profile.credit_limit:,.2f}
- Outstanding Credit Card Balance: ₹{profile.outstanding_credit:,.2f}
- Missed Payments Count: {profile.missed_payments}
- Primary Financial Goal: {profile.financial_goal}

Derived Calculations:
- Debt-to-Income (DTI) Ratio: {dti}%
- Credit Utilization Ratio: {utilization}%
- Available Credit: ₹{available_credit:,.2f}

Please generate an educational credit health assessment following the system prompt rules and JSON structure.
"""

    if settings.GEMINI_API_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"{SYSTEM_PROMPT}\n\n{user_context_prompt}"
            )
            
            raw_text = response.text.strip()
            # Clean potential markdown block formatting
            if raw_text.startswith("```json"):
                raw_text = raw_text.replace("```json", "", 1)
            if raw_text.startswith("```"):
                raw_text = raw_text.replace("```", "", 1)
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()
            
            data = json.loads(raw_text)
            return AIAnalysisResponse(
                summary=data.get("summary", ""),
                key_factors=data.get("key_factors", []),
                action_plan=data.get("action_plan", []),
                explanation=data.get("explanation", "")
            )
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}. Falling back to rule-based AI engine.")

    # Rule-Based Educational AI Engine Fallback (Guarantees zero-failure operation even without API key)
    return generate_fallback_analysis(user_name, profile, dti, utilization, available_credit)


def generate_fallback_analysis(user_name: str, profile: Any, dti: float, utilization: float, available_credit: float) -> AIAnalysisResponse:
    score = profile.credit_score
    goal = profile.financial_goal

    # Summary synthesis
    summary = (
        f"Hello {user_name}, your self-reported credit score is {score} with a Debt-to-Income (DTI) ratio of {dti:.1f}% "
        f"and credit utilization of {utilization:.1f}%. Your current financial profile shows an available credit buffer "
        f"of ₹{available_credit:,.2f} against your stated goal to '{goal.lower()}'."
    )

    # Key Factors
    key_factors = [
        f"Revolving Credit Utilization is currently at {utilization:.1f}% (Total Limit: ₹{profile.credit_limit:,.0f}, Used: ₹{profile.outstanding_credit:,.0f}).",
        f"Debt-to-Income Ratio stands at {dti:.1f}% with monthly EMI commitments of ₹{profile.monthly_debt:,.0f} out of ₹{profile.monthly_income:,.0f} income.",
        f"Repayment Record: {profile.missed_payments} missed payment(s) reported in recent billing cycles."
    ]

    # Exactly 5-Step Action Plan
    action_plan = [
        f"Step 1: Reduce Revolving Balances – Prioritize paying down card balances to lower your utilization from {utilization:.1f}% toward the recommended 30% threshold.",
        f"Step 2: Automate Monthly EMIs – Set up Auto-Debit / NACH mandates for all recurring payments to prevent accidental late fees or reported delays.",
        f"Step 3: Restructure Fixed Debt – Focus surplus income on reducing your ₹{profile.monthly_debt:,.0f} monthly debt payments to lower your DTI ratio below 35%.",
        f"Step 4: Avoid Unnecessary Credit Inquiries – Refrain from applying for multiple new credit cards or loans simultaneously within short time windows.",
        f"Step 5: Track Monthly Snapshots – Regularly update your income and debt figures on Credit Assistant to monitor your financial metrics over time."
    ]

    # Explanation
    explanation = (
        f"Educational Guidance Overview:\n\n"
        f"In the Indian financial context, managing revolving credit and debt ratios effectively is fundamental to maintaining a healthy financial standing. "
        f"Your current credit utilization of {utilization:.1f}% represents the percentage of borrowing capacity currently active. Lowering this ratio below 30% demonstrates strong financial liquidity.\n\n"
        f"Furthermore, your Debt-to-Income ratio of {dti:.1f}% indicates that ₹{profile.monthly_debt:,.0f} of your monthly gross income (₹{profile.monthly_income:,.0f}) is pledged toward debt service. "
        f"Lowering your fixed EMI commitments provides a safer financial cushion for unexpected expenses and savings.\n\n"
        f"Disclaimer: Credit Assistant provides educational financial information for self-monitoring purposes. It does not calculate official CIBIL credit scores or provide regulated investment advice."
    )

    return AIAnalysisResponse(
        summary=summary,
        key_factors=key_factors,
        action_plan=action_plan,
        explanation=explanation
    )


def generate_gemini_chat_answer(user_name: str, profile: Any, question: str) -> str:
    dti = calculate_dti(profile.monthly_debt, profile.monthly_income) if profile else 0.0
    utilization = calculate_utilization(profile.outstanding_credit, profile.credit_limit) if profile else 0.0

    context = ""
    if profile:
        context = (
            f"User Context: {user_name}, Self-Reported Score: {profile.credit_score}, "
            f"Monthly Income: ₹{profile.monthly_income:,.0f}, Monthly Debt: ₹{profile.monthly_debt:,.0f} (DTI: {dti:.1f}%), "
            f"Credit Limit: ₹{profile.credit_limit:,.0f}, Outstanding: ₹{profile.outstanding_credit:,.0f} (Utilization: {utilization:.1f}%)."
        )

    prompt = f"""
You are Credit Assistant, an educational financial guidance bot in India.
Answer the user's question concisely, using simple educational language and referring to their financial context where relevant.

{context}
User Question: {question}

Remember:
- Keep the response clear, structured, and helpful.
- Remind the user that this is educational advice and not an official credit bureau determination.
- Provide figures in INR (₹).
"""

    if settings.GEMINI_API_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini Chat API call failed: {e}")

    # Educational rule-based Q&A fallback for standard credit questions
    q_lower = question.lower()
    if "utilization" in q_lower:
        return (
            f"Credit utilization is the percentage of your credit limit that you are currently using. "
            f"For example, your current utilization is {utilization:.1f}% (₹{profile.outstanding_credit:,.0f} used out of ₹{profile.credit_limit:,.0f} limit). "
            f"Financial experts in India generally recommend keeping your credit card utilization below 30% to demonstrate prudent financial management."
        )
    elif "dti" in q_lower or "debt to income" in q_lower:
        return (
            f"Debt-to-Income (DTI) ratio measures what percentage of your monthly gross income goes toward debt payments (EMIs, credit cards). "
            f"Your current DTI is {dti:.1f}%. A DTI under 35% is considered healthy, while a DTI above 50% indicates heavy debt commitments."
        )
    elif "reduce debt" in q_lower or "pay off" in q_lower:
        return (
            f"To reduce debt effectively: 1) Focus on paying high-interest credit card debt first (Avalanche method). "
            f"2) Consider consolidating multiple small loans. 3) Avoid creating new debt obligations until your DTI is below 35%."
        )
    elif "time" in q_lower or "missed" in q_lower:
        return (
            f"Paying your bills on time is one of the single most influential habits for long-term credit health. "
            f"Setting up auto-debit mandates (NACH) ensures you never miss a statement due date."
        )
    else:
        return (
            f"Great question! Managing credit health involves keeping credit utilization below 30%, maintaining a DTI below 35%, "
            f"and paying all billing statements on time. Based on your profile, your DTI is {dti:.1f}% and utilization is {utilization:.1f}%. "
            f"Please consult a certified financial planner for specific regulated financial advice."
        )
