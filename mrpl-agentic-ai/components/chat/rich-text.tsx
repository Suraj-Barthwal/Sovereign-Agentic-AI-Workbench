import type * as React from "react"

import { CodeBlock } from "@/components/chat/code-block"

const FENCE_RE = /```(\w*)\n?([\s\S]*?)```/g

/**
 * Renders assistant/user text, extracting fenced ```code``` blocks into
 * syntax-highlighted CodeBlock components and leaving the rest as plain text.
 */
export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  FENCE_RE.lastIndex = 0
  while ((match = FENCE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index).trim()
      if (plain) parts.push(<p key={key++}>{plain}</p>)
    }
    const [, lang, code] = match
    parts.push(<CodeBlock key={key++} code={code.trim()} language={lang || undefined} />)
    lastIndex = match.index + match[0].length
  }

  const rest = text.slice(lastIndex).trim()
  if (rest) parts.push(<p key={key++}>{rest}</p>)

  if (parts.length === 0) return <p>{text}</p>

  return <div className="flex flex-col gap-2">{parts}</div>
}
