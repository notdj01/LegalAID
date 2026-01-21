from sentence_transformers import SentenceTransformer
import os

print("Downloading embedding model (this may take 1-2 minutes on first run)...")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
print("✓ Model downloaded and ready!")
print(f"Model saved to: {model._model_card_vars['model_name']}")

# Test it
test_embedding = model.encode("test")
print(f"✓ Test embedding generated: {len(test_embedding)} dimensions")
