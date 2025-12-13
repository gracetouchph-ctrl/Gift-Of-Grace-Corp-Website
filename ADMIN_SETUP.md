# Admin Panel Setup Guide

## Overview
The admin panel allows company owners to manage PDF documents used for RAG training and update site information through a beautiful, user-friendly interface.

## Features
- **PDF Management**: Upload, view, and delete PDF documents used to train the chatbot
- **Vector DB Management**: Automatically rebuilds the vector database when PDFs are added/removed
- **Site Info Management**: CRUD operations for products, awards, about section, and contact information
- **Secure Authentication**: Password-protected admin access
- **Beautiful UI**: Modern, responsive design matching the main website aesthetic

## Setup Instructions

### 1. Install Dependencies

#### Backend (Admin API)
```bash
cd backend
pip install -r requirements.txt
pip install -r admin_requirements.txt
```

#### Frontend
```bash
npm install
```

### 2. Configure Admin Password

The default admin password is `admin123`. **Change this in production!**

To set a custom password hash:
1. Generate a SHA256 hash of your password:
   ```python
   import hashlib
   print(hashlib.sha256("your_password".encode()).hexdigest())
   ```
2. Set it as an environment variable:
   ```bash
   export ADMIN_PASSWORD_HASH="your_hash_here"
   ```

### 3. Start the Admin API Server

**Windows:**
```bash
start-admin-api.bat
```

**Linux/Mac:**
```bash
chmod +x start-admin-api.sh
./start-admin-api.sh
```

Or manually:
```bash
cd backend
python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001 --reload
```

The admin API will run on `http://localhost:8001`

### 4. Start the Frontend

```bash
npm run dev
```

### 5. Access the Admin Panel

1. Navigate to `http://localhost:5173/admin/login` (or your Vercel domain + `/admin/login`)
2. Enter the admin password (default: `admin123`)
3. You'll be redirected to the admin dashboard

## Admin Panel Structure

### Dashboard
- Overview statistics (PDF count, chunks, products, awards)
- Quick actions for common tasks

### PDF Manager
- **View PDFs**: See all uploaded PDF documents with metadata
- **Upload PDF**: Add new PDFs to the knowledge base
  - PDFs are automatically processed and added to the vector database
  - Text is extracted and chunked for RAG retrieval
- **Delete PDF**: Remove PDFs and rebuild the vector database
- **Rebuild Vector DB**: Manually trigger vector database rebuild

### Site Info Manager
- **Products**: Add, edit, delete products with:
  - Name, price, image URL, Shopee link, description, category
- **Awards**: Manage company awards and recognitions
- **About**: Edit mission, vision, and company story
- **Contact**: Update contact information (address, phone, email, Facebook)

## API Endpoints

All endpoints require authentication via Bearer token (obtained from login).

### Authentication
- `POST /admin/login` - Login with password
- Returns: `{ success: true, token: "admin_token" }`

### PDF Management
- `GET /admin/pdfs` - List all PDFs
- `POST /admin/pdfs/upload` - Upload a new PDF (multipart/form-data)
- `DELETE /admin/pdfs/{filename}` - Delete a PDF
- `POST /admin/rebuild-vector-db` - Rebuild vector database

### Site Information
- `GET /admin/site-info` - Get site information
- `PUT /admin/site-info` - Update site information

### Statistics
- `GET /admin/stats` - Get dashboard statistics

## Security Notes

1. **Change Default Password**: The default password `admin123` should be changed immediately
2. **Environment Variables**: Store password hash in environment variables, not in code
3. **HTTPS**: Use HTTPS in production
4. **CORS**: Restrict CORS origins to your domain in production
5. **Token Security**: In production, implement proper JWT tokens instead of simple token strings

## File Structure

```
backend/
  ├── admin_api.py              # Admin API server
  ├── admin_requirements.txt     # Additional Python dependencies
  ├── knowledge_base/
  │   ├── documents/             # PDF storage
  │   └── vector_db/            # Vector database files
  └── site_info.json            # Site information storage

src/
  ├── components/
  │   └── admin/
  │       ├── AdminLogin.jsx
  │       ├── AdminDashboard.jsx
  │       ├── PDFManager.jsx
  │       ├── SiteInfoManager.jsx
  │       └── ProtectedRoute.jsx
  └── contexts/
      └── AuthContext.jsx       # Authentication context
```

## Troubleshooting

### Admin API won't start
- Check if port 8001 is available
- Ensure all dependencies are installed
- Check Python version (3.8+ required)

### PDF upload fails
- Ensure PDF file is valid
- Check file size limits
- Verify write permissions on `backend/knowledge_base/documents/`

### Vector DB rebuild fails
- Check if embedding model downloads correctly
- Ensure sufficient disk space
- Check logs for specific error messages

### Frontend can't connect to API
- Verify admin API is running on port 8001
- Check CORS settings
- Update API_BASE URL in components if needed

## Production Deployment

### Vercel Configuration
1. Set environment variables in Vercel dashboard
2. Update API URLs to use your backend domain
3. Configure CORS to allow only your domain
4. Use environment variables for sensitive data

### Backend Deployment
- Deploy admin API to a server (e.g., Railway, Render, AWS)
- Set up proper authentication (JWT tokens)
- Configure HTTPS
- Set up monitoring and logging

## Support

For issues or questions, check the main README.md or contact the development team.

