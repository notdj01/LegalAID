"""Debug - what collections exist and can we query them?"""
import chromadb

print("=== Checking vectorstore ===")
c = chromadb.PersistentClient('./vectorstore')

print("\nCollections found:")
for coll in c.list_collections():
    print(f"  - {coll.name}: {coll.count()} docs")

print("\n=== Trying to get statutes_english ===")
try:
    coll = c.get_collection('statutes_english')
    print(f"SUCCESS: {coll.name} has {coll.count()} docs")
    
    # Peek at a sample
    sample = coll.peek(limit=1)
    if sample['documents']:
        print(f"Sample metadata: {sample['metadatas'][0]}")
        print(f"Sample doc: {sample['documents'][0][:200]}...")
except Exception as e:
    print(f"ERROR: {e}")
