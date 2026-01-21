from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Groq API Settings
    groq_api_key: str
    llm_model: str = "llama-3.3-70b-versatile"
    llm_temperature: float = 0.1
    max_tokens: int = 2048
    
    # ChromaDB Settings
    chromadb_path: str = "./vectorstore"
    
    # Embedding Settings
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    chunk_size: int = 500
    chunk_overlap: int = 50
    
    # API Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # HuggingFace (optional)
    hf_token: Optional[str] = None
    
    class Config:
        env_file = ".env"

def get_settings():
    return Settings()
