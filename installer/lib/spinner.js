import { cyan, dim } from './colors.js';

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function createSpinner(message) {
  let i = 0;
  let interval = null;
  let currentMessage = message;

  return {
    start() {
      interval = setInterval(() => {
        const frame = cyan(frames[i++ % frames.length]);
        process.stdout.write(`\r  ${frame} ${currentMessage}  `);
      }, 80);
    },

    update(msg) {
      currentMessage = msg;
    },

    stop(finalMessage) {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      process.stdout.write(`\r  ${cyan('✓')} ${finalMessage || currentMessage}  \n`);
    },

    fail(errorMessage) {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      process.stdout.write(`\r  ${dim('✗')} ${errorMessage || currentMessage}  \n`);
    }
  };
}
