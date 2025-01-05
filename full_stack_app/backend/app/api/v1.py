from fastapi import APIRouter, HTTPException
from ..services.supabase import supabase_service
from typing import List
from pydantic import BaseModel

router = APIRouter()

class FileLoadRequest(BaseModel):
    file_url: str
    user_id: str
    table_name: str  # Optional: if not provided, will be derived from filename

@router.post("/load-file/")
async def load_file_to_db(request: FileLoadRequest):
    """
    Load a file from Supabase storage URL into a PostgreSQL table under user's schema
    """
    try:
        result = await supabase_service.load_file_to_db(
            file_url=request.file_url,
            user_id=request.user_id,
            table_name=request.table_name
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tables/{user_id}")
async def list_user_tables(user_id: str):
    """
    List all tables in user's schema
    """
    try:
        tables = await supabase_service.list_user_tables(user_id)
        return {"tables": tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
