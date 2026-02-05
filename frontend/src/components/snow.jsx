import { useEffect } from "react";

export default function Snowfall({ flakes = 110 }) {
  useEffect(() => {
    const month = new Date().getMonth();
    if (month !== 11) return;

    // container
    const container = document.createElement("div");
    container.className =
      "fixed inset-0 pointer-events-none z-[9999] overflow-hidden";

    // keyframes once
    const existing = document.querySelector('style[data-snowfall="true"]');
    if (!existing) {
      const style = document.createElement("style");
      style.setAttribute("data-snowfall", "true");
      style.innerHTML = `
        @keyframes snow-fall { 
          to { transform: translateY(115vh); } 
        }
        @keyframes snow-drift {
          0% { margin-left: 0px; }
          25% { margin-left: 15px; }
          50% { margin-left: -10px; }
          75% { margin-left: 12px; }
          100% { margin-left: 0px; }
        }
        @keyframes snow-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    const symbols = ["❄", "✦", "•"];

    for (let i = 0; i < flakes; i++) {
      const flakeWrap = document.createElement("span");
      const flake = document.createElement("span");

      const left = Math.random() * 100;
      const fallDuration = 6 + Math.random() * 10;
      const driftDuration = 2 + Math.random() * 4;
      const delay = Math.random() * 6;

      const size = 8 + Math.random() * 18;
      const opacity = 0.25 + Math.random() * 0.75;

      const blur = Math.random() < 0.35 ? 1 + Math.random() * 2.5 : 0; // depth
      const rotate = Math.random() < 0.5;

      flake.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      // wrapper controls falling + drifting
      flakeWrap.className = "absolute -top-10 select-none";
      flakeWrap.style.left = `${left}vw`;
      flakeWrap.style.animation = `snow-fall ${fallDuration}s linear ${delay}s infinite, snow-drift ${driftDuration}s ease-in-out ${delay}s infinite`;

      // inner controls size/blur/spin
      flake.className = "inline-block text-white";
      flake.style.fontSize = `${size}px`;
      flake.style.opacity = `${opacity}`;
      flake.style.filter = blur ? `blur(${blur}px)` : "none";
      flake.style.animation = rotate ? `snow-spin ${3 + Math.random() * 6}s linear infinite` : "none";

      flakeWrap.appendChild(flake);
      container.appendChild(flakeWrap);
    }

    document.body.appendChild(container);

    return () => container.remove();
  }, [flakes]);

  return null;
}
