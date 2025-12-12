# Gift of Grace Website - Project Update Report
**Date:** December 12, 2025
**Version:** 1.0

---

## Executive Summary

The Gift of Grace Website is a full-stack e-commerce application featuring a modern React frontend and an AI-powered RASA chatbot with RAG (Retrieval-Augmented Generation) capabilities. The chatbot, named "Grace," assists customers with product inquiries, company information, and business queries.

---

## What We've Accomplished

### 1. Frontend Development (React + Vite)
- **9 React components** with modern, elegant UI
- **Tailwind CSS** styling with premium blue-white-gold color scheme
- **Framer Motion** animations for smooth user experience
- **Fully responsive** design (desktop, tablet, mobile)
- **Auto-appearing chatbot** widget with markdown support
- **Product carousel** showcasing Kimchi Gift, Tofu Gift, and Rice Coffee

### 2. RASA Chatbot Backend
- **18 intents** covering greetings, product queries, company info, and more
- **19 custom action handlers** for intelligent response generation
- **400+ NLU training examples** including Filipino/Tagalog phrases
- **18 conversation rules** for consistent dialog flow
- **5 trained models** (latest: 29MB, trained December 11, 2025)
- **Bilingual support** (English + Filipino)

### 3. RAG Pipeline Implementation
- **126 document chunks** from corporate reports indexed
- **FAISS vector database** for semantic search (384-dimensional embeddings)
- **Google Gemini 1.5 Flash** LLM integration for natural responses
- **SentenceTransformers** (all-MiniLM-L6-v2) for embeddings
- **Smart fallback system** - works even without API keys
- **"Grace" persona** - conversational, helpful assistant

### 4. Knowledge Base
| Metric | Value |
|--------|-------|
| Document Chunks | 126 |
| Vector Dimensions | 384 |
| Embedding Model | all-MiniLM-L6-v2 |
| LLM Provider | Google Gemini 1.5 Flash |
| Source | Corporate Report 2025 |

### 5. Product Information Integrated
| Product | Price | Description |
|---------|-------|-------------|
| Kimchi Gift | ₱60 | K-Fil Fusion kimchi |
| Tofu Gift | ₱43 | Non-GMO soybean curd (4 textures) |
| Rice Coffee with Moringa | ₱90-170 | Caffeine-free beverage |

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Navbar  │  │  Hero   │  │Products │  │ Chatbot │        │
│  └─────────┘  └─────────┘  └─────────┘  └────┬────┘        │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 RASA Server (Port 5005)                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  NLU Model   │───▶│Intent Router │───▶│Custom Actions│  │
│  │ (DIET+TED)   │    │  (18 rules)  │    │ (19 handlers)│  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘  │
└─────────────────────────────────────────────────┼───────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Actions Server (Port 5055)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  RAG Pipeline                        │   │
│  │  ┌─────────┐   ┌─────────┐   ┌─────────┐           │   │
│  │  │Embedding│──▶│  FAISS  │──▶│ Gemini  │           │   │
│  │  │ Model   │   │  Search │   │   LLM   │           │   │
│  │  └─────────┘   └─────────┘   └─────────┘           │   │
│  │        ▲                                            │   │
│  │        │                                            │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │     Vector DB (126 chunks, 384-dim)         │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Git Commit History Highlights

| Commit | Description |
|--------|-------------|
| `be03905` | Tubik-style product showcase with Framer Motion |
| `b983bbf` | RAG chatbot with markdown support |
| `8fcf37f` | Optimized model loading (50% faster startup) |
| `b2b8958` | Initial RAG backend integration |
| `fd85858` | Performance optimization with CSS animations |

---

## How Collaborators Can Improve RAG/RASA Responses

### Priority 1: Expand Knowledge Base

#### A. Add More Documents
```bash
# Place PDF files in:
backend/knowledge_base/documents/

# Run the processor:
python setup_ordinances.py
```

**Recommended Documents to Add:**
- Product catalogs with detailed specifications
- FAQ documents from customer service
- Supplier/ingredient information
- Wholesale pricing sheets
- Shipping and delivery policies
- Return/refund policies

#### B. Improve Document Chunking
**Current Issue:** Generic 500-character chunks may split important context.

**File to Modify:** `backend/setup_ordinances.py`

