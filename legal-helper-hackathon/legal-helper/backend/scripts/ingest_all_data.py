"""
Master Data Ingestion Script for Legal Helper
Clears existing data and creates partitioned collections.
"""
import os
import sys
import csv
import logging
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

import chromadb
from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader
from datasets import load_dataset
from huggingface_hub import login

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# HuggingFace authentication
HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_TOKEN")
if HF_TOKEN:
    logger.info("Logging in to HuggingFace with token...")
    login(token=HF_TOKEN)
else:
    logger.warning("No HF_TOKEN found in .env - case law download may fail if dataset requires auth")

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
VECTORSTORE_DIR = BASE_DIR / "vectorstore"

# Collection names
COLLECTIONS = {
    "statutes_english": "English IPC and BNS sections",
    "statutes_hindi": "Hindi IPC and BNS sections", 
    "regulations": "IT Act, Companies Act, Environment Act",
    "case_law": "Supreme Court and High Court judgments",
    "ipc_bns_mapping": "IPC to BNS section mappings"
}


def get_embedding_model():
    """Initialize the embedding model."""
    logger.info("Loading embedding model...")
    return SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device="cpu")


def clear_all_collections(client: chromadb.PersistentClient):
    """Delete all existing collections."""
    logger.info("Clearing existing collections...")
    for collection in client.list_collections():
        logger.info(f"  Deleting: {collection.name}")
        client.delete_collection(collection.name)
    logger.info("All collections cleared.")


def extract_pdf_text(pdf_path: Path) -> str:
    """Extract text from a PDF file."""
    logger.info(f"Extracting text from: {pdf_path.name}")
    reader = PdfReader(str(pdf_path))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap
    return chunks


def ingest_ipc_csv(client: chromadb.PersistentClient, model: SentenceTransformer):
    """Ingest IPC sections from CSV into statutes_english collection."""
    csv_path = DATA_DIR / "ipc_sections.csv"
    logger.info(f"Ingesting IPC sections from: {csv_path.name}")
    
    collection = client.get_or_create_collection(name="statutes_english")
    
    documents = []
    metadatas = []
    ids = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            # Combine fields for searchable content
            content = f"Section {row['Section']}: {row['Description']}\nOffense: {row['Offense']}\nPunishment: {row['Punishment']}"
            
            documents.append(content)
            metadatas.append({
                "statute_type": "IPC",
                "section": row['Section'],
                "offense": row['Offense'][:200] if row['Offense'] else "",
                "source": "ipc_sections.csv",
                "language": "english"
            })
            ids.append(f"ipc_en_{i}")
    
    # Generate embeddings and add to collection
    embeddings = model.encode(documents).tolist()
    collection.add(documents=documents, embeddings=embeddings, metadatas=metadatas, ids=ids)
    logger.info(f"  Added {len(documents)} IPC sections")


def ingest_bns_csv(client: chromadb.PersistentClient, model: SentenceTransformer):
    """Ingest BNS sections from CSV into statutes_english collection."""
    csv_path = DATA_DIR / "bns_sections.csv"
    logger.info(f"Ingesting BNS sections from: {csv_path.name}")
    
    collection = client.get_or_create_collection(name="statutes_english")
    
    documents = []
    metadatas = []
    ids = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            # Combine fields for searchable content
            section_name = row.get('Section _name', row.get('Section_name', ''))
            content = f"BNS Section {row['Section']}: {section_name}\n{row['Description']}\nChapter: {row['Chapter_name']}"
            
            documents.append(content)
            metadatas.append({
                "statute_type": "BNS",
                "section": row['Section'],
                "chapter": row.get('Chapter', ''),
                "chapter_name": row.get('Chapter_name', '')[:100],
                "source": "bns_sections.csv",
                "language": "english"
            })
            ids.append(f"bns_en_{i}")
    
    # Generate embeddings and add to collection
    embeddings = model.encode(documents).tolist()
    collection.add(documents=documents, embeddings=embeddings, metadatas=metadatas, ids=ids)
    logger.info(f"  Added {len(documents)} BNS sections")


