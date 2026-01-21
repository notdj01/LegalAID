from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Minimal server to test if basic FastAPI works
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Minimal server working!"}

@app.get("/health")
async def health():
    return {"status": "ok", "test": "minimal_server"}

@app.post("/api/query")
async def test_query(request: dict):
    return {
        "answer": f"Test response for: {request.get('query', 'no query')}",
        "sources": [],
        "confidence": 1.0,
        "language": "en"
    }

if __name__ == "__main__":
    print("Starting minimal test server on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
