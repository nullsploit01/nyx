import { useLevaControls } from '../hooks/useLevaControls';
import fragmentShader from '../shaders/moon/fragment.glsl';
import vertexShader from '../shaders/moon/vertex.glsl';
import { altAzToXYZ } from '../utils';
import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';

type MoonProps = {
  latitude: number;
  longitude: number;
  elevation: number;
  date: Date;
};

const Moon = (props: MoonProps) => {
  const controls = useLevaControls('Moon', {
    color: '#e1ddd1',
    size: 14,
  });

  const observer = new Astronomy.Observer(props.latitude, props.longitude, props.elevation);
  const time = new Astronomy.AstroTime(props.date);
  const moonEqu = Astronomy.Equator(Astronomy.Body.Moon, time, observer, true, true);
  const moonHor = Astronomy.Horizon(time, observer, moonEqu.ra * 15, moonEqu.dec, 'normal');
  const phase = Astronomy.MoonPhase(time);
  const phaseLight = -Math.cos((phase * Math.PI) / 180);
  const [x, y, z] = altAzToXYZ(moonHor.altitude, moonHor.azimuth, 490);

  return (
    <points position={[x, y, z]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0]), 3]} />
      </bufferGeometry>
      <shaderMaterial
        transparent={true}
        depthWrite={false}
        uniforms={{
          phase: {
            value: phaseLight,
          },
          moonColor: {
            value: new THREE.Color(controls.color),
          },
          tilt: {
            value: THREE.MathUtils.degToRad(moonHor.azimuth - 180) * 0.35,
          },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
};

export default Moon;
