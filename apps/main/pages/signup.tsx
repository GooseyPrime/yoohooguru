import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Navigation from '../components/ui/Navigation';

export default function Signup() {
  const router = useRouter();
  const { type } = router.query;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: (type as string) || 'gunu',
    agreeToTerms: false
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API for registration
      const response = await fetch('/api/backend/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          displayName: formData.name,
          role: formData.userType,
          wantsToTeach: formData.userType === 'guru' || formData.userType === 'hero',
          wantsToLearn: formData.userType === 'gunu',
        }),
      });

      if (response.ok) {
        // Redirect to dashboard after successful registration
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
      });
    } catch (err) {
      setError('Google sign-up failed. Please try again.');
      setIsLoading(false);
    }
  };

  const userTypes = [
    {
      value: 'gunu',
      label: 'Gunu (Learner)',
      description: 'I want to learn new skills',
      icon: '🎓'
    },
    {
      value: 'guru',
      label: 'Guru (Teacher)',
      description: 'I want to share my expertise',
      icon: '👨‍🏫'
    },
    {
      value: 'angel',
      label: 'Angel (Service Provider)',
      description: 'I want to offer local services',
      icon: '🛠️'
    },
    {
      value: 'hero',
      label: 'Hero (Volunteer)',
      description: 'I want to volunteer my time',
      icon: '❤️'
    }
  ];

  return (
    <>
      <Head>
        <title>Sign Up - YooHoo.Guru</title>
        <meta name="description" content="Create your YooHoo.Guru account and start your journey" />
      </Head>

      <Navigation />

      <main className="min-h-screen py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-bold text-white mb-4">
                Create Your Account
              </h1>
              <p className="text-white-80">
                Join thousands of learners and experts on YooHoo.Guru
              </p>
            </div>

            {/* Signup Form */}
            <div className="glass-card p-8 rounded-2xl">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    I want to join as a...
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {userTypes.map((userType) => (
                      <label
                        key={userType.value}
                        className={`cursor-pointer glass-effect p-4 rounded-xl transition-all duration-300 ${
                          formData.userType === userType.value
                            ? 'border-2 border-emerald-500 bg-emerald-500/10'
                            : 'border border-white-10 hover:border-emerald-500/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="userType"
                          value={userType.value}
                          checked={formData.userType === userType.value}
                          onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                          className="sr-only"
                        />
                        <div className="text-3xl mb-2">{userType.icon}</div>
                        <div className="text-sm font-semibold text-white mb-1">{userType.label}</div>
                        <div className="text-xs text-white-60">{userType.description}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-premium w-full"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-premium w-full"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-premium w-full"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <p className="mt-1 text-xs text-white-60">Must be at least 8 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-premium w-full"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Terms Agreement */}
                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="w-4 h-4 mt-1 rounded border-white-20 bg-white-10 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                      required
                    />
                    <span className="text-sm text-white-80">
                      I agree to the{' '}
                      <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full divider-gradient" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-primarydark text-white-60">Or sign up with</span>
                </div>
              </div>

              {/* Social Signup */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full py-3 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-white-80">
                  Already have an account?{' '}
                  <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}