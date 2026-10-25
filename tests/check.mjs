// Checks the decks and figures: counts, shapes, and that the page's scripts load.
import { readFileSync } from 'node:fs';
const load = (f, name) => new Function(readFileSync(new URL(`../dist/${f}`, import.meta.url), 'utf8') + `;return ${name}`)();
const DECKS = load('decks.js', 'DECKS'), FIGURES = load('figures.js', 'FIGURES');
const fail = m => { console.error('FAIL', m); process.exitCode = 1; };
const want = ['stance', 'form', 'move', 'twist', 'constraint', 'strategy'];
for (const k of want) {
  const d = DECKS[k];
  if (!d) { fail(`missing deck ${k}`); continue; }
  if (!d.cards.length) fail(`${k} is empty`);
  const seen = new Set();
  for (const c of d.cards) {
    if (!Array.isArray(c) || c.length !== 2 || typeof c[0] !== 'string' || typeof c[1] !== 'string' || !c[0]) fail(`${k}: bad card ${JSON.stringify(c)}`);
    if (seen.has(c[0])) fail(`${k}: duplicate "${c[0]}"`);
    seen.add(c[0]);
  }
}
if (FIGURES.length !== 32) fail(`expected 32 figures, got ${FIGURES.length}`);
for (const f of FIGURES) if (f.length !== 2 || !f[0] || !f[1]) fail(`bad figure ${JSON.stringify(f)}`);
const total = want.reduce((a, k) => a + DECKS[k].cards.length, 0);
console.log(`ok: ${total} cards, ${FIGURES.length} figures`);
