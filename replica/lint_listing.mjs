import fs from 'fs';

const LIMITS = {
  app_store: {
    name: 30,
    subtitle: 30,
    promotional_text: 170,
    description: 4000,
    keywords: 100,
    whats_new: 4000,
  },
  google_play: {
    title: 30,
    short_description: 80,
    full_description: 4000,
  },
};

const CLAIMS = /(#\s?1\b|\bnumber one\b|\bno\.? ?1\b|\bbest\b|\btop[- ]rated\b|\bfree\b|\bdiscount\b|\bsale\b)/i;
const STOP = new Set(['a', 'an', 'and', 'app', 'for', 'the', 'to', 'of', 'with', 'your', 'you', 'in', 'on', '&']);

const listing = JSON.parse(fs.readFileSync('replica/launch/listing.json', 'utf8'));
const avoid = (listing.avoid || []).map(a => a.toLowerCase());

let errors = 0;
let warnings = 0;

for (const [store, limits] of Object.entries(LIMITS)) {
  const storeData = listing[store];
  if (!storeData) continue;

  console.log(`\n--- Linting ${store} ---`);
  for (const [field, limit] of Object.entries(limits)) {
    const val = storeData[field] || '';
    const len = Array.from(val).length;

    if (!val) {
      console.warn(`[WARN] ${store}.${field} is empty`);
      warnings++;
      continue;
    }

    if (len > limit) {
      console.error(`[ERROR] ${store}.${field} is ${len} chars (limit: ${limit}, over by ${len - limit})`);
      errors++;
    } else {
      console.log(`[PASS] ${store}.${field}: ${len}/${limit} chars`);
    }

    // Check avoid names
    for (const name of avoid) {
      if (val.toLowerCase().includes(name)) {
        console.error(`[ERROR] ${store}.${field} contains forbidden avoid name: "${name}"`);
        errors++;
      }
    }

    // Check claims in short fields (name, subtitle, title, short_description)
    if (['name', 'subtitle', 'title', 'short_description'].includes(field)) {
      if (CLAIMS.test(val)) {
        console.warn(`[WARN] ${store}.${field} contains claim pattern that stores may flag: ${val.match(CLAIMS)[0]}`);
        warnings++;
      }
    }
  }
}

if (errors === 0) {
  console.log(`\nLISTING LINT PASSED: 0 errors, ${warnings} warnings.`);
  process.exit(0);
} else {
  console.error(`\nLISTING LINT FAILED: ${errors} errors found.`);
  process.exit(1);
}
