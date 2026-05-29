import { useEffect, useState } from 'react';
import { useThrottle } from '../../hooks/useThrottle';

const WindowResize = () => {
  const [windowHeight, setWindowHeight] = useState(0);

  // * Since I am passing function reference, so I dont need useCallback, because every render there is a new function referece
  const handleWindowResize = useThrottle(() => {
    setWindowHeight(window.innerHeight);
  }, 2000);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <div>
      <p>Window Inner Height is {windowHeight}</p>
      <span>Using Throttling</span>
    </div>
  );
};

export default WindowResize;

// * Without using the hook

//  const lastExecuted = useRef(0);
//   const timerRef = useRef(0);
//   const delay = 2000;

//   const throttleSize = () => {
//     const now = Date.now();

//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }

//     if (now - lastExecuted.current >= delay) {
//       lastExecuted.current = now;
//       setWindowWidth(window.innerWidth);
//     } else {
//       timerRef.current = setTimeout(() => {
//         lastExecuted.current = Date.now();

//         setWindowWidth(window.innerWidth);
//       }, 200);
//     }
//   };
