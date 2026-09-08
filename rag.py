"""
Bare-minimum in-memory RAG pipeline.
Loads .txt files from the docs/ folder, embeds them with nomic-embed-text,
and retrieves the most relevant chunks for a given query via cosine similarity.
"""

import os
import numpy as np
import ollama

EMBED_MODEL = "nomic-embed-text"
DOCS_DIR = os.path.join(os.path.dirname(__file__), "docs")

# In-memory store: list of {"text": ..., "embedding": np.array}
_STORE = []


def _chunk_text(text, chunk_size=500, overlap=50):
    """Very simple fixed-size character chunker."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return [c.strip() for c in chunks if c.strip()]


def _embed(text: str):
    resp = ollama.embeddings(model=EMBED_MODEL, prompt=text)
    return np.array(resp["embedding"], dtype=np.float32)


def build_index():
    """Read all .txt files in docs/, chunk + embed them, store in memory."""
    _STORE.clear()
    if not os.path.isdir(DOCS_DIR):
        return 0

    for fname in os.listdir(DOCS_DIR):
        if not fname.lower().endswith(".txt"):
            continue
        path = os.path.join(DOCS_DIR, fname)
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        for chunk in _chunk_text(content):
            emb = _embed(chunk)
            _STORE.append({"text": chunk, "source": fname, "embedding": emb})

    return len(_STORE)


def _cosine_sim(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8))


def retrieve(query: str, top_k: int = 3):
    """Return the top_k most relevant chunks for the query."""
    if not _STORE:
        return []

    q_emb = _embed(query)
    scored = [
        (item["text"], item["source"], _cosine_sim(q_emb, item["embedding"]))
        for item in _STORE
    ]
    scored.sort(key=lambda x: x[2], reverse=True)
    return scored[:top_k]
