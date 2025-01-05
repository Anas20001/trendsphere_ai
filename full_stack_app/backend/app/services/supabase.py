from supabase import create_client, Client
from fastapi import HTTPException
import pandas as pd
import io
from typing import Optional, Dict, Any, List
from ..core.config import get_settings
import tempfile
import os
import requests
from urllib.parse import urlparse

settings = get_settings()

class SupabaseService:
    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
    
    async def load_file_to_db(self, file_url: str, user_id: str, table_name: str) -> dict:
        """Load a file from Supabase storage URL into PostgreSQL"""
        try:
            # Extract file extension from URL
            file_ext = os.path.splitext(urlparse(file_url).path)[1][1:].lower()
            
            # Download file from URL
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_ext}') as temp_file:
                response = requests.get(file_url)
                response.raise_for_status()
                temp_file.write(response.content)
                temp_file_path = temp_file.name

            try:
                # Read the file into a DataFrame
                df = self._read_file_to_dataframe(temp_file_path, file_ext)
                if df is not None:
                    # Create schema if it doesn't exist
                    await self._ensure_schema_exists(user_id)
                    
                    # Create and populate table
                    await self._create_and_populate_table(df, user_id, table_name)
                    
                    return {
                        "status": "success",
                        "message": "File loaded into database successfully",
                        "table_name": f"{user_id}.{table_name}",
                        "row_count": len(df),
                        "columns": list(df.columns)
                    }
                else:
                    raise HTTPException(status_code=400, detail="Failed to read file contents")
            finally:
                # Clean up temporary file
                os.unlink(temp_file_path)
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")

    async def list_user_tables(self, user_id: str) -> List[Dict[str, Any]]:
        """List all tables in user's schema with their details"""
        query = f"""
            SELECT 
                table_name,
                (SELECT COUNT(*) FROM {user_id}.\"{{table_name}}\") as row_count,
                (
                    SELECT json_agg(column_name) 
                    FROM information_schema.columns 
                    WHERE table_schema = '{user_id}' 
                    AND table_name = tables.table_name
                ) as columns
            FROM information_schema.tables
            WHERE table_schema = '{user_id}'
        """
        result = self.client.postgrest.rpc('exec_sql', {'query': query}).execute()
        return result.data if result.data else []

    def _read_file_to_dataframe(self, file_path: str, file_ext: str) -> Optional[pd.DataFrame]:
        """Read file into pandas DataFrame"""
        try:
            if file_ext == 'csv':
                return pd.read_csv(file_path)
            elif file_ext in ['xlsx', 'xls']:
                return pd.read_excel(file_path)
            elif file_ext == 'parquet':
                return pd.read_parquet(file_path)
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_ext}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")

    async def _ensure_schema_exists(self, user_id: str):
        """Create schema if it doesn't exist"""
        query = f"CREATE SCHEMA IF NOT EXISTS {user_id}"
        self.client.postgrest.rpc('exec_sql', {'query': query}).execute()
    
    async def _create_and_populate_table(self, df: pd.DataFrame, schema: str, table_name: str):
        """Create table and populate it with DataFrame contents"""
        # Generate CREATE TABLE statement
        columns = []
        for col in df.columns:
            dtype = df[col].dtype
            if pd.api.types.is_integer_dtype(dtype):
                sql_type = 'INTEGER'
            elif pd.api.types.is_float_dtype(dtype):
                sql_type = 'DOUBLE PRECISION'
            elif pd.api.types.is_datetime64_any_dtype(dtype):
                sql_type = 'TIMESTAMP'
            else:
                sql_type = 'TEXT'
            columns.append(f'"{col}" {sql_type}')
        
        create_table_query = f"""
            DROP TABLE IF EXISTS {schema}.{table_name};
            CREATE TABLE {schema}.{table_name} (
                {', '.join(columns)}
            )
        """
        
        # Create table
        self.client.postgrest.rpc('exec_sql', {'query': create_table_query}).execute()
        
        # Insert data
        records = df.to_dict('records')
        if records:
            placeholders = ', '.join(['%s'] * len(records[0]))
            columns_str = ', '.join([f'"{col}"' for col in df.columns])
            
            # Prepare values for insertion
            values = []
            for record in records:
                row_values = []
                for col in df.columns:
                    val = record[col]
                    if pd.isna(val):
                        row_values.append(None)
                    else:
                        row_values.append(str(val))
                values.append(tuple(row_values))
            
            # Insert data in batches
            batch_size = 1000
            for i in range(0, len(values), batch_size):
                batch = values[i:i + batch_size]
                batch_placeholders = ', '.join([f'({placeholders})' for _ in batch])
                insert_query = f"""
                    INSERT INTO {schema}.{table_name} ({columns_str})
                    VALUES {batch_placeholders}
                """
                self.client.postgrest.rpc('exec_sql', {
                    'query': insert_query,
                    'params': [item for sublist in batch for item in sublist]
                }).execute()

supabase_service = SupabaseService()
