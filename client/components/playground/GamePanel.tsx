import React from 'react';
import { GameMode, SampleProgram } from '../../data/playground/blockTypes';
import { Play, Square, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
    gameMode: GameMode;
    isRunning: boolean;
    statusMessage: string;
    onRun: () => void;
    onStop: () => void;
    onReset: () => void;
    chapters: SampleProgram[];
    onLoadChapter: (chapterId: string) => void;
}

export const GamePanel: React.FC<Props> = ({
    gameMode,
    isRunning,
    statusMessage,
    onRun,
    onStop,
    onReset,
    chapters,
    onLoadChapter,
}) => {
    const isError = statusMessage.toLowerCase().includes('error');
    const isSuccess = statusMessage.toLowerCase().includes('done') || statusMessage.toLowerCase().includes('loaded');

    // Filter chapters by current mode
    const modeChapters = chapters.filter(c => c.mode === gameMode);

    return (
        <div className="w-full h-full flex items-center gap-3 md:gap-6">
            {/* Branding (Left) - Responsive */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
                <img src="/tacto-wbg.png" alt="Tacto" className="h-6 md:h-8 w-auto object-contain" />
                <h3 className="text-sm md:text-xl font-bold text-slate-700 tracking-tight hidden sm:block">
                    Tacto Simulator
                </h3>
            </div>

            {/* Main Controls (Center) - Responsive */}
            <div className="flex-1 flex justify-center">
                <div className="bg-slate-100 p-1 rounded-full flex gap-1 shadow-inner border border-slate-200">
                    {!isRunning ? (
                        <button
                            onClick={onRun}
                            className="
                        flex items-center gap-1 md:gap-2 px-4 md:px-8 py-2 md:py-3 bg-emerald-500 hover:bg-emerald-600 
                        text-white font-bold text-sm md:text-base rounded-full shadow-lg shadow-emerald-200 
                        transition-all hover:scale-105 active:scale-95 group
                    "
                        >
                            <Play size={16} className="md:w-5 md:h-5 fill-current group-hover:ml-1 transition-all" />
                            <span className="hidden sm:inline">RUN</span>
                        </button>
                    ) : (
                        <button
                            onClick={onStop}
                            className="
                        flex items-center gap-1 md:gap-2 px-4 md:px-8 py-2 md:py-3 bg-rose-500 hover:bg-rose-600 
                        text-white font-bold text-sm md:text-base rounded-full shadow-lg shadow-rose-200 
                        transition-all hover:scale-105 active:scale-95
                    "
                        >
                            <Square size={16} className="md:w-5 md:h-5 fill-current" />
                            <span className="hidden sm:inline">STOP</span>
                        </button>
                    )}

                    <button
                        onClick={onReset}
                        className="
                    p-2 md:p-3 text-slate-500 hover:text-indigo-600 hover:bg-white 
                    rounded-full transition-all border border-transparent 
                    hover:shadow-sm hover:border-slate-200 aspect-square flex items-center justify-center
                    "
                        title="Reset Program"
                    >
                        <RotateCcw size={16} className="md:w-5 md:h-5" />
                    </button>
                </div>
            </div>

            {/* Status Bar (Right) - Hidden on mobile */}
            <div className={`
        hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border min-w-[200px]
        ${isError ? 'bg-red-50 border-red-100 text-red-600' : ''}
        ${isSuccess ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : ''}
        ${!isError && !isSuccess ? 'bg-slate-50 border-slate-100 text-slate-500' : ''}
      `}>
                {isError ? <AlertCircle size={16} /> : isSuccess ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                <span className="text-xs font-bold truncate">
                    {statusMessage}
                </span>
            </div>
        </div>
    );
};
