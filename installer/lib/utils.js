import { execFile } from 'child_process';
import { platform } from 'os';

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function openUrl(url) {
  const os = platform();
  let cmd, args;

  if (os === 'win32') {
    cmd = 'cmd';
    args = ['/c', 'start', '', url];
  } else if (os === 'darwin') {
    cmd = 'open';
    args = [url];
  } else {
    cmd = 'xdg-open';
    args = [url];
  }

  return new Promise((resolve) => {
    execFile(cmd, args, (err) => resolve(!err));
  });
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clearScreen() {
  process.stdout.write('\x1b[2J\x1b[H');
}
