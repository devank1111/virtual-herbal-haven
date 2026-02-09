import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Text } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Per-plant shape configuration                                     */
/* ------------------------------------------------------------------ */

interface PlantConfig {
  stemColor: string;
  leafColor: string;
  flowerColor: string;
  leafCount: number;
  hasFlower: boolean;
  leafShape: "broad" | "narrow" | "round" | "pointed";
  stemHeight: number;
  trunkStyle: "thin" | "thick" | "vine";
}

const plantConfigs: Record<string, PlantConfig> = {
  tulsi: {
    stemColor: "#4a7c5c",
    leafColor: "#3d8b37",
    flowerColor: "#9b59b6",
    leafCount: 12,
    hasFlower: true,
    leafShape: "broad",
    stemHeight: 1.6,
    trunkStyle: "thin",
  },
  ashwagandha: {
    stemColor: "#6b7c3a",
    leafColor: "#5a8c2a",
    flowerColor: "#e8d44d",
    leafCount: 10,
    hasFlower: true,
    leafShape: "pointed",
    stemHeight: 1.8,
    trunkStyle: "thin",
  },
  turmeric: {
    stemColor: "#7a8c3a",
    leafColor: "#2e7d32",
    flowerColor: "#ff9800",
    leafCount: 6,
    hasFlower: true,
    leafShape: "broad",
    stemHeight: 1.4,
    trunkStyle: "thick",
  },
  neem: {
    stemColor: "#5d4037",
    leafColor: "#388e3c",
    flowerColor: "#fff9c4",
    leafCount: 16,
    hasFlower: false,
    leafShape: "narrow",
    stemHeight: 2.2,
    trunkStyle: "thick",
  },
  "aloe-vera": {
    stemColor: "#66bb6a",
    leafColor: "#43a047",
    flowerColor: "#ff7043",
    leafCount: 8,
    hasFlower: false,
    leafShape: "pointed",
    stemHeight: 0.3,
    trunkStyle: "thick",
  },
  brahmi: {
    stemColor: "#4caf50",
    leafColor: "#2e7d32",
    flowerColor: "#e1f5fe",
    leafCount: 14,
    hasFlower: true,
    leafShape: "round",
    stemHeight: 0.8,
    trunkStyle: "vine",
  },
  amla: {
    stemColor: "#795548",
    leafColor: "#558b2f",
    flowerColor: "#c8e6c9",
    leafCount: 14,
    hasFlower: true,
    leafShape: "narrow",
    stemHeight: 2.0,
    trunkStyle: "thick",
  },
  shatavari: {
    stemColor: "#6d8764",
    leafColor: "#81c784",
    flowerColor: "#fce4ec",
    leafCount: 18,
    hasFlower: true,
    leafShape: "narrow",
    stemHeight: 1.8,
    trunkStyle: "vine",
  },
  giloy: {
    stemColor: "#6d4c41",
    leafColor: "#43a047",
    flowerColor: "#fff176",
    leafCount: 10,
    hasFlower: false,
    leafShape: "round",
    stemHeight: 1.6,
    trunkStyle: "vine",
  },
  lavender: {
    stemColor: "#7c9473",
    leafColor: "#78909c",
    flowerColor: "#9c27b0",
    leafCount: 8,
    hasFlower: true,
    leafShape: "narrow",
    stemHeight: 1.4,
    trunkStyle: "thin",
  },
};

const defaultConfig: PlantConfig = {
  stemColor: "#4a7c5c",
  leafColor: "#3d8b37",
  flowerColor: "#e8d44d",
  leafCount: 10,
  hasFlower: true,
  leafShape: "broad",
  stemHeight: 1.6,
  trunkStyle: "thin",
};

/* ------------------------------------------------------------------ */
/*  Leaf geometry                                                     */
/* ------------------------------------------------------------------ */

function Leaf({
  position,
  rotation,
  scale,
  color,
  shape,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  shape: PlantConfig["leafShape"];
}) {
  const leafRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.Shape();
    switch (shape) {
      case "broad":
        geo.moveTo(0, 0);
        geo.quadraticCurveTo(0.15, 0.2, 0.1, 0.5);
        geo.quadraticCurveTo(0, 0.65, -0.1, 0.5);
        geo.quadraticCurveTo(-0.15, 0.2, 0, 0);
        break;
      case "narrow":
        geo.moveTo(0, 0);
        geo.quadraticCurveTo(0.06, 0.25, 0.04, 0.55);
        geo.quadraticCurveTo(0, 0.65, -0.04, 0.55);
        geo.quadraticCurveTo(-0.06, 0.25, 0, 0);
        break;
      case "round":
        geo.moveTo(0, 0);
        geo.quadraticCurveTo(0.2, 0.15, 0.18, 0.35);
        geo.quadraticCurveTo(0.1, 0.55, 0, 0.5);
        geo.quadraticCurveTo(-0.1, 0.55, -0.18, 0.35);
        geo.quadraticCurveTo(-0.2, 0.15, 0, 0);
        break;
      case "pointed":
        geo.moveTo(0, 0);
        geo.quadraticCurveTo(0.12, 0.1, 0.08, 0.45);
        geo.quadraticCurveTo(0.02, 0.7, 0, 0.75);
        geo.quadraticCurveTo(-0.02, 0.7, -0.08, 0.45);
        geo.quadraticCurveTo(-0.12, 0.1, 0, 0);
        break;
    }
    return new THREE.ShapeGeometry(geo);
  }, [shape]);

  useFrame(({ clock }) => {
    if (leafRef.current) {
      leafRef.current.rotation.z =
        rotation[2] + Math.sin(clock.getElapsedTime() * 1.2 + position[1] * 3) * 0.06;
    }
  });

  return (
    <group ref={leafRef} position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          side={THREE.DoubleSide}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>
      {/* leaf vein */}
      <mesh position={[0, 0.25, 0.002]}>
        <cylinderGeometry args={[0.003, 0.003, 0.45, 4]} />
        <meshStandardMaterial color="#2e5e2e" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Flower component                                                  */
/* ------------------------------------------------------------------ */

function Flower({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* center */}
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#f9e54a" roughness={0.4} />
      </mesh>
      {/* petals */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.1, 0, Math.sin(angle) * 0.1]}
            rotation={[0, -angle, Math.PI / 6]}
          >
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Soil / Pot                                                        */
/* ------------------------------------------------------------------ */

function Pot() {
  return (
    <group position={[0, -1.2, 0]}>
      {/* pot body */}
      <mesh>
        <cylinderGeometry args={[0.55, 0.42, 0.7, 24]} />
        <meshStandardMaterial color="#8d5524" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* pot rim */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.55, 0.04, 8, 24]} />
        <meshStandardMaterial color="#7a4420" roughness={0.8} />
      </mesh>
      {/* soil surface */}
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 24]} />
        <meshStandardMaterial color="#3e2723" roughness={1} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Full procedural plant model                                       */
