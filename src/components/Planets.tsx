import fragmentShader from '../shaders/planets/fragment.glsl';
import vertexShader from '../shaders/planets/vertex.glsl';
import { useGlobeStore } from '../stores/globeStore';
import type { VisiblePlanet } from '../types';
import { altAzToXYZ } from '../utils';
import PlanetInfoCard from './PlanetInfoCard';
import { useCursor } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as Astronomy from 'astronomy-engine';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Props = {
  date: Date;
  elevation: number;
};

const PLANETS = [
  {
    body: Astronomy.Body.Mercury,
    color: '#cfcfcf',
  },
  {
    body: Astronomy.Body.Venus,
    color: '#fff3d6',
  },
  {
    body: Astronomy.Body.Mars,
    color: '#ff8f6b',
  },
  {
    body: Astronomy.Body.Jupiter,
    color: '#ffe5b4',
  },
  {
    body: Astronomy.Body.Saturn,
    color: '#fff0b0',
  },
];

const Planets = ({ date, elevation }: Props) => {
  const { camera } = useThree();
  const coords = useGlobeStore((state) => state.coords);
  const telescopeMode = useGlobeStore((state) => state.telescopeMode);
  const [hoveredPlanet, setHoveredPlanet] = useState<VisiblePlanet | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<VisiblePlanet | null>(null);
  const visiblePlanetsRef = useRef<VisiblePlanet[]>([]);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  useCursor(telescopeMode && hoveredPlanet !== null, 'pointer', 'auto');
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const rings: number[] = [];
    const visiblePlanets: VisiblePlanet[] = [];

    const latitude = coords?.lat ?? 0;
    const longitude = coords?.lng ?? 0;

    const observer = new Astronomy.Observer(latitude, longitude, elevation);
    const time = new Astronomy.AstroTime(date);

    PLANETS.forEach((planet) => {
      const equ = Astronomy.Equator(planet.body, time, observer, true, true);
      const horizontal = Astronomy.Horizon(time, observer, equ.ra, equ.dec, 'normal');
      const distanceKm =
        Astronomy.GeoVector(planet.body, time, true).Length() * Astronomy.KM_PER_AU;

      const [x, y, z] = altAzToXYZ(horizontal.altitude, horizontal.azimuth, 350);
      positions.push(x, y, z);
      const color = new THREE.Color(planet.color);
      colors.push(color.r, color.g, color.b);
      const magnitude = Astronomy.Illumination(planet.body, time).mag;
      let size = Math.max(10, (-magnitude + 3) * 4);
      if (planet.body === Astronomy.Body.Jupiter) {
        size *= 1.5;
      }
      if (planet.body === Astronomy.Body.Saturn) {
        size *= 1.4;
      }
      sizes.push(size);
      rings.push(planet.body === Astronomy.Body.Saturn ? 1 : 0);

      visiblePlanets.push({
        name: planet.body,
        magnitude,
        distanceKm,
        color: planet.color,
        hasRing: planet.body === Astronomy.Body.Saturn,
        worldPosition: new THREE.Vector3(x, y, z),
      });
    });

    visiblePlanetsRef.current = visiblePlanets;

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geom.setAttribute('hasRing', new THREE.Float32BufferAttribute(rings, 1));
    return geom;
  }, [coords, elevation, date]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.telescopeZoom.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.telescopeZoom.value,
        telescopeMode ? 4 : 1,
        0.08,
      );
    }
  });

  useFrame((state) => {
    if (!telescopeMode) {
      setHoveredPlanet(null);
      return;
    }
    const closest = getClosestPlanet(visiblePlanetsRef.current, state.pointer, camera);
    setHoveredPlanet(closest);
  });

  useEffect(() => {
    const handleTap = () => {
      if (!telescopeMode) {
        return;
      }

      setTimeout(() => {
        setHoveredPlanet((currentHovered) => {
          if (currentHovered) {
            setSelectedPlanet(currentHovered);
          } else {
            setSelectedPlanet(null);
          }

          return currentHovered;
        });
      }, 0);
    };

    window.addEventListener('pointerup', handleTap);

    return () => {
      window.removeEventListener('pointerup', handleTap);
    };
  }, [telescopeMode]);

  const getClosestPlanet = (
    planets: VisiblePlanet[],
    pointer: THREE.Vector2,
    camera: THREE.Camera,
    maxDistance = 0.12,
  ) => {
    let closest: VisiblePlanet | null = null;
    let closestDistance = Infinity;

    planets.forEach((planet) => {
      const screenPos = planet.worldPosition.clone().project(camera);
      const dx = screenPos.x - pointer.x;
      const dy = screenPos.y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDistance && dist < closestDistance) {
        closestDistance = dist;
        closest = planet;
      }
    });

    return closest;
  };

  const activePlanet = selectedPlanet ?? hoveredPlanet;

  return (
    <>
      <points geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            telescopeZoom: {
              value: 1,
            },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>
      {activePlanet && <PlanetInfoCard planet={activePlanet} />}
    </>
  );
};

export default Planets;
