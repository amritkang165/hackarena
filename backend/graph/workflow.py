from langgraph.graph import StateGraph
from langgraph.graph import END

from schemas.state import AgentState

from agents.analysis_planner import analysis_planner_node
from agents.idea_pipeline import idea_pipeline_node
from agents.idea_selector import idea_selector_node
from agents.solution_architect import solution_architect_node
from agents.pitch_deck import pitch_deck_node
from agents.report_generator import report_generator_node


builder = StateGraph(AgentState)

# Nodes

builder.add_node(
    "analysis_planner",
    analysis_planner_node
)

builder.add_node(
    "idea_pipeline",
    idea_pipeline_node
)

builder.add_node(
    "idea_selector",
    idea_selector_node
)

builder.add_node(
    "solution_architect",
    solution_architect_node
)

builder.add_node(
    "pitch_deck",
    pitch_deck_node
)

builder.add_node(
    "report_generator",
    report_generator_node
)

# Entry Point

builder.set_entry_point(
    "analysis_planner"
)

# Edges

builder.add_edge(
    "analysis_planner",
    "idea_pipeline"
)

builder.add_edge(
    "idea_pipeline",
    "idea_selector"
)

builder.add_edge(
    "idea_selector",
    "solution_architect"
)

builder.add_edge(
    "solution_architect",
    "pitch_deck"
)

builder.add_edge(
    "pitch_deck",
    "report_generator"
)

builder.add_edge(
    "report_generator",
    END
)

# Compile Graph

graph = builder.compile()
