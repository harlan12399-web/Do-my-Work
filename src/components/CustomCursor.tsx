import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable if pointer: fine (mouse users)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId: number;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setDotPos({ x: targetX, y: targetY });

      if (!isVisible) setIsVisible(true);

      // Check hovering
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, input, textarea, [data-interactive="true"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handlePointerDown = () => setIsClicked(true);
    const handlePointerUp = () => setIsClicked(false);
    const handlePointerLeave = () => setIsVisible(false);

    const animateRing = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setPosition({ x: currentX, y: currentY });
      animId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handlePointerLeave);
    animId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#ff7a3d] transition-opacity duration-300"
        style={{
          width: '5px',
          height: '5px',
          transform: `translate3d(${dotPos.x - 2.5}px, ${dotPos.y - 2.5}px, 0)`,
          opacity: isVisible ? 1 : 0,
        }}
      />
      {/* Lagging Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-white/30 transition-all duration-150 ease-out"
        style={{
          width: isHovering ? '44px' : isClicked ? '18px' : '30px',
          height: isHovering ? '44px' : isClicked ? '18px' : '30px',
          transform: `translate3d(${position.x - (isHovering ? 22 : isClicked ? 9 : 15)}px, ${position.y - (isHovering ? 22 : isClicked ? 9 : 15)}px, 0)`,
          backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
          borderColor: isHovering ? 'rgba(255, 255, 255, 0.6)' : isClicked ? 'rgba(255, 122, 61, 0.8)' : 'rgba(255, 255, 255, 0.25)',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
};
