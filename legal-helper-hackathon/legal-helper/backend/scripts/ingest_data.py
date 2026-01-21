import os
import sys
import json
import logging
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import sys

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.utils.text_processing import chunk_text, create_legal_metadata

# Configuration
CHROMADB_PATH = "./vectorstore"
DATA_PATH = "./data/sample/sample_legal_data.json"
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def ingest_data():
    logger.info("Starting data ingestion...")
    
    # Initialize ChromaDB
    chroma_client = chromadb.PersistentClient(path=CHROMADB_PATH)
    
    # Get or create collections
    statute_collection = chroma_client.get_or_create_collection(name="legal_statutes")
    case_collection = chroma_client.get_or_create_collection(name="legal_cases")
    
    # Initialize Embedding Model
    logger.info(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
    embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME, device="cpu")
    
    # Load Data
    with open(DATA_PATH, 'r') as f:
        data = json.load(f)
        
    logger.info(f"Loaded {len(data)} documents from {DATA_PATH}")
    
    statutes, cases = [], []
    for item in data:
        if "full_reference" in item:
            statutes.append(item)
        else:
            cases.append(item)
            
    # Process Statutes
    logger.info(f"Processing {len(statutes)} statutes...")
    for statute in statutes:
        metadata = create_legal_metadata(statute, "statute")
        text_content = f"{statute['full_reference']}: {statute['title']}\n{statute['description']}"
        if "changes" in statute:
            text_content += f"\nNote: {statute['changes']}"
            
        embedding = embedding_model.encode(text_content).tolist()
        
        statute_collection.add(
            documents=[text_content],
            metadatas=[metadata],
            ids=[f"{metadata['statute_type']}_{metadata['section_number']}"]
            # embeddings are auto-generated if not provided, but we can verify later if we want custom control
            # Here providing embedding is better if we want to reuse the model
            , embeddings=[embedding]
        )

    # Process Cases
    logger.info(f"Processing {len(cases)} cases...")
    for case in cases:
        metadata = create_legal_metadata(case, "case")
        text_content = f"Case: {case['case_name']} ({case['citation']})\n"
        text_content += f"Court: {case['court']}, Date: {case['date']}\n"
        text_content += f"Held: {case['holding']}\n"
        text_content += f"Facts: {case['facts']}\n"
        text_content += f"Principles: {', '.join(case.get('legal_principles', []))}"
        
        embedding = embedding_model.encode(text_content).tolist()
        
        case_collection.add(
            documents=[text_content],
            metadatas=[metadata],
            ids=[f"CASE_{case['citation'].replace(' ', '_')}"]
            , embeddings=[embedding]
        )

    logger.info("Data ingestion complete!")

if __name__ == "__main__":
    ingest_data()
