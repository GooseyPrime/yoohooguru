import React from 'react';
import Head from 'next/head';
import Navigation from '../../../components/ui/Navigation';
import HeroSection from '../../../components/sections/HeroSection';
import { ServiceCard } from '../../../components/ui/Card';
import { TestimonialCarousel } from '../../../components/ui/TestimonialCard';
import Button from '../../../components/ui/Button';

export default function AngelList() {
  // Featured services
  const featuredServices = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: "Home Services",
      description: "Professional help for your home maintenance, repairs, and improvements",
      services: ["Plumbing", "Electrical Work", "Carpentry", "Cleaning", "Landscaping"],
      count: "500+ providers",
      href: "/services/home"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Tutoring & Education",
      description: "Academic support, test preparation, and skill development for all ages",
      services: ["Math Tutoring", "Language Learning", "Test Prep", "Music Lessons", "Art Classes"],
      count: "300+ providers",
      href: "/services/education"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      title: "Business & Professional",
      description: "Business consulting, administrative support, and professional services",
      services: ["Bookkeeping", "Marketing", "Virtual Assistant", "Consulting", "IT Support"],
      count: "250+ providers",
      href: "/services/business"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "Personal Services",
      description: "Wellness, fitness, beauty, and personal care services",
      services: ["Personal Training", "Hair & Beauty", "Massage Therapy", "Nutrition", "Life Coaching"],
      count: "200+ providers",
      href: "/services/personal"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Technology & Digital",
      description: "Tech support, web development, digital marketing, and IT services",
      services: ["Computer Repair", "Web Design", "App Development", "SEO", "Social Media"],
      count: "180+ providers",
      href: "/services/technology"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Creative & Events",
      description: "Event planning, photography, videography, and creative services",
      services: ["Event Planning", "Photography", "Videography", "Graphic Design", "Writing"],
      count: "150+ providers",
      href: "/services/creative"
    }
  ];

  // How it works steps
  const howItWorks = [
    {
      icon: (
        <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Find Local Services",
      description: "Search our marketplace for trusted local service providers. Filter by category, location, price, and ratings to find exactly what you need.",
      features: ["Location-based search", "Verified provider badges", "Detailed service descriptions", "Real availability"]
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Book with Confidence",
      description: "Schedule services directly with providers through our platform. Choose your preferred time and get instant confirmation.",
      features: ["Direct messaging", "Flexible scheduling", "Service agreements", "Appointment reminders"]
    },
    {
      icon: (
        <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "Secure Payment & Review",
      description: "Pay securely through our platform after service completion. Leave reviews to help the community make informed decisions.",
      features: ["Secure payment processing", "Service completion verification", "Rating and review system", "Dispute resolution"]
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Maria Garcia",
      role: "Small Business Owner",
      company: "Local Cafe",
      content: "Found an amazing graphic designer through Angel&apos;s List who completely redesigned our branding. The process was smooth, communication was excellent, and the results exceeded our expectations.",
      rating: 5,
      date: "1 month ago",
      featured: true,
    },
    {
      name: "Robert Johnson",
      role: "Homeowner",
      company: "Suburb Residence",
      content: "Needed urgent plumbing repair and found a verified professional within 30 minutes. They arrived on time, fixed the issue perfectly, and the price was very reasonable.",
      rating: 5,
      date: "2 weeks ago",
    },
    {
      name: "Amanda White",
      role: "Event Planner",
      company: "Corporate Events",
      content: "I use Angel&apos;s List to find reliable vendors for my events. The quality of service providers is consistently high, and the review system helps me make confident choices.",
      rating: 5,
      date: "3 weeks ago",
      featured: true,
    }
  ];

  // Featured providers
  const featuredProviders = [
    {
      name: "ProHome Services",
      service: "Home Repair & Maintenance",
      rating: 4.9,
      reviews: 234,
      description: "Licensed and insured professionals for all your home needs. 24/7 emergency service available.",
      badge: "Top Rated"
    },
    {
      name: "TechSupport Plus",
      service: "IT & Computer Services",
      rating: 4.8,
      reviews: 156,
      description: "Certified technicians providing remote and on-site tech support for businesses and homes.",
      badge: "Verified"
    },
    {
      name: "Creative Minds Agency",
      service: "Design & Marketing",
      rating: 5.0,
      reviews: 89,
      description: "Award-winning team specializing in branding, web design, and digital marketing solutions.",
      badge: "Premium"
    }
  ];

  return (
    <>
      <Head>
        <title>Angel&apos;s List | Local Services Marketplace | YooHoo.Guru</title>
        <meta name="description" content="Find trusted local services or offer your expertise. Connect with your community for everyday tasks and specialized help." />
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
                <div className="text-3xl font-bold text-emerald-400 mb-2">1,200+</div>
                <div className="text-sm text-gray-400">Active Services</div>
              </div>
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-400 mb-2">800+</div>
                <div className="text-sm text-gray-400">Verified Providers</div>
              </div>
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">5,000+</div>
                <div className="text-sm text-gray-400">Jobs Completed</div>
              </div>
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-orange-400 mb-2">10-15%</div>
                <div className="text-sm text-gray-400">Commission Range</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">How Angel&apos;s List Works</h2>
              <p className="body-large max-w-3xl mx-auto">
                Connect with trusted local service providers through our secure and user-friendly platform.
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
        <section className="py-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="heading-2 mb-4">Flexible Commission Rates</h3>
              <div className="text-6xl font-bold gradient-text-emerald-blue mb-4">10-15%</div>
              <p className="body-normal max-w-2xl mx-auto mb-8">
                Angel&apos;s List charges a flexible 10-15% platform commission based on service type and complexity.
                This competitive rate covers payment processing, platform maintenance, customer support,
                provider verification, and marketing to help you grow your business.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-2">10% Commission</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Professional services</li>
                    <li>• Consulting</li>
                    <li>• Digital services</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-2">12.5% Commission</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Home services</li>
                    <li>• Personal services</li>
                    <li>• Education services</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-2">15% Commission</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Event services</li>
                    <li>• Complex projects</li>
                    <li>• Premium services</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Popular Service Categories</h2>
              <p className="body-normal">Find the right service provider for your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ServiceCard
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    features={service.services}
                    href={service.href}
                    stats={[
                      { label: "Providers", value: service.count.split('+')[0] },
                      { label: "Services", value: service.services.length.toString() },
                      { label: "Rating", value: "4.8★" }
                    ]}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Providers */}
        <section className="py-20 bg-gradient-to-b from-transparent to-secondarydark/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Featured Service Providers</h2>
              <p className="body-normal">Top-rated professionals in your area</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProviders.map((provider, index) => (
                <div key={index} className={`card-hover ${index === 0 ? 'card-featured' : 'card-default'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-lg mr-3 flex items-center justify-center">
                        <span className="text-white font-bold">PP</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{provider.name}</h3>
                        <p className="text-sm text-emerald-400">{provider.service}</p>
                      </div>
                    </div>
                    {provider.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        provider.badge === 'Top Rated' ? 'badge-success' : 
                        provider.badge === 'Verified' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {provider.badge}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">{provider.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({provider.reviews})</span>
                    </div>
                    <Button variant="ghost" size="sm" href={`/providers/${provider.name.toLowerCase().replace(' ', '-')}`}>
                      View Profile →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Customer Success Stories</h2>
              <p className="body-normal">Real experiences from our community of service providers and customers</p>
            </div>

            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-featured text-center p-12">
              <h2 className="heading-2 mb-4">Ready to Connect with Your Community?</h2>
              <p className="body-large mb-8 max-w-2xl mx-auto">
                Whether you&apos;re looking for reliable services or want to offer your expertise,
                Angel&apos;s List makes it simple, secure, and rewarding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gradient" size="lg" href="/signup?type=provider">
                  Offer Services →
                </Button>
                <Button variant="ghost" size="lg" href="/browse">
                  Find Services →
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}