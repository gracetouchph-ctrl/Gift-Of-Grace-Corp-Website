# Gift of Grace - Hugging Face Spaces Deployment Guide
**RAG API Deployment - Free Hosting**

---

## Overview

Deploy your Gift of Grace RAG chatbot API to Hugging Face Spaces using Docker - completely free.

| Resource | Value |
|----------|-------|
| **CPU** | 2 vCPU |
| **RAM** | 16 GB |
| **Storage** | 50 GB ephemeral |
| **Requests** | Unlimited |
| **Cost** | Free |
| **Requirement** | Public repository |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Hugging Face Spaces (Free)                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Docker Container                           │ │
│  │                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │ │
│  │  │   FastAPI   │  │  Sentence   │  │    FAISS      │  │ │
│  │  │   Server    │  │ Transformers│  │  Vector DB    │  │ │
│  │  │  :7860      │  │  Embeddings │  │  126 chunks   │  │ │
│  │  └─────────────┘  └─────────────┘  └───────────────┘  │ │
│  │                           │                            │ │
│  │                           ▼                            │ │
│  │                  ┌─────────────────┐                   │ │
│  │                  │  Google Gemini  │                   │ │
│  │                  │   (Optional)    │                   │ │
│  │                  └─────────────────┘                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              Your RASA Backend / Frontend
```

---

## Step 1: Create Hugging Face Account

1. Go to https://huggingface.co/join
2. Create a free account
3. Verify your email

---

## Step 2: Create a New Space

1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Configure:

| Setting | Value |
|---------|-------|
| **Space name** | `giftofgrace-rag-api` |
| **License** | MIT |
| **SDK** | **Docker** (important!) |
| **Hardware** | CPU basic (free) |
| **Visibility** | Public |

4. Click **"Create Space"**

---

## Step 3: Clone Your Space

```bash
# Replace YOUR_USERNAME with your Hugging Face username
git clone https://huggingface.co/spaces/YOUR_USERNAME/giftofgrace-rag-api

cd giftofgrace-rag-api
```

---

## Step 4: Copy Project Files

Copy the prepared files from `huggingface-rag-api/`:

```bash
# From Gift-Of-Grace-Website directory
cp huggingface-rag-api/Dockerfile .
cp huggingface-rag-api/main.py .
cp huggingface-rag-api/requirements.txt .
cp huggingface-rag-api/README.md .
```

---

## Step 5: Copy Vector Database

```bash
# Create vector_db folder
mkdir vector_db

# Copy your knowledge base
cp backend/knowledge_base/vector_db/corporate.index vector_db/
cp backend/knowledge_base/vector_db/corporate_documents.json vector_db/
cp backend/knowledge_base/vector_db/corporate_metadata.json vector_db/
cp backend/knowledge_base/vector_db/summary.json vector_db/
```

Your folder structure should be:
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

## Step 6: Add Gemini API Key (Optional)

For LLM-powered responses:

1. Go to: `https://huggingface.co/spaces/YOUR_USERNAME/giftofgrace-rag-api/settings`
2. Scroll to **"Repository secrets"**
3. Click **"New secret"**
4. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your API key from https://makersuite.google.com/app/apikey
5. Click **"Add"**

> Without Gemini key, the API will use fallback rule-based responses.

---

## Step 7: Push to Deploy

```bash
git add .
git commit -m "Deploy Gift of Grace RAG API"
git push
```

---

## Step 8: Monitor Build

1. Go to your Space: `https://huggingface.co/spaces/YOUR_USERNAME/giftofgrace-rag-api`
2. Click **"Logs"** tab
3. Wait 3-5 minutes for build to complete
4. Status will show **"Running"** when ready

---

## Step 9: Test Your API

### Health Check
```bash
curl https://YOUR_USERNAME-giftofgrace-rag-api.hf.space/
```

**Response:**
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

**Response:**
```json
{
  "answer": "Our Kimchi Gift is priced at ₱60. We also have Tofu Gift at ₱43 and Rice Coffee with Moringa ranging from ₱90-170.",
  "sources": ["Page 3, Chunk 4", "Page 4, Chunk 5"],
  "confidence": 0.85
}
```

---

## API Reference

### GET /
Health check

### GET /health
Health check (alias)

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
  "answer": "Gift of Grace offers...",
  "sources": ["Page 3, Chunk 4"],
  "confidence": 0.87
}
```

### POST /embed
Get embedding vector

**Request:**
```json
{
  "query": "kimchi"
}
```

**Response:**
```json
{
  "embedding": [0.123, -0.456, ...]
}
```

---

## Connect to RASA

Update `backend/actions/actions.py`:

```python
import requests

# Your Hugging Face Space URL
HF_RAG_API = "https://YOUR_USERNAME-giftofgrace-rag-api.hf.space"

class ActionCorporateQuery(Action):
    def name(self):
        return "action_corporate_query"

    def run(self, dispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text", "")

        try:
            response = requests.post(
                f"{HF_RAG_API}/query",
                json={"query": user_message, "top_k": 5},
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                dispatcher.utter_message(text=data["answer"])
            else:
                dispatcher.utter_message(text="Let me check on that...")

        except Exception as e:
            print(f"RAG API error: {e}")
            dispatcher.utter_message(text="Sorry, please try again.")

        return []
```

---

## Configuration Files

### Dockerfile
```dockerfile
FROM python:3.10-slim

RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

COPY --chown=user:user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user:user . .

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### README.md (Space metadata)
```yaml
---
title: Gift of Grace RAG API
emoji: 🍜
colorFrom: blue
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
---
```

### requirements.txt
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
sentence-transformers==3.3.1
faiss-cpu==1.9.0
google-generativeai==0.8.3
numpy==1.26.4
pydantic==2.10.0
python-dotenv==1.0.1
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Logs tab for errors |
| "Model not loaded" | Wait 30 seconds, embedding model is loading |
| Slow responses | First request has cold start, subsequent faster |
| Out of memory | Reduce `top_k` parameter |
| 404 errors | Ensure port 7860 in Dockerfile |

---

## Updating Your API

To update after changes:

```bash
git add .
git commit -m "Update RAG API"
git push
```

Space will automatically rebuild (3-5 minutes).

---

## Sources

- [Hugging Face Docker Spaces](https://huggingface.co/docs/hub/spaces-sdks-docker)
- [FastAPI on HF Spaces](https://huggingface.co/blog/HemanthSai7/deploy-applications-on-huggingface-spaces)
- [Docker Spaces Examples](https://huggingface.co/docs/hub/en/spaces-sdks-docker-examples)
- [HF Spaces Pricing](https://huggingface.co/pricing)

---

**Document Created:** December 12, 2025
