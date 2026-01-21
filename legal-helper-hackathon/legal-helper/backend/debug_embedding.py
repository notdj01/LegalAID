"""Direct test of ChromaDB query"""
import chromadb
from sentence_transformers import SentenceTransformer

print("=== DIRECT CHROMADB TEST ===")

c = chromadb.PersistentClient('./vectorstore')
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

coll = c.get_collection('case_law')
print(f"Collection has {coll.count()} documents")

# Check stored embeddings
result = coll.get(limit=1, include=['embeddings', 'documents'])
print(f"\nDocument: {result['documents'][0][:100]}...")

embeddings = result.get('embeddings', None)
if embeddings is not None and len(embeddings) > 0:
    stored_emb = embeddings[0]
    print(f"Stored embedding dims: {len(stored_emb)}, first 3: {stored_emb[:3]}")
else:
    print("NO EMBEDDINGS STORED!")

# Generate query embedding
query = "punishment for murder section 302"
query_emb = model.encode(query).tolist()
print(f"Query embedding dims: {len(query_emb)}, first 3: {query_emb[:3]}")

# Test query
print("\n=== QUERY TEST ===")
results = coll.query(query_embeddings=[query_emb], n_results=3)
num_results = len(results.get('documents', [[]])[0])
print(f"Returned {num_results} results")

for i in range(num_results):
    doc = results['documents'][0][i]
    dist = results['distances'][0][i]
    print(f"\n{i+1}. Distance: {dist:.4f}")
    print(f"   {doc[:120]}...")
