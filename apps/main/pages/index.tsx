import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'
import { OrbitronContainer, OrbitronButton } from '../components/orbitron'

export default function Home() {
  return (
    <OrbitronContainer gradient="primary">
      <Head>
        <title>YooHoo.Guru - Community Skill Sharing Platform</title>
        <meta name="description" content="Exchange skills, discover purpose, and create exponential community impact." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        {/* Enhanced Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background Orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            {/* Main Heading with Staggered Animation */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="block gradient-text-emerald-blue">
                  Share Skills.
                </span>
                <span className="block text-white mt-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Build Community.
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Connect with local experts, exchange knowledge, and create meaningful impact through our trusted skill-sharing platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <OrbitronButton href="/signup" variant="gradient" size="lg">
                Get Started Free →
              </OrbitronButton>
              <OrbitronButton href="#explore" variant="ghost" size="lg">
                Explore Platform
              </OrbitronButton>
            </div>

            {/* Stats/Social Proof */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-emerald-blue mb-2">10K+</div>
                <div className="text-sm md:text-base text-gray-400">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-emerald-blue mb-2">500+</div>
                <div className="text-sm md:text-base text-gray-400">Skills Shared</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-emerald-blue mb-2">98%</div>
                <div className="text-sm md:text-base text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-emerald-400/50 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-emerald-400/80 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Three Feature Cards Section */}
        <section id="explore" className="relative py-24 bg-gradient-to-b from-transparent to-secondarydark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-emerald-blue">
                Choose Your Path
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Three unique ways to learn, earn, and make an impact in your community
              </p>
            </div>

            {/* Three Cards - Always Side by Side */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Coach Guru Card */}
              <a
                href="https://coach.yoohoo.guru"
                className="group relative bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-600/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 transition-all duration-500 hover:scale-105 hover:border-emerald-400/50 hover:shadow-glow-emerald-lg overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/5 transition-all duration-500 rounded-2xl" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 md:w-16 lg:w-20 md:h-16 lg:h-20 rounded-lg md:rounded-xl lg:rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border border-emerald-500/50 md:border-2 flex items-center justify-center text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 lg:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    🎓
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 lg:mb-4 text-white group-hover:text-emerald-400 transition-colors">
                    Coach Guru
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 group-hover:text-gray-300 mb-3 md:mb-4 lg:mb-6 leading-relaxed text-xs md:text-sm lg:text-base">
                    Learn from expert Gurus or become one yourself. Exchange knowledge through personalized 1-on-1 coaching sessions.
                  </p>

                  {/* Features */}
                  <ul className="space-y-1 md:space-y-2 mb-3 md:mb-4 lg:mb-6 text-xs md:text-sm text-gray-500 group-hover:text-gray-400">
                    <li className="flex items-center gap-1 md:gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="hidden md:inline">Professional skill coaching</span>
                      <span className="md:hidden">Pro coaching</span>
                    </li>
                    <li className="flex items-center gap-1 md:gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="hidden md:inline">Flexible scheduling</span>
                      <span className="md:hidden">Flexible</span>
                    </li>
                    <li className="flex items-center gap-1 md:gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="hidden md:inline">Secure payments</span>
                      <span className="md:hidden">Secure</span>
                    </li>
                  </ul>

                  {/* CTA */}
                  <div className="inline-flex items-center gap-1 md:gap-2 text-emerald-400 font-semibold group-hover:gap-4 transition-all text-xs md:text-sm lg:text-base">
                    <span className="hidden md:inline">Explore Coach Guru</span>
                    <span className="md:hidden">Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>

              {/* Angel's List Card */}
              <a
                href="https://angel.yoohoo.guru"
                className="group relative bg-gradient-to-br from-purple-500/10 via-transparent to-pink-600/10 backdrop-blur-sm border border-purple-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 transition-all duration-500 hover:scale-105 hover:border-purple-400/50 hover:shadow-glow-blue-lg overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/5 transition-all duration-500 rounded-2xl" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 md:w-16 lg:w-20 md:h-16 lg:h-20 rounded-lg md:rounded-xl lg:rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-600/30 border border-purple-500/50 md:border-2 flex items-center justify-center text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 lg:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    🔧
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 lg:mb-4 text-white group-hover:text-purple-400 transition-colors">
                    Angel's List
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 group-hover:text-gray-300 mb-3 md:mb-4 lg:mb-6 leading-relaxed text-xs md:text-sm lg:text-base">
                    Find trusted local services or offer your expertise. Connect with your community for everyday tasks and specialized help.
                  </p>

                  {/* Features */}
                  <ul className="space-y-1 md:space-y-2 mb-3 md:mb-4 lg:mb-6 text-xs md:text-sm text-gray-500 group-hover:text-gray-400">
                    <li className="flex items-center gap-1 md:gap-2">
                      <span className="text-purple-400">✓</span>
                      <span className="hidden md:inline">Local service marketplace</span>
                      <span className="md:hidden">Local services</span>
                    </li>
                    <li className="flex items-center gap-1 md:gap-2">
                      <span className="text-purple-400">✓</span>
                      <span className="hidden md:inline">Verified providers</span>
                      <span className="md:hidden">Verified</span>
                    </li>
                    <li className="flex items-center gap-1 md:gap-2">
                      <span className="text-purple-400">✓</span>
                      <span className="hidden md:inline">Flexible pricing</span>
                      <span className="md:hidden">Flexible</span>
                    </li>
                  </ul>

                  {/* CTA */}
                  <div className="inline-flex items-center gap-1 md:gap-2 text-purple-400 font-semibold group-hover:gap-4 transition-all text-xs md:text-sm lg:text-base">
                    <span className="hidden md:inline">Explore Angel's List</span>
                    <span className="md:hidden">Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>

              {/* Hero Gurus Card */}
              <a
                href="https://heroes.yoohoo.guru"
                className="group relative bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-600/10 backdrop-blur-sm border border-blue-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 transition-all duration-500 hover:scale-105 hover:border-blue-400/50 hover:shadow-glow-blue-lg overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/5 transition-all duration-500 rounded-2xl" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 md:w-16 lg:w-20 md:h-16 lg:h-20 rounded-lg md:rounded-xl lg:rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-blue-500/50 md:border-2 flex items-center justify-center text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 lg:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    ❤️
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 lg:mb-4 text-white group-hover:text-blue-400 transition-colors">
                    Hero Gurus
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 group-hover:text-gray-300 mb-3 md:mb-4 lg:mb-6 leading-relaxed text-xs md:text-sm lg:text-base">
                    Free accessible learning for people with disabilities. Volunteer as a Hero or learn through adaptive teaching methods.
                  </p>

                  {/* Features */}
                  <ul className="space-y-1 md:space-y-2 mb-3 md:mb-4 lg:mb-6 text-xs md:text-sm text-gray-500 group-hover:text-gray-400">
                    <li className="flex items-center gap-1 md:gap-2">
                      <span className="text-blue-400">✓</span>
                      <span className="hidden md:inline">100% Free learning</span>
                      <span className="md:hidden">Free</span>
                    </li>
                    <li className="flex items-center gap-1 md:gap-2">
                      <span className="text-blue-400">✓</span>
                      <span className="hidden md:inline">Adaptive teaching</span>
                      <span className="md:hidden">Adaptive</span>
                    </li>
                    <li className="flex items-center gap-1 md:gap-2">
                      <span className="text-blue-400">✓</span>
                      <span className="hidden md:inline">Inclusive community</span>
                      <span className="md:hidden">Inclusive</span>
                    </li>
                  </ul>

                  {/* CTA */}
                  <div className="inline-flex items-center gap-1 md:gap-2 text-blue-400 font-semibold group-hover:gap-4 transition-all text-xs md:text-sm lg:text-base">
                    <span className="hidden md:inline">Explore Hero Gurus</span>
                    <span className="md:hidden">Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </OrbitronContainer>
  )
}