def ingest_hindi_pdfs(client: chromadb.PersistentClient, model: SentenceTransformer):
    """Ingest Hindi IPC and BNS PDFs into statutes_hindi collection."""
    collection = client.get_or_create_collection(name="statutes_hindi")
    
    hindi_files = [
        ("ipc hindi.pdf", "IPC"),
        ("bns hindi.pdf", "BNS")
    ]
    
    for filename, statute_type in hindi_files:
        pdf_path = DATA_DIR / filename
        if not pdf_path.exists():
            logger.warning(f"  File not found: {filename}")
            continue
            
        logger.info(f"Ingesting Hindi {statute_type} from: {filename}")
        text = extract_pdf_text(pdf_path)
        chunks = chunk_text(text, chunk_size=800, overlap=150)
        
        documents = []
        metadatas = []
        ids = []
        
        for i, chunk in enumerate(chunks):
            documents.append(chunk)
            metadatas.append({
                "statute_type": statute_type,
                "source": filename,
                "language": "hindi",
                "chunk_index": i
            })
            ids.append(f"{statute_type.lower()}_hi_{i}")
        
        embeddings = model.encode(documents).tolist()
        collection.add(documents=documents, embeddings=embeddings, metadatas=metadatas, ids=ids)
        logger.info(f"  Added {len(documents)} chunks from {filename}")


def ingest_regulatory_pdfs(client: chromadb.PersistentClient, model: SentenceTransformer):
    """Ingest regulatory PDFs into regulations collection with domain tags."""
    collection = client.get_or_create_collection(name="regulations")
    
    regulatory_files = [
        ("environment act.pdf", "ENVIRONMENT"),
        ("it act.pdf", "IT"),
        ("companies act.pdf", "CORPORATE")
    ]
    
    for filename, domain in regulatory_files:
        pdf_path = DATA_DIR / filename
        if not pdf_path.exists():
            logger.warning(f"  File not found: {filename}")
            continue
            
        logger.info(f"Ingesting {domain} regulations from: {filename}")
        text = extract_pdf_text(pdf_path)
        chunks = chunk_text(text, chunk_size=1000, overlap=200)
        
        documents = []
        metadatas = []
        ids = []
        
        for i, chunk in enumerate(chunks):
            documents.append(chunk)
            metadatas.append({
                "domain": domain,
                "source": filename,
                "act_name": filename.replace(".pdf", "").title(),
                "chunk_index": i
            })
            ids.append(f"reg_{domain.lower()}_{i}")
        
        embeddings = model.encode(documents).tolist()
        collection.add(documents=documents, embeddings=embeddings, metadatas=metadatas, ids=ids)
        logger.info(f"  Added {len(documents)} chunks from {filename}")


def ingest_ipc_bns_mapping(client: chromadb.PersistentClient, model: SentenceTransformer):
    """Ingest IPC-BNS comparison PDFs into mapping collection."""
    collection = client.get_or_create_collection(name="ipc_bns_mapping")
    
    mapping_files = [
        "bns vs ipc.pdf",
        "BNS Book_After Correction.pdf"
    ]
    
    for filename in mapping_files:
        pdf_path = DATA_DIR / filename
        if not pdf_path.exists():
            logger.warning(f"  File not found: {filename}")
            continue
            
        logger.info(f"Ingesting IPC-BNS mapping from: {filename}")
        text = extract_pdf_text(pdf_path)
        chunks = chunk_text(text, chunk_size=1200, overlap=250)
        
        documents = []
        metadatas = []
        ids = []
        
        for i, chunk in enumerate(chunks):
            documents.append(chunk)
            metadatas.append({
                "source": filename,
                "type": "mapping" if "vs" in filename.lower() else "explanation",
                "chunk_index": i
            })
            ids.append(f"mapping_{filename[:10]}_{i}")
        
        embeddings = model.encode(documents).tolist()
        collection.add(documents=documents, embeddings=embeddings, metadatas=metadatas, ids=ids)
        logger.info(f"  Added {len(documents)} chunks from {filename}")


