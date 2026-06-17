import * as fs from 'fs';

const filePath = 'src/components/BattleArena.tsx';
const content = fs.readFileSync(filePath, 'utf8');

let count = 0;
for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') count++;
  if (content[i] === '}') count--;
}

console.log(`Brace balance (opens minus closes): ${count}`);
if (count > 0) {
  console.log(`Need to add ${count} closing braces!`);
} else if (count < 0) {
  console.log(`Need to add ${-count} opening braces!`);
} else {
  console.log('Braces are balanced!');
}
