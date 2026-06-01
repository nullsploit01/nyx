import { useGlobeStore } from '../stores/globeStore';
import PineTree from './PineTree';
import { useMemo } from 'react';

const Trees = () => {
  const telescopeMode = useGlobeStore((state) => state.telescopeMode);

  const trees = useMemo(() => {
    const result = [];

    const treeCount = 40;

    const minRadius = 95;
    const maxRadius = 118; // stay inside island

    for (let i = 0; i < treeCount; i++) {
      const angle = Math.random() * Math.PI * 2;

      const radius = minRadius + Math.random() * (maxRadius - minRadius);

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      result.push({
        position: [x, 0, z] as [number, number, number],
        rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
        scale: 0.08 + Math.random() * 0.05,
      });
    }

    return result;
  }, []);

  return (
    <>
      {!telescopeMode &&
        trees.map((tree, index) => (
          <PineTree
            key={index}
            position={tree.position}
            rotation={tree.rotation}
            scale={tree.scale}
          />
        ))}
    </>
  );
};

export default Trees;
