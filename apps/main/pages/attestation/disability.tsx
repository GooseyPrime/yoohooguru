import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import Navigation from '../../components/ui/Navigation';
import DisabilityAttestationForm from '../../components/DisabilityAttestationForm';

export default function DisabilityAttestation() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttestation, setHasAttestation] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      
      if (!session) {
        router.push('/login?redirect=/attestation/disability');
        return;
      }

      // Check if user already has attestation
      try {
        const response = await fetch('/api/backend/attestation/disability/status');
        if (response.ok) {
          const data = await response.json();
          if (data.data.attested) {
            setHasAttestation(true);
          }
        }
      } catch (error) {
        console.error('Error checking attestation status:', error);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading... | YooHoo.Guru</title>
        </Head>
        <Navigation />
        <main className="min-h-screen flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin"></div>
        </main>
      </>
    );
  }

  if (hasAttestation) {
    return (
      <>
        <Head>
          <title>Attestation Already Submitted | YooHoo.Guru</title>
        </Head>
        <Navigation />
        <main className="min-h-screen flex items-center justify-center py-20">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="glass-card p-8 rounded-2xl">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-display font-bold text-white mb-4">
                  Attestation Already Submitted
                </h1>
                <p className="text-white-80 mb-6">
                  You have already submitted your disability attestation. You can now access the Hero Gurus program.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push('/heroes')}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                  >
                    Go to Hero Gurus
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-3 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Disability Attestation | YooHoo.Guru</title>
        <meta name="description" content="Submit your disability attestation to access the Hero Gurus program" />
      </Head>

      <Navigation />

      <main className="min-h-screen py-20">
        <div className="container-custom">
          <DisabilityAttestationForm />
        </div>
      </main>
    </>
  );
}