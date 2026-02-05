import { useState, useCallback, useRef } from 'react';
import {
    DndContext,
    DragOverlay,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
    useSensor,
    useSensors,
    PointerSensor,
    closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { BlockPalette } from '@/components/playground/BlockPalette';
import { Workspace } from '@/components/playground/Workspace';
import { TactoGrid } from '@/components/playground/TactoGrid';
import { Block } from '@/components/playground/Block';
import { GamePanel } from '@/components/playground/GamePanel';

import { BLOCKS, SAMPLE_PROGRAMS, type BlockType, type SampleProgram, type GameMode } from '@/data/playground/blockTypes';
import { executeProgram, evaluateMathExpression, type ProgramBlock, type ExecutionState } from '@/utils/playground/interpreter';
import { initAudioContext, speak, cancelSpeech } from '@/utils/playground/audioEngine';
import { soundManager } from '@/utils/playground/SoundManager';

function Playground() {
    const [gameMode, setGameMode] = useState<GameMode>('code');
    const [program, setProgram] = useState<ProgramBlock[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<BlockType | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [activeBlockId, setActiveBlockId] = useState<string | undefined>();
    const [statusMessage, setStatusMessage] = useState('Ready');
    const shouldStopRef = useRef(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const id = event.active.id as string;
        setActiveId(id);

        if (id.startsWith('palette-')) {
            setActiveType(event.active.data.current?.type as BlockType);
        } else {
            const block = program.find((b) => b.id === id);
            if (block) setActiveType(block.type);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId.startsWith('palette-')) return;
        if (overId === 'workspace-droppable') return;
        if (activeId === overId) return;

        // Skip reordering if we are dropping ONTO another block (for nesting simulation)
        const targetBlock = program.find(p => p.id === overId);
        const targetDef = targetBlock ? BLOCKS[targetBlock.type] : null;
        if (targetDef?.inputType === 'value-slot') {
            // We are hovering a "slot" block, don't shuffle it away
            return;
        }

        const activeIndex = program.findIndex((p) => p.id === activeId);
        const overIndex = program.findIndex((p) => p.id === overId);

        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
            setProgram((items) => arrayMove(items, activeIndex, overIndex));
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            setActiveType(null);
            return;
        }

        const activeStringId = active.id as string;
        const isPaletteItem = activeStringId.startsWith('palette-');

        if (isPaletteItem) {
            const type = active.data.current?.type as BlockType;
            if (!type) {
                setActiveId(null);
                setActiveType(null);
                return;
            }

            const overId = over.id as string;

            // === GENERIC NESTED DROPPING LOGIC ===
            // Identify target block
            const targetBlock = program.find(p => p.id === overId);
            const targetDef = targetBlock ? BLOCKS[targetBlock.type] : null;

            // Check if target accepts a slot value
            const isTargetSlot = targetDef?.inputType === 'value-slot';
            // Check if source is a Value (Math/Var)
            const isSourceValue = BLOCKS[type].category === 'math' || BLOCKS[type].category === 'variables';

            if (isTargetSlot && isSourceValue) {
                // Determine value to plug in
                let valueToSet: string | number = 0;

                if (type.startsWith('NUM_')) {
                    valueToSet = BLOCKS[type].mathValue ?? 0;
                } else if (type === 'VAR_SHOW' || type === 'VAR_SET' || type === 'VAR_BLOCK') {
                    valueToSet = "Var";
                } else {
                    valueToSet = "?";
                }

                // Update the target block's value
                setProgram(prev => prev.map(p =>
                    p.id === overId ? { ...p, value: String(valueToSet) } : p // Force string for consistency in slots
                ));

                soundManager.playClick(); // Satisfying click
                speak(`${targetDef?.label} set to ${valueToSet}`);

                setActiveId(null);
                setActiveType(null);
                return;
            }


            // === STANDARD DROP LOGIC ===
            const isOverWorkspace = overId === 'workspace-droppable' || program.some((p) => p.id === overId);

            if (isOverWorkspace) {
                // HARDWARE LIMIT: Only 8 slots
                if (program.length >= 8) {
                    soundManager.playErrorThud(); // Error feedback
                    setActiveId(null);
                    setActiveType(null);
                    return;
                }

                const newBlock: ProgramBlock = {
                    id: Math.random().toString(36).substring(2, 9),
                    type,
                    value: BLOCKS[type].defaultValue, // Ensure default value is respected
                };

                setProgram((prev) => {
                    const overIndex = prev.findIndex((p) => p.id === overId);
                    if (overIndex >= 0) {
                        const newProgram = [...prev];
                        newProgram.splice(overIndex, 0, newBlock);
                        return newProgram;
                    }
                    return [...prev, newBlock];
                });

                // TACTO EARCONS Implementation
                soundManager.playSnap(); // Mechanical click
                if (type === 'REPEAT' || type === 'FOREVER') {
                    setTimeout(() => soundManager.playLoopStart(), 100);
                } else if (type === 'IF' || type === 'IF_ELSE') {
                    setTimeout(() => soundManager.playConditional(), 100);
                }
                speak(BLOCKS[type].label);
            }
        }

        setActiveId(null);
        setActiveType(null);
    };

    const handleValueChange = (id: string, val: number | string) => {
        setProgram((prev) => prev.map((p) => (p.id === id ? { ...p, value: val } : p)));
    };

    const handleRemoveBlock = (id: string) => {
        setProgram((prev) => prev.filter((p) => p.id !== id));
        soundManager.playTrash(); // Crumpling sound
    };

    const handleRun = useCallback(async () => {
        if (isRunning || program.length === 0) return;

        initAudioContext();
        setIsRunning(true);
        shouldStopRef.current = false;
        setStatusMessage('Running...');

        const onUpdate = (state: ExecutionState, blockId?: string) => {
            setActiveBlockId(blockId);
            if (state.logs.length > 18) { // Keep log small
                // optional cleanup
            }
            if (state.logs.length > 0) {
                setStatusMessage(state.logs[state.logs.length - 1]);
            }
        };

        try {
            let result;

            switch (gameMode) {
                case 'code':
                case 'music':
                case 'story':
                    result = await executeProgram(program, onUpdate, () => shouldStopRef.current);
                    break;
                case 'math':
                    result = await evaluateMathExpression(program, onUpdate);
                    break;
            }

            setStatusMessage(result?.message || 'Done');
        } catch (e) {
            setStatusMessage('Error');
            soundManager.playErrorThud(); // Error Earcon
        }

        setIsRunning(false);
        setActiveBlockId(undefined);
    }, [isRunning, program, gameMode]);

    const handleStop = () => {
        shouldStopRef.current = true;
        cancelSpeech();
        setIsRunning(false);
        setActiveBlockId(undefined);
        setStatusMessage('Stopped');
    };

    const handleReset = () => {
        setProgram([]);
        setActiveBlockId(undefined);
        cancelSpeech();
        setStatusMessage('Cleared');
    };

    const handleModeChange = (mode: GameMode) => {
        if (gameMode === mode) return;
        setGameMode(mode);
        // Do NOT clear program on simple tab switch
        setProgram([]);
        setStatusMessage(`Mode: ${mode}`);
    };

    // Load a chapter (tutorial)
    const handleLoadChapter = (chapterId: string) => {
        const chapter = SAMPLE_PROGRAMS.find(p => p.id === chapterId);
        if (chapter) {
            setProgram(chapter.blocks.map(b => ({
                id: Math.random().toString(36).substring(2, 9), // Safer ID gen
                type: b.type,
                value: b.value ?? BLOCKS[b.type]?.defaultValue ?? 0 // Default to 0 if undefined
            })));
            setGameMode(chapter.mode);
            setStatusMessage(`Loaded: ${chapter.name}`);
            soundManager.playSnap();
        }
    };

    // Mobile panel state
    const [mobilePanel, setMobilePanel] = useState<'palette' | 'workspace' | 'grid'>('workspace');

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans">
                <style>{`
                ::selection { background-color: #cbd5e1; color: #1e293b; }
            `}</style>

                {/* Top Control Bar - Responsive */}
                <header className="h-16 md:h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between z-20 shrink-0">
                    {/* Game Panel */}
                    <div className="flex-1 h-full py-2 md:py-3">
                        <GamePanel
                            gameMode={gameMode}
                            isRunning={isRunning}
                            statusMessage={statusMessage}
                            onRun={handleRun}
                            onStop={handleStop}
                            onReset={handleReset}
                            chapters={SAMPLE_PROGRAMS}
                            onLoadChapter={handleLoadChapter}
                        />
                    </div>

                    {/* Settings - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer">
                            ⚙️
                        </div>
                    </div>
                </header>

                {/* Mobile Tab Bar */}
                <div className="md:hidden flex bg-white border-b border-slate-200 shrink-0">
                    <button
                        onClick={() => setMobilePanel('palette')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobilePanel === 'palette' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-500'}`}
                    >
                        🧩 Blocks
                    </button>
                    <button
                        onClick={() => setMobilePanel('workspace')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobilePanel === 'workspace' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-500'}`}
                    >
                        📝 Code
                    </button>
                    <button
                        onClick={() => setMobilePanel('grid')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobilePanel === 'grid' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-slate-500'}`}
                    >
                        📟 Grid
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden relative">

                    {/* Desktop Layout */}
                    <div className="hidden md:flex flex-1 overflow-hidden">
                        {/* Palette Sidebar - Desktop */}
                        <aside className="w-[380px] bg-white border-r border-slate-200 overflow-hidden relative z-10 flex flex-col transition-[width] duration-300 shadow-sm">
                            <BlockPalette
                                onLoadSample={handleLoadChapter}
                                currentMode={gameMode}
                                onModeChange={handleModeChange}
                            />
                        </aside>

                        {/* Main Workspace - Desktop */}
                        <section className="flex-1 bg-slate-50/50 overflow-hidden relative flex flex-col">
                            {/* Dot Pattern Background */}
                            <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
                                style={{
                                    backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
                                    backgroundSize: '24px 24px'
                                }}
                            />

                            <Workspace
                                program={program}
                                onValueChange={handleValueChange}
                                onRemoveBlock={handleRemoveBlock}
                                activeBlockId={activeBlockId}
                            />
                        </section>

                        {/* Hardware Grid Status - Desktop */}
                        <div className="w-[320px] bg-white border-l border-slate-200 overflow-hidden z-10 flex flex-col">
                            <TactoGrid
                                program={program}
                                activeBlockId={activeBlockId}
                                isScanning={isRunning}
                            />
                        </div>
                    </div>

                    {/* Mobile Layout - Tab-based panels */}
                    <div className="md:hidden flex-1 overflow-hidden">
                        {/* Mobile Palette Panel */}
                        {mobilePanel === 'palette' && (
                            <div className="h-full bg-white overflow-hidden">
                                <BlockPalette
                                    onLoadSample={handleLoadChapter}
                                    currentMode={gameMode}
                                    onModeChange={handleModeChange}
                                />
                            </div>
                        )}

                        {/* Mobile Workspace Panel */}
                        {mobilePanel === 'workspace' && (
                            <section className="h-full bg-slate-50/50 overflow-hidden relative flex flex-col">
                                {/* Dot Pattern Background */}
                                <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
                                    style={{
                                        backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
                                        backgroundSize: '24px 24px'
                                    }}
                                />

                                <Workspace
                                    program={program}
                                    onValueChange={handleValueChange}
                                    onRemoveBlock={handleRemoveBlock}
                                    activeBlockId={activeBlockId}
                                />

                                {/* Mobile Quick Add Bar */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-3 flex gap-2 overflow-x-auto z-20">
                                    <span className="text-xs text-slate-400 shrink-0 self-center px-2">Quick:</span>
                                    {['DRUM', 'SAY', 'REPEAT', 'IF'].map(type => {
                                        const blockDef = BLOCKS[type as BlockType];
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    if (program.length < 8) {
                                                        setProgram(prev => [...prev, {
                                                            id: Math.random().toString(36).substring(2, 9),
                                                            type: type as BlockType,
                                                            value: blockDef.defaultValue
                                                        }]);
                                                        soundManager.playSnap();
                                                    }
                                                }}
                                                disabled={program.length >= 8}
                                                className="shrink-0 px-3 py-2 rounded-xl text-sm font-semibold text-white shadow-md active:scale-95 transition-transform disabled:opacity-50"
                                                style={{ backgroundColor: blockDef.color }}
                                            >
                                                {blockDef.icon} {blockDef.shortLabel}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Mobile Grid Panel */}
                        {mobilePanel === 'grid' && (
                            <div className="h-full bg-white overflow-hidden">
                                <TactoGrid
                                    program={program}
                                    activeBlockId={activeBlockId}
                                    isScanning={isRunning}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DragOverlay dropAnimation={null}>
                {activeId && activeType ? (
                    <div className="opacity-90 scale-105 rotate-3 shadow-2xl pointer-events-none">
                        <Block
                            id={activeId}
                            blockDef={BLOCKS[activeType as BlockType]}
                            value={program.find((p) => p.id === activeId)?.value}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default Playground;

