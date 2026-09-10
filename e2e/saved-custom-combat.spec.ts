import { expect, test } from '@playwright/test';

import atlas from '../public/data/units/battlemechs/2-star-league/standard/Atlas AS7-D.json';

test.use({ serviceWorkers: 'block' });

test('server-saved construction reaches campaign persistence with distinct identities @customizer @campaign', async ({
  page,
  request,
}, testInfo) => {
  await page.addInitScript(() =>
    Reflect.deleteProperty(Navigator.prototype, 'serviceWorker'),
  );
  const variant = `Combat proof ${Date.now()}-${testInfo.workerIndex}`;
  const name = `Atlas ${variant}`;
  let customId = '';
  let campaignId = '';
  try {
    const createdResponse = await request.post('/api/units/custom', {
      data: {
        chassis: 'Atlas',
        variant,
        data: {
          ...atlas,
          variant,
          armor: {
            ...atlas.armor,
            allocation: { ...atlas.armor.allocation, LEFT_ARM: 30 },
          },
        },
      },
    });
    expect(createdResponse.status()).toBe(201);
    const created = await createdResponse.json();
    expect(created.success).toBe(true);
    customId = created.data.id;
    expect(customId).toMatch(/^custom-/);
    const catalogResponse = await request.get(
      '/api/units/custom/combat-catalog',
    );
    expect(catalogResponse.ok()).toBe(true);
    expect((await catalogResponse.json()).customCombatRefs).toContain(customId);

    await page.goto('/gameplay/campaigns/create');
    await page.getByTestId('campaign-name-input').fill(name);
    await page.getByTestId('wizard-next-btn').click();
    await page.getByTestId('wizard-next-btn').click();
    await page.getByTestId('wizard-next-btn').click();
    await page
      .getByRole('button', { name: `Add saved design ${name}`, exact: true })
      .click();
    const selected = page.locator('[data-unit-source="custom"]');
    await expect(selected).toHaveAttribute('data-unit-ref', customId);
    const rosterId = (await selected.getAttribute('data-testid'))?.replace(
      /^roster-unit-/,
      '',
    );
    expect(rosterId).toBeTruthy();
    expect(rosterId).not.toBe(customId);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(selected).toBeVisible();
    await page.getByTestId('wizard-next-btn').click();
    const savedResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'PUT' &&
        response.url().includes('/api/campaigns/') &&
        response.ok(),
    );
    await page.getByTestId('wizard-submit-btn').click();
    const saved = await savedResponse;
    campaignId = new URL(saved.url()).pathname.split('/').pop()!;
    await page.waitForURL(new RegExp(`/gameplay/campaigns/${campaignId}`));

    const readbackResponse = await request.get(`/api/campaigns/${campaignId}`);
    expect(readbackResponse.ok()).toBe(true);
    const readback = await readbackResponse.json();
    expect(readback.campaignId).toBe(campaignId);
    expect(readback.body.rosterProjection.units).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          unitId: rosterId,
          unitRef: customId,
          unitSource: 'custom',
        }),
      ]),
    );
    const root = readback.body.forces.find(
      ([id]: [string]) => id === readback.body.rootForceId,
    )?.[1];
    expect(root.unitIds).toContain(rosterId);
    expect(readback.body.unitConfigurations).toBeUndefined();

    await page.goto(`/gameplay/campaigns/${campaignId}/mech-bay`);
    await expect(page.getByTestId('mech-bay-grid')).toBeVisible();
    await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
    await page.reload();
    await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
    const persistedAgain = await (
      await request.get(`/api/campaigns/${campaignId}`)
    ).json();
    expect(persistedAgain.body.rosterProjection.units).toEqual(
      readback.body.rosterProjection.units,
    );
    await testInfo.attach('saved-construction-authority', {
      contentType: 'application/json',
      body: JSON.stringify({
        customId,
        rosterId,
        campaignId,
        catalogEligible: true,
        readbackVersion: readback.version,
        coldReloaded: true,
      }),
    });
  } finally {
    if (campaignId)
      expect((await request.delete(`/api/campaigns/${campaignId}`)).ok()).toBe(
        true,
      );
    if (customId)
      expect((await request.delete(`/api/units/custom/${customId}`)).ok()).toBe(
        true,
      );
  }
});
