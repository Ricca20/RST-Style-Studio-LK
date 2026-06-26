'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function Scroll3DWrapper({ children, intensity = 1, className = '' }) {
  const ref = useRef(null);
  
  // Track the scroll progress of the target element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth the scroll progress so the animations feel less jittery
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 3D Transforms based on scroll position
  // Exaggerate the tilt and zoom for a highly pronounced 3D scrolling effect
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [45 * intensity, 0, -45 * intensity]);
  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [-10 * intensity, 0, 10 * intensity]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 0.7]);
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0, 0.5, 1], [250 * intensity, 0, -250 * intensity]);
  const z = useTransform(smoothProgress, [0, 0.5, 1], [-300 * intensity, 0, -300 * intensity]);

  return (
    <div ref={ref} className={`perspective-1200 ${className}`}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          opacity,
          y,
          z,
          transformStyle: "preserve-3d"
        }}
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
