import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Service3DIconProps {
  serviceId: string;
  isHovered: boolean;
}

// 1. Construction: Simplified crane tower with jib and orange hook
function ConstructionModel({ isHovered }: { isHovered: boolean }) {
  const group = useRef<THREE.Group>(null);
  const hookGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const speed = isHovered ? 2.0 : 0.5;
    group.current.rotation.y += delta * speed;
    if (hookGroup.current) {
      hookGroup.current.position.y = isHovered ? -0.05 : -0.15;
    }
  });

  return (
    <group ref={group}>
      {/* Tower */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.12, 1.0, 0.12]} />
        <meshStandardMaterial color="#0B1F3A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Jib */}
      <mesh position={[0.25, 0.35, 0]}>
        <boxGeometry args={[0.9, 0.1, 0.1]} />
        <meshStandardMaterial color="#1F2A37" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Counterweight */}
      <mesh position={[-0.4, 0.35, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color="#0B1F3A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Cable with orange hook */}
      <group ref={hookGroup} position={[0.55, 0.35, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.35, 6]} />
          <meshStandardMaterial color="#8A8F98" />
        </mesh>
        <mesh position={[0, -0.38, 0]}>
          <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI * 1.5]} />
          <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// 2. Civil Works: Simplified bridge arch with road deck and orange centerline
function CivilModel({ isHovered }: { isHovered: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const speed = isHovered ? 2.0 : 0.5;
    group.current.rotation.y += delta * speed;
  });

  return (
    <group ref={group}>
      {/* Bridge arch */}
      <mesh position={[0, -0.15, 0]}>
        <torusGeometry args={[0.7, 0.12, 10, 20, Math.PI]} />
        <meshStandardMaterial color="#0B1F3A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Road deck */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#1F2A37" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Support pillars */}
      <mesh position={[-0.6, -0.35, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.4]} />
        <meshStandardMaterial color="#0B1F3A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.6, -0.35, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.4]} />
        <meshStandardMaterial color="#0B1F3A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Orange centerline */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[1.5, 0.02, 0.06]} />
        <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

// 3. Electrical: Simplified lightning bolt with orange glow
function ElectricalModel({ isHovered }: { isHovered: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const speed = isHovered ? 2.0 : 0.5;
    group.current.rotation.y += delta * speed;
  });

  return (
    <group ref={group}>
      {/* Lightning bolt segments */}
      <mesh position={[0.1, 0.25, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[-0.08, 0, 0]}>
        <boxGeometry args={[0.35, 0.12, 0.12]} />
        <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[-0.12, -0.28, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.12, 0.45, 0.12]} />
        <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Metallic ring housing */}
      <mesh rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[0.65, 0.08, 8, 24]} />
        <meshStandardMaterial color="#0B1F3A" roughness={0.3} metalness={0.85} />
      </mesh>
    </group>
  );
}

// 4. Fire & Safety: Simplified shield with extinguisher and orange handle
function FireSafetyModel({ isHovered }: { isHovered: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const speed = isHovered ? 2.0 : 0.5;
    group.current.rotation.y += delta * speed;
  });

  return (
    <group ref={group}>
      {/* Shield background */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[0.9, 1.1, 0.08]} />
        <meshStandardMaterial color="#0B1F3A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Extinguisher body */}
      <mesh position={[0, -0.1, 0.05]}>
        <cylinderGeometry args={[0.18, 0.18, 0.7, 16]} />
        <meshStandardMaterial color="#1F2A37" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Extinguisher top dome */}
      <mesh position={[0, 0.25, 0.05]}>
        <sphereGeometry args={[0.18, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1F2A37" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Orange handle and nozzle */}
      <group position={[0, 0.35, 0.05]}>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[-0.12, -0.08, 0.06]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.03, 0.04, 0.18, 6]} />
          <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// 5. General Order Supplier: Stacked crates with orange strapping
function GeneralSupplyModel({ isHovered }: { isHovered: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const speed = isHovered ? 2.0 : 0.5;
    group.current.rotation.y += delta * speed;
  });

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      {/* Bottom crate */}
      <mesh position={[-0.25, -0.25, 0]}>
        <boxGeometry args={[0.5, 0.45, 0.5]} />
        <meshStandardMaterial color="#0B1F3A" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Middle crate */}
      <mesh position={[0.25, -0.25, 0]}>
        <boxGeometry args={[0.5, 0.45, 0.5]} />
        <meshStandardMaterial color="#1F2A37" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Top crate */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.55, 0.5, 0.55]} />
        <meshStandardMaterial color="#2C394B" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Orange strapping on top crate */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.57, 0.06, 0.57]} />
        <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.06, 0.52, 0.57]} />
        <meshStandardMaterial color="#FF6B00" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

export const Service3DIcon: React.FC<Service3DIconProps> = ({ serviceId, isHovered }) => {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const renderIconModel = () => {
    switch (serviceId) {
      case "construction":
        return <ConstructionModel isHovered={isHovered} />;
      case "civil":
        return <CivilModel isHovered={isHovered} />;
      case "electrical":
        return <ElectricalModel isHovered={isHovered} />;
      case "fire-safety":
        return <FireSafetyModel isHovered={isHovered} />;
      case "supply":
      default:
        return <GeneralSupplyModel isHovered={isHovered} />;
    }
  };

  return (
    <div
      className={`relative w-16 h-16 md:w-20 md:h-20 transition-transform duration-300 ${
        isHovered ? "scale-105" : "scale-100"
      }`}
    >
      <Canvas
        frameloop={prefersReducedMotion ? "demand" : "always"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.3, 2.5], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 3]} intensity={2.0} color="#FFFFFF" />
        {renderIconModel()}
      </Canvas>
    </div>
  );
};
