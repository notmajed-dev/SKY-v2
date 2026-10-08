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
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-xl text-center">
        <h1 className="sky-heading mb-4">Upload SSH Log</h1>
        <p className="text-gray-400 font-medium mb-12">
          Drop your CSV or auth.log file to begin analysis
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed p-16 transition-all duration-300 cursor-pointer ${
            isDragging
              ? 'border-cyan-500 bg-cyan-50'
              : 'border-black bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => document.getElementById('file-input').click()}
        >
          <div className="mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto" strokeWidth="2" stroke={isDragging ? '#06B6D4' : '#000000'}>
              <path d="M8 32V36C8 38.2091 9.79086 40 12 40H36C38.2091 40 40 38.2091 40 36V32" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M24 8V32" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 16L24 8L32 16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Drag & drop your file here
          </p>
          <p className="text-xs text-gray-400">
            CSV, LOG, or TXT accepted
          </p>
        </div>

        <input
          type="file"
          id="file-input"
          accept=".csv,.log,.txt"
          onChange={handleFileInput}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => document.getElementById('file-input').click()}
          className="sky-btn sky-btn-primary mt-8 px-10"
          disabled={loading}
        >
          {loading ? 'Parsing...' : 'Browse Files'}
        </button>

        {error && (
          <div className="mt-8 border-2 border-black px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
