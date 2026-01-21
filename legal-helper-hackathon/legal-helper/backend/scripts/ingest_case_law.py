"""
Case Law Only Ingestion Script
Adds case law from HuggingFace without clearing existing data.
"""
import os
import sys
import logging
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

import chromadb
from sentence_transformers import SentenceTransformer
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
    logger.error("No HF_TOKEN found in .env! Please add HF_TOKEN=your_token to .env file")
    sys.exit(1)

# Paths
BASE_DIR = Path(__file__).parent.parent
VECTORSTORE_DIR = BASE_DIR / "vectorstore"


def ingest_case_law(client: chromadb.PersistentClient, model: SentenceTransformer, max_cases: int = 1500):
    """
    Ingest case law from HuggingFace InJudgements dataset.
    Balances between Supreme Court and High Court cases.
    """
    logger.info(f"Loading InJudgements dataset from HuggingFace (target: {max_cases} cases)...")
    
    # Load the dataset in streaming mode
    dataset = load_dataset("opennyaiorg/InJudgements_dataset", split="train", streaming=True)
    
    # Delete existing collection to remove bad data
    try:
        client.delete_collection("case_law")
        logger.info("Deleted existing case_law collection")
    except Exception:
        pass

    collection = client.get_or_create_collection(name="case_law")
    
    documents = []
    metadatas = []
    ids = []
    
    sc_count = 0
    hc_count = 0
    target_sc = max_cases // 3  # ~500 Supreme Court
    target_hc = max_cases - target_sc  # ~1000 High Court
    skipped = 0
    
    logger.info("Streaming cases and balancing courts...")
    
    for i, case in enumerate(dataset):
        # Determine court type from the case
        text = case.get('Text', case.get('judgment', ''))[:10000]
        court = "Supreme Court" if "Supreme Court" in text[:500] else "High Court"
        
        # Balance courts
        if court == "Supreme Court":
            if sc_count >= target_sc:
                skipped += 1
                continue
            sc_count += 1
        else:
            if hc_count >= target_hc:
                if sc_count >= target_sc:
                    break
                skipped += 1
                continue
            hc_count += 1
        
        # Create searchable chunk
        doc_text = text[:3000] if len(text) > 3000 else text
        
        documents.append(doc_text)
        metadatas.append({
            "court": court,
            "case_id": case.get('id', f"case_{i}"),
            "source": "InJudgements_dataset"
        })
        ids.append(f"case_{sc_count + hc_count}")
        
        if (sc_count + hc_count) % 100 == 0:
            logger.info(f"  Progress: {sc_count + hc_count} cases (SC: {sc_count}, HC: {hc_count}), skipped: {skipped}")
        
        if sc_count + hc_count >= max_cases:
            break
    
    # Add to collection in batches
    logger.info(f"Embedding and storing {len(documents)} cases...")
    batch_size = 100
    for j in range(0, len(documents), batch_size):
        batch_docs = documents[j:j+batch_size]
        batch_meta = metadatas[j:j+batch_size]
        batch_ids = ids[j:j+batch_size]
        
        embeddings = model.encode(batch_docs).tolist()
        collection.add(documents=batch_docs, embeddings=embeddings, metadatas=batch_meta, ids=batch_ids)
        logger.info(f"  Batch {j//batch_size + 1}/{(len(documents)-1)//batch_size + 1} complete")
    
    logger.info(f"Added {len(documents)} cases (Supreme Court: {sc_count}, High Court: {hc_count})")


def main():
    logger.info("=" * 50)
    logger.info("CASE LAW INGESTION")
    logger.info("=" * 50)
    
    # Initialize
    client = chromadb.PersistentClient(path=str(VECTORSTORE_DIR))
    model = SentenceTransformer('all-MiniLM-L6-v2', device="cpu")
    
    # Run ingestion
    ingest_case_law(client, model, max_cases=1500)
    
    # Summary
    logger.info("\n" + "=" * 50)
    logger.info("COMPLETE - COLLECTION SUMMARY")
    for coll in client.list_collections():
        logger.info(f"  {coll.name}: {coll.count()} docs")


if __name__ == "__main__":
    main()
