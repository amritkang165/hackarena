import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq

from schemas.solution_blueprint import SolutionBlueprint

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY2")
)


def solution_architect_node(state):

    selected_idea = state["selected_idea"]

    problem_analysis = state["problem_analysis"]

    prompt = f"""Design a complete execution-ready hackathon solution blueprint for this idea.

Include: product vision (name, description, elevator pitch, why it wins), target users, core features for a 2-min demo, user flow, tech stack (frontend, backend, AI layer, database, deployment), frontend components, backend endpoints (mark live vs mock), AI integration details, database schema, integrations, smoke-and-mirrors plan, future scope, and 24-48hr implementation roadmap.

Demo-first: anything not visible in the pitch should be mocked. Use high-velocity tools (Next.js, Vercel, Supabase). No over-engineering.

Selected Idea:
{selected_idea}

Problem Analysis:
{problem_analysis}
"""

    result = llm.with_structured_output(
        SolutionBlueprint
    ).invoke(prompt)

    return {
        "solution_blueprint": result.model_dump()
    }