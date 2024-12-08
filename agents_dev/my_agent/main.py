from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from my_agent.WorkflowManager import WorkflowManager

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
    description="API for SQL deep analysis",
    version="0.0.8"
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

class InputQuery(BaseModel):
    question: str
    uuid: str

@app.get("/", include_in_schema=False)
async def root():
    """Redirect to API documentation"""
    return RedirectResponse(url="/docs")
  
@app.post("/query")
async def process_query(request: Request, query: InputQuery):
    """Process a natural language query and return json results"""
    try:
        # logger.info(f"Processing query: {query.question}")
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