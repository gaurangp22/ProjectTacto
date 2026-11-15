/**
 * TACTO pedagogy layer.
 *
 * Every lesson follows the same four-beat loop, designed for learners who work through
 * touch and sound first:
 *
 *   1. FEEL  , an unplugged warm-up with the body or real objects (no board yet)
 *   2. BUILD , place physical tiles on the reader board (or in the simulator)
 *   3. HEAR  , run it; the speaker narrates each tile as it executes
 *   4. FIX   , listen for the moment it went wrong, change one tile, run again
 *
 * Units move from Use → Modify → Create (a.k.a. PRIMM): learners first run and predict
 * given programs, then change them, then build their own.
 */
import type { BlockId } from "../client/sim/blocks";

export const LOOP = [
  { step: "Feel", text: "An unplugged warm-up with bodies, desks or objects, the concept before the code." },
  { step: "Build", text: "Seat physical tiles on the reader board. Each one clicks and announces itself." },
  { step: "Hear", text: "Run the program. The speaker narrates every tile as it executes, with spatial sound for Pip." },
  { step: "Fix", text: "Listen for the moment it went wrong, change one tile, run again. Bugs are part of the lesson." },
] as const;

/* ───────────────────────── The physical kit ───────────────────────── */

export interface KitTile {
  block: BlockId | "sensor" | "dial";
  name: string;
  count: number;
  tactile: string;
  notes?: string;
}

/** The classroom kit, enough for 2–3 learners sharing one reader board. */
export const KIT: { board: string[]; tiles: KitTile[] } = {
  board: [
    "24 magnetic slots in 3 rows of 8. Programs read left-to-right, top-to-bottom, the same direction as Braille, so reading code and reading text feel alike.",
    "A raised tick between slots so fingers can count position without looking. Slot 1 has a tactile dot.",
    "Each slot reads the tile's NFC tag the moment it seats, and the speaker confirms with a click and its name.",
    "Run, Step and Stop are three large, differently-shaped buttons (circle, triangle, square) on the board's right edge.",
    "A headphone jack and a volume wheel, so one learner can work quietly in a busy classroom.",
  ],
  tiles: [
    { block: "forward", name: "Forward", count: 12, tactile: "Arrow ridge pointing away from you" },
    { block: "turn_left", name: "Turn left", count: 6, tactile: "Arrow ridge curling left" },
    { block: "turn_right", name: "Turn right", count: 6, tactile: "Arrow ridge curling right" },
    { block: "collect", name: "Collect", count: 4, tactile: "Small raised diamond" },
    { block: "repeat", name: "Repeat", count: 4, tactile: "Circular ridge", notes: "Has a clicking number dial (2–12). Each click is felt and heard." },
    { block: "repeat_until", name: "Repeat until", count: 2, tactile: "Circular ridge with a notch", notes: "Takes a sensor cap." },
    { block: "while", name: "While", count: 2, tactile: "Circular ridge with two notches", notes: "Takes a sensor cap." },
    { block: "if", name: "If", count: 3, tactile: "Angular notch on the left edge", notes: "Takes a sensor cap or a compare cap." },
    { block: "else", name: "Else", count: 3, tactile: "Notch on both edges" },
    { block: "end", name: "End", count: 8, tactile: "Flat bar, closes any bracket" },
    { block: "sensor", name: "Sensor caps", count: 6, tactile: "Snap-on caps: one dot = path ahead, two = left, three = right, ring = gem, flag = goal, bar = wall" },
    { block: "play_note", name: "Note", count: 8, tactile: "Wave ridge with a pitch slider", notes: "Slider has 10 detents (C4–E5); a beat switch picks ½, 1 or 2 beats." },
    { block: "drum", name: "Drum", count: 4, tactile: "Round drum-skin dimple", notes: "Rotating face: kick, snare, hat, clap." },
    { block: "say", name: "Say", count: 4, tactile: "Speech-bubble bump", notes: "Phrase wheel, or record your own phrase." },
    { block: "set_var", name: "Box (Set / Change / Say)", count: 6, tactile: "Square hole", notes: "A and B tokens drop into the hole; a dial sets the number." },
    { block: "define", name: "Define / Do", count: 4, tactile: "Star, raised border for Define, flat for Do", notes: "Matching shape-tokens pair a Define with its Do tiles." },
  ],
};

