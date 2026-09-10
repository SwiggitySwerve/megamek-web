import { expect, test, type Page } from '@playwright/test';

async function loadAtlas(page: Page): Promise<void> {
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
  await expect(page.getByTestId('armor-diagram')).toBeVisible();
}

async function readDraft(page: Page) {
  return page.evaluate(() => {
    const id = window.location.pathname.split('/')[2];
    const raw = localStorage.getItem(`megamek-unit-${id}`);
    if (!raw) throw new Error(`Missing stored draft for ${id}`);
    const { state } = JSON.parse(raw);
    return {
      id,
      name: state.name,
      tonnage: state.tonnage,
      armorTonnage: state.armorTonnage,
      armor: state.armorAllocation,
    };
  });
}

test('existing biped armor edits preserve caps, draft and unit isolation @customizer', async ({
  page,
}, testInfo) => {
  await loadAtlas(page);
  await expect.poll(async () => (await readDraft(page)).tonnage).toBe(100);
  const atlas = await readDraft(page);
  const torso = page.getByRole('button', { name: /^Center Torso armor:/ });
  await expect(torso).toHaveAttribute(
    'aria-label',
    'Center Torso armor: 47 of 62, rear: 14 of 15',
  );
  await torso.focus();
  await page.keyboard.press('Enter');
  const editor = page.getByTestId('location-armor-editor');
  await expect(editor).toBeVisible();
  await editor.getByRole('spinbutton').nth(0).fill('46');
  await editor.getByRole('spinbutton').nth(1).fill('16');
  await expect
    .poll(async () => (await readDraft(page)).armor.centerTorsoRear)
    .toBe(16);
  await editor.getByRole('spinbutton').nth(1).fill('99');
  await expect(editor.getByRole('spinbutton').nth(1)).toHaveValue('16');
  await torso.focus();
  await page.keyboard.press('Space');
  await expect(editor).toBeHidden();
  await page.getByRole('spinbutton').fill('18.5');
  await expect
    .poll(async () => (await readDraft(page)).armorTonnage)
    .toBe(18.5);
  await expect(page.getByText('-9', { exact: true })).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('armor-desktop.png'),
    fullPage: true,
  });

  await page.getByTitle('Add unit (Ctrl+O)').click();
  await page
    .getByRole('dialog')
    .getByRole('combobox')
    .first()
    .selectOption('canonical');
  await page
    .getByPlaceholder('Search by chassis or variant...')
    .fill('Locust LCT-1V');
  await page.getByText('LCT-1V', { exact: true }).click();
  await page.getByRole('button', { name: 'Load Unit', exact: true }).click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await expect.poll(async () => (await readDraft(page)).tonnage).toBe(20);
  const locust = await readDraft(page);
  expect(locust.id).not.toBe(atlas.id);
  await page.getByText('Atlas AS7-D', { exact: true }).first().click();
  await page.getByRole('tab', { name: 'Armor', exact: true }).click();
  await expect.poll(async () => (await readDraft(page)).id).toBe(atlas.id);
  expect((await readDraft(page)).armor['Center Torso']).toBe(46);
  await page.reload();
  await expect(torso).toHaveAttribute(
    'aria-label',
    'Center Torso armor: 46 of 62, rear: 16 of 16',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await torso.click();
  await expect(editor).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('armor-mobile.png'),
    fullPage: true,
  });
});
