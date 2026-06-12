import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq

from schemas.analysis_combined import AnalysisCombined

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY1")
)


def analysis_planner_node(state):
    challenge = state["challenge_statement"]
    hackathon_name = state.get("hackathon_name", "")
    sponsors = state.get("sponsors", [])
    tracks = state.get("tracks", [])

    prompt = f"""Analyze this hackathon challenge deeply. Extract the core problem, pain points, stakeholders, constraints, success metrics, opportunities, AI opportunities, unique hackathon angles, suggested features, technical challenges, and judging criteria alignment.

Then identify market gaps, underserved users, high-impact opportunities, technical/innovation/AI opportunities, unique angles, and monetization opportunities.

Challenge: {challenge}
Hackathon: {hackathon_name}
Sponsors: {sponsors}
Tracks: {tracks}"""

    result = llm.with_structured_output(AnalysisCombined).invoke(prompt)

    return {
        "problem_analysis": {
            "problem_statement": result.problem_statement,
            "pain_points": result.pain_points,
            "stakeholders": result.stakeholders,
            "constraints": result.constraints,
            "success_metrics": result.success_metrics,
            "opportunities": result.opportunities,
            "ai_opportunities": result.ai_opportunities,
            "unique_hackathon_angles": result.unique_hackathon_angles,
            "suggested_features": result.suggested_features,
            "technical_challenges": result.technical_challenges,
            "judging_criteria_alignment": result.judging_criteria_alignment,
        },
        "opportunity_analysis": {
            "market_gaps": result.market_gaps,
            "underserved_users": result.underserved_users,
            "high_impact_opportunities": result.high_impact_opportunities,
            "technical_opportunities": result.technical_opportunities,
            "innovation_opportunities": result.innovation_opportunities,
            "ai_opportunities": result.ai_opportunities,
            "unique_hackathon_angles": result.unique_hackathon_angles,
            "monetization_opportunities": result.monetization_opportunities,
        }
    }
