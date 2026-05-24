import Camp from './Camp';
import Tree from './Tree';

const Props = () => {
  return (
    <>
      <Tree />
      <Camp />
      <fog attach="fog" args={['#000000', 200, 900]} />
    </>
  );
};

export default Props;
