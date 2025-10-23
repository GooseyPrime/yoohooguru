import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'
import { OrbitronContainer, OrbitronCard } from '../components/orbitron'

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()
  const { callbackUrl } = router.query

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        // User is already logged in, redirect to callback URL or dashboard
        const redirect = (callbackUrl as string) || '/dashboard'
        router.push(redirect)
      } else {
        setIsCheckingSession(false)
      }
    })
  }, [router, callbackUrl])

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signIn('google', {
        callbackUrl: (callbackUrl as string) || '/dashboard'
      })
    } catch (error) {
      console.error('Sign up error:', error)
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
        <title>Join YooHoo.Guru | Start Your Learning Journey</title>
        <meta name="description" content="Join YooHoo.Guru to share skills, learn from experts, and build meaningful connections in your community." />
      </Head>

      <Header />

      <main className="flex-1 flex items-center justify-center p-8">
        <OrbitronCard className="max-w-md w-full text-center p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join the Community</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Start your journey of skill sharing and continuous learning with YooHoo.Guru.
          </p>

          <div className="text-left my-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 font-bold">✓</span>
              Access to skill-sharing marketplace
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 font-bold">✓</span>
              Connect with local experts and learners
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 font-bold">✓</span>
              Discover your purpose through teaching
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 font-bold">✓</span>
              Create positive community impact
            </div>
          </div>

          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 mb-4 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="text-xl">🔍</span>
                Get Started with Google
              </>
            )}
          </button>

          <div className="my-6 text-center text-gray-400 relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10"></div>
            <span className="bg-gray-900/50 px-4 relative">More options coming soon</span>
          </div>

          <div className="text-center mt-8 text-gray-400 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:underline">Sign in</a>
            <br />
            <br />
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-blue-400 hover:underline">Terms of Service</a> and{' '}
            <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>
          </div>
        </OrbitronCard>
      </main>

      <Footer />
    </OrbitronContainer>
  )
}