# Hugging Face Spaces Deployment Guide
## Gift of Grace RAG API

This guide walks you through deploying your RAG API to Hugging Face Spaces using Docker.

---

## Prerequisites

1. **Hugging Face Account** - Create one at [huggingface.co](https://huggingface.co/join)
2. **Git installed** on your computer
3. **Gemini API Key** (optional, for LLM responses)

---

## Step 1: Create a Hugging Face Space

### 1.1 Go to Hugging Face Spaces
Navigate to: https://huggingface.co/spaces

### 1.2 Click "Create new Space"

### 1.3 Fill in the details:
```
Space name: giftofgrace-rag-api
License: MIT (or your preference)
SDK: Docker  <-- IMPORTANT: Select Docker
Hardware: CPU basic (free)
Visibility: Public (required for free tier)
```

### 1.4 Click "Create Space"

---

## Step 2: Clone Your New Space

After creating the Space, clone it to your computer:

```bash
# Replace YOUR_USERNAME with your Hugging Face username
git clone https://huggingface.co/spaces/YOUR_USERNAME/giftofgrace-rag-api
cd giftofgrace-rag-api
```

---

## Step 3: Copy Files to Your Space

Copy all files from the `huggingface-rag-api` folder:

```bash
# From the Gift-Of-Grace-Website directory
cp huggingface-rag-api/* YOUR_CLONED_SPACE/

# Or on Windows:
xcopy huggingface-rag-api\* YOUR_CLONED_SPACE\ /E /Y
```

Your Space folder should contain:
```
giftofgrace-rag-api/
├── Dockerfile
├── main.py
├── requirements.txt
├── README.md
└── vector_db/
    ├── corporate.index
    ├── corporate_documents.json
    ├── corporate_metadata.json
    └── summary.json
```

---

## Step 4: Copy Vector Database Files

**IMPORTANT:** You need to copy the vector database files manually:

```bash
# Create vector_db folder in your Space
mkdir -p YOUR_CLONED_SPACE/vector_db

# Copy from backend
cp backend/knowledge_base/vector_db/corporate.index YOUR_CLONED_SPACE/vector_db/
cp backend/knowledge_base/vector_db/corporate_documents.json YOUR_CLONED_SPACE/vector_db/
cp backend/knowledge_base/vector_db/corporate_metadata.json YOUR_CLONED_SPACE/vector_db/
cp backend/knowledge_base/vector_db/summary.json YOUR_CLONED_SPACE/vector_db/
```

---

## Step 5: Add Your Gemini API Key (Optional but Recommended)

### 5.1 Go to your Space Settings
Navigate to: `https://huggingface.co/spaces/YOUR_USERNAME/giftofgrace-rag-api/settings`

### 5.2 Add Secret
1. Scroll to "Repository secrets"
2. Click "New secret"
3. Name: `GEMINI_API_KEY`
4. Value: Your Gemini API key (from https://makersuite.google.com/app/apikey)
5. Click "Add"

---

## Step 6: Push to Hugging Face

```bash
cd YOUR_CLONED_SPACE

# Add all files
git add .

# Commit
git commit -m "Initial deployment of Gift of Grace RAG API"

# Push to Hugging Face
git push
```

---

## Step 7: Wait for Build

1. Go to your Space: `https://huggingface.co/spaces/YOUR_USERNAME/giftofgrace-rag-api`
2. Click "Logs" tab to watch the build progress
3. Build typically takes 3-5 minutes
4. When complete, you'll see "Running" status

---

## Step 8: Test Your API

### Health Check
```bash
curl https://YOUR_USERNAME-giftofgrace-rag-api.hf.space/
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "documents_count": 126
}
```

### Query Test
```bash
curl -X POST https://YOUR_USERNAME-giftofgrace-rag-api.hf.space/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How much is kimchi?", "top_k": 5}'
```

Expected response:
```json
{
  "answer": "Our Kimchi Gift is priced at ₱60...",
  "sources": ["Page 3, Chunk 4", "Page 4, Chunk 5"],
  "confidence": 0.85
}
```

---

## Step 9: Connect to Your RASA Backend

Update your RASA actions to call this API:

### In `backend/actions/actions.py`:

```python
import requests

HF_RAG_API = "https://YOUR_USERNAME-giftofgrace-rag-api.hf.space"

class ActionCorporateQuery(Action):
    def name(self):
        return "action_corporate_query"

    def run(self, dispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text", "")

        try:
            # Call Hugging Face RAG API
            response = requests.post(
                f"{HF_RAG_API}/query",
                json={"query": user_message, "top_k": 5},
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                dispatcher.utter_message(text=data["answer"])
            else:
                dispatcher.utter_message(text="I'm having trouble connecting. Please try again.")

        except Exception as e:
            print(f"Error calling RAG API: {e}")
            dispatcher.utter_message(text="Sorry, I couldn't process that request.")

        return []
```

---

## Troubleshooting

### Build Fails
1. Check the Logs tab for error messages
2. Common issues:
   - Missing `requirements.txt`
   - Dockerfile syntax errors
   - Port not set to 7860

### "Model not loaded" Error
- The embedding model takes ~30 seconds to load on first request
- Wait and try again

### Slow Responses
- Free CPU tier is slower than GPU
- First request takes longer (cold start)
- Consider caching frequent queries

### Out of Memory
- Reduce `top_k` parameter
- Use a smaller embedding model

---

## File Structure Explained

```
huggingface-rag-api/
├── Dockerfile          # Docker container configuration
│                       # - Uses Python 3.10
│                       # - Creates non-root user (HF requirement)
│                       # - Exposes port 7860 (HF requirement)
│
├── main.py             # FastAPI application
│                       # - /query endpoint for RAG
│                       # - /health endpoint for status
│                       # - Gemini LLM integration
│                       # - Fallback responses
│
├── requirements.txt    # Python dependencies
│                       # - fastapi, uvicorn
│                       # - sentence-transformers
│                       # - faiss-cpu
│                       # - google-generativeai
│
├── README.md           # HF Space metadata
│                       # - sdk: docker
│                       # - app_port: 7860
│
└── vector_db/          # Your knowledge base
    ├── corporate.index           # FAISS vector index
    ├── corporate_documents.json  # 126 document chunks
    ├── corporate_metadata.json   # Metadata
    └── summary.json              # Stats
```

---

## API Reference

### GET /
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "documents_count": 126
}
```

### POST /query
Query the RAG system

**Request:**
```json
{
  "query": "What products do you have?",
  "top_k": 5
}
```

**Response:**
```json
{
  "answer": "Gift of Grace offers three main products...",
  "sources": ["Page 3, Chunk 4"],
  "confidence": 0.87
}
```

### POST /embed
Get embedding vector for text

**Request:**
```json
{
  "query": "kimchi price"
}
```

**Response:**
```json
{
  "embedding": [0.123, -0.456, ...]
}
```

---

## Cost: FREE

Hugging Face Spaces Docker (CPU Basic) is completely free:
- 2 vCPU
- 16 GB RAM
- 50 GB disk
- Unlimited requests
- No credit card required
- Must be public repository

---

## Next Steps

1. **Test thoroughly** before connecting to production
2. **Monitor logs** at huggingface.co/spaces/YOUR_USERNAME/giftofgrace-rag-api/logs
3. **Update your frontend** to use the new API URL
4. **Consider upgrading** to GPU if response time is critical

---

## Sources

- [Hugging Face Docker Spaces](https://huggingface.co/docs/hub/spaces-sdks-docker)
- [FastAPI on HF Spaces](https://huggingface.co/blog/HemanthSai7/deploy-applications-on-huggingface-spaces)
- [Docker Spaces Examples](https://huggingface.co/docs/hub/en/spaces-sdks-docker-examples)
- [Streaming RAG on HF](https://newsletter.theaiedge.io/p/how-to-deploy-a-streaming-rag-endpoint)