**Improvements:**
```python
# Add semantic chunking based on content type
def smart_chunk(text, chunk_type="general"):
    if chunk_type == "product":
        # Keep product info together
        return chunk_by_product_sections(text)
    elif chunk_type == "faq":
        # Keep Q&A pairs together
        return chunk_by_qa_pairs(text)
    else:
        return default_chunking(text)
```

---

### Priority 2: Enhance NLU Training Data

#### A. Add More Training Examples
**File:** `backend/data/nlu.yml`

**Current Coverage:** ~400 examples across 18 intents

**Add Examples For:**
```yaml
- intent: ask_products
  examples: |
    - how much is [kimchi](product)?
    - what's the price of [tofu](product)?
    - do you have [rice coffee](product) in stock?
    - is [kimchi gift](product) spicy?
    - what sizes does [tofu gift](product) come in?
    - ano ang lasa ng [kimchi](product)?
    - magkano ang [rice coffee](product)?

- intent: ask_shipping
  examples: |
    - do you deliver to Manila?
    - how long is shipping?
    - is there free delivery?
    - pwede ba magdeliver sa Cebu?

- intent: ask_wholesale
  examples: |
    - I want to buy in bulk
    - wholesale pricing please
    - distributor inquiry
    - gusto ko mag-order ng marami
```

#### B. Add Entity Recognition
```yaml
entities:
  - product
  - location
  - quantity

nlu:
- intent: order_inquiry
  examples: |
    - I want to order [5](quantity) [kimchi](product)
    - can I buy [10](quantity) pieces of [tofu](product)?
    - deliver [3](quantity) [rice coffee](product) to [Manila](location)
```

---

### Priority 3: Improve RAG Pipeline

#### A. Better Embedding Model
**File:** `backend/actions/rag_pipeline.py`

**Current:** `all-MiniLM-L6-v2` (384-dim, general purpose)

**Upgrade Options:**
```python
# Option 1: Larger general model (better accuracy)
model_name = "all-mpnet-base-v2"  # 768-dim

# Option 2: Multilingual support (for Filipino)
model_name = "paraphrase-multilingual-MiniLM-L12-v2"

# Option 3: Instruction-tuned (better for Q&A)
model_name = "BAAI/bge-small-en-v1.5"
```

#### B. Implement Hybrid Search
```python
# Add keyword search alongside semantic search
from rank_bm25 import BM25Okapi

class HybridRetriever:
    def __init__(self, faiss_index, bm25_index):
        self.faiss = faiss_index
        self.bm25 = bm25_index

    def search(self, query, k=5):
        # Semantic search
        semantic_results = self.faiss.search(query, k)

        # Keyword search
        keyword_results = self.bm25.get_top_n(query, k)

        # Combine with reciprocal rank fusion
        return self.fuse_results(semantic_results, keyword_results)
```

#### C. Add Re-ranking
```python
# Re-rank retrieved documents for better relevance
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def rerank_results(query, documents, top_k=3):
    pairs = [(query, doc) for doc in documents]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(documents, scores), key=lambda x: x[1], reverse=True)
    return [doc for doc, score in ranked[:top_k]]
```

---

### Priority 4: Improve Response Quality

#### A. Better System Prompt
**File:** `backend/actions/rag_pipeline.py` (line ~50)

```python
SYSTEM_PROMPT = """You are Grace, a friendly and knowledgeable customer service assistant
for Gift of Grace Food Manufacturing Corporation.

PERSONALITY:
- Warm, helpful, and professional
- Use conversational Filipino-English (Taglish) when appropriate
- Be concise but complete

KNOWLEDGE:
- Products: Kimchi Gift (₱60), Tofu Gift (₱43), Rice Coffee (₱90-170)
- Location: Baguio City, Philippines
- Founded: 2015 by Satur & Janice Cadsi
- Certifications: Halal certified

RULES:
1. ONLY answer from the provided context
2. If unsure, say "Let me check with our team"
3. For orders, direct to contact info
4. Keep responses under 100 words unless detail is needed
5. End with a helpful follow-up question when appropriate

CONTEXT:
{context}

USER QUERY:
{query}
"""
```

