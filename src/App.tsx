import Experience from './Experience';
import { useLevaControls } from './hooks/useLevaControls';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

const App = () => {
  const controls = useLevaControls('General', {
    color: '#212122',
    debugPhysics: false,
    ambientLight: true,
    ambientLightColor: '#88aaff',
    ambientLightIntensity: 0.22,
    directionalLight: true,
    directionalLightIntensity: 0.15,
    directionalLightColor: '#749ceb',
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
          fov: 55,
          near: 0.1,
          far: 45,
          position: [6, 1.44, 4],
        }}
      >
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
        <Experience />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default App;
