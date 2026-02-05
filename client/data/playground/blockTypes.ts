// TACTO Block Type Definitions
// Full Scratch-like control flow + Audio games

export type BlockCategory = 'events' | 'control' | 'sound' | 'story' | 'math' | 'variables';

export type BlockType =
  // ===== EVENTS (Green Flag / Start) =====
  | 'EVENT_START' | 'EVENT_KEY_SPACE' | 'EVENT_KEY_ENTER'
  // ===== CONTROL =====
  | 'REPEAT' | 'FOREVER' | 'IF' | 'IF_ELSE' | 'WAIT' | 'LOOP_END' | 'ELSE' | 'END_IF'
  // ===== SOUND =====
  | 'NOTE_C' | 'NOTE_D' | 'NOTE_E' | 'NOTE_F' | 'NOTE_G' | 'NOTE_A' | 'NOTE_B'
  | 'CHORD_C' | 'CHORD_G' | 'CHORD_F' | 'DRUM' | 'REST'
  | 'SAY' | 'SET_TEMPO'
  // ===== STORY =====
  | 'CHAR_DOG' | 'CHAR_CAT' | 'CHAR_ROBOT' | 'CHAR_CHILD'
  | 'ACTION_WALKS' | 'ACTION_RUNS' | 'ACTION_JUMPS' | 'ACTION_SLEEPS' | 'ACTION_EATS'
  | 'PLACE_PARK' | 'PLACE_HOUSE' | 'PLACE_SPACE' | 'PLACE_OCEAN'
  // ===== MATH =====
  | 'NUM_0' | 'NUM_1' | 'NUM_2' | 'NUM_3' | 'NUM_4'
  | 'NUM_5' | 'NUM_6' | 'NUM_7' | 'NUM_8' | 'NUM_9'
  | 'OP_PLUS' | 'OP_MINUS' | 'OP_MULTIPLY' | 'OP_DIVIDE' | 'OP_EQUALS'
  | 'OP_GREATER' | 'OP_LESS' // NEW COMPARISONS
  // ===== VARIABLES =====
  | 'VAR_SET' | 'VAR_CHANGE' | 'VAR_SHOW' | 'VAR_BLOCK';

export interface BlockDefinition {
  type: BlockType;
  label: string;
  shortLabel: string;
  category: BlockCategory;
  color: string;
  icon: string;
  hasInput?: boolean;
  inputType?: 'number' | 'select' | 'text' | 'value-slot';
  inputOptions?: { value: string | number; label: string }[];
  defaultValue?: number | string;
  isContainer?: boolean;
  isContainerEnd?: boolean;
  labelSuffix?: string; // Text shown AFTER input (e.g. "> 0")
  nfcUid?: string;
  brailleLabel?: string;
  frequency?: number;
  storyText?: string;
  mathValue?: number | string;
}

const NOTE_FREQ: Record<string, number> = {
  C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.00, A: 440.00, B: 493.88,
};

