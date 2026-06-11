import json

from graph.workflow import graph


initial_state = {

    "challenge_statement":
    "Build an AI-powered solution to reduce food waste",

    "hackathon_name":
    "Microsoft AI Skills Fest",

    "sponsors": [
        "Microsoft"
    ],

    "tracks": [
        "AI"
    ],

    "problem_analysis": {},

    "opportunity_analysis": {},

    "ideas": [],

    "ranked_ideas": [],

    "selected_idea": {},

    "solution_blueprint": {},

    "slides": [],

    "pitch_30s": "",

    "pitch_2min": "",

    "pitch_5min": "",

    "final_report": ""
}


result = graph.invoke(initial_state)

with open(
    "exhacker_report.md",
    "w",
    encoding="utf-8"
) as f:

    f.write(
        result["final_report"]
    )

print(f"Generated {len(result['ideas'])} ideas")

for idea in result["ideas"]:
    print(idea["title"])


print(
    json.dumps(
        result,
        indent=2
    )
)
