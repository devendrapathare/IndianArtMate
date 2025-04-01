import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * whenever the pathname in the URL changes
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    // Don't scroll to top if there's a hash in the URL (for anchor navigation)
    if (hash) {
      // Let the component handle its own scrolling
      return;
    }
    
    // Check if the pathname includes specific paths for custom scrolling behavior
    const behavior = pathname.includes('productDes') ? 'smooth' : 'auto';
    
    // Small delay to ensure page has rendered
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: behavior // Use smooth scrolling for product description page, auto for others
      });
    }, 100);
  }, [pathname, hash]);
  
  return null; // This component doesn't render anything
}

export default ScrollToTop; 