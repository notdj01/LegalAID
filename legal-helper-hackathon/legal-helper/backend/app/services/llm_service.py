from groq import Groq
from app.config import get_settings
import logging

settings = get_settings()

class LLMService:
    def __init__(self):
        # Initialize Groq client
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = "llama-3.3-70b-versatile"  # Fast and smart
        logging.info(f"Initialized LLM Service with Groq model: {self.model}")

    async def generate_legal_response(self, query: str, context_documents: list[dict], language: str = "en") -> dict:
        try:
            context_text = "\n\n".join([f"Source ({doc['citation']}): {doc['text']}" for doc in context_documents])
            
            # specific language instructions
            language_instruction = f"Respond in {language} language."
            if language.lower() in ['hi', 'hindi']:
                language_instruction = "Respond in Hindi using Devanagari script. Do NOT use Hinglish (Hindi in English script)."

            prompt = f"""You are an expert legal research assistant specializing in Indian law. 
Your role is to provide accurate, well-cited legal information based on the context provided.

Context (Retrieved Legal Documents):
{context_text}

User Query: {query}

Instructions:
1. Provide a clear, accurate answer based ONLY on the context provided.
2. Cite all sources using the format [Source: Citation].
3. For statutes, cite as [IPC Section XXX] or [BNS Section XXX].
4. For cases, cite as [Case Name, Citation].
5. If the context does not contain enough information, acknowledge the limitation.
6. Be precise with legal terminology.
7. Structure your response clearly with proper paragraphs.
8. {language_instruction}

Answer:"""

            # Call Groq API
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert legal assistant specializing in Indian law."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.1,
                max_tokens=2048,
            )
            
            answer = chat_completion.choices[0].message.content
            
            # Simple confidence estimation based on retrieval scores
            avg_relevance = 0.0
            if context_documents:
                scores = [doc.get('relevance_score', 0) for doc in context_documents]
                avg_relevance = sum(scores) / len(scores) if scores else 0.0

            return {
                "answer": answer,
                "sources": context_documents,
                "confidence": round(avg_relevance, 2),
                "language": language
            }
        except Exception as e:
            logging.error(f"Error generating legal response: {str(e)}")
            return {
                "answer": f"I recently encountered an error while processing your request: {str(e)}",
                "sources": [],
                "confidence": 0.0,
                "language": language
            }

    async def summarize_document(self, text: str) -> dict:
        try:
            prompt = f"""Please analyze the following legal document text and provide a summary.

Document Text:
{text[:10000]}

Instructions:
1. Provide a concise summary of the document.
2. Extract key legal arguments or points.
3. List important citations found in the text.

Respond in JSON format:
{{
  "summary": "...",
  "key_points": ["...", "..."],
  "citations": ["...", "..."]
}}
"""
            
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.1,
            )
            
            return {"raw_response": chat_completion.choices[0].message.content} 
        except Exception as e:
            logging.error(f"Error summarizing document: {str(e)}")
            return {"error": str(e)}
