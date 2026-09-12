import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const output = path.dirname(fileURLToPath(import.meta.url));
const baseURL = process.env.CHASSIS_BASE_URL ?? 'http://127.0.0.1:4187';
const report = {
  startedAt: new Date().toISOString(),
  baseURL,
  checks: [],
  pageErrors: [],
  consoleErrors: [],
  screenshots: [],
};
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ??
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
page.setDefaultTimeout(180000);
page.on('pageerror', (error) =>
  report.pageErrors.push(error.stack ?? error.message),
);
page.on('console', (message) => {
  if (message.type() === 'error') report.consoleErrors.push(message.text());
});
const check = (name) => {
  report.checks.push(name);
  process.stdout.write(name + '\n');
};
const screenshot = async (name) => {
  await page.screenshot({
    path: path.join(output, name),
    fullPage: true,
    animations: 'disabled',
  });
  report.screenshots.push(name);
};
try {
  const response = await context.request.get(`${baseURL}/api/chassis`, {
    timeout: 180000,
  });
  assert.equal(response.status(), 200);
  const index = await response.json();
  const source = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'public/data/units/battlemechs/index.json'),
      'utf8',
    ),
  );
  assert.equal(index.schemaVersion, 1);
  assert.equal(index.totalVariants, source.units.length);
  assert.equal(
    index.chassis.length,
    new Set(source.units.map((unit) => unit.chassis)).size,
  );
  assert.equal(
    new Set(
      index.chassis.flatMap((entry) =>
        entry.variants.map((variant) => variant.unitId),
      ),
    ).size,
    source.units.length,
  );
  report.counts = {
    chassis: index.chassis.length,
    variants: index.totalVariants,
  };
  check('Live API preserves the complete bundled catalog');

  assert.equal(
    (await context.request.post(`${baseURL}/api/chassis`)).status(),
    405,
  );
  assert.equal(
    (
      await context.request.get(`${baseURL}/api/chassis?id=battlemech:missing`)
    ).status(),
    404,
  );
  assert.equal(
    (
      await context.request.get(
        `${baseURL}/api/chassis?id=battlemech:atlas&id=battlemech:atlas`,
      )
    ).status(),
    400,
  );
  const atlas = await (
    await context.request.get(`${baseURL}/api/chassis?id=battlemech:atlas`)
  ).json();
  assert.equal(atlas.name, 'Atlas');
  check(
    'Live API enforces methods, exact lookup, missing IDs, and repeated parameters',
  );

  await page.goto(`${baseURL}/compendium`, {
    waitUntil: 'domcontentloaded',
    timeout: 180000,
  });
  await page.getByRole('link', { name: /^Chassis index/ }).click();
  await page
    .getByRole('status')
    .filter({ hasText: `${index.chassis.length} chassis found` })
    .waitFor();
  check('Chassis index is discoverable from Compendium');
  await screenshot('chassis-desktop.png');

  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByText('Page 2 of', { exact: false }).waitFor();
  await page.getByLabel('Search chassis').fill('Timber Wolf');
  await page
    .getByRole('status')
    .filter({ hasText: '1 chassis found' })
    .waitFor();
  await page.getByRole('link', { name: 'View Mad Cat chassis' }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Mad Cat', exact: true }).waitFor();
  await page.getByText('Also known as Timber Wolf', { exact: true }).waitFor();
  assert.ok(
    page.url().includes('battlemech%3Amad-cat') ||
      page.url().includes('battlemech:mad-cat'),
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Mad Cat', exact: true }).waitFor();
  await page
    .getByText('No preview has been added for this chassis yet.', {
      exact: true,
    })
    .waitFor();
  check(
    'Alias search, keyboard selection, URL reload, and honest preview state',
  );
  await screenshot('mad-cat-detail.png');

  await page.goto(`${baseURL}/compendium/chassis?chassis=battlemech%3Aatlas`, {
    waitUntil: 'domcontentloaded',
  });
  await page.getByRole('heading', { name: 'Atlas', exact: true }).waitFor();
  const unitLink = page
    .getByRole('link', { name: /^Atlas AS7-D 100 t/ })
    .first();
  assert.equal(
    await unitLink.getAttribute('href'),
    '/compendium/units/atlas-as7-d',
  );
  await unitLink.click();
  await page
    .locator('header')
    .getByRole('heading', { name: 'Atlas AS7-D', exact: true })
    .waitFor({ timeout: 180000 });
  check('Canonical variant link opens the real unit detail page');

  await page.goto(`${baseURL}/compendium/chassis`, {
    waitUntil: 'domcontentloaded',
  });
  await page.getByLabel('Search chassis').fill('Griffin');
  await page.getByLabel('Weight class').selectOption('Heavy');
  await page
    .getByRole('link', { name: 'View Griffin chassis', exact: true })
    .waitFor();
  await page.getByLabel('Weight class').selectOption('Assault');
  await page
    .getByText('No chassis match these filters.', { exact: false })
    .waitFor();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page
    .getByRole('status')
    .filter({ hasText: `${index.chassis.length} chassis found` })
    .waitFor();
  check('Multiweight filtering, empty results, and clearing filters');

  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= window.innerWidth &&
        Array.from(document.querySelectorAll('main')).every(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
    ),
    true,
  );
  await screenshot('chassis-mobile.png');
  await page.getByLabel('Search chassis').fill('Marauder IIC');
  await page
    .getByRole('link', { name: 'View Marauder IIC chassis', exact: true })
    .click();
  await page
    .getByRole('heading', { name: 'Marauder IIC', exact: true })
    .waitFor();
  assert.equal(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= window.innerWidth &&
        Array.from(document.querySelectorAll('main')).every(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
    ),
    true,
  );
  await screenshot('chassis-mobile-detail.png');
  check('Mobile list and detail have no horizontal page overflow');

  await page.goto(
    `${baseURL}/compendium/chassis?chassis=battlemech%3Amissing`,
    { waitUntil: 'domcontentloaded' },
  );
  await page
    .getByRole('alert')
    .filter({ hasText: 'This chassis is not in the catalog.' })
    .waitFor();
  check('Unknown chassis URL has an explicit recovery state');

  // Intercept the page request directly; a service worker owns requests in the normal journey.
  const faultContext = await browser.newContext({ serviceWorkers: 'block' });
  const faultPage = await faultContext.newPage();
  faultPage.setDefaultTimeout(30000);
  faultPage.on('pageerror', (error) =>
    report.pageErrors.push(error.stack ?? error.message),
  );
  await faultPage.route('**/api/chassis', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Test outage' }),
    }),
  );
  await faultPage.goto(`${baseURL}/compendium/chassis`, {
    waitUntil: 'domcontentloaded',
    timeout: 180000,
  });
  await faultPage
    .getByRole('alert')
    .filter({ hasText: 'The chassis catalog could not be loaded.' })
    .waitFor();
  await faultPage.unroute('**/api/chassis');
  await faultPage.getByRole('button', { name: 'Try again' }).click();
  await faultPage
    .getByRole('status')
    .filter({ hasText: `${index.chassis.length} chassis found` })
    .waitFor();
  await faultContext.close();
  check(
    'Catalog outage is visible and retry recovers using the real API (service worker blocked for fault injection)',
  );
  assert.deepEqual(report.pageErrors, []);
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.failure = error.stack;
  report.failureUrl = page.url();
  report.failureBody = await page
    .locator('body')
    .innerText()
    .catch(() => 'unavailable');
  await screenshot('failure.png').catch(() => {});
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(
    path.join(output, 'browser-verification.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  await browser.close();
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
}
