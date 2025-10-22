import React from 'react';
import { motion } from 'framer-motion';

const OrbitronHero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primarydark to-secondarydark"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.h1 
          className="text-5xl md:text-7xl font-orbitron font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          ORBITRON <span className="text-emerald-400">EXPERIENCE</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl font-orbitron mb-12 text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Transform your digital journey with our cutting-edge platform. 
          Experience the future of skill sharing and community connection.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <button className="px-8 py-4 bg-emerald-400 text-black font-orbitron font-bold rounded-lg hover:bg-emerald-300 transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-emerald-400 text-emerald-400 font-orbitron font-bold rounded-lg hover:bg-emerald-400 hover:text-black transition-all duration-300 transform hover:scale-105">
            Learn More
          </button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="flex flex-col items-center">
          <span className="mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8 border-r-2 border-b-2 border-emerald-400 rotate-45"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default OrbitronHero;