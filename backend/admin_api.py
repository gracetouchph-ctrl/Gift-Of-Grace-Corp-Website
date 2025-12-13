"""
Admin API for Gift of Grace Website
Handles PDF management and site info CRUD operations
"""

import os
import json
import hashlib
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import PyPDF2
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Gift of Grace Admin API",
    description="Admin API for managing PDFs and site information",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Configuration
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")  # Set via environment variable
KNOWLEDGE_BASE_DIR = Path("knowledge_base")
DOCUMENTS_DIR = KNOWLEDGE_BASE_DIR / "documents"
VECTOR_DB_DIR = KNOWLEDGE_BASE_DIR / "vector_db"
SITE_INFO_FILE = Path("site_info.json")

# Initialize embedding model
embedder = None

def get_embedder():
    global embedder
    if embedder is None:
        embedder = SentenceTransformer("all-MiniLM-L6-v2")
    return embedder

# Authentication
def verify_password(password: str) -> bool:
    """Verify admin password"""
    if not ADMIN_PASSWORD_HASH:
        # Default password: "admin123" (change in production!)
        default_hash = hashlib.sha256("admin123".encode()).hexdigest()
        return hashlib.sha256(password.encode()).hexdigest() == default_hash
    return hashlib.sha256(password.encode()).hexdigest() == ADMIN_PASSWORD_HASH

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify admin token"""
    token = credentials.credentials
    # Simple token verification (in production, use JWT)
    if token == "admin_token":  # This should be set after login
        return True
    raise HTTPException(status_code=401, detail="Invalid authentication token")

# Pydantic models
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

# Initialize directories
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
VECTOR_DB_DIR.mkdir(parents=True, exist_ok=True)

# Load site info
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

# PDF Processing
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
        logger.error(f"Error extracting PDF text: {e}")
        raise

def process_text_to_chunks(text: str, source: str) -> List[Dict[str, Any]]:
    """Process text into chunks for vector DB"""
    # Simple chunking by paragraphs
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    chunks = []
    
    for i, para in enumerate(paragraphs):
        if len(para) > 50:  # Only process substantial paragraphs
            chunks.append({
                "content": para,
                "source": source,
                "chunk_id": f"{source}_{i}",
                "page_number": i // 10 + 1  # Approximate page
            })
    
    return chunks

def rebuild_vector_db():
    """Rebuild vector database from all PDFs"""
    logger.info("Rebuilding vector database...")
    
    embedder = get_embedder()
    dim = embedder.get_sentence_embedding_dimension()
    index = faiss.IndexFlatL2(dim)
    
    all_documents = []
    all_metadata = []
    
    # Process all PDFs
    pdf_files = list(DOCUMENTS_DIR.glob("*.pdf"))
    
    for pdf_path in pdf_files:
        try:
            logger.info(f"Processing {pdf_path.name}...")
            text = extract_pdf_text(pdf_path)
            chunks = process_text_to_chunks(text, pdf_path.name)
            
            for chunk in chunks:
                embedding = embedder.encode(chunk["content"])
                index.add(np.array([embedding]).astype("float32"))
                all_documents.append(chunk)
                all_metadata.append({
                    "source": chunk["source"],
                    "chunk_id": chunk["chunk_id"],
                    "page_number": chunk.get("page_number", 1)
                })
        except Exception as e:
            logger.error(f"Error processing {pdf_path.name}: {e}")
    
    # Save vector DB
    index_path = VECTOR_DB_DIR / "corporate.index"
    documents_path = VECTOR_DB_DIR / "corporate_documents.json"
    metadata_path = VECTOR_DB_DIR / "corporate_metadata.json"
    
    faiss.write_index(index, str(index_path))
    
    with open(documents_path, 'w', encoding='utf-8') as f:
        json.dump(all_documents, f, indent=2, ensure_ascii=False)
    
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(all_metadata, f, indent=2, ensure_ascii=False)
    
    # Update summary
    summary = {
        "company": "Gift of Grace Food Manufacturing Corporation (GoGFMC)",
        "total_chunks": len(all_documents),
        "document_type": "corporate_report",
        "processed_date": datetime.now().isoformat(),
        "embedding_model": "all-MiniLM-L6-v2",
        "embedding_dimension": dim,
        "sources": [f.name for f in pdf_files]
    }
    
    with open(VECTOR_DB_DIR / "summary.json", 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Vector DB rebuilt with {len(all_documents)} chunks from {len(pdf_files)} PDFs")
    return summary

# API Endpoints

@app.post("/admin/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Admin login endpoint"""
    if verify_password(request.password):
        return LoginResponse(
            success=True,
            token="admin_token",  # In production, generate proper JWT
            message="Login successful"
        )
    raise HTTPException(status_code=401, detail="Invalid password")

