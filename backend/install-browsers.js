/**
 * Playwright Cross-Platform Browser Installer
 * 
 * Sets the browser download destination folder to a location within the project
 * so that Render captures and persists the Chromium binaries in the final deployment container.
 */

const { execSync } = require('child_process');
const path = require('path');

// Set browsers path to a local project folder 'ms-playwright'
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(__dirname, 'ms-playwright');

console.log(`[Playwright Installer]: Target directory set to: ${process.env.PLAYWRIGHT_BROWSERS_PATH}`);
console.log('[Playwright Installer]: Executing npx playwright install chromium...');

try {
  execSync('npx playwright install chromium', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('[Playwright Installer]: Chromium installed successfully.');
} catch (error) {
  console.error('[Playwright Installer Error]: Playwright installation crashed:', error.message);
  process.exit(1);
}
