from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ComparisonRequest, ComparisonResponse
from app.services.rag_service import RAGService

router = APIRouter()

def get_rag_service():
    return RAGService()

@router.post("/compare", response_model=ComparisonResponse)
async def compare_sections(
    request: ComparisonRequest,
    rag_service: RAGService = Depends(get_rag_service)
):
    try:
        result = await rag_service.compare_sections(request.ipc_section)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
