'use client';

import React, { useState } from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number; // Opcional, para faturamentos duplos (lucro etc.)
}

interface AreaChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string; // HSL ou Hex
  accentColor?: string;
  currency?: boolean;
}

export const AreaChartCustom: React.FC<AreaChartProps> = ({ 
  data, 
  height = 160, 
  color = '#10b981', 
  accentColor = '#34d399', 
  currency = false 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.value), 10);
  const minVal = 0;
  const padding = 30;
  const chartHeight = height - padding * 2;

  // Calculo de coordenadas (seguro contra divisão por zero se houver apenas 1 ponto)
  const points = data.map((d, index) => {
    const divider = data.length > 1 ? data.length - 1 : 1;
    const x = data.length > 1 
      ? padding + (index / divider) * (400 - padding * 2) 
      : 200; // Centraliza se houver apenas 1 ponto
    const y = padding + chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  // Geração do path d da curva Bezier suave
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (2 * (next.x - curr.x)) / 3;
      const cpY2 = next.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
  }

  // Path do fechamento de área para gradiente de preenchimento
  const fillPathD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
    : '';

  const formatValue = (val: number) => {
    return currency 
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val)
      : val.toString();
  };

  return (
    <div className="relative w-full overflow-visible">
      <svg viewBox={`0 0 400 ${height}`} className="w-full overflow-visible" style={{ maxHeight: `${height}px` }}>
        <defs>
          <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
          <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Linhas de grade horizontais */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + chartHeight * ratio;
          const gridVal = maxVal - ratio * (maxVal - minVal);
          return (
            <g key={idx} className="opacity-10 dark:opacity-[0.05]">
              <line x1={padding} y1={y} x2={400 - padding} y2={y} stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" />
              <text x={padding - 5} y={y + 3} fill="currentColor" fontSize="8" textAnchor="end" className="font-semibold">
                {formatValue(gridVal)}
              </text>
            </g>
          );
        })}

        {/* Gradiente preenchido */}
        {fillPathD && (
          <path d={fillPathD} fill="url(#chart-area-grad)" />
        )}

        {/* Linha principal */}
        {pathD && (
          <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" filter="url(#glow-effect)" />
        )}

        {/* Pontos interativos */}
        {points.map((pt, idx) => (
          <g key={idx} 
             onMouseEnter={() => setHoveredIndex(idx)}
             onMouseLeave={() => setHoveredIndex(null)}
             className="cursor-pointer"
          >
            <circle cx={pt.x} cy={pt.y} r={hoveredIndex === idx ? "6" : "3.5"} fill={color} stroke="white" strokeWidth={hoveredIndex === idx ? "2" : "1"} className="transition-all duration-150" />
            {/* Texto do rótulo na base */}
            {idx % 2 === 0 && (
              <text x={pt.x} y={height - 5} fill="currentColor" className="opacity-40 text-[9px] font-bold" textAnchor="middle">
                {pt.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Floating HTML tooltip inside wrapper to prevent SVG boundary cutoffs */}
      {hoveredIndex !== null && (
        <div 
          className="absolute z-10 rounded-lg border border-white/10 bg-slate-950/90 p-2 text-[10px] text-white shadow-2xl backdrop-blur-md transition-all duration-150"
          style={{
            left: `${(points[hoveredIndex].x / 400) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 50}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <p className="font-bold text-lime-400">{points[hoveredIndex].label}</p>
          <p className="font-semibold">{formatValue(points[hoveredIndex].value)}</p>
        </div>
      )}
    </div>
  );
};

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  currency?: boolean;
}

export const BarChartCustom: React.FC<BarChartProps> = ({ 
  data, 
  height = 160, 
  color = '#34d399', 
  currency = false 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.value), 10);
  const minVal = 0;
  const padding = 30;
  const chartHeight = height - padding * 2;
  const chartWidth = 400 - padding * 2;
  const barWidth = (chartWidth / data.length) * 0.6;
  const gap = (chartWidth / data.length) * 0.4;

  const formatValue = (val: number) => {
    return currency 
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val)
      : val.toString();
  };

  return (
    <div className="relative w-full overflow-visible">
      <svg viewBox={`0 0 400 ${height}`} className="w-full overflow-visible" style={{ maxHeight: `${height}px` }}>
        <defs>
          <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Linhas de grade de fundo */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = padding + chartHeight * ratio;
          return (
            <line key={idx} x1={padding} y1={y} x2={400 - padding} y2={y} stroke="currentColor" className="opacity-10 dark:opacity-[0.05]" strokeWidth="0.75" />
          );
        })}

        {/* Desenho das Barras */}
        {data.map((d, idx) => {
          const x = padding + idx * (barWidth + gap) + gap / 2;
          const barHeight = ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
          const y = padding + chartHeight - barHeight;

          return (
            <g key={idx} 
               onMouseEnter={() => setHoveredIndex(idx)}
               onMouseLeave={() => setHoveredIndex(null)}
               className="cursor-pointer"
            >
              {/* Barra de fundo para esticar o hover detector */}
              <rect x={x - gap/2} y={padding} width={barWidth + gap} height={chartHeight} fill="transparent" />
              
              {/* Barra desenhada com cantos superiores arredondados */}
              <rect 
                x={x} 
                y={y} 
                width={barWidth} 
                height={barHeight > 0 ? barHeight : 2} 
                rx={Math.min(barWidth / 2, 4)}
                fill={hoveredIndex === idx ? 'url(#bar-grad)' : color}
                className="opacity-80 transition-all duration-150 hover:opacity-100" 
              />

              {/* Rótulo inferior */}
              <text x={x + barWidth / 2} y={height - 8} fill="currentColor" className="opacity-40 text-[8px] font-bold" textAnchor="middle">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating HTML tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute z-10 rounded-lg border border-white/10 bg-slate-950/90 p-2 text-[10px] text-white shadow-2xl backdrop-blur-md transition-all duration-150"
          style={{
            left: `${((padding + hoveredIndex * (barWidth + gap) + gap/2 + barWidth/2) / 400) * 100}%`,
            top: `${((padding + chartHeight - ((data[hoveredIndex].value - minVal) / (maxVal - minVal)) * chartHeight) / height) * 100 - 45}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <p className="font-bold text-lime-400">{data[hoveredIndex].label}</p>
          <p className="font-semibold">{formatValue(data[hoveredIndex].value)}</p>
        </div>
      )}
    </div>
  );
};
