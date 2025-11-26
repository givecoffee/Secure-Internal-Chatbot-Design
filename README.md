# AI Opportunity Center Chatbot

## Team Members
[Bradley Charles](https://github.com/BradleyCharles)<br/>
[Rae Maffei](https://github.com/givecoffee)<br/>
[Livan Hagi Osman](https://github.com/livanho)<br/>
[Mark Yosinao](https://github.com/makayo)
## Project Overview
We are designing a prototype for a secure, in-house chatbot system with the focus on compliance, security, data privacy, and protecting intellectual property that are typically at risk with AI chatbots. Our proposed solution will include research, a detailed project report, and a final deliverable of a simple, working prototype. If possible, we wanted it to have multilingual capabilities. 

### Requirements:

- Compliance with HIPAA, FERPA, etc.
- Protection for Intellectual Property
- Run on internal, in-house infrastructure 
- Provide articulate and helpful responses based on approved knowledge
- Use authentication tools to secure interactions
- Maintain audit logs as per compliance regulations

## Tech Stack

1. Frontend
    - TypeScript
    - Next.js
2. Backend
    - Python
    - FastAPI
3. LLM
    - Ollama (TinyLlama-1.1B-Chat)
4. Authentication
    - Basic token support (WIP)

## Setup & Installation

### Prerequisites
- Python 3.12+
- Node.js 24+ (with npm)
- Git

### 1) Clone the repo
```bash
git clone https://github.com/OC-Chatbot/Secure-Internal-Chatbot-Design.git
cd Secure-Internal-Chatbot-Design
```

### 2) Backend setup (FastAPI)
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r backend/requirements.txt
```

### 3) Frontend setup (Next.js)
```bash
npm install
```

### 4) Run both services
Recommended (single command):
```bash
python start_services.py
```
This starts `uvicorn backend.main:app` on port 8000 and `next dev` on port 3000. It also sets `NEXT_PUBLIC_API_URL` to `http://localhost:8000/api` if unset.

Manual alternative:
```bash
# Terminal 1
source .venv/bin/activate
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2
npm run dev -- --port 3000
```

### 5) Access the app
- Frontend: http://localhost:3000 (chat UI at `/chat`)
- Backend docs: http://localhost:8000/docs

### Notes
- The backend loads the TinyLlama model from Hugging Face; first run requires network access or a pre-cached model in your HF cache.
- Configure `NEXT_PUBLIC_API_URL` if your backend runs on a different host/port. You can export it before `npm run dev` or set it in `.env.local`.
