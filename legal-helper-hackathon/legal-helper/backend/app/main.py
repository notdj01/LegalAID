from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import query, comparison, document
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="AI legal Helper API",
    description="Backend for AI-Powered Legal Research Assistant",
    version="1.0.0"
)

# CORS Middleware
# origins = settings.cors_origins.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(query.router, prefix="/api", tags=["Legal Query"])
app.include_router(comparison.router, prefix="/api", tags=["Comparison"])
app.include_router(document.router, prefix="/api", tags=["Document Processing"])

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up AI Legal Helper Backend...")
    # Add any startup logic here, e.g. checking specific DB connections
    # ChromaDB client is initialized in RAGService on demand or we could preload it
    pass

@app.get("/")
async def root():
    return {"message": "Welcome to AI Legal Helper API. Visit /docs for documentation."}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AI Legal Helper",
        "llm_model": settings.llm_model
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting Uvicorn server...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
