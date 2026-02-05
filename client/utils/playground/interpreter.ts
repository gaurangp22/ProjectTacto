// TACTO Program Interpreter
// Full Scratch-like execution with control flow, variables, and auto-calculation

import { BLOCKS, type BlockType } from '../../data/playground/blockTypes';
import { playNote, playDrum, playRest, setTempo, speak, playError, playSuccess, playBlockPlaced } from './audioEngine';

export interface ProgramBlock {
  id: string;
  type: BlockType;
  value?: number | string;
}

export interface ExecutionState {
  logs: string[];
  variable: number;
  tempo: number;
  stopped: boolean;
}

type OnUpdate = (state: ExecutionState, blockId?: string) => void;
type ShouldStop = () => boolean;

// Play a chord
const playChord = async (type: BlockType): Promise<void> => {
  const chords: Record<string, number[]> = {
    'CHORD_C': [261.63, 329.63, 392.00],
    'CHORD_G': [392.00, 493.88, 587.33],
    'CHORD_F': [349.23, 440.00, 523.25],
  };
  const notes = chords[type] || chords['CHORD_C'];

  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  notes.forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  });
  await new Promise(r => setTimeout(r, 500));
};

// Calculate duration based on tempo
const getNoteDuration = (tempo: number): number => (60 / tempo) * 1000;

// Helper: Resolve condition value (true/false)
const evaluateCondition = (val: string | number | undefined, stateVariable: number): boolean => {
  // If explicitly "Var" string, check state variable
  if (val === 'Var') {
    return stateVariable > 0;
  }
  // If number, check if > 0
  const num = Number(val);
  if (!isNaN(num)) {
    return num > 0;
  }
  return false;
};

