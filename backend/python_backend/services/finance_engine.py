import math

class FinanceEngine:
    @staticmethod
    def calculate_amortization(principal: float, rate: float, monthly_payment: float):
        """
        Calculates the amortization schedule and total interest for a loan.
        Args:
            principal (float): The loan amount.
            rate (float): Annual interest rate (percentage).
            monthly_payment (float): The fixed monthly payment.
        
        Returns:
            dict: {
                "total_interest": float,
                "months_to_pay_off": int,
                "total_payment": float,
                "invisible_cost_ratio": float,
                "schedule": list[dict]
            }
        """
        if rate <= 0:
            return {
                "total_interest": 0,
                "months_to_pay_off": math.ceil(principal / monthly_payment),
                "total_payment": principal,
                "invisible_cost_ratio": 1.0,
                "schedule": []
            }

        monthly_rate = (rate / 100) / 12
        balance = principal
        total_interest = 0
        months = 0
        schedule = []

        # Safety break to prevent infinite loops if payment is too low
        max_months = 360  # 30 years
        
        # Calculate minimum payment needed to cover interest (P * r)
        # r is monthly rate in decimal
        min_payment_math = principal * monthly_rate
        
        # We return this as the "Minimum to Cover Interest" per user spec
        # We'll use a slightly higher value for the slider min to ensure progress, 
        # but the specific "min_payment" field should follow the formula P*r.
        # However, purely P*r means balance never decreases. 
        # The prompt says: "If your payment is lower than this... debt will grow". 
        # So P*r is the stability point.
        
        if monthly_payment <= min_payment_math:
             return {
                 "error": "Monthly payment is too low to cover interest.",
                 "min_payment_needed": round(min_payment_math + 1, 2)
             }

        # Formula 1: Time to Freedom (n)
        # n = -log(1- rP/M)/ log(1+r)
        import math # ensure math is imported
        
        # rP/M
        numerator_inner = 1 - (min_payment_math / monthly_payment)
        
        # If numerator_inner <= 0, it means Infinite debt (should be caught by check above)
        if numerator_inner <= 0:
             return {
                 "error": "Monthly payment is too low.",
                 "min_payment_needed": round(min_payment_math + 1, 2)
             }

        n_months_float = -math.log(numerator_inner) / math.log(1 + monthly_rate)
        
        # Round up for integer months representation like "Time to Freedom" usually implies duration
        # But for "True Cost = M * n", we should use the exact float n or the ceiled n?
        # "True Cost ... is simply the monthly payment multiplied by the number of months."
        # Usually you pay integer months. Last month is partial. 
        # However, to strict follow "M * n", let's use the calculated n. 
        # Users usually expect "months" to be an integer count of payments.
        
        months_count = math.ceil(n_months_float)

        # Formula 2: True Cost = M * n
        # If we interpret n as "number of months" (integer), then formula is M * months_count
        # If we interpret n as the exact time value (float), it's M * n_months_float.
        # Given "Number of Months" header, let's stick to the integer duration for display, 
        # but the prompt says "True Cost = M * n". 
        # In a real loan, you don't pay 'n' full payments of M. You pay n-1 payments of M and one partial.
        # BUT, the user explicitly said: "True Cost ... is simply the monthly payment multiplied by the number of months."
        # This implies True Cost = M * ceil(n). Let's assume n is the number of months.
        
        true_cost = monthly_payment * months_count

        # Formula 3: Invisible Debt = True Cost - Original Purchase Amount
        invisible_debt = true_cost - principal

        # Schedule Generation (Keep iterative for the chart)
        while balance > 0 and months < max_months:
            interest = balance * monthly_rate
            principal_payment = monthly_payment - interest
            
            if (balance + interest) < monthly_payment:
                # Last month adjust
                principal_payment = balance
                balance = 0
            else:
                balance -= principal_payment
            
            months += 1
            schedule.append({
                "month": months,
                "payment": monthly_payment,
                "principal_paid": principal_payment,
                "interest_paid": interest,
                "remaining_balance": max(0, balance)
            })
            if balance <= 0: break

        return {
            "total_interest": round(invisible_debt, 2), # Invisible Debt
            "months_to_pay_off": months_count,          # Time to Freedom
            "total_payment": round(true_cost, 2),       # True Cost
            "invisible_cost_ratio": round(true_cost / principal, 2) if principal > 0 else 0,
            "min_payment": round(min_payment_math, 2),  # P * r
            "schedule": schedule
        }

    @staticmethod
    def assess_risk(utilization: float, missed_payments: int):
        """
        Assess risk based on utilization and payment history.
        """
        risk_score = 0
        risk_level = "Low"
        
        # Utilization Logic
        if utilization > 70:
            risk_score += 50
        elif utilization > 30:
            risk_score += 20
        
        # Missed Payment Logic
        if missed_payments > 0:
            risk_score += 30 * missed_payments
            
        # Determine Level
        if risk_score >= 60:
            risk_level = "High"
        elif risk_score >= 30:
            risk_level = "Medium"
            
        return {
            "risk_score": min(100, risk_score),
            "risk_level": risk_level
        }
