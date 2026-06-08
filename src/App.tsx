import KeyboardControlMapping from './components/KeyboardControlMapping';
import Loader from './components/Loader';
import Experience from './Experience';
import { useDebugMode } from './hooks/useDebugMode';
import { useLevaControls } from './hooks/useLevaControls';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Physics } from '@react-three/rapier';
import { Leva } from 'leva';
import { Perf } from 'r3f-perf';
import { Suspense } from 'react';

const App = () => {
  const isDebugMode = useDebugMode();

  const controls = useLevaControls('General', {
    color: 'black',
    debugPhysics: false,
    ambientLight: true,
    ambientLightColor: 'white',
    ambientLightIntensity: 2,
    directionalLight: true,
    directionalLightIntensity: 1,
    directionalLightColor: 'white',
    enableOrbitControls: false,
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <Canvas
        frameloop="demand"
        shadows
        camera={{
          position: [0, 7, 3],
          fov: 90,
          near: 0.1,
          far: 80,
        }}
      >
        {isDebugMode && <Perf position="top-left" />}
        {controls.ambientLight && (
          <ambientLight shadow-normalBias={0.02} intensity={controls.ambientLightIntensity} />
        )}
        {controls.directionalLight && (
          <directionalLight
            shadow-normalBias={0.02}
            intensity={controls.directionalLightIntensity}
            color={controls.directionalLightColor}
          />
        )}
        <color args={[controls.color]} attach={'background'} />
        <EffectComposer>
          <Bloom intensity={1.8} luminanceThreshold={0.02} luminanceSmoothing={0.95} mipmapBlur />
        </EffectComposer>
        <Physics debug={controls.debugPhysics}>
          <KeyboardControlMapping>
            <Suspense fallback={<Loader />}>
              <Experience />
            </Suspense>
          </KeyboardControlMapping>
        </Physics>
        {controls.enableOrbitControls && <OrbitControls makeDefault />}
      </Canvas>
      <Leva flat hidden={!isDebugMode} />
    </div>
  );
};

export default App;
