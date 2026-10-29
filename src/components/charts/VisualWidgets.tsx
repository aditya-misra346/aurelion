import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from 'recharts';

/* ============================================================================
   1. MINI SPARKLINE (SVG Area Curve for Account & KPI Cards)
   ============================================================================ */
interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = '#D6B878',
  width: customWidth,
  height = 44,
  className = '',
}) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = customWidth || 160;
  const pad = 4;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - pad - ((val - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
  const gradId = `spark-${color.replace(/[^a-zA-Z0-9]/g, '')}-${data.length}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${customWidth ? '' : 'w-full'} ${className}`}
      style={{ height, ...(customWidth ? { width: customWidth } : {}) }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ============================================================================
   2. RADIAL GAUGE RING (Circular Progress Visual)
   ============================================================================ */
interface RadialGaugeProps {
  percent?: number;
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  percent,
  value,
  size = 112,
  strokeWidth = 8,
  color = '#D6B878',
  label,
  sublabel,
}) => {
  const rawPct = percent ?? value ?? 0;
  const clamped = Math.max(0, Math.min(100, rawPct));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[#080D18]/10 dark:text-[#F5F2EA]/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <span className="font-mono text-sm font-semibold tabular-nums leading-none">
          { `${Math.round(clamped)}%` }
        </span>
        {(label || sublabel) && (
          <span className="text-[8px] uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] mt-1 truncate max-w-[85%]">
            {label ?? sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   3. INTERACTIVE ALLOCATION DONUT CHART
   ============================================================================ */
export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

interface AllocationDonutProps {
  data: DonutSlice[];
  centerTitle?: string;
  centerLabel?: string;
  centerValue: string;
  height?: number;
}

export const AllocationDonut: React.FC<AllocationDonutProps> = ({
  data,
  centerTitle,
  centerLabel,
  centerValue,
  height = 240,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const activeItem = activeIndex !== null ? data[activeIndex] : null;
  const resolvedTitle = centerTitle ?? centerLabel ?? 'Allocation';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
      <div className="sm:col-span-6 relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
              isAnimationActive={false}
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D1423',
                borderColor: 'rgba(214, 184, 120, 0.35)',
                borderRadius: '12px',
                color: '#F5F2EA',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Allocation']}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Metric Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] truncate max-w-[110px]">
            {activeItem ? activeItem.name.split(' ')[0] : resolvedTitle}
          </span>
          <span className="font-mono text-base font-semibold tabular-nums mt-0.5">
            {activeItem
              ? `${Math.round((activeItem.value / total) * 100)}%`
              : centerValue}
          </span>
        </div>
      </div>

      {/* Compact Visual Legend Pills */}
      <div className="sm:col-span-6 space-y-2">
        {data.map((item, idx) => {
          const pct = Math.round((item.value / total) * 100);
          const isHovered = activeIndex === idx;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`cursor-pointer flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${
                isHovered
                  ? 'border-[#D6B878] bg-[#D6B878]/10'
                  : 'border-transparent bg-[#F5F2EA]/70 dark:bg-[#0D1423]/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium truncate">{item.name}</span>
              </div>
              <span className="font-mono font-semibold tabular-nums ml-2 shrink-0">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   4. INTERACTIVE WEALTH PROJECTION GRAPH (Dual-Curve Horizon Visualizer)
   ============================================================================ */
export const InteractiveWealthProjector: React.FC = () => {
  const [horizonYears, setHorizonYears] = useState<3 | 5 | 10>(5);
  const [initialCapital, setInitialCapital] = useState<number>(350000);

  const projectionData = Array.from({ length: horizonYears + 1 }, (_, yr) => {
    const aurelionCurve = Math.round(initialCapital * Math.pow(1.048, yr) + yr * 36000);
    const baselineCurve = Math.round(initialCapital * Math.pow(1.012, yr) + yr * 36000);
    return {
      year: `Yr ${yr}`,
      aurelion: aurelionCurve,
      baseline: baselineCurve,
    };
  });

  const finalAurelion = projectionData[projectionData.length - 1].aurelion;
  const finalDelta =
    finalAurelion - projectionData[projectionData.length - 1].baseline;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 shadow-luxury-light dark:shadow-luxury space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878] block">
            Interactive Capital Trajectory (Simulated)
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums">
              ${finalAurelion.toLocaleString()}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#36C995]/15 text-[#36C995]">
              +${finalDelta.toLocaleString()} Yield Advantage
            </span>
          </div>
        </div>

        {/* Horizon Pills */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] p-1 border border-current/10">
            {([3, 5, 10] as const).map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setHorizonYears(yr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  horizonYears === yr
                    ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                    : 'text-[#6E7A8E] dark:text-[#929DB0]'
                }`}
              >
                {yr}Y
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Principal Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[#6E7A8E] dark:text-[#929DB0]">Starting Reserve Capital</span>
          <span className="font-mono font-semibold text-[#B39352] dark:text-[#D6B878] tabular-nums">
            ${initialCapital.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={100000}
          max={1000000}
          step={50000}
          value={initialCapital}
          onChange={(e) => setInitialCapital(Number(e.target.value))}
          aria-label="Starting Reserve Capital"
          className="w-full accent-[#D6B878]"
        />
      </div>

      {/* Dual Area Graph */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="projGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D6B878" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D6B878" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" stroke="#929DB0" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#929DB0"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D1423',
                borderColor: 'rgba(214, 184, 120, 0.35)',
                borderRadius: '12px',
                color: '#F5F2EA',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
              }}
              formatter={(v: number, name: string) => [
                `$${v.toLocaleString()}`,
                name === 'aurelion' ? 'Aurelion Reserve (4.8% Sim)' : 'Standard Checking (1.2% Sim)',
              ]}
            />
            <Area
              type="monotone"
              dataKey="aurelion"
              stroke="#D6B878"
              strokeWidth={2.5}
              fill="url(#projGold)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="#6E7A8E"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="transparent"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
