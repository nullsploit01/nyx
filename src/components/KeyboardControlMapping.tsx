import { KeyboardControls } from '@react-three/drei';

const KeyboardControlMapping = ({ children }: { children: React.ReactNode }) => {
  return (
    <KeyboardControls
      map={[
        {
          name: 'forward',
          keys: ['ArrowUp', 'KeyW'],
        },
        {
          name: 'backward',
          keys: ['ArrowDown', 'KeyS'],
        },
        {
          name: 'leftward',
          keys: ['ArrowLeft', 'KeyA'],
        },
        {
          name: 'rightward',
          keys: ['ArrowRight', 'KeyD'],
        },
        {
          name: 'jump',
          keys: ['Space'],
        },
      ]}
    >
      {children}
    </KeyboardControls>
  );
};

export default KeyboardControlMapping;

KeyboardControlMapping.displayName = 'KeyboardControlMapping';
