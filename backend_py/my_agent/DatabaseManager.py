import os
from typing import List, Any
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_openai import ChatOpenAI
from langchain_community.utilities import SQLDatabase
from langchain_core.tools import tool
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.endpoint_url = os.getenv("DB_ENDPOINT_URL")
        self.db = SQLDatabase.from_uri(self.endpoint_url)
        self.llm = ChatOpenAI(model="gpt-4o")
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)
        self.tools = self.toolkit.get_tools()
        self.list_tables_tool = next(tool for tool in self.tools if tool.name == "sql_db_list_tables")
        self.get_schema_tool = next(tool for tool in self.tools if tool.name == "sql_db_schema")
        self.query_tool = next(tool for tool in self.tools if tool.name == "sql_db_query")

    def get_schema(self, uuid: str) -> str:
        """Retrieve the database schema."""
        try:
            schema = self.get_schema_tool.invoke("restaurant_info")
            return schema
        except Exception as e:
            raise Exception(f"Error fetching schema: {str(e)}")
    

    def execute_query(self, query: str):
        """Execute SQL query on the remote database and return results."""
        try:
            results = self.db.run_no_throw(query)
            logger.info(f"Query results: {results}")
            return results if results is not None else []
        except Exception as e:
            raise Exception(f"Error executing query: {str(e)}")