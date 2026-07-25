import { useEffect, useRef, useState } from 'react';

interface AnimatedGridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  strokeDasharray?: string;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
}

export function AnimatedGridPattern({
  className,
  width = 60,
  height = 60,
  strokeDasharray = '0',
  numSquares = 120,
  duration = 4,
}: AnimatedGridPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Calculate dimensions and layout
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate random flashing squares
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const cols = Math.floor(dimensions.width / width);
    const rows = Math.floor(dimensions.height / height);
    
    const generateSquares = () => {
      const newSquares = Array.from({ length: numSquares }).map((_, i) => ({
        id: i,
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      }));
      setSquares(newSquares);
    };

    generateSquares();
    
    // Periodically scramble the glowing blocks for a dynamic tech feel
    const interval = setInterval(generateSquares, duration * 1000);
    return () => clearInterval(interval);
  }, [dimensions, width, height, numSquares, duration]);

  return (
    <div ref={containerRef} className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className || ''}`}>
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full fill-accent/5 stroke-accent/20"
      >
        <defs>
          <pattern
            id="animated-grid-pattern"
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x="-1"
            y="-1"
          >
            <path
              d={`M.5 ${height}V.5H${width}`}
              fill="none"
              strokeDasharray={strokeDasharray}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#animated-grid-pattern)" />
        <svg x="-1" y="-1" className="overflow-visible">
          {squares.map((square, index) => (
            <rect
              strokeWidth="0"
              key={`${square.id}-${index}`}
              width={width - 1}
              height={height - 1}
              x={square.x * width + 1}
              y={square.y * height + 1}
              className="animate-pulse-glow"
              style={{
                opacity: 0,
                animation: `pulse-glow ${duration}s infinite`,
                animationDelay: `${Math.random() * duration}s`,
              }}
            />
          ))}
        </svg>
      </svg>
      {/* Vignette fade around the edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/40 via-transparent to-canvas pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas via-transparent to-canvas pointer-events-none" />
    </div>
  );
}
