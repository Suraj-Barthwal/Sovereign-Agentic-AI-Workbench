"""
FastAPI entry point for the MRPL agentic AI MVP.

Endpoints:
  GET  /health          -> quick check
  POST /reindex         -> (re)build the in-memory RAG index from docs/
  POST /query           -> text-only query, routed through the orchestrator
  POST /query-image     -> query with an attached image (multipart upload)
"""
#C:\Users\Suraj\Desktop\SIH\Sovereign On-Premise Agentic AI Workbench>uvicorn main:app --reload --port 8000
#npm run dev
import os
import shutil
import uuid

from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel

import rag
import orchestrator
from fastapi.middleware.cors import CORSMiddleware

# Declare FastAPI app once with title
app = FastAPI(title="MRPL Agentic AI MVP")

# Register CORS middleware on the active app instance
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "images")
os.makedirs(IMAGES_DIR, exist_ok=True)


class QueryRequest(BaseModel):
    query: str
    mode: str = "auto"  # auto | calculator | text | code


@app.on_event("startup")
def startup_event():
    count = rag.build_index()
    print(f"[startup] RAG index built with {count} chunks from docs/")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/reindex")
def reindex():
    count = rag.build_index()
    return {"status": "reindexed", "chunks": count}


@app.post("/query")
def query(req: QueryRequest):
    result = orchestrator.run(query=req.query, mode=req.mode)
    return result


@app.post("/query-image")
async def query_image(
    query: str = Form(""),
    mode: str = Form("vision"),
    file: UploadFile = File(...),
):
    # Save uploaded image temporarily
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    temp_path = os.path.join(IMAGES_DIR, f"{uuid.uuid4().hex}{ext}")
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        result = orchestrator.run(query=query, image_path=temp_path, mode=mode)
    finally:
        # comment this out if you want to keep uploaded images
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return result