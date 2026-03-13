/* GitPulse Component */
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CommitTrend = ({ weeklyData }) => {
  if (!weeklyData || weeklyData.length === 0) return null;

  const today = new Date();
  let lastMonth = "";

  const data = weeklyData.map((count, index) => {
    const date = new Date(today);
    // weeklyData has 52 entries, oldest first.
    // Index 51 is current week.
    date.setDate(date.getDate() - (51 - index) * 7);
    
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    const label = `${month} '${year}`;
    
    const showLabel = label !== lastMonth;
    lastMonth = label;

    return {
      week: index,
      count,
      dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      axisLabel: showLabel ? label : ""
    };
  });

  return (
    <div className="trend-section">
      <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Weekly Commit Trend</h3>
      <div style={{ width: '100%', height: 160 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="axisLabel" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              interval={0}
            />
            <YAxis hide={true} domain={[0, 'auto']} />
            <Tooltip 
              contentStyle={{ 
                background: '#0d0d1a', 
                border: '1px solid #6366f1',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#e2e8f0'
              }}
              labelStyle={{ display: 'none' }}
              formatter={(value, name, props) => {
                return [
                  <span key="val">{value} commits</span>,
                  <span key="date" style={{ color: '#9CA3AF', display: 'block', fontSize: '10px' }}>
                    Week of {props.payload.dateLabel}
                  </span>
                ];
              }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#6366f1" 
              fillOpacity={1} 
              fill="url(#colorCount)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommitTrend;
