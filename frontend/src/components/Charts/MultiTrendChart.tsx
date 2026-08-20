import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ReadingRecord } from '../../types';

interface MultiTrendChartProps {
  data: ReadingRecord[];
}

export const MultiTrendChart: React.FC<MultiTrendChartProps> = ({ data }) => {
  const chartData = (data || []).map((d) => ({
    time: new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: d.heartRate,
    spo2: d.spo2,
    temperature: d.temperature
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
          <YAxis yAxisId="left" stroke="#f43f5e" domain={[30, 180]} fontSize={11} />
          <YAxis yAxisId="right" orientation="right" stroke="#14b8a6" domain={[30, 100]} fontSize={11} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
          <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate (BPM)" stroke="#f43f5e" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#14b8a6" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f59e0b" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
