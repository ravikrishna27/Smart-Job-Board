import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that automatically scrolls the window to the top
 * whenever the route (pathname) changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // "smooth" can be annoying on fast navigations
    });
  }, [pathname]);

  return null;
}
