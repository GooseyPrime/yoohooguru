import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import Link from 'next/link';
import { OrbitronContainer, OrbitronCard } from '../../../components/orbitron';

export default function AngelListHome() {
  return (
    <OrbitronContainer gradient="secondary">
      <Head>
        <title>Angel&apos;s List | Local Service Marketplace | YooHoo.Guru</title>
        <meta name="description" content="Find and provide local services in your community. Connect with neighbors for everything from handyman work to tutoring." />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-green-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Angel&apos;s List Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Find and provide local services in your community. Connect with neighbors for everything
              from handyman work to tutoring, all within your local area.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/location/search">
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-glow-emerald">
                  Find Local Services →
                </button>
              </Link>
              <Link href="/angel/profile">
                <button className="px-8 py-4 glass-effect hover:glass-effect-strong text-white font-bold text-lg rounded-lg transition-all duration-300 border border-white/30 hover:border-white/50">
                  Become an Angel
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="gradient-text-emerald-blue">Local Service Features</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <OrbitronCard className="p-8 text-center group">
              <div className="text-6xl mb-6">📍</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                Geographical Matching
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Connect with service providers and clients in your local area. Reduce travel time
                and support your community with nearby services.
              </p>
            </OrbitronCard>

            <OrbitronCard className="p-8 text-center group">
              <div className="text-6xl mb-6">💰</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                Flexible Pricing
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Set your own rates for services. Our tiered commission structure (10-15%) ensures
                fair pricing for both providers and clients.
              </p>
            </OrbitronCard>

            <OrbitronCard className="p-8 text-center group">
              <div className="text-6xl mb-6">🛡️</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                Secure Transactions
              </h3>
              <p className="text-gray-400 leading-relaxed">
                All payments are securely processed and held in escrow until services are completed.
                Protection for both service providers and clients.
              </p>
            </OrbitronCard>
          </div>
        </section>

        {/* Commission Info */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <OrbitronCard variant="gradient" className="p-12 text-center">
            <h3 className="text-3xl font-bold text-green-400 mb-4">
              Commission Structure
            </h3>
            <div className="text-5xl font-bold text-white mb-6">
              10-15% Tiered Commission
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Our fair commission structure ensures you keep most of what you earn.
              Lower commission rates for higher volume providers.
            </p>
          </OrbitronCard>
        </section>
      </main>

      <Footer />
    </OrbitronContainer>
  );
}
