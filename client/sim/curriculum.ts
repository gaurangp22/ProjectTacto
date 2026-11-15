import type { BlockId } from "./blocks";

export type WorldKind = "grid" | "music" | "voice";

export interface Lesson {
  id: string;
  title: string;
  world: WorldKind;
  /** The story read aloud when the lesson opens. */
  brief: string;
  /** One-sentence "what you'll learn". */
  concept: string;
  hints: string[];
  palette: BlockId[];
  /** Grid lessons: one or more map variants. A program must solve all of them. */
  maps?: string[][];
  /** Reference solution in spec syntax. Also generates targets for music/voice lessons. */
  solution: string;
  /** Pre-placed (buggy) program for debugging lessons. */
  starter?: string;
  /** Tile count that earns three stars. Defaults to solution length. */
  par?: number;
  require?: BlockId[];
  sandbox?: boolean;
}

export interface Unit {
  id: string;
  n: number;
  title: string;
  tagline: string;
  color: string; // css var name
  concepts: string[];
  ages: string;
  lessons: Lesson[];
}

const MOVE: BlockId[] = ["forward", "turn_left", "turn_right"];
const MOVE_C: BlockId[] = [...MOVE, "collect"];
const MUSIC: BlockId[] = ["play_note", "rest", "repeat", "end"];

