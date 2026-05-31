import { useLevaControls } from '../hooks/useLevaControls';
import { useGlobeStore } from '../stores/globeStore';
import { getLocationTime } from '../utils';
import NoticeBoardInformation from './NoticeBoardInformation';
import { useCursor, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useMemo, useState } from 'react';

const NoticeBoard = () => {
  const [showBoardMessage, setShowBoardMessage] = useState(false);
  const model = useGLTF('./models/notice_board/notice_board.glb');
  const [isHovered, setIsHovered] = useState(false);

  useCursor(isHovered, 'pointer', 'auto');

  const controls = useLevaControls('NoticeBoard', {
    position: {
      value: [-46, -0.3, -43] as [number, number, number],
      step: 0.5,
    },
    rotation: [0, 0.94, 0] as [number, number, number],
    scale: 7.15,
  });

  const location = useGlobeStore((state) => state.location);
  const coords = useGlobeStore((state) => state.coords);
  const locationTime = useMemo(() => {
    if (!coords) {
      return null;
    }

    return getLocationTime(coords.lat, coords.lng);
  }, [coords]);

  return (
    <>
      <RigidBody position={controls.position} rotation={controls.rotation} type="fixed">
        <group
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
          onClick={() => {
            setShowBoardMessage(!showBoardMessage);
          }}
        >
          {showBoardMessage && location && (
            <NoticeBoardInformation
              onClick={() => setShowBoardMessage(false)}
              location={location}
              locationTime={locationTime}
            />
          )}

          <primitive object={model.scene} scale={controls.scale} />
        </group>
      </RigidBody>
    </>
  );
};

export default NoticeBoard;
