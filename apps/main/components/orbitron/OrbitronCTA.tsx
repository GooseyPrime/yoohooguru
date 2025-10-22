import React from 'react';
import { motion } from 'framer-motion';

const OrbitronCTA: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primarydark to-secondarydark">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          className="text-3xl md:text-5xl font-orbitron font-bold mb-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Ready to Transform Your Learning Experience?
        </motion.h2>
        
        <motion.p 
          className="text-xl font-orbitron mb-12 text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Join our community today and unlock new possibilities for skill sharing and personal growth.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button className="px-12 py-4 bg-emerald-400 text-black font-orbitron font-bold text-xl rounded-lg hover:bg-emerald-300 transition-all duration-300 transform hover:scale-105">
            Join Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default OrbitronCTA;