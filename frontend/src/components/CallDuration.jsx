import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Dropdown from './Dropdown';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-sky-200 p-3 rounded-lg shadow-lg">
        <p className="text-sky-700 text-xs mb-1">{label}</p>
        <p className="text-sky-950 font-semibold text-sm">
          {payload[0].value} Min
        </p>
      </div>
    );
  }
  return null;
};

const CallDuration = ({ data: apiData }) => {
  const [timeRange, setTimeRange] = useState('Last 15 days');
  const defaultData = [
    { name: '1 Feb', value: 34 },
    { name: '2 Feb', value: 54 },
    { name: '3 Feb', value: 35 },
    { name: '4 Feb', value: 43 },
    { name: '5 Feb', value: 52 },
    { name: '6 Feb', value: 87 },
    { name: '7 Feb', value: 41 },
    { name: '8 Feb', value: 63 },
    { name: '9 Feb', value: 41 },
    { name: '10 Feb', value: 51 },
    { name: '11 Feb', value: 52 },
    { name: '12 Feb', value: 52 },
    { name: '13 Feb', value: 77 },
  ];

  const chartData = apiData && apiData.length > 0
    ? apiData.map(item => ({
        name: item.date,
        value: item.duration
      }))
    : defaultData;

  return (
    <div className="w-full bg-white shadow-[0_4px_20px_rgba(14,165,233,0.08)] rounded-2xl px-6 py-6 border border-sky-100 flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-sky-950 text-lg font-semibold">Total Call Duration</h3>
          <div className="flex items-center gap-2">
            <span className="text-sky-700 text-sm">8.06%</span>
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Icon icon="lucide:trending-up" className="text-white text-xs" />
            </div>
          </div>
        </div>
        
        <div className="w-44 relative z-20">
          <Dropdown
            options={["Last 7 days", "Last 15 days", "Last 30 days"]}
            value={timeRange}
            onSelect={(val) => setTimeRange(val)}
            inputClass="bg-white border-sky-200 shadow-sm !rounded-full !py-1.5 px-4 text-sm text-sky-700 text-center min-w-[120px] focus:outline-none hover:bg-sky-50 transition-colors cursor-pointer"
            optionClass="shadow-lg border-sky-100"
            icon="text-sky-500 right-3"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] sm:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              horizontal={false} 
              vertical={true} 
              stroke="#e0f2fe" 
            />
            
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dx={-10}
              domain={[0, 'auto']}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#38bdf8', strokeWidth: 1 }} />
            
            <Area
              type="linear"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ r: 7, fill: '#38bdf8', strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#38bdf880', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CallDuration;