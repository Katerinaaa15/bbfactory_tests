import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

/**
 * Collects every failed and flaky test (passed only after retry) and writes
 * them to reports/marked-tests.md so they are explicitly marked after each run.
 */
class MarkedResultsReporter implements Reporter {
  private failed: string[] = [];
  private flaky: string[] = [];

  onTestEnd(test: TestCase, _result: TestResult): void {
    const label = `[${test.parent.project()?.name}] ${test.titlePath().slice(1).join(' > ')}`;
    const outcome = test.outcome();
    if (outcome === 'flaky') this.flaky.push(label);
    if (outcome === 'unexpected') this.failed.push(label);
  }

  onEnd(_result: FullResult): void {
    const unique = (a: string[]) => [...new Set(a)];
    const section = (title: string, items: string[]) =>
      `## ${title} (${items.length})\n${items.length ? items.map((i) => `- ${i}`).join('\n') : '_none_'}\n`;
    const content = `# Marked tests\n\n${section('FAILED', unique(this.failed))}\n${section('FLAKY', unique(this.flaky))}`;
    const file = path.resolve('reports', 'marked-tests.md');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    if (this.failed.length || this.flaky.length) {
      console.log(
        `\nFailed: ${unique(this.failed).length}, Flaky: ${unique(this.flaky).length} -> reports/marked-tests.md`,
      );
    }
  }
}

export default MarkedResultsReporter;
