import grassFragmentShader from '../shaders/grass/fragment.glsl';
import grassVertexShader from '../shaders/grass/vertex.glsl';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { DoubleSide, type InstancedMesh, Object3D, PlaneGeometry, ShaderMaterial } from 'three';

const GRASS_COUNT = 45000;

type ExclusionZone = {
  position: [number, number, number];
  args: [number, number, number];
};

type GrassProps = {
  ignoreZones?: ExclusionZone[];
};

const Grass = ({ ignoreZones = [] }: GrassProps) => {
  const grassRef = useRef<InstancedMesh>(null);

  const grassGeometry = useMemo(() => {
    const geo = new PlaneGeometry(0.18, 0.8, 1, 1);
    geo.translate(0, 0.5, 0);
    return geo;
  }, []);

  const grassMaterial = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
      uniforms: {
        time: {
          value: 0,
        },
      },
      side: DoubleSide,
    });
  }, []);

  useEffect(() => {
    if (!grassRef.current) {
      return;
    }

    const dummy = new Object3D();
    let placedCount = 0;

    while (placedCount < GRASS_COUNT) {
      const radius = Math.sqrt(Math.random()) * 120;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      let insideForbiddenZone = false;
      for (let j = 0; j < ignoreZones.length; j++) {
        const zone = ignoreZones[j];

        const centerX = zone.position[0];
        const centerZ = zone.position[2];
        const width = zone.args[0];
        const depth = zone.args[2];

        const minX = centerX - (width + 1.0) / 2;
        const maxX = centerX + (width + 1.0) / 2;
        const minZ = centerZ - (depth + 1.0) / 2;
        const maxZ = centerZ + (depth + 1.0) / 2;

        if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
          insideForbiddenZone = true;
          break;
        }
      }

      if (insideForbiddenZone) {
        continue;
      }

      dummy.position.set(x, 0.2, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.rotation.z = (Math.random() - 0.5) * 0.18;

      const scale = 1.2 + Math.random() * 1.5;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      grassRef.current.setMatrixAt(placedCount, dummy.matrix);
      placedCount++;
    }

    grassRef.current.instanceMatrix.needsUpdate = true;
  }, [ignoreZones]);

  useFrame(({ clock }) => {
    grassMaterial.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <>
      <instancedMesh ref={grassRef} args={[grassGeometry, grassMaterial, GRASS_COUNT]} />
    </>
  );
};

export default Grass;
