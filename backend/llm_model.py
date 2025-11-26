import requests
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "tinyllama")

def generate_text(
    prompt: str,
    max_new_tokens: int = 80,
    temperature: float = 0.2,
    top_p: float = 0.8,
    do_sample: bool = False,
    wrap_prompt: bool = True,
    strip_after: str | None = None,
) -> str:
    """Generate text using Ollama API instead of local transformers."""
    
    if not prompt:
        raise ValueError("Prompt must not be empty.")
    
    if wrap_prompt:
        system_instruction = (
            "You are a helpful, knowledgeable AI assistant for the Opportunity Center. "
            "Answer the following question clearly and concisely."
        )
        full_prompt = (
            system_instruction
            + "\n\nQuestion:\n"
            + prompt.strip()
            + "\n\nAnswer:"
        )
    else:
        full_prompt = prompt.strip()
    
    try:
        response = requests.post(
            f"{OLLAMA_API_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": full_prompt,
                "stream": False,
                "temperature": temperature,
                "top_p": top_p,
            },
            timeout=30,
        )
        response.raise_for_status()
        result = response.json()
        reply_text = result.get("response", "").strip()
        
        # Strip after marker if provided
        if strip_after and strip_after in reply_text:
            reply_text = reply_text.split(strip_after, 1)[1].strip()
        elif wrap_prompt and "Answer:" in reply_text:
            reply_text = reply_text.split("Answer:", 1)[1].strip()
        
        return reply_text
    except requests.exceptions.RequestException as e:
        raise Exception(f"Ollama API error: {str(e)}")