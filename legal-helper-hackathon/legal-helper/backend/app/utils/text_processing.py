import re
from typing import Dict
from langdetect import detect

def clean_legal_text(text: str) -> str:
    """
    Removes extra whitespace and normalizes punctuation.
    """
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    """
    Splits text into overlapping chunks.
    """
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

def extract_section_number(text: str) -> str:
    """
    Extracts IPC/BNS section numbers using regex.
    """
    match = re.search(r'(IPC|BNS)\s+(Section\s+)?(\d+[A-Z]?)', text, re.IGNORECASE)
    if match:
        return f"{match.group(1).upper()} {match.group(3)}"
    return ""

def create_legal_metadata(doc: Dict, doc_type: str) -> Dict:
    """
    Creates standardized metadata for legal documents.
    """
    metadata = {
        "source_type": doc_type,
        "title": doc.get("title", ""),
        "category": doc.get("category", ""),
        "language": detect_language(doc.get("description", "") or doc.get("content", ""))
    }
    
    if doc_type == "statute":
        metadata.update({
            "statute_type": "BNS" if "BNS" in doc.get("full_reference", "") else "IPC",
            "section_number": doc.get("section", ""),
            "chapter": doc.get("chapter", ""),
            "offense_type": doc.get("offense_type", "")
        })
    elif doc_type == "case":
        metadata.update({
            "case_name": doc.get("case_name", ""),
            "citation": doc.get("citation", ""),
            "court": doc.get("court", ""),
            "date": doc.get("date", ""),
            "link": doc.get("link", "")
        })
        
    return metadata

def detect_language(text: str) -> str:
    """
    Detects if text is English or Hindi.
    """
    try:
        lang = detect(text)
        return "hi" if lang == "hi" else "en"
    except:
        return "en"
