import React, { useEffect, useState } from 'react';
import { extractFeatures } from '../utils/featureExtractor';
import { performClustering } from '../utils/clusteringService';

export default function PreviewTable() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [showFeatures, setShowFeatures] = useState(false);
  const [features, setFeatures] = useState(null);
  const [clustered, setClustered] = useState(null);
  const [clusterMetadata, setClusterMetadata] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('parsedRecords');
    const storedStats = localStorage.getItem('stats');
    if (stored) {
      setRecords(JSON.parse(stored));
      const extracted = extractFeatures(JSON.parse(stored));
      setFeatures(extracted);
    }
    if (storedStats) setStats(JSON.parse(storedStats));
  }, []);

  if (!records.length) {
    return (
      <div className="text-center text-slate-400">
        No data. Upload a file first.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 rounded-lg bg-slate-800/50 p-4">
        <div className="text-sm text-slate-300">
          <span className="font-semibold text-cyan-400">{stats?.totalRows}</span> rows |
          <span className="ml-2 font-semibold text-cyan-400">{stats?.uniqueIPs}</span> unique IPs |
          <span className="ml-2 font-semibold text-red-400">{stats?.failedAttempts}</span> failed
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-700 bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">IP</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Timestamp</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Username</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 5).map((record, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-700 hover:bg-slate-800/50"
              >
                <td className="px-4 py-3 font-mono text-cyan-300">{record.ip}</td>
                <td className="px-4 py-3 text-slate-300">{record.timestamp}</td>
                <td className="px-4 py-3 text-slate-300">{record.username}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      record.status === 'failed'
                        ? 'bg-red-900/50 text-red-300'
                        : 'bg-green-900/50 text-green-300'
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-100">Features Extracted</h3>
        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"
        >
          {showFeatures ? 'Hide' : 'Show'} Feature Matrix
        </button>

        {showFeatures && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700 bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">IP</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Attempts</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Failed</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Fail %</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Frequency</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Usernames</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Peak Hour</th>
                </tr>
              </thead>
              <tbody>
                {features && Object.values(features).map((f, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-mono text-cyan-300">{f.ip}</td>
                    <td className="px-4 py-3 text-slate-300">{f.totalAttempts}</td>
                    <td className="px-4 py-3 text-red-300">{f.failedAttempts}</td>
                    <td className="px-4 py-3 text-red-300">{f.failureRatio}%</td>
                    <td className="px-4 py-3 text-slate-300">{f.loginFrequency}/hr</td>
                    <td className="px-4 py-3 text-slate-300">{f.uniqueUsernames}</td>
                    <td className="px-4 py-3 text-slate-300">{f.peakHour}:00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={() => {
            const result = performClustering(records);
            setClustered(result.classified);
            setClusterMetadata(result.metadata);
            localStorage.setItem('clustered', JSON.stringify(result.classified));
            localStorage.setItem('clusterMetadata', JSON.stringify(result.metadata));
          }}
          className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700"
        >
          Run K-Means Clustering
        </button>
      </div>

      {clustered && clusterMetadata && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-100">Clustering Results</h3>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-green-900/30 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{clusterMetadata.clusterCounts.Normal}</div>
              <div className="text-sm text-slate-300">Normal</div>
            </div>
            <div className="rounded-lg bg-yellow-900/30 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{clusterMetadata.clusterCounts.Suspicious}</div>
              <div className="text-sm text-slate-300">Suspicious</div>
            </div>
            <div className="rounded-lg bg-red-900/30 p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{clusterMetadata.clusterCounts.Attacker}</div>
              <div className="text-sm text-slate-300">Attacker</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700 bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">IP</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Cluster</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Fail %</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {clustered.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/50">
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
                    <td className="px-4 py-3 font-semibold text-slate-300">{item.riskScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
