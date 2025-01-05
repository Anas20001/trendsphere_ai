# TrendSphere Backend

FastAPI backend for TrendSphere, handling file uploads and data processing with Supabase integration.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials and other settings
```

4. Run the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, access the API documentation at:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Features

- File upload support for CSV, Excel, and Parquet files
- Automatic storage in Supabase Storage
- Automatic database ingestion with user-specific schemas
- File listing and management
- CORS support for frontend integration

## API Endpoints

- `POST /api/v1/upload/`: Upload files
- `GET /api/v1/files/{user_id}`: List user's files
- `GET /api/health`: Health check endpoint
