// Fails if any test file contains skip/fixme (project rule: no skipped tests).
import fs from 'fs';
import path from 'path';

const bad = /\.(skip|fixme)\s*\(/;
const offenders = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|js)$/.test(e.name) && bad.test(fs.readFileSync(p, 'utf8'))) offenders.push(p);
  }
};
walk('tests');
if (offenders.length) {
  console.error('Skipped tests are not allowed:\n' + offenders.join('\n'));
  process.exit(1);
}
console.log('No skipped tests found.');
