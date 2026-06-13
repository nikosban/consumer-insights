import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Button — flat compound variant API.
 *
 * Hierarchy (filled vs outlined vs flat):
 *   primary   — filled, raised. One per view. Default = brand blue.
 *   secondary — outlined, raised. Supporting actions. Default = neutral.
 *   ghost     — transparent, flat. Tertiary/toolbar. Default = neutral.
 *   link      — inline, no padding. Navigational. Default = brand.
 *
 * Intent (semantic color, changes within each hierarchy):
 *   primary-neutral  primary-danger  primary-success
 *   secondary-brand  secondary-danger  secondary-success
 *   ghost-brand      ghost-danger      ghost-success
 *   link-neutral     link-danger       link-success
 *
 * Legacy aliases (backward compat):
 *   default     → primary (brand)
 *   outline     → secondary (neutral)
 *   destructive → secondary-danger
 *
 * Elevation:
 *   primary + secondary use raised-control shadows (Elevation.md three-layer system).
 *   ghost + link are flat — no shadow.
 */

// ─── Elevation classes (CSS vars defined in index.css) ────────────────────────
const DR  = "shadow-[var(--btn-raised-dark-rest)]"
const DH  = "hover:shadow-[var(--btn-raised-dark-hover)]"
const LR  = "shadow-[var(--btn-raised-light-rest)]"
const LH  = "hover:shadow-[var(--btn-raised-light-hover)]"
const ACT = "active:shadow-[var(--btn-raised-active)] active:translate-y-0"
const UP  = "hover:-translate-y-px"

// ─── Variant class blocks ─────────────────────────────────────────────────────

// Primary — filled, raised
const pBase   = [ACT, UP].join(" ")
const pDark   = [DR, DH, "hover:brightness-110 active:brightness-95"].join(" ")
const pLight  = [LR, LH, "hover:bg-muted"].join(" ")

const vPrimary        = `bg-[image:var(--btn-primary-bg)] bg-clip-border text-primary-foreground border-[#0C41DF] ${pBase} ${pDark} focus-visible:ring-ring/50`
const vPrimaryNeutral = `bg-foreground text-background border-foreground ${pBase} ${pDark}`
const vPrimaryDanger  = `bg-destructive text-white border-destructive/80 ${pBase} ${pDark} hover:brightness-110 active:brightness-90 focus-visible:ring-destructive/50`
const vPrimarySuccess = `bg-emerald-600 text-white border-emerald-700 ${pBase} ${pDark} hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500/50`

// Secondary — outlined white, raised; text/border adapts to intent
const sBase = [ACT, UP, LR, LH].join(" ")

const vSecondary        = `bg-background text-foreground border-border ${sBase} hover:bg-muted`
const vSecondaryBrand   = `bg-background text-primary border-border hover:border-primary/30 ${sBase} hover:bg-primary/5 focus-visible:ring-ring/50`
const vSecondaryDanger  = `bg-background text-destructive border-destructive/25 hover:border-destructive/40 ${sBase} hover:bg-destructive/5 focus-visible:ring-destructive/50`
const vSecondarySuccess = `bg-background text-emerald-700 border-emerald-500/30 hover:border-emerald-500/50 ${sBase} hover:bg-emerald-50 focus-visible:ring-emerald-500/50`

// Ghost — transparent, flat; no shadow, no border
const vGhost        = "bg-transparent text-foreground  border-transparent hover:bg-accent           active:bg-accent/70"
const vGhostBrand   = "bg-transparent text-primary     border-transparent hover:bg-primary/8        active:bg-primary/12     focus-visible:ring-ring/50"
const vGhostDanger  = "bg-transparent text-destructive border-transparent hover:bg-destructive/8    active:bg-destructive/12 focus-visible:ring-destructive/50"
const vGhostSuccess = "bg-transparent text-emerald-700 border-transparent hover:bg-emerald-50       active:bg-emerald-100    focus-visible:ring-emerald-500/50"

// Link — inline, no fixed height, no padding, no shadow
const lBase = "border-transparent h-auto px-0 font-normal underline-offset-4 hover:underline"
const vLink        = `${lBase} text-primary   focus-visible:ring-ring/50`
const vLinkNeutral = `${lBase} text-foreground`
const vLinkDanger  = `${lBase} text-destructive focus-visible:ring-destructive/50`
const vLinkSuccess = `${lBase} text-emerald-700 focus-visible:ring-emerald-500/50`

// ─── CVA ──────────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-clip-padding",
    "text-sm font-medium whitespace-nowrap select-none cursor-pointer",
    "transition-all duration-150 outline-none",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.25cap]",
  ].join(" "),
  {
    variants: {
      variant: {
        // ── Primary (filled, raised) ──
        primary:          vPrimary,
        "primary-neutral": vPrimaryNeutral,
        "primary-danger":  vPrimaryDanger,
        "primary-success": vPrimarySuccess,
        // ── Secondary (outlined, raised) ──
        secondary:          vSecondary,
        "secondary-brand":  vSecondaryBrand,
        "secondary-danger": vSecondaryDanger,
        "secondary-success": vSecondarySuccess,
        // ── Ghost (transparent, flat) ──
        ghost:          vGhost,
        "ghost-brand":  vGhostBrand,
        "ghost-danger": vGhostDanger,
        "ghost-success": vGhostSuccess,
        // ── Link (inline) ──
        link:          vLink,
        "link-neutral": vLinkNeutral,
        "link-danger":  vLinkDanger,
        "link-success": vLinkSuccess,
        // ── Legacy aliases ──
        default:     vPrimary,
        outline:     vSecondary,
        destructive: vSecondaryDanger,
      },
      size: {
        // Optical icon alignment: leading icon → reduce left padding; trailing → reduce right.
        // Detected automatically via CSS :has(>svg:first-child / :last-child) — no data-attrs needed.
        default:
          "h-8 gap-1.5 px-3 has-[>svg:first-child]:pl-2.5 has-[>svg:last-child]:pr-2.5",
        toolbar:
          "h-8 gap-1.5 px-3 text-xs has-[>svg:first-child]:pl-2.5 has-[>svg:last-child]:pr-2.5",
        xs:
          "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs has-[>svg:first-child]:pl-1.5 has-[>svg:last-child]:pr-1.5",
        sm:
          "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-[>svg:first-child]:pl-2 has-[>svg:last-child]:pr-2",
        lg:
          "h-9 gap-2 px-3.5 has-[>svg:first-child]:pl-3 has-[>svg:last-child]:pr-3",
        icon:      "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)]",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size:    "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size    = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
