import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // We don't want smooth scroll here, we want it instantly at the top
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    
    // Restore smooth scrolling for anchor links
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 0);
  }, [pathname]);

  return null;
}
