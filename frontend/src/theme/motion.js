const motion = {
  duration: { fast: 0.14, med: 0.2, slow: 0.26 },
  easeIn: [0.2, 0.7, 0.25, 1],
  easeOut: [0.3, 0.1, 0.2, 1],
  springSoft: { type: 'spring', stiffness: 340, damping: 30, mass: 0.9 },
  springTight: { type: 'spring', stiffness: 480, damping: 38, mass: 0.9 }
};

export default motion;