import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import Link from 'next/link';
import { OrbitronContainer, OrbitronCard, OrbitronButton, OrbitronSection } from '../../../components/orbitron';

export default function CoachGuruHome() {
  return (
    <OrbitronContainer gradient="primary">
      <Head>
        <title>Coach Guru | Professional Skill Teaching | YooHoo.Guru</title>
        <meta name="description" content="Share your expertise and earn income through professional skill coaching. Join our community of expert instructors." />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Coach Guru Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Share your expertise and earn income through professional skill coaching. 
              Join our community of expert instructors and start teaching what you love.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <OrbitronButton href="/signup" variant="gradient" size="lg">
                Become a Guru →
              </OrbitronButton>
              <OrbitronButton href="/skills" variant="ghost" size="lg">
                Find a Coach
              </OrbitronButton>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <OrbitronSection>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="gradient-text-emerald-blue">How Coach Guru Works</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <OrbitronCard className="p-8 text-center group">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                Find Your Guru
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Browse our extensive marketplace of skilled Gurus across 24 categories. 
                Filter by skill, price, availability, and ratings to find the perfect match.
              </p>
            </OrbitronCard>

            <OrbitronCard className="p-8 text-center group">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                Book a Session
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Schedule one-time learning sessions with your chosen Guru. 
                Choose between video conferencing or in-person meetings based on location.
              </p>
            </OrbitronCard>

            <OrbitronCard className="p-8 text-center group">
              <div className="text-6xl mb-6">💳</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                Secure Payments
              </h3>
              <p className="text-gray-400 leading-relaxed">
                All payments are processed securely through Stripe with 48-hour escrow protection. 
                Funds are released to Gurus after successful session completion.
              </p>
            </OrbitronCard>
          </div>

          {/* Commission Info */}
          <OrbitronCard variant="gradient" className="text-center p-12 mt-12">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">
              Platform Commission
            </h3>
            <div className="text-4xl font-bold text-white mb-4">
              15%
            </div>
            <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Coach Guru charges a 15% platform commission on all transactions. 
              This fee supports platform maintenance, security, and quality assurance.
            </p>
          </OrbitronCard>
        </OrbitronSection>
      </main>

      <Footer />
    </OrbitronContainer>
  );
}