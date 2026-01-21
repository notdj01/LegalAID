import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.services.rag_service import RAGService
import asyncio

async def test_rag():
    print("Testing RAG service...")
    rag = RAGService()
    
    print("\nQuerying: 'What is the punishment for murder?'")
    result = await rag.query("What is the punishment for murder?")
    
    print(f"\n✓ Answer: {result['answer'][:200]}...")
    print(f"✓ Sources found: {len(result['sources'])}")
    for i, source in enumerate(result['sources'][:3], 1):
        print(f"  {i}. {source['citation']}")

if __name__ == "__main__":
    asyncio.run(test_rag())
