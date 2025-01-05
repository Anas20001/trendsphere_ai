from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "TrendSphere"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # Storage bucket names
    STORAGE_BUCKET_CSV: str = "csv-files"
    STORAGE_BUCKET_EXCEL: str = "excel-files"
    STORAGE_BUCKET_PARQUET: str = "parquet-files"

    # OpenAI settings
    OPENAI_API_KEY: str
    OPENAI_MODEL_NAME: str = "gpt-4o-mini"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()
