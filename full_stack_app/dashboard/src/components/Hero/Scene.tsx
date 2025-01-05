import React from 'react';
import { Vector2 } from 'three';
import { Particles } from './Particles';

interface SceneProps {
  mouse: React.MutableRefObject<Vector2>;
  particleColor: string;
}

export function Scene({ mouse, particleColor }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Particles count={200} mouse={mouse} color={particleColor} />
    </>
  );
}