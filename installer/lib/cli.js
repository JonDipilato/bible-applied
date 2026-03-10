import { showWelcome } from './welcome.js';
import { select, closePrompts } from './prompts.js';
import { runInstall } from './install.js';
import { runAiSetup } from './ai-setup.js';
import { runTutorial } from './tutorial.js';
import { runBuild } from './build.js';
import { bold, dim, gold, cyan } from './colors.js';

export async function main() {
  await showWelcome();

  let running = true;

  while (running) {
    const choice = await select('What would you like to do?', [
      { label: `Install Bible Verse Hunter  ${dim('— download the app')}`, value: 'install' },
      { label: `Set up AI provider          ${dim('— enable AI features')}`, value: 'ai' },
      { label: `Learn the app               ${dim('— feature walkthrough')}`, value: 'tutorial' },
      { label: `Build from source            ${dim('— for developers')}`, value: 'build' },
      { label: `Exit`, value: 'exit' }
    ]);

    switch (choice) {
      case 'install':
        await runInstall();
        break;
      case 'ai':
        await runAiSetup();
        break;
      case 'tutorial':
        await runTutorial();
        break;
      case 'build':
        await runBuild();
        break;
      case 'exit':
        running = false;
        console.log();
        console.log(`  ${gold('God bless!')} ${dim('— https://github.com/JonDipilato/bible-applied')}`);
        console.log();
        closePrompts();
        break;
    }
  }
}
