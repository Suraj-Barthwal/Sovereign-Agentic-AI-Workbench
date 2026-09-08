# MRPL Agentic AI MVP

Bare-minimum FastAPI backend that orchestrates local Ollama models:
- `qwen2.5:7b` — general text reasoning
- `qwen2.5vl:3b` — vision (machine photos, scanned reports, diagrams)
- `qwen2.5-coder:14b` — code generation
- `nomic-embed-text` — embeddings for RAG

## Setup

```bash
pip install -r requirements.txt
```

Make sure Ollama is running:

```bash
ollama serve
```

(Run this in a separate terminal if it's not already running as a service.)

## Run the app

```bash
uvicorn main:app --reload
```

The RAG index is built automatically on startup from `.txt` files in `docs/`.
Drop your own reports/notes into `docs/` and hit `/reindex` to refresh.

## Endpoints

### Health check
```bash
curl http://127.0.0.1:8000/health
```

### Text query (auto-routes to calculator or text+RAG)
```bash
curl -X POST http://127.0.0.1:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What did the Unit 4 maintenance report find?"}'
```

### Calculator
```bash
curl -X POST http://127.0.0.1:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "23 * (4 + 2)"}'
```

### Code
```bash
curl -X POST http://127.0.0.1:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "write a python function to reverse a string", "mode": "code"}'
```

### Image query (vision model)
```bash
curl -X POST http://127.0.0.1:8000/query-image \
  -F "query=What defects do you see in this machine part?" \
  -F "file=@/path/to/your/photo.jpg"
```

## Reindex after adding new docs
```bash
curl -X POST http://127.0.0.1:8000/reindex
```

## Notes (bare-minimum scope)
- RAG store is in-memory only — it resets when the server restarts (index rebuilds
  automatically from `docs/` on startup).
- Calculator only supports basic arithmetic (+, -, *, /, %, **) via safe AST parsing.
- Orchestrator routing is a simple heuristic (`mode="auto"`): math-looking text ->
  calculator, image present -> vision model, else -> text model + RAG. Override with
  `mode`: `calculator` | `vision` | `text` | `code`.
- No authentication, persistence, or error handling beyond the basics — add these
  before using outside local development.
