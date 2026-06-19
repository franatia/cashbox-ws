const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'src');

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      walk(p);
    } else if (p.endsWith('.search.ts')) {
      processFile(p);
    }
  }
}

function processFile(file) {
  let txt = fs.readFileSync(file, 'utf8');
  const lines = txt.split(/\r?\n/);
  const selIdx = lines.findIndex((l) => l.includes('this.applySelectors('));
  if (selIdx < 0) return;

  const searchStart = lines.findIndex((line, index) => {
    return index < selIdx && (line.includes('this.applyJoins(') || line.includes('this.applyFilters('));
  });
  if (searchStart < 0) return;

  const blockEnd = findBlockEnd(lines, selIdx);
  const block = lines.slice(selIdx, blockEnd + 1);
  lines.splice(selIdx, block.length);
  lines.splice(searchStart, 0, ...block);

  const out = lines.join('\n');
  if (out !== txt) {
    fs.writeFileSync(file, out, 'utf8');
    console.log('updated', file);
  }
}

function findBlockEnd(lines, start) {
  for (let i = start; i < lines.length; i++) {
    if (lines[i].trim().endsWith(');')) {
      return i;
    }
  }
  return start;
}

walk(root);
