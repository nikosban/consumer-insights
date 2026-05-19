import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border-0 bg-[#FDFDFD] px-2.5 py-1 text-base text-[#707070] outline-none transition-shadow file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#B8B8B8] shadow-[var(--field-shadow)] focus-visible:shadow-[var(--field-shadow-focus)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
