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
      <div className="sky-empty">
        No data. Upload a file first.
      </div>
    );
  }

  return (
    <div>
      <h1 className="sky-heading mb-10">Parsed Records</h1>

      <div className="sky-box mb-10">
        <div className="flex items-center gap-10">
          <div>
            <div className="sky-stat-number">{stats?.totalRows}</div>
            <div className="sky-stat-label">Total Rows</div>
          </div>
          <div>
            <div className="sky-stat-number text-cyan-500">{stats?.uniqueIPs}</div>
            <div className="sky-stat-label">Unique IPs</div>
          </div>
          <div>
            <div className="sky-stat-number">{stats?.failedAttempts}</div>
            <div className="sky-stat-label">Failed</div>
          </div>
        </div>
      </div>

      <div className="sky-box overflow-x-auto">
        <table className="sky-table">
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Timestamp</th>
              <th>Username</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 5).map((record, idx) => (
              <tr key={idx}>
                <td className="sky-mono font-semibold text-black">{record.ip}</td>
                <td>{record.timestamp}</td>
                <td>{record.username}</td>
                <td>
                  <span
                    className={`sky-badge ${
                      record.status === 'failed'
                        ? 'sky-badge-black'
                        : 'sky-badge-outline'
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

      <div className="mt-12 sky-box">
        <div className="flex items-center justify-between mb-6">
          <h2 className="sky-subheading">Feature Matrix</h2>
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="sky-btn sky-btn-secondary text-xs px-5 py-2"
          >
            {showFeatures ? 'Hide' : 'Show'} Features
          </button>
        </div>

        {showFeatures && (
          <div className="overflow-x-auto">
            <table className="sky-table">
              <thead>
                <tr>
                  <th>IP</th>
                  <th>Attempts</th>
                  <th>Failed</th>
                  <th>Fail %</th>
                  <th>Frequency</th>
                  <th>Usernames</th>
                  <th>Peak Hour</th>
                </tr>
              </thead>
              <tbody>
                {features && Object.values(features).map((f, idx) => (
                  <tr key={idx}>
                    <td className="sky-mono font-semibold text-black">{f.ip}</td>
                    <td>{f.totalAttempts}</td>
                    <td className="font-semibold">{f.failedAttempts}</td>
                    <td className="font-semibold">{f.failureRatio}%</td>
                    <td>{f.loginFrequency}/hr</td>
                    <td>{f.uniqueUsernames}</td>
                    <td>{f.peakHour}:00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-12">
        <button
          onClick={() => {
            const result = performClustering(records);
            setClustered(result.classified);
            setClusterMetadata(result.metadata);
            localStorage.setItem('clustered', JSON.stringify(result.classified));
            localStorage.setItem('clusterMetadata', JSON.stringify(result.metadata));
          }}
          className="sky-btn sky-btn-primary"
        >
          Run K-Means Clustering
        </button>
      </div>

      {clustered && clusterMetadata && (
        <div className="mt-12">
          <h2 className="sky-subheading mb-8">Clustering Results</h2>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="sky-card text-center">
              <div className="sky-stat-number">{clusterMetadata.clusterCounts.Normal}</div>
              <div className="sky-stat-label">Normal</div>
            </div>
            <div className="sky-card text-center">
              <div className="sky-stat-number">{clusterMetadata.clusterCounts.Suspicious}</div>
              <div className="sky-stat-label">Suspicious</div>
            </div>
            <div className="sky-card-dark text-center">
              <div className="sky-stat-number text-white">{clusterMetadata.clusterCounts.Attacker}</div>
              <div className="sky-stat-label text-gray-400">Attacker</div>
            </div>
          </div>

          <div className="sky-box overflow-x-auto">
            <table className="sky-table">
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Cluster</th>
                  <th>Fail %</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {clustered.map((item, idx) => (
                  <tr key={idx}>
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
                    <td className="font-bold text-black">{item.riskScore}</td>
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
