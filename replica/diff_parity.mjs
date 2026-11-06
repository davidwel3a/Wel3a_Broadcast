import fs from 'fs';

function parseCSV(content) {
  const lines = content.trim().split('\n').filter(l => l.trim().length > 0);
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    // Basic CSV splitting handling commas
    const parts = [];
    let cur = '';
    let inQuotes = false;
    for (let c of lines[i]) {
      if (c === '"') inQuotes = !inQuotes;
      else if (c === ',' && !inQuotes) {
        parts.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    parts.push(cur.trim());

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = parts[idx] ? parts[idx].replace(/^"|"$/g, '').trim() : '';
    });
    rows.push(row);
  }
  return rows;
}

const WEIGHT = { must: 3, should: 2, could: 1, p0: 3, p1: 2, p2: 1 };
const CREDIT = { yes: 1.0, done: 1.0, partial: 0.5, no: 0.0, '': 0.0, todo: 0.0 };

const raw = fs.readFileSync('replica/features.csv', 'utf8');
const rows = parseCSV(raw);

const counted = [];
const skipped = [];
const extras = [];

for (const r of rows) {
  const original = (r.original || 'yes').toLowerCase();
  const clone = (r.clone || '').toLowerCase();
  const prio = (r.priority || 'could').toLowerCase();

  if (['no', 'false'].includes(original)) {
    extras.push(r);
    continue;
  }
  if (clone === 'skip') {
    skipped.push(r);
    continue;
  }

  const w = WEIGHT[prio] || 1;
  const c = CREDIT[clone] ?? 0.0;
  counted.push({ ...r, weight: w, credit: c });
}

const totalWeight = counted.reduce((sum, r) => sum + r.weight, 0);
const earnedWeight = counted.reduce((sum, r) => sum + r.weight * r.credit, 0);
const score = totalWeight ? (100.0 * earnedWeight / totalWeight) : 0;

const musts = counted.filter(r => r.weight === 3);
const mustDone = musts.filter(r => r.credit === 1.0).length;
const mustTotal = musts.length;

// Area scores
const areas = {};
for (const r of counted) {
  const a = r.area || '(no area)';
  if (!areas[a]) areas[a] = { earned: 0, total: 0, count: 0 };
  areas[a].earned += r.weight * r.credit;
  areas[a].total += r.weight;
  areas[a].count += 1;
}

const byArea = Object.entries(areas).map(([a, d]) => ({
  area: a,
  score: d.total ? (100.0 * d.earned / d.total) : 0,
  features: d.count
})).sort((a, b) => a.score - b.score);

console.log(`Parity Score: ${score.toFixed(1)} / 100`);
console.log(`Must-haves done: ${mustDone} / ${mustTotal}`);
console.log('\nBy Area:');
byArea.forEach(a => {
  console.log(`- ${a.area.padEnd(20)}: ${a.score.toFixed(1)}% (${a.features} features)`);
});

const missing = counted.filter(r => r.credit < 1.0);
console.log(`\nMissing / Partial Features (${missing.length}):`);
missing.forEach(m => {
  console.log(`- [${m.priority}] ${m.area}: ${m.feature} (${m.clone})`);
});