def ingest_case_law(client: chromadb.PersistentClient, model: SentenceTransformer, max_cases: int = 1500):
    """
    Ingest case law from HuggingFace InJudgements dataset.
    Balances between Supreme Court and High Court cases.
    """
    logger.info(f"Loading InJudgements dataset from HuggingFace (target: {max_cases} cases)...")
    
    try:
        # Load the dataset in streaming mode to avoid downloading everything
        dataset = load_dataset("opennyaiorg/InJudgements_dataset", split="train", streaming=True)
        
        collection = client.get_or_create_collection(name="case_law")
        
        documents = []
        metadatas = []
        ids = []
        
        sc_count = 0
        hc_count = 0
        target_sc = max_cases // 3  # ~500 Supreme Court
        target_hc = max_cases - target_sc  # ~1000 High Court
        
        for i, case in enumerate(dataset):
            # Determine court type from the case
            text = case.get('Text', case.get('judgment', ''))[:10000]  # Limit text size
            court = "Supreme Court" if "Supreme Court" in text[:500] else "High Court"
            
            # Balance courts
            if court == "Supreme Court":
                if sc_count >= target_sc:
                    continue
                sc_count += 1
            else:
                if hc_count >= target_hc:
                    if sc_count >= target_sc:
                        break  # Done with both quotas
                    continue
                hc_count += 1
            
            # Create searchable chunk (first 3000 chars for embedding)
            doc_text = text[:3000] if len(text) > 3000 else text
            
            documents.append(doc_text)
            metadatas.append({
                "court": court,
                "case_id": case.get('id', f"case_{i}"),
                "source": "InJudgements_dataset"
            })
            ids.append(f"case_{sc_count + hc_count}")
            
            if (sc_count + hc_count) % 100 == 0:
                logger.info(f"  Progress: {sc_count + hc_count} cases (SC: {sc_count}, HC: {hc_count})")
            
            if sc_count + hc_count >= max_cases:
                break
        
        # Add to collection in batches
        batch_size = 100
        for j in range(0, len(documents), batch_size):
            batch_docs = documents[j:j+batch_size]
            batch_meta = metadatas[j:j+batch_size]
            batch_ids = ids[j:j+batch_size]
            
            embeddings = model.encode(batch_docs).tolist()
            collection.add(documents=batch_docs, embeddings=embeddings, metadatas=batch_meta, ids=batch_ids)
        
        logger.info(f"  Added {len(documents)} cases (Supreme Court: {sc_count}, High Court: {hc_count})")
        
    except Exception as e:
        logger.error(f"Error loading case law dataset: {e}")
        logger.info("Skipping case law ingestion. You can run it separately later.")


def main():
    """Main ingestion workflow."""
    logger.info("=" * 60)
    logger.info("LEGAL HELPER - DATA INGESTION PIPELINE")
    logger.info("=" * 60)
    
    # Initialize ChromaDB client
    logger.info(f"Initializing ChromaDB at: {VECTORSTORE_DIR}")
    client = chromadb.PersistentClient(path=str(VECTORSTORE_DIR))
    
    # Clear existing data
    clear_all_collections(client)
    
    # Initialize embedding model
    model = get_embedding_model()
    
    # Ingest all data sources
    logger.info("\n" + "=" * 40)
    logger.info("INGESTING DATA SOURCES")
    logger.info("=" * 40)
    
    # 1. English statutes
    ingest_ipc_csv(client, model)
    ingest_bns_csv(client, model)
    
    # 2. Hindi statutes
    ingest_hindi_pdfs(client, model)
    
    # 3. Regulatory documents
    ingest_regulatory_pdfs(client, model)
    
    # 4. IPC-BNS mapping
    ingest_ipc_bns_mapping(client, model)
    
    # 5. Case law (optional - can be slow)
    ingest_case_law(client, model, max_cases=1500)
    
    # Summary
    logger.info("\n" + "=" * 40)
    logger.info("INGESTION COMPLETE - SUMMARY")
    logger.info("=" * 40)
    
    for collection in client.list_collections():
        count = collection.count()
        logger.info(f"  {collection.name}: {count} documents")
    
    logger.info("\nData ingestion complete!")


if __name__ == "__main__":
    main()
