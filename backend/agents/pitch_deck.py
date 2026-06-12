import os
from pathlib import Path

from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from langchain_groq import ChatGroq

from schemas.presentation_pitch import PresentationPitch

load_dotenv()

SCOPES = [
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/drive.file",
]

_token_path = Path(__file__).parent.parent / "token.json"
if _token_path.exists():
    creds = Credentials.from_authorized_user_file(str(_token_path), SCOPES)
else:
    creds = None

slides_service = build("slides", "v1", credentials=creds) if creds else None
drive_service = build("drive", "v3", credentials=creds) if creds else None

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY1")
)

THEMES = [
    {"primary": (0.10, 0.46, 0.82), "light": (0.91, 0.94, 0.98), "bg": (1, 1, 1)},
    {"primary": (0.20, 0.66, 0.33), "light": (0.90, 0.96, 0.92), "bg": (1, 1, 1)},
    {"primary": (0.92, 0.26, 0.21), "light": (0.99, 0.91, 0.90), "bg": (1, 1, 1)},
    {"primary": (0.98, 0.67, 0.00), "light": (1.00, 0.97, 0.88), "bg": (1, 1, 1)},
    {"primary": (0.61, 0.15, 0.69), "light": (0.95, 0.90, 0.96), "bg": (1, 1, 1)},
    {"primary": (0.00, 0.75, 0.83), "light": (0.89, 0.97, 0.98), "bg": (1, 1, 1)},
]


def rgb(c):
    return {"red": c[0], "green": c[1], "blue": c[2]}


def fg(c):
    return {"foregroundColor": {"opaqueColor": {"rgbColor": rgb(c)}}}


def fill(c):
    return {"shapeBackgroundFill": {"solidFill": {"color": {"rgbColor": rgb(c)}}}}


def outline(c, w=2):
    return {"outline": {"outlineFill": {"solidFill": {"color": {"rgbColor": rgb(c)}}}, "weight": {"magnitude": w, "unit": "PT"}}}


