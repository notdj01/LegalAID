import requests

print("Testing minimal server on port 8001...")
try:
    response = requests.get("http://127.0.0.1:8001/health", timeout=2)
    print(f"✓ SUCCESS: {response.json()}")
except Exception as e:
    print(f"✗ FAILED: {e}")