#### B. Add Response Templates
```python
RESPONSE_TEMPLATES = {
    "product_not_found": "I don't have specific details about that product. "
                        "We currently offer Kimchi Gift, Tofu Gift, and Rice Coffee. "
                        "Which one would you like to know more about?",

    "order_redirect": "To place an order, you can:\n"
                     "• Call us at [phone number]\n"
                     "• Message our Facebook page\n"
                     "• Visit our store in Baguio City\n"
                     "Would you like our contact details?",

    "out_of_scope": "That's outside my area of expertise! "
                   "I'm best at helping with Gift of Grace products and services. "
                   "Is there anything about our products I can help with?"
}
```

---

### Priority 5: Add Conversation Memory

#### A. Implement Context Tracking
**File:** `backend/actions/actions.py`

```python
class ActionWithMemory(Action):
    def __init__(self):
        self.conversation_history = {}

    def run(self, dispatcher, tracker, domain):
        sender_id = tracker.sender_id

        # Get last 3 turns for context
        history = self.conversation_history.get(sender_id, [])

        # Include history in RAG query
        context_query = self.build_contextual_query(
            tracker.latest_message.get('text'),
            history
        )

        # Update history
        history.append(tracker.latest_message.get('text'))
        self.conversation_history[sender_id] = history[-3:]
```

#### B. Add Slot Memory
**File:** `backend/data/domain.yml`

```yaml
slots:
  last_product_discussed:
    type: text
    mappings:
      - type: custom

  user_preference:
    type: categorical
    values:
      - english
      - tagalog
      - taglish
    mappings:
      - type: custom

  inquiry_type:
    type: categorical
    values:
      - retail
      - wholesale
      - general
    mappings:
      - type: custom
```

---

### Priority 6: Testing & Evaluation

#### A. Create Test Suite
**New File:** `backend/tests/test_rag_responses.py`

```python
import pytest
from actions.rag_pipeline import CorporateRAGPipeline

@pytest.fixture
def rag():
    return CorporateRAGPipeline()

def test_product_query(rag):
    response = rag.query("How much is kimchi?")
    assert "60" in response or "₱60" in response

def test_location_query(rag):
    response = rag.query("Where are you located?")
    assert "Baguio" in response

def test_founder_query(rag):
    response = rag.query("Who founded the company?")
    assert "Satur" in response or "Janice" in response

def test_out_of_scope(rag):
    response = rag.query("What's the weather today?")
    assert "product" in response.lower() or "help" in response.lower()

def test_filipino_query(rag):
    response = rag.query("Magkano ang tofu?")
    assert "43" in response or "₱43" in response
```

#### B. Add Response Quality Metrics
```python
def evaluate_response_quality(query, response, expected_keywords):
    """Evaluate RAG response quality"""
    metrics = {
        "relevance": len([k for k in expected_keywords if k in response.lower()]) / len(expected_keywords),
        "length": len(response.split()),
        "has_greeting": any(g in response.lower() for g in ["hi", "hello", "kumusta"]),
        "has_followup": "?" in response[-50:],  # Ends with question
    }
    return metrics
```

---

### Quick Wins (Easy Improvements)

| Task | File | Effort | Impact |
|------|------|--------|--------|
| Add 50 more NLU examples | `nlu.yml` | Low | Medium |
| Add shipping/delivery intents | `nlu.yml`, `domain.yml` | Low | High |
| Improve system prompt | `rag_pipeline.py` | Low | High |
| Add product images to responses | `actions.py` | Medium | Medium |
| Add wholesale inquiry flow | `stories.yml`, `rules.yml` | Medium | High |
| Implement re-ranking | `rag_pipeline.py` | Medium | High |
| Add conversation memory | `actions.py` | High | High |

---

## Development Setup for Collaborators

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Quick Start
```bash
# Clone the repository
git clone [repo-url]
cd Gift-Of-Grace-Website

# Backend setup
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt

# Get API key
# Add GEMINI_API_KEY to backend/.env

# Train RASA model
rasa train

# Start backend
./start-backend.bat  # Windows

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### Development Commands
```bash
# Train new RASA model
rasa train

# Test NLU only
rasa test nlu

# Interactive testing
rasa shell

# Run action server only
rasa run actions --port 5055

# Process new documents
python setup_ordinances.py
```

---

## Contact & Support

For questions about this project:
- Review the codebase at `C:\Users\Neil\Documents\GOG\Gift-Of-Grace-Website`
- Check existing issues in the repository
- Test changes locally before committing

---

**Report Generated:** December 12, 2025
**Next Review:** [Schedule as needed]
