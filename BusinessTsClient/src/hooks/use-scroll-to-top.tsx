import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls the window to the top of the page on route change.
 *
 * This hook listens for changes in the current pathname and automatically
 * scrolls to the top of the page whenever the route changes, improving 
 * user experience during navigation.
 *
 * @returns {null} - This hook does not return any value.
 */
export function useScrollToTop() {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
  }