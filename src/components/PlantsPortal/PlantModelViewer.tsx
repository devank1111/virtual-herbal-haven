import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Per-plant shape configuration                                     */
/* ------------------------------------------------------------------ */

interface PlantConfig {
  stemColor: string;
  leafColor: string;
  leafColorAlt: string;
  flowerColor: string;
  flowerCenter: string;
  leafCount: number;
  hasFlower: boolean;
  flowerCount: number;
  leafShape: "broad" | "narrow" | "round" | "pointed" | "succulent" | "feathery";
  stemHeight: number;
  trunkStyle: "thin" | "thick" | "vine" | "woody";
  hasBerries: boolean;
  berryColor: string;
  potColor: string;
  potRimColor: string;
}

const plantConfigs: Record<string, PlantConfig> = {
  tulsi: {
    stemColor: "#3e6b4e",
    leafColor: "#2d8c3e",
    leafColorAlt: "#45a859",
    flowerColor: "#b565d9",
    flowerCenter: "#f0e14a",
    leafCount: 14,
    hasFlower: true,
    flowerCount: 3,
    leafShape: "broad",
    stemHeight: 1.6,
    trunkStyle: "thin",
    hasBerries: false,
    berryColor: "",
    potColor: "#c46a3a",
    potRimColor: "#a85530",
  },
  ashwagandha: {
    stemColor: "#5c7a32",
    leafColor: "#4a8c28",
    leafColorAlt: "#6aad42",
    flowerColor: "#d4c83a",
    flowerCenter: "#8bc34a",
    leafCount: 12,
    hasFlower: true,
    flowerCount: 4,
    leafShape: "pointed",
    stemHeight: 1.8,
    trunkStyle: "thin",
    hasBerries: true,
    berryColor: "#e53935",
    potColor: "#8d6e63",
    potRimColor: "#6d4c41",
  },
  turmeric: {
    stemColor: "#6b8c3a",
    leafColor: "#1b7a28",
    leafColorAlt: "#2e9e3a",
    flowerColor: "#ff6f00",
    flowerCenter: "#ffcc02",
    leafCount: 6,
    hasFlower: true,
    flowerCount: 1,
    leafShape: "broad",
    stemHeight: 1.5,
    trunkStyle: "thick",
    hasBerries: false,
    berryColor: "",
    potColor: "#d4a056",
    potRimColor: "#b8863e",
  },
  neem: {
    stemColor: "#4e3628",
    leafColor: "#2e7d32",
    leafColorAlt: "#388e3c",
    flowerColor: "#e8f5e9",
    flowerCenter: "#a5d6a7",
    leafCount: 20,
    hasFlower: true,
    flowerCount: 2,
    leafShape: "narrow",
    stemHeight: 2.4,
    trunkStyle: "woody",
    hasBerries: true,
    berryColor: "#7cb342",
    potColor: "#5d4037",
    potRimColor: "#4e342e",
  },
  "aloe-vera": {
    stemColor: "#4caf50",
    leafColor: "#2e7d32",
    leafColorAlt: "#66bb6a",
    flowerColor: "#ff5722",
    flowerCenter: "#ffab91",
    leafCount: 10,
    hasFlower: false,
    flowerCount: 0,
    leafShape: "succulent",
    stemHeight: 0.2,
    trunkStyle: "thick",
    hasBerries: false,
    berryColor: "",
    potColor: "#bcaaa4",
    potRimColor: "#8d6e63",
  },
  brahmi: {
    stemColor: "#43a047",
    leafColor: "#1b5e20",
    leafColorAlt: "#4caf50",
    flowerColor: "#e3f2fd",
    flowerCenter: "#90caf9",
    leafCount: 18,
    hasFlower: true,
    flowerCount: 5,
    leafShape: "round",
    stemHeight: 0.7,
    trunkStyle: "vine",
    hasBerries: false,
    berryColor: "",
    potColor: "#a1887f",
    potRimColor: "#8d6e63",
  },
  amla: {
    stemColor: "#5d4037",
    leafColor: "#33691e",
    leafColorAlt: "#558b2f",
    flowerColor: "#dcedc8",
    flowerCenter: "#aed581",
    leafCount: 16,
    hasFlower: true,
    flowerCount: 2,
    leafShape: "feathery",
    stemHeight: 2.2,
    trunkStyle: "woody",
    hasBerries: true,
    berryColor: "#8bc34a",
    potColor: "#6d4c41",
    potRimColor: "#4e342e",
  },
  shatavari: {
    stemColor: "#5a7a5c",
    leafColor: "#66bb6a",
    leafColorAlt: "#a5d6a7",
    flowerColor: "#fce4ec",
    flowerCenter: "#f8bbd0",
    leafCount: 22,
    hasFlower: true,
    flowerCount: 3,
    leafShape: "feathery",
    stemHeight: 1.9,
    trunkStyle: "vine",
    hasBerries: true,
    berryColor: "#e53935",
    potColor: "#d7ccc8",
    potRimColor: "#bcaaa4",
  },
  giloy: {
    stemColor: "#5d4037",
    leafColor: "#2e7d32",
    leafColorAlt: "#43a047",
    flowerColor: "#fff176",
    flowerCenter: "#fdd835",
    leafCount: 10,
    hasFlower: false,
    flowerCount: 0,
    leafShape: "round",
    stemHeight: 1.8,
    trunkStyle: "vine",
    hasBerries: false,
    berryColor: "",
    potColor: "#795548",
    potRimColor: "#5d4037",
  },
  lavender: {
    stemColor: "#6d8c6e",
    leafColor: "#607d8b",
    leafColorAlt: "#78909c",
    flowerColor: "#7b1fa2",
    flowerCenter: "#ce93d8",
    leafCount: 10,
    hasFlower: true,
    flowerCount: 5,
    leafShape: "narrow",
    stemHeight: 1.3,
    trunkStyle: "thin",
    hasBerries: false,
    berryColor: "",
    potColor: "#b39ddb",
    potRimColor: "#9575cd",
  },
  peppermint: {
    stemColor: "#3e8948",
    leafColor: "#27ae60",
    leafColorAlt: "#2ecc71",
    flowerColor: "#d5a6e6",
    flowerCenter: "#c39bd3",
    leafCount: 16,
    hasFlower: true,
    flowerCount: 3,
    leafShape: "pointed",
    stemHeight: 1.2,
    trunkStyle: "thin",
    hasBerries: false,
    berryColor: "",
    potColor: "#5dade2",
    potRimColor: "#2e86c1",
  },
  moringa: {
    stemColor: "#6d4c41",
    leafColor: "#27ae60",
    leafColorAlt: "#52be80",
    flowerColor: "#fdfefe",
    flowerCenter: "#f9e79f",
    leafCount: 24,
    hasFlower: true,
    flowerCount: 4,
    leafShape: "feathery",
    stemHeight: 2.6,
    trunkStyle: "woody",
    hasBerries: true,
    berryColor: "#229954",
    potColor: "#7e5109",
    potRimColor: "#6e4a08",
  },
  hibiscus: {
    stemColor: "#4a7c59",
    leafColor: "#1e8449",
    leafColorAlt: "#28b463",
    flowerColor: "#e74c3c",
    flowerCenter: "#f1c40f",
    leafCount: 12,
    hasFlower: true,
    flowerCount: 3,
    leafShape: "broad",
    stemHeight: 1.7,
    trunkStyle: "thick",
    hasBerries: false,
    berryColor: "",
    potColor: "#e74c3c",
    potRimColor: "#c0392b",
  },
  cinnamon: {
    stemColor: "#6e3b1e",
    leafColor: "#1e8449",
    leafColorAlt: "#239b56",
    flowerColor: "#f5e6cc",
    flowerCenter: "#d4ac6e",
    leafCount: 10,
    hasFlower: false,
    flowerCount: 0,
    leafShape: "broad",
    stemHeight: 2.2,
    trunkStyle: "woody",
    hasBerries: true,
    berryColor: "#4a235a",
    potColor: "#a0522d",
    potRimColor: "#8b4513",
  },
  sandalwood: {
    stemColor: "#c9a96e",
    leafColor: "#2d6a4f",
    leafColorAlt: "#40916c",
    flowerColor: "#d4a574",
    flowerCenter: "#c9a96e",
    leafCount: 14,
    hasFlower: true,
    flowerCount: 2,
    leafShape: "pointed",
    stemHeight: 2.0,
    trunkStyle: "woody",
    hasBerries: true,
    berryColor: "#2d1b4e",
    potColor: "#deb887",
    potRimColor: "#c49a6c",
  },
};

