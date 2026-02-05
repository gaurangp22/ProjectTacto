import React from 'react';
import { clsx } from 'clsx';
import type { BlockDefinition } from '../../data/playground/blockTypes';

interface Props {
  id: string;
  blockDef: BlockDefinition;
  value?: number | string;
  onValueChange?: (id: string, val: number | string) => void;
  isOverlay?: boolean;
  isPaletteItem?: boolean;
  isActive?: boolean;
  hideLabel?: boolean;
}

export const Block: React.FC<Props> = ({
  id,
  blockDef,
  value,
  onValueChange,
  isOverlay = false,
  isPaletteItem = false,
  isActive = false,
  hideLabel = false,
}) => {

  return (
    <div
      className={clsx(
        'relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border select-none transition-all duration-200',
        isOverlay && 'scale-110 shadow-2xl z-50 ring-2 ring-white',
        isActive && 'ring-2 ring-indigo-400 ring-offset-2',
        !isOverlay && 'hover:brightness-105 hover:shadow-md hover:scale-[1.02]',
        isPaletteItem && 'hover:translate-x-1',
      )}
      style={{
        backgroundColor: blockDef.color,
        borderColor: 'rgba(255,255,255,0.2)',
        borderBottomColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: '4px',
        boxShadow: isOverlay
          ? `0 20px 40px -10px ${blockDef.color}80`
          : `0 4px 6px -1px ${blockDef.color}40`,
      }}
    >
      {/* Gloss Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

      {/* Icon */}
      <span
        className="text-xl flex-shrink-0 drop-shadow-sm filter text-white"
      >
        {blockDef.icon}
      </span>

      {/* Label or Input */}
      {!hideLabel && (
        blockDef.hasInput && !isPaletteItem ? (
          <div className="flex items-center gap-2 relative z-10">
            <span
              className="text-xs font-extra-bold shadow-sm font-sans tracking-wide text-white"
            >
              {blockDef.shortLabel}
            </span>

            {/* INPUT HANDLING */}
            {blockDef.inputType === 'select' && blockDef.inputOptions ? (
              <div className="relative group">
                <select
                  value={value ?? blockDef.defaultValue}
                  onChange={(e) => onValueChange?.(id, Number(e.target.value))}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={clsx(
                    "h-7 px-2 pr-6 text-[11px] font-bold rounded-lg border-2 focus:outline-none shadow-inner cursor-pointer appearance-none min-w-[60px]",
                    "text-slate-700 bg-white border-transparent focus:border-indigo-300"
                  )}
                >
                  {blockDef.inputOptions.map((opt) => (
                    <option key={String(opt.value)} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-400`}>▼</div>
              </div>
            ) : blockDef.inputType === 'value-slot' ? (
              /* HOLLOW VALUE SLOT (for Nesting) - Visualizing as "Small Block" */
              <div className="relative flex items-center justify-center min-w-[40px] h-7 bg-white/20 rounded-lg shadow-inner border border-white/20 group-hover:bg-white/30 transition-colors mx-1 ring-1 ring-black/5">
                <input
                  type="text"
                  value={value ?? blockDef.defaultValue ?? ''}
                  onChange={(e) => onValueChange?.(id, e.target.value)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full h-full bg-transparent text-center text-white font-mono font-bold text-xs focus:outline-none placeholder-white/50 px-1 drop-shadow-sm"
                  placeholder="?"
                />
                {/* Dashed Border to hint interactive zone */}
                <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <input
                type="number"
                value={value ?? blockDef.defaultValue ?? 2}
                onChange={(e) => onValueChange?.(id, Number(e.target.value))}
                onPointerDown={(e) => e.stopPropagation()}
                className={clsx(
                  "w-10 h-7 text-center text-sm font-bold rounded-lg border-2 focus:outline-none shadow-inner",
                  "text-slate-700 bg-white border-transparent focus:border-indigo-300"
                )}
                min={1}
                max={99}
              />
            )}

            {/* SUFFIX LABEL (e.g. "> 0") for Logic Clarity */}
            {blockDef.labelSuffix && (
              <span className="text-xs font-bold text-white/90 ml-1 font-mono tracking-tight shadow-sm">
                {blockDef.labelSuffix}
              </span>
            )}

          </div>
        ) : (
          <div className="flex flex-col relative z-10">
            <span
              className="text-xs font-bold uppercase tracking-wider drop-shadow-sm font-sans"
              style={{ color: 'white' }}
            >
              {blockDef.shortLabel}
            </span>
          </div>
        )
      )}

      {/* Container indicator */}
      {blockDef.isContainer && (
        <span className="text-[10px] ml-auto font-mono relative z-10 text-white/50">{'{'}</span>
      )}
      {blockDef.isContainerEnd && (
        <span className="text-[10px] ml-auto font-mono relative z-10 text-white/50">{'}'}</span>
      )}
    </div>
  );
};
