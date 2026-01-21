"""Test script to verify the new partitioned collections."""
import chromadb
from sentence_transformers import SentenceTransformer

# Initialize
c = chromadb.PersistentClient('./vectorstore')
model = SentenceTransformer('all-MiniLM-L6-v2')

# List all collections
print('=== COLLECTION SUMMARY ===')
collections = {col.name: col for col in c.list_collections()}
for name, col in collections.items():
    print(f'  {name}: {col.count()} docs')

# Test query on statutes_english
if 'statutes_english' in collections:
    print('\n=== TEST: English statute query (murder punishment) ===')
    statutes = collections['statutes_english']
    emb = model.encode(['punishment for murder'])
    results = statutes.query(query_embeddings=emb.tolist(), n_results=2)
    for i, doc in enumerate(results['documents'][0]):
        meta = results['metadatas'][0][i]
        print(f"{i+1}. {meta.get('statute_type', '')} Section {meta.get('section', '')}")
        print(f"   {doc[:150]}...")

# Test query on regulations with domain filter
if 'regulations' in collections:
    print('\n=== TEST: IT Act query (cybercrime) ===')
    regs = collections['regulations']
    emb = model.encode(['cybercrime hacking'])
    results = regs.query(query_embeddings=emb.tolist(), n_results=2, where={'domain': 'IT'})
    for i, doc in enumerate(results['documents'][0]):
        meta = results['metadatas'][0][i]
        print(f"{i+1}. {meta.get('act_name', '')} ({meta.get('domain', '')})")
        print(f"   {doc[:150]}...")

# Test case law (optional)
if 'case_law' in collections:
    print('\n=== TEST: Case law query ===')
    cases = collections['case_law']
    emb = model.encode(['property dispute'])
    results = cases.query(query_embeddings=emb.tolist(), n_results=2)
    for i, doc in enumerate(results['documents'][0]):
        meta = results['metadatas'][0][i]
        print(f"{i+1}. {meta.get('court', '')} - {meta.get('case_id', '')}")
        print(f"   {doc[:150]}...")
else:
    print('\n=== CASE LAW: Collection not found (skipped) ===')

print('\n=== ALL TESTS COMPLETE ===')

