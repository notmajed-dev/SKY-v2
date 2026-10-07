import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseCSV, calculateStats } from '../utils/csvParser';

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const content = await file.text();
      const records = parseCSV(content);
      
      if (!records.length) {
        setError('No valid records found in file');
        setLoading(false);
        return;
      }
      
      const stats = calculateStats(records);
      localStorage.setItem('parsedRecords', JSON.stringify(records));
      localStorage.setItem('stats', JSON.stringify(stats));
      
      navigate('/preview');
    } catch (err) {
      setError('Failed to parse file: ' + err.message);
    }
    
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-2xl">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`rounded-lg border-2 border-dashed p-12 text-center transition ${
            isDragging
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-slate-600 bg-slate-800/50'
          }`}
        >
          <div className="mb-4 text-4xl">📁</div>
          <h3 className="mb-2 text-lg font-semibold text-slate-100">Drag CSV or auth.log here</h3>
          <p className="mb-6 text-sm text-slate-400">or click to browse</p>
          
          <input
            type="file"
            id="file-input"
            accept=".csv,.log,.txt"
            onChange={handleFileInput}
            className="hidden"
          />
          <label htmlFor="file-input">
            <button
              type="button"
              onClick={() => document.getElementById('file-input').click()}
              className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition hover:bg-cyan-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Parsing...' : 'Browse Files'}
            </button>
          </label>

          {error && (
            <div className="mt-4 rounded-lg bg-red-900/30 p-3 text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
