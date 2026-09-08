"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import {
  Calculator,
  Code2,
  Eye,
  FileText,
  Plus,
  RefreshCw,
  Sparkles,
  Wrench,
} from "lucide-react"

import { checkHealth, reindexDocs } from "@/lib/api"
import { MODES, type QueryMode } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const MODE_ICONS: Record<QueryMode, typeof Sparkles> = {
  auto: Sparkles,
  calculator: Calculator,
  text: FileText,
  code: Code2,
  vision: Eye,
}

interface SidebarProps {
  mode: QueryMode
  onModeChange: (mode: QueryMode) => void
  onNewChat: () => void
}

export function SidebarContent({ mode, onModeChange, onNewChat }: SidebarProps) {
  const [reindexing, setReindexing] = useState(false)
  const { data: connected } = useSWR("mrpl-health", checkHealth, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
  })

  async function handleReindex() {
    setReindexing(true)
    try {
      const res = await reindexDocs()
      const count = res.chunks_indexed ?? res.chunks ?? res.count
      toast.success(
        typeof count === "number"
          ? `Reindexed ${count} chunk${count === 1 ? "" : "s"}`
          : "Reindex complete",
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reindex failed")
    } finally {
      setReindexing(false)
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wrench className="size-5" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-mono text-sm font-semibold tracking-tight">MRPL Agentic AI</span>
          <span className="truncate text-xs text-sidebar-foreground/50">Plant Assistant Console</span>
        </div>
      </div>

      <div className="px-4">
        <Button onClick={onNewChat} variant="secondary" className="w-full justify-start gap-2">
          <Plus data-icon="inline-start" />
          New Chat
        </Button>
      </div>

      <Separator className="my-4 bg-sidebar-border" />

      <div className="flex flex-col gap-2 px-4">
        <span className="px-1 font-mono text-[11px] font-medium tracking-wider text-sidebar-foreground/40 uppercase">
          Mode
        </span>
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            if (value) onModeChange(value as QueryMode)
          }}
          orientation="vertical"
          variant="outline"
          spacing={2}
          className="w-full"
        >
          {MODES.map((m) => {
            const Icon = MODE_ICONS[m.value]
            return (
              <Tooltip key={m.value}>
                <TooltipTrigger
                  render={
                    <ToggleGroupItem
                      value={m.value}
                      className={cn(
                        "w-full justify-start gap-2.5 border-sidebar-border text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        "data-[pressed]:border-primary/40 data-[pressed]:bg-primary/15 data-[pressed]:text-primary",
                      )}
                    />
                  }
                >
                  <Icon data-icon="inline-start" />
                  {m.label}
                </TooltipTrigger>
                <TooltipContent side="right">{m.description}</TooltipContent>
              </Tooltip>
            )
          })}
        </ToggleGroup>
      </div>

      <div className="mt-auto flex flex-col gap-3 px-4 pb-5">
        <Separator className="bg-sidebar-border" />

        <Button
          variant="outline"
          onClick={handleReindex}
          disabled={reindexing}
          className="w-full justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {reindexing ? <Spinner data-icon="inline-start" /> : <RefreshCw data-icon="inline-start" />}
          Reindex Documents
        </Button>

        <div className="flex items-center gap-2.5 rounded-lg border border-sidebar-border px-3 py-2.5">
          <span className="relative flex size-2 shrink-0">
            <span
              className={cn(
                "absolute inline-flex size-full rounded-full opacity-75",
                connected ? "animate-ping bg-emerald-500" : "bg-transparent",
              )}
            />
            <span
              className={cn(
                "relative inline-flex size-2 rounded-full",
                connected === undefined ? "bg-muted-foreground" : connected ? "bg-emerald-500" : "bg-destructive",
              )}
            />
          </span>
          <span className="font-mono text-xs text-sidebar-foreground/70">
            {connected === undefined ? "Checking backend..." : connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
    </div>
  )
}
