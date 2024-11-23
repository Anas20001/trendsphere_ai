# main.py
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
# from fastapi import UploadFile, File
# from my_agent.upload_handler import UploadHandler
from pydantic import BaseModel
from my_agent.WorkflowManager import WorkflowManager
from typing import Optional, Dict, Any
import uvicorn
import logging

# Initialize logging and env
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from dotenv import load_dotenv
load_dotenv()


# Initialize FastAPI app
app = FastAPI(
    title="SQL Agent API",
    description="API for SQL query processing using LangGraph",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize WorkflowManager
graph = WorkflowManager()

class QueryRequest(BaseModel):
    question: str
    uuid: str = "921c838c-541d-4361-8c96-70cb23abd9f5"

class QueryResponse(BaseModel):
    answer: str
    visualization: Optional[str]
    visualization_reason: Optional[str]
    formatted_data_for_visualization: Optional[Dict[str, Any]]

class ErrorResponse(BaseModel):
    detail: str
    
class TableResponse(BaseModel):
    message: str
    table_name: str
    row_count: int

@app.get("/", include_in_schema=False)
async def root():
    """Redirect to API documentation"""
    return RedirectResponse(url="/docs")

# @app.post("/graph")
# async def get_workflow_graph(request: QueryRequest):
#     """Return the LangGraph workflow visualization using a test question"""
#     try:
#         test_result = graph.run_sql_agent(
#             question=request.question,
#             uuid=request.uuid
#         )
#         return test_result
#     except Exception as e:
#         logger.error(f"Error getting workflow graph: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))


# @app.post("/upload-csv", response_model=TableResponse)
# async def upload_csv(
#     file: UploadFile = File(...),
#     table_name: str = None
# ):
#     """Upload CSV file and create SQLite table"""
#     try:
#         handler = UploadHandler(file)
#         table_name, row_count = handler.process_file(table_name)
        
#         return TableResponse(
#             message="CSV file processed successfully",
#             table_name=table_name,
#             row_count=row_count
#         )
#     except Exception as e:
#         logger.error(f"Error processing CSV file: {str(e)}")
#         raise HTTPException(
#             status_code=500,
#             detail=f"Failed to process CSV file: {str(e)}"
#         ) 
                  
@app.post("/query")
async def process_query(request: Request, query: QueryRequest):
    """Process a natural language query and return SQL results with visualization"""
    try:
        logger.info(f"Processing query: {query.question}")
        result = graph.run_sql_agent(
            question=query.question,
            uuid=query.uuid
        )

        return result
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )