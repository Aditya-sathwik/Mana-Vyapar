'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Lightformer, Environment, ContactShadows } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function FloatingCard({ position, rotation, scale, color }: { position: [number, number, number], rotation: [number, number, number], scale: number, color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle breathing animation
    ref.current.rotation.y = rotation[1] + Math.sin(t / 2) * 0.1;
    ref.current.rotation.z = rotation[2] + Math.cos(t / 2) * 0.05;
    ref.current.position.y = position[1] + Math.sin(t) * 0.2;
  });

  return (
    <Float floatIntensity={1.5} rotationIntensity={0.5} speed={2}>
      <mesh ref={ref} position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshPhysicalMaterial 
          color={color}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <spotLight position={[0, 10, 10]} intensity={2} penumbra={1} angle={0.2} castShadow color="#10b981" />

      {/* Floating Cards Array */}
      <Suspense fallback={null}>
        <FloatingCard position={isMobile ? [0, 1, -2] : [-3, 0, -2]} rotation={[0, 0.2, -0.1]} scale={1.2} color="#059467" />
        { !isMobile && <FloatingCard position={[3, 1, -3]} rotation={[0, -0.2, 0.1]} scale={1} color="#0f172a" /> }
        <FloatingCard position={isMobile ? [1, -2, -4] : [0, -1.5, -4]} rotation={[0.1, 0, 0.2]} scale={1.5} color="#d1fae5" />
      </Suspense>

      <Environment resolution={256}>
         <group rotation={[-Math.PI / 2, 0, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
        </group>
      </Environment>

      <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4} color="#000000" />
    </>
  );
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background overflow-hidden">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} className="pointer-events-none">
        <Scene />
      </Canvas>
      {/* Gradient Overlay for blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none opacity-50 hidden sm:block" />
    </div>
  );
}
