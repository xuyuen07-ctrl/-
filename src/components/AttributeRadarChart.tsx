import React from 'react';
import { Character } from '../types';

interface AttributeRadarChartProps {
  character: Character;
  ratings: {
    hp: number;
    speed: number;
    mass: number;
    difficulty: number;
    strategy: number;
    area: string;
    atk: number;
    special: number;
  };
}

export function AttributeRadarChart({ character, ratings }: AttributeRadarChartProps) {
  // Dimensions properties for the radar chart
  const cx = 140;
  const cy = 135;
  const maxRadius = 80;
  const numAxes = 6;

  // The axes labels and values mapping
  const axes = [
    { label: '生命力量 (HP)', value: ratings.hp },
    { label: '衝撞攻擊 (ATK)', value: ratings.atk },
    { label: '物理速度 (SPD)', value: ratings.speed },
    { label: '戰術策應 (STR)', value: ratings.strategy },
    { label: '重力質量 (MASS)', value: ratings.mass },
    { label: '特殊干涉 (SPEC)', value: ratings.special },
  ];

  // Helper to calculate coordinates
  const getCoordinates = (index: number, radius: number) => {
    const angle = (2 * Math.PI * index) / numAxes - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return { x, y };
  };

  // Generate background concentric hexagon rings
  const ringSteps = [0.2, 0.4, 0.6, 0.8, 1.0];
  const concentricRings = ringSteps.map((step) => {
    const radius = step * maxRadius;
    const points = Array.from({ length: numAxes }, (_, i) => {
      const { x, y } = getCoordinates(i, radius);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  // Calculate the vertices of the active character data polygon
  const characterPoints = axes.map((axis, i) => {
    // Map value ratio (0-100) to radius
    const ratio = Math.max(10, Math.min(100, axis.value)) / 100;
    const radius = ratio * maxRadius;
    const { x, y } = getCoordinates(i, radius);
    return { x, y, value: axis.value };
  });

  const polygonPointsStr = characterPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Get color details from the character theme
  const neonColor = character.color || '#3b82f6';

  return (
    <div className="flex flex-col items-center justify-center p-3 select-none bg-slate-950/40 rounded-2xl border border-slate-900 shadow-inner h-full">
      <div className="text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase mb-2 text-center flex items-center justify-center gap-1.5 w-full">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: neonColor }} />
        <span>五星維度雷達解析 (DIMENSIONAL SPECTRUM)</span>
      </div>

      <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center">
        <svg viewBox="0 0 280 270" className="w-full h-full overflow-visible">
          <defs>
            {/* SVG glow filter matching our gaming theme */}
            <filter id={`radar-glow-${character.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial background glow gradient */}
            <radialGradient id={`radar-radial-${character.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={neonColor} stopOpacity="0.15" />
              <stop offset="60%" stopColor={neonColor} stopOpacity="0.04" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Radial grid gradient background */}
          <circle cx={cx} cy={cy} r={maxRadius} fill={`url(#radar-radial-${character.id})`} />

          {/* Concentric grid lines (Hexagons) */}
          {concentricRings.map((points, index) => (
            <polygon
              key={`ring-${index}`}
              points={points}
              fill="none"
              stroke="rgba(148, 163, 184, 0.08)"
              strokeWidth="1"
              strokeDasharray={index === 4 ? 'none' : '2,2'}
            />
          ))}

          {/* Radial Axis lines extending from center */}
          {Array.from({ length: numAxes }).map((_, i) => {
            const outerPoint = getCoordinates(i, maxRadius);
            return (
              <line
                key={`axis-line-${i}`}
                x1={cx}
                y1={cy}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke="rgba(148, 163, 184, 0.12)"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Concentric level label values (e.g., 20, 60, 100) */}
          {[40, 80, 100].map((val) => {
            const radius = (val / 100) * maxRadius;
            return (
              <text
                key={`level-val-${val}`}
                x={cx + 3}
                y={cy - radius + 3}
                fill="rgba(148, 163, 184, 0.2)"
                className="font-mono text-[7px] font-bold text-left"
              >
                {val}
              </text>
            );
          })}

          {/* Core rating shaded region */}
          <polygon
            points={polygonPointsStr}
            fill={neonColor}
            fillOpacity="0.18"
            stroke={neonColor}
            strokeWidth="2.2"
            filter={`url(#radar-glow-${character.id})`}
            className="transition-all duration-300 ease-out"
          />

          {/* Solder vertices tracking dots */}
          {characterPoints.map((p, i) => (
            <g key={`vertex-${i}`} className="cursor-pointer group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#ffffff"
                stroke={neonColor}
                strokeWidth="1.8"
                className="transition-all duration-300 ease-out hover:scale-150"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="7"
                fill={neonColor}
                fillOpacity="0.2"
                className="animate-ping"
                style={{ animationDuration: '3s' }}
              />
            </g>
          ))}

          {/* Labels & values drawing around vertices */}
          {axes.map((axis, i) => {
            const { x, y } = getCoordinates(i, maxRadius + 14);
            const value = axis.value;

            // Compute ideal text-anchor offset and styling
            let textAnchor = 'middle';
            let dy = '0.35em';
            let dx = 0;

            if (i === 0) {
              textAnchor = 'middle';
              dy = '-0.6em';
            } else if (i === 3) {
              textAnchor = 'middle';
              dy = '1.3em';
            } else if (i === 1 || i === 2) {
              textAnchor = 'start';
              dx = 4;
            } else if (i === 4 || i === 5) {
              textAnchor = 'end';
              dx = -4;
            }

            return (
              <g key={`label-${i}`} className="font-sans text-[8.5px] font-black tracking-tight select-none">
                <text
                  x={x + dx}
                  y={y}
                  textAnchor={textAnchor}
                  dy={dy}
                  fill="rgba(203, 213, 225, 0.85)"
                  className="font-semibold"
                >
                  {axis.label.split(' ')[0]}
                </text>
                <text
                  x={x + dx}
                  y={y + (i === 0 ? -12 : i === 3 ? 12 : 10)}
                  textAnchor={textAnchor}
                  dy={dy}
                  fill={neonColor}
                  className="font-mono text-[9px] font-black"
                >
                  {value}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="text-[8.5px] text-slate-500 font-medium italic mt-2 text-center w-full max-w-[240px] border-t border-slate-900/50 pt-2 shrink-0">
        📊 數據根據球屬、質量比熱能、對碰撞動態及特殊力場綜合折算所得
      </div>
    </div>
  );
}
