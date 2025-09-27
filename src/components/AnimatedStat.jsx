import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const AnimatedStat = ({ value, label, delay = 0, duration = 2 }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    
    const controls = animate(motionValue, value, {
      duration: duration,
      delay: delay,
      ease: [0.25, 0.1, 0.25, 1], // Custom easing for slot machine effect
      onComplete: () => {
        setIsAnimating(false);
      }
    });

    return controls.stop;
  }, [motionValue, value, delay, duration]);

  return (
    <motion.div 
      className='statbox'
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <p>{label}</p>
      <div className='stat'>
        <motion.p 
          style={{ 
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#2c3e50',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #3498db, #9b59b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          animate={isAnimating ? {
            scale: [1, 1.1, 1],
            rotateZ: [0, 1, -1, 0]
          } : {}}
          transition={{
            duration: 0.3,
            repeat: isAnimating ? 2 : 0,
            ease: "easeInOut"
          }}
        >
          {rounded}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default AnimatedStat;