// Helper: Resolve numeric/string value (for Repeat, Set Val)
const evaluateValue = (val: string | number | undefined, stateVariable: number): number => {
  if (val === 'Var') return stateVariable;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Main execution function
export const executeProgram = async (
  program: ProgramBlock[],
  onUpdate?: OnUpdate,
  shouldStop?: ShouldStop
): Promise<{ success: boolean; message: string; result?: number | string }> => {
  if (program.length === 0) {
    await speak('No blocks to run');
    return { success: false, message: 'Empty program' };
  }

  const state: ExecutionState = {
    logs: [],
    variable: 0,
    tempo: 120,
    stopped: false,
  };

  const log = (msg: string) => {
    state.logs.push(msg);
    onUpdate?.(state);
  };

  // Loop stack for REPEAT/FOREVER
  const loopStack: { startIndex: number; count: number; max: number; isForever: boolean }[] = [];

  // If stack for conditionals
  const ifStack: { condition: boolean; inElse: boolean }[] = [];

  let i = 0;
  const maxIterations = 10000; // Safety limit
  let iterations = 0;

  log('▶️ Program started');
  await playBlockPlaced();

  while (i < program.length && iterations < maxIterations) {
    if (shouldStop?.() || state.stopped) {
      log('⏹️ Stopped');
      return { success: false, message: 'Stopped by user' };
    }

    iterations++;
    const block = program[i];
    const def = BLOCKS[block.type];

    onUpdate?.(state, block.id);

    // Check if we're in a false IF branch (skip blocks)
    const inFalseBranch = ifStack.length > 0 && !ifStack[ifStack.length - 1].condition && !ifStack[ifStack.length - 1].inElse;
    const inTrueElse = ifStack.length > 0 && ifStack[ifStack.length - 1].condition && ifStack[ifStack.length - 1].inElse;

    const shouldSkip = inFalseBranch || inTrueElse;

    // Handle control flow blocks even when skipping
    if (block.type === 'ELSE') {
      if (ifStack.length > 0) {
        ifStack[ifStack.length - 1].inElse = true;
      }
      i++;
      continue;
    }

    if (block.type === 'END_IF') {
      if (ifStack.length > 0) {
        ifStack.pop();
      }
      i++;
      continue;
    }

    if (shouldSkip && !['REPEAT', 'FOREVER', 'LOOP_END', 'IF', 'END_IF', 'ELSE'].includes(block.type)) {
      i++;
      continue;
    }

    // Execute block
    switch (block.type) {
      // === EVENTS ===
      case 'EVENT_START':
      case 'EVENT_KEY_SPACE':
      case 'EVENT_KEY_ENTER':
        log('🏁 Started');
        break;

      // === CONTROL ===
      case 'REPEAT': {
        const count = evaluateValue(block.value, state.variable) || 2;
        loopStack.push({ startIndex: i, count: 0, max: count, isForever: false });
        log(`🔁 Repeat ${count} times`);
        break;
      }

      case 'FOREVER':
        loopStack.push({ startIndex: i, count: 0, max: Infinity, isForever: true });
        log('♾️ Forever loop');
        break;

      case 'IF': {
        // Evaluate condition based on Input Slot
        const condition = evaluateCondition(block.value, state.variable);
        ifStack.push({ condition, inElse: false });

        const desc = block.value === 'Var' ? `Variable (${state.variable})` : block.value;
        log(`❓ Checking If: ${desc} > 0? ${condition ? 'YES' : 'NO'}`);
        await speak(`If ${desc} is greater than zero? ${condition ? 'Yes' : 'No'}.`);
        break;
      }

      case 'IF_ELSE': {
        const condition = evaluateCondition(block.value, state.variable);
        ifStack.push({ condition, inElse: false });

        const desc = block.value === 'Var' ? `Variable (${state.variable})` : block.value;
        log(`❓ If/Else Check: ${desc} > 0? ${condition}`);
        await speak(`If else check. Is ${desc} greater than zero?`);
        break;
      }

      case 'LOOP_END': {
        if (loopStack.length > 0) {
          const loop = loopStack[loopStack.length - 1];
          loop.count++;
          if (loop.isForever || loop.count < loop.max) {
            i = loop.startIndex;
            log(`↩️ Loop iteration ${loop.count + 1}`);
          } else {
            loopStack.pop();
            log('✓ Loop done');
          }
        }
        break;
      }

      case 'WAIT': {
        const secs = evaluateValue(block.value, state.variable) || 1;
        log(`⏱️ Wait ${secs}s`);
        await new Promise(r => setTimeout(r, secs * 1000));
        break;
      }

      // === SOUND ===
      case 'NOTE_C':
      case 'NOTE_D':
      case 'NOTE_E':
      case 'NOTE_F':
      case 'NOTE_G':
      case 'NOTE_A':
      case 'NOTE_B':
        if (def.frequency) {
          log(`🎵 ${def.shortLabel}`);
          await playNote(def.frequency, getNoteDuration(state.tempo) / 1000);
        }
        break;

      case 'CHORD_C':
      case 'CHORD_G':
      case 'CHORD_F':
        log(`🎶 ${def.shortLabel}`);
        await playChord(block.type);
        break;

      case 'DRUM':
        log('🥁 Drum');
        await playDrum();
        break;

      case 'REST':
        log('⏸ Rest');
        await playRest();
        break;

      case 'SAY': {
        // Updated to handle Slot Values
        let text = String(block.value || 'Hello');
        if (text === 'Var') text = String(state.variable);

        log(`💬 "${text}"`);
        await speak(text);
        break;
      }

      case 'SET_TEMPO': {
        const tempo = evaluateValue(block.value, state.variable) || 120;
        state.tempo = tempo;
        setTempo(tempo);
        log(`⏱ Tempo: ${tempo}`);
        break;
      }

      // === VARIABLES ===
      case 'VAR_SET': {
        const val = evaluateValue(block.value, state.variable);
        state.variable = val;
        log(`📦 Set to ${val}`);
        break;
      }

      case 'VAR_CHANGE': {
        const delta = evaluateValue(block.value, state.variable);
        state.variable += delta;
        log(`📈 Now ${state.variable}`);
        break;
      }

      case 'VAR_SHOW':
        log(`📢 Value: ${state.variable}`);
        await speak(String(state.variable));
        break;

      default:
        // Handle Story Blocks and others generically if they have storyText
        if (def.category === 'story' && def.storyText) {
          const text = def.storyText;
          log(`📖 ${text}`);
          await speak(text);
          await new Promise(r => setTimeout(r, 800)); // Natural pause for story pacing
        }
        break;
    }

    i++;
    await new Promise(r => setTimeout(r, 50)); // Small delay between blocks
  }

  if (iterations >= maxIterations) {
    await playError();
    return { success: false, message: 'Too many iterations' };
  }

  await playSuccess();
  log('✅ Done');
  return { success: true, message: 'Program complete' };
};

// === MATH EXPRESSION EVALUATOR (Auto-calculates 8-3 = 5) ===
export const evaluateMathExpression = async (
  blocks: ProgramBlock[],
  onUpdate?: OnUpdate
): Promise<{ success: boolean; message: string; result?: number }> => {
  const state: ExecutionState = { logs: [], variable: 0, tempo: 120, stopped: false };
  const log = (msg: string) => { state.logs.push(msg); onUpdate?.(state); };

  if (blocks.length === 0) {
    await speak('No math blocks');
    return { success: false, message: 'Empty' };
  }

  // Build expression string
  let expr = '';
  const parts: (string | number)[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const def = BLOCKS[blocks[i].type];
    onUpdate?.(state, blocks[i].id);

    if (def.mathValue !== undefined) {
      // Clean value string
      const val = def.mathValue;
      parts.push(val);

      // Visual feedback
      if (typeof val === 'number') {
        expr += val;
        log(`${val}`);
        await speak(String(val));
      } else {
        expr += ` ${val} `;
        log(String(val));

        // Speak special operators
        if (val === '>') await speak('Greater than');
        else if (val === '<') await speak('Less than');
        else await speak(def.label);
      }
    }
    await new Promise(r => setTimeout(r, 400));
  }

  // Evaluate
  try {
    // Build a safe expression (only numbers and recognized operators)
    const safeExpr = parts.filter(p => p !== '=').map(p => {
      if (p === '−') return '-';
      if (p === '×') return '*';
      if (p === '÷') return '/';
      // Comparison Operators
      if (p === '>') return '>';
      if (p === '<') return '<';
      return p;
    }).join(' ');

    // evaluate
    // eslint-disable-next-line no-eval
    const result = Function(`"use strict"; return (${safeExpr})`)();

    // Convert boolean to 1/0 for simplified math logic
    let numResult = result;
    if (typeof result === 'boolean') {
      numResult = result ? 1 : 0;
    }

    if (typeof numResult === 'number' && !isNaN(numResult)) {
      const rounded = Math.round(numResult * 100) / 100;
      log(`= ${rounded}`);
      await playSuccess();
      await speak(`equals ${rounded}`);
      return { success: true, message: `${expr.trim()} = ${rounded}`, result: rounded };
    } else {
      throw new Error('Invalid result');
    }
  } catch {
    await playError();
    await speak('Cannot calculate');
    return { success: false, message: 'Invalid expression' };
  }
};
