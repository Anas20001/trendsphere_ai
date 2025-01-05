from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .api import v1
from .agents.sql_agent.router import router as sql_agent_router
from dotenv import load_dotenv

load_dotenv()

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(v1.router, prefix=settings.API_V1_STR)
app.include_router(sql_agent_router, prefix="/api/v1/sql-agent", tags=["SQL Agent"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
