"use client"

import type * as React from "react"
import { useRef, useState } from "react"
import { Paperclip, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group"

interface ChatInputProps {
  onSend: (text: string, file: File | null) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  function clearFile() {
    setFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleSubmit() {
    if (disabled) return
    const trimmed = text.trim()
    if (!trimmed && !file) return
    onSend(trimmed, file)
    setText("")
    clearFile()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const isComposing = event.nativeEvent.isComposing || event.keyCode === 229
    if (event.key === "Enter" && !event.shiftKey && !isComposing) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border bg-background px-4 py-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        {previewUrl ? (
          <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Selected attachment preview"
              className="size-8 rounded-md object-cover"
            />
            <span className="max-w-40 truncate text-xs text-muted-foreground">{file?.name}</span>
            <Button variant="ghost" size="icon-xs" onClick={clearFile} aria-label="Remove attachment">
              <X />
            </Button>
          </div>
        ) : null}

        <InputGroup>
          <InputGroupAddon align="inline-start">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <InputGroupButton
              type="button"
              size="icon-sm"
              aria-label="Attach image"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip />
            </InputGroupButton>
          </InputGroupAddon>

          <InputGroupTextarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={file ? "Describe what to look for in the image..." : "Ask MRPL Agentic AI..."}
            rows={1}
            className="max-h-32 min-h-8"
          />

          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="default"
              size="icon-sm"
              disabled={disabled || (!text.trim() && !file)}
              onClick={handleSubmit}
              aria-label="Send message"
            >
              <Send />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
