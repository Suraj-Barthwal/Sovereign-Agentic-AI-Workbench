Sovereign Agentic AI Workbench 🛡️🤖A secure, on-premise Agentic AI workbench designed for enterprise automation. It combines local LLMs, RAG, OCR, vision, code execution, verification, and document generation entirely offline—keeping sensitive data safely off external AI services.🚀 Key Features100% On-Premise & Secure: Zero data leakage to external cloud APIs.Intelligent Request Routing: Automatically routes text, math, code, or image queries to the optimal local model.Document RAG: Indexes enterprise reports and notes instantly for context-aware answers.Multimodal Vision & OCR: Extracts text and analyzes machine parts, schematics, or scanned reports.Sandboxed Code & Calculator Execution: Safely executes arithmetic and generates Python code on demand.🧠 Local Model Stack (via Ollama)CapabilityModelPurposeGeneral Text & Reasoningqwen2.5:7bCore enterprise reasoning and text generationVision & OCRqwen2.5vl:3bImage analysis, scanned documents, and machine photosCode Generationqwen2.5-coder:14bWriting, debugging, and explaining code snippetsEmbeddings (RAG)nomic-embed-textDocument vectorization and semantic search⚙️ Quick SetupClone the repository:Bashgit clone https://github.com/Suraj-Barthwal/Sovereign-Agentic-AI-Workbench.git
cd Sovereign-Agentic-AI-Workbench
Install dependencies:Bashpip install -r requirements.txt
Ensure Ollama is running:Bashollama serve
(Run this in a separate terminal if it is not already running as a service).Launch the application:Bashuvicorn main:app --reload
🔌 API Endpoints & Usage1. Health CheckVerify the service is up and running:Bashcurl http://127.0.0.1:8000/health
2. Smart Query (Auto-Routing)Automatically handles text reasoning, arithmetic, or RAG-based document lookups:Bashcurl -X POST http://127.0.0.1:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What did the Unit 4 maintenance report find?"}'
3. Safe CalculatorEvaluates arithmetic expressions safely using AST parsing:Bashcurl -X POST http://127.0.0.1:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "23 * (4 + 2)"}'
4. Code GenerationExplicitly request code generation tasks:Bashcurl -X POST http://127.0.0.1:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "write a python function to reverse a string", "mode": "code"}'
5. Vision QueryAnalyze machine photos or diagrams using the local vision model:Bashcurl -X POST http://127.0.0.1:8000/query-image \
  -F "query=What defects do you see in this machine part?" \
  -F "file=@/path/to/your/photo.jpg"
6. Document ReindexingThe RAG index builds automatically on startup from .txt files inside the docs/ folder. Add your files and trigger a refresh with:Bashcurl -X POST http://127.0.0.1:8000/reindex
🛠️ Project ArchitecturePlaintextSovereign-Agentic-AI-Workbench/
│
├── docs/                # Drop enterprise notes & reports (.txt) here for RAG
├── mrpl-agentic-ai/     # Core application modules
├── main.py              # FastAPI entry point
├── orchestrator.py      # Heuristic routing logic (auto/mode selection)
├── rag.py               # In-memory retrieval engine
├── tools.py             # Calculator & execution handlers
└── requirements.txt     # Python dependencies
📌 Development NotesIn-Memory RAG: The vector store is currently in-memory and resets upon server restart (automatically rebuilding from docs/ on launch).Routing Heuristics: The orchestrator uses mode="auto" by default—math expressions map to the calculator, image uploads route to the vision model, and general inquiries utilize text reasoning + RAG. You can explicitly override this via the mode parameter (calculator, vision, text, code).📄 LicenseDistributed under the MIT License. See LICENSE for more information.
