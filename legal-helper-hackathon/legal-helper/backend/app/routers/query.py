from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import LegalQuery, LegalResponse
from app.services.rag_service import RAGService
import time

router = APIRouter()

from functools import lru_cache

# Dependency to get RAG Service
@lru_cache()
def get_rag_service():
    return RAGService()

@router.post("/query", response_model=LegalResponse)
async def query_legal(
    request: LegalQuery,
    rag_service: RAGService = Depends(get_rag_service)
):
    start_time = time.time()
    try:
        response = await rag_service.query(request.query, request.filters)
        
        # Add timing info
        query_time = (time.time() - start_time) * 1000
        response["query_time_ms"] = query_time
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cases")
async def get_cases(
    category: str = None, 
    court: str = None,
    rag_service: RAGService = Depends(get_rag_service)
):
    # This is a placeholder for a simple retrieval endpoint
    # In a real app we'd query Chroma directly or a regular DB
    return {"message": "Case browsing not fully implemented in this hackathon demo yet."}
