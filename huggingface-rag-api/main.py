"""
Gift of Grace - RAG API for Hugging Face Spaces
Provides semantic search, LLM-powered responses for the chatbot, and Admin API
"""

import os
import json
import hashlib
import numpy as np
from typing import Optional, List, Dict, Any
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss
import httpx  # For direct API calls
import PyPDF2

# Initialize FastAPI app
app = FastAPI(
    title="Gift of Grace RAG API",
    description="RAG-powered API for Gift of Grace chatbot with Admin features",
    version="2.0.0"
)

# Security for admin endpoints
security = HTTPBearer(auto_error=False)

# Admin Configuration
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")
DOCUMENTS_DIR = Path("vector_db/documents")
VECTOR_DB_DIR = Path("vector_db")
SITE_INFO_FILE = Path("site_info.json")

# Ensure directories exist
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)

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
gemini_api_key = None
openai_api_key = None
deepseek_api_key = None
openrouter_api_key = None
llm_status = {"gemini": False, "openai": False, "deepseek": False, "openrouter": False}

# API endpoints
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

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


class ChatRequest(BaseModel):
    """Request model for chat endpoint (frontend direct)"""
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    response: str
    intent: Optional[str] = None
    sources: List[str] = []
    confidence: float = 0.0


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    documents_count: int
    llm_available: List[str] = []
    active_llm: Optional[str] = None


@app.on_event("startup")
async def load_models():
    """Load models and data at startup"""
    global embedding_model, faiss_index, documents, gemini_model

    print("Loading embedding model...")
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Embedding model loaded!")

    # Load documents and build FAISS index at startup
    docs_path = "vector_db/corporate_documents.json"

    if os.path.exists(docs_path):
        print("Loading documents...")
        with open(docs_path, 'r', encoding='utf-8') as f:
            documents = json.load(f)
        print(f"Loaded {len(documents)} documents!")

        # Build FAISS index from documents
        print("Building FAISS index from documents...")
        texts = [doc.get('content', doc.get('text', '')) for doc in documents]
        embeddings = embedding_model.encode(texts, show_progress_bar=True)
        embeddings = np.array(embeddings).astype('float32')

        # Create and populate FAISS index
        faiss_index = faiss.IndexFlatL2(embeddings.shape[1])
        faiss_index.add(embeddings)
        print(f"FAISS index built with {faiss_index.ntotal} vectors!")
    else:
        print("No documents found. Creating empty index...")
        faiss_index = faiss.IndexFlatL2(384)
        documents = []

    # Initialize LLM API keys
    global gemini_api_key, openai_api_key, deepseek_api_key, openrouter_api_key, llm_status

    # Gemini
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        print(f"Gemini configured: {gemini_key[:10]}...")
        gemini_api_key = gemini_key
        llm_status["gemini"] = True

    # OpenAI
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key:
        print(f"OpenAI configured: {openai_key[:10]}...")
        openai_api_key = openai_key
        llm_status["openai"] = True

    # DeepSeek
    deepseek_key = os.environ.get("DEEPSEEK_API_KEY")
    if deepseek_key:
        print(f"DeepSeek configured: {deepseek_key[:10]}...")
        deepseek_api_key = deepseek_key
        llm_status["deepseek"] = True

    # OpenRouter (final fallback)
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
    if openrouter_key:
        print(f"OpenRouter configured: {openrouter_key[:10]}...")
        openrouter_api_key = openrouter_key
        llm_status["openrouter"] = True

    available = [k for k, v in llm_status.items() if v]
    print(f"LLM providers ready: {available if available else 'None (using fallback)'}")