export const BLOCKS: Record<BlockType, BlockDefinition> = {
  // ===== EVENTS (Scratch: Green Flag) =====
  EVENT_START: { type: 'EVENT_START', label: 'When Start', shortLabel: '🏁 Start', category: 'events', color: '#facc15', icon: '🏁', nfcUid: 'NFC:00:ST', brailleLabel: '⠎⠞' },
  EVENT_KEY_SPACE: { type: 'EVENT_KEY_SPACE', label: 'When Space Pressed', shortLabel: 'Space', category: 'events', color: '#facc15', icon: '⌨️', nfcUid: 'NFC:00:SP', brailleLabel: '⠎⠏' },
  EVENT_KEY_ENTER: { type: 'EVENT_KEY_ENTER', label: 'When Enter Pressed', shortLabel: 'Enter', category: 'events', color: '#facc15', icon: '↵', nfcUid: 'NFC:00:EN', brailleLabel: '⠑⠝' },

  // ===== CONTROL (Scratch-style) =====
  REPEAT: { type: 'REPEAT', label: 'Repeat', shortLabel: 'Repeat', category: 'control', color: '#f59e0b', icon: '🔁', hasInput: true, inputType: 'value-slot', defaultValue: 2, isContainer: true, nfcUid: 'NFC:01:RP', brailleLabel: '⠗⠏' },
  FOREVER: { type: 'FOREVER', label: 'Forever', shortLabel: 'Forever', category: 'control', color: '#f59e0b', icon: '♾️', isContainer: true, nfcUid: 'NFC:01:FV', brailleLabel: '⠋⠧' },

  IF: { type: 'IF', label: 'if', shortLabel: 'if', category: 'control', color: '#f59e0b', icon: '❓', isContainer: true, hasInput: true, inputType: 'value-slot', defaultValue: 0, labelSuffix: '> 0', nfcUid: 'NFC:01:IF', brailleLabel: '⠊⠋' },
  ELSE: { type: 'ELSE', label: 'else', shortLabel: 'else', category: 'control', color: '#d97706', icon: '↔️', nfcUid: 'NFC:01:EL', brailleLabel: '⠑⠇' },
  END_IF: { type: 'END_IF', label: '}', shortLabel: '}', category: 'control', color: '#92400e', icon: '⬛', isContainerEnd: true, nfcUid: 'NFC:01:EI', brailleLabel: '⠑⠊' },
  IF_ELSE: { type: 'IF_ELSE', label: 'if / else', shortLabel: 'if/else', category: 'control', color: '#f59e0b', icon: '🔀', isContainer: true, hasInput: true, inputType: 'value-slot', defaultValue: 0, labelSuffix: '> 0', nfcUid: 'NFC:01:IE', brailleLabel: '⠊⠑' },

  WAIT: { type: 'WAIT', label: 'Wait', shortLabel: 'Wait', category: 'control', color: '#f59e0b', icon: '⏱️', hasInput: true, inputType: 'select', inputOptions: [{ value: 0.5, label: '0.5s' }, { value: 1, label: '1s' }, { value: 2, label: '2s' }], defaultValue: 1, nfcUid: 'NFC:01:WT', brailleLabel: '⠺⠞' },
  LOOP_END: { type: 'LOOP_END', label: 'End Loop', shortLabel: 'End', category: 'control', color: '#78716c', icon: '⬛', isContainerEnd: true, nfcUid: 'NFC:01:EN', brailleLabel: '⠑⠝' },

  // ===== SOUND =====
  NOTE_C: { type: 'NOTE_C', label: 'Note C', shortLabel: 'C', category: 'sound', color: '#ef4444', icon: '🎵', frequency: NOTE_FREQ.C, nfcUid: 'NFC:02:C', brailleLabel: '⠉' },
  NOTE_D: { type: 'NOTE_D', label: 'Note D', shortLabel: 'D', category: 'sound', color: '#f97316', icon: '🎵', frequency: NOTE_FREQ.D, nfcUid: 'NFC:02:D', brailleLabel: '⠙' },
  NOTE_E: { type: 'NOTE_E', label: 'Note E', shortLabel: 'E', category: 'sound', color: '#eab308', icon: '🎵', frequency: NOTE_FREQ.E, nfcUid: 'NFC:02:E', brailleLabel: '⠑' },
  NOTE_F: { type: 'NOTE_F', label: 'Note F', shortLabel: 'F', category: 'sound', color: '#22c55e', icon: '🎵', frequency: NOTE_FREQ.F, nfcUid: 'NFC:02:F', brailleLabel: '⠋' },
  NOTE_G: { type: 'NOTE_G', label: 'Note G', shortLabel: 'G', category: 'sound', color: '#06b6d4', icon: '🎵', frequency: NOTE_FREQ.G, nfcUid: 'NFC:02:G', brailleLabel: '⠛' },
  NOTE_A: { type: 'NOTE_A', label: 'Note A', shortLabel: 'A', category: 'sound', color: '#3b82f6', icon: '🎵', frequency: NOTE_FREQ.A, nfcUid: 'NFC:02:A', brailleLabel: '⠁' },
  NOTE_B: { type: 'NOTE_B', label: 'Note B', shortLabel: 'B', category: 'sound', color: '#8b5cf6', icon: '🎵', frequency: NOTE_FREQ.B, nfcUid: 'NFC:02:B', brailleLabel: '⠃' },
  CHORD_C: { type: 'CHORD_C', label: 'C Chord', shortLabel: 'C♪', category: 'sound', color: '#dc2626', icon: '🎶', nfcUid: 'NFC:03:C', brailleLabel: '⠉⠸' },
  CHORD_G: { type: 'CHORD_G', label: 'G Chord', shortLabel: 'G♪', category: 'sound', color: '#0891b2', icon: '🎶', nfcUid: 'NFC:03:G', brailleLabel: '⠛⠸' },
  CHORD_F: { type: 'CHORD_F', label: 'F Chord', shortLabel: 'F♪', category: 'sound', color: '#16a34a', icon: '🎶', nfcUid: 'NFC:03:F', brailleLabel: '⠋⠸' },
  DRUM: { type: 'DRUM', label: 'Drum', shortLabel: 'Drum', category: 'sound', color: '#ec4899', icon: '🥁', nfcUid: 'NFC:03:DR', brailleLabel: '⠙⠗' },
  REST: { type: 'REST', label: 'Rest', shortLabel: 'Rest', category: 'sound', color: '#64748b', icon: '⏸', nfcUid: 'NFC:03:RT', brailleLabel: '⠗⠞' },

  SAY: { type: 'SAY', label: 'Say', shortLabel: 'Say', category: 'sound', color: '#a855f7', icon: '💬', hasInput: true, inputType: 'value-slot', defaultValue: 'Hi', nfcUid: 'NFC:03:SY', brailleLabel: '⠎⠽' },
  SET_TEMPO: { type: 'SET_TEMPO', label: 'Tempo', shortLabel: 'Tempo', category: 'sound', color: '#14b8a6', icon: '⏱', hasInput: true, inputType: 'select', inputOptions: [{ value: 60, label: 'Slow' }, { value: 120, label: 'Medium' }, { value: 180, label: 'Fast' }], defaultValue: 120, nfcUid: 'NFC:03:TM', brailleLabel: '⠞⠍' },

  // ===== STORY =====
  CHAR_DOG: { type: 'CHAR_DOG', label: 'Dog', shortLabel: 'Dog', category: 'story', color: '#a16207', icon: '🐕', storyText: 'The dog', nfcUid: 'NFC:04:DG', brailleLabel: '⠙⠕⠛' },
  CHAR_CAT: { type: 'CHAR_CAT', label: 'Cat', shortLabel: 'Cat', category: 'story', color: '#9333ea', icon: '🐈', storyText: 'The cat', nfcUid: 'NFC:04:CT', brailleLabel: '⠉⠁⠞' },
  CHAR_ROBOT: { type: 'CHAR_ROBOT', label: 'Robot', shortLabel: 'Robot', category: 'story', color: '#6b7280', icon: '🤖', storyText: 'The robot', nfcUid: 'NFC:04:RB', brailleLabel: '⠗⠃⠞' },
  CHAR_CHILD: { type: 'CHAR_CHILD', label: 'Child', shortLabel: 'Child', category: 'story', color: '#fb923c', icon: '👧', storyText: 'The child', nfcUid: 'NFC:04:CH', brailleLabel: '⠉⠓⠙' },
  ACTION_WALKS: { type: 'ACTION_WALKS', label: 'Walks', shortLabel: 'Walks', category: 'story', color: '#65a30d', icon: '🚶', storyText: 'walks to', nfcUid: 'NFC:05:WK', brailleLabel: '⠺⠅' },
  ACTION_RUNS: { type: 'ACTION_RUNS', label: 'Runs', shortLabel: 'Runs', category: 'story', color: '#ea580c', icon: '🏃', storyText: 'runs to', nfcUid: 'NFC:05:RN', brailleLabel: '⠗⠝' },
  ACTION_JUMPS: { type: 'ACTION_JUMPS', label: 'Jumps', shortLabel: 'Jumps', category: 'story', color: '#0284c7', icon: '🦘', storyText: 'jumps over', nfcUid: 'NFC:05:JP', brailleLabel: '⠚⠏' },
  ACTION_SLEEPS: { type: 'ACTION_SLEEPS', label: 'Sleeps', shortLabel: 'Sleeps', category: 'story', color: '#4f46e5', icon: '😴', storyText: 'sleeps at', nfcUid: 'NFC:05:SL', brailleLabel: '⠎⠇' },
  ACTION_EATS: { type: 'ACTION_EATS', label: 'Eats', shortLabel: 'Eats', category: 'story', color: '#be123c', icon: '🍽', storyText: 'eats at', nfcUid: 'NFC:05:ET', brailleLabel: '⠑⠞' },
  PLACE_PARK: { type: 'PLACE_PARK', label: 'Park', shortLabel: 'Park', category: 'story', color: '#15803d', icon: '🌳', storyText: 'the park', nfcUid: 'NFC:06:PK', brailleLabel: '⠏⠅' },
  PLACE_HOUSE: { type: 'PLACE_HOUSE', label: 'House', shortLabel: 'House', category: 'story', color: '#b45309', icon: '🏠', storyText: 'the house', nfcUid: 'NFC:06:HS', brailleLabel: '⠓⠎' },
  PLACE_SPACE: { type: 'PLACE_SPACE', label: 'Space', shortLabel: 'Space', category: 'story', color: '#1e1b4b', icon: '🚀', storyText: 'outer space', nfcUid: 'NFC:06:SP', brailleLabel: '⠎⠏' },
  PLACE_OCEAN: { type: 'PLACE_OCEAN', label: 'Ocean', shortLabel: 'Ocean', category: 'story', color: '#0369a1', icon: '🌊', storyText: 'the ocean', nfcUid: 'NFC:06:OC', brailleLabel: '⠕⠉' },

  // ===== MATH (with auto-calculate) =====
  NUM_0: { type: 'NUM_0', label: '0', shortLabel: '0', category: 'math', color: '#475569', icon: '0️⃣', mathValue: 0, defaultValue: 0, nfcUid: 'NFC:07:0', brailleLabel: '⠚' },
  NUM_1: { type: 'NUM_1', label: '1', shortLabel: '1', category: 'math', color: '#475569', icon: '1️⃣', mathValue: 1, defaultValue: 1, nfcUid: 'NFC:07:1', brailleLabel: '⠁' },
  NUM_2: { type: 'NUM_2', label: '2', shortLabel: '2', category: 'math', color: '#475569', icon: '2️⃣', mathValue: 2, defaultValue: 2, nfcUid: 'NFC:07:2', brailleLabel: '⠃' },
  NUM_3: { type: 'NUM_3', label: '3', shortLabel: '3', category: 'math', color: '#475569', icon: '3️⃣', mathValue: 3, defaultValue: 3, nfcUid: 'NFC:07:3', brailleLabel: '⠉' },
  NUM_4: { type: 'NUM_4', label: '4', shortLabel: '4', category: 'math', color: '#475569', icon: '4️⃣', mathValue: 4, defaultValue: 4, nfcUid: 'NFC:07:4', brailleLabel: '⠙' },
  NUM_5: { type: 'NUM_5', label: '5', shortLabel: '5', category: 'math', color: '#475569', icon: '5️⃣', mathValue: 5, defaultValue: 5, nfcUid: 'NFC:07:5', brailleLabel: '⠑' },
  NUM_6: { type: 'NUM_6', label: '6', shortLabel: '6', category: 'math', color: '#475569', icon: '6️⃣', mathValue: 6, defaultValue: 6, nfcUid: 'NFC:07:6', brailleLabel: '⠋' },
  NUM_7: { type: 'NUM_7', label: '7', shortLabel: '7', category: 'math', color: '#475569', icon: '7️⃣', mathValue: 7, defaultValue: 7, nfcUid: 'NFC:07:7', brailleLabel: '⠛' },
  NUM_8: { type: 'NUM_8', label: '8', shortLabel: '8', category: 'math', color: '#475569', icon: '8️⃣', mathValue: 8, defaultValue: 8, nfcUid: 'NFC:07:8', brailleLabel: '⠓' },
  NUM_9: { type: 'NUM_9', label: '9', shortLabel: '9', category: 'math', color: '#475569', icon: '9️⃣', mathValue: 9, defaultValue: 9, nfcUid: 'NFC:07:9', brailleLabel: '⠊' },
  OP_PLUS: { type: 'OP_PLUS', label: 'Plus', shortLabel: '+', category: 'math', color: '#2563eb', icon: '➕', mathValue: '+', defaultValue: '+', nfcUid: 'NFC:08:+', brailleLabel: '⠖' },
  OP_MINUS: { type: 'OP_MINUS', label: 'Minus', shortLabel: '−', category: 'math', color: '#dc2626', icon: '➖', mathValue: '-', defaultValue: '-', nfcUid: 'NFC:08:-', brailleLabel: '⠤' },
  OP_MULTIPLY: { type: 'OP_MULTIPLY', label: 'Times', shortLabel: '×', category: 'math', color: '#7c3aed', icon: '✖️', mathValue: '*', defaultValue: '*', nfcUid: 'NFC:08:*', brailleLabel: '⠦' },
  OP_DIVIDE: { type: 'OP_DIVIDE', label: 'Divide', shortLabel: '÷', category: 'math', color: '#0891b2', icon: '➗', mathValue: '/', defaultValue: '/', nfcUid: 'NFC:08:/', brailleLabel: '⠌' },
  OP_EQUALS: { type: 'OP_EQUALS', label: 'Equals', shortLabel: '=', category: 'math', color: '#059669', icon: '🟰', mathValue: '=', defaultValue: '=', nfcUid: 'NFC:08:=', brailleLabel: '⠶' },

  // NEW COMPARISONS
  OP_GREATER: { type: 'OP_GREATER', label: 'Greater Than', shortLabel: '>', category: 'math', color: '#059669', icon: '>', mathValue: '>', defaultValue: '>', nfcUid: 'NFC:08:GT', brailleLabel: '⠂⠂' },
  OP_LESS: { type: 'OP_LESS', label: 'Less Than', shortLabel: '<', category: 'math', color: '#059669', icon: '<', mathValue: '<', defaultValue: '<', nfcUid: 'NFC:08:LT', brailleLabel: '⠆⠆' },


  // ===== VARIABLES =====
  VAR_SET: { type: 'VAR_SET', label: 'Set Variable', shortLabel: 'Set', category: 'variables', color: '#f97316', icon: '📦', hasInput: true, inputType: 'value-slot', defaultValue: 0, nfcUid: 'NFC:09:SV', brailleLabel: '⠎⠧' },
  VAR_CHANGE: { type: 'VAR_CHANGE', label: 'Change By', shortLabel: 'Change', category: 'variables', color: '#f97316', icon: '📈', hasInput: true, inputType: 'value-slot', defaultValue: 1, nfcUid: 'NFC:09:CV', brailleLabel: '⠉⠧' },
  VAR_SHOW: { type: 'VAR_SHOW', label: 'Say Variable', shortLabel: 'SayVar', category: 'variables', color: '#f97316', icon: '📢', nfcUid: 'NFC:09:DV', brailleLabel: '⠙⠧' },
  VAR_BLOCK: { type: 'VAR_SHOW', label: 'Variable', shortLabel: 'Var', category: 'variables', color: '#f97316', icon: '📦', nfcUid: 'NFC:09:VB', brailleLabel: '⠧⠃' },
};

