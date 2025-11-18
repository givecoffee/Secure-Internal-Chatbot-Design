# AI Opportunity Center Chatbot

## Team Members
[Bradley Charles](https://github.com/BradleyCharles)
[Rae Maffei](https://github.com/givecoffee)

## Project Overview
We are designing a prototype for a secure, in-house chatbot system with the focus on compliance, security, data privacy, and protecting intellectual property that are typically at risk with AI chatbots. Our proposed solution will include research, a detailed project report, and a final deliverable of a simple, working prototype. If possible, we wanted it to have multilingual capabilities. 

### Requirements:

- Compliance with GDPR, HIPAA, SOC2, etc.
- Protection for Intellectual Property
- Run on internal, in-house infastructure
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
    - Ollama (Llama 3 or Mistral)
5. Authentication
    - OAuth 2.0 (Secure token-based auth) 

## Setup & Installation

Pre-reqs:
- Python 3.13+
- Node.js 18+
- PostgreSQL 14+
- Ollama (latest build)
- Clone the repo:
```git clone https://github.com/OC-Chatbot/Secure-Internal-Chatbot-Design.git```
