import { OrbitronContainer, OrbitronHeroSimple, OrbitronButton, OrbitronCard, OrbitronSection } from '../../../components/orbitron'
import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'

export default function MainHome() {
  return (
    <OrbitronContainer gradient="primary">
      <Head>
        <title>YooHoo.Guru - Community Skill Sharing Platform</title>
        <meta name="description" content="Exchange skills, discover purpose, and create exponential community impact." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        <OrbitronHeroSimple
          title="A community where you can swap skills, share services, or find trusted local help."
          subtitle="Local connections, meaningful exchanges, and community impact through our trusted skill-sharing platform."
        >
          <OrbitronButton href="/signup" variant="gradient" size="lg">
            Start Your Journey →
          </OrbitronButton>
          <OrbitronButton href="https://angel.yoohoo.guru" variant="ghost" size="lg">
            Browse Services
          </OrbitronButton>
        </OrbitronHeroSimple>

        <OrbitronSection>
          <div className="max-w-4xl mx-auto mb-16">
            <OrbitronCard variant="gradient" className="p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center gradient-text-emerald-blue">
                Learn. Earn. Empower.
              </h2>
              <p className="text-lg text-gray-300 text-center leading-relaxed">
                Join a world where knowledge, kindness, and capability meet. Choose your path:
                <strong className="text-emerald-400"> Become a Guru. Learn from Gurus. List a Gig.</strong> Help or get help through Angel&apos;s List.
                <strong className="text-blue-400"> Join the Heroes.</strong> Empower and be empowered through adaptive teaching.
              </p>
            </OrbitronCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <OrbitronCard className="p-8 group">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                🎓
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">
                SkillShare with Coach Guru
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Learn from Gurus. Become a Guru. Exchange knowledge and skills through personalized coaching.
              </p>
              <a
                href="https://coach.yoohoo.guru"
                className="inline-flex items-center text-emerald-400 font-semibold hover:text-emerald-300 transition-colors group-hover:translate-x-2 transform duration-300"
              >
                Explore Coach Guru →
              </a>
            </OrbitronCard>

            <OrbitronCard className="p-8 group">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                🔧
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
                Angel&apos;s List
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                List a Gig. Help or get help through Angel&apos;s List. Find local services and offer your help.
              </p>
              <a
                href="https://angel.yoohoo.guru"
                className="inline-flex items-center text-purple-400 font-semibold hover:text-purple-300 transition-colors group-hover:translate-x-2 transform duration-300"
              >
                Explore Angel&apos;s List →
              </a>
            </OrbitronCard>

            <OrbitronCard className="p-8 group">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                ❤️
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                Hero Gurus
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Join the Heroes. Empower and be empowered through adaptive teaching and inclusive learning.
              </p>
              <a
                href="https://heroes.yoohoo.guru"
                className="inline-flex items-center text-blue-400 font-semibold hover:text-blue-300 transition-colors group-hover:translate-x-2 transform duration-300"
              >
                Explore Hero Gurus →
              </a>
            </OrbitronCard>
          </div>
        </OrbitronSection>
      </main>

      <Footer />
    </OrbitronContainer>
  )
}
