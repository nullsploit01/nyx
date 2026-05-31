import { useEffect, useState } from 'react';

export const useDebugMode = () => {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsDebugMode(window.location.hash === '#debug');
    };

    update();

    window.addEventListener('hashchange', update);

    return () => {
      window.removeEventListener('hashchange', update);
    };
  }, []);

  return isDebugMode;
};
