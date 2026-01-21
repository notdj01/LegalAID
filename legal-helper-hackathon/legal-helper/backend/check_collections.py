import chromadb
import sys
import os

# Check what collections exist
client = chromadb.PersistentClient(path="./vectorstore")
collections = client.list_collections()

print(f"Found {len(collections)} collections:")
for col in collections:
    print(f"\n  Collection: {col.name}")
    print(f"  Count: {col.count()}")
    
    # Get a sample
    if col.count() > 0:
        sample = col.peek(limit=2)
        if sample['documents']:
            print(f"  Sample: {sample['documents'][0][:100]}...")
