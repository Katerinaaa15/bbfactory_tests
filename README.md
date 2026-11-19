# bbfactory-tests

Playwright (TypeScript) E2E tests for https://bbfactory.lv/ using the Page Object Model.

## Structure
```
src/pages/       page objects (one class per page, extend BasePage)
src/components/  reusable UI components (header, footer, ...)
src/fixtures/    custom test fixtures that provide page objects
src/data/        test data
src/utils/       helpers (env access, ...)
tests/           spec files (<page>.spec.ts)
reporters/       custom reporter (lists failed / flaky tests)
scripts/         project checks (no skipped tests)
reports/         generated: html report, json, screenshots, traces (git-ignored)
```

## Setup
```
npm install
npx playwright install chromium firefox
cp .env.example .env
```

## Run
```
npm test                 # chromium + firefox, headless
npm run report           # open HTML report
npm run check:no-skips   # verify no test.skip / test.fixme
```

## Rules
- Locators are taken from the real page (inspected in the browser), never guessed.
- Locators only in page objects/components; specs contain actions + assertions.
- Prefer role/label/text/test-id locators; no hard waits.
- No `test.skip` / `test.fixme`. A known-failing test stays active and is tagged
  `{ tag: '@failed' }` with an annotation describing the defect; an unstable test is tagged `{ tag: '@flaky' }`.
- Config: 2 browsers (chromium, firefox), 1 retry, headless, screenshots always, trace/video on failure.
- Failed and flaky tests are listed in `reports/marked-tests.md` after every run.
- Credentials only in `.env` (git-ignored).
