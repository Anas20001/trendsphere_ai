from pydantic_settings import BaseSettings
import mysql.connector 
from typing import Optional 

class DatabaseSettings(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str

    class Config:
        env_file = ".env"

def get_db_connection() -> mysql.connector.MySQLConnection:
    """Create and return a MySQL database connection using environment variables."""
    try:
        settings = DatabaseSettings()
        return mysql.connector.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
        )
    except Exception as e:
        raise Exception(f"Error connecting to the database: {e}")