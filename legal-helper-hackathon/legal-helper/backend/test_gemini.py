import os
import asyncio
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL_NAME = os.getenv("LLM_MODEL")

async def test_gemini():
    print(f"--- Diagnostic Start ---")
    
    if not API_KEY:
        print("CRITICAL: GOOGLE_API_KEY not found in environment variables.")
        return
        
    print(f"API Key present: {API_KEY[:4]}...{API_KEY[-4:]}")
    print(f"Target Model: {MODEL_NAME}")
    
    genai.configure(api_key=API_KEY)
    
    # 1. Test Model Generation
    print(f"\n[Test 1] Attempting generation with {MODEL_NAME}...")
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = await model.generate_content_async("Hello, are you online?")
        print(f"SUCCESS: Model response: {response.text}")
        return # Exit if successful
    except Exception as e:
        print(f"FAILURE: {str(e)}")
        
    # 2. If failed, List Available Models
    print(f"\n[Test 2] Listing available models for this API key...")
    try:
        found_match = False
        for m in genai.list_models():
            print(f"- {m.name}")
            if 'generateContent' in m.supported_generation_methods:
                if m.name == f"models/{MODEL_NAME}" or m.name == MODEL_NAME:
                    found_match = True
        
        if not found_match:
            print(f"\nCRITICAL: Model '{MODEL_NAME}' was NOT found in the available list.")
            print("Please switch to a valid model (e.g., 'gemini-1.5-flash').")
        else:
             print(f"\nModel '{MODEL_NAME}' IS in the list, but generation failed. Check Quota or Region.")

    except Exception as e:
         print(f"FAILURE Listing Models: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