@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    available = [k for k, v in llm_status.items() if v]
    active = available[0] if available else "fallback"
    return HealthResponse(
        status="healthy",
        model_loaded=embedding_model is not None,
        documents_count=len(documents),
        llm_available=available,
        active_llm=active
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
    """Generate response using Gemini → OpenAI → DeepSeek → OpenRouter → Fallback"""
    global gemini_api_key, openai_api_key, deepseek_api_key, openrouter_api_key

    prompt = SYSTEM_PROMPT.format(context=context, query=query)

    # Try Gemini first
    if gemini_api_key:
        result = await try_gemini(prompt, query)
        if result:
            return result

    # Try OpenAI
    if openai_api_key:
        result = await try_openai(prompt, query)
        if result:
            return result

    # Try DeepSeek
    if deepseek_api_key:
        result = await try_deepseek(prompt, query)
        if result:
            return result

    # Try OpenRouter (free models)
    if openrouter_api_key:
        result = await try_openrouter(prompt, query)
        if result:
            return result

    # Final fallback to rule-based response
    print("All LLMs failed, using rule-based fallback")
    return generate_fallback_response(query, context)


async def try_gemini(prompt: str, query: str) -> Optional[str]:
    """Try Gemini API"""
    try:
        print(f"Trying Gemini with query: {query[:30]}...")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                GEMINI_API_URL,
                headers={
                    "Content-Type": "application/json",
                    "X-goog-api-key": gemini_api_key
                },
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "maxOutputTokens": 500,
                        "temperature": 0.7
                    }
                }
            )

            if response.status_code == 200:
                data = response.json()
                text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if text:
                    print(f"Gemini success: {text[:50]}...")
                    return text.strip()
            elif response.status_code == 429:
                print("Gemini rate limit, trying OpenAI...")
            else:
                print(f"Gemini error {response.status_code}: {response.text[:100]}")
    except Exception as e:
        print(f"Gemini exception: {type(e).__name__}: {e}")
    return None


async def try_openai(prompt: str, query: str) -> Optional[str]:
    """Try OpenAI API"""
    try:
        print(f"Trying OpenAI with query: {query[:30]}...")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                OPENAI_API_URL,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {openai_api_key}"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 500,
                    "temperature": 0.7
                }
            )

            if response.status_code == 200:
                data = response.json()
                text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if text:
                    print(f"OpenAI success: {text[:50]}...")
                    return text.strip()
            elif response.status_code == 429:
                print("OpenAI rate limit, trying DeepSeek...")
            else:
                print(f"OpenAI error {response.status_code}: {response.text[:100]}")
    except Exception as e:
        print(f"OpenAI exception: {type(e).__name__}: {e}")
    return None


async def try_deepseek(prompt: str, query: str) -> Optional[str]:
    """Try DeepSeek API (OpenAI-compatible)"""
    try:
        print(f"Trying DeepSeek with query: {query[:30]}...")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                DEEPSEEK_API_URL,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {deepseek_api_key}"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 500,
                    "temperature": 0.7
                }
            )

            if response.status_code == 200:
                data = response.json()
                text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if text:
                    print(f"DeepSeek success: {text[:50]}...")
                    return text.strip()
            elif response.status_code == 429:
                print("DeepSeek rate limit, trying OpenRouter...")
            else:
                print(f"DeepSeek error {response.status_code}: {response.text[:100]}")
    except Exception as e:
        print(f"DeepSeek exception: {type(e).__name__}: {e}")
    return None


def clean_response(text: str) -> str:
    """Clean up LLM response by removing special tokens"""
    if not text:
        return text
    # Remove common special tokens from various models
    tokens_to_remove = ['<s>', '</s>', '<|im_start|>', '<|im_end|>', '<|endoftext|>', '[INST]', '[/INST]']
    for token in tokens_to_remove:
        text = text.replace(token, '')
    return text.strip()


