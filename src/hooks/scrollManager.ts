import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MAX_ATTEMPTS = 10;
const ATTEMPTS_INTERVAL = 200;

function ScrollManager(): null {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      let attempts = 0;

      const tryScrollToElement = (): void => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          clearInterval(intervalId);
        } else if (attempts >= MAX_ATTEMPTS) {
          clearInterval(intervalId);
        }
        attempts++;
      };

      const intervalId = setInterval(tryScrollToElement, ATTEMPTS_INTERVAL);
      return () => clearInterval(intervalId);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

export default ScrollManager;
