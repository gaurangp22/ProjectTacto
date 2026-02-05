import { BLOCKS, BlockType } from '../../data/playground/blockTypes';
import { ProgramBlock } from './interpreter';

export const generateCode = (program: ProgramBlock[], language: 'python' | 'javascript' = 'python'): string => {
    if (!program.length) return '# No blocks yet';

    let code = '';
    let indentLevel = 0;

    const getIndent = () => '  '.repeat(indentLevel);

    program.forEach((block) => {
        const def = BLOCKS[block.type as BlockType];
        const val = block.value;

        // Handle indentation closing
        if (def.isContainerEnd || block.type === 'LOOP_END' || block.type === 'END_IF') {
            indentLevel = Math.max(0, indentLevel - 1);
            if (language === 'javascript') {
                code += `${getIndent()}}\n`;
            }
            return;
        }

        if (block.type === 'ELSE') {
            // HACK: Else usually involves un-indenting, printing else, then re-indenting
            indentLevel = Math.max(0, indentLevel - 1);
            if (language === 'python') {
                code += `${getIndent()}else:\n`;
            } else {
                code += `${getIndent()}} else {\n`;
            }
            indentLevel++;
            return;
        }

        // Generate line
        code += getIndent();

        switch (block.type) {
            case 'EVENT_START':
                code += language === 'python' ? 'def main():\n' : 'function main() {\n';
                indentLevel++;
                break;

            case 'SAY':
                code += language === 'python' ? `print("${val}")` : `console.log("${val}");`;
                break;

            case 'REPEAT':
                code += language === 'python' ? `for i in range(${val}):` : `for (let i = 0; i < ${val}; i++) {`;
                indentLevel++;
                break;

            case 'FOREVER':
                code += language === 'python' ? 'while True:' : 'while (true) {';
                indentLevel++;
                break;

            case 'IF':
                // Simplified conditional logic
                code += language === 'python' ? 'if condition:' : 'if (condition) {';
                indentLevel++;
                break;

            case 'WAIT':
                code += language === 'python' ? `time.sleep(${val})` : `await wait(${val});`;
                break;

            // Sound
            case 'NOTE_C': case 'NOTE_D': case 'NOTE_E': case 'NOTE_F': case 'NOTE_G': case 'NOTE_A': case 'NOTE_B':
            case 'CHORD_C': case 'CHORD_G': case 'CHORD_F':
                code += language === 'python' ? `play_sound("${def.label}")` : `playSound("${def.label}");`;
                break;

            case 'DRUM':
                code += language === 'python' ? 'play_drum()' : 'playDrum();';
                break;

            // Variables
            case 'VAR_SET':
                code += language === 'python' ? `my_var = ${val}` : `let myVar = ${val};`;
                break;

            case 'VAR_CHANGE':
                code += language === 'python' ? `my_var += ${val}` : `myVar += ${val};`;
                break;

            case 'VAR_SHOW':
                code += language === 'python' ? 'print(my_var)' : 'console.log(myVar);';
                break;

            default:
                code += `# ${def.label}`;
        }

        code += '\n';
    });

    return code;
};
