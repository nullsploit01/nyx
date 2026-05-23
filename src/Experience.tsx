import * as Astronomy from 'astronomy-engine';

const Experience = () => {
  const sirius = {
    name: 'Sirius',
    ra: 6.752, // hours
    dec: -16.716, // degrees
  };

  const observer = new Astronomy.Observer(
    21.1458, // latitude (Nagpur)
    79.0882, // longitude
    310, // elevation meters
  );

  const time = new Astronomy.AstroTime(new Date());

  const horizontal = Astronomy.Horizon(
    time,
    observer,
    sirius.ra * 15, // convert hours → degrees
    sirius.dec,
    'normal',
  );

  function altAzToXYZ(alt: number, az: number, radius = 100) {
    const altRad = (alt * Math.PI) / 180;
    const azRad = (az * Math.PI) / 180;

    const x = radius * Math.cos(altRad) * Math.sin(azRad);

    const y = radius * Math.sin(altRad);

    const z = radius * Math.cos(altRad) * Math.cos(azRad);

    return [x, y, z];
  }

  const [x, y, z] = altAzToXYZ(horizontal.altitude, horizontal.azimuth);

  return (
    <>
      <mesh position={[x, y, z]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
};

export default Experience;
