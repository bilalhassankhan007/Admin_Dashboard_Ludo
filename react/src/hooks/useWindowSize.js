import { useEffect, useState, useRef } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const timeoutId = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Guard for SSR

    const handleResize = () => {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100); // Throttle to 100ms
    };

    // Initial run to sync state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId.current);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
