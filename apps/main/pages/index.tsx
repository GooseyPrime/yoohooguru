import React from 'react';
import Head from 'next/head';
import Navigation from '../components/ui/Navigation';
import HeroSection from '../components/sections/HeroSection';
import { ServiceCard, ExpertCard } from '../components/ui/Card';
import { TestimonialCarousel } from '../components/ui/TestimonialCard';
import Button from '../components/ui/Button';

export default function Home() {
  // Service data
  const services = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Coach Guru",
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

  // Testimonial data
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
      name: "Maria Garcia",
      role: "Small Business Owner",
      company: "Local Cafe",
      content: "Found an amazing graphic designer through Angel's List who completely redesigned our branding. The process was smooth, communication was excellent, and the results exceeded our expectations.",
      rating: 5,
      date: "1 month ago",
    },
    {
      name: "David Kim",
      role: "Student",
      company: "University",
      content: "Hero Gurus made learning accessible for me. The adaptive teaching methods and patient volunteers helped me master coding concepts I struggled with for years. This platform is changing lives!",
      rating: 5,
      date: "2 months ago",
      featured: true,
    },
    {
      name: "Jennifer Lee",
      role: "Marketing Manager",
      company: "Startup Inc",
      content: "I've been both a learner and a teacher on Coach Guru. The community is supportive, the platform is intuitive, and I've grown both professionally and personally through this experience.",
      rating: 5,
      date: "3 weeks ago",
    },
    {
      name: "Robert Johnson",
      role: "Freelancer",
      company: "Self-Employed",
      content: "Angel's List helped me find consistent clients for my web development services. The secure payment system and review system give both providers and clients peace of mind.",
      rating: 4,
      date: "1 month ago",
    },
    {
      name: "Lisa Chen",
      role: "Parent",
      company: "Community Volunteer",
      content: "My son has learning disabilities and Hero Gurus has been incredible. The volunteer tutors are patient, understanding, and use creative methods that actually work. We're so grateful!",
      rating: 5,
      date: "2 weeks ago",
      featured: true,
    }
  ];

  // Content hub categories
  const contentCategories = [
    { name: "Technology", icon: "💻", count: 245, color: "emerald" },
    { name: "Business", icon: "📊", count: 189, color: "blue" },
    { name: "Creative Arts", icon: "🎨", count: 167, color: "purple" },
    { name: "Health & Fitness", icon: "💪", count: 134, color: "orange" },
    { name: "Education", icon: "📚", count: 156, color: "emerald" },
    { name: "Lifestyle", icon: "🏠", count: 198, color: "blue" },
  ];

  return (
    <>
      <Head>
        <title>YooHoo.Guru - Community Skill Sharing Platform</title>
        <meta name="description" content="Exchange skills, discover purpose, and create exponential community impact. Connect with local experts, learn from professionals, or teach what you love." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="skill sharing, online learning, local services, coaching, tutoring, community platform" />
        <meta property="og:title" content="YooHoo.Guru - Community Skill Sharing Platform" />
        <meta property="og:description" content="Connect with local experts, exchange knowledge, and create meaningful impact through our trusted skill-sharing platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.yoohoo.guru" />
        <meta property="og:image" content="https://www.yoohoo.guru/og-image.jpg" />
      </Head>

      <div className="min-h-screen bg-orbitron-primary">
        <Navigation currentDomain="main" />
        
        {/* Hero Section */}
        <HeroSection variant="main" />

        {/* Services Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-secondarydark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="heading-2 mb-4">Choose Your Path</h2>
              <p className="body-large max-w-3xl mx-auto">
                Three unique ways to learn, earn, and make an impact in your community. 
                Whether you're seeking knowledge, offering expertise, or volunteering time, we have a place for you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ServiceCard {...service} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Experts Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">Meet Our Expert Gurus</h2>
              <p className="body-large max-w-3xl mx-auto">
                Learn from the best. Our verified experts bring years of experience and a passion for teaching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredExperts.map((expert, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ExpertCard {...expert} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="gradient" size="lg" href="https://coach.yoohoo.guru/experts">
                Browse All Experts →
              </Button>
            </div>
          </div>
        </section>

        {/* Content Hubs Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-secondarydark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">Explore Our Content Hubs</h2>
              <p className="body-large max-w-3xl mx-auto">
                Discover expert-curated content across 24 specialized topics. 
                Each hub features AI-curated news, tutorials, and community insights.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
              {contentCategories.map((category, index) => (
                <a
                  key={index}
                  href={`https://${category.name.toLowerCase().replace(' & ', '').replace(' ', '-')}.yoohoo.guru`}
                  className="card-hover text-center p-6 group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.count} articles</p>
                </a>
              ))}
            </div>

            <div className="text-center">
              <Button variant="ghost" size="lg" href="/hubs">
                View All 24 Hubs →
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">Success Stories from Our Community</h2>
              <p className="body-large max-w-3xl mx-auto">
                Join thousands of satisfied members who are transforming their lives through skill sharing.
              </p>
            </div>

            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-secondarydark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-3 mb-4">Trusted by Leading Organizations</h2>
              <p className="body-normal">
                Partner companies and educational institutions that trust our platform
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {[
                "TechCorp", "EduTech", "StartHub", "DesignLab", 
                "CloudNet", "InnovateCo", "LearnFast", "SkillUp",
                "FutureEd", "TechAcademy", "CreativeHub", "BusinessPro"
              ].map((partner, index) => (
                <div key={index} className="glass-effect p-6 rounded-lg flex items-center justify-center h-20">
                  <span className="text-gray-500 font-medium text-sm">
                    {partner} Logo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-featured text-center p-12">
              <h2 className="heading-2 mb-4">Ready to Join Our Community?</h2>
              <p className="body-large mb-8 max-w-2xl mx-auto">
                Start sharing your skills, learning from experts, or volunteering your time. 
                Your journey to making an impact begins here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gradient" size="lg" href="/signup">
                  Get Started Free →
                </Button>
                <Button variant="ghost" size="lg" href="/how-it-works">
                  Learn How It Works
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
                <div>
                  <div className="text-3xl font-bold text-emerald-400 mb-2">10,000+</div>
                  <div className="text-sm text-gray-400">Active Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                  <div className="text-sm text-gray-400">Expert Instructors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">25,000+</div>
                  <div className="text-sm text-gray-400">Learning Sessions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 mb-2">98%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}