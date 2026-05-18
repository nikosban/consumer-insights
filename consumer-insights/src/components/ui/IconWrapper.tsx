import { cn } from '@/lib/utils'

// Icon sizing rule — cap-height alignment for optical balance with text.
// Open Sans cap height ratio ≈ 0.72 of the font-size em.
//   body text    14px → cap ≈ 10px → icon glyph 12px (nearest even pixel-grid step)
//   support text 12px → cap ≈  9px → icon glyph 10px
//
// Usage:
//   <IconWrapper><Home size={ICON_SIZES.body} /></IconWrapper>
//   <IconWrapper size="support"><Info size={ICON_SIZES.support} /></IconWrapper>

export const ICON_SIZES = { body: 12, support: 10 } as const
export type IconSizeKey = keyof typeof ICON_SIZES

type IconWrapperProps = {
  children: React.ReactNode
  size?: IconSizeKey
  className?: string
}

export function IconWrapper({ children, size = 'body', className }: IconWrapperProps) {
  const px = ICON_SIZES[size]
  return (
    <span
      style={{ width: px, height: px }}
      className={cn('inline-flex items-center justify-center shrink-0 select-none', className)}
    >
      {children}
    </span>
  )
}
