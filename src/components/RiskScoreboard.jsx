import React, { useEffect, useState } from 'react';
import { generateRiskScoreboard, calculateScoreboardStats } from '../utils/scoreBoardService';

export default function RiskScoreboard() {
  const [ranked, setRanked] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterCluster, setFilterCluster] = useState('all');

  useEffect(() => {
    const classified = JSON.parse(localStorage.getItem('clustered') || '[]');
    if (classified.length) {
      setRanked(generateRiskScoreboard(classified));
      setStats(calculateScoreboardStats(classified));
    }
  }, []);

  const filtered = filterCluster === 'all'
    ? ranked
    : ranked.filter(item => item.clusterLabel === filterCluster);

  if (!ranked.length) {
    return <div className="sky-empty">No clustering data. Run analysis first.</div>;
  }

  return (
    <div>
      <h1 className="sky-heading mb-12">Risk Scoreboard</h1>

      <div className="grid grid-cols-3 gap-6 mb-16">
        <div className="sky-card-dark">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-3">Highest Risk</div>
          <div className="sky-mono text-sm text-cyan-400 mb-2">{stats?.highestRisk.ip}</div>
          <div className="sky-stat-number text-white">{stats?.highestRisk.score}</div>
          <div className="text-xs text-gray-500 mt-2 font-medium">{stats?.highestRisk.cluster}</div>
        </div>

        <div className="sky-card">
          <div className="sky-stat-label mb-1">Above Threshold</div>
          <div className="text-xs text-gray-400 font-medium mb-3">Score ≥ {stats?.threshold}</div>
          <div className="sky-stat-number">{stats?.usersAboveThreshold}</div>
        </div>

        <div className="sky-card">
          <div className="sky-stat-label mb-3">Median Score</div>
          <div className="sky-stat-number text-cyan-500">{stats?.medianScore}</div>
          <div className="text-xs text-gray-400 font-medium mt-2">Middle value of all IPs</div>
        </div>
      </div>

      <div className="sky-card">
        <div className="flex items-center justify-between mb-8">
          <h2 className="sky-subheading">Full Scoreboard</h2>
          <select
            value={filterCluster}
            onChange={(e) => setFilterCluster(e.target.value)}
            className="sky-select"
          >
            <option value="all">All Clusters</option>
            <option value="Normal">Normal</option>
            <option value="Suspicious">Suspicious</option>
            <option value="Attacker">Attacker</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="sky-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>IP Address</th>
                <th>Cluster</th>
                <th>Failure %</th>
                <th>Attempts</th>
                <th className="text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={idx}
                  className={item.riskScore >= 60 ? 'bg-gray-50' : ''}
                >
                  <td className="font-black text-lg text-gray-300">#{idx + 1}</td>
                  <td className="sky-mono font-semibold text-black">{item.ip}</td>
                  <td>
                    <span className={`sky-badge ${
                      item.clusterLabel === 'Normal' ? 'sky-badge-outline' :
                      item.clusterLabel === 'Suspicious' ? 'sky-badge-accent' :
                      'sky-badge-black'
                    }`}>
                      {item.clusterLabel}
                    </span>
                  </td>
                  <td>{item.failureRatio}%</td>
                  <td>{item.totalAttempts}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-4">
                      <div className="sky-progress-track w-24">
                        <div
                          className="sky-progress-fill"
                          style={{
                            width: `${Math.min((item.riskScore / 150) * 100, 100)}%`,
                            background: item.riskScore >= 100 ? '#000000' :
                                        item.riskScore >= 60 ? '#06B6D4' :
                                        '#E5E7EB'
                          }}
                        />
                      </div>
                      <span className="w-10 text-right font-black text-black">{item.riskScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="sky-empty">
            No IPs in selected cluster.
          </div>
        )}
      </div>
    </div>
  );
}
