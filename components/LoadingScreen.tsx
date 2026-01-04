import React, { useEffect, useState } from 'react';
import { LOADING_MESSAGES } from '../constants';
import { ScanFace } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-neon/20 blur-xl rounded-full animate-pulse"></div>
        <ScanFace className="relative w-24 h-24 text-neon animate-pulse-fast" />
        
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-neon shadow-[0_0_10px_#00f3ff] animate-[scan_2s_linear_infinite]" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Analyzing Physiology</h2>
      <p className="text-gray-400 text-lg min-h-[1.75rem] transition-opacity duration-300">
        {LOADING_MESSAGES[messageIndex]}
      </p>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;