def create_google_slides(slides_data: list[dict]) -> str:
    presentation = slides_service.presentations().create(
        body={"title": "exHacker Pitch Deck"}
    ).execute()
    pres_id = presentation["presentationId"]

    requests = []

    for i, slide in enumerate(slides_data):
        theme = THEMES[i % len(THEMES)]
        title = slide.get("title", "")
        content = slide.get("content", [])
        visual = (slide.get("visual_suggestion", "") or "").lower()

        sid_ = f"slide_{i}"

        requests.append({
            "createSlide": {
                "objectId": sid_,
                "slideLayoutReference": {"predefinedLayout": "BLANK"},
            }
        })

        requests.append({
            "createShape": {
                "objectId": f"bg_{i}_",
                "shapeType": "RECTANGLE",
                "elementProperties": {
                    "pageObjectId": sid_,
                    "size": {"width": {"magnitude": 720, "unit": "PT"}, "height": {"magnitude": 405, "unit": "PT"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": 0, "translateY": 0, "unit": "PT"}
                }
            }
        })
        requests.append({
            "updateShapeProperties": {
                "objectId": f"bg_{i}_",
                "shapeProperties": fill(theme["bg"]),
                "fields": "shapeBackgroundFill"
            }
        })

        requests.append({
            "createShape": {
                "objectId": f"bar_{i}_",
                "shapeType": "RECTANGLE",
                "elementProperties": {
                    "pageObjectId": sid_,
                    "size": {"width": {"magnitude": 720, "unit": "PT"}, "height": {"magnitude": 6, "unit": "PT"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": 0, "translateY": 0, "unit": "PT"}
                }
            }
        })
        requests.append({
            "updateShapeProperties": {
                "objectId": f"bar_{i}_",
                "shapeProperties": fill(theme["primary"]),
                "fields": "shapeBackgroundFill"
            }
        })

        requests.append({
            "createShape": {
                "objectId": f"dot_{i}_",
                "shapeType": "ELLIPSE",
                "elementProperties": {
                    "pageObjectId": sid_,
                    "size": {"width": {"magnitude": 12, "unit": "PT"}, "height": {"magnitude": 12, "unit": "PT"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": 50, "translateY": 22, "unit": "PT"}
                }
            }
        })
        requests.append({
            "updateShapeProperties": {
                "objectId": f"dot_{i}_",
                "shapeProperties": fill(theme["primary"]),
                "fields": "shapeBackgroundFill"
            }
        })

        tid = f"ttl_{i}_"
        requests.append({
            "createShape": {
                "objectId": tid,
                "shapeType": "TEXT_BOX",
                "elementProperties": {
                    "pageObjectId": sid_,
                    "size": {"width": {"magnitude": 600, "unit": "PT"}, "height": {"magnitude": 40, "unit": "PT"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": 72, "translateY": 28, "unit": "PT"}
                }
            }
        })
        requests.append({"insertText": {"objectId": tid, "text": title}})
        requests.append({
            "updateTextStyle": {
                "objectId": tid,
                "style": {
                    "fontSize": {"magnitude": 22, "unit": "PT"},
                    "bold": True,
                    **fg(theme["primary"]),
                },
                "fields": "fontSize,bold,foregroundColor"
            }
        })

        if content:
            bid = f"bdy_{i}_"
            body_text = "\n".join(f"\u2022 {line}" for line in content)
            requests.append({
                "createShape": {
                    "objectId": bid,
                    "shapeType": "TEXT_BOX",
                    "elementProperties": {
                        "pageObjectId": sid_,
                        "size": {"width": {"magnitude": 400, "unit": "PT"}, "height": {"magnitude": 200, "unit": "PT"}},
                        "transform": {"scaleX": 1, "scaleY": 1, "translateX": 72, "translateY": 80, "unit": "PT"}
                    }
                }
            })
            requests.append({"insertText": {"objectId": bid, "text": body_text}})
            requests.append({
                "updateTextStyle": {
                    "objectId": bid,
                    "style": {
                        "fontSize": {"magnitude": 16, "unit": "PT"},
                        **fg((0.15, 0.15, 0.15)),
                    },
                    "fields": "fontSize,foregroundColor"
                }
            })

        if "chart" in visual or "graph" in visual or "data" in visual or "stat" in visual or "metric" in visual:
            bars = [("A", 0.5), ("B", 0.8), ("C", 1.0)]
            bw, gap, max_h = 70, 25, 100
            sx, sy = 480, 280
            for bi, (bl, bv) in enumerate(bars):
                bh = max_h * bv
                xp = sx + bi * (bw + gap)
                yp = sy - bh
                requests.append({
                    "createShape": {
                        "objectId": f"cht_{i}_{bi}",
                        "shapeType": "RECTANGLE",
                        "elementProperties": {
                            "pageObjectId": sid_,
                            "size": {"width": {"magnitude": bw, "unit": "PT"}, "height": {"magnitude": bh, "unit": "PT"}},
                            "transform": {"scaleX": 1, "scaleY": 1, "translateX": xp, "translateY": yp, "unit": "PT"}
                        }
                    }
                })
                requests.append({
                    "updateShapeProperties": {
                        "objectId": f"cht_{i}_{bi}",
                        "shapeProperties": fill(theme["primary"]),
                        "fields": "shapeBackgroundFill"
                    }
                })
        elif "flow" in visual or "process" in visual or "step" in visual or "timeline" in visual:
            steps_x = [72, 262, 452]
            for si, sx_ in enumerate(steps_x):
                requests.append({
                    "createShape": {
                        "objectId": f"flw_{i}_{si}",
                        "shapeType": "ROUND_RECTANGLE",
                        "elementProperties": {
                            "pageObjectId": sid_,
                            "size": {"width": {"magnitude": 140, "unit": "PT"}, "height": {"magnitude": 80, "unit": "PT"}},
                            "transform": {"scaleX": 1, "scaleY": 1, "translateX": sx_, "translateY": 260, "unit": "PT"}
                        }
                    }
                })
                requests.append({
                    "updateShapeProperties": {
                        "objectId": f"flw_{i}_{si}",
                        "shapeProperties": {
                            **fill(theme["light"]),
                            **outline(theme["primary"], 2),
                        },
                        "fields": "shapeBackgroundFill,outline"
                    }
                })

                ftid = f"flt_{i}_{si}"
                requests.append({
                    "createShape": {
                        "objectId": ftid,
                        "shapeType": "TEXT_BOX",
                        "elementProperties": {
                            "pageObjectId": sid_,
                            "size": {"width": {"magnitude": 140, "unit": "PT"}, "height": {"magnitude": 20, "unit": "PT"}},
                            "transform": {"scaleX": 1, "scaleY": 1, "translateX": sx_, "translateY": 290, "unit": "PT"}
                        }
                    }
                })
                requests.append({"insertText": {"objectId": ftid, "text": f"Step {si + 1}"}})
                requests.append({
                    "updateTextStyle": {
                        "objectId": ftid,
                        "style": {
                            "fontSize": {"magnitude": 12, "unit": "PT"},
                            "bold": True,
                            **fg(theme["primary"]),
                        },
                        "fields": "fontSize,bold,foregroundColor"
                    }
                })
        elif "comparison" in visual or "vs" in visual or "before" in visual or "after" in visual:
            pw, gap, y = 260, 30, 210
            for pi, (cl, cc) in enumerate([("Before", (0.85, 0.85, 0.90)), ("After", theme["primary"])]):
                cx = 80 + pi * (pw + gap)
                requests.append({
                    "createShape": {
                        "objectId": f"cmp_{i}_{pi}",
                        "shapeType": "ROUND_RECTANGLE",
                        "elementProperties": {
                            "pageObjectId": sid_,
                            "size": {"width": {"magnitude": pw, "unit": "PT"}, "height": {"magnitude": 140, "unit": "PT"}},
                            "transform": {"scaleX": 1, "scaleY": 1, "translateX": cx, "translateY": y, "unit": "PT"}
                        }
                    }
                })
                requests.append({
                    "updateShapeProperties": {
                        "objectId": f"cmp_{i}_{pi}",
                        "shapeProperties": fill(cc),
                        "fields": "shapeBackgroundFill"
                    }
                })
                ctid = f"cpt_{i}_{pi}"
                txt_clr = (1, 1, 1) if pi == 1 else (0.15, 0.15, 0.15)
                requests.append({
                    "createShape": {
                        "objectId": ctid,
                        "shapeType": "TEXT_BOX",
                        "elementProperties": {
                            "pageObjectId": sid_,
                            "size": {"width": {"magnitude": 140, "unit": "PT"}, "height": {"magnitude": 30, "unit": "PT"}},
                            "transform": {"scaleX": 1, "scaleY": 1, "translateX": cx + 10, "translateY": y + 10, "unit": "PT"}
                        }
                    }
                })
                requests.append({"insertText": {"objectId": ctid, "text": cl}})
                requests.append({
                    "updateTextStyle": {
                        "objectId": ctid,
                        "style": {
                            "fontSize": {"magnitude": 18, "unit": "PT"},
                            "bold": True,
                            **fg(txt_clr),
                        },
                        "fields": "fontSize,bold,foregroundColor"
                    }
                })

    batch_size = 100
    for i in range(0, len(requests), batch_size):
        batch = requests[i:i + batch_size]
        slides_service.presentations().batchUpdate(
            presentationId=pres_id,
            body={"requests": batch}
        ).execute()

    return f"https://docs.google.com/presentation/d/{pres_id}"


def pitch_deck_node(state):
    if not creds or not creds.valid:
        return {
            "slides": [],
            "presentation_url": "Not authenticated. Run: .venv/bin/python setup_oauth.py",
            "pitch_30s": "",
            "pitch_2min": "",
            "pitch_5min": ""
        }

    selected_idea = state["selected_idea"]
    solution_blueprint = state["solution_blueprint"]

    prompt = f"""Create a 10-slide pitch deck and 3 pitch scripts (30s, 2min, 5min) for this hackathon project.

For EACH slide, you MUST provide these exact fields:
- slide_number: integer
- title: string
- objective: string (the goal of this slide)
- content: list of strings (3-4 bullet points)
- speaker_notes: string (what the presenter says)
- visual_suggestion: string (chart/flow/comparison/text)

Also provide:
- pitch_30s: string (30-second elevator pitch)
- pitch_2min: string (2-minute hackathon pitch)
- pitch_5min: string (5-minute investor pitch)

Idea: {selected_idea}
Blueprint: {solution_blueprint}

Pitches must be compelling, story-driven, and natural when spoken."""

    result = llm.with_structured_output(PresentationPitch).invoke(prompt)

    slides = [slide.model_dump() for slide in result.slides]

    try:
        presentation_url = create_google_slides(slides)
    except Exception as e:
        import traceback
        traceback.print_exc()
        presentation_url = f"Google Slides creation failed: {e}"

    return {
        "slides": slides,
        "presentation_url": presentation_url,
        "pitch_30s": result.pitch_30s,
        "pitch_2min": result.pitch_2min,
        "pitch_5min": result.pitch_5min
    }
