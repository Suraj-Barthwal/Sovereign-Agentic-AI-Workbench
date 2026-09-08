export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1" role="status" aria-label="Assistant is responding">
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current" />
    </div>
  )
}
