import requests
import time

time.sleep(2)  # Give server time to start

print("Testing main server on port 8000...")
try:
    response = requests.get("http://127.0.0.1:8000/health", timeout=3)
    print(f"✓ HEALTH CHECK SUCCESS: {response.json()}")
    
    # Test query endpoint
    query_response = requests.post(
        "http://127.0.0.1:8000/api/query",
        json={"query": "What is IPC 302?", "language": "en"},
        timeout=10
    )
    print(f"✓ QUERY ENDPOINT SUCCESS")
    print(f"Response: {query_response.json()['answer'][:100]}...")
    
except Exception as e:
    print(f"✗ FAILED: {e}")
