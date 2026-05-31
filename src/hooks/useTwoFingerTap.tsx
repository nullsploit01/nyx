import { useEffect, useRef } from 'react';

export const useTwoFingerTap = (enabled: boolean, onTwoFingerTap: () => void) => {
  const startTime = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        startTime.current = Date.now();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const duration = Date.now() - startTime.current;

      if (startTime.current > 0 && duration < 300 && e.touches.length === 0) {
        onTwoFingerTap();
      }

      startTime.current = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });

    window.addEventListener('touchend', handleTouchEnd, {
      passive: true,
    });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, onTwoFingerTap]);
};
