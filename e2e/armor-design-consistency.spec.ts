import { expect, test, type Page } from '@playwright/test';

async function armorSnapshot(page: Page) {
  return page.locator('[data-armor-variant]').evaluate((root) => {
    const svg = root.querySelector('svg[viewBox="0 0 360 440"]')!;
    const frame = svg.getBoundingClientRect();
    const paths = Array.from(root.querySelectorAll('path[data-armor-plate]'));
    return {
      panelBackground: getComputedStyle(root).backgroundColor,
      geometry: {
        width: frame.width,
        height: frame.height,
        plates: paths.map((path) => {
          const bounds = path.getBoundingClientRect();
          const location = path.getAttribute('data-armor-plate');
          return {
            location,
            geometry: path.getAttribute('d'),
            status: getComputedStyle(
              root.querySelector(`circle[data-armor-status="${location}"]`)!,
            ).fill,
            x: bounds.x - frame.x,
            y: bounds.y - frame.y,
            width: bounds.width,
            height: bounds.height,
          };
        }),
      },
      materials: paths.map((path) => {
        const fill = path.getAttribute('fill')!;
        const gradient = fill.startsWith('url(#')
          ? root.querySelector('[id="' + fill.slice(5, -1) + '"]')
          : null;
        return {
          fill: gradient
            ? Array.from(gradient.querySelectorAll('stop')).map((stop) => ({
                offset: stop.getAttribute('offset'),
                color: getComputedStyle(stop).stopColor,
              }))
            : getComputedStyle(path).fill,
          stroke: getComputedStyle(path).stroke,
          filter: getComputedStyle(path).filter,
        };
      }),
    };
  });
}

test('armor designs retain distinct materials, common geometry and themed panels @appearance', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1180, height: 912 });
  await page.goto('/customizer');
  await page.getByRole('button', { name: 'Load from Library' }).click();
  await page
    .getByRole('dialog')
    .getByRole('combobox')
    .first()
    .selectOption('canonical');
  await page
    .getByPlaceholder('Search by chassis or variant...')
    .fill('Atlas AS7-D');
  await page.getByText('AS7-D', { exact: true }).click();
  await page.getByRole('button', { name: 'Load Unit', exact: true }).click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('tab', { name: 'Armor', exact: true }).click();
  await page.waitForURL('**/armor');
  const unitUrl = page.url();
  const baseline = await armorSnapshot(page);
  expect(baseline.panelBackground).toBe('rgb(18, 46, 80)');
  expect(baseline.geometry.width).toBe(320);
  expect(baseline.geometry.plates).toHaveLength(8);
  expect(
    baseline.geometry.plates.find((p) => p.location === 'Left Arm')!.x,
  ).toBeGreaterThan(
    baseline.geometry.plates.find((p) => p.location === 'Right Arm')!.x,
  );
  const variants = ['Standard', 'Glow', 'HUD', 'Chromatic'];
  const materials: Record<string, unknown> = {};
  for (const variant of variants) {
    await page.getByRole('button', { name: /^Silhouette:/ }).click();
    await expect(page.getByRole('listbox').getByRole('option')).toHaveText(
      variants,
    );
    await page.getByRole('option', { name: variant, exact: true }).click();
    await page.mouse.move(0, 0);
    const snapshot = await armorSnapshot(page);
    expect(snapshot.geometry).toEqual(baseline.geometry);
    materials[variant] = snapshot.materials;
    const arm = page.getByRole('button', { name: /^Left Arm armor:/ });
    await arm.press('Enter');
    await expect(page.getByTestId('location-armor-editor')).toBeVisible();
    await arm.press('Enter');
    await expect(page.getByTestId('location-armor-editor')).toBeHidden();
    await arm.blur();
    await page.mouse.move(0, 0);
    await page.screenshot({
      path: testInfo.outputPath(`armor-${variant}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  }
  expect(
    new Set(Object.values(materials).map((value) => JSON.stringify(value)))
      .size,
  ).toBe(4);
  for (const [name, color] of [
    ['Petrol teal', 'rgb(14, 53, 61)'],
    ['Field olive', 'rgb(42, 56, 30)'],
    ['Classic slate', 'rgb(30, 41, 59)'],
    ['Royal violet', 'rgb(44, 28, 71)'],
    ['Burgundy', 'rgb(62, 29, 48)'],
    ['Copper', 'rgb(63, 42, 27)'],
    ['Neon', 'rgb(15, 23, 42)'],
    ['Tactical', 'rgb(12, 18, 32)'],
    ['Obsidian', 'rgb(22, 27, 34)'],
    ['Midnight blue', 'rgb(18, 46, 80)'],
  ]) {
    await page.goto('/settings#appearance');
    await page.getByRole('button', { name, exact: true }).click();
    await page.goto(unitUrl);
    await expect(page.locator('[data-armor-variant]')).toBeVisible();
    await page.mouse.move(0, 0);
    const snapshot = await armorSnapshot(page);
    expect(snapshot.geometry).toEqual(baseline.geometry);
    expect(snapshot.materials).toEqual(materials.Chromatic);
    expect(snapshot.panelBackground).toBe(color);
  }
  await page.reload();
  await expect(page.locator('[data-armor-variant]')).toBeVisible();
  expect((await armorSnapshot(page)).geometry).toEqual(baseline.geometry);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: /^Left Arm armor:/ }).press('Enter');
  await expect(page.getByTestId('location-armor-editor')).toBeInViewport();
  await page.screenshot({
    path: testInfo.outputPath('armor-shared-mobile.png'),
    fullPage: true,
    animations: 'disabled',
  });
  await testInfo.attach('armor-materials-and-geometry.json', {
    body: JSON.stringify({ baseline, materials }, null, 2),
    contentType: 'application/json',
  });
});
