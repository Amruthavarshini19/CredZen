class LearningEngine:
    LESSONS = {
        1: "Understanding Credit Utilization",
        2: "Managing Payment Deadlines",
        3: "Interest Rates Explained",
        4: "Good Debt vs Bad Debt"
    }

    @staticmethod
    def get_recommendations(utilization: float, risk_level: str):
        """
        Determines which lessons a user should see based on their profile.
        """
        recommended_lessons = []
        
        if utilization > 30:
            recommended_lessons.append({
                "id": 1, 
                "title": LearningEngine.LESSONS[1],
                "reason": "High Utilization Alert"
            })
            
        if risk_level == "High" or risk_level == "Medium":
            recommended_lessons.append({
                "id": 2, 
                "title": LearningEngine.LESSONS[2],
                "reason": "Risk Management"
            })
            
        # Default lesson
        if not recommended_lessons:
            recommended_lessons.append({
                "id": 4, 
                "title": LearningEngine.LESSONS[4],
                "reason": "General Financial Literacy"
            })
            
        return recommended_lessons
