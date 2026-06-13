import React, { useEffect, useState } from 'react';

export const CoreVirtualizationGraph = () => {  
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (time - lastTime >= 50) { // ~20fps for smooth sweeping without crazy fast
        setOffset((prev) => (prev - 1) % 100);
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const renderWave = (color: string, frequency: number, amplitude: number, phaseShift: number) => {
    const points = Array.from({ length: 50 }).map((_, i) => {
      const x = i * 2;
      // Inject the 'offset' into the Math.sin so that the wave moves horizontally over time
      const y = 8 + Math.sin((i * frequency) + (offset * 0.1) + phaseShift) * amplitude;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg className="absolute top-0 left-0 w-full h-full opacity-80" viewBox="0 0 100 16" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" className="drop-shadow-[0_0_4px_currentColor]"/>
        <path d={`M 0 16 L ${points} L 100 16 Z`} fill={`${color}`} style={{ opacity: 0.15 }} />
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-4 w-full">
      {/* Jantung Afektif */}
      <div className="group relative">
        <div className="flex justify-between text-[6px] sm:text-[10px] text-pink-400 mb-0.5 sm:mb-1 font-mono uppercase tracking-wider">
          <span className="font-bold flex items-center gap-1 sm:gap-1.5"><span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-pink-500 animate-pulse"/> Rhythm Jantung</span>
          <span className="font-bold">100%</span>
        </div>
        <div className="w-full h-4 sm:h-8 bg-blue-950/20 rounded-sm sm:rounded-md overflow-hidden border border-blue-900/40 relative">
          {renderWave('#ec4899', 0.2, 5, 0)}
          {/* Scanning line indicator */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-pink-300/50 shadow-[0_0_8px_#ec4899] animate-[shimmer-pulse_2s_infinite]" style={{ left: `${Math.abs((offset * 2) % 100)}%` }} />
        </div>
      </div>
      
      {/* Status Sentimen / Hati */}
      <div className="group relative">
        <div className="flex justify-between text-[6px] sm:text-[10px] text-cyan-400 mb-0.5 sm:mb-1 font-mono uppercase tracking-wider">
          <span className="font-bold flex items-center gap-1 sm:gap-1.5"><span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-400 animate-pulse"/> Matrix Hati</span>
          <span className="font-bold">98%</span>
        </div>
        <div className="w-full h-4 sm:h-8 bg-blue-950/20 rounded-sm sm:rounded-md overflow-hidden border border-blue-900/40 relative">
          {renderWave('#22d3ee', 0.1, 4, 2)}
          <div className="absolute top-0 bottom-0 w-[1px] bg-cyan-300/50 shadow-[0_0_8px_#22d3ee] animate-[shimmer-pulse_3s_infinite]" style={{ left: `${Math.abs((offset * 1.5) % 100)}%` }} />
        </div>
      </div>

      {/* Jaringan Neural */}
      <div className="group relative">
        <div className="flex justify-between text-[6px] sm:text-[10px] text-emerald-400 mb-0.5 sm:mb-1 font-mono uppercase tracking-wider">
          <span className="font-bold flex items-center gap-1 sm:gap-1.5"><span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse"/> Neural Synapse</span>
          <span className="font-bold">95%</span>
        </div>
        <div className="w-full h-4 sm:h-8 bg-blue-950/20 rounded-sm sm:rounded-md overflow-hidden border border-blue-900/40 relative">
          {renderWave('#34d399', 0.4, 4, 1)}
          <div className="absolute top-0 bottom-0 w-[1px] bg-emerald-300/50 shadow-[0_0_8px_#34d399] animate-[shimmer-pulse_2.5s_infinite]" style={{ left: `${Math.abs((offset * 1.8) % 100)}%` }} />
        </div>
      </div>

      {/* Metric Bars Tambahan */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-3 mt-0.5 sm:mt-1">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <div className="flex justify-between text-[5px] sm:text-[8px] text-blue-400 font-mono uppercase">
            <span>MEMORI LEKSOLOGI</span>
            <span>2048 TB/S</span>
          </div>
          <div className="w-full h-1 sm:h-1.5 bg-blue-950/40 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[85%] relative overflow-hidden">
               <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer-pulse_1.5s_infinite]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <div className="flex justify-between text-[5px] sm:text-[8px] text-amber-400 font-mono uppercase">
            <span>SUHU INTI EMOSI</span>
            <span>42.5°C</span>
          </div>
          <div className="w-full h-1 sm:h-1.5 bg-blue-950/40 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[60%] relative overflow-hidden">
               <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer-pulse_2.2s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
