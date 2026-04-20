import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered'
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--color-bg-card)]',
      elevated: 'bg-[var(--color-bg-elevated)] shadow-xl shadow-black/20',
      bordered: 'bg-[var(--color-bg-card)] border border-[var(--color-border)]',
    }

    return (
      <div
        ref={ref}
        className={`
          rounded-xl overflow-hidden
          ${variants[variant]}
          ${hover ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30 cursor-pointer' : ''}
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
      className={`px-5 py-4 border-b border-[var(--color-border-subtle)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-5 py-4 border-t border-[var(--color-border-subtle)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'
