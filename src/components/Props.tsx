import Camp from './Camp';
import Telescope from './Telescope';
import Tree from './Tree';

const Props = () => {
  return (
    <>
      <Tree />
      <Camp />
      <Telescope />
      <fog attach="fog" args={['#000000', 200, 900]} />
    </>
  );
};

export default Props;
