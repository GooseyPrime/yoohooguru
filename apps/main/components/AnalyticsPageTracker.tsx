import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAnalytics } from './useAnalytics'

export const AnalyticsPageTracker = () => {
  const router = useRouter()
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    
    // Track the initial page load
    trackPageView(router.asPath)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, router.asPath, trackPageView])

  return null
}

export default AnalyticsPageTracker