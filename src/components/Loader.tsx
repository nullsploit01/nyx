import Constellations from './Constellations';
import { Stars } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useEffect } from 'react';
import { Vector2 } from 'three';

const Loader = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.far = 500;
    camera.updateProjectionMatrix();
  }, [camera]);

  return (
    <>
      <Constellations />
      <Stars radius={0.1} count={500} factor={2} saturation={2} fade />
      <Glitch
        delay={new Vector2(6, 12)}
        duration={new Vector2(0.15, 0.35)}
        strength={new Vector2(0.02, 0.06)}
        mode={GlitchMode.SPORADIC}
        active
        ratio={0.12}
        columns={0.04}
        blendFunction={BlendFunction.NORMAL}
      />
    </>
  );
};

export default Loader;
