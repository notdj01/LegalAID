"""
Updated RAG Service for Partitioned Collections
Queries the correct collection based on language, domain, and statute type.
"""
import chromadb
from app.config import get_settings
from app.services.llm_service import LLMService
from app.services.embedding_service import EmbeddingService
from app.utils.text_processing import detect_language
import logging

settings = get_settings()


class RAGService:
    def __init__(self):
        # Use absolute path for vectorstore to avoid CWD issues
        import os
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        vectorstore_path = os.path.join(base_dir, "vectorstore")
        print(f"[DEBUG] RAG Service initializing with path: {vectorstore_path}", flush=True)
        
        self.chroma_client = chromadb.PersistentClient(path=vectorstore_path)
        self.embedding_service = EmbeddingService(model_name=settings.embedding_model)
        self.llm_service = LLMService()
        
        # Initialize collection references
        self._collections = {}
        self._load_collections()
    
    def _load_collections(self):
        """Load all available collections."""
        try:
            collections = self.chroma_client.list_collections()
            for coll in collections:
                print(f"[DEBUG] Found collection: {coll.name} ({coll.count()} docs)", flush=True)
        except Exception as e:
            print(f"[DEBUG] Error listing collections: {e}", flush=True)
    
    def _get_collection(self, name: str):
        """Get a collection by name - always fetch fresh reference."""
        try:
            coll = self.chroma_client.get_collection(name=name)
            return coll
        except Exception as e:
            print(f"[DEBUG] Collection {name} not found: {e}", flush=True)
            return None

    async def query(self, query: str, filters: dict = None, domain: str = None) -> dict:
        """
        Query the partitioned collections based on language and filters.
        """
        language = detect_language(query)
        print(f"[DEBUG] Processing query: {query}, Language: {language}, Filters: {filters}, Domain: {domain}", flush=True)
        
        # Generate query embedding
        query_embedding = self.embedding_service.get_embedding(query)
        
        context_documents = []
        
        # Determine which statute collection to query based on language
        statute_collection_name = "statutes_hindi" if language == "hi" else "statutes_english"
        print(f"[DEBUG] Looking for collection: {statute_collection_name}", flush=True)
        statute_coll = self._get_collection(statute_collection_name)
        
        if statute_coll:
            print(f"[DEBUG] Found {statute_collection_name} with {statute_coll.count()} docs", flush=True)
            
            # --- DEBUG: Manual Embedding Check ---
            # (Keeping this briefly to confirm fix)
            # -------------------------------------

            where_filter = filters.copy() if filters else {}
            
            # FIX: Remove 'jurisdiction' filter as our data doesn't have this metadata
            if 'jurisdiction' in where_filter:
                print(f"[DEBUG] Removing invalid filter 'jurisdiction': {where_filter['jurisdiction']}", flush=True)
                del where_filter['jurisdiction']
            
            try:
                # Query with embedding
                statute_results = statute_coll.query(
                    query_embeddings=[query_embedding],
                    n_results=4,
                    where=where_filter if where_filter else None
                )
                
                num_results = len(statute_results.get('documents', [[]])[0])
                print(f"[DEBUG] Statute query returned {num_results} results", flush=True)
                
                if num_results == 0:
                    print("[DEBUG] RETRYING with query_texts...", flush=True)
                    statute_results = statute_coll.query(
                        query_texts=[query],
                        n_results=4,
                        where=where_filter if where_filter else None
                    )
                    print(f"[DEBUG] Retry returned {len(statute_results.get('documents', [[]])[0])} results", flush=True)

                self._process_results(statute_results, "statute", context_documents)
            except Exception as e:
                print(f"[DEBUG] Error querying statutes: {e}", flush=True)
        else:
            print(f"[DEBUG] Collection {statute_collection_name} NOT FOUND!", flush=True)
        # Query regulations if domain is specified
        if domain:
            reg_coll = self._get_collection("regulations")
            if reg_coll:
                try:
                    reg_results = reg_coll.query(
                        query_embeddings=[query_embedding],
                        n_results=3,
                        where={"domain": domain.upper()}
                    )
                    print(f"[DEBUG] Regulations query returned {len(reg_results.get('documents', [[]])[0])} results", flush=True)
                    self._process_results(reg_results, "regulation", context_documents)
                except Exception as e:
                    print(f"[DEBUG] Error querying regulations: {e}", flush=True)
        
        # Query case law
        case_coll = self._get_collection("case_law")
        if case_coll:
            try:
                case_results = case_coll.query(
                    query_embeddings=[query_embedding],
                    n_results=2
                )
                print(f"[DEBUG] Case law query returned {len(case_results.get('documents', [[]])[0])} results", flush=True)
                self._process_results(case_results, "case", context_documents)
            except Exception as e:
                print(f"[DEBUG] Error querying case law: {e}", flush=True)
        
        print(f"[DEBUG] Retrieved {len(context_documents)} total documents", flush=True)
        
        # Generate response using LLM
        response = await self.llm_service.generate_legal_response(query, context_documents, language)
        
        return response

    def _process_results(self, results, doc_type: str, context_documents: list):
        """Process ChromaDB results and add to context documents."""
        if not results or not results.get('documents') or not results['documents'][0]:
            return
        
        for i, doc_text in enumerate(results['documents'][0]):
            print(f"[DEBUG] Processing {doc_type} doc {i}: '{doc_text[:100]}...'", flush=True)
            metadata = results['metadatas'][0][i] if results.get('metadatas') else {}
            
            # Build citation based on document type
            if doc_type == "statute":
                citation = f"{metadata.get('statute_type', '')} Section {metadata.get('section', '')}"
            elif doc_type == "regulation":
                citation = f"{metadata.get('act_name', '')} - {metadata.get('domain', '')}"
            elif doc_type == "case":
                citation = f"{metadata.get('court', '')} - {metadata.get('case_id', '')}"
            else:
                citation = metadata.get('source', 'Unknown')
            
            # Calculate relevance score
            distance = results['distances'][0][i] if results.get('distances') else 1.0
            relevance = max(0, 1 - distance)
            
            context_documents.append({
                "type": doc_type,
                "citation": citation,
                "citation": citation,
                "title": metadata.get('section') or metadata.get('act_name') or metadata.get('case_id') or metadata.get('source') or "Legal Document",
                "text": doc_text,
                "relevance_score": relevance,
                "metadata": metadata
            })

    async def compare_sections(self, ipc_section: str) -> dict:
        """
        Compare IPC section with its BNS equivalent.
        Uses both the statutes collection and the mapping collection.
        """
        query_embedding = self.embedding_service.get_embedding(f"IPC Section {ipc_section}")
        
        # Search in IPC-BNS mapping collection for direct comparison
        mapping_coll = self._get_collection("ipc_bns_mapping")
        mapping_data = None
        
        if mapping_coll:
            mapping_results = mapping_coll.query(
                query_embeddings=[query_embedding],
                n_results=2,
                where={"type": "mapping"}
            )
            if mapping_results['documents'] and mapping_results['documents'][0]:
                mapping_data = {
                    "text": mapping_results['documents'][0][0],
                    "metadata": mapping_results['metadatas'][0][0]
                }
        
        # Find IPC section in English statutes
        statute_coll = self._get_collection("statutes_english")
        ipc_data = None
        bns_data = None
        
        if statute_coll:
            # Search for IPC
            ipc_results = statute_coll.query(
                query_embeddings=[query_embedding],
                n_results=1,
                where={"statute_type": "IPC"}
            )
            
            if ipc_results['documents'] and ipc_results['documents'][0]:
                ipc_data = {
                    "text": ipc_results['documents'][0][0],
                    "metadata": ipc_results['metadatas'][0][0]
                }
            
            # Search for similar BNS section using IPC text
            if ipc_data:
                ipc_embedding = self.embedding_service.get_embedding(ipc_data['text'][:500])
                bns_results = statute_coll.query(
                    query_embeddings=[ipc_embedding],
                    n_results=1,
                    where={"statute_type": "BNS"}
                )
                
                if bns_results['documents'] and bns_results['documents'][0]:
                    bns_data = {
                        "text": bns_results['documents'][0][0],
                        "metadata": bns_results['metadatas'][0][0]
                    }
        
        return {
            "ipc": ipc_data,
            "bns": bns_data,
            "mapping": mapping_data,
            "differences": []  # Can be populated by LLM comparison if needed
        }

    async def get_ipc_bns_explanation(self, section_query: str) -> dict:
        """Get detailed explanation of IPC-BNS differences."""
        query_embedding = self.embedding_service.get_embedding(section_query)
        
        mapping_coll = self._get_collection("ipc_bns_mapping")
        if not mapping_coll:
            return {"error": "Mapping collection not available"}
        
        # Get explanation content
        results = mapping_coll.query(
            query_embeddings=[query_embedding],
            n_results=3,
            where={"type": "explanation"}
        )
        
        explanations = []
        if results['documents'] and results['documents'][0]:
            for i, doc in enumerate(results['documents'][0]):
                explanations.append({
                    "text": doc,
                    "source": results['metadatas'][0][i].get('source', '')
                })
        
        return {"explanations": explanations}
