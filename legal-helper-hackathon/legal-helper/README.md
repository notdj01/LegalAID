# AI-Powered Legal Helper

A full-stack RAG (Retrieval-Augmented Generation) application for Indian Law, built for the 48-hour hackathon.

## Features
- **Bilingual Support**: English and Hindi query support.
- **RAG Engine**: Retrieves relevant IPC/BNS sections and Case Law using ChromaDB and Gemini 1.5 Flash.
- **Statute Comparison**: Side-by-side view of IPC vs BNS sections.
- **Document Summarization**: PDF upload and summarization.

## Tech Stack
- **Backend**: FastAPI, LangChain, ChromaDB, Google Gemini 1.5 Flash.
- **Frontend**: Next.js 14, Tailwind CSS, Shadcn/ui.

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### Backend Setup
1. Navigate to `backend`:
   ```bash
   cd legal-helper/backend
   ```
2. Create virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Configure Environment:
   - Edit `.env` and add your `GOOGLE_API_KEY`.
4. Ingest Sample Data:
   ```bash
   python scripts/ingest_data.py
   ```
5. Run Server:
   ```bash
   python app/main.py
   ```
   Server runs at `http://localhost:8000`.

### Frontend Setup
1. Navigate to `frontend`:
   ```bash
   cd legal-helper/frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run Development Server:
   ```bash
   npm run dev
   ```
   Frontend runs at `http://localhost:3000`.

## API Documentation
- Swagger UI: `http://localhost:8000/docs`
