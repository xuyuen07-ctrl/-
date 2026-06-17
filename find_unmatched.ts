import * as fs from 'fs';

const filePath = 'src/components/BattleArena.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const stack: { char: string; line: number; text: string }[] = [];

for (let i = 0; i < lines.length; i++) {
  const lineText = lines[i];
  for (let j = 0; j < lineText.length; j++) {
    const char = lineText[j];
    if (char === '{') {
      stack.push({ char, line: i + 1, text: lineText.trim() });
    } else if (char === '}') {
      if (stack.length > 0) {
        stack.pop();
      }
    }
  }
  
  if (i + 1 === 6000) {
    console.log(`Stack at line 6000 (${stack.length} open):`);
    for (let k = 0; k < stack.length; k++) {
      console.log(`Open scope #${k + 1} from line ${stack[k].line}: ${stack[k].text}`);
    }
    break;
  }
}
