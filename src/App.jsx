import React from 'react';
import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import Upload from './components/Upload';
import PreviewTable from './components/PreviewTable';
import LiveOps from './components/LiveOps';
import RiskScoreboard from './components/RiskScoreboard';
import ClusterLab from './components/ClusterLab';
import ClusterInsights from './components/ClusterInsights';

const navLinks = [
  { to: '/', label: 'Upload' },
  { to: '/preview', label: 'Preview' },
  { to: '/live-ops', label: 'LiveOps' },
  { to: '/risk', label: 'Risk' },
  { to: '/cluster-insights', label: 'Insights' },
  { to: '/cluster-lab', label: 'Lab' },
];

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="text-2xl font-black tracking-tight text-white">SKY</span>
            <span className="text-xs font-medium tracking-widest text-gray-500 uppercase">v2</span>
          </Link>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm font-semibold tracking-tight rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-8 py-12">
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
