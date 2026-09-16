import { useState, useEffect } from "react";

/**
 * Hook for managing fluid entrance and exit animations before unmounting
 * @param {boolean} isOpen - Active visibility state from parent
 * @param {number} duration - Duration in milliseconds of the exit animation
 * @returns {{ shouldRender: boolean, isClosing: boolean }}
 */
export function useModalTransition(isOpen, duration = 240) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender, duration]);

  return { shouldRender, isClosing };
}
