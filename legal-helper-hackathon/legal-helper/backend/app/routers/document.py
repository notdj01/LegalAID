from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.models.schemas import SummarizationResponse
from app.services.llm_service import LLMService
import PyPDF2
import io

router = APIRouter()

def get_llm_service():
    return LLMService()

@router.post("/summarize")
async def summarize_document(
    file: UploadFile = File(...),
    llm_service: LLMService = Depends(get_llm_service)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
            
        result = await llm_service.summarize_document(text)
        
        # Parse JSON from string result if needed, or return raw
        # Assuming llm_service returns a dict with 'raw_response' which is a JSON string
        import json
        raw_json_str = result.get('raw_response', '{}')
        
        # Strip code blocks if present
        clean_json = raw_json_str.replace('```json', '').replace('```', '')
        
        try:
            parsed_result = json.loads(clean_json)
            return parsed_result
        except json.JSONDecodeError:
            return {
                "summary": raw_json_str, # Fallback to raw text
                "key_points": [],
                "citations": []
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
