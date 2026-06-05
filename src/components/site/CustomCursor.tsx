import { useEffect, useRef, useState } from "react";

const SILVER_TONES = [
  "rgba(248, 250, 252, 0.95)",
  "rgba(209, 213, 219, 0.8)",
  "rgba(156, 163, 175, 0.6)",
  "rgba(229, 231, 235, 0.4)",
];

export function CustomCursor() {
  const [cursorMode, setCursorMode] = useState<"default" | "hover" | "drag">("default");
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);

  // Use refs for positions to avoid triggering React updates on mouse move
  const mouse = useRef({ x: -100, y: -100 });
  
  // Clean cursor with just lead dot (index 0) and trailing ring (index 1)
  const trails = useRef([
    { x: -100, y: -100, lerp: 0.26 }, // Trail 0 (Lead dot)
    { x: -100, y: -100, lerp: 0.14 }, // Trail 1 (Follow ring)
  ]);

  // Track scales mathematically inside the loop (no fighting with CSS transitions)
  const scales = useRef({
    lead: 1.0,
    ring: 1.0,
    glow: 1.0,
  });

  const glowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const elRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleHoverState = (target: HTMLElement | null) => {
      if (!target) return;
      if (target.closest("[data-cursor='drag']")) {
        setCursorMode("drag");
      } else if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-pointer") ||
        target.classList.contains("interactive")
      ) {
        setCursorMode("hover");
      } else {
        setCursorMode("default");
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (hidden) setHidden(false);
      handleHoverState(e.target as HTMLElement);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    const handleHoverStart = (e: MouseEvent) => {
      handleHoverState(e.target as HTMLElement);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleHoverStart, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    // Butter-smooth RAF loop for updating trail positions & scales
    let animId: number;
    const updateTrails = () => {
      const targetX = mouse.current.x;
      const targetY = mouse.current.y;

      // Click shrink feedback (0.65 scale)
      const clickFactor = clicked ? 0.65 : 1.0;
      
      const targetLeadScale = (cursorMode === "drag" ? 0.0 : cursorMode === "hover" ? 1.6 : 1.0) * clickFactor;
      const targetRingScale = (cursorMode === "drag" ? 3.5 : cursorMode === "hover" ? 2.0 : 1.0) * clickFactor;
      const targetGlowScale = (cursorMode === "drag" ? 3.5 : cursorMode === "hover" ? 2.0 : 1.0) * clickFactor;

      scales.current.lead += (targetLeadScale - scales.current.lead) * 0.15;
      scales.current.ring += (targetRingScale - scales.current.ring) * 0.15;
      scales.current.glow += (targetGlowScale - scales.current.glow) * 0.15;

      trails.current.forEach((trail, i) => {
        trail.x += (targetX - trail.x) * trail.lerp;
        trail.y += (targetY - trail.y) * trail.lerp;

        const el = elRefs.current[i];
        if (el) {
          let currentScale = 1.0;
          if (i === 0) currentScale = scales.current.lead;
          if (i === 1) currentScale = scales.current.ring;

          el.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate3d(-50%, -50%, 0) scale(${currentScale})`;
        }
      });

      // Update separate glow backdrop tied to Trail 1 (index 1) with matching scale lerp
      if (glowRef.current) {
        const t1 = trails.current[1];
        glowRef.current.style.transform = `translate3d(${t1.x}px, ${t1.y}px, 0) translate3d(-50%, -50%, 0) scale(${scales.current.glow})`;
        glowRef.current.style.background = cursorMode === "drag"
          ? "radial-gradient(circle, rgba(103, 232, 249, 0.25) 0%, rgba(103, 232, 249, 0.05) 50%, transparent 100%)"
          : "radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(209, 213, 219, 0.05) 50%, transparent 100%)";
      }

      // Update text container overlay position tied to Trail 1
      if (textRef.current) {
        const t1 = trails.current[1];
        textRef.current.style.transform = `translate3d(${t1.x}px, ${t1.y}px, 0) translate3d(-50%, -50%, 0)`;
      }

      animId = requestAnimationFrame(updateTrails);
    };

    animId = requestAnimationFrame(updateTrails);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleHoverStart);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [hidden, cursorMode, clicked]);

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Glow aura backdrop (tied to separate glowRef) */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 60,
          height: 60,
          borderRadius: "50%",
          filter: "blur(8px)",
          willChange: "transform, background",
          transition: "background 0.3s",
        }}
      />

      {/* Lead cursor dot (tied to Trail 0) */}
      <div
        ref={(el) => { elRefs.current[0] = el; }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          backgroundColor: SILVER_TONES[0],
          borderRadius: "50%",
          boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.8)",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />

      {/* Trailing ring 1 (tied to Trail 1) */}
      <div
        ref={(el) => { elRefs.current[1] = el; }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 20,
          height: 20,
          borderColor: cursorMode === "drag" ? "rgba(103, 232, 249, 0.85)" : SILVER_TONES[1],
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "50%",
          willChange: "transform, opacity, box-shadow, border-color",
          opacity: cursorMode !== "default" ? 0.95 : 0.65,
          boxShadow: cursorMode === "drag"
            ? "0 0 20px 4px rgba(103, 232, 249, 0.35), inset 0 0 10px 1px rgba(103, 232, 249, 0.15)"
            : cursorMode === "hover"
              ? "0 0 15px 3px rgba(255, 255, 255, 0.4), inset 0 0 10px 1px rgba(255, 255, 255, 0.2)"
              : "0 0 8px 1px rgba(209, 213, 219, 0.2)",
          transition: "opacity 0.2s, box-shadow 0.2s, border-color 0.3s",
        }}
      />

      {/* Text overlay for DRAG scrolling (tied to separate textRef) */}
      {cursorMode === "drag" && (
        <div
          ref={textRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            willChange: "transform",
            zIndex: 10,
          }}
          className="flex items-center gap-1 text-[8px] font-extrabold tracking-[0.12em] text-[#67e8f9] select-none font-mono animate-fade-in"
        >
          <span>‹</span>
          <span>DRAG</span>
          <span>›</span>
        </div>
      )}
    </div>
  );
}
