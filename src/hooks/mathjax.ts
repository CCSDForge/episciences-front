import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MAX_ATTEMPTS = 10;
const ATTEMPTS_INTERVAL = 200;

function MathjaxRefresh(): null {
  const location = useLocation();

  useEffect(() => {
    if (location) {
      let attempts = 0;

      const tryRefetchMathjax = (): void => {
        if (window && window.MathJax && window.MathJax.Hub) {
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
          clearInterval(intervalId);
        } else if (attempts >= MAX_ATTEMPTS) {
          clearInterval(intervalId);
        }
        attempts++;
      };

      const intervalId = setInterval(tryRefetchMathjax, ATTEMPTS_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [location]);

  return null;
}

export default MathjaxRefresh;
