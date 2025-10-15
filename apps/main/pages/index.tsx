import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // This page should only be hit if middleware fails
    // Redirect to main app
    router.push('/_apps/main')
  }, [router])
  
  return null
}
