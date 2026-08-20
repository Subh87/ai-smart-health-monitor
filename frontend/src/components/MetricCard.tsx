import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  targetRange: string;
  icon: React.ReactNode;
  accentColor: 'rose' | 'teal' | 'amber' | 'cyan';
  trend?: 'up' | 'down' | 'stable';
  trendText?: string;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  targetRange,
  icon,
  accentColor,
  trend = 'stable',
  trendText,
  subtitle
}) => {
  const getGlow = () => {
    switch (accentColor) {
      case 'rose':
        return 'border-rose-500/30 hover:border-rose-500/60 shadow-rose-500/5';
      case 'teal':
        return 'border-teal-500/30 hover:border-teal-500/60 shadow-teal-500/5';
      case 'cyan':
        return 'border-cyan-500/30 hover:border-cyan-500/60 shadow-cyan-500/5';
      case 'amber':
      default:
        return 'border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/5';
    }
  };

  const getIconBg = () => {
    switch (accentColor) {
      case 'rose':
        return 'bg-rose-500/10 text-rose-400';
      case 'teal':
        return 'bg-teal-500/10 text-teal-400';
      case 'cyan':
        return 'bg-cyan-500/10 text-cyan-400';
      case 'amber':
      default:
        return 'bg-amber-500/10 text-amber-400';
    }
  };

  return (
    <div className={`glass-card p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-lg ${getGlow()}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl ${getIconBg()}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-outfit">
          {value}
        </span>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-slate-400">
        <div className="flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-amber-400" />}
          {trend === 'stable' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
          <span>{trendText || `Target: ${targetRange}`}</span>
        </div>
        {subtitle && <span className="text-slate-500">{subtitle}</span>}
      </div>
    </div>
  );
};
