import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateScatterPlotData } from '../utils/scatterPlotService';
import { performClustering } from '../utils/clusteringService';

export default function ClusterLab() {
  const [scatterData, setScatterData] = useState([]);
  const [maxIterations, setMaxIterations] = useState(12);
  const [seed, setSeed] = useState(1);
  const [clusteringResult, setClusteringResult] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('parsedRecords') || '[]');
    const classified = JSON.parse(localStorage.getItem('clustered') || '[]');
    setRecords(stored);
    if (classified.length) {
      setScatterData(generateScatterPlotData(classified));
      setClusteringResult(classified);
    }
  }, []);

  const handleReCluster = () => {
    if (records.length) {
      const result = performClustering(records, 3, maxIterations, seed);
      setScatterData(generateScatterPlotData(result.classified));
      setClusteringResult(result.classified);
      localStorage.setItem('clustered', JSON.stringify(result.classified));
      localStorage.setItem('clusterMetadata', JSON.stringify(result.metadata));
    }
  };

  const normalData = scatterData.filter(d => d.cluster === 'Normal');
  const suspiciousData = scatterData.filter(d => d.cluster === 'Suspicious');
  const attackerData = scatterData.filter(d => d.cluster === 'Attacker');

  return (
    <div className="space-y-8">
      <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
        <h3 className="mb-6 text-lg font-semibold text-slate-100">K-Means Settings</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Iterations: {maxIterations}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={maxIterations}
              onChange={(e) => setMaxIterations(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="text-xs text-slate-400 mt-1">Current: converged in ~4 iterations</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Random Seed: {seed}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value))}
              className="w-full rounded-lg bg-slate-700 px-3 py-2 text-slate-100 border border-slate-600"
            />
          </div>

          <button
            onClick={handleReCluster}
            className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700 transition"
          >
            Apply & Re-Cluster
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
        <h3 className="mb-6 text-lg font-semibold text-slate-100">Interactive K-Means Explorer</h3>
        {scatterData.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="x" name="Failure %" stroke="#94a3b8" />
              <YAxis dataKey="y" name="Frequency (/hr)" stroke="#94a3b8" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#f8fafc' }}
                formatter={(value) => value.toFixed(2)}
              />
              <Legend />
              <Scatter name="Normal" data={normalData} fill="#10b981" />
              <Scatter name="Suspicious" data={suspiciousData} fill="#f59e0b" />
              <Scatter name="Attacker" data={attackerData} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        )}
        {scatterData.length === 0 && (
          <div className="py-16 text-center text-slate-400">No clustering data. Run analysis first.</div>
        )}
        <div className="mt-4 text-xs text-slate-400">
          X-axis: Failure Ratio (%) | Y-axis: Login Frequency (/hour)
        </div>
      </div>
    </div>
  );
}
