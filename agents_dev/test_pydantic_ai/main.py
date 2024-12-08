import os 

import logfire
from pydantic import BaseModel
from pydantic_ai import Agent
from dotenv import load_dotenv
import mysql.connector
logfire.configure()
load_dotenv()

from db_config import get_db_connection

class SupportDependencies(BaseModel):
    db

agent = Agent(
    'gemini-1.5-flash',
    deps_type=SupportDependencies,
    system_prompt="You are a helpful assistant that can answer questions and help with tasks.",
)

# result = agent.run_sync("What is the capital of Egypt?")
# print(result.data)
deps = SupportDependencies(db = get_db_connection())
result = agent.run_sync("What is the database avaliable?", deps=deps)
print(result.data)


