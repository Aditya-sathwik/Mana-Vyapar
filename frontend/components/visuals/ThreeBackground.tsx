"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshTransmissionMaterial, PerspectiveCamera } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { Group, Mesh } from "three"
import { useScroll } from "framer-motion"

function GeometricShape({ position, rotation, scale, type = "box" }: any) {
  const meshRef = useRef<Mesh>(null)
  
  // High-end material config for glass look
  const materialProps = {
    thickness: 0.2,
    roughness: 0.1,
    transmission: 1,
    ior: 1.2,
    chromaticAberration: 0.05,
    backside: true,
  }

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      {type === "box" && (
        <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
          <boxGeometry args={[1, 1, 1]} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      )}
      {type === "torus" && (
        <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
          <torusGeometry args={[1, 0.4, 16, 100]} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      )}
      {type === "sphere" && (
        <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      )}
    </Float>
  )
}

function Rig() {
  const groupRef = useRef<Group>(null)
  const { scrollYProgress } = useScroll()

  useFrame((state) => {
    if (groupRef.current) {
      // Rotation based on scroll and mouse position
      const scrollPos = scrollYProgress.get()
      groupRef.current.rotation.y = scrollPos * Math.PI * 2
      groupRef.current.position.y = -scrollPos * 10

      // Subtle mouse follow
      state.camera.position.x += (state.mouse.x * 2 - state.camera.position.x) * 0.05
      state.camera.position.y += (-state.mouse.y * 2 - state.camera.position.y) * 0.05
      state.camera.lookAt(0, 0, 0)
    }
  })

  const shapes = useMemo(() => [
    { type: "box", pos: [2, 1, -2], rot: [0.5, 0.5, 0], scale: 1.2 },
    { type: "torus", pos: [-3, -2, -3], rot: [1, 0, 0.5], scale: 1.5 },
    { type: "sphere", pos: [4, -4, -4], rot: [0, 0, 0], scale: 1 },
    { type: "box", pos: [-2, -6, -2], rot: [0.2, 1, 0.2], scale: 0.8 },
  ], [])

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <GeometricShape key={i} type={s.type} position={s.pos} rotation={s.rot} scale={s.scale} />
      ))}
    </group>
  )
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-white dark:bg-[#09090b]">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Rig />
        {/* Environment and Post-processing could go here for more "wow" factor */}
      </Canvas>
    </div>
  )
}
