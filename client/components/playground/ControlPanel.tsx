import React from 'react';
import { Play, Square, RotateCcw, Terminal } from 'lucide-react';

interface Props {
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  isRunning: boolean;
  logs: string[];
}

export const ControlPanel: React.FC<Props> = ({ onRun, onStop, onReset, isRunning, logs }) => {
  const lastLog = logs[logs.length - 1] || 'Ready to run';

  return (
    <div className="h-full flex items-center px-6 gap-6">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
          <span className="text-xl">🎹</span>
        </div>
        <div>
          <h3 className="text-xs font-bold text-white">Stage</h3>
          <p className="text-[10px] text-gray-500">Audio Output</p>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <button
            onClick={onRun}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-white text-sm transition-colors"
          >
            <Play size={16} fill="currentColor" />
            RUN
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-white text-sm transition-colors animate-pulse"
          >
            <Square size={16} fill="currentColor" />
            STOP
          </button>
        )}

        <button
          onClick={onReset}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg font-medium text-gray-300 text-sm transition-colors"
        >
          <RotateCcw size={16} />
          RESET
        </button>
      </div>

      {/* Right: Console */}
      <div className="flex-1 flex items-center gap-2 ml-4 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
        <Terminal size={14} className="text-gray-500 flex-shrink-0" />
        <span className="text-[11px] text-gray-400 truncate font-mono">{lastLog}</span>
        {isRunning && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />}
      </div>
    </div>
  );
};
