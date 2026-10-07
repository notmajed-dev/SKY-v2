import React, { useEffect, useState } from 'react';
import { generateClusterInsights } from '../utils/clusterInsightsService';

export default function ClusterInsights() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const classified = JSON.parse(localStorage.getItem('clustered') || '[]');
    if (classified.length) {
      setInsights(generateClusterInsights(classified));
    }
  }, []);

  if (!insights) {
    return <div className="text-slate-400">No data. Run clustering first.</div>;
  }

  const clusterColors = {
    Normal: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-700' },
    Suspicious: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-700' },
    Attacker: { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-700' }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(insights).map(([label, data]) => {
          const colors = clusterColors[label];
          return (
            <div key={label} className={`rounded-lg p-6 border ${colors.bg} ${colors.border}`}>
              <div className={`text-sm font-semibold ${colors.text} mb-4`}>{label}</div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-400">Count</div>
                  <div className={`text-2xl font-bold ${colors.text}`}>{data.count}</div>
                  <div className="text-xs text-slate-400">{data.percentage}% of dataset</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Avg Failure Rate</div>
                  <div className={`text-lg font-bold ${colors.text}`}>{data.avgFailureRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Avg Attempts</div>
                  <div className={`text-lg font-bold ${colors.text}`}>{data.avgAttempts}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Total Fails</div>
                  <div className={`text-lg font-bold ${colors.text}`}>{data.totalFails}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
        <h3 className="mb-6 text-lg font-semibold text-slate-100">Sample Members</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(insights).map(([label, data]) => (
            <div key={label} className="rounded-lg bg-slate-700/30 p-4">
              <div className="text-sm font-semibold text-slate-300 mb-3">{label}</div>
              <div className="space-y-2">
                {data.members.length > 0 ? data.members.map((member, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="font-mono text-cyan-300">{member.ip}</span>
                    <span className="text-slate-400">{member.failureRatio}%</span>
                  </div>
                )) : (
                  <div className="text-xs text-slate-500">No members</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
