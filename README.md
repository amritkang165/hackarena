# exHacker

exHacker is an AI-powered hackathon copilot that turns a challenge statement into a complete, execution-ready project package. A multi-agent workflow analyzes the problem, identifies opportunities, generates and ranks ideas, lets the user choose a direction, and then produces the technical plan, presentation, pitch scripts, and final report.

## Live Demo

[Launch exHacker on Vercel](https://ex-hacker.vercel.app/)

## Features

- Guided, human-in-the-loop workflow with visible output at every stage
- Problem, stakeholder, pain-point, and success-metric analysis
- Market-gap and opportunity discovery
- Generation of 10 hackathon project ideas
- Idea scoring and ranking across multiple dimensions
- Manual selection of the winning idea
- Technical architecture, MVP scope, and 24-48 hour build roadmap
- 10-slide presentation content with speaker notes
- 30-second, 2-minute, and 5-minute pitch scripts
- Final project report and supporting documents
- Legacy one-shot generation endpoint
- Session restoration while the backend process remains running

## Workflow

1. **Problem Analyst** - analyzes the challenge and its stakeholders.
2. **Opportunity Planner** - identifies market gaps and monetization opportunities.
3. **Idea Generator** - creates 10 competitive project ideas.
4. **Idea Validator** - scores and ranks the ideas.
5. **Idea Selection** - pauses for the user to select or edit an idea.
6. **Solution Architect** - creates the product and technical blueprint.
7. **Presentation Agent** - produces a 10-slide pitch deck outline.
8. **Pitch Agent** - writes pitch scripts for multiple time limits.
9. **Report Generator** - assembles the final project deliverables.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Backend

- FastAPI
- LangGraph
- LangChain
- Groq API with Llama 3.3 70B
- Pydantic

## Project Structure

```text
exHacker/
|-- backend/
|   |-- agents/          # Specialized AI agents
|   |-- api/             # FastAPI application and routes
|   |-- graph/           # One-shot LangGraph workflow
|   |-- schemas/         # Pydantic models and workflow state
|   `-- workflow/        # Step executor and session management
|-- frontend/
|   |-- public/
|   `-- src/
|       |-- app/         # Next.js routes
|       |-- components/  # UI components
|       |-- lib/         # API client
|       `-- types/       # TypeScript types
|-- requirements.txt
`-- start.bat
```

## Prerequisites

- Python 3.10 or newer
- Node.js 20 or newer
- npm
- One or more [Groq API keys](https://console.groq.com/keys)

## Local Setup

### 1. Clone and enter the project

```bash
git clone <repository-url>
cd exHacker
```

### 2. Configure the backend

Create a virtual environment and install the Python dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
GROQ_API_KEY1=your_groq_api_key
GROQ_API_KEY2=your_groq_api_key
GROQ_API_KEY3=your_groq_api_key
```

The same key can be used for all three variables during development. Separate keys may help distribute requests across the agents.

### 3. Configure the frontend

```powershell
cd frontend
npm install
```

Create `frontend/.env.local` so the browser uses the local API:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Return to the project root:

```powershell
cd ..
```

## Running the App

### Windows launcher

After installing both backend and frontend dependencies, run:

```powershell
.\start.bat
```

This opens the backend and frontend in separate terminal windows.

### Manual startup

Start the backend from the project root:

```powershell
.\.venv\Scripts\Activate.ps1
cd backend
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000 --env-file ..\.env
```

In another terminal, start the frontend:

```powershell
cd frontend
npm run dev
```

Open:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)
- API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `POST` | `/generate` | Run the complete legacy workflow |
| `POST` | `/workflow/start` | Create a session and run the first step |
| `POST` | `/workflow/continue` | Run the next agent step |
| `POST` | `/workflow/select-idea` | Select or edit a ranked idea |
| `POST` | `/workflow/update-output` | Edit a completed step's output |
| `GET` | `/workflow/state/{session_id}` | Retrieve the complete workflow state |
| `GET` | `/workflow/current-step/{session_id}` | Retrieve the current step |
| `GET` | `/workflow/output/{session_id}` | Retrieve the latest step output |

## Useful Commands

Run frontend linting:

```powershell
cd frontend
npm run lint
```

Create a production frontend build:

```powershell
cd frontend
npm run build
```

## Deployment Notes

- The frontend is deployed on Vercel at [ex-hacker.vercel.app](https://ex-hacker.vercel.app/).
- The frontend also includes Netlify configuration and can be deployed to other Next.js-compatible platforms.
- Set `NEXT_PUBLIC_API_BASE_URL` to the deployed FastAPI URL.
- Add the deployed frontend origin to the FastAPI CORS configuration in `backend/api/main.py`.
- Configure the three Groq environment variables on the backend host.
- Workflow sessions currently live in memory. They are lost whenever the backend restarts and are not shared between multiple backend instances. Use Redis or another persistent store for production.

## Security

Never commit `.env` files or API keys. The repository's `.gitignore` already excludes common environment files.
