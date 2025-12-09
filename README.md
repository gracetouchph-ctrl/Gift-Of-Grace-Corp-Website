# Gift of Grace Website

A modern, elegant React website for Gift of Grace with an AI-powered RAG chatbot.

## Quick Start

### Option 1: Run Everything (Recommended)

**Windows:**
```bash
# Double-click or run:
start-all.bat
```

**Linux/Mac:**
```bash
chmod +x start-backend.sh
./start-backend.sh &
npm run dev
```

### Option 2: Run Separately

#### Backend (RASA + RAG)

```bash
# Windows
start-backend.bat

# Linux/Mac
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
rasa run actions --port 5055 &
rasa run --cors "*" --enable-api --port 5005
```

#### Frontend (React)

```bash
npm install
npm run dev
```

### Environment Setup

1. **Frontend** - Copy `.env.example` to `.env` (optional, defaults work for local dev)
2. **Backend** - Copy `backend/.env.example` to `backend/.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_key_here
   ```

## Architecture

```
Gift-Of-Grace-Website/
├── src/                    # React frontend
│   ├── components/
│   │   └── Chatbot.jsx     # AI chatbot (connects to RASA)
│   └── ...
├── backend/                # Python RASA + RAG backend
│   ├── actions/
│   │   ├── actions.py      # RASA custom actions
│   │   └── rag_pipeline.py # RAG implementation
│   ├── data/               # RASA training data
│   ├── knowledge_base/     # PDF documents for RAG
│   ├── vector_db/          # FAISS vector database
│   ├── models/             # Trained RASA models
│   └── config.yml          # RASA configuration
├── start-all.bat           # Start everything (Windows)
├── start-backend.bat       # Start backend only (Windows)
├── start-backend.sh        # Start backend only (Linux/Mac)
└── start-frontend.bat      # Start frontend only (Windows)
```

## Chatbot Features

The AI chatbot uses:
- **RASA** - Conversational AI framework for intent recognition
- **RAG (Retrieval Augmented Generation)** - Searches knowledge base for relevant info
- **FAISS** - Fast vector similarity search
- **GPT-4o-mini** - Generates natural language responses
- **SentenceTransformers** - Creates text embeddings

### Adding Documents to Knowledge Base

1. Place PDF files in `backend/knowledge_base/documents/`
2. Run: `cd backend && python setup_ordinances.py`
3. Restart the backend servers

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `http://localhost:5005/webhooks/rest/webhook` | RASA REST API |
| `http://localhost:5055/webhook` | RASA Actions Server |
| `http://localhost:5173` | Frontend Dev Server |

## 📦 Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS v3.4.18** - Utility-first CSS framework


## 🎨 Design Features

- **Modern & Elegant UI** - Clean design with ample white space and premium aesthetics
- **Responsive Design** - Fully responsive (desktop, tablet, mobile)
- **Smooth Animations** - Optimized Framer Motion transitions with tween animations
- **Blue-White-Gold Palette** - Premium color scheme (grace-blue, grace-gold)
- **Interactive Product Carousel** - Horizontal scrollable carousel with circular looping
- **Sticky Navigation** - Centered logo navbar with smooth scroll navigation
- **Customer Reviews Section** - Showcasing social proof
- **AI Chatbot** - Auto-appearing chatbot with logo avatar (appears after 7 seconds)
- **Accessibility** - Full keyboard navigation, ARIA labels, focus states

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Centered logo navigation with mobile menu
│   ├── Hero.jsx             # Hero section with logo, tagline, and girl image
│   ├── FeaturedProducts.jsx # Horizontal carousel with 5 products
│   ├── CustomerReviews.jsx  # Customer reviews showcase section
│   ├── About.jsx            # Brand story and feature cards
│   ├── Footer.jsx            # Footer with contact & social links
│   └── Chatbot.jsx          # AI chatbot component
├── App.jsx                   # Main app component
├── main.jsx                  # React entry point
└── index.css                 # Tailwind CSS & Google Fonts

public/
└── images/
    ├── giftofgracelogo.png  # Brand logo
    ├── girl.png             # Hero section image
    ├── Customer Review.png  # Customer reviews showcase
    ├── KimchiGift.png       # Product images
    ├── RiceCoffee.png
    ├── PickledRadish.png
    ├── RenesBangus.png
    └── RenesGourmetChicken.png
```

## 🖼️ Product Images

Product images are located in `public/images/`:
- `KimchiGift.png`
- `RiceCoffee.png`
- `PickledRadish.png`
- `RenesBangus.png`
- `RenesGourmetChicken.png`

All product images should have `.png` or `.jpg` extensions for proper loading.

## 🔗 Key Links

- **Shopee Store**: `https://ph.shp.ee/k5ZzgF6` (configured in components)
- **Social Media**: Update links in `Footer.jsx`

## 🎯 Customization

### Colors

Colors are defined in `tailwind.config.js`:

```js
colors: {
  'grace-blue': '#3B82F6',
  'grace-gold': '#D4AF37',
  'grace-dark-blue': '#1E40AF',
  'grace-light-blue': '#EFF6FF',
}
```

### Fonts

The site uses **Playfair Display** (serif) and **Source Sans Pro** (sans-serif) from Google Fonts, loaded in `index.css`.

### Products

Edit the `products` array in `src/components/FeaturedProducts.jsx` to add/edit products:

```js
const products = [
  {
    id: 1,
    name: 'Product Name',
    price: '₱220',
    image: '/images/ProductImage.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Product description',
  },
  // ... more products
]
```
## 🌐 Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge) - Latest 2 versions

## 📦 Deployment

Ready for deployment on **Vercel**, **Netlify**, or any static hosting service.

For Vercel:
1. Push code to GitHub
2. Import repository in Vercel
3. Vercel auto-detects Vite + React
4. Deploy!

---

**Brand**: Gift of Grace  
**Tagline**: A Touch of Grace, Infused with Comfort

