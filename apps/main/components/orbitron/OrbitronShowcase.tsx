import React from 'react';
import { motion } from 'framer-motion';

const OrbitronShowcase: React.FC = () => {
  const showcaseItems = [
    { 
      id: 1, 
      title: "Intelligent Dashboard", 
      description: "AI-powered insights and personalized learning recommendations",
      gradient: "from-emerald-500 to-teal-600",
      iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    },
    { 
      id: 2, 
      title: "Smart Matching", 
      description: "Advanced algorithms connect you with perfect skill partners",
      gradient: "from-blue-500 to-indigo-600",
      iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    },
    { 
      id: 3, 
      title: "Seamless Booking", 
      description: "One-click scheduling with integrated payments and calendar sync",
      gradient: "from-purple-500 to-pink-600",
      iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    },
    { 
      id: 4, 
      title: "HD Video Learning", 
      description: "Crystal-clear video sessions with interactive whiteboard tools",
      gradient: "from-red-500 to-orange-600",
      iconPath: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    },
    { 
      id: 5, 
      title: "Dynamic Profiles", 
      description: "Showcase your expertise with rich portfolios and skill verification",
      gradient: "from-cyan-500 to-blue-600",
      iconPath: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    },
    { 
      id: 6, 
      title: "Global Community", 
      description: "Connect with learners and experts from around the world",
      gradient: "from-green-500 to-emerald-600",
      iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-secondarydark via-gray-900 to-primarydark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full filter blur-3xl opacity-5"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-5"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            Platform Showcase
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-white mb-8" style={{ lineHeight: '1.2' }}>
            Powerful Tools for
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Meaningful Learning
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto" style={{ lineHeight: '1.7' }}>
            Every feature is designed to enhance your learning journey and create 
            deeper connections within our global community.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 group-hover:transform group-hover:scale-105">
                {/* Dynamic gradient header */}
                <div className={`h-24 bg-gradient-to-br ${item.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-2 h-2 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.iconPath} />
                      </svg>
                    </motion.div>
                  </div>
                  
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg md:text-xl font-orbitron font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors duration-300" style={{ lineHeight: '1.3' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base" style={{ lineHeight: '1.6' }}>
                    {item.description}
                  </p>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="inline-flex items-center space-x-6 p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-orbitron font-bold text-white mb-2" style={{ lineHeight: '1.3' }}>Ready to Experience the Future?</h3>
              <p className="text-gray-300 text-sm md:text-base" style={{ lineHeight: '1.5' }}>Join thousands of learners already transforming their skills</p>
            </div>
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OrbitronShowcase;