import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'StreamFlow - Self-hosted Video Platform',
  description: 'A beautiful, self-hosted video platform for creators and teams.',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%237c5cff" rx="20" width="100" height="100"/><polygon fill="white" points="40,25 40,75 75,50"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className="min-h-screen bg-[var(--background)]">
        {children}
      </body>
    </html>
  )
}
