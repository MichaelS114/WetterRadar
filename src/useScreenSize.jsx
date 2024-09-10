import { useState, useEffect } from 'react';

const getDeviceType = (width) => {
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    device: getDeviceType(window.innerWidth),
  });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setScreenSize({
        width: newWidth,
        height: window.innerHeight,
        device: getDeviceType(newWidth),
      });
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
