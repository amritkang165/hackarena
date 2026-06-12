import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq

from schemas.ranked_idea import RankedIdeaList

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY3")
)


def idea_pipeline_node(state):
    analysis = state["problem_analysis"]
    opportunities = state["opportunity_analysis"]

    prompt = f"""Generate and rank 10 hackathon project ideas for this challenge.

For each idea provide: title, tagline, category, demo_hook, why_now, feasibility_plan.

Then score each (0-10) on: innovation, feasibility, hackathon_fit, market_potential, technical_wow_factor. Include strengths, weaknesses, and ranking justification.

Analysis: {analysis}
Opportunities: {opportunities}

Score weighted: wow(30%) + demo_fit(30%) + feasibility(20%) + market(20%)."""

    result = llm.with_structured_output(RankedIdeaList).invoke(prompt)

    return {
        "ranked_ideas": [idea.model_dump() for idea in result.ranked_ideas]
    }
