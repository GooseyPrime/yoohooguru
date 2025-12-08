import { useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { Header, Footer } from '@yoohooguru/shared';
import {
  OrbitronButton,
  OrbitronCard,
  OrbitronContainer,
  OrbitronSection,
} from '../components/orbitron';

interface OnboardingStep {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  audience: string;
}

export default function OnboardingPage() {
  const { data: session } = useSession();

  const steps: OnboardingStep[] = useMemo(
    () => [
      {
        title: 'Complete your system profile',
        description:
          'Add the basics we need internally to support your account, notifications, and security. This information stays private to YooHoo.Guru.',
        actionLabel: 'Edit System Profile',
        href: '/profile',
        audience: 'Audience: YooHoo.Guru system only',
      },
      {
        title: 'Publish your public page',
        description:
          'Create the Guru or Angel page people will see when they discover you. Add your story, a general location, pricing, and scheduling links.',
        actionLabel: 'Open Public Profiles',
        href: '/profiles/public',
        audience: 'Audience: Learners and clients',
      },
      {
        title: 'Explore your dashboard',
        description:
          'Track bookings, manage learning, and discover next steps once your profiles are ready.',
        actionLabel: 'Go to Dashboard',
        href: '/dashboard',
        audience: 'Audience: You',
      },
    ],
    []
  );

  return (
    <OrbitronContainer gradient="primary">
      <Head>
        <title>Welcome | Onboarding | YooHoo.Guru</title>
        <meta
          name="description"
          content="Complete your YooHoo.Guru onboarding with clear next steps for your private and public profiles."
        />
      </Head>

      <Header />

      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300/80">Getting started</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Welcome{session?.user?.name ? `, ${session.user.name}` : ''}!
            </h1>
            <p className="text-lg text-white/70">
              Follow these guided steps to finish onboarding, set up your profiles, and make it obvious who will see each piece of
              information.
            </p>
          </div>

          <OrbitronSection>
            <div className="grid gap-6 md:grid-cols-2">
              {steps.map((step) => (
                <OrbitronCard key={step.title} className="h-full flex flex-col p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-lg text-blue-100">
                      •
                    </div>
                    <div>
                      <h2 className="text-2xl text-white font-semibold mb-1">{step.title}</h2>
                      <p className="text-sm text-white/70 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <div className="text-xs uppercase tracking-wide text-white/60 font-semibold">{step.audience}</div>
                    <OrbitronButton href={step.href} variant="gradient" className="w-full text-center">
                      {step.actionLabel}
                    </OrbitronButton>
                  </div>
                </OrbitronCard>
              ))}
            </div>
          </OrbitronSection>

          <OrbitronSection>
            <OrbitronCard className="p-6 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl text-white font-semibold mb-2">Know which profile you are editing</h2>
                <p className="text-white/70 leading-relaxed">
                  System profiles keep your account secure and are never shown publicly. Public profiles are your advertising
                  pages—perfect for Gurus and Angels to showcase skills, pricing, and scheduling. Each edit screen clearly labels the
                  audience at the top so you always know who will see it.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-64">
                <Link href="/profile" className="text-center text-sm text-white/80 hover:text-white underline">System profile (private)</Link>
                <Link href="/profiles/public" className="text-center text-sm text-white/80 hover:text-white underline">Public profiles (visible)</Link>
              </div>
            </OrbitronCard>
          </OrbitronSection>
        </div>
      </main>

      <Footer />
    </OrbitronContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
