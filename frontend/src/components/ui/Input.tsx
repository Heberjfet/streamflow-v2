import { InputHTMLAttributes, forwardRef, useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  showPasswordToggle?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, showPasswordToggle, id, type, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

    return (
      <div className="flex flex-col gap-1.5 relative group">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm font-medium transition-all duration-300 ${
              error
                ? 'text-red-500'
                : isFocused
                ? 'text-purple-500'
                : 'text-zinc-400'
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                isFocused ? 'text-purple-500' : 'text-zinc-500'
              }`}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-zinc-900
              border-2 transition-all duration-300
              text-white
              placeholder:text-zinc-500
              focus:outline-none
              [&:-webkit-autofill]:[-webkit-text-fill-color:white]
              [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(24_24_27)]
              [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_rgb(24_24_27)]
              [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_rgb(24_24_27)]
              [&:-webkit-autofill]:[transition:background-color_9999s_ease-out_0s]
              ${icon ? 'pl-11' : ''}
              ${showPasswordToggle ? 'pr-11' : ''}
              ${
                isFocused && !error
                  ? 'border-purple-500 shadow-lg shadow-purple-500/30 focus:ring-4 focus:ring-purple-500/20'
                  : error
                  ? 'border-red-500 shadow-lg shadow-red-500/20 focus:ring-4 focus:ring-red-500/20 animate-shake'
                  : 'border-zinc-700 hover:border-zinc-600'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />

          {showPasswordToggle && isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-purple-500 transition-all duration-300 hover:scale-110"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          )}

          {!showPasswordToggle && error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          {!showPasswordToggle && !error && isFocused && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
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