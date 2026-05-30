import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile =
        window.innerWidth < MOBILE_BREAKPOINT ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return isMobile;
};
