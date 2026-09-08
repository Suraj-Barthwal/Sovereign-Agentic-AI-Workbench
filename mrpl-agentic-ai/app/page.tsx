"use client"

import { useCallback, useState } from "react"
import { Menu } from "lucide-react"

import { sendImageQuery, sendQuery } from "@/lib/api"
import type { ChatMessage, QueryMode } from "@/lib/types"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatPanel } from "@/components/chat/chat-panel"
import { SidebarContent } from "@/components/chat/sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [mode, setMode] = useState<QueryMode>("auto")
  const [sending, setSending] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleNewChat = useCallback(() => {
    setMessages([])
  }, [])

  const handleSend = useCallback(
    async (text: string, file: File | null) => {
      const userId = crypto.randomUUID()
      const assistantId = crypto.randomUUID()

      setMessages((prev) => [
        ...prev,
        {
          id: userId,
          role: "user",
          content: text,
          imageUrl: file ? URL.createObjectURL(file) : undefined,
          timestamp: Date.now(),
        },
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        },
      ])
      setSending(true)

      try {
        const response = file
          ? await sendImageQuery(text, mode === "auto" ? "vision" : mode, file)
          : await sendQuery(text, mode)

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: response.result ?? "",
                  toolUsed: response.tool_used,
                  contextSources: response.context_sources,
                }
              : m,
          ),
        )
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    err instanceof Error
                      ? `Could not reach the backend: ${err.message}`
                      : "Something went wrong. Please try again.",
                  isError: true,
                }
              : m,
          ),
        )
      } finally {
        setSending(false)
      }
    },
    [mode],
  )

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border lg:block">
        <SidebarContent mode={mode} onModeChange={setMode} onNewChat={handleNewChat} />
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0 sm:max-w-72">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent
            mode={mode}
            onModeChange={(nextMode) => {
              setMode(nextMode)
              setMobileNavOpen(false)
            }}
            onNewChat={() => {
              handleNewChat()
              setMobileNavOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
          <Button variant="ghost" size="icon-sm" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
            <Menu />
          </Button>
          <span className="font-mono text-sm font-semibold tracking-tight">MRPL Agentic AI</span>
        </header>

        <ChatPanel messages={messages} />
        <ChatInput onSend={handleSend} disabled={sending} />
      </div>
    </div>
  )
}
