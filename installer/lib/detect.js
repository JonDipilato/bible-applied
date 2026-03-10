import { platform, arch, release } from 'os';

export function detectPlatform() {
  const os = platform();
  const cpu = arch();

  if (os === 'win32') {
    return {
      os: 'windows',
      arch: cpu === 'arm64' ? 'arm64' : 'x64',
      label: `Windows ${cpu === 'arm64' ? 'ARM64' : 'x64'}`,
      assetPatterns: [
        { ext: '.msi', keyword: null, preferred: true },
        { ext: '.exe', keyword: 'setup', preferred: false }
      ]
    };
  }

  if (os === 'darwin') {
    const isArm = cpu === 'arm64';
    return {
      os: 'macos',
      arch: isArm ? 'arm64' : 'x64',
      label: `macOS ${isArm ? 'Apple Silicon' : 'Intel'}`,
      assetPatterns: [
        { ext: '.dmg', keyword: isArm ? 'aarch64' : 'x64', preferred: true }
      ]
    };
  }

  // Linux
  return {
    os: 'linux',
    arch: cpu === 'arm64' ? 'arm64' : 'x64',
    label: `Linux ${cpu === 'arm64' ? 'ARM64' : 'x64'}`,
    assetPatterns: [
      { ext: '.deb', keyword: null, preferred: true },
      { ext: '.AppImage', keyword: null, preferred: false }
    ]
  };
}

export function matchAsset(assets, patterns) {
  for (const pattern of patterns) {
    const match = assets.find((a) => {
      const name = a.name.toLowerCase();
      const matchesExt = name.endsWith(pattern.ext.toLowerCase());
      const matchesKeyword = !pattern.keyword || name.includes(pattern.keyword.toLowerCase());
      return matchesExt && matchesKeyword;
    });
    if (match) return match;
  }
  return null;
}
