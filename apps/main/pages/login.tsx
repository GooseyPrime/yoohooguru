import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'
import { OrbitronContainer, OrbitronCard } from '../components/orbitron'

// Only allow redirects to internal paths.
function getSafeRedirect(url: unknown): string {
  if (typeof url === 'string') {
    // Decode URL to catch encoded backslashes and other encoded characters
    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(url);
    } catch {
      return '/dashboard';
    }
    // Only allow internal paths: starts with single '/', not '//', no backslash, no encoded backslash
    if (
      decodedUrl.startsWith('/') &&
      !decodedUrl.startsWith('//') &&
      !decodedUrl.includes('\\') &&
      !decodedUrl.toLowerCase().includes('%5c') &&
      /^[\/a-zA-Z0-9\-_\.]*$/.test(decodedUrl)
    ) {
      return decodedUrl;
    }
  }
  return '/dashboard';
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()
  const { callbackUrl } = router.query

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        // User is already logged in, redirect to callback URL or dashboard
        const redirect = getSafeRedirect(callbackUrl)
        router.push(redirect)
      } else {
        setIsCheckingSession(false)
      }
    })
  }, [router, callbackUrl])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', {
        callbackUrl: getSafeRedirect(callbackUrl)
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <OrbitronContainer gradient="primary">
        <Head>
          <title>Checking Session... | YooHoo.Guru</title>
        </Head>
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <OrbitronCard className="max-w-md w-full text-center p-8">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin mx-auto"></div>
          </OrbitronCard>
        </main>
        <Footer />
      </OrbitronContainer>
    )
  }

  return (
    <OrbitronContainer gradient="primary">
      <Head>
        <title>Sign In | YooHoo.Guru</title>
        <meta name="description" content="Sign in to your YooHoo.Guru account to access the skill-sharing community." />
      </Head>

      <Header />

      <main className="flex-1 flex items-center justify-center p-8">
        <OrbitronCard className="max-w-md w-full text-center p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Sign in to continue your learning journey and connect with the community.
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 border-none rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 mb-4 hover:bg-gray-100 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="text-xl">🔍</span>
                Continue with Google
              </>
            )}
          </button>

          <div className="my-6 text-center text-gray-400 relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10"></div>
            <span className="bg-gray-900/50 px-4 relative">More options coming soon</span>
          </div>

          <div className="text-center mt-8 text-gray-400 text-sm">
            New to YooHoo.Guru?{' '}
            <a href="/signup" className="text-blue-400 hover:underline">Create an account</a>
            <br />
            <br />
            <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a> • <a href="/terms" className="text-blue-400 hover:underline">Terms of Service</a>
          </div>
        </OrbitronCard>
      </main>

      <Footer />
    </OrbitronContainer>
  )
}