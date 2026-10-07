import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Upload from './components/Upload';
import PreviewTable from './components/PreviewTable';
import LiveOps from './components/LiveOps';
import RiskScoreboard from './components/RiskScoreboard';
import ClusterLab from './components/ClusterLab';
import ClusterInsights from './components/ClusterInsights';

function Layout() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navigation menu */}
      <nav className="border-b border-slate-800 bg-slate-950/50 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-xl font-bold tracking-wider text-cyan-400">
            SKY <span className="text-xs text-slate-400">v2 // SSH Log Analyzer</span>
          </div>
          <div className="flex space-x-6 text-sm font-medium text-slate-300">
            <Link to="/" className="transition hover:text-cyan-400">Upload</Link>
            <Link to="/preview" className="transition hover:text-cyan-400">Preview</Link>
            <Link to="/live-ops" className="transition hover:text-cyan-400">LiveOps</Link>
            <Link to="/risk" className="transition hover:text-cyan-400">Risk Scoreboard</Link>
            <Link to="/cluster-insights" className="transition hover:text-cyan-400">Cluster Insights</Link>
            <Link to="/cluster-lab" className="transition hover:text-cyan-400">Cluster Lab</Link>
          </div>
        </div>
      </nav>

      {/* Outlet for routed views */}
      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Upload />} />
        <Route path="preview" element={<PreviewTable />} />
        <Route path="live-ops" element={<LiveOps />} />
        <Route path="risk" element={<RiskScoreboard />} />
        <Route path="cluster-insights" element={<ClusterInsights />} />
        <Route path="cluster-lab" element={<ClusterLab />} />
      </Route>
    </Routes>
  );
}

export default App;
