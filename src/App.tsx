import KeyboardControlMapping from './components/KeyboardControlMapping';
import Experience from './Experience';
import { useLevaControls } from './hooks/useLevaControls';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Physics } from '@react-three/rapier';
import { Perf } from 'r3f-perf';

const App = () => {
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
        camera={{
          position: [0, 7, 30],
          fov: 90,
          near: 0.1,
          far: 800,
        }}
      >
        <Perf position="top-left" />
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
            <Experience />
          </KeyboardControlMapping>
        </Physics>
        {controls.enableOrbitControls && <OrbitControls makeDefault />}
      </Canvas>
    </div>
  );
};

useGLTF.preload('./models/tree/pine_tree.glb');
useGLTF.preload('./models/echo_house/echo_house.glb');
useGLTF.preload('./models/ghost/ghost.glb');
useGLTF.preload('./models/telescope/telescope.glb');
useTexture.preload('/textures/grass/grass_displacement.png');
useTexture.preload('/textures/grass/grass_normal.png');
useTexture.preload('/textures/grass/grass_roughness.png');
useTexture.preload('/textures/grass/grass_color.png');
useTexture.preload('/textures/grass/grass_ao.png');

export default App;