@app.post("/admin/init-site-info", dependencies=[Depends(verify_token)])
async def init_site_info():
    """Initialize site_info.json with current website data"""
    try:
        # Import initialization function
        import sys
        sys.path.insert(0, str(Path(__file__).parent))
        from init_site_info import initialize_site_info
        
        initialize_site_info()
        return {
            "success": True,
            "message": "Site information initialized with current website data"
        }
    except Exception as e:
        logger.error(f"Error initializing site info: {e}")
        raise HTTPException(status_code=500, detail=f"Error initializing site info: {str(e)}")

@app.get("/admin/pdfs", dependencies=[Depends(verify_token)])
async def list_pdfs():
    """List all PDFs in the knowledge base"""
    pdf_files = []
    for pdf_path in DOCUMENTS_DIR.glob("*.pdf"):
        stat = pdf_path.stat()
        pdf_files.append({
            "filename": pdf_path.name,
            "size": stat.st_size,
            "uploaded_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "processed": True  # Assume processed if exists
        })
    
    # Get chunk counts from summary if available
    summary_path = VECTOR_DB_DIR / "summary.json"
    if summary_path.exists():
        with open(summary_path, 'r') as f:
            summary = json.load(f)
            sources = summary.get("sources", [])
            total_chunks = summary.get("total_chunks", 0)
            chunks_per_file = total_chunks // len(sources) if sources else 0
            
            for pdf in pdf_files:
                if pdf["filename"] in sources:
                    pdf["chunks_count"] = chunks_per_file
    
    return {"pdfs": pdf_files}

@app.post("/admin/pdfs/upload", dependencies=[Depends(verify_token)])
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a new PDF file"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path = DOCUMENTS_DIR / file.filename
    
    # Save file
    with open(file_path, 'wb') as f:
        content = await file.read()
        f.write(content)
    
    # Rebuild vector DB
    try:
        summary = rebuild_vector_db()
        return {
            "success": True,
            "message": f"PDF uploaded and processed successfully",
            "filename": file.filename,
            "chunks": summary["total_chunks"]
        }
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.delete("/admin/pdfs/{filename}", dependencies=[Depends(verify_token)])
async def delete_pdf(filename: str):
    """Delete a PDF file"""
    file_path = DOCUMENTS_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Delete file
    file_path.unlink()
    
    # Also delete .txt version if exists
    txt_path = DOCUMENTS_DIR / f"{filename}.txt"
    if txt_path.exists():
        txt_path.unlink()
    
    # Rebuild vector DB
    try:
        rebuild_vector_db()
        return {"success": True, "message": f"PDF {filename} deleted successfully"}
    except Exception as e:
        logger.error(f"Error rebuilding vector DB: {e}")
        raise HTTPException(status_code=500, detail=f"Error rebuilding vector DB: {str(e)}")

@app.get("/admin/site-info", dependencies=[Depends(verify_token)])
async def get_site_info():
    """Get site information"""
    return load_site_info()

@app.put("/admin/site-info", dependencies=[Depends(verify_token)])
async def update_site_info(info: SiteInfo):
    """Update site information"""
    data = info.dict()
    save_site_info(data)
    return {"success": True, "message": "Site information updated successfully"}

@app.post("/admin/rebuild-vector-db", dependencies=[Depends(verify_token)])
async def rebuild_vector_db_endpoint():
    """Manually rebuild vector database"""
    try:
        summary = rebuild_vector_db()
        return {
            "success": True,
            "message": "Vector database rebuilt successfully",
            "summary": summary
        }
    except Exception as e:
        logger.error(f"Error rebuilding vector DB: {e}")
        raise HTTPException(status_code=500, detail=f"Error rebuilding vector DB: {str(e)}")

@app.get("/admin/stats", dependencies=[Depends(verify_token)])
async def get_stats():
    """Get admin dashboard statistics"""
    pdf_count = len(list(DOCUMENTS_DIR.glob("*.pdf")))
    
    site_info = load_site_info()
    products_count = len(site_info.get("products", []))
    awards_count = len(site_info.get("awards", []))
    
    return {
        "pdfs_count": pdf_count,
        "products_count": products_count,
        "awards_count": awards_count
    }

if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("Starting Gift of Grace Admin API")
    print("=" * 50)
    print("API will be available at: http://localhost:8001")
    print("API docs available at: http://localhost:8001/docs")
    print("=" * 50)
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")

