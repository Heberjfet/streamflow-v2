import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-[var(--color-bg-elevated)]
            border border-[var(--color-border)]
            text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]
            transition-all duration-200
            hover:border-[var(--color-text-muted)]
            focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
