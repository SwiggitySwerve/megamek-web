import { test, expect } from '@playwright/test';

test('mobile loadout is a keyboard modal above navigation @customizer', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
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
  const trigger = page.getByRole('button', {
    name: 'Expand loadout',
    exact: true,
  });
  await trigger.focus();
  await trigger.press('Enter');
  const drawer = page.getByRole('dialog', {
    name: 'Equipment Loadout',
    exact: true,
  });
  await expect(drawer).toBeVisible();
  const close = drawer.getByRole('button', {
    name: 'Close loadout',
    exact: true,
  });
  await expect(close).toBeFocused();
  const footer = drawer.getByRole('button', { name: 'Close', exact: true });
  await expect
    .poll(() =>
      footer.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return el.contains(
          document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2),
        );
      }),
    )
    .toBe(true);
  await close.press('Shift+Tab');
  await expect(footer).toBeFocused();
  await footer.press('Tab');
  await expect(close).toBeFocused();
  await close.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await footer.click();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await close.click();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await page.screenshot({
    path: testInfo.outputPath('mobile-loadout-modal.png'),
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(drawer).toBeHidden();
  await expect(
    page.getByRole('tab', { name: 'Equipment', exact: true }),
  ).toBeVisible();
});

test('mobile equipment actions retain identity and focus through mounting and removal @customizer', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
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
  await page.getByRole('tab', { name: 'Equipment', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Search equipment', exact: true })
    .fill('Small Laser');
  await page
    .getByRole('button', { name: 'Add Small Laser', exact: true })
    .click();
  const equipment = () =>
    page.evaluate(() => {
      const id = location.pathname.split('/')[2];
      return JSON.parse(localStorage.getItem(`megamek-unit-${id}`)!).state
        .equipment as {
        instanceId: string;
        equipmentId: string;
        location?: string;
        slots?: number[];
      }[];
    });
  const instance = (await equipment()).find(
    (item) => item.equipmentId === 'small-laser',
  )!;
  expect(instance).toBeTruthy();
  await page
    .getByRole('button', { name: 'Expand loadout', exact: true })
    .press('Enter');
  const drawer = page.getByRole('dialog', { name: 'Equipment Loadout' });
  const assign = drawer.getByRole('button', {
    name: 'Assign Small Laser to location',
    exact: true,
  });
  await assign.focus();
  await assign.press('Enter');
  await expect(drawer.getByRole('button', { name: /^Head/ })).toBeDisabled();
  await drawer.getByRole('button', { name: /^Left Arm/ }).press('Enter');
  const selection = drawer.getByRole('button', {
    name: 'Select Small Laser in Left Arm',
    exact: true,
  });
  await expect(selection).toBeFocused();
  await expect
    .poll(
      async () =>
        (await equipment()).find(
          (item) => item.instanceId === instance.instanceId,
        )?.slots,
    )
    .toEqual([6]);
  for (const button of await drawer.getByRole('button').all()) {
    if (!(await button.isVisible())) continue;
    const bounds = await button.boundingBox();
    expect(
      bounds?.height,
      (await button.getAttribute('aria-label')) ?? (await button.innerText()),
    ).toBeGreaterThanOrEqual(44);
    expect(
      bounds?.width,
      (await button.getAttribute('aria-label')) ?? (await button.innerText()),
    ).toBeGreaterThanOrEqual(44);
  }
  await drawer
    .getByRole('button', {
      name: 'Unassign Small Laser from Left Arm',
      exact: true,
    })
    .press('Enter');
  expect(
    (await equipment()).find((item) => item.instanceId === instance.instanceId)
      ?.location,
  ).toBe('Left Arm');
  await drawer
    .getByRole('button', {
      name: 'Confirm unassign Small Laser from Left Arm',
      exact: true,
    })
    .press('Enter');
  await expect(
    drawer.getByRole('button', {
      name: 'Select Small Laser unassigned',
      exact: true,
    }),
  ).toBeFocused();
  await expect
    .poll(
      async () =>
        (await equipment()).find(
          (item) => item.instanceId === instance.instanceId,
        )?.location,
    )
    .toBeUndefined();
  await page.screenshot({
    path: testInfo.outputPath('mobile-equipment-unassigned.png'),
    fullPage: true,
  });
  await drawer
    .getByRole('button', { name: 'Remove Small Laser', exact: true })
    .press('Enter');
  expect(
    (await equipment()).some((item) => item.instanceId === instance.instanceId),
  ).toBe(true);
  await drawer
    .getByRole('button', {
      name: 'Confirm removal of Small Laser',
      exact: true,
    })
    .press('Enter');
  await expect
    .poll(() => drawer.evaluate((el) => el.contains(document.activeElement)))
    .toBe(true);
  await expect
    .poll(async () =>
      (await equipment()).some(
        (item) => item.instanceId === instance.instanceId,
      ),
    )
    .toBe(false);
  await drawer.getByRole('button', { name: 'Close', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('tab', { name: 'Equipment', exact: true }),
  ).toBeVisible();
  expect(
    (await equipment()).some((item) => item.instanceId === instance.instanceId),
  ).toBe(false);
});
