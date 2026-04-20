'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: '4K Video Hosting',
    description: 'Upload and stream high-quality video content with adaptive bitrate streaming.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Global CDN',
    description: 'Fast content delivery worldwide with edge caching and optimization.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Private & Secure',
    description: 'Control who sees your content with privacy settings and access tokens.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Analytics',
    description: 'Track views, engagement, and performance metrics for your content.',
  },
]

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/5 via-transparent to-transparent" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--color-accent)]/10 rounded-full blur-[120px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                <span className="text-sm text-[var(--color-text-secondary)]">
                  Self-hosted video platform
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[var(--font-display)] tracking-tight mb-6">
                Stream your content,{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] bg-clip-text text-transparent">
                    your way
                  </span>
                  <div className="absolute -inset-1 bg-[var(--color-accent)]/20 rounded-lg blur-lg" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
                A beautiful, self-hosted video platform for creators and teams.
                Upload, transcode, and stream with cinematic quality.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="group">
                    Get Started Free
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-20 relative animate-fade-in stagger-2">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-transparent to-transparent z-10 pointer-events-none" />
              <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl shadow-black/50 bg-[var(--color-bg-card)]">
                <div className="h-1 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-hover)] to-[var(--color-accent)]" />
                <div className="aspect-video bg-[var(--color-bg-secondary)] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-[var(--color-accent)]/20 transition-colors group">
                      <svg className="w-8 h-8 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">Your video content will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] mb-4">
                Everything you need to stream
              </h2>
              <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Powerful features built for creators who want control over their video content.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Card
                  key={feature.title}
                  variant="bordered"
                  className={`animate-fade-in stagger-${i + 1}`}
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--color-border-subtle)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] mb-6">
              Ready to get started?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-xl mx-auto">
              Join thousands of creators who trust StreamFlow for their video hosting needs.
            </p>
            <Link href="/register">
              <Button size="lg" className="animate-pulse-glow">
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--color-accent)] rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="font-semibold">StreamFlow</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Self-hosted video platform. Your content, your control.
          </p>
        </div>
      </footer>
    </div>
  )
}
