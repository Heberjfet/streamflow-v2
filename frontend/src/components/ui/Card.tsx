import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass'
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--color-bg-card)]',
      elevated: 'bg-[var(--color-bg-elevated)] shadow-xl shadow-black/30',
      bordered: 'bg-[var(--color-bg-card)] border-2 border-[var(--color-border)]',
      glass: 'glass bg-[var(--color-bg-card)]/80 backdrop-blur-xl',
    }

    return (
      <div
        ref={ref}
        className={`
          rounded-2xl overflow-hidden
          ${variants[variant]}
          ${hover ? 'transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 cursor-pointer group' : ''}
          transition-all duration-300
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-5 border-b border-[var(--color-border)]/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`px-6 py-6 ${className}`} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-t border-[var(--color-border)]/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'
