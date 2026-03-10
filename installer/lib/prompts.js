import { createInterface } from 'readline';
import { bold, cyan, dim, gold } from './colors.js';

// Single persistent readline — no create/destroy per question
let rl = null;

function getRL() {
  if (!rl) {
    rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.on('close', () => {
      // User pressed Ctrl+C or Ctrl+D
      console.log('\n');
      process.exit(0);
    });
  }
  return rl;
}

export function ask(question) {
  return new Promise((resolve) => {
    getRL().question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

export async function confirm(question) {
  const answer = await ask(`${question} ${dim('[Y/n]')} `);
  return answer === '' || answer.toLowerCase().startsWith('y');
}

export async function select(label, options) {
  console.log();
  console.log(`  ${bold(label)}`);
  console.log();

  for (let i = 0; i < options.length; i++) {
    const num = gold(`  ${i + 1}.`);
    console.log(`${num} ${options[i].label}`);
  }

  console.log();

  while (true) {
    const answer = await ask(`  ${cyan('>')} `);
    const num = parseInt(answer, 10);

    if (num >= 1 && num <= options.length) {
      return options[num - 1].value;
    }

    console.log(dim(`  Enter a number from 1 to ${options.length}`));
  }
}

export async function pressEnter(message = 'Press Enter to continue...') {
  await ask(`  ${dim(message)} `);
}

export function closePrompts() {
  if (rl) {
    rl.close();
    rl = null;
  }
}
