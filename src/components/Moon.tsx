import { useLevaControls } from '../hooks/useLevaControls';
import fragmentShader from '../shaders/moon/fragment.glsl';
import vertexShader from '../shaders/moon/vertex.glsl';
import { useGlobeStore } from '../stores/globeStore';
import { altAzToXYZ } from '../utils';
import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';

type MoonProps = {
  elevation: number;
  date: Date;
};

const Moon = (props: MoonProps) => {
  const telescopeMode = useGlobeStore((state) => state.telescopeMode);
  const controls = useLevaControls('Moon', {
    color: '#e1ddd1',
  });

  const coords = useGlobeStore((state) => state.coords);

  if (!coords) return null;

  const observer = new Astronomy.Observer(coords.lat, coords.lng, props.elevation);
  const time = new Astronomy.AstroTime(props.date);
  const moonEqu = Astronomy.Equator(Astronomy.Body.Moon, time, observer, true, true);
  const moonHor = Astronomy.Horizon(time, observer, moonEqu.ra * 15, moonEqu.dec, 'normal');
  console.log(moonHor);
  const phase = Astronomy.MoonPhase(time);
  const [x, y, z] = altAzToXYZ(moonHor.altitude, moonHor.azimuth, 490);

  return (
    <points position={[x, -y, z]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0]), 3]} />
      </bufferGeometry>
      <shaderMaterial
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          phase: {
            value: phase,
          },
          moonColor: {
            value: new THREE.Color(controls.color),
          },
          tilt: {
            value: THREE.MathUtils.degToRad(moonHor.azimuth - 180) * 0.35,
          },
          sizeMultiplier: {
            value: telescopeMode ? 3.5 : 1,
          },
        }}
        vertexColors={true}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
};

export default Moon;
