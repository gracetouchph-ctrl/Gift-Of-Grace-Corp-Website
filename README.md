# Gift of Grace Website

A modern React website for Gift of Grace with an AI-powered RAG chatbot.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS 3.4, Framer Motion |
| **Backend** | Python 3.10+, RASA, FastAPI |
| **AI/ML** | SentenceTransformers, FAISS, Google Gemini |
| **Database** | FAISS Vector DB (126 chunks, 384-dim) |
| **Deployment** | Vercel (frontend), Hugging Face Spaces (RAG API) |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+

### Run Frontend

```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Run Backend (RASA + RAG)

**Windows:**
```bash
start-backend.bat
```

**Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
rasa run actions --port 5055 &
rasa run --cors "*" --enable-api --port 5005
```

### Run Everything (Windows)
```bash
start-all.bat
```

### Environment Variables

1. Copy `.env.example` to `.env`
2. Copy `backend/.env.example` to `backend/.env` and add:
   ```
   OPENAI_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   ```

---

## Project Structure

```
Gift-Of-Grace-Website/
├── src/                      # React frontend
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation
│   │   ├── Hero.jsx          # Hero section
│   │   ├── FeaturedProducts.jsx
│   │   ├── CustomerReviews.jsx
│   │   ├── About.jsx
│   │   ├── Footer.jsx
│   │   └── Chatbot.jsx       # AI chatbot
│   ├── App.jsx
│   └── index.css
├── backend/                  # Python backend
│   ├── actions/
│   │   ├── actions.py        # RASA custom actions
│   │   └── rag_pipeline.py   # RAG implementation
│   ├── data/                 # RASA training data
│   ├── knowledge_base/       # PDF documents
│   ├── vector_db/            # FAISS database
│   └── models/               # Trained RASA models
├── huggingface-rag-api/      # HF Spaces deployment files
└── public/images/            # Static assets
```

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Vercel auto-detects Vite + React
4. Deploy

### Backend RAG API (Hugging Face Spaces)

Hugging Face Spaces provides free hosting:
- 2 vCPU, 16 GB RAM, 50 GB storage
- Unlimited requests
- Requires public repository

#### Step 1: Create Space

1. Create account at https://huggingface.co/join
2. Go to https://huggingface.co/spaces
3. Click "Create new Space"
4. Configure:
   - **Name:** `giftofgrace-rag-api`
   - **SDK:** Docker
   - **Hardware:** CPU basic (free)
   - **Visibility:** Public

#### Step 2: Clone and Setup

```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/giftofgrace-rag-api
cd giftofgrace-rag-api

# Copy deployment files
cp ../Gift-Of-Grace-Website/huggingface-rag-api/* .

# Copy vector database
mkdir vector_db
cp ../Gift-Of-Grace-Website/backend/knowledge_base/vector_db/* vector_db/
```

#### Step 3: Add Secrets (Optional)

1. Go to Space Settings
2. Add secret: `GEMINI_API_KEY` with your API key from https://makersuite.google.com/app/apikey

#### Step 4: Deploy

```bash
git add .
git commit -m "Deploy RAG API"
git push
```

Build takes 3-5 minutes. Check "Logs" tab for status.

#### Step 5: Test

```bash
# Health check
curl https://YOUR_USERNAME-giftofgrace-rag-api.hf.space/

# Query test
curl -X POST https://YOUR_USERNAME-giftofgrace-rag-api.hf.space/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How much is kimchi?", "top_k": 5}'
```

---

## Hugging Face RAG API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Health check (alias) |
| `/query` | POST | Query the RAG system |
| `/embed` | POST | Get embedding vector |

### POST /query

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
  "answer": "Gift of Grace offers Kimchi Gift (P60), Tofu Gift (P43), and Rice Coffee (P90-170).",
  "sources": ["Page 3, Chunk 4"],
  "confidence": 0.87
}
```

---

## Connecting RASA to Hugging Face API

Update `backend/actions/actions.py`:

```python
import requests

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
            dispatcher.utter_message(text="Sorry, please try again.")

        return []
```

---

## API Endpoints (Local Development)

| Endpoint | Port | Description |
|----------|------|-------------|
| RASA REST API | 5005 | `http://localhost:5005/webhooks/rest/webhook` |
| RASA Actions | 5055 | `http://localhost:5055/webhook` |
| Frontend | 5173 | `http://localhost:5173` |

---

## Adding Documents to Knowledge Base

1. Place PDF files in `backend/knowledge_base/documents/`
2. Run: `cd backend && python setup_ordinances.py`
3. Restart backend servers

---

## Customization

### Colors (tailwind.config.js)
```js
colors: {
  'grace-blue': '#3B82F6',
  'grace-gold': '#D4AF37',
  'grace-dark-blue': '#1E40AF',
  'grace-light-blue': '#EFF6FF',
}
```

### Fonts
- Playfair Display (serif)
- Source Sans Pro (sans-serif)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| HF build fails | Check Logs tab for errors |
| "Model not loaded" | Wait 30 seconds for embedding model |
| Slow first response | Cold start; subsequent requests faster |
| RASA not responding | Ensure both ports 5005 and 5055 are running |

---

**Brand:** Gift of Grace
**Tagline:** A Touch of Grace, Infused with Comfort
