import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Skill Exchange",
    description: "Connect with experts and share knowledge in our vibrant community",
    iconPath: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
  },
  {
    title: "Community Impact", 
    description: "Create exponential value through collaborative learning and meaningful connections",
    iconPath: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
  },
  {
    title: "Adaptive Learning",
    description: "AI-powered education paths that adapt to your unique learning style",
    iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
  }
];

const OrbitronFeatures: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-primarydark to-gray-900 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-6" style={{ lineHeight: '1.2' }}>
            Why Choose
            <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto" style={{ lineHeight: '1.6' }}>
            Experience the future of learning with our cutting-edge features designed for maximum impact.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                {/* Icon - same size as red test box */}
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-1 h-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.iconPath} />
                  </svg>
                </div>
                
                <h3 className="text-xl font-orbitron font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors duration-300" style={{ lineHeight: '1.3' }}>
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 text-base" style={{ lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrbitronFeatures;