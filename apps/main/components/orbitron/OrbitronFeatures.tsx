import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Skill Exchange",
    description: "Connect with experts and share your knowledge in a vibrant community",
    icon: "🎓"
  },
  {
    title: "Community Impact",
    description: "Create exponential value through collaborative learning and teaching",
    icon: "🌟"
  },
  {
    title: "Adaptive Learning",
    description: "Personalized education paths that adapt to your learning style",
    icon: "🧠"
  }
];

const OrbitronFeatures: React.FC = () => {
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
          Platform Features
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-black bg-opacity-30 backdrop-blur-lg border border-gray-700 rounded-xl p-8 text-center hover:border-emerald-400 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-orbitron font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-300 font-orbitron">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrbitronFeatures;