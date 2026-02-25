import { useEffect, useRef } from 'react';

// Generates a static field of twinkling SVG stars as an ambient background layer
export default function StarField() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const stars = Array.from({ length: 120 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            r: Math.random() * 1.8 + 0.4,
            delay: Math.random() * 4,
            dur: Math.random() * 3 + 2,
            opacity: Math.random() * 0.6 + 0.2,
        }));

        // Inject SVG into canvas div
        canvas.innerHTML = `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
        style="position:absolute;top:0;left:0;pointer-events:none">
        <defs>
          ${stars.map((s, i) => `
            <animate id="tw${i}" attributeName="opacity"
              values="${s.opacity};0.05;${s.opacity}"
              dur="${s.dur}s" begin="${s.delay}s" repeatCount="indefinite"/>
          `).join('')}
        </defs>
        ${stars.map((s, i) => `
          <circle cx="${s.x}%" cy="${s.y}%" r="${s.r}"
            fill="white" opacity="${s.opacity}">
            <animate attributeName="opacity"
              values="${s.opacity};0.05;${s.opacity}"
              dur="${s.dur}s" begin="${s.delay}s" repeatCount="indefinite"/>
          </circle>
        `).join('')}
      </svg>
    `;
    }, []);

    return (
        <div
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
}
