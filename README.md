
# Sovereign Agentic AI Workbench 🛡️🤖

A secure, on-premise Agentic AI workbench designed for enterprise automation. It combines local LLMs, RAG, OCR, vision, code execution, verification, and document generation entirely offline—keeping sensitive data safely off external AI services.

---

## 🚀 Key Features

* **100% On-Premise & Secure:** Zero data leakage to external cloud APIs.
* **Intelligent Request Routing:** Automatically routes text, math, code, or image queries to the optimal local model.
* **Document RAG:** Indexes enterprise reports and notes instantly for context-aware answers.
* **Multimodal Vision & OCR:** Extracts text and analyzes machine parts, schematics, or scanned reports.
* **Sandboxed Code & Calculator Execution:** Safely executes arithmetic and generates Python code on demand.

---

## 🧠 Local Model Stack (via Ollama)

| Capability | Model | Purpose |
| :--- | :--- | :--- |
| **General Text & Reasoning** | `qwen2.5:7b` | Core enterprise reasoning and text generation |
| **Vision & OCR** | `qwen2.5vl:3b` | Image analysis, scanned documents, and machine photos |
| **Code Generation** | `qwen2.5-coder:14b` | Writing, debugging, and explaining code snippets |
| **Embeddings (RAG)** | `nomic-embed-text` | Document vectorization and semantic search |

---

## ⚙️ Quick Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Suraj-Barthwal/Sovereign-Agentic-AI-Workbench.git](https://github.com/Suraj-Barthwal/Sovereign-Agentic-AI-Workbench.git)
   cd Sovereign-Agentic-AI-Workbench

```

2. **Install dependencies:**
```bash
pip install -r requirements.txt

```


3. **Ensure Ollama is running:**
```bash
ollama serve

```


*(Run this in a separate terminal if it is not already running as a service).*
4. **Launch the application:**
```bash
uvicorn main:app --reload

```



---

## 🔌 API Endpoints & Usage

### 1. Health Check

Verify the service is up and running:

```bash
curl [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

```

### 2. Smart Query (Auto-Routing)

Automatically handles text reasoning, arithmetic, or RAG-based document lookups:

```bash
curl -X POST [http://127.0.0.1:8000/query](http://127.0.0.1:8000/query) \
  -H "Content-Type: application/json" \
  -d '{"query": "What did the Unit 4 maintenance report find?"}'

```

### 3. Safe Calculator

Evaluates arithmetic expressions safely using AST parsing:

```bash
curl -X POST [http://127.0.0.1:8000/query](http://127.0.0.1:8000/query) \
  -H "Content-Type: application/json" \
  -d '{"query": "23 * (4 + 2)"}'

```

### 4. Code Generation

Explicitly request code generation tasks:

```bash
curl -X POST [http://127.0.0.1:8000/query](http://127.0.0.1:8000/query) \
  -H "Content-Type: application/json" \
  -d '{"query": "write a python function to reverse a string", "mode": "code"}'

```

### 5. Vision Query

Analyze machine photos or diagrams using the local vision model:

```bash
curl -X POST [http://127.0.0.1:8000/query-image](http://127.0.0.1:8000/query-image) \
  -F "query=What defects do you see in this machine part?" \
  -F "file=@/path/to/your/photo.jpg"

```

### 6. Document Reindexing

The RAG index builds automatically on startup from `.txt` files inside the `docs/` folder. Add your files and trigger a refresh with:

```bash
curl -X POST [http://127.0.0.1:8000/reindex](http://127.0.0.1:8000/reindex)

```

---

## 🛠️ Project Architecture

```text
Sovereign-Agentic-AI-Workbench/
│
├── docs/                # Drop enterprise notes & reports (.txt) here for RAG
├── mrpl-agentic-ai/     # Core application modules
├── main.py              # FastAPI entry point
├── orchestrator.py      # Heuristic routing logic (auto/mode selection)
├── rag.py               # In-memory retrieval engine
├── tools.py             # Calculator & execution handlers
└── requirements.txt     # Python dependencies

```

---

## 📌 Development Notes

* **In-Memory RAG:** The vector store is currently in-memory and resets upon server restart (automatically rebuilding from `docs/` on launch).
* **Routing Heuristics:** The orchestrator uses `mode="auto"` by default—math expressions map to the calculator, image uploads route to the vision model, and general inquiries utilize text reasoning + RAG. You can explicitly override this via the `mode` parameter (`calculator`, `vision`, `text`, `code`).

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

```

```
