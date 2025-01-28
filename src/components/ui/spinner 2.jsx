import { cn } from "@/lib/utils"

const Spinner = ({ className, size = "default", ...props }) => {
  const sizeClasses = {
    default: "h-8 w-8",
    sm: "h-4 w-4",
    lg: "h-12 w-12",
  }

  return (
    <div
      className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="w-full h-full"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

Spinner.displayName = "Spinner"

export { Spinner } 