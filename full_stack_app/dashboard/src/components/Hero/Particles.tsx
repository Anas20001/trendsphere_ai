import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { Vector2 } from 'three';

interface ParticlesProps {
  count: number;
  mouse: React.MutableRefObject<Vector2>;
  color: string;
}

export function Particles({ count, mouse, color }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Generate random positions
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * viewport.width * 2;
    positions[i + 1] = (Math.random() - 0.5) * viewport.height * 2;
    positions[i + 2] = Math.random() * 2;
    
    velocities[i] = (Math.random() - 0.5) * 0.01;
    velocities[i + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i + 2] = (Math.random() - 0.5) * 0.01;
  }

  useFrame(() => {
    if (!mesh.current) return;

    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Update positions based on mouse movement
      const dx = mouse.current.x - positions[i];
      const dy = mouse.current.y - positions[i + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 1) {
        positions[i] += dx * 0.02;
        positions[i + 1] += dy * 0.02;
      }
      
      // Add some natural movement
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
      
      // Wrap around edges
      if (positions[i] > viewport.width) positions[i] = -viewport.width;
      if (positions[i] < -viewport.width) positions[i] = viewport.width;
      if (positions[i + 1] > viewport.height) positions[i + 1] = -viewport.height;
      if (positions[i + 1] < -viewport.height) positions[i + 1] = viewport.height;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation={true}
        color={color}
        transparent
        opacity={0.6}
      />
    </points>
  );
}