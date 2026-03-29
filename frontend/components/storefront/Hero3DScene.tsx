'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Lightformer, Environment, ContactShadows, Html, OrbitControls } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { ShoppingCart, CreditCard, Package, TrendingUp } from 'lucide-react';

// Central Core of the Atom
function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });
  return (
    <Float floatIntensity={2} speed={2}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial 
          color="#10b981" 
          wireframe 
          emissive="#059467" 
          emissiveIntensity={2} 
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>
    </Float>
  );
}

interface ElectronProps {
  radius?: number;
  speed?: number;
  rotationOffset?: [number, number, number];
  icon: any;
  color?: string;
}

// Orbiting Electron with Icon
function Electron({ radius = 2.5, speed = 1, rotationOffset = [0, 0, 0], icon: IconComponent, color = "#10b981" }: ElectronProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (groupRef.current) {
      groupRef.current.rotation.y = t;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = -t;
    }
  });

  return (
    <group rotation={rotationOffset}>
      {/* The Orbit Ring (Using thick robust torus instead of frail line buffers) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.015, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* The Revolve Group */}
      <group ref={groupRef}>
        <mesh ref={meshRef} position={[radius, 0, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            roughness={0.1}
            metalness={0.5}
            transmission={0.9} 
            ior={1.5}
            thickness={0.5}
          />
          <Html center zIndexRange={[100, 0]}>
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg scale-150 relative z-[100]"
              style={{ color }}
            >
              <IconComponent size={14} strokeWidth={2.5} />
            </div>
          </Html>
        </mesh>
      </group>
    </group>
  );
}

function AtomScene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const scale = isMobile ? 0.7 : 1;

  return (
    <group scale={scale} position={[0, isMobile ? 0 : -0.5, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <spotLight position={[0, 10, 10]} intensity={4} penumbra={1} angle={0.2} castShadow color="#10b981" />

      {/* Core Body */}
      <Core />

      {/* Electrons Orbiting */}
      <Suspense fallback={null}>
        <Electron radius={2.5} speed={0.4} rotationOffset={[0.5, 0, 0]} icon={ShoppingCart} />
        <Electron radius={3.2} speed={0.3} rotationOffset={[-0.4, 0, 0.5]} icon={CreditCard} color="#38bdf8" />
        <Electron radius={4.0} speed={0.2} rotationOffset={[0.2, 0, -0.6]} icon={Package} color="#f59e0b" />
        <Electron radius={4.5} speed={0.15} rotationOffset={[-0.3, 0.4, 0.2]} icon={TrendingUp} color="#ec4899" />
      </Suspense>

      {/* Environment Lighting */}
      <Environment resolution={256}>
         <group rotation={[-Math.PI / 2, 0, 0]}>
          <Lightformer intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation={[0, Math.PI / 2, 0]} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation={[0, -Math.PI / 2, 0]} position={[10, 1, 0]} scale={[20, 2, 1]} />
        </group>
      </Environment>

      {/* Floor Shadow */}
      <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={6} color="#000000" />
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotateSpeed={0.5} dampingFactor={0.05} />
    </group>
  );
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden cursor-grab active:cursor-grabbing">
      <Suspense fallback={<div className="w-full h-full" />}>
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }} className="w-full h-full">
          <AtomScene />
        </Canvas>
      </Suspense>
    </div>
  );
}
