import requests
import time

try:
    print("Attempting to connect to backend...")
    response = requests.get("http://127.0.0.1:8000/health", timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"FAILED to connect: {e}")
