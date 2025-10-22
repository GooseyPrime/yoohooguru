import React from 'react';
import { motion } from 'framer-motion';

const OrbitronShowcase: React.FC = () => {
  // Sample showcase items - in a real implementation, these would be actual screenshots or images
  const showcaseItems = [
    { id: 1, title: "Dashboard Interface", description: "Modern dashboard with intuitive controls" },
    { id: 2, title: "Skill Search", description: "Advanced filtering for finding the right expertise" },
    { id: 3, title: "Session Booking", description: "Seamless scheduling with integrated payments" },
    { id: 4, title: "Video Conferencing", description: "High-quality real-time learning sessions" },
    { id: 5, title: "Profile Management", description: "Comprehensive profile customization" },
    { id: 6, title: "Community Forum", description: "Engage with other learners and teachers" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primarydark to-secondarydark">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-orbitron font-bold text-center mb-16 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Platform Showcase
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-black bg-opacity-30 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden hover:border-emerald-400 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* Placeholder for image - in a real implementation, this would be an actual screenshot */}
              <div className="h-48 bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center">
                <div className="text-5xl">🖼️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-orbitron font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-300 font-orbitron">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrbitronShowcase;