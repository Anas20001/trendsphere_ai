from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from .agent import SQLAgent, SQLAgentResponse, AnalyticsAssessment

router = APIRouter()

class QueryRequest(BaseModel):
    """Request model for natural language queries"""
    question: str
    user_id: str
    table_name: Optional[str] = None

class AssessTableRequest(BaseModel):
    """Request model for table assessment"""
    user_id: str
    table_name: str

@router.post("/assess-table", response_model=AnalyticsAssessment)
async def assess_table_analytics(request: AssessTableRequest):
    """
    Assess the analytics potential of a newly ingested table
    """
    try:
        agent = SQLAgent(user_id=request.user_id, target_table=request.table_name)
        return await agent.assess_analytics_potential()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=SQLAgentResponse)
async def query_data(request: QueryRequest):
    """
    Execute a natural language query against user's tables
    """
    try:
        agent = SQLAgent(user_id=request.user_id, target_table=request.table_name)
        return await agent.query(request.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/schema/{user_id}")
async def get_schema_info(user_id: str):
    """
    Get information about available tables and their schemas for a user
    """
    try:
        agent = SQLAgent(user_id=user_id)
        return await agent.get_schema_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 