import { expect, test } from '@playwright/test';

for (const width of [1351, 1055, 768]) {
  test(`loadout actions stay readable and preserve equipment at ${width}px @customizer`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 912 });
    await page.goto('/customizer');
    await page
      .getByRole('button', { name: 'Load from Library', exact: true })
      .click();
    const library = page.getByRole('dialog', { name: 'Add unit', exact: true });
    await library.getByRole('combobox').first().selectOption('canonical');
    await library
      .getByPlaceholder('Search by chassis or variant...')
      .fill('Enforcer ENF-4R');
    await library.getByText('ENF-4R', { exact: true }).click();
    await library
      .getByRole('button', { name: 'Load Unit', exact: true })
      .click();
    await library.waitFor({ state: 'hidden' });
    await page
      .getByRole('tab', { name: 'Critical Slots', exact: true })
      .click();
    const storedDraft = () =>
      page.evaluate(() =>
        localStorage.getItem(`megamek-unit-${location.pathname.split('/')[2]}`),
      );
    await expect.poll(storedDraft).not.toBeNull();
    const before = await storedDraft();
    const trigger = page.getByRole('button', {
      name: 'More loadout actions',
      exact: true,
    });
    if (!(await trigger.isVisible())) {
      await page
        .getByRole('button', { name: 'Open loadout drawer', exact: true })
        .click();
    }
    await trigger.click();
    const menu = page.locator('#loadout-actions');
    await expect(menu).toBeVisible();
    const measurements = await menu.locator('button').evaluateAll((buttons) =>
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        const label = button.querySelector('span')!;
        const icon = button.querySelector('svg')!;
        const iconRect = icon.getBoundingClientRect();
        return {
          text: label.textContent,
          width: label.clientWidth,
          scrollWidth: label.scrollWidth,
          targetHeight: rect.height,
          left: rect.left,
          right: rect.right,
          iconWidth: iconRect.width,
          stroke: getComputedStyle(icon).strokeWidth,
        };
      }),
    );
    expect(measurements).toHaveLength(3);
    for (const row of measurements) {
      expect(row.scrollWidth, row.text!).toBeLessThanOrEqual(row.width);
      expect(row.targetHeight).toBeGreaterThanOrEqual(44);
      expect(row.left).toBeGreaterThanOrEqual(0);
      expect(row.right).toBeLessThanOrEqual(width);
      expect(row.iconWidth).toBe(20);
      expect(row.stroke).toBe('2px');
    }
    await menu.screenshot({ path: testInfo.outputPath('loadout-menu.png') });
    await page.screenshot({ path: testInfo.outputPath('loadout-context.png') });
    await menu.getByRole('button', { name: 'location', exact: true }).click();
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(
      menu.getByRole('button', { name: 'location', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await menu.getByRole('button', { name: 'category', exact: true }).click();
    await trigger.click();
    await expect(
      menu.getByRole('button', { name: 'category', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    const confirm = page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message();
      await dialog.dismiss();
      return message;
    });
    await menu.getByRole('button', { name: /^Remove all removable/ }).click();
    expect(await confirm).toMatch(
      /^Remove all \d+ removable equipment items\?$/,
    );
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    expect(await storedDraft()).toBe(before);
    await testInfo.attach('loadout-menu-measurements.json', {
      body: JSON.stringify(measurements, null, 2),
      contentType: 'application/json',
    });
  });
}
