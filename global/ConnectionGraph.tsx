"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  useTexture,
  Html,
  Line,
} from "@react-three/drei";
import { useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Decal } from "@react-three/drei";

/* ---------------- NODE ---------------- */
function Node({ position, isCenter, image, isSecondDegree , username }: any) {
  const texture = useTexture(image || "/User-Prof.png");
  const [hovered, setHovered] = useState(false);
  const ref = useRef<any>();

  useFrame(({ clock }) => {
  if (!ref.current) return;

  ref.current.position.y =
    position[1] +
    Math.sin(clock.elapsedTime + position[0]) * 0.1;
  });

  return (
    <group ref={ref} position={position}>
      {/* Avatar Sphere */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.25 : 1}
      >
        <sphereGeometry args={[isCenter ? 0.7 : 0.45, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          color={
          isCenter
            ? "#facc15"
            : isSecondDegree
            ? "#64748b"
            : "#06b6d4"
          }
          emissive={
          isCenter
            ? "#facc15"
            : isSecondDegree
            ? "#334155"
            : "#06b6d4"
          }
          emissiveIntensity={hovered ? 1 : 0.4}
        />
      </mesh>

      {/* Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.9, 32]} />
        <meshBasicMaterial
          // color="#06b6d4"
          color={isCenter ? "#facc15" : isSecondDegree ? "#64748b" : "#06b6d4"}
          transparent
          opacity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Hover Username */}
      {hovered && (
        <Html distanceFactor={8}>
          <div className="bg-black/80 text-cyan-400 px-3 py-1 rounded-md text-sm shadow-lg border border-cyan-500 whitespace-nowrap">
            @{username}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ---------------- EDGE ---------------- */
function Edge({ start, end }: any) {
  return (
    <Line
      points={[start, end]}
      color="#06b6d4"
      lineWidth={1}
      transparent
      opacity={0.4}
    />
  );
}

/* ---------------- MAIN GRAPH ---------------- */
export default function ConnectionGraph({ data }: any) {
  if (!data || !data.nodes) return null;

  /* 🔥 optimize lookup instead of .find() every render */
  const nodeMap = useMemo(() => {
    const map = new Map();
    data.nodes.forEach((n: any) => map.set(n.id, n));
    return map;
  }, [data.nodes]);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        
        {/* BACKGROUND */}
        <color attach="background" args={["#020617"]} />

        {/* LIGHTING */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#06b6d4" intensity={2} />

        {/* STARS */}
        <Stars radius={100} depth={50} count={2000} factor={3} fade />

        {/* CONTROLS */}
        <OrbitControls enableZoom enablePan autoRotate autoRotateSpeed={0.5} />

        {/* NODES */}
        {data.nodes.map((node: any) => (
          <Node
            key={node.id}
            position={node.position}
            isCenter={node.isCenter}
            image={node.profilePhoto}
            isSecondDegree={node.isSecondDegree}
            username={node.username}
          />
        ))}

        {/* EDGES */}
        {data.edges.map((edge: any, i: number) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);

          if (!from || !to) return null;

          return (
            <Edge
              key={i}
              start={from.position}
              end={to.position}
            />
          );
        })}

      </Canvas>
    </div>
  );
}