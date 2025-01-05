import React from 'react';
import { Vector2, Color } from 'three';
import { Particles } from './Particles';

interface SceneProps {
  mouse: React.MutableRefObject<Vector2>;
  particleColor: string;
  isInView: boolean;
}

export function Scene({ mouse, particleColor, isInView }: SceneProps) {
  const color = new Color(particleColor);

  return (
    <>
      <ambientLight intensity={0.5} />
      <Particles 
        count={150} 
        mouse={mouse} 
        color={color} 
        isActive={isInView}
      />
    </>
  );
}