import { Wrench } from "lucide-react"

import type { ChatMessage } from "@/lib/types"
import { Attachment, AttachmentMedia } from "@/components/ui/attachment"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent, MessageFooter, MessageHeader } from "@/components/ui/message"
import { RichText } from "@/components/chat/rich-text"
import { TypingIndicator } from "@/components/chat/typing-indicator"

function formatToolName(tool: string) {
  return tool
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <Message align={isUser ? "end" : "start"}>
      <MessageContent>
        {!isUser && message.toolUsed ? (
          <MessageHeader>
            <Badge variant="outline" className="gap-1 border-accent/30 font-mono text-[10px] tracking-wide text-accent uppercase">
              <Wrench data-icon="inline-start" />
              {formatToolName(message.toolUsed)}
            </Badge>
          </MessageHeader>
        ) : null}

        {message.imageUrl ? (
          <Attachment orientation="vertical" size="sm" className="w-32">
            <AttachmentMedia variant="image">
              <img src={message.imageUrl || "/placeholder.svg"} alt="Uploaded attachment" crossOrigin="anonymous" />
            </AttachmentMedia>
          </Attachment>
        ) : null}

        <Bubble
          align={isUser ? "end" : "start"}
          variant={message.isError ? "destructive" : isUser ? "default" : "secondary"}
        >
          <BubbleContent>
            {message.content === "" ? (
              <TypingIndicator />
            ) : isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <RichText text={message.content} />
            )}
          </BubbleContent>
        </Bubble>

        {!isUser && message.contextSources && message.contextSources.length > 0 ? (
          <MessageFooter className="flex-wrap gap-1.5">
            {message.contextSources.map((source, i) => (
              <Badge key={`${source}-${i}`} variant="outline" className="font-mono text-[10px]">
                Source: {source}
              </Badge>
            ))}
          </MessageFooter>
        ) : null}
      </MessageContent>
    </Message>
  )
}
