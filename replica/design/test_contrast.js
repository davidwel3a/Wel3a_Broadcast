function parseHex(hex) {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16)
  ];
}

function luminance([r, g, b]) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function ratio(hex1, hex2) {
  const l1 = luminance(parseHex(hex1));
  const l2 = luminance(parseHex(hex2));
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

const colors = {
  "bg": "#0a0a1a",
  "surface": "#0f0f2a",
  "surface-hover": "#141437",
  "border": "#2e2554",
  "border-input": "#6b5ca5",
  "text": "#f3f0fa",
  "text-muted": "#b5acd5",
  "accent": "#7c3aed",
  "accent-hover": "#6d28d9",
  "on-accent": "#ffffff",
  "danger": "#f87171",
  "success": "#4ade80",
  "warning": "#fbbf24",
  "discord": "#5865f2"
};

const pairs = [
  ["text", "bg"],
  ["text", "surface"],
  ["text-muted", "bg"],
  ["text-muted", "surface"],
  ["on-accent", "accent"],
  ["accent", "bg", "large"],
  ["danger", "bg"],
  ["success", "bg"],
  ["warning", "bg"],
  ["on-accent", "discord"],
  ["border-input", "bg", "ui"],
  ["border-input", "surface", "ui"]
];

let allPass = true;
pairs.forEach(([fg, bg, size = "normal"]) => {
  const r = ratio(colors[fg], colors[bg]);
  const req = size === 'ui' ? 3.0 : (size === 'large' ? 3.0 : 4.5);
  const pass = r >= req;
  if (!pass) allPass = false;
  console.log(`${pass ? 'PASS' : 'FAIL'} [${(pass ? (r >= 7.0 ? 'AAA' : 'AA') : 'FAIL')}] ${r.toFixed(2)}:1  ${fg} on ${bg} (${size})`);
});

if (allPass) console.log("\nAll pairs PASS WCAG AA / AAA!");
else console.log("\nSome pairs FAILED!");