export const getBlocksByCategory = (cat: BlockCategory) => Object.values(BLOCKS).filter(b => b.category === cat);

export const CATEGORIES: Record<BlockCategory, { label: string; color: string; icon: string }> = {
  events: { label: 'Events', color: '#facc15', icon: '🏁' },
  control: { label: 'Control', color: '#f59e0b', icon: '🔁' },
  sound: { label: 'Sound', color: '#ef4444', icon: '🎵' },
  story: { label: 'Story', color: '#a855f7', icon: '📖' },
  math: { label: 'Math', color: '#3b82f6', icon: '🔢' },
  variables: { label: 'Variables', color: '#f97316', icon: '📦' },
};

export type GameMode = 'code' | 'music' | 'story' | 'math';

export interface SampleProgram {
  id: string;
  name: string;
  description: string;
  mode: GameMode;
  lesson?: string; // Optional lesson category
  teaches?: string; // What concept it teaches
  blocks: { type: BlockType; value?: number | string }[];
}

export const SAMPLE_PROGRAMS: SampleProgram[] = [
  // ==========================================
  // UNIT 1: SEQUENCES & ALGORITHMS
  // ==========================================
  {
    id: 'U1-L1', name: '1.1 First Steps', lesson: 'Unit 1: Sequences',
    teaches: 'Computers read code from top to bottom.',
    mode: 'code', description: 'Simple sequence.', blocks: [
      { type: 'EVENT_START' }, { type: 'NOTE_C' }, { type: 'NOTE_E' }, { type: 'NOTE_G' }
    ]
  },
  {
    id: 'U1-L2', name: '1.2 Silence', lesson: 'Unit 1: Sequences',
    teaches: 'Rests add silence to music.',
    mode: 'code', description: 'Music with gaps.', blocks: [
      { type: 'NOTE_C' }, { type: 'REST' }, { type: 'NOTE_E' }, { type: 'REST' }, { type: 'NOTE_G' }
    ]
  },
  {
    id: 'U1-L3', name: '1.3 Hello World', lesson: 'Unit 1: Sequences',
    teaches: 'The "Say" block makes the computer speak.',
    mode: 'code', description: 'Make Talk.', blocks: [
      { type: 'EVENT_START' }, { type: 'SAY', value: 'Hello' }
    ]
  },
  {
    id: 'U1-L4', name: '1.4 Song Maker', lesson: 'Unit 1: Sequences',
    teaches: 'Longer sequences make songs.',
    mode: 'code', description: 'Make a song.', blocks: [
      { type: 'NOTE_C' }, { type: 'NOTE_D' }, { type: 'NOTE_E' }, { type: 'NOTE_C' },
      { type: 'NOTE_C' }, { type: 'NOTE_D' }, { type: 'NOTE_E' }, { type: 'NOTE_C' }
    ]
  },

  // ==========================================
  // UNIT 2: LOOPS
  // ==========================================
  {
    id: 'U2-L1', name: '2.1 The Repeater', lesson: 'Unit 2: Loops',
    teaches: 'Repeat blocks run code multiple times.',
    mode: 'code', description: 'Repeat 4 times.', blocks: [
      { type: 'EVENT_START' }, { type: 'REPEAT', value: '4' }, { type: 'DRUM' }, { type: 'LOOP_END' }
    ]
  },
  {
    id: 'U2-L2', name: '2.2 Drum Roll', lesson: 'Unit 2: Loops',
    teaches: 'Fast loops create rhythms.',
    mode: 'code', description: 'Fast Drum.', blocks: [
      { type: 'EVENT_START' }, { type: 'REPEAT', value: '8' }, { type: 'DRUM' }, { type: 'LOOP_END' }
    ]
  },
  {
    id: 'U2-L3', name: '2.3 Nested Loop', lesson: 'Unit 2: Loops',
    teaches: 'A loop inside a loop multiplies actions.',
    mode: 'code', description: '2x4 = 8 Drums.', blocks: [
      { type: 'REPEAT', value: '2' }, { type: 'REPEAT', value: '4' }, { type: 'DRUM' }, { type: 'LOOP_END' }, { type: 'LOOP_END' }
    ]
  },
  {
    id: 'U2-L4', name: '2.4 Infinity', lesson: 'Unit 2: Loops',
    teaches: 'Forever loops never stop.',
    mode: 'code', description: 'Run forever.', blocks: [
      { type: 'EVENT_START' }, { type: 'FOREVER' }, { type: 'NOTE_C' }, { type: 'NOTE_G' }, { type: 'LOOP_END' }
    ]
  },

  // ==========================================
  // UNIT 3: CONDITIONALS & LOGIC
  // ==========================================
  {
    id: 'U3-L1', name: '3.1 The Question', lesson: 'Unit 3: Logic',
    teaches: 'IF checks a condition.',
    mode: 'code', description: 'IF [Var] > 0?', blocks: [
      { type: 'EVENT_START' }, { type: 'VAR_SET', value: '1' }, { type: 'IF', value: 'Var' }, { type: 'SAY', value: 'Yes!' }, { type: 'END_IF' }
    ]
  },
  {
    id: 'U3-L2', name: '3.2 If/Else', lesson: 'Unit 3: Logic',
    teaches: 'Else runs if the condition is False.',
    mode: 'code', description: 'Or do this?', blocks: [
      { type: 'VAR_SET', value: '0' }, { type: 'IF_ELSE', value: 'Var' }, { type: 'SAY', value: 'Yes' }, { type: 'ELSE' }, { type: 'SAY', value: 'No' }, { type: 'END_IF' }
    ]
  },
  {
    id: 'U3-L3', name: '3.3 Math Truth', lesson: 'Unit 3: Logic',
    teaches: 'Math checks truth.',
    mode: 'math', description: '5 > 3?', blocks: [
      { type: 'NUM_5' }, { type: 'OP_GREATER' }, { type: 'NUM_3' }, { type: 'OP_EQUALS' } // 5 > 3 = 1 (True)
    ]
  },
  {
    id: 'U3-L4', name: '3.4 Logic Gate', lesson: 'Unit 3: Logic',
    teaches: 'Nested Ifs check two things.',
    mode: 'code', description: 'Check A then B.', blocks: [
      { type: 'VAR_SET', value: '5' }, { type: 'IF', value: 'Var' }, { type: 'IF', value: 'Var' }, { type: 'SAY', value: 'Double' }, { type: 'END_IF' }, { type: 'END_IF' }
    ]
  },

  // ==========================================
  // UNIT 4: VARIABLES
  // ==========================================
  {
    id: 'U4-L1', name: '4.1 The Box', lesson: 'Unit 4: Variables',
    teaches: 'A Variable is a storage box.',
    mode: 'code', description: 'Set & Say.', blocks: [
      { type: 'EVENT_START' }, { type: 'VAR_SET', value: '5' }, { type: 'VAR_SHOW' }
    ]
  },
  {
    id: 'U4-L2', name: '4.2 Counter', lesson: 'Unit 4: Variables',
    teaches: 'Variables can change value.',
    mode: 'code', description: 'Count up.', blocks: [
      { type: 'VAR_SET', value: '0' }, { type: 'REPEAT', value: '3' }, { type: 'VAR_CHANGE', value: '1' }, { type: 'VAR_SHOW' }, { type: 'LOOP_END' }
    ]
  },
  {
    id: 'U4-L3', name: '4.3 Speed Control', lesson: 'Unit 4: Variables',
    teaches: 'Variables can control Tempo.',
    mode: 'music', description: 'Var sets Tempo.', blocks: [
      { type: 'VAR_SET', value: '180' }, { type: 'SET_TEMPO', value: '120' }, { type: 'DRUM' }
    ]
  },
  {
    id: 'U4-L4', name: '4.4 Dynamic Wait', lesson: 'Unit 4: Variables',
    teaches: 'Wait matches Variable.',
    mode: 'code', description: 'Wait [Var] seconds.', blocks: [
      { type: 'VAR_SET', value: '2' }, { type: 'NOTE_C' }, { type: 'WAIT', value: '2' }, { type: 'NOTE_G' }
    ]
  },

  // ==========================================
  // UNIT 5: DEBUGGING
  // ==========================================
  {
    id: 'U5-L1', name: '5.1 Broken Loop', lesson: 'Unit 5: Debugging',
    teaches: 'Why does it not run?',
    mode: 'code', description: 'Fix the loop.', blocks: [
      { type: 'EVENT_START' }, { type: 'REPEAT', value: '0' }, { type: 'DRUM' }, { type: 'LOOP_END' }
    ]
  },
  {
    id: 'U5-L2', name: '5.2 Silent Song', lesson: 'Unit 5: Debugging',
    teaches: 'Missing blocks stop sound.',
    mode: 'music', description: 'Add the notes.', blocks: [
      { type: 'NOTE_C' }, { type: 'WAIT', value: 0.5 }, { type: 'WAIT', value: 0.5 }, { type: 'NOTE_G' }
    ]
  },
  {
    id: 'U5-L3', name: '5.3 Wrong Variable', lesson: 'Unit 5: Debugging',
    teaches: 'Checking wrong value.',
    mode: 'code', description: 'Var is 0, If checks > 0.', blocks: [
      { type: 'VAR_SET', value: '0' }, { type: 'IF', value: 'Var' }, { type: 'SAY', value: 'Error' }, { type: 'END_IF' }
    ]
  },
  {
    id: 'U5-L4', name: '5.4 Infinite Trap', lesson: 'Unit 5: Debugging',
    teaches: 'Forever never ends.',
    mode: 'code', description: 'Stop the loop.', blocks: [
      { type: 'FOREVER' }, { type: 'SAY', value: 'Stop me!' }, { type: 'LOOP_END' }
    ]
  },

  // ==========================================
  // UNIT 6: STORY MODE
  // ==========================================
  {
    id: 'U6-L1', name: '6.1 The Journey', lesson: 'Unit 6: Story',
    teaches: 'Tell a story with characters.',
    mode: 'story', description: 'Dog and Cat.', blocks: [
      { type: 'CHAR_DOG' }, { type: 'ACTION_WALKS' }, { type: 'PLACE_PARK' }, { type: 'CHAR_CAT' }
    ]
  },
  {
    id: 'U6-L2', name: '6.2 Adventure', lesson: 'Unit 6: Story',
    teaches: 'Characters move places.',
    mode: 'story', description: 'Space Trip.', blocks: [
      { type: 'CHAR_ROBOT' }, { type: 'ACTION_RUNS' }, { type: 'PLACE_SPACE' }, { type: 'ACTION_SLEEPS' }
    ]
  },
  {
    id: 'U6-L3', name: '6.3 Interactions', lesson: 'Unit 6: Story',
    teaches: 'Characters meet.',
    mode: 'story', description: 'Child meets Dog.', blocks: [
      { type: 'CHAR_CHILD' }, { type: 'ACTION_JUMPS' }, { type: 'CHAR_DOG' }, { type: 'ACTION_EATS' }
    ]
  },
  {
    id: 'U6-L4', name: '6.4 The End?', lesson: 'Unit 6: Story',
    teaches: 'Looping stories.',
    mode: 'story', description: 'Repeat the tale.', blocks: [
      { type: 'REPEAT', value: '2' }, { type: 'CHAR_CAT' }, { type: 'ACTION_SLEEPS' }, { type: 'LOOP_END' }
    ]
  },

  // ==========================================
  // UNIT 7: MUSIC MODE
  // ==========================================
  {
    id: 'U7-L1', name: '7.1 Rhythm', lesson: 'Unit 7: Music',
    teaches: 'Create a beat pattern.',
    mode: 'music', description: 'Drum & Bass.', blocks: [
      { type: 'DRUM' }, { type: 'WAIT', value: 0.5 }, { type: 'DRUM' }, { type: 'WAIT', value: 0.5 }, { type: 'DRUM' }
    ]
  },
  {
    id: 'U7-L2', name: '7.2 Melody', lesson: 'Unit 7: Music',
    teaches: 'Combine notes.',
    mode: 'music', description: 'Simple Tune.', blocks: [
      { type: 'NOTE_C' }, { type: 'NOTE_D' }, { type: 'NOTE_E' }, { type: 'NOTE_F' }, { type: 'NOTE_G' }
    ]
  },
  {
    id: 'U7-L3', name: '7.3 Chords', lesson: 'Unit 7: Music',
    teaches: 'Multiple notes at once.',
    mode: 'music', description: 'C Major Chord.', blocks: [
      { type: 'CHORD_C' }, { type: 'WAIT', value: 1 }, { type: 'CHORD_G' }, { type: 'WAIT', value: 1 }, { type: 'CHORD_C' }
    ]
  },
  {
    id: 'U7-L4', name: '7.4 Silence is Gold', lesson: 'Unit 7: Music',
    teaches: 'Using Rests.',
    mode: 'music', description: 'Beat with pauses.', blocks: [
      { type: 'DRUM' }, { type: 'REST' }, { type: 'DRUM' }, { type: 'REST' }, { type: 'CHORD_F' }
    ]
  },

  // ==========================================
  // UNIT 8: FULL GRID CHALLENGES
  // ==========================================
  {
    id: 'U8-P1', name: '8.1 Logic Warmup', lesson: 'Unit 8: Mastery',
    teaches: 'Combine Math & Logic.',
    mode: 'code', description: 'If 5 > 2?', blocks: [
      { type: 'VAR_SET', value: '5' }, { type: 'IF', value: 'Var' }, { type: 'SAY', value: 'Big' }, { type: 'END_IF' }
    ]
  },
  {
    id: 'U8-P2', name: '8.2 Music Warmup', lesson: 'Unit 8: Mastery',
    teaches: 'Looping Chords.',
    mode: 'music', description: 'Chord Loop.', blocks: [
      { type: 'REPEAT', value: '3' }, { type: 'CHORD_C' }, { type: 'CHORD_G' }, { type: 'LOOP_END' }
    ]
  },
  {
    id: 'U8-P3', name: '8.3 Logic Matrix', lesson: 'Unit 8: Mastery',
    teaches: 'Full Grid Logic: Set, Check, Act, Else.',
    mode: 'code', description: '8 Slots: Complex logic state.', blocks: [
      { type: 'VAR_SET', value: '5' },         // Slot 1
      { type: 'VAR_CHANGE', value: '1' },      // Slot 2
      { type: 'IF', value: 'Var' },            // Slot 3
      { type: 'SAY', value: 'High' },          // Slot 4
      { type: 'ELSE' },                        // Slot 5
      { type: 'SAY', value: 'Low' },           // Slot 6
      { type: 'END_IF' },                      // Slot 7
      { type: 'DRUM' }                         // Slot 8
    ]
  },
  {
    id: 'U8-P4', name: '8.4 Music Matrix', lesson: 'Unit 8: Mastery',
    teaches: 'Full Grid Music Loop.',
    mode: 'music', description: '8 Slots: Bass & Melody.', blocks: [
      { type: 'REPEAT', value: '2' },          // Slot 1
      { type: 'NOTE_C' },                      // Slot 2
      { type: 'NOTE_E' },                      // Slot 3
      { type: 'NOTE_G' },                      // Slot 4
      { type: 'DRUM' },                        // Slot 5
      { type: 'WAIT', value: 0.5 },            // Slot 6
      { type: 'LOOP_END' },                    // Slot 7
      { type: 'CHORD_C' }                      // Slot 8
    ]
  },
  {
    id: 'U8-P5', name: '8.5 The Calculator', lesson: 'Unit 8: Mastery',
    teaches: 'Process Input.',
    mode: 'math', description: '8 Slots: Calculate & Check.', blocks: [
      { type: 'VAR_SET', value: '10' },        // Slot 1
      { type: 'VAR_CHANGE', value: '-2' },     // Slot 2 (8)
      { type: 'VAR_CHANGE', value: '-3' },     // Slot 3 (5)
      { type: 'IF_ELSE', value: 'Var' },       // Slot 4 (If 5 > 0)
      { type: 'SAY', value: 'Positive' },      // Slot 5
      { type: 'ELSE' },                        // Slot 6
      { type: 'SAY', value: 'Negative' },      // Slot 7
      { type: 'END_IF' }                       // Slot 8
    ]
  },
  {
    id: 'U8-P6', name: '8.6 Story Director', lesson: 'Unit 8: Mastery',
    teaches: 'Complex Narrative.',
    mode: 'story', description: '8 Slots: Full Scene.', blocks: [
      { type: 'CHAR_CHILD' },                  // Slot 1
      { type: 'ACTION_RUNS' },                 // Slot 2
      { type: 'PLACE_PARK' },                  // Slot 3
      { type: 'CHAR_DOG' },                    // Slot 4
      { type: 'ACTION_JUMPS' },                // Slot 5
      { type: 'PLACE_HOUSE' },                 // Slot 6
      { type: 'CHAR_CAT' },                    // Slot 7
      { type: 'ACTION_SLEEPS' }                // Slot 8
    ]
  },

  // ==========================================
  // PLAYGROUND EXPLORATION
  // ==========================================
  {
    id: 'play-twinkle', name: 'Twinkle Star', description: 'Classic melody', mode: 'music', blocks: [
      { type: 'NOTE_C' }, { type: 'NOTE_C' }, { type: 'NOTE_G' }, { type: 'NOTE_G' }, { type: 'NOTE_A' }, { type: 'NOTE_A' }, { type: 'NOTE_G' }
    ]
  }
];
