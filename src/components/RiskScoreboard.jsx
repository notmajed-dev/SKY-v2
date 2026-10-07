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
    return <div className="text-slate-400">No clustering data. Run analysis first.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Highest Risk IP</div>
          <div className="font-mono text-lg text-red-400 mb-2">{stats?.highestRisk.ip}</div>
          <div className="text-2xl font-bold text-slate-100">{stats?.highestRisk.score}</div>
          <div className="text-xs text-slate-400 mt-2">{stats?.highestRisk.cluster}</div>
        </div>

        <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Users Above Threshold</div>
          <div className="text-sm text-slate-500 mb-2">Risk Score ≥ {stats?.threshold}</div>
          <div className="text-3xl font-bold text-orange-400">{stats?.usersAboveThreshold}</div>
        </div>

        <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Median Score</div>
          <div className="text-3xl font-bold text-cyan-400">{stats?.medianScore}</div>
          <div className="text-xs text-slate-400 mt-2">Middle value of all IPs</div>
        </div>
      </div>

      <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Full Scoreboard</h3>
          <select
            value={filterCluster}
            onChange={(e) => setFilterCluster(e.target.value)}
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-300 border border-slate-600"
          >
            <option value="all">All Clusters</option>
            <option value="Normal">Normal</option>
            <option value="Suspicious">Suspicious</option>
            <option value="Attacker">Attacker</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Rank</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">IP Address</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Cluster</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Failure %</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Attempts</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-700 hover:bg-slate-800/50 ${
                    item.riskScore >= 60 ? 'bg-slate-800/20' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-400">#{idx + 1}</td>
                  <td className="px-4 py-3 font-mono text-cyan-300">{item.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-1 text-xs font-semibold ${
                      item.clusterLabel === 'Normal' ? 'bg-green-900/50 text-green-300' :
                      item.clusterLabel === 'Suspicious' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-red-900/50 text-red-300'
                    }`}>
                      {item.clusterLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{item.failureRatio}%</td>
                  <td className="px-4 py-3 text-slate-300">{item.totalAttempts}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="h-2 w-24 rounded-full bg-slate-700">
                        <div
                          className={`h-2 rounded-full ${
                            item.riskScore >= 100 ? 'bg-red-500' :
                            item.riskScore >= 60 ? 'bg-orange-500' :
                            item.riskScore >= 30 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(item.riskScore / 150) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 font-bold text-slate-100">{item.riskScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-8 text-center text-slate-400">
            No IPs in selected cluster.
          </div>
        )}
      </div>
    </div>
  );
}
