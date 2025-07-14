"use client";

import { useEffect, useRef } from "react";

export const useTrackOnView = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  threshold = 0.5
) => {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!ref.current || hasFired.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
          hasFired.current = true;
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, callback, threshold]);
};
