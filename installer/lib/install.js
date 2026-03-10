import { createWriteStream } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { mkdirSync, existsSync, chmodSync } from 'fs';
import https from 'https';
import { execFile, execFileSync } from 'child_process';
import { detectPlatform, matchAsset } from './detect.js';
import { getLatestRelease } from './github.js';
import { createSpinner } from './spinner.js';
import { formatBytes, openUrl } from './utils.js';
import { bold, cyan, dim, gold, green, red, yellow } from './colors.js';
import { confirm, pressEnter } from './prompts.js';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const follow = (targetUrl) => {
      https.get(targetUrl, { headers: { 'User-Agent': 'verse-forge-cli' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          follow(res.headers.location);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Download failed with status ${res.statusCode}`));
          return;
        }

        const total = parseInt(res.headers['content-length'] || '0', 10);
        let downloaded = 0;
        const file = createWriteStream(dest);
        const spinner = createSpinner('Downloading...');
        spinner.start();

        res.on('data', (chunk) => {
          downloaded += chunk.length;
          if (total > 0) {
            const pct = Math.round((downloaded / total) * 100);
            spinner.update(`Downloading... ${pct}% (${formatBytes(downloaded)} / ${formatBytes(total)})`);
          } else {
            spinner.update(`Downloading... ${formatBytes(downloaded)}`);
          }
        });

        res.pipe(file);

        file.on('finish', () => {
          file.close();
          spinner.stop(`Downloaded ${formatBytes(downloaded)}`);
          resolve(dest);
        });

        file.on('error', (err) => {
          spinner.fail('Download failed');
          reject(err);
        });
      }).on('error', reject);
    };

    follow(url);
  });
}

export async function runInstall() {
  const platform = detectPlatform();

  console.log();
  console.log(`  ${bold('Install Bible Verse Hunter')}`);
  console.log(`  ${dim(`Detected: ${platform.label}`)}`);
  console.log();

  const release = await getLatestRelease();

  if (!release) {
    console.log();
    console.log(`  No published releases available yet.`);
    console.log(`  Try ${gold('"Build from source"')} from the main menu instead.`);
    console.log(`  Or check: ${cyan('https://github.com/JonDipilato/bible-applied/releases')}`);
    console.log();
    await pressEnter();
    return;
  }

  const asset = matchAsset(release.assets, platform.assetPatterns);

  if (!asset) {
    console.log();
    console.log(`  ${yellow('No installer found for your platform.')} `);
    console.log(`  Available downloads at: ${cyan(release.url)}`);
    console.log();

    if (await confirm('  Open the releases page in your browser?')) {
      await openUrl(release.url);
    }
    await pressEnter();
    return;
  }

  console.log(`  ${bold('Ready to download:')}`);
  console.log(`  ${cyan(asset.name)} (${formatBytes(asset.size)})`);
  console.log(`  Version: ${green(release.version)}`);
  console.log();

  if (!(await confirm('  Download now?'))) {
    return;
  }

  console.log();

  // Download to temp directory
  const downloadDir = join(tmpdir(), 'verse-forge');
  if (!existsSync(downloadDir)) {
    mkdirSync(downloadDir, { recursive: true });
  }

  const filePath = join(downloadDir, asset.name);

  try {
    await downloadFile(asset.downloadUrl, filePath);
  } catch (err) {
    console.log(`  ${red('Download failed:')} ${err.message}`);
    await pressEnter();
    return;
  }

  console.log();

  // Platform-specific install guidance
  if (platform.os === 'windows') {
    console.log(`  ${bold(green('Opening the installer...'))}`);
    console.log(`  Follow the prompts to complete installation.`);
    console.log(`  The app will appear in your Start Menu when done.`);
    execFile('cmd', ['/c', 'start', '', filePath]);
  } else if (platform.os === 'macos') {
    console.log(`  ${bold(green('Opening the disk image...'))}`);
    console.log(`  Drag Bible Verse Hunter to your Applications folder.`);
    execFile('open', [filePath]);
  } else if (asset.name.endsWith('.deb')) {
    console.log(`  ${bold('Install with:')} sudo dpkg -i ${filePath}`);
    console.log();
    if (await confirm('  Run the install command now? (requires sudo)')) {
      try {
        execFileSync('sudo', ['dpkg', '-i', filePath], { stdio: 'inherit' });
        console.log();
        console.log(`  ${green(bold('Installed successfully!'))}`);
      } catch {
        console.log(`  ${yellow('Install may have failed. Try running the command manually.')}`);
      }
    }
  } else {
    // AppImage
    chmodSync(filePath, '755');
    console.log(`  ${bold(green('AppImage ready!'))}`);
    console.log(`  Run it with: ${cyan(filePath)}`);
  }

  console.log();
  console.log(`  ${dim('Tip: Choose "Set up AI provider" from the menu to enable AI features.')}`);
  console.log();
  await pressEnter();
}
