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
    return <div className="sky-empty">No data. Run clustering first.</div>;
  }

  const clusterStyles = {
    Normal: { card: 'sky-card', accent: 'text-black', dot: 'bg-gray-300' },
    Suspicious: { card: 'sky-card', accent: 'text-cyan-500', dot: 'bg-cyan-500' },
    Attacker: { card: 'sky-card-dark', accent: 'text-white', dot: 'bg-white' },
  };

  return (
    <div>
      <h1 className="sky-heading mb-12">Cluster Insights</h1>

      <div className="grid grid-cols-3 gap-6 mb-16">
        {Object.entries(insights).map(([label, data]) => {
          const style = clusterStyles[label];
          return (
            <div key={label} className={style.card}>
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                <span className={`text-sm font-bold uppercase tracking-wide ${label === 'Attacker' ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
              </div>

              <div className={`sky-stat-number ${style.accent} mb-1`}>{data.count}</div>
              <div className={`text-xs font-medium mb-8 ${label === 'Attacker' ? 'text-gray-500' : 'text-gray-400'}`}>{data.percentage}% of dataset</div>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className={`text-xs font-medium uppercase tracking-wide ${label === 'Attacker' ? 'text-gray-500' : 'text-gray-400'}`}>Avg Failure Rate</span>
                  <span className={`text-lg font-bold ${style.accent}`}>{data.avgFailureRate}%</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className={`text-xs font-medium uppercase tracking-wide ${label === 'Attacker' ? 'text-gray-500' : 'text-gray-400'}`}>Avg Attempts</span>
                  <span className={`text-lg font-bold ${style.accent}`}>{data.avgAttempts}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className={`text-xs font-medium uppercase tracking-wide ${label === 'Attacker' ? 'text-gray-500' : 'text-gray-400'}`}>Total Fails</span>
                  <span className={`text-lg font-bold ${style.accent}`}>{data.totalFails}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="sky-subheading mb-6">Sample Members</h2>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(insights).map(([label, data]) => (
            <div key={label} className="sky-card">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${clusterStyles[label].dot}`} />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</span>
              </div>
              <div className="space-y-3">
                {data.members.length > 0 ? data.members.map((member, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-b-0">
                    <span className="sky-mono font-semibold text-black">{member.ip}</span>
                    <span className="text-xs font-semibold text-gray-400">{member.failureRatio}%</span>
                  </div>
                )) : (
                  <div className="text-xs text-gray-400 font-medium">No members</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
