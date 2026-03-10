import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { bold, cyan, dim, gold, green, red, yellow } from './colors.js';
import { confirm, pressEnter, ask } from './prompts.js';
import { createSpinner } from './spinner.js';
import { openUrl } from './utils.js';

function checkCommand(cmd, args) {
  try {
    const result = execFileSync(cmd, args, { encoding: 'utf-8', timeout: 10000 }).trim();
    return result;
  } catch {
    return null;
  }
}

export async function runBuild() {
  console.log();
  console.log(`  ${bold('Build from Source')}`);
  console.log(`  ${dim('For developers who want to build or contribute')}`);
  console.log();
  console.log(`  ${bold('Checking prerequisites...')}`);
  console.log();

  // Check Node
  const nodeVersion = checkCommand('node', ['--version']);
  if (nodeVersion) {
    const major = parseInt(nodeVersion.replace('v', ''), 10);
    if (major >= 18) {
      console.log(`  ${green('✓')} Node.js ${nodeVersion}`);
    } else {
      console.log(`  ${red('✗')} Node.js ${nodeVersion} ${yellow('(need v18+)')}`);
      console.log(`    Update at: ${cyan('https://nodejs.org')}`);
    }
  } else {
    console.log(`  ${red('✗')} Node.js not found`);
    console.log(`    Install from: ${cyan('https://nodejs.org')}`);
  }

  // Check pnpm
  const pnpmVersion = checkCommand('pnpm', ['--version']);
  if (pnpmVersion) {
    console.log(`  ${green('✓')} pnpm ${pnpmVersion}`);
  } else {
    console.log(`  ${yellow('✗')} pnpm not found`);
    console.log(`    Install with: ${cyan('npm install -g pnpm')}`);
  }

  // Check Rust
  const rustVersion = checkCommand('rustc', ['--version']);
  if (rustVersion) {
    console.log(`  ${green('✓')} ${rustVersion}`);
  } else {
    console.log(`  ${red('✗')} Rust not found`);
    console.log(`    Install from: ${cyan('https://rustup.rs')}`);
    if (await confirm('\n  Open rustup.rs in your browser?')) {
      await openUrl('https://rustup.rs');
    }
  }

  // Check Cargo
  const cargoVersion = checkCommand('cargo', ['--version']);
  if (cargoVersion) {
    console.log(`  ${green('✓')} ${cargoVersion}`);
  } else if (rustVersion) {
    console.log(`  ${yellow('✗')} cargo not found (should come with Rust)`);
  }

  // Check git
  const gitVersion = checkCommand('git', ['--version']);
  if (gitVersion) {
    console.log(`  ${green('✓')} ${gitVersion}`);
  } else {
    console.log(`  ${red('✗')} git not found`);
    console.log(`    Install from: ${cyan('https://git-scm.com')}`);
  }

  // Linux-specific packages
  const { platform } = await import('os');
  if (platform() === 'linux') {
    console.log();
    console.log(`  ${bold('Linux system packages needed:')}`);
    console.log(`  ${cyan('sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf')}`);
  }

  const allGood = nodeVersion && pnpmVersion && rustVersion && cargoVersion && gitVersion;

  if (!allGood) {
    console.log();
    console.log(`  ${yellow('Some prerequisites are missing.')} Install them first, then run verse-forge again.`);
    console.log();
    await pressEnter();
    return;
  }

  console.log();
  console.log(`  ${green('All prerequisites found!')}`);
  console.log();

  // Clone
  const targetDir = await ask(`  ${bold('Where to clone?')} ${dim('(default: ./bible-applied)')} `);
  const cloneDir = targetDir || 'bible-applied';

  if (existsSync(cloneDir)) {
    console.log(`  ${dim(`Directory ${cloneDir} already exists — skipping clone.`)}`);
  } else {
    if (await confirm(`  Clone the repository to ${cyan(cloneDir)}?`)) {
      console.log();
      const spinner = createSpinner('Cloning repository...');
      spinner.start();
      try {
        execFileSync('git', ['clone', 'https://github.com/JonDipilato/bible-applied.git', cloneDir], {
          stdio: 'pipe',
          timeout: 120000
        });
        spinner.stop('Repository cloned');
      } catch (err) {
        spinner.fail('Clone failed');
        console.log(`  ${dim('Try manually: git clone https://github.com/JonDipilato/bible-applied.git')}`);
        await pressEnter();
        return;
      }
    } else {
      return;
    }
  }

  // Install deps
  const appDir = join(cloneDir, 'app');
  console.log();
  if (await confirm('  Install dependencies?')) {
    const spinner = createSpinner('Installing dependencies...');
    spinner.start();
    try {
      execFileSync('pnpm', ['install'], {
        cwd: appDir,
        stdio: 'pipe',
        timeout: 300000
      });
      spinner.stop('Dependencies installed');
    } catch {
      spinner.fail('Install failed');
      console.log(`  ${dim(`Try manually: cd ${appDir} && pnpm install`)}`);
      await pressEnter();
      return;
    }
  }

  // Dev or Build?
  console.log();
  console.log(`  ${bold('What next?')}`);
  console.log();
  console.log(`  ${gold('1.')} Start development mode ${dim('(hot reload, debugging)')}`);
  console.log(`  ${gold('2.')} Build production installer ${dim('(creates .msi/.dmg/.deb)')}`);
  console.log(`  ${gold('3.')} Done for now`);
  console.log();

  const choice = await ask(`  ${cyan('>')} `);

  if (choice === '1') {
    console.log();
    console.log(`  ${bold('Starting dev mode...')}`);
    console.log(`  ${dim('This will open the app with hot reload. Press Ctrl+C to stop.')}`);
    console.log();
    try {
      execFileSync('pnpm', ['tauri', 'dev'], { cwd: appDir, stdio: 'inherit' });
    } catch {
      // Ctrl+C exits here, that's fine
    }
  } else if (choice === '2') {
    console.log();
    const spinner = createSpinner('Building production installer (this takes a few minutes)...');
    spinner.start();
    try {
      execFileSync('pnpm', ['tauri', 'build'], { cwd: appDir, stdio: 'pipe', timeout: 600000 });
      spinner.stop('Build complete!');
      console.log(`  ${bold('Installers at:')} ${cyan(join(appDir, 'src-tauri', 'target', 'release', 'bundle'))}`);
    } catch {
      spinner.fail('Build failed');
      console.log(`  ${dim(`Try manually: cd ${appDir} && pnpm tauri build`)}`);
    }
  }

  console.log();
  await pressEnter();
}
