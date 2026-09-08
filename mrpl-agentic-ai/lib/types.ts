export type QueryMode = "auto" | "calculator" | "text" | "code" | "vision"

export interface QueryResponse {
  result: string
  tool_used?: string
  context_sources?: string[]
}

export interface ReindexResponse {
  chunks_indexed?: number
  chunks?: number
  count?: number
  [key: string]: unknown
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  imageUrl?: string
  toolUsed?: string
  contextSources?: string[]
  isError?: boolean
  timestamp: number
}

export const MODES: { value: QueryMode; label: string; description: string }[] = [
  { value: "auto", label: "Auto", description: "Automatically route to the best tool" },
  { value: "calculator", label: "Calculator", description: "Numeric and formula evaluation" },
  { value: "text", label: "Text", description: "Document and knowledge-base RAG" },
  { value: "code", label: "Code", description: "Code generation and analysis" },
  { value: "vision", label: "Vision", description: "Image inspection and analysis" },
]
