import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import AnalyticsPageTracker from '../components/AnalyticsPageTracker'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <AnalyticsPageTracker />
      <Analytics />
      <SpeedInsights />
    </SessionProvider>
  )
}
