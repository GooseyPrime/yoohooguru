import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

const variants = {
  initial: { opacity: 0, y: 8 },
  enter:   { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 }
};

export default function RouteTransition({ locationKey, children }) {
  const reduced = useReducedMotion();
  
  if (reduced) return <>{children}</>;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={locationKey}
        initial="initial" 
        animate="enter" 
        exit="exit"
        variants={variants}
        transition={{ duration: 0.20, ease: [0.2,0.7,0.25,1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}