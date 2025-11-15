import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import AnalyticsPageTracker from '../components/AnalyticsPageTracker'
import CookieConsent from '../components/CookieConsent'
import ErrorBoundary from '../components/ErrorBoundary'
import SkipToContent from '../components/SkipToContent'
import '../styles/globals.css'
import '../styles/accessibility.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ErrorBoundary>
        <SkipToContent />
        <Component {...pageProps} />
        <AnalyticsPageTracker />
        <Analytics />
        <SpeedInsights />
        <CookieConsent />
      </ErrorBoundary>
    </SessionProvider>
  )
}