async def try_openrouter(prompt: str, query: str) -> Optional[str]:
    """Try OpenRouter API (free models)"""
    try:
        print(f"Trying OpenRouter with query: {query[:30]}...")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                OPENROUTER_API_URL,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {openrouter_api_key}",
                    "HTTP-Referer": "https://giftofgrace.ph",
                    "X-Title": "Gift of Grace Chatbot"
                },
                json={
                    "model": "mistralai/mistral-7b-instruct:free",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 500,
                    "temperature": 0.7
                }
            )

            if response.status_code == 200:
                data = response.json()
                text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if text and text.strip():
                    cleaned = clean_response(text)
                    print(f"OpenRouter success: {cleaned[:50]}...")
                    return cleaned
            elif response.status_code == 429:
                print("OpenRouter rate limit")
            else:
                print(f"OpenRouter error {response.status_code}: {response.text[:100]}")
    except Exception as e:
        print(f"OpenRouter exception: {type(e).__name__}: {e}")
    return None


def generate_fallback_response(query: str, context: str) -> str:
    """Generate fallback response without LLM"""
    query_lower = query.lower()

    # Greetings (check word boundaries to avoid matching "kimchi" -> "hi")
    greeting_words = ['hello', 'hey', 'good morning', 'good afternoon', 'kumusta', 'musta', 'wassup']
    words = query_lower.split()
    if any(word in words for word in greeting_words) or query_lower in ['hi', 'hi!']:
        return "Hello! Welcome to Gift of Grace! I'm Grace, your friendly assistant. How can I help you today? You can ask me about our products, prices, or company info!"

    # What are you / who are you
    if any(phrase in query_lower for phrase in ['what are you', 'who are you', 'what is this', 'ano ka']):
        return "I'm Grace, the virtual assistant for Gift of Grace Food Manufacturing Corporation! I can help you with information about our products like Kimchi Gift, Tofu Gift, and Rice Coffee with Moringa. What would you like to know?"

    # Product queries
    if any(word in query_lower for word in ['kimchi', 'price', 'cost', 'how much', 'magkano', 'presyo']):
        return "Our Kimchi Gift is priced at ₱60 per jar. We also have Tofu Gift at ₱43 and Rice Coffee with Moringa ranging from ₱90-170. Would you like more details about any of these products?"

    if 'tofu' in query_lower:
        return "Our Tofu Gift is made from non-GMO soybeans and comes in 4 textures: soft, medium, firm, and extra firm. It's priced at ₱43. Would you like to know more?"

    if 'coffee' in query_lower or 'rice coffee' in query_lower:
        return "Our Rice Coffee with Moringa is a caffeine-free, healthy beverage made from roasted rice and nutrient-rich moringa. Prices range from ₱90-170 depending on the size. Perfect for those looking for a coffee alternative!"

    # Product list
    if any(word in query_lower for word in ['product', 'sell', 'offer', 'available', 'produkto']):
        return "We offer three main products:\n• **Kimchi Gift** (₱60) - Our flagship K-Fil fusion kimchi\n• **Tofu Gift** (₱43) - Fresh, non-GMO tofu in 4 textures\n• **Rice Coffee with Moringa** (₱90-170) - Caffeine-free healthy beverage\n\nAll products are Halal certified!"

    # Location queries
    if any(word in query_lower for word in ['where', 'location', 'address', 'saan', 'nasaan', 'store', 'shop']):
        return "Gift of Grace is located in Baguio City, Philippines. We're a proudly local food manufacturing company serving the Cordillera region and beyond! You can also find our products in partner stores and through online delivery."

    # Founder queries
    if any(word in query_lower for word in ['founder', 'owner', 'who started', 'sino', 'history', 'about']):
        return "Gift of Grace was founded in 2015 by Satur Cadsi (CEO) and Janice Osenio Cadsi (COO). They started the business from their home kitchen and have grown it into an award-winning company! Their mission is to provide healthy, locally-made food products."

    # Awards
    if any(word in query_lower for word in ['award', 'achievement', 'recognition', 'certified']):
        return "Gift of Grace has received several awards including:\n• Presidential Award for Outstanding MSMEs Finalist (2025)\n• Inspiring Filipina Entrepreneur Award for Janice Cadsi (2025)\n• Halal Certification\n\nWe're proud of our commitment to quality!"

    # Health benefits
    if any(word in query_lower for word in ['health', 'benefit', 'probiotic', 'gut', 'nutrition', 'healthy']):
        return "Our products are designed with health in mind! Kimchi is rich in probiotics for gut health, our Tofu provides plant-based protein, and Rice Coffee with Moringa offers a caffeine-free energy boost with vitamins and minerals. All products are Halal certified!"

    # Contact
    if any(word in query_lower for word in ['contact', 'reach', 'call', 'email', 'phone', 'order']):
        return "You can reach Gift of Grace through:\n• Email: kimchigift@gmail.com\n• Phone: +63 917 5958 907 (Globe) / +63 999 991 6052 (Smart)\n• Facebook: @kimchigift\n\nFor wholesale inquiries, please contact us directly!"

    # Default helpful response
    return "I'd be happy to help! Here's what I can tell you about:\n• **Products**: Kimchi Gift (₱60), Tofu Gift (₱43), Rice Coffee (₱90-170)\n• **Company**: Founded 2015 in Baguio City by Satur & Janice Cadsi\n• **Contact**: kimchigift@gmail.com\n\nWhat would you like to know more about?"


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Direct chat endpoint for frontend

    - Bypasses RASA, uses Gemini directly
    - Searches knowledge base for context
    - Returns conversational response
    """
    global embedding_model, faiss_index, documents, gemini_model

    if embedding_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    message = request.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Detect intent (simple keyword-based)
    intent = detect_intent(message)

    # Search knowledge base for context
    query_embedding = embedding_model.encode([message])
    query_embedding = np.array(query_embedding).astype('float32')

    sources = []
    context = ""
    confidence = 0.5

    k = min(5, len(documents)) if documents else 0
    if k > 0 and faiss_index is not None:
        distances, indices = faiss_index.search(query_embedding, k)

        relevant_docs = []
        for i, idx in enumerate(indices[0]):
            if idx < len(documents):
                doc = documents[idx]
                relevant_docs.append(doc.get('content', doc.get('text', '')))
                source = doc.get('source', f'Document {idx}')
                if source not in sources:
                    sources.append(source)

        context = "\n\n".join(relevant_docs)

        if len(distances[0]) > 0:
            avg_distance = np.mean(distances[0])
            confidence = max(0.1, min(1.0, 1.0 - (avg_distance / 10.0)))

    # Generate response
    response_text = await generate_response(message, context)

    return ChatResponse(
        response=response_text,
        intent=intent,
        sources=sources[:3],
        confidence=round(confidence, 2)
    )


def detect_intent(message: str) -> str:
    """Simple intent detection based on keywords"""
    msg_lower = message.lower()

    # Greetings
    if any(word in msg_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'kumusta', 'musta']):
        return "greetings"

    # Goodbye
    if any(word in msg_lower for word in ['bye', 'goodbye', 'see you', 'paalam', 'salamat']):
        return "goodbye"

    # Product inquiries
    if any(word in msg_lower for word in ['kimchi', 'tofu', 'coffee', 'rice coffee', 'product', 'produkto']):
        return "product_inquiry"

    # Pricing
    if any(word in msg_lower for word in ['price', 'cost', 'how much', 'magkano', 'presyo']):
        return "pricing_information"

    # Health
    if any(word in msg_lower for word in ['health', 'benefit', 'probiotic', 'gut', 'digest']):
        return "health_benefits"

    # Location
    if any(word in msg_lower for word in ['where', 'location', 'address', 'saan', 'nasaan', 'store']):
        return "location_inquiry"

    # Order
    if any(word in msg_lower for word in ['order', 'buy', 'purchase', 'deliver', 'ship']):
        return "order_purchase"

    # Contact
    if any(word in msg_lower for word in ['contact', 'reach', 'call', 'email', 'phone']):
        return "contact_information"

    # Recipe
    if any(word in msg_lower for word in ['recipe', 'cook', 'prepare', 'lutuin', 'paano']):
        return "recipe_request"

    # About company
    if any(word in msg_lower for word in ['founder', 'owner', 'company', 'history', 'about']):
        return "company_info"

    return "general_information"


@app.post("/embed")
async def get_embedding(request: QueryRequest):
    """Get embedding for a text query"""
    global embedding_model

    if embedding_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    embedding = embedding_model.encode([request.query])
    return {"embedding": embedding[0].tolist()}


# ============================================
# ADMIN API ENDPOINTS
# ============================================

# Admin Pydantic Models
class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: str
    message: str

class PDFInfo(BaseModel):
    filename: str
    size: int
    uploaded_at: str
    processed: bool
    chunks_count: Optional[int] = None

class SiteInfo(BaseModel):
    products: List[Dict[str, Any]]
    about: Dict[str, Any]
    awards: List[Dict[str, Any]]
    contact: Dict[str, Any]
    company_info: Dict[str, Any]

# Admin Helper Functions
def verify_password(password: str) -> bool:
    """Verify admin password"""
    if not ADMIN_PASSWORD_HASH:
        # Default password: "admin123" (change in production!)
        default_hash = hashlib.sha256("admin123".encode()).hexdigest()
        return hashlib.sha256(password.encode()).hexdigest() == default_hash
    return hashlib.sha256(password.encode()).hexdigest() == ADMIN_PASSWORD_HASH

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify admin token"""
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    token = credentials.credentials
    if token == "admin_token":
        return True
    raise HTTPException(status_code=401, detail="Invalid authentication token")

