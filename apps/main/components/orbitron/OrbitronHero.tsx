import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const OrbitronHero: React.FC = () => {
  const services = [
    {
      title: "SkillShare by Coach Guru",
      description: "Learn from experts. Become a Guru. Exchange knowledge through personalized coaching.",
      link: "/coach",
      icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Hero Gurus",
      description: "Join the Heroes. Empower and be empowered through adaptive teaching and inclusive learning.",
      link: "/heroes", 
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Angel's List",
      description: "List a Gig. Help or get help through Angel's List. Find local services and offer your help.",
      link: "/angel",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      gradient: "from-blue-500 to-indigo-600"
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primarydark via-gray-900 to-secondarydark overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Subtle animated orbs */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/6 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl opacity-5"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-5"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.05, 0.08]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
      </div>
      

        {/* Hero Text */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Next-generation platform
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-8 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            style={{ lineHeight: '1.1' }}
          >
            Build Your Future
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Through Skills
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            style={{ lineHeight: '1.6' }}
          >
            Join a revolutionary platform where knowledge flows freely, 
            communities thrive, and every interaction creates exponential value.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <button className="group relative px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xl rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25">
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group px-12 py-5 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white font-bold text-xl rounded-xl transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center">
                Explore Platform
                <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </motion.div>
        </div>

        {/* Three Service Cards */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.link}
                className="group relative block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:bg-white/10">
                  {/* Gradient header */}
                  <div className={`h-16 bg-gradient-to-br ${service.gradient} relative`}>
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {/* Icon */}
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                        </svg>
                      </motion.div>
                    </div>
                  </div>                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-orbitron font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {service.description}
                    </p>
                    <div className="flex items-center text-emerald-400 font-medium text-sm">
                      <span>Explore</span>
                      <svg className="ml-1 w-1 h-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-gray-400 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Trusted by 10,000+ learners
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </div>
            500+ skills available
          </div>
        </motion.div>
      </div>
      
      {/* Prominent scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-gray-300 cursor-pointer hover:text-emerald-400 transition-colors"
        >
          <span className="text-sm mb-3 font-medium">Discover More Features</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full relative">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-3 bg-emerald-400 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
            ></motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OrbitronHero;