import React from 'react';
import { motion } from 'framer-motion';

const OrbitronFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-4 bg-gradient-to-br from-primarydark to-secondarydark border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-orbitron font-bold mb-4 text-white">YooHoo.Guru</h3>
            <p className="text-gray-300 font-orbitron mb-4 max-w-md">
              A neighborhood-based skill-sharing platform where users exchange skills,
              discover purpose, and create exponential community impact.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="text-lg font-orbitron font-bold mb-4 text-white">Platform</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors font-orbitron">About Us</a></li>
              <li><a href="/how-it-works" className="text-gray-300 hover:text-emerald-400 transition-colors font-orbitron">How It Works</a></li>
              <li><a href="/pricing" className="text-gray-300 hover:text-emerald-400 transition-colors font-orbitron">Pricing</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-emerald-400 transition-colors font-orbitron">Blog</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="text-lg font-orbitron font-bold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-300 hover:text-emerald-400 transition-colors font-orbitron">Help Center</a></li>
              <li><a href="/safety" className="text-gray-300 hover:text-emerald-400 transition-colors font-orbitron">Safety</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors font-orbitron">Contact Us</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-emerald-400 transition-colors font-orbitron">FAQ</a></li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-gray-800 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-400 font-orbitron">© {currentYear} YooHoo.Guru. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default OrbitronFooter;