def load_site_info() -> Dict[str, Any]:
    """Load site information from JSON file"""
    if SITE_INFO_FILE.exists():
        with open(SITE_INFO_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "products": [],
        "about": {},
        "awards": [],
        "contact": {},
        "company_info": {}
    }

def save_site_info(data: Dict[str, Any]):
    """Save site information to JSON file"""
    with open(SITE_INFO_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def extract_pdf_text(pdf_path: Path) -> str:
    """Extract text from PDF"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text_content = []
            for page_num, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                text_content.append(f"===== Page {page_num + 1} =====\n{text}")
            return "\n".join(text_content)
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        raise

def process_text_to_chunks(text: str, source: str) -> List[Dict[str, Any]]:
    """Process text into chunks for vector DB"""
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    chunks = []
    for i, para in enumerate(paragraphs):
        if len(para) > 50:
            chunks.append({
                "content": para,
                "source": source,
                "chunk_id": f"{source}_{i}",
                "page_number": i // 10 + 1
            })
    return chunks

async def rebuild_vector_db_internal():
    """Rebuild vector database from all documents"""
    global faiss_index, documents, embedding_model

    print("Rebuilding vector database...")

    if embedding_model is None:
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

    all_documents = []

    # Process all PDFs
    pdf_files = list(DOCUMENTS_DIR.glob("*.pdf")) if DOCUMENTS_DIR.exists() else []

    for pdf_path in pdf_files:
        try:
            print(f"Processing {pdf_path.name}...")
            text = extract_pdf_text(pdf_path)
            chunks = process_text_to_chunks(text, pdf_path.name)
            all_documents.extend(chunks)
        except Exception as e:
            print(f"Error processing {pdf_path.name}: {e}")

    # Also include existing documents from corporate_documents.json
    docs_path = VECTOR_DB_DIR / "corporate_documents.json"
    if docs_path.exists():
        with open(docs_path, 'r', encoding='utf-8') as f:
            existing_docs = json.load(f)
            # Add existing docs that aren't from PDFs
            for doc in existing_docs:
                if not any(doc.get('source', '').endswith('.pdf') for _ in [1]):
                    all_documents.append(doc)

    if all_documents:
        # Build FAISS index
        texts = [doc.get('content', doc.get('text', '')) for doc in all_documents]
        embeddings = embedding_model.encode(texts, show_progress_bar=True)
        embeddings = np.array(embeddings).astype('float32')

        faiss_index = faiss.IndexFlatL2(embeddings.shape[1])
        faiss_index.add(embeddings)
        documents = all_documents

        # Save updated documents
        with open(docs_path, 'w', encoding='utf-8') as f:
            json.dump(all_documents, f, indent=2, ensure_ascii=False)

    print(f"Vector DB rebuilt with {len(all_documents)} chunks from {len(pdf_files)} PDFs")

    return {
        "total_chunks": len(all_documents),
        "pdf_count": len(pdf_files),
        "sources": [f.name for f in pdf_files]
    }

# Admin API Endpoints
@app.post("/admin/login", response_model=LoginResponse)
async def admin_login(request: LoginRequest):
    """Admin login endpoint"""
    if verify_password(request.password):
        return LoginResponse(
            success=True,
            token="admin_token",
            message="Login successful"
        )
    raise HTTPException(status_code=401, detail="Invalid password")

@app.get("/admin/pdfs")
async def list_pdfs(authorized: bool = Depends(verify_token)):
    """List all PDFs in the knowledge base"""
    pdf_files = []
    if DOCUMENTS_DIR.exists():
        for pdf_path in DOCUMENTS_DIR.glob("*.pdf"):
            stat = pdf_path.stat()
            pdf_files.append({
                "filename": pdf_path.name,
                "size": stat.st_size,
                "uploaded_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "processed": True
            })
    return {"pdfs": pdf_files}

@app.post("/admin/pdfs/upload")
async def upload_pdf(file: UploadFile = File(...), authorized: bool = Depends(verify_token)):
    """Upload a new PDF file"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = DOCUMENTS_DIR / file.filename

    with open(file_path, 'wb') as f:
        content = await file.read()
        f.write(content)

    try:
        summary = await rebuild_vector_db_internal()
        return {
            "success": True,
            "message": "PDF uploaded and processed successfully",
            "filename": file.filename,
            "chunks": summary["total_chunks"]
        }
    except Exception as e:
        print(f"Error processing PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.delete("/admin/pdfs/{filename}")
async def delete_pdf(filename: str, authorized: bool = Depends(verify_token)):
    """Delete a PDF file"""
    file_path = DOCUMENTS_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="PDF not found")

    file_path.unlink()

    try:
        await rebuild_vector_db_internal()
        return {"success": True, "message": f"PDF {filename} deleted successfully"}
    except Exception as e:
        print(f"Error rebuilding vector DB: {e}")
        raise HTTPException(status_code=500, detail=f"Error rebuilding vector DB: {str(e)}")

@app.get("/admin/site-info")
async def get_site_info(authorized: bool = Depends(verify_token)):
    """Get site information"""
    return load_site_info()

@app.put("/admin/site-info")
async def update_site_info(info: SiteInfo, authorized: bool = Depends(verify_token)):
    """Update site information"""
    data = info.dict()
    save_site_info(data)
    return {"success": True, "message": "Site information updated successfully"}

@app.post("/admin/rebuild-vector-db")
async def rebuild_vector_db_endpoint(authorized: bool = Depends(verify_token)):
    """Manually rebuild vector database"""
    try:
        summary = await rebuild_vector_db_internal()
        return {
            "success": True,
            "message": "Vector database rebuilt successfully",
            "summary": summary
        }
    except Exception as e:
        print(f"Error rebuilding vector DB: {e}")
        raise HTTPException(status_code=500, detail=f"Error rebuilding vector DB: {str(e)}")

@app.get("/admin/stats")
async def get_admin_stats(authorized: bool = Depends(verify_token)):
    """Get admin dashboard statistics"""
    pdf_count = len(list(DOCUMENTS_DIR.glob("*.pdf"))) if DOCUMENTS_DIR.exists() else 0

    site_info = load_site_info()
    products_count = len(site_info.get("products", []))
    awards_count = len(site_info.get("awards", []))

    return {
        "pdfs_count": pdf_count,
        "products_count": products_count,
        "awards_count": awards_count,
        "documents_count": len(documents)
    }

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
