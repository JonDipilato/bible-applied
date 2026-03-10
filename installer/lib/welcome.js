import { bold, cyan, dim, gold, green } from './colors.js';
import { getLatestVersion } from './github.js';
import { detectPlatform } from './detect.js';

const banner = `
  ${gold('╔══════════════════════════════════════════════════════╗')}
  ${gold('║')}                                                      ${gold('║')}
  ${gold('║')}    ${bold(gold('╦  ╦╔═╗╦═╗╔═╗╔═╗  ╔═╗╔═╗╦═╗╔═╗╔═╗'))}           ${gold('║')}
  ${gold('║')}    ${bold(gold('╚╗╔╝║╣ ╠╦╝╚═╗║╣   ╠╣ ║ ║╠╦╝║ ╦║╣'))}            ${gold('║')}
  ${gold('║')}    ${bold(gold(' ╚╝ ╚═╝╩╚═╚═╝╚═╝  ╚  ╚═╝╩╚═╚═╝╚═╝'))}           ${gold('║')}
  ${gold('║')}                                                      ${gold('║')}
  ${gold('║')}    ${dim('Bible Verse Hunter')}                                ${gold('║')}
  ${gold('║')}    ${cyan('Find wisdom. Apply truth. Transform your life.')}    ${gold('║')}
  ${gold('║')}                                                      ${gold('║')}
  ${gold('╚══════════════════════════════════════════════════════╝')}`;

export async function showWelcome() {
  if (process.stdout.isTTY) console.clear();
  console.log(banner);
  console.log();

  const platform = detectPlatform();
  const version = await getLatestVersion();

  const info = [
    `  ${dim('Platform:')} ${platform.label}`
  ];

  if (version) {
    info.push(`  ${dim('Latest release:')} ${green(version)}`);
  } else {
    info.push(`  ${dim('Latest release:')} ${dim('checking releases...')}`);
  }

  console.log(info.join('   '));
  console.log();
}
