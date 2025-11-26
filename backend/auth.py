from datetime import datetime, timedelta
from typing import Optional
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Simple in-memory user storage (replace with database later)
users_db = {}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return user_id
    except:
        return None

def hash_password(password: str) -> str:
    # Simple hashing - use bcrypt in production
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

def register_user(email: str, password: str) -> dict:
    if email in users_db:
        return {"error": "User already exists"}
    
    users_db[email] = {
        "email": email,
        "password": hash_password(password),
        "created_at": datetime.utcnow().isoformat()
    }
    return {"email": email, "message": "User registered successfully"}

def authenticate_user(email: str, password: str) -> Optional[dict]:
    if email not in users_db:
        return None
    
    user = users_db[email]
    if user["password"] != hash_password(password):
        return None
    
    return user