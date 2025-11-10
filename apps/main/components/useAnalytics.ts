import { useCallback } from 'react'

declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, unknown>) => void
  }
}

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export const useAnalytics = () => {
  const trackEvent = useCallback(({ action, category, label, value }: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }, [])

  const trackPageView = useCallback((url: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_title: title || document.title,
        page_location: url,
      })
    }
  }, [])

  const trackUserSignup = useCallback((method: string) => {
    trackEvent({
      action: 'sign_up',
      category: 'engagement',
      label: method,
    })
  }, [trackEvent])

  const trackUserLogin = useCallback((method: string) => {
    trackEvent({
      action: 'login',
      category: 'engagement',
      label: method,
    })
  }, [trackEvent])

  const trackSessionBooking = useCallback((guruType: string, sessionType: string) => {
    trackEvent({
      action: 'book_session',
      category: 'conversion',
      label: `${guruType}_${sessionType}`,
    })
  }, [trackEvent])

  const trackSearchQuery = useCallback((query: string, category: string) => {
    trackEvent({
      action: 'search',
      category: 'engagement',
      label: `${category}: ${query}`,
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackUserSignup,
    trackUserLogin,
    trackSessionBooking,
    trackSearchQuery,
  }
}

export default useAnalytics