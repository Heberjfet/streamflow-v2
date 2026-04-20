import { InputHTMLAttributes, forwardRef, useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const [isFocused, setIsFocused] = useState(false)

    return (
      <div className="flex flex-col gap-1.5 relative group">
        {label && (
          <label
            htmlFor={inputId}
            className={`
              text-sm font-medium transition-all duration-300
              ${isFocused ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}
              ${error ? 'text-[var(--color-error)]' : ''}
            `}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={`
              absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300
              ${isFocused ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}
            `}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-[var(--color-bg-elevated)]
              border-2 transition-all duration-300
              text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-muted)]
              hover:border-[var(--color-text-muted)]
              focus:outline-none
              ${icon ? 'pl-11' : ''}
              ${isFocused && !error
                ? 'border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent-muted)]/30 focus:ring-4 focus:ring-[var(--color-accent)]/20'
                : error
                  ? 'border-[var(--color-error)] shadow-lg shadow-[var(--color-error)]/20 focus:ring-4 focus:ring-[var(--color-error)]/20 animate-shake'
                  : 'border-[var(--color-border)] group-hover:border-[var(--color-text-muted)]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          {error ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          ) : isFocused && !error ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            </div>
          ) : null}
        </div>
        {error && (
          <p className="text-xs text-[var(--color-error)] flex items-center gap-1.5 mt-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