export const UNITS: Unit[] = [
  {
    id: "sequences", n: 1, title: "First Steps", tagline: "Instructions run in order, one tile at a time.", color: "teal", ages: "5+",
    concepts: ["Sequencing", "Directions", "Left vs right"],
    lessons: [
      {
        id: "seq-1", title: "Hello, Pip", world: "grid",
        brief: "This is Pip, a little robot who only moves when you tell it to. Pip is facing a flag three squares ahead. Place Forward tiles on the board, then press Run.",
        concept: "A program is a list of instructions that run from top to bottom.",
        hints: ["Each Forward tile moves Pip exactly one square.", "Count the squares between Pip and the flag: three."],
        palette: ["forward"], maps: [[">..G"]], solution: "forward forward forward",
      },
      {
        id: "seq-2", title: "Around the corner", world: "grid",
        brief: "The path bends. Pip has to walk two squares, turn, then walk two more. Turning does not move Pip. It only changes the way Pip faces.",
        concept: "Turns change direction without moving.",
        hints: ["Imagine you are Pip. After two steps, is the flag to your left or your right?", "It's to the right: Forward, Forward, Turn right, Forward, Forward."],
        palette: MOVE, maps: [[">..#", "##.#", "##G#"]], solution: "forward forward turn_right forward forward",
      },
      {
        id: "seq-3", title: "Zig and zag", world: "grid",
        brief: "A zig-zag path! Pip must step, turn, step, turn, like walking down a set of stairs.",
        concept: "Long programs are built from small, careful moves.",
        hints: ["Alternate: Forward, turn right, Forward, turn left…", "Run often. It's fine to test half a program."],
        palette: MOVE, maps: [[">.##", "#..#", "##.G"]], solution: "forward turn_right forward turn_left forward turn_right forward turn_left forward",
      },
      {
        id: "seq-4", title: "Shiny!", world: "grid",
        brief: "There's a gem on the path. Pip has to stop on it and use Collect before reaching the flag. You'll hear a chime when it works.",
        concept: "Actions happen where Pip is standing.",
        hints: ["Collect only works when Pip is on the gem's square.", "Forward, Forward, Collect, Forward, Forward."],
        palette: MOVE_C, maps: [[">.*.G"]], solution: "forward forward collect forward forward",
      },
      {
        id: "seq-5", title: "The U-turn", world: "grid",
        brief: "Grab the gem at the end of the top row, then head down and all the way back to the flag on the bottom row.",
        concept: "Plan the whole route before you build it.",
        hints: ["Two right turns point Pip back the way it came.", "Walk down two squares between the turns."],
        palette: MOVE_C, maps: [[">..*", "###.", "G..."]], solution: "forward forward forward collect turn_right forward forward turn_right forward forward forward",
      },
    ],
  },
  {
    id: "loops", n: 2, title: "Loops", tagline: "Say it once, do it many times.", color: "ochre", ages: "6+",
    concepts: ["Repeat", "Loop body", "Nested loops"],
    lessons: [
      {
        id: "loop-1", title: "The long hallway", world: "grid",
        brief: "This hallway is eight squares long. You could use eight Forward tiles… or one Repeat bracket. Put Forward between Repeat and End, and set the dial to 8.",
        concept: "A Repeat bracket runs everything between it and End several times.",
        hints: ["Repeat 8, Forward, End.", "Use the arrow keys or the dial to change the number on Repeat."],
        palette: ["forward", "repeat", "end"], maps: [[">.......G"]], solution: "repeat:8 forward end", require: ["repeat"],
      },
      {
        id: "loop-2", title: "Gem conveyor", world: "grid",
        brief: "Gems sit on every other square. Find the pattern that repeats and put it inside a loop.",
        concept: "Look for the pattern, then loop the pattern.",
        hints: ["The pattern is: step onto a gem, collect, step again.", "Repeat 4: Forward, Collect, Forward, End."],
        palette: [...MOVE_C, "repeat", "end"], maps: [[">*.*.*.*G"]], solution: "repeat:4 forward collect forward end", require: ["repeat"],
      },
      {
        id: "loop-3", title: "Staircase", world: "grid",
        brief: "Climb down the staircase. One step down is: Forward, turn right, Forward, turn left. How many steps are there?",
        concept: "Loops can hold several different tiles.",
        hints: ["Three full steps, then one last Forward.", "Repeat 3: Forward, Right, Forward, Left. End. Forward."],
        palette: [...MOVE, "repeat", "end"], maps: [[">.###", "#..##", "##..#", "###.G"]], solution: "repeat:3 forward turn_right forward turn_left end forward", require: ["repeat"],
      },
      {
        id: "loop-4", title: "Square dance", world: "grid",
        brief: "Pip has to walk the whole edge of the square, collecting a gem at each corner, and end up back where it started. Try a loop inside a loop!",
        concept: "A loop can live inside another loop.",
        hints: ["One side is four Forward steps. That's a loop by itself.", "Repeat 4: (Repeat 4: Forward, End), Collect, Turn right. End."],
        palette: [...MOVE_C, "repeat", "end"], maps: [["*...*", ".###.", ".###.", ".###.", "@...*"]], solution: "repeat:4 repeat:4 forward end collect turn_right end", require: ["repeat"],
      },
    ],
  },
  {
    id: "music", n: 3, title: "Sound & Music", tagline: "Code that you can hum.", color: "coral", ages: "5+",
    concepts: ["Notes and rhythm", "Loops in music", "Instruments"],
    lessons: [
      {
        id: "mus-1", title: "First note", world: "music",
        brief: "Pip's speaker can sing. Place one Play tile and set it to Do (the C note), then Run.",
        concept: "Every Play tile makes one sound.",
        hints: ["Press Listen to hear what you're aiming for.", "The Play tile starts on C. Just place it and run."],
        palette: ["play_note"], solution: "play_note:C4:1",
      },
      {
        id: "mus-2", title: "Three blind mice", world: "music",
        brief: "Play Mi, Re, Do: the opening of a very old nursery tune. The last note is held for two beats.",
        concept: "Order and length both matter in music.",
        hints: ["Mi is E, Re is D, Do is C.", "E for 1 beat, D for 1 beat, C for 2 beats."],
        palette: ["play_note"], solution: "play_note:E4:1 play_note:D4:1 play_note:C4:2",
      },
      {
        id: "mus-3", title: "Echo", world: "music",
        brief: "Play the Mi-Re-Do phrase twice with a rest between. Use a loop so you only build it once.",
        concept: "Loops work on sounds the same way they work on steps.",
        hints: ["Repeat 2: E, D, C (2 beats), Rest. End.", "A trailing rest at the end is fine."],
        palette: MUSIC, solution: "repeat:2 play_note:E4:1 play_note:D4:1 play_note:C4:2 rest:1 end", require: ["repeat"],
      },
      {
        id: "mus-4", title: "Hot cross buns", world: "music",
        brief: "The full song: Mi-Re-Do twice, then four quick Do's, four quick Re's, and Mi-Re-Do to finish.",
        concept: "Use several loops in one program.",
        hints: ["Quick notes are half-beat notes.", "Repeat 2 (E D C2), Repeat 4 (C ½), Repeat 4 (D ½), E D C2."],
        palette: MUSIC,
        solution: "repeat:2 play_note:E4:1 play_note:D4:1 play_note:C4:2 end repeat:4 play_note:C4:0.5 end repeat:4 play_note:D4:0.5 end play_note:E4:1 play_note:D4:1 play_note:C4:2",
        require: ["repeat"],
      },
      {
        id: "mus-5", title: "Beat maker", world: "music",
        brief: "Drums! Build one bar (kick, hat, snare, hat) and loop it four times.",
        concept: "Rhythm is a pattern on repeat.",
        hints: ["Inside the loop: Drum kick, Drum hat, Drum snare, Drum hat.", "Repeat 4 around the whole bar."],
        palette: ["drum", "repeat", "end"], solution: "repeat:4 drum:kick drum:hat drum:snare drum:hat end", require: ["repeat"],
      },
      {
        id: "mus-6", title: "Twinkle", world: "music",
        brief: "Choose any instrument, then play the first line of Twinkle Twinkle: Do Do Sol Sol La La Sol (long).",
        concept: "Instruments change the sound, not the notes.",
        hints: ["Notes: C C G G A A G, the last for two beats.", "Use Repeat 2 for each pair to save tiles."],
        palette: [...MUSIC, "instrument"],
        solution: "instrument:flute repeat:2 play_note:C4:1 end repeat:2 play_note:G4:1 end repeat:2 play_note:A4:1 end play_note:G4:2",
      },
    ],
  },
  {
    id: "conditionals", n: 4, title: "Decisions", tagline: "If this, then that.", color: "plum", ages: "7+",
    concepts: ["If", "If / Else", "Sensors"],
    lessons: [
      {
        id: "if-1", title: "Gem or no gem?", world: "grid",
        brief: "Gems appear in different places each time you run. Pip needs to check every square: if there's a gem, collect it.",
        concept: "If runs its tiles only when the answer is yes.",
        hints: ["Walk seven squares with a loop.", "Inside the loop: Forward, then If on a gem: Collect, End."],
        palette: [...MOVE_C, "repeat", "if", "end"],
        maps: [[">*.**.*G"], [">.**..*G"], [">**.*..G"]],
        solution: "repeat:7 forward if:on_gem collect end end", require: ["if"],
      },
      {
        id: "if-2", title: "Feel the wall", world: "grid",
        brief: "The corner is in a different place every run. Before each step, Pip should check: is there a wall ahead? If so, turn right.",
        concept: "Sensors let a program react to the world.",
        hints: ["Each map needs exactly five Forward steps.", "Repeat 5: If wall ahead: Turn right, End. Forward. End."],
        palette: [...MOVE, "repeat", "if", "end"],
        maps: [[">...", "###.", "###G"], [">.", "#.", "#.", "#.", "#G"], [">..", "##.", "##.", "##G"]],
        solution: "repeat:5 if:wall_ahead turn_right end forward end", require: ["if"],
      },
      {
        id: "if-3", title: "Left or right?", world: "grid",
        brief: "After three steps the path turns, sometimes up, sometimes down. Use If … Else to pick the right turn.",
        concept: "Else gives the program a second choice.",
        hints: ["If path to the right: Turn right. Else: Turn left. End.", "Then two more Forward steps."],
        palette: [...MOVE, "repeat", "if", "else", "end"],
        maps: [[">...", "###.", "###G"], ["###G", "###.", ">..."]],
        solution: "repeat:3 forward end if:path_right turn_right else turn_left end forward forward", require: ["else"],
      },
      {
        id: "if-4", title: "Lucky stairs", world: "grid",
        brief: "Back on the staircase, but now some steps hide gems, and they move every run.",
        concept: "Put a decision inside a loop.",
        hints: ["Check for a gem right after the first Forward of each step.", "Repeat 3: Forward, If on a gem (Collect), Right, Forward, Left. End. Forward."],
        palette: [...MOVE_C, "repeat", "if", "end"],
        maps: [[">*###", "#..##", "##.*#", "###.G"], [">.###", "#.*##", "##..#", "###.G"], [">*###", "#.*##", "##.*#", "###.G"]],
        solution: "repeat:3 forward if:on_gem collect end turn_right forward turn_left end forward", require: ["if"],
      },
    ],
  },
  {
    id: "smart-loops", n: 5, title: "Smart Loops", tagline: "Keep going until the job is done.", color: "ochre", ages: "8+",
    concepts: ["Repeat until", "While", "Algorithms"],
    lessons: [
      {
        id: "until-1", title: "How far is it?", world: "grid",
        brief: "The hallway is a different length every time. Instead of counting, tell Pip to repeat until it reaches the goal.",
        concept: "Repeat-until stops when a condition becomes true.",
        hints: ["Repeat until at the goal: Forward. End."],
        palette: ["forward", "repeat", "repeat_until", "end"],
        maps: [[">...G"], [">.......G"], [">.....G"]], solution: "repeat_until:at_goal forward end", require: ["repeat_until"],
      },
      {
        id: "until-2", title: "Gem tunnel", world: "grid",
        brief: "A tunnel of unknown length with gems scattered inside. Collect every one on the way to the flag.",
        concept: "Combine a smart loop with a decision.",
        hints: ["Until at goal: Forward, If on a gem: Collect, End. End."],
        palette: [...MOVE_C, "repeat_until", "if", "end"],
        maps: [[">*..**.G"], [">.*.*..*.G"], [">**G"]], solution: "repeat_until:at_goal forward if:on_gem collect end end", require: ["repeat_until", "if"],
      },
      {
        id: "until-3", title: "While the path is clear", world: "grid",
        brief: "Walk while the path ahead is clear, turn right, then do it again. The corridors change length.",
        concept: "While keeps going as long as something stays true.",
        hints: ["While path ahead: Forward. End. Turn right. While path ahead: Forward. End."],
        palette: [...MOVE, "while", "end"],
        maps: [[">...", "###.", "###G"], [">.....", "#####.", "#####.", "#####G"]],
        solution: "while:path_ahead forward end turn_right while:path_ahead forward end", require: ["while"],
      },
      {
        id: "until-4", title: "Maze runner", world: "grid",
        brief: "A real maze algorithm! Until Pip reaches the goal: go forward if you can; otherwise turn toward the open side. One program solves both mazes.",
        concept: "An algorithm is a plan that works on many problems.",
        hints: ["If path ahead: Forward. Else: (If path to the left: Turn left. Else: Turn right.)", "Wrap it all in Repeat until at the goal."],
        palette: [...MOVE, "repeat_until", "if", "else", "end"],
        maps: [[">..##", "##.##", "##..G"], ["G.##", "#.##", "#..<"]],
        solution: "repeat_until:at_goal if:path_ahead forward else if:path_left turn_left else turn_right end end end",
        require: ["repeat_until", "if", "else"],
      },
    ],
  },
  {
    id: "variables", n: 6, title: "Variables", tagline: "Boxes that remember.", color: "leaf", ages: "8+",
    concepts: ["Set and change", "Counting", "Comparisons"],
    lessons: [
      {
        id: "var-1", title: "Say hello", world: "voice",
        brief: "Meet the speaker. Use a Say tile to make it greet the class.",
        concept: "Output lets a program talk back.",
        hints: ["Place one Say tile. It already says Hello!"],
        palette: ["say"], solution: "say:Hello!",
      },
      {
        id: "var-2", title: "Count to five", world: "voice",
        brief: "Box A starts at zero. Five times: add one to A, then say A out loud. You should hear 1, 2, 3, 4, 5.",
        concept: "A variable is a named box that holds a number.",
        hints: ["Set A to 0. Repeat 5: Change A by 1, Say A. End."],
        palette: ["set_var", "change_var", "say_var", "repeat", "end"], solution: "set_var:A:0 repeat:5 change_var:A:1 say_var:A end", require: ["change_var"],
      },
      {
        id: "var-3", title: "Countdown", world: "voice",
        brief: "Ready for launch? Count down from 5 to 1, then say Blast off!",
        concept: "Variables can go down as well as up.",
        hints: ["Set A to 5. Repeat 5: Say A, Change A by −1. End. Say Blast off!"],
        palette: ["set_var", "change_var", "say_var", "say", "repeat", "end"], solution: "set_var:A:5 repeat:5 say_var:A change_var:A:-1 end say:Blast_off!",
      },
      {
        id: "var-4", title: "Skip counting", world: "voice",
        brief: "Count by twos all the way to ten: 2, 4, 6, 8, 10.",
        concept: "The change amount controls the pattern.",
        hints: ["Change A by 2 each round."],
        palette: ["set_var", "change_var", "say_var", "repeat", "end"], solution: "set_var:A:0 repeat:5 change_var:A:2 say_var:A end",
      },
      {
        id: "var-5", title: "Big or small", world: "voice",
        brief: "Count A from 1 to 6. Each time, say Small if A is 3 or less, and Big if it's more than 3.",
        concept: "Compare a variable to make a decision.",
        hints: ["Repeat 6: Change A by 1. If A > 3: Say Big. Else: Say Small. End. End."],
        palette: ["set_var", "change_var", "say", "if_compare", "else", "repeat", "end"],
        solution: "set_var:A:0 repeat:6 change_var:A:1 if_compare:A:>:3 say:Big else say:Small end end", require: ["if_compare"],
      },
      {
        id: "var-6", title: "FizzBuzz", world: "voice",
        brief: "The classic puzzle. Count from 1 to 15. Say Fizz for multiples of 3, Buzz for multiples of 5, FizzBuzz for multiples of both. Otherwise, say the number.",
        concept: "Order your decisions carefully: check the most specific case first.",
        hints: ["Check divisible by 15 first, then 3, then 5.", "Each check lives in the Else of the one before."],
        palette: ["set_var", "change_var", "say", "say_var", "if_divisible", "else", "repeat", "end"],
        solution:
          "repeat:15 change_var:A:1 if_divisible:A:15 say:FizzBuzz else if_divisible:A:3 say:Fizz else if_divisible:A:5 say:Buzz else say_var:A end end end end",
        require: ["if_divisible"],
      },
    ],
  },
  {
    id: "functions", n: 7, title: "Functions", tagline: "Teach Pip new words.", color: "rose", ages: "9+",
    concepts: ["Define", "Call", "Reuse"],
    lessons: [
      {
        id: "fn-1", title: "Turn around", world: "grid",
        brief: "Pip doesn't know how to turn around. Define a function called Spin that turns right twice, then use it to grab the gem behind Pip and reach the flag ahead.",
        concept: "A function gives a name to a group of tiles.",
        hints: ["Define Spin: Turn right, Turn right. End.", "Do Spin, walk to the gem, collect, Do Spin, then walk to the flag."],
        palette: [...MOVE_C, "repeat", "end", "define", "call"], maps: [["*.>...G"]],
        solution: "define:Spin turn_right turn_right end call:Spin forward forward collect call:Spin repeat:6 forward end", require: ["define", "call"],
      },
      {
        id: "fn-2", title: "Climb, climb, walk, climb", world: "grid",
        brief: "This hillside has two climbs, a flat stretch, then two more climbs. Define Climb once and reuse it.",
        concept: "Functions shine when a pattern shows up in different places.",
        hints: ["Climb is: Forward, Turn left, Forward, Turn right.", "Do Climb twice, Forward twice, Do Climb twice, Forward."],
        palette: [...MOVE, "repeat", "end", "define", "call"],
        maps: [["######.G", "#####..#", "##....##", "#..#####", ">.######"]],
        solution: "define:Climb forward turn_left forward turn_right end call:Climb call:Climb forward forward call:Climb call:Climb forward", require: ["define", "call"],
      },
      {
        id: "fn-3", title: "Songs have choruses", world: "music",
        brief: "Define the Mi-Re-Do phrase as Chorus. Then play: Chorus, Chorus, four quick Do's, four quick Re's, Chorus.",
        concept: "Songs and programs both reuse named parts.",
        hints: ["Define Chorus: E, D, C (2 beats). End.", "Then Do Chorus wherever the phrase appears."],
        palette: [...MUSIC, "define", "call"],
        solution:
          "define:Chorus play_note:E4:1 play_note:D4:1 play_note:C4:2 end call:Chorus call:Chorus repeat:4 play_note:C4:0.5 end repeat:4 play_note:D4:0.5 end call:Chorus",
        require: ["define", "call"],
      },
    ],
  },
  {
    id: "debugging", n: 8, title: "Debugging", tagline: "Every coder's superpower.", color: "sky", ages: "7+",
    concepts: ["Reading code", "Finding bugs", "Testing"],
    lessons: [
      {
        id: "bug-1", title: "Wrong way!", world: "grid",
        brief: "Someone built this program, but Pip walks into a wall. Press Run, listen to where it goes wrong, and fix one tile.",
        concept: "Bugs are normal. Run, listen, fix.",
        hints: ["Listen for the Bump. Which tile was playing?", "The turn goes the wrong way."],
        palette: MOVE, maps: [[">..#", "##.#", "##G#"]], starter: "forward forward turn_left forward forward", solution: "forward forward turn_right forward forward",
      },
      {
        id: "bug-2", title: "Not quite there", world: "grid",
        brief: "This loop stops two squares short of the flag. What number should it be?",
        concept: "Off-by-something bugs hide in loop counts.",
        hints: ["Count the squares again: there are eight."],
        palette: ["forward", "repeat", "end"], maps: [[">.......G"]], starter: "repeat:6 forward end", solution: "repeat:8 forward end",
      },
      {
        id: "bug-3", title: "The missing End", world: "grid",
        brief: "This program won't even start: the board says a bracket is never closed. Find where End should go.",
        concept: "Brackets always come in pairs.",
        hints: ["The pattern inside the loop is Forward, Collect, Forward.", "Put End after the last Forward."],
        palette: [...MOVE_C, "repeat", "end"], maps: [[">*.*.*.*G"]], starter: "repeat:4 forward collect forward", solution: "repeat:4 forward collect forward end",
      },
      {
        id: "bug-4", title: "Off-key", world: "music",
        brief: "Hot Cross Buns sounds wrong. Press Listen to hear the real tune, then find the sour note.",
        concept: "Compare what you expected with what happened.",
        hints: ["The first phrase is Mi, Re, Do.", "The second note of the phrase should be D, not F."],
        palette: MUSIC,
        starter: "repeat:2 play_note:E4:1 play_note:F4:1 play_note:C4:2 end",
        solution: "repeat:2 play_note:E4:1 play_note:D4:1 play_note:C4:2 end",
      },
      {
        id: "bug-5", title: "Too far", world: "voice",
        brief: "This countdown says zero before Blast off! Fix it so it goes 3, 2, 1, Blast off!",
        concept: "Check where a loop starts and stops.",
        hints: ["The loop runs one time too many."],
        palette: ["set_var", "change_var", "say_var", "say", "repeat", "end"],
        starter: "set_var:A:3 repeat:4 say_var:A change_var:A:-1 end say:Blast_off!",
        solution: "set_var:A:3 repeat:3 say_var:A change_var:A:-1 end say:Blast_off!",
      },
    ],
  },
  {
    id: "studio", n: 9, title: "Studio", tagline: "Make anything.", color: "coral", ages: "All",
    concepts: ["Creative projects", "Everything you've learned"],
    lessons: [
      {
        id: "studio-grid", title: "Gem garden", world: "grid", sandbox: true,
        brief: "A big open garden full of gems. No rules. Try to collect them all in as few tiles as you can, or just explore.",
        concept: "Use every block you know.",
        hints: ["Try a Repeat inside a Repeat to sweep row by row."],
        palette: [...MOVE_C, "repeat", "repeat_until", "while", "if", "else", "end", "define", "call", "say", "play_note"],
        maps: [["*.*.*.*", ".*.*.*.", "*.*.*.*", ".*.*.*.", ">.*.*.*"]], solution: "forward",
      },
      {
        id: "studio-music", title: "Music studio", world: "music", sandbox: true,
        brief: "Compose your own song. Mix instruments, drums, loops and functions.",
        concept: "Music is code you can hum.",
        hints: ["Make a Chorus function and use it three times."],
        palette: ["play_note", "rest", "drum", "instrument", "repeat", "end", "define", "call", "wait"], solution: "play_note:C4:1",
      },
      {
        id: "studio-voice", title: "Story machine", world: "voice", sandbox: true,
        brief: "Program the speaker to tell a story, run a quiz, or count anything you like.",
        concept: "Programs can talk, count and decide.",
        hints: ["Combine Say with variables and decisions."],
        palette: ["say", "say_var", "set_var", "change_var", "if_compare", "if_divisible", "else", "repeat", "end", "wait", "define", "call"], solution: "say:Hello!",
      },
    ],
  },
];

export const LESSONS: Lesson[] = UNITS.flatMap((u) => u.lessons);
export const lessonById = (id?: string) => LESSONS.find((l) => l.id === id);
export const unitOf = (id: string) => UNITS.find((u) => u.lessons.some((l) => l.id === id))!;
export const nextLesson = (id: string) => LESSONS[LESSONS.findIndex((l) => l.id === id) + 1];
