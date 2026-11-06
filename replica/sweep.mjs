import fs from 'fs';
import path from 'path';

const SKIP_DIRS = new Set([
  '.git', 'node_modules', '.next', 'dist', 'build', 'out',
  '.turbo', '.cache', 'coverage'
]);

const BINARY_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.woff', '.woff2', '.ttf'
]);

const configPath = 'replica/brand.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const avoidNames = config.avoid || [];
const avoidDomains = config.domains || [];

const regexes = [
  ...avoidNames.map(name => ({ type: 'name', label: name, rx: new RegExp(name.replace(/[-_ ]+/g, '[-_ ]?'), 'i') })),
  ...avoidDomains.map(d => ({ type: 'domain', label: d, rx: new RegExp(d.replace('.', '\\.'), 'i') }))
];

const hits = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      if (relPath.startsWith('replica')) continue; // skip replica planning folder
      walk(fullPath);
    } else {
      if (relPath.startsWith('replica')) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (BINARY_EXT.has(ext)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const { type, label, rx } of regexes) {
          if (rx.test(line)) {
            hits.push({
              file: relPath,
              line: i + 1,
              type,
              match: label,
              snippet: line.trim().substring(0, 80)
            });
          }
        }
      }
    }
  }
}

walk('.');

if (hits.length === 0) {
  console.log('CLEAN SWEEP: 0 references to original brand found in production codebase!');
  process.exit(0);
} else {
  console.error(`SWEEP FAILED: Found ${hits.length} references to original brand:`);
  hits.forEach(h => {
    console.error(`- ${h.file}:${h.line} [${h.type}: ${h.match}] -> ${h.snippet}`);
  });
  process.exit(1);
}
