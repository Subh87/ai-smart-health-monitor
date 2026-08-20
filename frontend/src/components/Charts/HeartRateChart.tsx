import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ReadingRecord } from '../../types';

interface HeartRateChartProps {
  data: ReadingRecord[];
}

export const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
  const chartData = (data || []).map((d) => ({
    time: new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: d.heartRate
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
          <YAxis domain={[40, 160]} stroke="#64748b" fontSize={11} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
            formatter={(val: number) => [`${val} BPM`, 'Heart Rate']}
          />
          <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#hrGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