/* ───────────────────────── Units ───────────────────────── */

export interface UnitPedagogy {
  bigIdea: string;
  standards: string[]; // CSTA K-12 identifiers
  stage: "Use" | "Use → Modify" | "Modify" | "Modify → Create" | "Create";
  unplugged: string;
  sessions: string;
  vocabulary: string[];
  assessment: string;
}

export const UNIT_PEDAGOGY: Record<string, UnitPedagogy> = {
  sequences: {
    bigIdea: "Computers do exactly what we say, in exactly the order we say it.",
    standards: ["1A-AP-08", "1A-AP-10"],
    stage: "Use",
    unplugged: "“Robot partner”: one child is Pip, another gives spoken instructions to reach a cushion. Only Forward, Turn left, Turn right are allowed. Swap roles.",
    sessions: "2 × 40 min",
    vocabulary: ["instruction", "sequence", "program", "run"],
    assessment: "Learner can build and narrate a 5-tile route without help, and predict where Pip will stop before pressing Run.",
  },
  loops: {
    bigIdea: "When something repeats, describe it once and say how many times.",
    standards: ["1A-AP-10", "1B-AP-10"],
    stage: "Use → Modify",
    unplugged: "Clap-and-stomp patterns: the teacher claps “clap, stomp” four times; learners invent a short way to say it (“repeat four: clap, stomp”).",
    sessions: "2 × 40 min",
    vocabulary: ["loop", "repeat", "pattern", "bracket", "nested"],
    assessment: "Learner can replace a run of identical tiles with a Repeat bracket and explain what is inside it.",
  },
  music: {
    bigIdea: "Programs make things happen in time, a melody is a sequence you can hear.",
    standards: ["1A-AP-10", "1A-AP-11"],
    stage: "Use → Modify",
    unplugged: "Sing Mi-Re-Do together while tapping desks: high, middle, low. Then hum it twice with a rest between, that's a loop.",
    sessions: "2 × 40 min",
    vocabulary: ["note", "beat", "rest", "rhythm", "instrument"],
    assessment: "Learner can match a heard target melody by ear and use a loop for a repeated phrase.",
  },
  conditionals: {
    bigIdea: "Programs can sense the world and choose what to do.",
    standards: ["1B-AP-10", "1A-AP-12"],
    stage: "Modify",
    unplugged: "“Gem or pebble?”: walk a line of cups. If a cup has a marble inside, pick it up; otherwise walk on. Cups are re-shuffled for each walker.",
    sessions: "2 × 45 min",
    vocabulary: ["condition", "if", "else", "sensor", "true / false"],
    assessment: "Learner writes one program that works on several shuffled layouts, and explains why a fixed sequence would fail.",
  },
  "smart-loops": {
    bigIdea: "Some loops don't count, they keep going until the job is done.",
    standards: ["1B-AP-10", "1B-AP-08"],
    stage: "Modify → Create",
    unplugged: "Blindfold-free “hallway walk”: walk forward until your hand touches the wall. Nobody counts steps, yet everyone arrives.",
    sessions: "2 × 45 min",
    vocabulary: ["repeat until", "while", "algorithm", "infinite loop"],
    assessment: "Learner builds the maze-follower algorithm and can say why it works on a maze they haven't seen.",
  },
  variables: {
    bigIdea: "A variable is a box with a name that remembers a number for you.",
    standards: ["1B-AP-09"],
    stage: "Modify → Create",
    unplugged: "Two real boxes labelled A and B in Braille. Drop counters in and take them out as the class follows spoken instructions; then ask “how many in A?”",
    sessions: "3 × 45 min",
    vocabulary: ["variable", "value", "set", "change", "compare"],
    assessment: "Learner can trace a counting loop aloud (“A is 1, A is 2…”) before running it, and fix an off-by-one countdown.",
  },
  functions: {
    bigIdea: "Give a routine a name, then use the name instead of the steps.",
    standards: ["1B-AP-11", "1B-AP-13"],
    stage: "Create",
    unplugged: "Teach the class a dance move called “the Spin” (turn, turn). The teacher then calls “Spin, step, Spin” and everyone knows what to do.",
    sessions: "2 × 45 min",
    vocabulary: ["function", "define", "call", "reuse", "decompose"],
    assessment: "Learner spots a repeated non-contiguous pattern, defines it once and calls it at least twice.",
  },
  debugging: {
    bigIdea: "Every programmer writes bugs. Good programmers find them by testing and listening.",
    standards: ["1A-AP-14", "1B-AP-15"],
    stage: "Modify",
    unplugged: "“Spot the swap”: the teacher reads aloud a recipe with one step in the wrong place. Learners raise a hand at the exact step that is wrong.",
    sessions: "1–2 × 40 min (can be woven into any unit)",
    vocabulary: ["bug", "debug", "test", "expected vs actual"],
    assessment: "Learner uses Step mode to locate the faulty tile and explains what was expected versus what happened.",
  },
  studio: {
    bigIdea: "Code is a material for making things that matter to you.",
    standards: ["1B-AP-12", "1B-AP-17"],
    stage: "Create",
    unplugged: "Plan on paper or with clay: what will your project do? Tell a partner in three sentences before building.",
    sessions: "Open-ended; great for showcases",
    vocabulary: ["project", "plan", "remix", "share"],
    assessment: "Learner presents their project to peers and narrates how it works tile by tile.",
  },
};

