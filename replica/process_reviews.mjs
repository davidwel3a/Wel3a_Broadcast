import fs from 'fs';

function parseCSV(content) {
  const lines = content.trim().split('\n').filter(l => l.trim().length > 0);
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
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
    if (row.url && row.text) rows.push(row);
  }
  return rows;
}

const raw = fs.readFileSync('replica/reviews.csv', 'utf8');
const reviews = parseCSV(raw);

const themes = [
  {
    id: 'anti_ban_rate_limits',
    label: 'Bot Bans & Unhandled Rate Limits (429/403)',
    kind: 'complaint',
    patterns: [/rate limit/i, /banned/i, /token/i, /403/i, /50007/i, /spam/i],
  },
  {
    id: 'closed_dms_handling',
    label: 'Closed DMs & Lack of Channel Fallback',
    kind: 'complaint',
    patterns: [/closed dms/i, /dms off/i, /fallback/i, /blocking the bot/i],
  },
  {
    id: 'visual_preview_builder',
    label: 'Message Visual Quality & Previews',
    kind: 'request',
    patterns: [/preview/i, /broken image/i, /embed/i, /unprofessional/i],
  },
  {
    id: 'smart_scheduling_targeting',
    label: 'Role-Based Filtering & Automated Scheduling',
    kind: 'request',
    patterns: [/schedule/i, /role/i, /targeting/i, /cooldown/i, /midnight/i],
  },
];

const ranked = themes.map(th => {
  const matches = [];
  reviews.forEach(r => {
    if (th.patterns.some(p => p.test(r.text))) {
      const rating = parseFloat(r.rating) || 3;
      const weight = rating <= 2 ? 1.0 : (rating === 3 ? 0.6 : 0.3);
      matches.push({ ...r, weight });
    }
  });

  const totalScore = matches.reduce((acc, m) => acc + m.weight, 0);
  const sources = new Set(matches.map(m => m.source)).size;
  return { ...th, matches, totalScore, sources };
}).sort((a, b) => b.totalScore - a.totalScore);

let md = '# Feedback Ranking: Discord Broadcast & Announcement Bots\n\n';
md += `Sample size: ${reviews.length} real public community discussions and user reviews.\n\n`;

ranked.forEach(th => {
  md += `## ${th.label} (${th.kind.toUpperCase()})\n`;
  md += `- **Score**: ${th.totalScore.toFixed(1)} (${th.matches.length} reviews across ${th.sources} sources)\n\n`;
  md += `### Real Quotes:\n`;
  th.matches.forEach(m => {
    md += `> "${m.text}"  \n> — [Source Thread](${m.url}) (Rating: ${m.rating}★, Date: ${m.date})\n\n`;
  });
});

fs.writeFileSync('replica/feedback.md', md);
console.log('Generated replica/feedback.md successfully.');
