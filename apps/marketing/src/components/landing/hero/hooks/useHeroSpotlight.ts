"use client";

import { useCallback } from "react";

export function useHeroSpotlight() {
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse") return;

      const element = event.currentTarget;
      const bounds = element.getBoundingClientRect();

      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      const rotateX = ((y - centerY) / centerY) * -2.5;
      const rotateY = ((x - centerX) / centerX) * 2.5;

      element.style.setProperty("--spotlight-x", `${x}px`);
      element.style.setProperty("--spotlight-y", `${y}px`);
      element.style.setProperty("--rotate-x", `${rotateX}deg`);
      element.style.setProperty("--rotate-y", `${rotateY}deg`);
    },
    []
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const element = event.currentTarget;

      element.style.setProperty("--spotlight-x", "50%");
      element.style.setProperty("--spotlight-y", "50%");
      element.style.setProperty("--rotate-x", "0deg");
      element.style.setProperty("--rotate-y", "0deg");
    },
    []
  );

  return { handlePointerMove, handlePointerLeave };
}
