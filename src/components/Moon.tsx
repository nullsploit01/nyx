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

  const [x, y, z] = altAzToXYZ(moonHor.altitude, moonHor.azimuth, 490);

  return (
    <>
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[14, 32, 32]} />
        <meshBasicMaterial color={controls.color} />
      </mesh>
    </>
  );
};

export default Moon;
