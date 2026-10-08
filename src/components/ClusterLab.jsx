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
    <div>
      <h1 className="sky-heading mb-12">K-Means Laboratory</h1>

      <div className="grid grid-cols-3 gap-6 mb-16">
        <div className="col-span-1">
          <div className="sky-card">
            <h2 className="sky-subheading mb-8">Settings</h2>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-sm font-bold text-black">Max Iterations</label>
                  <span className="sky-mono text-sm font-bold text-cyan-500">{maxIterations}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 font-medium mt-2">Converges in ~4 iterations</div>
              </div>

              <div>
                <label className="text-sm font-bold text-black block mb-3">Random Seed</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value))}
                  className="sky-input"
                />
              </div>

              <button
                onClick={handleReCluster}
                className="sky-btn sky-btn-primary w-full"
              >
                Apply & Re-Cluster
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="sky-card h-full">
            <h2 className="sky-subheading mb-8">K-Means Explorer</h2>
            {scatterData.length > 0 && (
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid stroke="#F3F4F6" strokeDasharray="0" />
                  <XAxis
                    dataKey="x"
                    name="Failure %"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="y"
                    name="Frequency (/hr)"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3', stroke: '#D1D5DB' }}
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '12px 16px',
                    }}
                    labelStyle={{ color: '#9CA3AF', fontSize: '11px' }}
                    formatter={(value) => value.toFixed(2)}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Scatter name="Normal" data={normalData} fill="#D1D5DB" />
                  <Scatter name="Suspicious" data={suspiciousData} fill="#06B6D4" />
                  <Scatter name="Attacker" data={attackerData} fill="#000000" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
            {scatterData.length === 0 && (
              <div className="sky-empty">No clustering data. Run analysis first.</div>
            )}
            <div className="mt-4 text-xs text-gray-400 font-medium">
              X-axis: Failure Ratio (%) | Y-axis: Login Frequency (/hour)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
