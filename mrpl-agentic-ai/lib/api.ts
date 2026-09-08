import type { QueryMode, QueryResponse, ReindexResponse } from "@/lib/types"

/**
 * Base URL for the MRPL Agentic AI FastAPI backend.
 * Override with NEXT_PUBLIC_API_BASE_URL if the backend runs elsewhere.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

async function parseJsonOrThrow(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  return res.json()
}

export async function sendQuery(query: string, mode: QueryMode): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, mode }),
  })
  return parseJsonOrThrow(res)
}

export async function sendImageQuery(
  query: string,
  mode: QueryMode,
  file: File,
): Promise<QueryResponse> {
  const formData = new FormData()
  formData.append("query", query)
  formData.append("mode", mode || "vision")
  formData.append("file", file)

  const res = await fetch(`${API_BASE_URL}/query-image`, {
    method: "POST",
    body: formData,
  })
  return parseJsonOrThrow(res)
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" })
    return res.ok
  } catch {
    return false
  }
}

export async function reindexDocs(): Promise<ReindexResponse> {
  const res = await fetch(`${API_BASE_URL}/reindex`, { method: "POST" })
  return parseJsonOrThrow(res)
}
