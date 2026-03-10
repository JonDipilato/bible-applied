import { createSpinner } from './spinner.js';

const REPO = 'JonDipilato/bible-applied';
const API_URL = `https://api.github.com/repos/${REPO}/releases`;

export async function getLatestRelease() {
  const spinner = createSpinner('Checking for latest release...');
  spinner.start();

  try {
    const res = await fetch(API_URL, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'verse-forge-cli'
      }
    });

    if (!res.ok) {
      spinner.fail('Could not reach GitHub releases');
      return null;
    }

    const releases = await res.json();

    // Find the first published (non-draft) release
    const release = releases.find((r) => !r.draft);

    if (!release) {
      spinner.fail('No published releases found yet');
      return null;
    }

    spinner.stop(`Found release ${release.tag_name}`);

    return {
      version: release.tag_name,
      name: release.name,
      url: release.html_url,
      assets: release.assets.map((a) => ({
        name: a.name,
        size: a.size,
        downloadUrl: a.browser_download_url
      }))
    };
  } catch (err) {
    spinner.fail('Network error — check your internet connection');
    return null;
  }
}

export async function getLatestVersion() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'verse-forge-cli'
      }
    });

    if (!res.ok) return null;

    const releases = await res.json();
    const release = releases.find((r) => !r.draft);
    return release ? release.tag_name : null;
  } catch {
    return null;
  }
}
