from typing import List, Dict, Any, Optional
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.chat_models import ChatOpenAI
from langchain.agents.agent_types import AgentType
from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import AgentAction, AgentFinish, LLMResult
from langchain.prompts import PromptTemplate
from pydantic import BaseModel
import json
from ...core.config import get_settings

settings = get_settings()

ANALYTICS_ASSESSMENT_PROMPT = """You are an analytics expert. Given a table structure and sample data, assess if the following analytics can be generated:

1. Time-based analysis (requires date/timestamp columns)
2. Categorical distributions (requires categorical/text columns)
3. Numerical aggregations (requires numeric columns)
4. Growth/decline patterns (requires numeric and date columns)
5. Relationship analysis (requires multiple related columns)

Table Schema: {table_schema}
Sample Data: {sample_data}

For each analytics type, determine if it's possible and explain why or why not.
If an analytics type is possible, provide a sample SQL query that could generate it.
Format your response as a JSON object with the following structure:
{{
    "possible_analytics": ["type1", "type2"],
    "impossible_analytics": ["type3"],
    "explanations": {{"type1": "explanation", "type2": "explanation"}},
    "sample_queries": {{"type1": "SQL query", "type2": "SQL query"}}
}}
"""

class AnalyticsAssessment(BaseModel):
    """Analytics assessment response model"""
    possible_analytics: List[str]
    impossible_analytics: List[str]
    explanations: Dict[str, str]
    sample_queries: Dict[str, str]

class SQLAgentResponse(BaseModel):
    """Response model for SQL Agent"""
    answer: str
    sql_queries: List[str] = []
    tables_used: List[str] = []
    thought_process: List[str] = []

class SQLQueryCallbackHandler(BaseCallbackHandler):
    """Callback handler to track SQL queries and thought process"""
    def __init__(self):
        self.sql_queries: List[str] = []
        self.thought_process: List[str] = []
        self.tables_used: List[str] = []

    def on_agent_action(self, action: AgentAction, **kwargs) -> Any:
        """Track agent actions"""
        if "query" in action.tool_input:
            self.sql_queries.append(action.tool_input["query"])
            # Extract table names from query
            query = action.tool_input["query"].lower()
            if "from" in query:
                tables = query.split("from")[1].split("where")[0].strip().split(",")
                self.tables_used.extend([t.strip() for t in tables])
        self.thought_process.append(action.log)

    def on_agent_finish(self, finish: AgentFinish, **kwargs) -> Any:
        """Track agent finish"""
        self.thought_process.append(finish.log)

class SQLAgent:
    """SQL Agent for natural language queries on dynamic tables"""
    
    def __init__(self, user_id: str, target_table: Optional[str] = None):
        """
        Initialize SQL Agent for a specific user's schema
        
        Args:
            user_id: The user's ID (used as schema name)
            target_table: Optional specific table to focus on
        """
        self.user_id = user_id
        self.target_table = target_table
        self.db_uri = f"postgresql+psycopg2://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
        self.db = SQLDatabase.from_uri(
            self.db_uri,
            schema=user_id,
            include_tables=[target_table] if target_table else None,
            sample_rows_in_table_info=3
        )
        
        # Initialize LLM
        self.llm = ChatOpenAI(
            temperature=0,
            model_name=settings.OPENAI_MODEL_NAME if settings.OPENAI_MODEL_NAME else "gpt-4o-mini",
            openai_api_key=settings.OPENAI_API_KEY
        )
        
        # Create toolkit and agent
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)
        self.agent_executor = create_sql_agent(
            llm=self.llm,
            toolkit=self.toolkit,
            agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            max_iterations=5
        )

    async def assess_analytics_potential(self) -> AnalyticsAssessment:
        """
        Assess the analytics potential of the target table
        
        Returns:
            AnalyticsAssessment containing possible analytics types and explanations
        """
        if not self.target_table:
            raise ValueError("Target table must be specified for analytics assessment")

        # Get table schema and sample data
        table_info = self.db.get_table_info(self.target_table)
        sample_data = await self._get_sample_rows(self.target_table, limit=5)

        # Create assessment prompt
        prompt = PromptTemplate(
            template=ANALYTICS_ASSESSMENT_PROMPT,
            input_variables=["table_schema", "sample_data"]
        )

        # Get assessment from LLM
        assessment_prompt = prompt.format(
            table_schema=table_info,
            sample_data=json.dumps(sample_data, indent=2)
        )
        
        response = await self.llm.apredict(assessment_prompt)
        
        try:
            assessment_dict = json.loads(response)
            return AnalyticsAssessment(**assessment_dict)
        except Exception as e:
            raise ValueError(f"Failed to parse analytics assessment: {str(e)}")

    async def query(self, question: str) -> SQLAgentResponse:
        """
        Execute a natural language query against the user's tables
        
        Args:
            question: Natural language question about the data
            
        Returns:
            SQLAgentResponse containing the answer and metadata
        """
        # Initialize callback handler
        callback_handler = SQLQueryCallbackHandler()
        
        try:
            # Execute query with callback handler
            result = await self.agent_executor.arun(
                question,
                callbacks=[callback_handler]
            )
            
            # Prepare response
            return SQLAgentResponse(
                answer=result,
                sql_queries=list(set(callback_handler.sql_queries)),
                tables_used=list(set(callback_handler.tables_used)),
                thought_process=callback_handler.thought_process
            )
            
        except Exception as e:
            # Handle errors gracefully
            return SQLAgentResponse(
                answer=f"Error executing query: {str(e)}",
                sql_queries=callback_handler.sql_queries,
                tables_used=callback_handler.tables_used,
                thought_process=callback_handler.thought_process
            )

    async def get_schema_info(self) -> Dict[str, Any]:
        """Get information about available tables and their schemas"""
        tables_info = {}
        for table in self.db.get_usable_table_names():
            columns = self.db.get_table_info(table)
            tables_info[table] = {
                "columns": columns,
                "sample_rows": await self._get_sample_rows(table)
            }
        return tables_info
    
    async def _get_sample_rows(self, table: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Get sample rows from a table"""
        try:
            query = f'SELECT * FROM "{self.user_id}"."{table}" LIMIT {limit}'
            result = await self.db.run(query)
            return json.loads(result) if result else []
        except Exception:
            return [] 