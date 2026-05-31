import { Html, Line, useProgress } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const CONSTELLATIONS = [
  {
    name: 'Orion',
    stars: [
      [-2.0, 3.0, 0], // 0: Betelgeuse (Top Left / Red Supergiant)
      [2.0, 3.2, 0], // 1: Bellatrix (Top Right)
      [-0.8, 0.1, 0], // 2: Alnitak (Belt - Left)
      [0.0, 0.0, 0], // 3: Alnilam (Belt - Center)
      [0.8, -0.1, 0], // 4: Mintaka (Belt - Right)
      [-1.8, -3.2, 0], // 5: Saiph (Bottom Left / Foot)
      [1.8, -3.0, 0], // 6: Rigel (Bottom Right / Bright Foot)
    ],
    connections: [
      // Upper Body Torso
      [0, 1], // Shoulders: Betelgeuse to Bellatrix
      [0, 2], // Left side: Betelgeuse down to Belt (Alnitak)
      [1, 4], // Right side: Bellatrix down to Belt (Mintaka)

      // The Belt
      [2, 3], // Belt Left to Center
      [3, 4], // Belt Center to Right

      // Lower Body / Legs
      [2, 5], // Left torso down to Saiph
      [4, 6], // Right torso down to Rigel
      [5, 6], // Base line connecting feet
    ],
  },

  {
    name: 'Cassiopeia',
    stars: [
      [-3.0, 2.0, 0], // 0: Segin (Left peak of the W)
      [-1.5, -0.5, 0], // 1: Ruchbah (Left low trough)
      [0.0, 1.2, 0], // 2: Gamma Cas (Middle peak)
      [1.5, -0.8, 0], // 3: Schedar (Right low trough)
      [3.0, 1.8, 0], // 4: Caph (Right peak of the W)
    ],
    connections: [
      [0, 1], // Segin to Ruchbah
      [1, 2], // Ruchbah to Gamma Cas
      [2, 3], // Gamma Cas to Schedar
      [3, 4], // Schedar to Caph
    ],
  },

  {
    name: 'Ursa Major',
    stars: [
      [-3.5, 1.5, 0], // 0: Dubhe (Outer top lip)
      [-3.0, -1.0, 0], // 1: Merak (Outer bottom)
      [0.0, -0.8, 0], // 2: Phecda (Inner bottom)
      [0.5, 1.2, 0], // 3: Megrez (Inner top - connects to handle)

      [2.5, 1.0, 0], // 4: Alioth
      [4.5, 1.8, 0], // 5: Mizar
      [6.5, 1.4, 0], // 6: Alkaid
    ],

    connections: [
      // The Bowl
      [0, 1], // Dubhe to Merak
      [1, 2], // Merak to Phecda
      [2, 3], // Phecda to Megrez
      [3, 0], // Megrez to Dubhe

      // The Handle (Curves upward naturally from Megrez)
      [3, 4], // Megrez to Alioth
      [4, 5], // Alioth to Mizar
      [5, 6], // Mizar to Alkaid
    ],
  },
];

const Constellations = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [constellationIndex, setConstellationIndex] = useState(0);
  const [visibleConnections, setVisibleConnections] = useState(0);
  const { progress } = useProgress();

  const constellation = CONSTELLATIONS[constellationIndex];

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.rotation.set(0, 0, 0);
    camera.lookAt(groupRef.current.position);
    camera.updateProjectionMatrix();
  }, [constellationIndex]);

  useEffect(() => {
    setVisibleConnections(0);

    const drawInterval = setInterval(() => {
      setVisibleConnections((current) => {
        const next = current + 1;

        if (next > constellation.connections.length) {
          clearInterval(drawInterval);

          setTimeout(() => {
            setConstellationIndex((index) => (index + 1) % CONSTELLATIONS.length);
          }, 2500);

          return current;
        }

        return next;
      });
    }, 800);

    return () => clearInterval(drawInterval);
  }, [constellationIndex]);

  const stars = useMemo(
    () => constellation.stars.map((star) => new THREE.Vector3(...star)),
    [constellation],
  );

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      {stars.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}

      {constellation.connections.slice(0, visibleConnections).map(([a, b], index) => (
        <Line key={index} points={[stars[a], stars[b]]} color="white" lineWidth={1} />
      ))}

      <Html
        fullscreen
        style={{
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '48px',
            bottom: '42px',
            color: '#e8f6ff',
            fontFamily: 'Inter, sans-serif',
            userSelect: 'none',
            textAlign: 'right',
            textShadow: '0 0 18px rgba(180,220,255,0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.45em',
              color: 'rgba(180,220,255,0.55)',
              marginBottom: '12px',
            }}
          >
            {CONSTELLATIONS[constellationIndex].name}
          </div>

          <div
            style={{
              fontSize: '56px',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.06em',
            }}
          >
            {Math.floor(progress)}
            <span
              style={{
                opacity: 0.5,
                marginLeft: '4px',
              }}
            >
              %
            </span>
          </div>

          <div
            style={{
              marginTop: '6px',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              opacity: 0.42,
            }}
          >
            Loading Sky Data
          </div>
        </div>
      </Html>
    </group>
  );
};

export default Constellations;
