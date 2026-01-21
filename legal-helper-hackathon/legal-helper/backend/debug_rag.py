import chromadb
from sentence_transformers import SentenceTransformer

# Check collections and test query
client = chromadb.PersistentClient(path="./vectorstore")

print("=== COLLECTIONS ===")
for col in client.list_collections():
    print(f"{col.name}: {col.count()} documents")

# Load the same embedding model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Get the statutes collection
statutes = client.get_collection("legal_statutes")

# Try a simple query
test_query = "punishment for murder"
query_embedding = model.encode(test_query).tolist()

print(f"\n=== QUERY TEST: '{test_query}' ===")
print(f"Embedding dimensions: {len(query_embedding)}")

# Method 1: Query with embedding
results = statutes.query(
    query_embeddings=[query_embedding],
    n_results=3
)
print(f"\nWith query_embeddings: {len(results['documents'][0])} results")
if results['documents'][0]:
    for i, doc in enumerate(results['documents'][0]):
        print(f"  {i+1}. {doc[:100]}...")

# Method 2: Query with text (uses collection's default embedder)
results2 = statutes.query(
    query_texts=[test_query],
    n_results=3
)
print(f"\nWith query_texts: {len(results2['documents'][0])} results")
if results2['documents'][0]:
    for i, doc in enumerate(results2['documents'][0]):
        print(f"  {i+1}. {doc[:100]}...")

# Check if the collection has embeddings stored
print("\n=== SAMPLE DATA ===")
sample = statutes.peek(limit=2)
print(f"Sample IDs: {sample['ids']}")
print(f"Has embeddings: {sample['embeddings'] is not None}")
if sample['embeddings']:
    print(f"Stored embedding dims: {len(sample['embeddings'][0])}")
