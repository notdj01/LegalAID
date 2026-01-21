from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        # Explicitly force CPU to avoid "meta tensor" errors with accelerate/transformers on some Windows setups
        self.model = SentenceTransformer(model_name, device="cpu")

    def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        embeddings = self.model.encode(texts)
        return embeddings.tolist()

    def get_embedding(self, text: str) -> list[float]:
        embedding = self.model.encode(text)
        print(f"[DEBUG] Generated embedding for '{text[:20]}...': dims={len(embedding)}, start={embedding[:3]}", flush=True)
        return embedding.tolist()