const defaultConfig: PlantConfig = {
  stemColor: "#4a7c5c",
  leafColor: "#3d8b37",
  leafColorAlt: "#56a84a",
  flowerColor: "#e8d44d",
  flowerCenter: "#fff9c4",
  leafCount: 10,
  hasFlower: true,
  flowerCount: 2,
  leafShape: "broad",
  stemHeight: 1.6,
  trunkStyle: "thin",
  hasBerries: false,
  berryColor: "",
  potColor: "#8d5524",
  potRimColor: "#7a4420",
};

/* ------------------------------------------------------------------ */
/*  Leaf                                                              */
/* ------------------------------------------------------------------ */

function Leaf({
  position, rotation, scale, color, colorAlt, shape,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  colorAlt: string;
  shape: PlantConfig["leafShape"];
}) {
  const leafRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    switch (shape) {
      case "broad":
        s.moveTo(0, 0);
        s.bezierCurveTo(0.18, 0.12, 0.2, 0.35, 0.1, 0.55);
        s.quadraticCurveTo(0, 0.68, -0.1, 0.55);
        s.bezierCurveTo(-0.2, 0.35, -0.18, 0.12, 0, 0);
        break;
      case "narrow":
        s.moveTo(0, 0);
        s.bezierCurveTo(0.06, 0.18, 0.05, 0.4, 0.03, 0.6);
        s.quadraticCurveTo(0, 0.68, -0.03, 0.6);
        s.bezierCurveTo(-0.05, 0.4, -0.06, 0.18, 0, 0);
        break;
      case "round":
        s.moveTo(0, 0);
        s.bezierCurveTo(0.22, 0.08, 0.24, 0.32, 0.16, 0.42);
        s.quadraticCurveTo(0, 0.56, -0.16, 0.42);
        s.bezierCurveTo(-0.24, 0.32, -0.22, 0.08, 0, 0);
        break;
      case "pointed":
        s.moveTo(0, 0);
        s.bezierCurveTo(0.14, 0.06, 0.12, 0.35, 0.06, 0.6);
        s.quadraticCurveTo(0, 0.78, 0, 0.8);
        s.quadraticCurveTo(0, 0.78, -0.06, 0.6);
        s.bezierCurveTo(-0.12, 0.35, -0.14, 0.06, 0, 0);
        break;
      case "succulent":
        s.moveTo(0, 0);
        s.bezierCurveTo(0.1, 0.05, 0.14, 0.25, 0.1, 0.55);
        s.quadraticCurveTo(0.04, 0.72, 0, 0.75);
        s.quadraticCurveTo(-0.04, 0.72, -0.1, 0.55);
        s.bezierCurveTo(-0.14, 0.25, -0.1, 0.05, 0, 0);
        break;
      case "feathery":
        s.moveTo(0, 0);
        s.bezierCurveTo(0.04, 0.15, 0.03, 0.35, 0.02, 0.5);
        s.quadraticCurveTo(0, 0.55, -0.02, 0.5);
        s.bezierCurveTo(-0.03, 0.35, -0.04, 0.15, 0, 0);
        break;
    }
    return new THREE.ShapeGeometry(s);
  }, [shape]);

  useFrame(({ clock }) => {
    if (leafRef.current) {
      leafRef.current.rotation.z =
        rotation[2] + Math.sin(clock.getElapsedTime() * 1.0 + position[1] * 4) * 0.05;
    }
  });

  const isAlt = position[1] > 0;

  return (
    <group ref={leafRef} position={position} rotation={rotation} scale={scale}>
      {/* leaf surface */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={isAlt ? colorAlt : color}
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.02}
          clearcoat={0.15}
          clearcoatRoughness={0.4}
        />
      </mesh>
      {/* central vein */}
      <mesh position={[0, shape === "succulent" ? 0.35 : 0.28, 0.003]}>
        <cylinderGeometry args={[0.002, 0.003, shape === "succulent" ? 0.65 : 0.5, 4]} />
        <meshStandardMaterial color="#1b4a1b" roughness={0.9} />
      </mesh>
      {/* side veins for broad/round leaves */}
      {(shape === "broad" || shape === "round") && [0.12, 0.24, 0.36].map((y, i) => (
        <group key={i}>
          <mesh position={[0.04, y, 0.002]} rotation={[0, 0, 0.6]}>
            <cylinderGeometry args={[0.001, 0.001, 0.08, 3]} />
            <meshStandardMaterial color="#1b5e1b" roughness={0.9} />
          </mesh>
          <mesh position={[-0.04, y, 0.002]} rotation={[0, 0, -0.6]}>
            <cylinderGeometry args={[0.001, 0.001, 0.08, 3]} />
            <meshStandardMaterial color="#1b5e1b" roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* succulent thickness */}
      {shape === "succulent" && (
        <mesh position={[0, 0.35, -0.01]}>
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.3} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Flower                                                            */
/* ------------------------------------------------------------------ */

function Flower({
  position, color, centerColor, type,
}: {
  position: [number, number, number];
  color: string;
  centerColor: string;
  type: "daisy" | "spike" | "cluster";
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  if (type === "spike") {
    return (
      <group ref={ref} position={position}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.04, 0]}>
            <sphereGeometry args={[0.03 - i * 0.002, 6, 6]} />
            <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.2} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === "cluster") {
    return (
      <group ref={ref} position={position}>
        {Array.from({ length: 7 }).map((_, i) => {
          const a = (i / 7) * Math.PI * 2;
          const r = i === 0 ? 0 : 0.06;
          return (
            <mesh key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshPhysicalMaterial color={i === 0 ? centerColor : color} roughness={0.35} />
            </mesh>
          );
        })}
      </group>
    );
  }

  // daisy
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshPhysicalMaterial color={centerColor} roughness={0.3} clearcoat={0.3} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.09, 0.01, Math.sin(angle) * 0.09]}
            rotation={[0.2, -angle, Math.PI / 7]}
            scale={[1, 0.4, 1]}
          >
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Berry                                                             */
/* ------------------------------------------------------------------ */

function Berry({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.5} clearcoatRoughness={0.2} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Pot                                                               */
/* ------------------------------------------------------------------ */

function Pot({ color, rimColor }: { color: string; rimColor: string }) {
  return (
    <group position={[0, -1.2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.4, 0.72, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.75} metalness={0.05} clearcoat={0.1} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <torusGeometry args={[0.55, 0.045, 12, 32]} />
        <meshPhysicalMaterial color={rimColor} roughness={0.7} metalness={0.08} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 32]} />
        <meshStandardMaterial color="#3e2518" roughness={1} />
      </mesh>
      {/* soil texture bumps */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.25, 0.35, Math.sin(a) * 0.25]}>
            <sphereGeometry args={[0.06, 6, 4]} />
            <meshStandardMaterial color="#4a3020" roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Stem with bark texture for woody                                  */
/* ------------------------------------------------------------------ */

function Stem({ config }: { config: PlantConfig }) {
  const radiusTop = config.trunkStyle === "thick" || config.trunkStyle === "woody" ? 0.06
    : config.trunkStyle === "vine" ? 0.025 : 0.035;
  const radiusBot = config.trunkStyle === "thick" || config.trunkStyle === "woody" ? 0.09
    : config.trunkStyle === "vine" ? 0.035 : 0.045;

  return (
    <group>
      <mesh position={[0, -0.85 + config.stemHeight / 2, 0]}>
        <cylinderGeometry args={[radiusTop, radiusBot, config.stemHeight, 12]} />
        <meshPhysicalMaterial
          color={config.stemColor}
          roughness={config.trunkStyle === "woody" ? 0.95 : 0.8}
          metalness={0}
        />
      </mesh>

      {/* Bark ridges for woody stems */}
      {config.trunkStyle === "woody" && Array.from({ length: 5 }).map((_, i) => {
        const y = -0.7 + i * 0.35;
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[0, i * 1.2, 0]}>
            <cylinderGeometry args={[radiusBot + 0.008, radiusBot + 0.01, 0.06, 6]} />
            <meshStandardMaterial color={config.stemColor} roughness={1} />
          </mesh>
        );
      })}

      {/* Vine tendrils */}
      {config.trunkStyle === "vine" && [0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + 0.5;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.06, -0.5 + i * 0.3, Math.sin(a) * 0.06]} rotation={[0.4, a, 0.6]}>
            <cylinderGeometry args={[0.012, 0.018, 0.45, 6]} />
            <meshStandardMaterial color={config.stemColor} roughness={0.85} />
          </mesh>
        );
      })}

      {/* Branches for woody/thick */}
      {(config.trunkStyle === "woody" || config.trunkStyle === "thick") && [0, 1].map((i) => {
        const a = i * Math.PI + 0.8;
        const y = -0.2 + i * 0.5;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.08, y, Math.sin(a) * 0.08]} rotation={[0.5, a, 0.7]}>
            <cylinderGeometry args={[0.02, 0.03, 0.4, 6]} />
            <meshStandardMaterial color={config.stemColor} roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Full plant model                                                  */
/* ------------------------------------------------------------------ */

function PlantModel({ plantId }: { plantId: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const config = plantConfigs[plantId] || defaultConfig;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    }
  });

  const leaves = useMemo(() => {
    const items: { pos: [number, number, number]; rot: [number, number, number]; s: number }[] = [];
    for (let i = 0; i < config.leafCount; i++) {
      const angle = (i / config.leafCount) * Math.PI * 2 + (i % 3) * 0.25;
      const heightRatio = 0.25 + (i / config.leafCount) * 0.7;
      const y = -0.85 + heightRatio * config.stemHeight;
      const radius = 0.1 + (1 - heightRatio) * 0.14;
      const tilt = config.leafShape === "succulent" ? 0.6 + (1 - heightRatio) * 0.5
        : 0.25 + (1 - heightRatio) * 0.85;
      const scl = 0.65 + heightRatio * 0.85 + (i % 2) * 0.1;
      items.push({
        pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        rot: [tilt, angle, 0],
        s: scl,
      });
    }
    return items;
  }, [config]);

  const flowerType: "daisy" | "spike" | "cluster" =
    plantId === "lavender" || plantId === "shatavari" ? "spike"
      : plantId === "brahmi" || plantId === "neem" || plantId === "amla" ? "cluster"
        : "daisy";

  const berries = useMemo(() => {
    if (!config.hasBerries) return [];
    const items: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      const y = -0.3 + (i % 3) * 0.3;
      items.push([Math.cos(a) * 0.18, y, Math.sin(a) * 0.18]);
    }
    return items;
  }, [config.hasBerries]);

  return (
    <group ref={groupRef}>
      <Pot color={config.potColor} rimColor={config.potRimColor} />
      <Stem config={config} />

      {leaves.map((l, i) => (
        <Leaf key={i} position={l.pos} rotation={l.rot} scale={l.s}
          color={config.leafColor} colorAlt={config.leafColorAlt} shape={config.leafShape} />
      ))}

      {config.hasFlower && Array.from({ length: config.flowerCount }).map((_, i) => {
        const a = (i / config.flowerCount) * Math.PI * 2;
        const topY = -0.85 + config.stemHeight;
        const y = i === 0 ? topY + 0.12 : topY - 0.15 * i;
        const r = i === 0 ? 0 : 0.14;
        return (
          <Flower key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]}
            color={config.flowerColor} centerColor={config.flowerCenter} type={flowerType} />
        );
      })}

      {berries.map((pos, i) => (
        <Berry key={i} position={pos} color={config.berryColor} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading                                                           */
/* ------------------------------------------------------------------ */

function LoadingPlaceholder() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime();
  });
  return (
    <mesh ref={ref}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#81c784" wireframe />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported viewer                                                   */
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
            <ambientLight intensity={0.45} />
            <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow color="#fff8e1" />
            <directionalLight position={[-4, 5, -3]} intensity={0.35} color="#a5d6a7" />
            <pointLight position={[0, 3, 0]} intensity={0.5} color="#c8e6c9" />
            <spotLight position={[2, 4, 2]} intensity={0.3} angle={0.5} penumbra={0.8} color="#fff9c4" />

            <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
              <PlantModel plantId={plantId} />
            </Float>

            <OrbitControls
              enablePan={false} enableZoom={true}
              minDistance={2} maxDistance={6}
              minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2}
              autoRotate autoRotateSpeed={0.8}
            />
            <Environment preset="forest" />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-foreground/60 backdrop-blur-sm">
          <p className="text-xs font-medium text-background">
            🌿 Drag to rotate • Scroll to zoom
          </p>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-border">
        <p className="text-sm font-display font-semibold text-foreground">3D Model — {plantName}</p>
        <p className="text-xs text-muted-foreground">Interactive procedural model</p>
      </div>
    </div>
  );
}
