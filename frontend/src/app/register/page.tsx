'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function RegisterRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login?mode=register')
  }, [router])

  return null
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterRedirect />
    </Suspense>
  )
}
