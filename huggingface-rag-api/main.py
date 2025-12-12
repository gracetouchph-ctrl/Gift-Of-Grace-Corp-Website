"""
Gift of Grace - RAG API for Hugging Face Spaces
Provides semantic search and LLM-powered responses for the chatbot
"""

import os
import json
import numpy as np
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss
import google.generativeai as genai

# Initialize FastAPI app
app = FastAPI(
    title="Gift of Grace RAG API",
    description="RAG-powered API for Gift of Grace chatbot",
    version="1.0.0"
)

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models (loaded once at startup)
embedding_model = None
faiss_index = None
documents = []
gemini_model = None

# System prompt for Grace chatbot
SYSTEM_PROMPT = """You are Grace, a friendly and helpful customer service assistant for Gift of Grace Food Manufacturing Corporation, a Filipino food company based in Baguio City, Philippines.

PERSONALITY:
- Warm, professional, and conversational
- Use simple, clear language
- Be helpful and informative

QUICK FACTS:
- Products: Kimchi Gift (₱60), Tofu Gift (₱43), Rice Coffee with Moringa (₱90-170)
- Location: Baguio City, Philippines
- Founded: 2015 by Satur & Janice Cadsi
- Certifications: Halal certified

RULES:
1. Only answer based on the provided context
2. If you don't know, say "I'm not sure about that, but I can help you contact our team"
3. Keep responses concise (under 100 words unless detail is needed)
4. Be conversational, not robotic

CONTEXT:
{context}

USER QUESTION: {query}

RESPONSE:"""


class QueryRequest(BaseModel):
    """Request model for RAG queries"""
    query: str
    top_k: Optional[int] = 5


class QueryResponse(BaseModel):
    """Response model for RAG queries"""
    answer: str
    sources: List[str]
    confidence: float


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    documents_count: int


@app.on_event("startup")
async def load_models():
    """Load models and data at startup"""
    global embedding_model, faiss_index, documents, gemini_model

    print("Loading embedding model...")
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Embedding model loaded!")

    # Load FAISS index if exists
    index_path = "vector_db/corporate.index"
    docs_path = "vector_db/corporate_documents.json"

    if os.path.exists(index_path) and os.path.exists(docs_path):
        print("Loading FAISS index...")
        faiss_index = faiss.read_index(index_path)

        with open(docs_path, 'r', encoding='utf-8') as f:
            documents = json.load(f)
        print(f"Loaded {len(documents)} documents!")
    else:
        print("No vector database found. Creating empty index...")
        faiss_index = faiss.IndexFlatL2(384)
        documents = []

    # Initialize Gemini
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        print("Initializing Gemini...")
        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        print("Gemini initialized!")
    else:
        print("Warning: GEMINI_API_KEY not set. Using fallback responses.")


@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        model_loaded=embedding_model is not None,
        documents_count=len(documents)
    )


@app.get("/health", response_model=HealthResponse)
async def health():
    """Alias for health check"""
    return await health_check()


@app.post("/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    """
    Query the RAG system

    - Encodes the query using sentence transformers
    - Searches FAISS index for relevant documents
    - Generates response using Gemini LLM
    """
    global embedding_model, faiss_index, documents, gemini_model

    if embedding_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Encode query
    query_embedding = embedding_model.encode([query])
    query_embedding = np.array(query_embedding).astype('float32')

    # Search FAISS
    k = min(request.top_k, len(documents)) if documents else 0
    sources = []
    context = ""
    confidence = 0.5

    if k > 0 and faiss_index is not None:
        distances, indices = faiss_index.search(query_embedding, k)

        # Gather relevant documents
        relevant_docs = []
        for i, idx in enumerate(indices[0]):
            if idx < len(documents):
                doc = documents[idx]
                relevant_docs.append(doc.get('content', doc.get('text', '')))
                source = doc.get('source', f'Document {idx}')
                if source not in sources:
                    sources.append(source)

        context = "\n\n".join(relevant_docs)

        # Calculate confidence based on distance
        if len(distances[0]) > 0:
            avg_distance = np.mean(distances[0])
            confidence = max(0.1, min(1.0, 1.0 - (avg_distance / 10.0)))

    # Generate response
    answer = await generate_response(query, context)

    return QueryResponse(
        answer=answer,
        sources=sources[:3],
        confidence=round(confidence, 2)
    )


async def generate_response(query: str, context: str) -> str:
    """Generate response using Gemini or fallback"""
    global gemini_model

    # Try Gemini first
    if gemini_model:
        try:
            prompt = SYSTEM_PROMPT.format(context=context, query=query)
            response = gemini_model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": 500,
                    "temperature": 0.7
                }
            )
            return response.text.strip()
        except Exception as e:
            print(f"Gemini error: {e}")

    # Fallback to rule-based response
    return generate_fallback_response(query, context)


def generate_fallback_response(query: str, context: str) -> str:
    """Generate fallback response without LLM"""
    query_lower = query.lower()

    # Product queries
    if any(word in query_lower for word in ['kimchi', 'price', 'cost', 'how much', 'magkano']):
        return "Our Kimchi Gift is priced at ₱60. We also have Tofu Gift at ₱43 and Rice Coffee with Moringa ranging from ₱90-170. Would you like more details about any of these products?"

    if 'tofu' in query_lower:
        return "Our Tofu Gift is made from non-GMO soybeans and comes in 4 textures: soft, medium, firm, and extra firm. It's priced at ₱43. Would you like to know more?"

    if 'coffee' in query_lower or 'rice coffee' in query_lower:
        return "Our Rice Coffee with Moringa is a caffeine-free, healthy beverage. Prices range from ₱90-170 depending on the size. It's perfect for those looking for a coffee alternative!"

    # Location queries
    if any(word in query_lower for word in ['where', 'location', 'address', 'saan', 'nasaan']):
        return "Gift of Grace is located in Baguio City, Philippines. We're a proudly local food manufacturing company serving the Cordillera region and beyond!"

    # Founder queries
    if any(word in query_lower for word in ['founder', 'owner', 'who started', 'sino']):
        return "Gift of Grace was founded in 2015 by Satur Cadsi (CEO) and Janice Osenio Cadsi (COO). They started the business from home and have grown it into an award-winning company!"

    # Awards
    if any(word in query_lower for word in ['award', 'achievement', 'recognition']):
        return "Gift of Grace has received several awards including being a Presidential Award for Outstanding MSMEs Finalist (2025), and Janice Cadsi received the Inspiring Filipina Entrepreneur Award in 2025. We're also Halal certified!"

    # Contact
    if any(word in query_lower for word in ['contact', 'reach', 'call', 'email']):
        return "To get in touch with us, you can visit our store in Baguio City or reach out through our social media pages. For wholesale inquiries, please contact us directly!"

    # Default response
    if context:
        return f"Based on our records: {context[:300]}... Would you like more specific information?"

    return "I'd be happy to help! You can ask me about our products (Kimchi, Tofu, Rice Coffee), prices, location, or company history. What would you like to know?"


@app.post("/embed")
async def get_embedding(request: QueryRequest):
    """Get embedding for a text query"""
    global embedding_model

    if embedding_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    embedding = embedding_model.encode([request.query])
    return {"embedding": embedding[0].tolist()}


# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
