import Camp from './Camp';
import Campfire from './Campfire';
import Chair from './Chair';
import Lantern from './Lantern';
import Telescope from './Telescope';
import Tree from './Tree';

const Props = () => {
  return (
    <>
      <Tree />
      <Camp />
      <Chair />
      <Campfire />
      <Lantern />
      <Telescope />
      <fog attach="fog" args={['#000000', 200, 900]} />
    </>
  );
};

export default Props;
