import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ReadingRecord } from '../../types';

interface TempChartProps {
  data: ReadingRecord[];
}

export const TempChart: React.FC<TempChartProps> = ({ data }) => {
  const chartData = (data || []).map((d) => ({
    time: new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: d.temperature
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
          <YAxis domain={[34, 40]} stroke="#64748b" fontSize={11} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
            formatter={(val: number) => [`${val}°C`, 'Temperature']}
          />
          <Area type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
