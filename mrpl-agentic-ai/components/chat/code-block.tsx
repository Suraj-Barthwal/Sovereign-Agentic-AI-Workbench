"use client"

import { highlight } from "sugar-high"
import { cn } from "@/lib/utils"

export function CodeBlock({ code, language, className }: { code: string; language?: string; className?: string }) {
  const html = highlight(code)

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/60 bg-[#0b0e14]", className)}>
      {language ? (
        <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5">
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-white/40">
            {language}
          </span>
        </div>
      ) : null}
      <pre className="scrollbar-thin overflow-x-auto p-3 font-mono text-[13px] leading-relaxed text-white/90">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}
