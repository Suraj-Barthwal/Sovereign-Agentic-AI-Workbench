"""
Bare-minimum orchestrator.
Decides whether to use the calculator tool, the vision model, or
the text model + RAG context, then generates a final answer.
"""

import base64
import os
import ollama
import rag
import tools

TEXT_MODEL = "qwen2.5:7b"
VISION_MODEL = "qwen2.5vl:3b"
CODE_MODEL = "qwen2.5-coder:14b"


def encode_image_to_base64(image_path: str) -> str:
    """Reads a local image file and converts it to a Base64 encoded string."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def run(query: str, image_path: str = None, mode: str = "auto"):
    """
    query: user's text question
    image_path: optional path to an image file
    mode: 'auto' | 'calculator' | 'vision' | 'code' | 'text'
    """

    # 1. Explicit tool override or auto math detection
    if mode == "calculator" or (mode == "auto" and tools.looks_like_math(query)):
        return {"tool_used": "calculator", "result": tools.calculate(query)}

    # 2. Vision path — triggered if an image path is provided
    if image_path and os.path.exists(image_path):
        base64_image = encode_image_to_base64(image_path)
        
        response = ollama.chat(
            model=VISION_MODEL,
            messages=[{
                "role": "user",
                "content": query or "Describe what you see in this image in detail.",
                "images": [base64_image],
            }],
        )
        return {"tool_used": "vision_model", "result": response["message"]["content"]}

    # 3. Code path
    if mode == "code":
        response = ollama.chat(
            model=CODE_MODEL,
            messages=[{"role": "user", "content": query}],
        )
        return {"tool_used": "code_model", "result": response["message"]["content"]}

    # 4. Default: text model + RAG context
    retrieved = rag.retrieve(query, top_k=3)
    context = "\n\n".join([f"[{src}] {text}" for text, src, score in retrieved])

    prompt = query
    if context:
        prompt = (
            f"Use the following context if relevant to answer the question.\n\n"
            f"Context:\n{context}\n\nQuestion: {query}"
        )

    response = ollama.chat(
        model=TEXT_MODEL,
        messages=[{"role": "user", "content": prompt}],
    )
    return {
        "tool_used": "text_model_rag",
        "context_sources": [src for _, src, _ in retrieved],
        "result": response["message"]["content"],
    }