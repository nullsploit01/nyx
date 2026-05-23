import { useLevaControls } from '../hooks/useLevaControls';
import { altAzToXYZ } from '../utils';
import * as Astronomy from 'astronomy-engine';

type MoonProps = {
  latitude: number;
  longitude: number;
  elevation: number;
  date: Date;
};

const Moon = (props: MoonProps) => {
  const controls = useLevaControls('Moon', {
    color: '#f5f3ce',
  });

  const observer = new Astronomy.Observer(props.latitude, props.longitude, props.elevation);
  const time = new Astronomy.AstroTime(props.date);
  const moonEqu = Astronomy.Equator(Astronomy.Body.Moon, time, observer, true, true);
  const moonHor = Astronomy.Horizon(time, observer, moonEqu.ra * 15, moonEqu.dec, 'normal');
  const phase = Astronomy.MoonPhase(time);

  const waxing = phase < 180;
  const direction = waxing ? -1 : 1;
  const illumination = (1 - Math.cos((phase * Math.PI) / 180)) / 2;
  const shadowOffset = (1 - illumination) * 8 * direction;
  const [x, y, z] = altAzToXYZ(moonHor.altitude, moonHor.azimuth, 490);

  return (
    <>
      <group position={[x, y, z]}>
        {/* bright moon */}
        <mesh>
          <sphereGeometry args={[14, 32, 32]} />
          <meshBasicMaterial color={controls.color} />
        </mesh>

        {/* shadow */}
        <mesh position={[shadowOffset, 0, 1]}>
          <sphereGeometry args={[14, 32, 32]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </group>
    </>
  );
};

export default Moon;
