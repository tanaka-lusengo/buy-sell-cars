"use client";

import { useEffect, useRef } from "react";

/**
 * A custom React hook that tracks when an element becomes visible in the viewport
 * and executes a callback function once. Uses the Intersection Observer API.
 *
 * @param ref - A React ref object pointing to the HTML element to observe
 * @param callback - Function to execute when the element becomes visible
 * @param threshold - Visibility threshold (0-1) that determines when the callback fires.
 *                   0 = any part visible, 1 = fully visible. Defaults to 0.5 (50% visible)
 *
 * @example
 * ```tsx
 * const elementRef = useRef<HTMLDivElement>(null);
 *
 * useTrackOnView(elementRef, () => {
 *   console.log('Element is now visible!');
 *   // Track analytics event, load content, etc.
 * }, 0.7); // Fire when 70% of element is visible
 *
 * return <div ref={elementRef}>Content to track</div>;
 * ```
 */
export const useTrackOnView = (
  ref: React.RefObject<HTMLElement> | React.RefObject<null>,
  callback: () => void,
  threshold = 0.5
) => {
  //Ref to track if the callback has already been fired to prevent multiple executions
  const hasFired = useRef(false);

  // Ref to store the latest callback function to avoid stale closures
  const callbackRef = useRef(callback);

  // Keep the callback ref up to date to avoid stale closures
  useEffect(() => {
    callbackRef.current = callback;
  });

  // Set up the Intersection Observer to watch for element visibility
  useEffect(() => {
    // Exit early if no element to observe or callback already fired
    if (!ref.current || hasFired.current) return;

    // Create observer that fires callback when element intersects viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current();
          hasFired.current = true;
          observer.disconnect(); // Stop observing after first trigger
        }
      },
      { threshold } // Use provided threshold for visibility detection
    );

    // Start observing the element
    observer.observe(ref.current);

    // Cleanup observer on unmount or dependency change
    return () => observer.disconnect();
  }, [ref, threshold]);
};
