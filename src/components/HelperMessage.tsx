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
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    setVisible(true);
    setIsFading(false);
    setIsEntering(true);

    const introTimeout = setTimeout(() => setIsEntering(false), 30);

    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
    }, duration - 400);

    const removeTimeout = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(introTimeout);
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, [message, duration, onComplete]);

  if (!visible) return null;

  let currentTransform = 'translateY(0) scale(1)';
  if (isEntering) currentTransform = 'translateY(-10px) scale(0.95)';
  if (isFading) currentTransform = 'translateY(-8px) scale(0.97)';

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
          marginTop: '46px',
          padding: '12px 24px',
          background:
            'radial-gradient(circle at center, rgba(13, 16, 26, 0.92) 0%, rgba(5, 6, 10, 0.98) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          boxShadow: `
            0 0 25px rgba(255, 255, 255, 0.03),
            inset 0 0 10px rgba(255, 255, 255, 0.02),
            0 12px 36px rgba(0, 0, 0, 0.8)
          `,
          color: '#f8fafc',
          fontFamily: '"Georgia", serif',
          fontSize: '13.5px',
          letterSpacing: '0.04em',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          textShadow: '0 0 8px rgba(255, 255, 255, 0.25)',
          transition:
            'opacity 400ms cubic-bezier(0.3, 1, 0.4, 1), transform 400ms cubic-bezier(0.3, 1, 0.4, 1)',
          opacity: isEntering || isFading ? 0 : 1,
          transform: currentTransform,
        }}
      >
        {message}
      </div>
    </Html>
  );
};

export default HelperMessage;
