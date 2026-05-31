import Camp from './Camp';
import Campfire from './Campfire';
import Chair from './Chair';
import Lantern from './Lantern';
import NoticeBoard from './NoticeBoard';
import OakTree from './OakTree';
import Telescope from './Telescope';
import Trees from './Trees';

const Props = () => {
  return (
    <>
      <OakTree />
      <Camp />
      <Chair />
      <Campfire />
      <Lantern />
      <Telescope />
      <Trees />
      <NoticeBoard />
      <fog attach="fog" args={['#0b1020', 200, 900]} />
    </>
  );
};

export default Props;
