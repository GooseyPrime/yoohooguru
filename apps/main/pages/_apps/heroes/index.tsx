import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import Link from 'next/link';
import { OrbitronContainer, OrbitronCard } from '../../../components/orbitron';
import HeroGurusAccessGate from '../../../components/HeroGurusAccessGate';

export default function HeroGurusHome() {
  return (
    <HeroGurusAccessGate>
      <OrbitronContainer gradient="primary">
        <Head>
          <title>Hero Gurus | Free Accessible Learning | YooHoo.Guru</title>
          <meta name="description" content="Free accessible skill-sharing for people with disabilities. Join our community of adaptive learners and volunteer Gurus." />
        </Head>

        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-500/10 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Hero Gurus Community
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Free accessible learning for people with disabilities. Our platform connects adaptive learners
                with volunteer Gurus who provide specialized, accommodating instruction.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/skills">
                  <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Find Accessible Learning →
                  </button>
                </Link>
                <Link href="/heroes/profile">
                  <button className="px-8 py-4 glass-effect hover:glass-effect-strong text-white font-bold text-lg rounded-lg transition-all duration-300 border border-white/30 hover:border-white/50">
                    Become a Hero Guru
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              <span className="gradient-text-emerald-blue">Accessible Learning Features</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <OrbitronCard className="p-8 text-center group">
                <div className="text-6xl mb-6">♿</div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">
                  Adaptive Teaching
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Our Hero Gurus are specially trained to accommodate various disabilities including
                  visual, auditory, motor, and cognitive impairments.
                </p>
              </OrbitronCard>

              <OrbitronCard className="p-8 text-center group">
                <div className="text-6xl mb-6">❤️</div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">
                  Completely Free
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  All learning sessions are 100% free with no contracts or obligations.
                  Funded through grants, donations, and community support.
                </p>
              </OrbitronCard>

              <OrbitronCard className="p-8 text-center group">
                <div className="text-6xl mb-6">🤝</div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">
                  Community Focused
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Built on volunteerism and community impact. Hero Gurus contribute their time and
                  expertise to make learning accessible to all.
                </p>
              </OrbitronCard>
            </div>
          </section>

          {/* Mission Section */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
            <OrbitronCard variant="gradient" className="p-12 text-center">
              <h2 className="text-4xl font-bold text-red-400 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Hero Gurus is dedicated to breaking down barriers to education and skill development
                for people with disabilities. We believe everyone deserves access to learning opportunities,
                regardless of their physical or cognitive abilities. Our volunteer Gurus provide
                adaptive instruction that accommodates individual needs, making skill-sharing truly inclusive.
              </p>
            </OrbitronCard>
          </section>
        </main>

        <Footer />
      </OrbitronContainer>
    </HeroGurusAccessGate>
  );
}