/* ------------------------------------------------------------------ */

function PlantModel({ plantId }: { plantId: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const config = plantConfigs[plantId] || defaultConfig;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  const leaves = useMemo(() => {
    const items: {
      pos: [number, number, number];
      rot: [number, number, number];
      s: number;
    }[] = [];
    for (let i = 0; i < config.leafCount; i++) {
      const angle = (i / config.leafCount) * Math.PI * 2 + (i % 2) * 0.3;
      const heightRatio = 0.3 + (i / config.leafCount) * 0.65;
      const y = -0.85 + heightRatio * config.stemHeight;
      const radius = 0.12 + (1 - heightRatio) * 0.12;
      const tilt = 0.3 + (1 - heightRatio) * 0.8;
      const scl = 0.7 + heightRatio * 0.8;
      items.push({
        pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        rot: [tilt, angle, 0],
        s: scl,
      });
    }
    return items;
  }, [config]);

  return (
    <group ref={groupRef}>
      <Pot />

      {/* Stem */}
      <mesh position={[0, -0.85 + config.stemHeight / 2, 0]}>
        <cylinderGeometry
          args={[
            config.trunkStyle === "thick" ? 0.06 : config.trunkStyle === "vine" ? 0.03 : 0.04,
            config.trunkStyle === "thick" ? 0.08 : config.trunkStyle === "vine" ? 0.04 : 0.05,
            config.stemHeight,
            8,
          ]}
        />
        <meshStandardMaterial color={config.stemColor} roughness={0.85} />
      </mesh>

      {/* Vine branches for vine-style */}
      {config.trunkStyle === "vine" &&
        [0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(a) * 0.08,
                -0.4 + i * 0.35,
                Math.sin(a) * 0.08,
              ]}
              rotation={[0.3, a, 0.5]}
            >
              <cylinderGeometry args={[0.015, 0.02, 0.5, 6]} />
              <meshStandardMaterial color={config.stemColor} roughness={0.9} />
            </mesh>
          );
        })}

      {/* Leaves */}
      {leaves.map((l, i) => (
        <Leaf
          key={i}
          position={l.pos}
          rotation={l.rot}
          scale={l.s}
          color={config.leafColor}
          shape={config.leafShape}
        />
      ))}

      {/* Flowers */}
      {config.hasFlower && (
        <>
          <Flower
            position={[0, -0.85 + config.stemHeight + 0.12, 0]}
            color={config.flowerColor}
          />
          <Flower
            position={[0.15, -0.85 + config.stemHeight * 0.8, 0.1]}
            color={config.flowerColor}
          />
        </>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading fallback                                                  */
/* ------------------------------------------------------------------ */

function LoadingPlaceholder() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime();
    }
  });
  return (
    <mesh ref={ref}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#81c784" wireframe />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported viewer component                                         */
/* ------------------------------------------------------------------ */

interface PlantModelViewerProps {
  plantId: string;
  plantName: string;
}

export default function PlantModelViewer({ plantId, plantName }: PlantModelViewerProps) {
  return (
    <div className="w-full rounded-xl overflow-hidden bg-card botanical-border shadow-botanical">
      <div className="relative w-full aspect-square max-h-[420px]">
        <Canvas
          camera={{ position: [2.5, 1.5, 2.5], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={<LoadingPlaceholder />}>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.2}
              castShadow
              color="#fffde7"
            />
            <directionalLight
              position={[-3, 4, -3]}
              intensity={0.3}
              color="#a5d6a7"
            />
            <pointLight position={[0, 3, 0]} intensity={0.4} color="#c8e6c9" />

            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
              <PlantModel plantId={plantId} />
            </Float>

            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={2}
              maxDistance={6}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.2}
              autoRotate
              autoRotateSpeed={1}
            />

            <Environment preset="forest" />
          </Suspense>
        </Canvas>

        {/* Interaction hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-foreground/60 backdrop-blur-sm">
          <p className="text-xs font-medium text-background">
            🌿 Drag to rotate • Scroll to zoom
          </p>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-border">
        <p className="text-sm font-display font-semibold text-foreground">
          3D Model — {plantName}
        </p>
        <p className="text-xs text-muted-foreground">Interactive procedural model</p>
      </div>
    </div>
  );
}
