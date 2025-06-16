"use client";

import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";

    if (isBrowser) {
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        setWindowSize({
          width,
          height,
        });
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
};
