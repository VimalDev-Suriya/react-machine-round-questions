import { useCallback, useRef } from 'react';

export const useThrottle = (cb, delay) => {
  const timerRef = useRef(0);
  const timerRef_2 = useRef(0);

  // * Here the usecallback is actually optional for my requirement
  return useCallback(() => {
    const now = Date.now();

    if (timerRef_2.current) {
      clearTimeout(timerRef_2.current);
    }

    if (now - timerRef.current >= delay) {
      timerRef.current = now;

      cb();
    } else {
      timerRef_2.current = setTimeout(() => {
        timerRef.current = now;

        cb();
      }, 200); // keep this delay as much as low to keepthe data in sync
    }
  }, [cb, delay]);
};

// * Below code works fine and Meet the thrott requirments
// * But the Current Throttled value will not be in sync with the latest value - which is the know tradeoff. Because we know the under throttling only the function will execute for every fixed time.

// * To fix that we can add one more timer with minimal amount of delay time to update the latest state
// export const useThrottle = (cb, delay) => {
//   const lastUpdated = useRef(0);

//   return useCallback(() => {
//     const now = Date.now();

//     if (now - lastUpdated.current >= delay) {
//       lastUpdated.current = now;
//       cb();
//     }
//   }, [delay, cb]);
// };
