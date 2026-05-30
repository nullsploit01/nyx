import Camp from './Camp';
import Campfire from './Campfire';
import Chair from './Chair';
import Lantern from './Lantern';
import OakTree from './OakTree';
import Telescope from './Telescope';

const Props = () => {
  return (
    <>
      <OakTree />
      <Camp />
      <Chair />
      <Campfire />
      <Lantern />
      <Telescope />
      <fog attach="fog" args={['#0b1020', 200, 900]} />
    </>
  );
};

export default Props;
