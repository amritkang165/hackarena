from pydantic import BaseModel


class AnalysisCombined(BaseModel):
    # Problem Analysis fields
    problem_statement: str
    pain_points: list[str]
    stakeholders: list[str]
    constraints: list[str]
    success_metrics: list[str]
    opportunities: list[str]
    ai_opportunities: list[str]
    unique_hackathon_angles: list[str]
    suggested_features: list[str]
    technical_challenges: list[str]
    judging_criteria_alignment: list[str]

    # Opportunity Analysis fields
    market_gaps: list[str]
    underserved_users: list[str]
    high_impact_opportunities: list[str]
    technical_opportunities: list[str]
    innovation_opportunities: list[str]
    monetization_opportunities: list[str]
