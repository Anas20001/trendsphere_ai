import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { Vector2, Color, BufferAttribute } from 'three';

interface ParticlesProps {
  count: number;
  mouse: React.MutableRefObject<Vector2>;
  color: Color;
  isActive: boolean;
}

export function Particles({ count, mouse, color, isActive }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Create initial positions and velocities using useMemo
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Grid formation
      const col = (i % Math.sqrt(count)) - Math.sqrt(count) / 2;
      const row = Math.floor(i / Math.sqrt(count)) - Math.sqrt(count) / 2;
      
      positions[i3] = col * 0.2;
      positions[i3 + 1] = row * 0.2;
      positions[i3 + 2] = 0;

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return { positions, velocities };
  }, [count]);

  // Create and update position attribute
  const positionRef = useRef<BufferAttribute>(
    new BufferAttribute(positions, 3)
  );

  useFrame((state) => {
    if (!mesh.current) return;

    const positions = positionRef.current.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < positions.length; i += 3) {
      if (isActive) {
        // Mouse interaction
        const dx = mouse.current.x - positions[i];
        const dy = mouse.current.y - positions[i + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 1) {
          positions[i] += dx * 0.01 * Math.sin(time + i);
          positions[i + 1] += dy * 0.01 * Math.cos(time + i);
        }

        // Add natural movement
        positions[i] += velocities[i] * Math.sin(time * 0.5 + i);
        positions[i + 1] += velocities[i + 1] * Math.cos(time * 0.5 + i);
        positions[i + 2] += velocities[i + 2];
      } else {
        // Return to grid formation
        const col = ((i / 3) % Math.sqrt(count)) - Math.sqrt(count) / 2;
        const row = Math.floor((i / 3) / Math.sqrt(count)) - Math.sqrt(count) / 2;
        
        positions[i] += (col * 0.2 - positions[i]) * 0.05;
        positions[i + 1] += (row * 0.2 - positions[i + 1]) * 0.05;
        positions[i + 2] += (0 - positions[i + 2]) * 0.05;
      }

      // Wrap around edges
      if (positions[i] > viewport.width) positions[i] = -viewport.width;
      if (positions[i] < -viewport.width) positions[i] = viewport.width;
      if (positions[i + 1] > viewport.height) positions[i + 1] = -viewport.height;
      if (positions[i + 1] < -viewport.height) positions[i + 1] = viewport.height;
    }

    positionRef.current.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute ref={positionRef} attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation={true}
        color={color}
        transparent
        opacity={0.8}
        alphaTest={0.001}
      />
    </points>
  );
}