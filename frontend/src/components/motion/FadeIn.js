import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

export function FadeIn({ delay = 0, y = 10, children, ...rest }) {
  const reduced = useReducedMotion();
  
  if (reduced) return <div {...rest}>{children}</div>;
  
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay, ease: [0.2,0.7,0.25,1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}