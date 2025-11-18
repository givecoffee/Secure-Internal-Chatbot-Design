# AI Opportunity Center Chatbot

## Team Members
[Bradley Charles](https://github.com/BradleyCharles)<br/>
[Rae Maffei](https://github.com/givecoffee)

## Project Overview
We are designing a prototype for a secure, in-house chatbot system with the focus on compliance, security, data privacy, and protecting intellectual property that are typically at risk with AI chatbots. Our proposed solution will include research, a detailed project report, and a final deliverable of a simple, working prototype. If possible, we wanted it to have multilingual capabilities. 

### Requirements:

- Compliance with GDPR, HIPAA, SOC2, etc.
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
3. Database
    - PostgreSQL
    - Vectors: pgvector/ChromaDB (RAG)
4. LLM
    - Ollama (Llama 3.1 8B)
5. Authentication
    - OAuth 2.0 (Secure token-based auth) 

## Setup & Installation

Pre-reqs:
- Python 3.13+
- Node.js 18+
- PostgreSQL 14+
- Ollama (3.1 8B)
- Git, GitBash
- Clone the repo:
```git clone https://github.com/OC-Chatbot/Secure-Internal-Chatbot-Design.git```

Setup:
1. Clone repository
```git clone https://github.com/OC-Chatbot/Secure-Internal-Chatbot-Design.git```
2. Install Ollama ([here](https://ollama.com/download/windows))
3. Restart Git Bash, verify right version of model:<br/>
```ollama --version```<br/>
```ollama pull llama3.1```<br/>
```ollama serve``` 
4. Start Ollama Server
```ollama serve```
5. Verify Model Installation
```ollama run llama3.1 "Are you ready to work, llama?"```
6. Setup PostgreSQL Database ([download here](https://www.postgresql.org/download/windows))
7. Create the database and the user
8. Setup backend (Python/FastAPI)<br/>
```cd backend```<br/>
Either using Anaconda Navigator to open virtual environment use GitBash:<br/>
```python -m venv venv```<br/>
```venv\Scripts\activate```<br/>
Add dependencies:<br/>
```pip install -r requirements.txt```<br/>
Configure env variables and .env, generate SECURE KEY and update file.<br/>
Database migrations:<br/>
```alembic upgrade head```<br/>
Start backend server:<br/>
```uvicorn app.main:app --reload --host 0.0.0.0 --port 8000```<br/>
API Base hosted:<br/>
http://localhost:8000<br/>
Interactive Docs:<br/>
http://localhost:8000/docs<br/>
9. Setup frontend (Next.js/TypeScript)<br/>
```cd frontend```<br/>
```npm install```<br/>
Configure env variables and edit .env.local<br/>
```cp .env.example .env.local```<br/>
```NEXT_PUBLIC_API_URL=http://localhost:8000```<br/>
Start development server:
```npm run dev```
10. Run Application
Open four terminals:
    - Terminal #1: Ollama ```ollama serve```<br/>
    - Terminal #2: PostgreSQL (if not running as a service): ```net start postgresql-x64-14```<br/>
    - Terminal #3: ```cd backend```, ```venv\Scripts\activate```, ```uvicorn app.main:app --reload --port 8000```<br/>
    - Terminal #4: ```cd frontend```, ```npm run dev```
11. Access Application<br/>
Open http://localhost:3000 in browser, log in with demo credentials (if set up to seed)<br/>

Start Chatting!<br/>

Future Docker Setup to come to containerize the deployment via Docker Compose. 
