import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BLOCKS, CATEGORIES, getBlocksByCategory, SAMPLE_PROGRAMS, type BlockType, type BlockCategory, type SampleProgram, type GameMode } from '../../data/playground/blockTypes';
import { Block } from './Block';
import { ChevronDown, BookOpen, BrainCircuit, Music, Book, Calculator } from 'lucide-react';
import { speak } from '../../utils/playground/audioEngine'; // IMPORTED speak

interface PaletteItemProps {
  type: BlockType;
}

const PaletteItem: React.FC<PaletteItemProps> = ({ type }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, isPalette: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing transition-transform ${isDragging ? 'opacity-40' : 'hover:translate-x-1'}`}
    >
      <Block id={`palette-${type}`} blockDef={BLOCKS[type]} isPaletteItem />
    </div>
  );
};

interface Props {
  onLoadSample: (chapterId: string) => void;
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

const MODE_CATEGORIES: Record<GameMode, BlockCategory[]> = {
  code: ['events', 'control', 'variables'], // Logic: No sound
  music: ['sound', 'control'], // Music: Sound + Control
  story: ['story'],
  math: ['math'],
};

// 'logic' replaces 'code' in the UI
type SidebarTab = 'curriculum' | 'logic' | 'music' | 'story' | 'math';

export const BlockPalette: React.FC<Props> = ({ onLoadSample, currentMode, onModeChange }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('curriculum');

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);

    // VOICE FEEDBACK IMPL
    if (tab === 'curriculum') {
      speak("Curriculum");
    } else if (tab === 'logic') {
      speak("Logic Toolbox");
    } else {
      // Capitalize first letter
      const label = tab.charAt(0).toUpperCase() + tab.slice(1);
      speak(`${label} Toolbox`);
    }

    if (tab !== 'curriculum') {
      const mode = tab === 'logic' ? 'code' : tab as GameMode;
      onModeChange(mode);
    }
  };

  const toggle = (cat: BlockCategory) => {
    // Categories stay open
  };

  // 1. Curriculum Data
  const lessons = SAMPLE_PROGRAMS.filter(s => s.lesson);
  const units = React.useMemo(() => {
    const grouped: Record<string, SampleProgram[]> = {};
    lessons.forEach(l => {
      const key = l.lesson || 'Extras';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(l);
    });
    return grouped;
  }, [lessons]);

  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({
    'Unit 1: Sequences': true,
    'Unit 2: Loops': true,
    'Unit 3: Logic': true,
    'Unit 4: Variables': true,
    'Unit 5: Debugging': true,
    'Unit 6: Capstone': false,
    'Unit 7: Patterns': false,
    'Unit 8: Mastery': false,
  });

  const toggleUnit = (unit: string) => {
    setOpenUnits(prev => ({ ...prev, [unit]: !prev[unit] }));
  };

  // 2. Mode Data (Blocks & Examples)
  // Map 'logic' tab to 'code' mode data
  const targetMode: GameMode = activeTab === 'curriculum'
    ? 'code' // Default fallback
    : activeTab === 'logic'
      ? 'code'
      : activeTab as GameMode;

  const relevantCategories = MODE_CATEGORIES[targetMode] || [];
  const modeExamples = SAMPLE_PROGRAMS.filter(s => s.mode === targetMode && !s.lesson);


  const handleLessonSelect = (id: string) => {
    onLoadSample(id);
  };

  const navItems: { id: SidebarTab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'curriculum', label: 'Learn', icon: <BookOpen size={24} />, color: 'text-indigo-600' },
    { id: 'logic', label: 'Logic', icon: <BrainCircuit size={24} />, color: 'text-slate-600' },
    { id: 'music', label: 'Music', icon: <Music size={24} />, color: 'text-pink-500' },
    { id: 'story', label: 'Story', icon: <Book size={24} />, color: 'text-amber-500' },
    { id: 'math', label: 'Math', icon: <Calculator size={24} />, color: 'text-cyan-500' },
  ];

  return (
    <div className="h-full flex bg-slate-50/50">

      {/* SIDEBAR NAVIGATION RAIL */}
      <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 shadow-sm z-20">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all w-14 h-14 group
              ${activeTab === item.id
                ? 'bg-indigo-50 shadow-inner scale-100 ring-2 ring-indigo-100'
                : 'hover:bg-slate-50 hover:scale-110 active:scale-95'}
            `}
            title={item.label}
          >
            <div className={`transition-colors duration-300 ${activeTab === item.id ? item.color : 'text-slate-300 group-hover:text-slate-500'}`}>
              {item.icon}
            </div>
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50/30">

        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm z-10 sticky top-0 flex justify-between items-center">
          <div>
            <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 uppercase
                  ${activeTab === 'curriculum' ? 'text-indigo-900' :
                activeTab === 'logic' ? 'text-slate-800' :
                  activeTab === 'music' ? 'text-pink-600' :
                    activeTab === 'story' ? 'text-amber-600' : 'text-cyan-600'}
            `}>
              {activeTab === 'curriculum' ? 'Curriculum' : `${activeTab}`}
            </h2>
            <p className="text-[10px] font-bold text-slate-400">
              {activeTab === 'curriculum' ? 'LEARNING PATH' : 'TOOLBOX'}
            </p>
          </div>

          {/* Icon Badge */}
          <div className={`p-2 rounded-xl bg-slate-50 border border-slate-100
                ${activeTab === 'curriculum' ? 'text-indigo-500' :
              activeTab === 'logic' ? 'text-slate-500' :
                activeTab === 'music' ? 'text-pink-500' :
                  activeTab === 'story' ? 'text-amber-500' : 'text-cyan-500'}
           `}>
            {navItems.find(i => i.id === activeTab)?.icon}
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto w-full p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

          {/* VIEW: CURRICULUM */}
          {activeTab === 'curriculum' && (
            <div className="space-y-3 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {Object.entries(units).map(([unitName, unitLessons]) => {
                const isOpen = openUnits[unitName] ?? true;
                return (
                  <div key={unitName} className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleUnit(unitName)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
                        <ChevronDown size={14} strokeWidth={3} />
                      </div>
                      <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider text-left flex-1">
                        {unitName}
                      </h3>
                    </button>

                    {isOpen && (
                      <div className="p-2 grid gap-1.5 bg-white">
                        {unitLessons.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => handleLessonSelect(s.id)}
                            className="group flex items-center gap-3 p-2 text-left rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all border border-transparent hover:border-indigo-100"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full 
                                        ${s.mode === 'code' ? 'bg-slate-300' : s.mode === 'music' ? 'bg-pink-300' : s.mode === 'story' ? 'bg-amber-300' : 'bg-cyan-300'}
                                    `} />
                            <span className="font-bold text-xs text-slate-600 group-hover:text-indigo-700">
                              {s.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}


          {/* VIEW: TOOLBOX MODES */}
          {activeTab !== 'curriculum' && (
            <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-200">

              {/* BLOCKS - LIST STYLE */}
              <div className="space-y-6">
                {relevantCategories.map((cat) => {
                  const info = CATEGORIES[cat];
                  const blocks = getBlocksByCategory(cat);
                  // Always open in Toolbox mode

                  return (
                    <div key={cat} className="space-y-2">
                      {/* Category Label */}
                      <div className="flex items-center gap-2 px-1 opacity-80">
                        <span className="text-sm" style={{ color: info.color }}>{info.icon}</span>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {info.label}
                        </h4>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>

                      {/* Blocks Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {blocks.map((b) => (
                          <PaletteItem key={b.type} type={b.type} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Starts - Demoted to bottom, smaller */}
              {modeExamples.length > 0 && (
                <div className="pt-6 mt-6 border-t border-dashed border-slate-200 opacity-60 hover:opacity-100 transition-opacity">
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                    Quick Ideas
                  </h3>
                  <div className="grid gap-2">
                    {modeExamples.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onLoadSample(s.id)}
                        className="flex items-center gap-3 p-2 text-left rounded-lg border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm"
                      >
                        <span className="text-base">
                          {activeTab === 'music' ? '🎵' : activeTab === 'story' ? '📖' : activeTab === 'math' ? '🔢' : '💡'}
                        </span>
                        <span className="font-bold text-[10px] text-slate-500">
                          {s.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
