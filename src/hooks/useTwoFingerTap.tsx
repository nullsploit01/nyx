import { useEffect, useRef } from 'react';

export const useTwoFingerTap = (enabled: boolean, onTwoFingerTap: () => void) => {
  const startTime = useRef<number>(0);
  const wasTwoFinger = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        startTime.current = Date.now();
        wasTwoFinger.current = true;
      } else if (e.touches.length > 2) {
        wasTwoFinger.current = false;
      }
    };

    const handleTouchEnd = () => {
      const duration = Date.now() - startTime.current;

      if (wasTwoFinger.current && startTime.current > 0 && duration < 300) {
        onTwoFingerTap();

        startTime.current = 0;
        wasTwoFinger.current = false;
      }

      if (startTime.current > 0 && duration >= 300) {
        startTime.current = 0;
        wasTwoFinger.current = false;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, onTwoFingerTap]);
};
