from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class LegalQuery(BaseModel):
    query: str
    language: str = "en"
    filters: Optional[Dict[str, Any]] = None

class Source(BaseModel):
    type: str
    citation: str
    title: str
    text: str
    relevance_score: float
    metadata: Dict[str, Any]

class LegalResponse(BaseModel):
    answer: str
    sources: List[Source]
    confidence: float
    language: str
    query_time_ms: Optional[float] = None

class ComparisonRequest(BaseModel):
    ipc_section: str

class ComparisonResponse(BaseModel):
    ipc: Optional[Dict[str, Any]]
    bns: Optional[Dict[str, Any]]
    differences: List[str]

class SummarizationResponse(BaseModel):
    summary: str
    key_points: List[str]
    citations: List[str]
