import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';

type HelperMessageProps = {
  message: string;
  duration?: number;
  onComplete?: () => void;
};

const HelperMessage = ({ message, duration = 4000, onComplete }: HelperMessageProps) => {
  const [visible, setVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    setVisible(true);
    setIsFading(false);

    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
    }, duration - 400);

    const removeTimeout = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, [message, duration, onComplete]);

  if (!visible) return null;

  return (
    <Html
      fullscreen
      style={{
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          marginTop: '48px',
          padding: '12px 24px',
          background: 'rgba(15, 18, 24, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(224, 214, 196, 0.15)',
          borderRadius: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          color: '#e2e8f0',
          fontFamily: '"Georgia", serif',
          fontSize: '13px',
          letterSpacing: '0.05em',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          userSelect: 'none',

          // CSS Hardware Accelerated Smooth Fade Transitions
          transition: 'opacity 400ms ease-in-out, transform 400ms ease-in-out',
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
        }}
      >
        ✦ {message} ✦
      </div>
    </Html>
  );
};

export default HelperMessage;
