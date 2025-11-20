import React from 'react';
import { GetServerSideProps } from 'next';
import Seo from '../components/Seo';
import Link from 'next/link';
import Navigation from '../components/ui/Navigation';
import HeroSection from '../components/sections/HeroSection';
import WhyYooHooSection from '../components/sections/WhyYooHooSection';
import { ServiceCard, ExpertCard } from '../components/ui/Card';
import { TestimonialCarousel } from '../components/ui/TestimonialCard';
import { ContentHubCarousel } from '../components/ui/ContentHubCarousel';

export default function Home() {
  // Service data
  const services = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "SkillShare",
      description: "Learn from expert Gurus or become one yourself. Exchange knowledge through personalized 1-on-1 coaching sessions.",
      features: [
        "Professional skill coaching",
        "Flexible scheduling",
        "Secure payments via Stripe",
        "15% platform commission"
      ],
      href: "https://coach.yoohoo.guru",
      stats: [
        { label: "Experts", value: "2,500+" },
        { label: "Sessions", value: "10K+" },
        { label: "Rating", value: "4.9★" }
      ]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Angel's List",
      description: "Find trusted local services or offer your expertise. Connect with your community for everyday tasks and specialized help.",
      features: [
        "Local service marketplace",
        "Verified providers",
        "Flexible pricing options",
        "10-15% commission rates"
      ],
      href: "https://angel.yoohoo.guru",
      stats: [
        { label: "Services", value: "1,200+" },
        { label: "Providers", value: "800+" },
        { label: "Completed", value: "5K+" }
      ]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Hero Gurus",
      description: "Free accessible learning for people with disabilities. Volunteer as a Hero or learn through adaptive teaching methods.",
      features: [
        "100% Free learning platform",
        "Adaptive teaching methods",
        "Inclusive community",
        "Volunteer-based teaching"
      ],
      href: "https://heroes.yoohoo.guru",
      stats: [
        { label: "Learners", value: "1,500+" },
        { label: "Heroes", value: "200+" },
        { label: "Courses", value: "100+" }
      ]
    }
  ];

  // Expert data
  const featuredExperts = [
    {
      name: "Sarah Chen",
      title: "Web Development Expert",
      description: "Full-stack developer with 8+ years experience in React, Node.js, and cloud architecture. Passionate about teaching code.",
      rating: 4.9,
      reviews: 127,
      hourlyRate: 75,
      skills: ["React", "Node.js", "AWS", "TypeScript"],
      href: "https://coach.yoohoo.guru/sarah-chen",
    },
    {
      name: "Marcus Rodriguez",
      title: "Digital Marketing Strategist",
      description: "Help businesses grow through data-driven marketing. Specialized in SEO, content strategy, and social media.",
      rating: 4.8,
      reviews: 93,
      hourlyRate: 60,
      skills: ["SEO", "Content Marketing", "Analytics", "Social Media"],
      href: "https://coach.yoohoo.guru/marcus-rodriguez",
    },
    {
      name: "Emily Watson",
      title: "Graphic Design Mentor",
      description: "Creative director turned educator. Teaching design thinking, brand identity, and digital illustration.",
      rating: 5.0,
      reviews: 201,
      hourlyRate: 55,
      skills: ["UI/UX", "Brand Design", "Illustration", "Figma"],
      href: "https://coach.yoohoo.guru/emily-watson",
    }
  ];

  return (
    <>
      <Seo
        title="YooHoo.Guru - Community Skill Sharing Platform"
        description="Connect with expert teachers, find local service providers, and share your skills. Join YooHoo.Guru to learn, teach, and grow together."
        url="https://www.yoohoo.guru"
        image="https://www.yoohoo.guru/assets/og-home.jpg"
      />

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Services Section */}
        <section id="explore" className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Choose Your Path
              </h2>
              <p className="text-xl text-white-80 max-w-3xl mx-auto">
                Three unique ways to learn, earn, and make an impact in your community. Whether you&apos;re seeking knowledge, offering expertise, or volunteering time, we have a place for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ServiceCard {...service} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Experts Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Meet Our Expert Gurus
              </h2>
              <p className="text-xl text-white-80 max-w-3xl mx-auto">
                Learn from the best. Our verified experts bring years of experience and a passion for teaching.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredExperts.map((expert, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ExpertCard {...expert} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="/browse"
                className="inline-flex items-center space-x-2 px-8 py-4 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
              >
                <span>Browse All Experts</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Content Hubs Section */}
        <section className="section-padding bg-gradient-to-b from-primarydark/50 to-transparent">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Explore Our Content Hubs
              </h2>
              <p className="text-xl text-white-80 max-w-3xl mx-auto">
                Discover expert-curated content across 24 specialized topics. Each hub features AI-curated news, tutorials, and community insights.
              </p>
            </div>

               <ContentHubCarousel />
   
               <div className="text-center mt-8">
                 <Link
                   href="/hubs"
                   className="inline-flex items-center space-x-2 px-8 py-4 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                 >
                   <span>View All 24 Hubs</span>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                   </svg>
                 </Link>
               </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Success Stories from Our Community
              </h2>
              <p className="text-xl text-white-80 max-w-3xl mx-auto">
                Join thousands of satisfied members who are transforming their lives through skill sharing.
              </p>
            </div>

            <TestimonialCarousel />
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="glass-card p-12 md:p-16 text-center rounded-3xl">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-white-80 max-w-2xl mx-auto mb-12">
                Start sharing your skills, learning from experts, or volunteering your time. Your journey to making an impact begins here.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald-lg hover:-translate-y-1"
                >
                  Get Started Free →
                </Link>
                <Link
                  href="/how-it-works"
                  className="w-full sm:w-auto px-8 py-4 glass-button text-white text-lg font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                >
                  Learn How It Works
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text-emerald mb-2">10,000+</div>
                  <div className="text-sm text-white-60">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text-blue mb-2">500+</div>
                  <div className="text-sm text-white-60">Expert Instructors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text-purple mb-2">25,000+</div>
                  <div className="text-sm text-white-60">Learning Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text-gold mb-2">98%</div>
                  <div className="text-sm text-white-60">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>
           {/* Why YooHoo.Guru Section */}
           <WhyYooHooSection />
        {/* Trusted By Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-display font-bold text-white-60 mb-8">
                Trusted by Leading Organizations
              </h3>
              <p className="text-white-40 text-sm">
                Partner companies and educational institutions that trust our platform
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white-10 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-white font-display">YG</span>
                </div>
                <div className="text-lg font-display font-bold gradient-text-emerald-blue">
                  YooHoo.Guru
                </div>
              </div>
              <p className="text-sm text-white-60">
                Building community through skill sharing
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-white-60">
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About</Link></li>
                <li><Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white-60">
                <li><Link href="/help" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-emerald-400 transition-colors">Safety</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white-60">
                <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link></li>
                <li><Link href="/cookies" className="hover:text-emerald-400 transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="divider-gradient mb-8" />

          <div className="text-center text-sm text-white-60">
            <p>&copy; 2024 YooHoo.Guru. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
// Make this page server-side rendered to avoid SSG issues with Navigation component using useRouter
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
