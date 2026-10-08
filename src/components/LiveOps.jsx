import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateLiveOpsData, generateLoginActivityChart, calculateDatasetRiskScore, getTopOffendingIPs } from '../utils/dashboardService';

export default function LiveOps() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [riskScore, setRiskScore] = useState(null);
  const [topIPs, setTopIPs] = useState([]);

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('parsedRecords') || '[]');
    const classified = JSON.parse(localStorage.getItem('clustered') || '[]');

    if (records.length && classified.length) {
      setStats(generateLiveOpsData(records, classified));
      setChartData(generateLoginActivityChart(records));
      setRiskScore(calculateDatasetRiskScore(classified));
      setTopIPs(getTopOffendingIPs(classified));
    }
  }, []);

  if (!stats) {
    return <div className="sky-empty">No data loaded. Upload a file first.</div>;
  }

  return (
    <div>
      <h1 className="sky-heading mb-12">Live Operations</h1>

      <div className="grid grid-cols-4 gap-6 mb-16">
        <div className="sky-card">
          <div className="sky-stat-number">{stats.totalUsers}</div>
          <div className="sky-stat-label">Users in Dataset</div>
        </div>
        <div className="sky-card">
          <div className="sky-stat-number">{stats.failedAttempts}</div>
          <div className="sky-stat-label">Failed Attempts</div>
        </div>
        <div className="sky-card-dark">
          <div className="sky-stat-number text-white">{stats.bruteForceIPs}</div>
          <div className="sky-stat-label text-gray-500">Brute-Force IPs</div>
        </div>
        <div className="sky-card">
          <div className="sky-stat-number text-cyan-500">{stats.normalUsers}</div>
          <div className="sky-stat-label">Normal Users</div>
        </div>
      </div>

      <div className="sky-card mb-16">
        <h2 className="sky-subheading mb-8">Login Activity</h2>
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#F3F4F6" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                tick={{ fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#000000',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '12px 16px',
                }}
                labelStyle={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}
                itemStyle={{ color: '#FFFFFF', fontSize: '13px' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
                iconType="circle"
                iconSize={8}
              />
              <Line type="monotone" dataKey="success" stroke="#000000" strokeWidth={2} dot={false} name="Success" />
              <Line type="monotone" dataKey="failed" stroke="#06B6D4" strokeWidth={2} dot={false} name="Failed" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-16">
        <div className="sky-card-dark">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Dataset Risk Score</div>
          <div className="sky-stat-number text-white mb-3">{riskScore?.score.toFixed(1)}</div>
          <span className={`sky-badge ${
            riskScore?.level === 'Low' ? 'sky-badge-outline border-gray-600 text-gray-300' :
            riskScore?.level === 'Moderate' ? 'sky-badge-accent' :
            riskScore?.level === 'High' ? 'sky-badge-warning' :
            'sky-badge-danger'
          }`}>
            {riskScore?.level}
          </span>
        </div>

        <div className="sky-card">
          <div className="sky-stat-label mb-4">Failure Rate</div>
          <div className="sky-stat-number mb-2">{stats.failureRate}%</div>
          <p className="text-xs text-gray-400 font-medium">of total login attempts</p>
        </div>
      </div>

      <div>
        <h2 className="sky-subheading mb-6">Top Offending IPs</h2>
        <div className="space-y-0 border-2 border-black overflow-hidden">
          {topIPs.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold text-gray-300 w-6">#{idx + 1}</span>
                <div>
                  <div className="sky-mono font-semibold text-black">{item.ip}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">{item.failureRatio}% failure rate</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`sky-badge ${
                  item.cluster === 'Normal' ? 'sky-badge-outline' :
                  item.cluster === 'Suspicious' ? 'sky-badge-accent' :
                  'sky-badge-black'
                }`}>
                  {item.cluster}
                </span>
                <div className="text-right">
                  <div className="text-lg font-bold text-black">{item.riskScore}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
