'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useSpring(0, { stiffness: 400, damping: 30 });
  const y = useSpring(0, { stiffness: 400, damping: 30 });

  const rotateX = useTransform(y, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative perspective-1200 ${className}`}
      initial={{ scale: 1 }}
      animate={{ scale: isHovered ? 1.05 : 1, zIndex: isHovered ? 20 : 10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div 
        style={{ transform: 'translateZ(60px)' }}
        className="w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl"
      >
        {children}
      </div>
      
      {/* Glossy Overlay */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none rounded-xl"
          style={{
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 25%, transparent 30%)',
            backgroundSize: '200% 200%',
            opacity: 0.5,
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0']
          }}
          transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
