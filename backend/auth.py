from datetime import datetime, timedelta
from typing import Optional
import jwt
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://chatbot_admin:password@localhost/oc")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

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
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

def register_user(email: str, password: str) -> dict:
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if user exists
        cur.execute("SELECT email FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return {"error": "User already exists"}
        
        # Insert new user
        hashed_pwd = hash_password(password)
        cur.execute(
            "INSERT INTO users (email, password) VALUES (%s, %s)",
            (email, hashed_pwd)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {"email": email, "message": "User registered successfully"}
    except Exception as e:
        return {"error": str(e)}

def authenticate_user(email: str, password: str) -> Optional[dict]:
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT email, password FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user:
            return None
        
        user_email, stored_password = user
        if stored_password != hash_password(password):
            return None
        
        return {"email": user_email}
    except Exception as e:
        print(f"Auth error: {e}")
        return None