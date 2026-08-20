import React from 'react';
import { HealthStatusType } from '../types';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface StatusBadgeProps {
  status: HealthStatusType;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'NORMAL':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          label: 'NORMAL'
        };
      case 'ATTENTION':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
          label: 'ATTENTION'
        };
      case 'NO DATA':
        return {
          bg: 'bg-slate-800/80 border-slate-700 text-slate-400',
          icon: <RefreshCw className="w-4 h-4 text-slate-400 shrink-0" />,
          label: 'AWAITING DATA'
        };
      case 'CHECK READING':
      default:
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: <RefreshCw className="w-4 h-4 text-rose-400 shrink-0" />,
          label: 'CHECK READING'
        };
    }
  };

  const style = getBadgeStyle();
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-2 text-base font-bold' : 'px-3 py-1 text-sm font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${padding} transition-all`}>
      {style.icon}
      <span>{style.label}</span>
    </span>
  );
};
