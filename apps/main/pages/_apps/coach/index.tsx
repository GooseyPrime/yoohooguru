import React from 'react';
import Head from 'next/head';
import Navigation from '../../../components/ui/Navigation';
import HeroSection from '../../../components/sections/HeroSection';
import { ExpertCard } from '../../../components/ui/Card';
import { TestimonialCarousel } from '../../../components/ui/TestimonialCard';
import Button from '../../../components/ui/Button';

export default function CoachGuru() {
  // Featured experts
  const featuredExperts = [
    {
      name: "Sarah Chen",
      title: "Web Development Expert",
      description: "Full-stack developer with 8+ years experience in React, Node.js, and cloud architecture. Passionate about teaching code.",
      rating: 4.9,
      reviews: 127,
      hourlyRate: 75,
      skills: ["React", "Node.js", "AWS", "TypeScript"],
      href: "/experts/sarah-chen",
    },
    {
      name: "Marcus Rodriguez",
      title: "Digital Marketing Strategist",
      description: "Help businesses grow through data-driven marketing. Specialized in SEO, content strategy, and social media.",
      rating: 4.8,
      reviews: 93,
      hourlyRate: 60,
      skills: ["SEO", "Content Marketing", "Analytics", "Social Media"],
      href: "/experts/marcus-rodriguez",
    },
    {
      name: "Emily Watson",
      title: "Graphic Design Mentor",
      description: "Creative director turned educator. Teaching design thinking, brand identity, and digital illustration.",
      rating: 5.0,
      reviews: 201,
      hourlyRate: 55,
      skills: ["UI/UX", "Brand Design", "Illustration", "Figma"],
      href: "/experts/emily-watson",
    },
    {
      name: "David Kim",
      title: "Data Science Professional",
      description: "PhD in Machine Learning with industry experience in healthcare and finance. Love making complex concepts simple.",
      rating: 4.9,
      reviews: 87,
      hourlyRate: 85,
      skills: ["Python", "Machine Learning", "Statistics", "TensorFlow"],
      href: "/experts/david-kim",
    },
    {
      name: "Lisa Anderson",
      title: "Business Strategy Coach",
      description: "Former Fortune 500 consultant helping startups and small businesses scale effectively and sustainably.",
      rating: 4.7,
      reviews: 156,
      hourlyRate: 70,
      skills: ["Strategy", "Business Planning", "Leadership", "Growth Hacking"],
      href: "/experts/lisa-anderson",
    },
    {
      name: "James Miller",
      title: "Photography & Video Expert",
      description: "Professional photographer/videographer teaching composition, lighting, editing, and visual storytelling.",
      rating: 4.8,
      reviews: 112,
      hourlyRate: 50,
      skills: ["Photography", "Video Editing", "Adobe Suite", "Lightroom"],
      href: "/experts/james-miller",
    }
  ];

  // Popular categories
  const popularCategories = [
    { name: "Technology", icon: "💻", count: 245, color: "emerald" },
    { name: "Business", icon: "📊", count: 189, color: "blue" },
    { name: "Creative Arts", icon: "🎨", count: 167, color: "purple" },
    { name: "Marketing", icon: "📈", count: 134, color: "orange" },
    { name: "Data Science", icon: "📊", count: 98, color: "emerald" },
    { name: "Design", icon: "🎯", count: 156, color: "blue" },
    { name: "Photography", icon: "📷", count: 87, color: "purple" },
    { name: "Writing", icon: "✍️", count: 76, color: "orange" }
  ];

  // How it works steps
  const howItWorks = [
    {
      icon: (
        <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Find Your Guru",
      description: "Browse our extensive marketplace of skilled Gurus across 24 categories. Filter by skill, price, availability, and ratings to find the perfect match for your learning goals.",
      features: ["Advanced search filters", "Verified expert profiles", "Skill-based matching", "Rating and review system"]
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Book a Session",
      description: "Schedule one-time learning sessions with your chosen Guru. Choose between video conferencing or in-person meetings based on location and preference. Flexible scheduling to fit your timeline.",
      features: ["Video conference options", "In-person meeting support", "Flexible time slots", "Calendar integration"]
    },
    {
      icon: (
        <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "Secure Payments",
      description: "All payments are processed securely through Stripe with 48-hour escrow protection. Funds are released to Gurus only after successful session completion, ensuring quality and satisfaction.",
      features: ["Stripe secure processing", "48-hour escrow protection", "Refund guarantees", "Multiple payment methods"]
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Software Developer",
      company: "Tech Corp",
      content: "Coach Guru transformed my career. I learned advanced React concepts from Sarah and landed my dream job within 3 months. The platform is professional and the quality of instructors is outstanding.",
      rating: 5,
      date: "2 weeks ago",
      featured: true,
    },
    {
      name: "Jennifer Lee",
      role: "Marketing Manager",
      company: "Startup Inc",
      content: "I've been both a learner and a teacher on Coach Guru. The community is supportive, the platform is intuitive, and I've grown both professionally and personally through this experience.",
      rating: 5,
      date: "3 weeks ago",
      featured: true,
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      company: "Small Business",
      content: "Found an amazing business coach who helped me scale my company from 5 to 25 employees in 6 months. The ROI has been incredible!",
      rating: 5,
      date: "1 month ago",
    }
  ];

  return (
    <>
      <Head>
        <title>Coach Guru | Professional Skill Teaching | YooHoo.Guru</title>
        <meta name="description" content="Share your expertise and earn income through professional skill coaching. Join our community of expert instructors and start teaching what you love." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-orbitron-primary">
        <Navigation />
        
        {/* Hero Section */}
        <HeroSection />

        {/* Trust Indicators */}
        <section className="py-12 bg-gradient-to-b from-transparent to-secondarydark/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-emerald-400 mb-2">2,500+</div>
                <div className="text-sm text-gray-400">Expert Gurus</div>
              </div>
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-400 mb-2">15%</div>
                <div className="text-sm text-gray-400">Platform Commission</div>
              </div>
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">10,000+</div>
                <div className="text-sm text-gray-400">Sessions Completed</div>
              </div>
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-orange-400 mb-2">4.9★</div>
                <div className="text-sm text-gray-400">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">How Coach Guru Works</h2>
              <p className="body-large max-w-3xl mx-auto">
                Simple, secure, and effective skill sharing that benefits both learners and expert instructors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center glass-effect">
                    {step.icon}
                  </div>
                  <h3 className="heading-3 mb-4">{step.title}</h3>
                  <p className="body-normal mb-6">{step.description}</p>
                  <ul className="text-left space-y-2">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300">
                        <span className="w-4 h-4 text-emerald-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission Info */}
        <section className="py-16 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="heading-2 mb-4">Platform Commission</h3>
              <div className="text-6xl font-bold gradient-text-emerald-blue mb-4">15%</div>
              <p className="body-normal max-w-2xl mx-auto mb-8">
                Coach Guru charges a 15% platform commission on all transactions. 
                This fee supports platform maintenance, security, payment processing, 
                marketing, and quality assurance to ensure the best experience for everyone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-2">What&apos;s Included</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Secure payment processing</li>
                    <li>• Platform maintenance</li>
                    <li>• Customer support</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-2">Benefits</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Student acquisition</li>
                    <li>• Scheduling tools</li>
                    <li>• Quality verification</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-2">Get Started</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Free to join</li>
                    <li>• No hidden fees</li>
                    <li>• Cancel anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Popular Learning Categories</h2>
              <p className="body-normal">Explore our most sought-after skills and expertise areas</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {popularCategories.map((category, index) => (
                <a
                  key={index}
                  href={`/experts?category=${category.name.toLowerCase()}`}
                  className="card-hover text-center p-6 group"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h4 className="font-semibold text-white mb-2">{category.name}</h4>
                  <p className="text-sm text-emerald-400">{category.count} experts</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Experts */}
        <section className="py-20 bg-gradient-to-b from-transparent to-secondarydark/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Meet Our Expert Gurus</h2>
              <p className="body-normal">Learn from verified professionals with proven expertise</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredExperts.map((expert, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ExpertCard {...expert} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="gradient" size="lg" href="/experts">
                Browse All Expert Gurus →
              </Button>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Success Stories</h2>
              <p className="body-normal">Real experiences from our community of learners and instructors</p>
            </div>

            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-featured text-center p-12">
              <h2 className="heading-2 mb-4">Ready to Start Teaching or Learning?</h2>
              <p className="body-large mb-8 max-w-2xl mx-auto">
                Join thousands of expert instructors and motivated learners. 
                Share your knowledge, grow your skills, and be part of something amazing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gradient" size="lg" href="/signup?type=guru">
                  Become a Guru →
                </Button>
                <Button variant="ghost" size="lg" href="/signup?type=learner">
                  Find a Coach →
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}