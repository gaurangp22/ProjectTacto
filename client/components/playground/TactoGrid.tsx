import React from 'react';
import { Scan, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BLOCKS, type BlockType } from '../../data/playground/blockTypes';
import { ProgramBlock } from '../../utils/playground/interpreter';
import { Block } from './Block';

interface Props {
    program: ProgramBlock[];
    activeBlockId?: string;
    isScanning: boolean;
}

export const TactoGrid: React.FC<Props> = ({ program, activeBlockId, isScanning }) => {
    // 4 rows x 2 columns grid (8 slots) - STRICT HARDWARE LIMIT
    const MAX_SLOTS = 8;
    const slots = Array.from({ length: MAX_SLOTS });

    const isOverLimit = program.length > MAX_SLOTS;

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className={`p-4 border-b ${isOverLimit ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'} flex items-center justify-between`}>
                <div>
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${isOverLimit ? 'text-red-700' : 'text-slate-700'}`}>
                        Reader View
                    </h3>
                    <p className={`text-[10px] ${isOverLimit ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                        {isOverLimit ? '❌ Too many blocks for Reader!' : 'Replicate this on your device'}
                    </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isScanning ? 'bg-green-100 text-green-600 animate-pulse' : (isOverLimit ? 'bg-red-100 text-red-600' : 'bg-white border border-slate-200 text-slate-400')}`}>
                    {isOverLimit ? <AlertCircle size={16} /> : (isScanning ? <Scan size={16} /> : <CheckCircle2 size={16} />)}
                </div>
            </div>

            {/* Grid Layout (2 columns to mimic physical layout often used, or 1x8 linear) 
                Physical readers are often linear or 2x4. Let's do 2x4 for compactness but numbered 1-8 sequentially 
            */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3 auto-rows-min">
                    {slots.map((_, index) => {
                        const block = program[index];
                        const isActive = block?.id === activeBlockId;
                        const blockDef = block ? BLOCKS[block.type] : null;

                        return (
                            <div
                                key={index}
                                className={`
                                    relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all
                                    ${block
                                        ? (isActive ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200' : 'border-indigo-100 bg-white shadow-sm')
                                        : 'border-dashed border-slate-200 bg-slate-50/50'
                                    }
                                `}
                            >
                                {/* Slot Number Hint */}
                                <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-300">
                                    {(index + 1).toString().padStart(2, '0')}
                                </div>

                                {block && blockDef ? (
                                    <>
                                        {/* Physical Token Visual */}
                                        <div
                                            className="w-12 h-12 rounded-full mb-1 flex items-center justify-center text-2xl shadow-inner border border-black/5"
                                            style={{ backgroundColor: blockDef.color, color: 'white' }}
                                        >
                                            {blockDef.icon}
                                        </div>

                                        {/* Token Name/ID */}
                                        <div className="text-[10px] font-bold text-slate-700 text-center leading-tight line-clamp-1">
                                            {blockDef.shortLabel}
                                        </div>

                                        {/* Value Display (if any) */}
                                        {(block.value !== undefined && block.value !== blockDef.defaultValue) && (
                                            <div className="mt-1 px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-mono text-slate-500">
                                                {block.value}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center opacity-40 group-hover:opacity-60 transition-opacity">
                                        <Scan size={24} className="mx-auto mb-1 text-slate-400" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Empty</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
