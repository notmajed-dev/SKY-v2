import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      navigate('/');
    }, 3800);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSkip = () => navigate('/');

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      
      {/* Animated Background Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 1000 1000"
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="1000" height="1000" fill="url(#grid)" />
      </svg>

      {/* Animated Network Nodes (Background) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        style={{ zIndex: 1 }}
      >
        <defs>
          <style>{`
            @keyframes float1 {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(20px, -20px); }
            }
            @keyframes float2 {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(-25px, 15px); }
            }
            @keyframes float3 {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(15px, 20px); }
            }
            @keyframes pulse-ring {
              0% { r: 40; opacity: 0.8; }
              100% { r: 100; opacity: 0; }
            }
            @keyframes line-draw {
              0% { stroke-dashoffset: 1000; }
              100% { stroke-dashoffset: 0; }
            }
            .node-animated {
              animation: float1 4s ease-in-out infinite;
              filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.3));
            }
            .node-animated:nth-child(2) {
              animation: float2 5s ease-in-out infinite;
            }
            .node-animated:nth-child(3) {
              animation: float3 6s ease-in-out infinite;
            }
            .pulse-animated {
              animation: pulse-ring 3s ease-out infinite;
            }
            .line-animated {
              stroke-dasharray: 1000;
              animation: line-draw 2s ease-in-out forwards;
            }
          `}</style>
        </defs>

        {/* Animated Connection Lines */}
        <line
          x1="250"
          y1="300"
          x2="500"
          y2="500"
          stroke="#06B6D4"
          strokeWidth="2"
          opacity="0.4"
          className="line-animated"
          style={{ animationDelay: '0s' }}
        />
        <line
          x1="500"
          y1="500"
          x2="750"
          y2="300"
          stroke="#06B6D4"
          strokeWidth="2"
          opacity="0.4"
          className="line-animated"
          style={{ animationDelay: '0.2s' }}
        />
        <line
          x1="500"
          y1="500"
          x2="350"
          y2="750"
          stroke="#06B6D4"
          strokeWidth="2"
          opacity="0.4"
          className="line-animated"
          style={{ animationDelay: '0.4s' }}
        />
        <line
          x1="500"
          y1="500"
          x2="650"
          y2="750"
          stroke="#06B6D4"
          strokeWidth="2"
          opacity="0.4"
          className="line-animated"
          style={{ animationDelay: '0.6s' }}
        />

        {/* Floating Nodes */}
        <g className="node-animated">
          <circle cx="250" cy="300" r="8" fill="#06B6D4" opacity="0.6" />
          <circle cx="250" cy="300" r="15" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.3" />
        </g>

        <g className="node-animated">
          <circle cx="750" cy="300" r="8" fill="#06B6D4" opacity="0.6" />
          <circle cx="750" cy="300" r="15" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.3" />
        </g>

        <g className="node-animated">
          <circle cx="350" cy="750" r="8" fill="#06B6D4" opacity="0.6" />
          <circle cx="350" cy="750" r="15" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.3" />
        </g>

        <g className="node-animated">
          <circle cx="650" cy="750" r="8" fill="#06B6D4" opacity="0.6" />
          <circle cx="650" cy="750" r="15" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.3" />
        </g>

        {/* Central Pulsing Node */}
        <circle cx="500" cy="500" r="40" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.8" />
        <circle cx="500" cy="500" r="12" fill="#06B6D4" />
        <circle cx="500" cy="500" r="40" fill="none" stroke="#06B6D4" strokeWidth="1" className="pulse-animated" />
      </svg>

      {/* Main Content Container */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {/* Animated Logo Container */}
        <div className="mb-8">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-6"
            style={{
              animation: 'spin 3s linear infinite',
            }}
          >
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
            {/* Shield Shape */}
            <path
              d="M40 10L70 25V50C70 68 40 75 40 75C40 75 10 68 10 50V25L40 10Z"
              stroke="#06B6D4"
              strokeWidth="2"
              fill="none"
            />
            {/* Center Lock */}
            <circle cx="40" cy="45" r="6" fill="#06B6D4" />
            <path
              d="M36 45V40C36 38.9 37.3 38 38.5 38C39.7 38 41 38.9 41 40V45"
              stroke="#06B6D4"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          {/* Animated Logo Text */}
          <h1
            className="text-7xl font-black text-white tracking-tighter mb-2"
            style={{
              animation: 'fadeInScale 1s ease-out forwards',
            }}
          >
            SKY
          </h1>

          {/* Animated Subtitle */}
          <p
            className="text-sm tracking-widest text-cyan-400 font-light uppercase"
            style={{
              animation: 'fadeInUp 1s ease-out 0.3s forwards',
              opacity: 0,
            }}
          >
            SSH Key Yardstick
          </p>
        </div>

        {/* Animated Description */}
        <div
          className="mb-12 text-gray-400 text-sm leading-relaxed max-w-xs"
          style={{
            animation: 'fadeInUp 1s ease-out 0.6s forwards',
            opacity: 0,
          }}
        >
          <p>Intelligent SSH Log Analysis</p>
          <p className="text-cyan-400 font-semibold mt-2">K-Means Clustering • Risk Detection</p>
        </div>

        {/* Loading Indicator */}
        <div
          className="flex justify-center gap-2 mb-8"
          style={{
            animation: 'fadeInUp 1s ease-out 0.9s forwards',
            opacity: 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="text-xs text-gray-600 uppercase tracking-wider hover:text-white transition-colors"
          style={{
            animation: 'fadeInUp 1s ease-out 1.2s forwards',
            opacity: 0,
          }}
        >
          Skip
        </button>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}
