import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_relevant_faqs(query: str, limit: int = 3) -> list[dict]:
    """Retrieve relevant FAQs from PostgreSQL based on user query."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Simple keyword search - you can improve this with more advanced search
        sql = """
            SELECT id, category, question, answer 
            FROM faqs 
            WHERE question ILIKE %s OR answer ILIKE %s
            LIMIT %s
        """
        search_term = f"%{query}%"
        cur.execute(sql, (search_term, search_term, limit))
        faqs = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return [dict(faq) for faq in faqs]
    except Exception as e:
        print(f"Database error: {e}")
        return []

def augment_prompt_with_context(user_query: str, conversation_history: str) -> str:
    """Add FAQ context to the prompt using RAG pattern."""
    faqs = get_relevant_faqs(user_query)
    
    if not faqs:
        return conversation_history
    
    context = "Relevant information from the Opportunity Center:\n"
    for faq in faqs:
        context += f"- {faq['question']}: {faq['answer']}\n"
    
    augmented = f"{context}\n{conversation_history}"
    return augmented