#!/usr/bin/env node

import { main } from '../lib/cli.js';

main().catch((err) => {
  if (err.code === 'ERR_USE_AFTER_CLOSE' || err.message?.includes('readline')) {
    // User pressed Ctrl+C, exit gracefully
    process.exit(0);
  }
  console.error('\n  Something went wrong:', err.message);
  console.error('  Report issues at: https://github.com/JonDipilato/bible-applied/issues\n');
  process.exit(1);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n');
  process.exit(0);
});
