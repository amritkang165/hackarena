from pydantic import BaseModel, Field


class Slide(BaseModel):
    slide_number: int = Field(description="Slide number (1-10)")
    title: str = Field(description="Slide title")
    objective: str = Field(description="The goal or purpose of this slide — what the audience should take away")
    content: list[str] = Field(description="3-4 bullet points displayed on the slide")
    speaker_notes: str = Field(description="The script the presenter speaks during this slide")
    visual_suggestion: str = Field(description="Type of visual: chart, graph, flow, comparison, text, or diagram")


class PresentationPitch(BaseModel):
    slides: list[Slide] = Field(description="10 slides for the pitch deck")
    pitch_30s: str = Field(description="30-second elevator pitch script")
    pitch_2min: str = Field(description="2-minute hackathon pitch script")
    pitch_5min: str = Field(description="5-minute investor pitch script")
