---
title: Gift of Grace RAG API
emoji: 🍜
colorFrom: blue
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
---

# Gift of Grace RAG API

A RAG (Retrieval-Augmented Generation) API for the Gift of Grace chatbot.

## Features

- Semantic search using FAISS vector database
- LLM-powered responses via Google Gemini
- FastAPI endpoints for easy integration
- Fallback responses when API is unavailable

## Endpoints

- `GET /` - Health check
- `GET /health` - Health check (alias)
- `POST /query` - Query the RAG system
- `POST /embed` - Get embeddings for text

## Usage

```python
import requests

response = requests.post(
    "https://your-space.hf.space/query",
    json={"query": "How much is kimchi?", "top_k": 5}
)
print(response.json())
```

## Environment Variables

- `GEMINI_API_KEY` - Google Gemini API key (optional, enables LLM responses)