/* ───────────────────────── Lessons ───────────────────────── */

export interface LessonPedagogy {
  objective: string;
  /** What to put on the physical reader board. */
  onBoard: string;
  misconception: string;
  teacherNote: string;
  extension: string;
}

export const LESSON_PEDAGOGY: Record<string, LessonPedagogy> = {
  "seq-1": {
    objective: "Run a program and connect one tile to one action.",
    onBoard: "Hand the learner 4 Forward tiles. Seat them in slots 1–3, one at a time, listening for each click.",
    misconception: "Thinking one Forward moves Pip ‘all the way’.",
    teacherNote: "Let the learner trace Pip's grid with a finger on the tactile grid overlay while it runs.",
    extension: "Add a fourth Forward. What does the speaker say? (Bump, a first, friendly bug.)",
  },
  "seq-2": {
    objective: "Distinguish turning (changes facing) from moving (changes position).",
    onBoard: "Forward, Forward, Turn right, Forward, Forward in slots 1–5.",
    misconception: "Turn tiles also step forward.",
    teacherNote: "Have the learner stand up and do the program with their own body first, left and right are felt, not seen.",
    extension: "Rebuild it as if Pip started facing the other way.",
  },
  "seq-3": {
    objective: "Build and test a longer sequence in parts.",
    onBoard: "9 tiles across row 1 and the start of row 2, a good moment to teach row wrap-around on the board.",
    misconception: "You must build the whole program before testing.",
    teacherNote: "Encourage pressing Run after every 2–3 tiles. Incremental testing is the habit we want.",
    extension: "Spot the repeating pair (Right/Left), preview of loops.",
  },
  "seq-4": {
    objective: "Use an action tile that depends on Pip's position.",
    onBoard: "Forward, Forward, Collect (diamond), Forward, Forward.",
    misconception: "Collect grabs a gem from anywhere.",
    teacherNote: "The gem chime is panned to where Pip is, ask learners which ear they heard it in.",
    extension: "Move Collect one slot earlier. What happens?",
  },
  "seq-5": {
    objective: "Plan a multi-part route before building.",
    onBoard: "11 tiles, filling row 1 and part of row 2.",
    misconception: "One right turn reverses direction.",
    teacherNote: "Ask for a spoken plan first: “three steps, grab, turn, two down, turn, three back”.",
    extension: "Find the shortest possible program.",
  },
  "loop-1": {
    objective: "Use Repeat to replace identical consecutive tiles.",
    onBoard: "Repeat (dial to 8), Forward, End, just 3 slots. Let learners feel how much shorter the board is.",
    misconception: "Repeat needs a Forward for each repetition.",
    teacherNote: "Compare by touch: 8 tiles in a row versus 3. The dial click count can be counted by ear.",
    extension: "Set the dial to 9. Predict before running.",
  },
  "loop-2": {
    objective: "Identify a multi-tile pattern and loop it.",
    onBoard: "Repeat 4, Forward, Collect, Forward, End.",
    misconception: "Only one tile can go inside a loop.",
    teacherNote: "Clap the pattern “step-grab-step” before building.",
    extension: "Could the pattern be “Collect, Forward, Forward”? Try it.",
  },
  "loop-3": {
    objective: "Combine a loop with tiles before or after it.",
    onBoard: "Repeat 3 bracket holding 4 tiles, then a single Forward after End.",
    misconception: "Everything after End is also repeated.",
    teacherNote: "The narrator says “inside repeat” for tiles in the bracket, have learners point to where ‘inside’ stops.",
    extension: "Make a staircase going up instead.",
  },
  "loop-4": {
    objective: "Nest a loop inside another loop.",
    onBoard: "Repeat 4, Repeat 4, Forward, End, Collect, Turn right, End, two End tiles, each closing its own bracket.",
    misconception: "Ends close brackets in the order they were opened (they close the most recent one).",
    teacherNote: "Use two different-sized hoops on the desk: the small one goes inside the big one.",
    extension: "How many Forward actions happen in total? (16) Count with the narrator.",
  },
  "mus-1": {
    objective: "Connect a tile to a sound.",
    onBoard: "One Note tile with the slider at the bottom detent (C).",
    misconception: "-",
    teacherNote: "Press Listen first. Ear-matching is the success criterion in this unit.",
    extension: "Slide to the top detent. Higher or lower?",
  },
  "mus-2": {
    objective: "Sequence pitches and durations.",
    onBoard: "Three Note tiles: E (1), D (1), C (2, flip the beat switch).",
    misconception: "Only pitch matters, not length.",
    teacherNote: "Sing it together before building.",
    extension: "Play it backwards. Does it still sound like a song?",
  },
  "mus-3": {
    objective: "Apply loops to music.",
    onBoard: "Repeat 2, E, D, C(2), Rest, End.",
    misconception: "Rests are ‘nothing’ and don't count.",
    teacherNote: "Rests are where the music breathes, have learners count the silent beat aloud.",
    extension: "Change the dial to 3.",
  },
  "mus-4": {
    objective: "Use multiple loops in one program.",
    onBoard: "Three Repeat brackets in a row; 14 tiles across two rows.",
    misconception: "You can only have one loop per program.",
    teacherNote: "Break the song into parts with the class before building, decomposition by ear.",
    extension: "Swap instrument tiles between parts.",
  },
  "mus-5": {
    objective: "Build a rhythmic pattern and loop it.",
    onBoard: "Repeat 4, Drum kick, hat, snare, hat, End.",
    misconception: "-",
    teacherNote: "Great for group work: one learner per drum tile.",
    extension: "Make a pattern with 8 hits per bar.",
  },
  "mus-6": {
    objective: "Separate ‘what plays’ (notes) from ‘how it sounds’ (instrument).",
    onBoard: "Instrument tile first, then three small Repeat 2 brackets and a final long G.",
    misconception: "Changing instrument changes the tune.",
    teacherNote: "Try the same program with all four instruments.",
    extension: "Write the second line of the song.",
  },
  "if-1": {
    objective: "Use If with a sensor to handle different layouts.",
    onBoard: "Repeat 7, Forward, If + gem-ring sensor cap, Collect, End, End.",
    misconception: "Collect without If is fine (it isn't when gems move).",
    teacherNote: "Run several times, the simulator shuffles gem layouts. A fixed sequence will fail on one of them.",
    extension: "What happens if you remove the If but keep Collect?",
  },
  "if-2": {
    objective: "React to a wall before it causes a bump.",
    onBoard: "Repeat 5, If + bar (wall) cap, Turn right, End, Forward, End.",
    misconception: "Sensors look everywhere (they only check one direction).",
    teacherNote: "Have learners put a hand out in front of them as ‘the sensor’.",
    extension: "What if the corner turns left on some maps?",
  },
  "if-3": {
    objective: "Choose between two actions with Else.",
    onBoard: "Repeat 3 bracket, then If (right-path cap) / Else / End, then two Forwards.",
    misconception: "Else runs after the If-part as well.",
    teacherNote: "The two notched edges of Else are a ‘fork in the road’ you can feel.",
    extension: "Rewrite it checking the left path instead.",
  },
  "if-4": {
    objective: "Place a decision inside a loop body at the right moment.",
    onBoard: "9 tiles: a Repeat 3 bracket containing an If bracket.",
    misconception: "The If can go anywhere in the loop.",
    teacherNote: "Ask: at which moment in each step is Pip standing on a possible gem?",
    extension: "Add a second If to check after the turn too.",
  },
  "until-1": {
    objective: "Use a condition-controlled loop instead of counting.",
    onBoard: "Repeat until + flag cap, Forward, End.",
    misconception: "Repeat until needs a number too.",
    teacherNote: "Contrast with loop-1. Same idea, but now Pip ‘feels’ when to stop.",
    extension: "What if there is no goal? (The loop guard stops it, talk about infinite loops.)",
  },
  "until-2": {
    objective: "Combine a smart loop with a decision.",
    onBoard: "Repeat until (flag), Forward, If (gem), Collect, End, End.",
    misconception: "-",
    teacherNote: "Have a learner explain each End: which bracket does it close?",
    extension: "Put the If before the Forward. Does it still work?",
  },
  "until-3": {
    objective: "Use While (keep going while true).",
    onBoard: "While (one-dot cap), Forward, End, Turn right, While, Forward, End.",
    misconception: "While and Repeat until are unrelated (they are mirror images).",
    teacherNote: "Swap a While for a Repeat until with the opposite cap and show both work.",
    extension: "Add a third corridor.",
  },
  "until-4": {
    objective: "Build a general algorithm that solves unseen mazes.",
    onBoard: "10 tiles with three nested brackets, the hardest board yet. Use row 2 for the inner If/Else.",
    misconception: "A program must be made for one specific maze.",
    teacherNote: "This is the ‘aha’ lesson. Celebrate when one program solves two different mazes.",
    extension: "Design a maze where this algorithm fails. Why?",
  },
  "var-1": {
    objective: "Produce output from a program.",
    onBoard: "One Say tile, phrase wheel on “Hello!”.",
    misconception: "-",
    teacherNote: "Learners with their own recorded phrases on the hardware love this one.",
    extension: "Say three different things in order.",
  },
  "var-2": {
    objective: "Store and update a number in a variable.",
    onBoard: "Set A=0, Repeat 5, Change A +1, Say A, End, with the A token in each square hole.",
    misconception: "Say A says the letter A.",
    teacherNote: "Mirror it with the real counter box from the unplugged activity.",
    extension: "Count to 10.",
  },
  "var-3": {
    objective: "Count down with negative change.",
    onBoard: "Set A=5, Repeat 5, Say A, Change A −1, End, Say Blast off!",
    misconception: "The order of Say and Change inside the loop doesn't matter.",
    teacherNote: "Swap Say and Change and ask learners to predict the new output.",
    extension: "Count down from 10.",
  },
  "var-4": {
    objective: "Control a pattern through the change amount.",
    onBoard: "Like var-2 but the Change dial on +2.",
    misconception: "-",
    teacherNote: "Link to times tables.",
    extension: "Count by fives to 25.",
  },
  "var-5": {
    objective: "Make a decision by comparing a variable.",
    onBoard: "Repeat 6 with a Change and an If-compare (A > 3) / Else / End inside.",
    misconception: "A > 3 includes 3.",
    teacherNote: "Trace it aloud as a class before running.",
    extension: "Use < instead and swap the phrases.",
  },
  "var-6": {
    objective: "Order nested conditions from most to least specific.",
    onBoard: "15 tiles across two rows, three nested If-divisible brackets.",
    misconception: "Checking 3 first is fine (15 would then say just Fizz).",
    teacherNote: "A classic interview puzzle, learners love knowing that.",
    extension: "Invent your own rule for 7.",
  },
  "fn-1": {
    objective: "Define and call a function.",
    onBoard: "Define (raised star) Spin, Right, Right, End on row 1; the main program on row 2 using flat-star Do tiles with the Spin token.",
    misconception: "Define runs immediately.",
    teacherNote: "Point out that the Define row doesn't make Pip move until Do is reached.",
    extension: "Define a function called Dance.",
  },
  "fn-2": {
    objective: "Decompose a route and reuse a named part.",
    onBoard: "Define Climb on row 1; seven tiles of main program on row 2.",
    misconception: "Functions are only useful for consecutive repeats (Repeat does that).",
    teacherNote: "Compare tile counts with and without the function.",
    extension: "Can you also use a Repeat 2 around Do Climb?",
  },
  "fn-3": {
    objective: "Transfer functions to music (chorus/verse).",
    onBoard: "Define Chorus on row 1; Do Chorus ×3 plus two loops on row 2.",
    misconception: "-",
    teacherNote: "Connect to songs learners know: which part is the chorus?",
    extension: "Write a song with a verse function and a chorus function.",
  },
  "bug-1": {
    objective: "Locate a bug by listening to execution.",
    onBoard: "The starter program is pre-seated. Learners may change only one tile.",
    misconception: "You must rebuild from scratch.",
    teacherNote: "Use Step: the bump is heard right after the faulty turn.",
    extension: "Introduce a bug for a partner to find.",
  },
  "bug-2": {
    objective: "Fix an off-by-N loop count.",
    onBoard: "Starter Repeat 6 is seated; turn the dial.",
    misconception: "-",
    teacherNote: "Ask for a prediction: how many more steps are needed?",
    extension: "-",
  },
  "bug-3": {
    objective: "Fix a structural (syntax) error.",
    onBoard: "Starter has no End. The board refuses to run and says which tile is unclosed.",
    misconception: "Errors mean ‘I'm bad at this’.",
    teacherNote: "Frame the error message as the computer asking a question.",
    extension: "What if End goes after Collect?",
  },
  "bug-4": {
    objective: "Compare expected and actual output by ear.",
    onBoard: "Starter melody seated; slide one note.",
    misconception: "-",
    teacherNote: "Play Listen and the learner's version back to back.",
    extension: "-",
  },
  "bug-5": {
    objective: "Find a boundary (off-by-one) error.",
    onBoard: "Starter countdown seated; change one dial.",
    misconception: "-",
    teacherNote: "Trace the box value aloud each round.",
    extension: "Make it count down from 5 instead.",
  },
  "studio-grid": {
    objective: "Apply any concept creatively.",
    onBoard: "Full kit available.",
    misconception: "-",
    teacherNote: "Run a ‘fewest tiles’ class challenge.",
    extension: "Share your shortest program.",
  },
  "studio-music": {
    objective: "Compose an original piece.",
    onBoard: "Full sound kit.",
    misconception: "-",
    teacherNote: "End with a class concert.",
    extension: "Combine drums and melody.",
  },
  "studio-voice": {
    objective: "Build an interactive story or quiz.",
    onBoard: "Say, Box and Decision tiles.",
    misconception: "-",
    teacherNote: "Pair learners: one writes, one tests.",
    extension: "Record custom phrases on the hardware.",
  },
};
