export function LoadingDots() {
  return (
    <div className="flex items-center space-x-1">
      <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-bounce"></span>
      <span
        className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></span>
      <span
        className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></span>
    </div>
  )
}
