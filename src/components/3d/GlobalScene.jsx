'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'three/src/math/MathUtils';

function ParticleCloud({ count = 1500 }) {
  const ref = useRef();
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 10;
      const theta = random.randFloatSpread(360); 
      const phi = random.randFloatSpread(360); 

      p[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      p[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      p[i * 3 + 2] = radius * Math.cos(theta);
    }
    return p;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 40;
      ref.current.rotation.y -= delta / 50;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#0ea5e9"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

export default function GlobalScene() {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ParticleCloud />
      </Canvas>
    </div>
  );
}
