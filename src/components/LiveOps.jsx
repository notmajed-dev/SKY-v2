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
    return <div className="text-slate-400">No data loaded. Upload a file first.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Users in Dataset</div>
          <div className="text-3xl font-bold text-cyan-400">{stats.totalUsers}</div>
        </div>

        <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Failed Attempts</div>
          <div className="text-3xl font-bold text-orange-400">{stats.failedAttempts}</div>
        </div>

        <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Brute-Force IPs</div>
          <div className="text-3xl font-bold text-red-400">{stats.bruteForceIPs}</div>
        </div>

        <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Normal Users</div>
          <div className="text-3xl font-bold text-green-400">{stats.normalUsers}</div>
        </div>
      </div>

      <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
        <h3 className="mb-6 text-lg font-semibold text-slate-100">Login Activity</h3>
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#f8fafc' }}
              />
              <Legend />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-4">Dataset Risk Score</div>
          <div className="text-4xl font-bold text-yellow-400 mb-2">{riskScore?.score.toFixed(1)}</div>
          <div className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
            riskScore?.level === 'Low' ? 'bg-green-900/50 text-green-300' :
            riskScore?.level === 'Moderate' ? 'bg-yellow-900/50 text-yellow-300' :
            riskScore?.level === 'High' ? 'bg-orange-900/50 text-orange-300' :
            'bg-red-900/50 text-red-300'
          }`}>
            {riskScore?.level}
          </div>
        </div>

        <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-4">Failure Rate</div>
          <div className="text-4xl font-bold text-red-400">{stats.failureRate}%</div>
          <div className="text-xs text-slate-400 mt-2">
            of total login attempts
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
        <h3 className="mb-4 text-lg font-semibold text-slate-100">Top Offending IPs</h3>
        <div className="space-y-3">
          {topIPs.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-700/30 p-3">
              <div className="flex-1">
                <div className="font-mono text-cyan-300">{item.ip}</div>
                <div className="text-xs text-slate-400">{item.failureRatio}% failure rate</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded px-2 py-1 text-xs font-semibold ${
                  item.cluster === 'Normal' ? 'bg-green-900/50 text-green-300' :
                  item.cluster === 'Suspicious' ? 'bg-yellow-900/50 text-yellow-300' :
                  'bg-red-900/50 text-red-300'
                }`}>
                  {item.cluster}
                </span>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-100">{item.riskScore}</div>
                  <div className="text-xs text-slate-400">Risk</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
