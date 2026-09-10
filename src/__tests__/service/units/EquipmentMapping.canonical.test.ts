import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { getEquipmentLookupService } from '@/services/equipment/EquipmentLookupService';
import { getEquipmentRegistry } from '@/services/equipment/EquipmentRegistry';
import { mapEquipment } from '@/services/units/unitLoaderService/equipmentMapping';
import { MechLocation } from '@/types/construction/CriticalSlotAllocation';
import { TechBaseMode } from '@/types/construction/TechBaseConfiguration';
import { TechBase } from '@/types/enums/TechBase';
import { EquipmentCategory } from '@/types/equipment';

jest.mock('@/services/equipment/EquipmentFileReader', () => ({
  readJsonFile: async (file: string, basePath: string) => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    return JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'public', basePath, file),
        'utf8',
      ),
    );
  },
}));

interface IAtlasFixture {
  readonly equipment: ReadonlyArray<{
    readonly id: string;
    readonly location: string;
  }>;
  readonly criticalSlots: Readonly<
    Record<string, ReadonlyArray<string | null>>
  >;
}

describe('canonical equipment critical-slot restoration', () => {
  beforeAll(async () => {
    await getEquipmentLookupService().initialize();
    await getEquipmentRegistry().initialize();
  }, 30000);

  it('restores the complete Atlas AS7-D loadout from the real catalog fixture', () => {
    const atlas = JSON.parse(
      readFileSync(
        join(
          process.cwd(),
          'public/data/units/battlemechs/2-star-league/standard/Atlas AS7-D.json',
        ),
        'utf8',
      ),
    ) as IAtlasFixture;
    const mapped = mapEquipment(
      atlas.equipment,
      TechBase.INNER_SPHERE,
      TechBaseMode.INNER_SPHERE,
      atlas.criticalSlots,
    );
    const find = (id: string, location: MechLocation) =>
      mapped.filter(
        (item) => item.equipmentId === id && item.location === location,
      );

    expect(find('medium-laser', MechLocation.LEFT_ARM)[0].slots).toEqual([5]);
    expect(find('medium-laser', MechLocation.RIGHT_ARM)[0].slots).toEqual([5]);
    expect(find('lrm-20', MechLocation.LEFT_TORSO)[0].slots).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(find('srm-6', MechLocation.LEFT_TORSO)[0].slots).toEqual([6, 7]);
    expect(find('ac-20', MechLocation.RIGHT_TORSO)[0].slots).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);

    const rearLasers = find('medium-laser', MechLocation.CENTER_TORSO);
    expect(rearLasers).toHaveLength(2);
    expect(rearLasers.map((item) => item.slots)).toEqual([[10], [11]]);
    expect(rearLasers.every((item) => item.isRearMounted)).toBe(true);
    expect(new Set(rearLasers.map((item) => item.instanceId)).size).toBe(2);

    const ammo = mapped.filter(
      (item) => item.category === EquipmentCategory.AMMUNITION,
    );
    expect(
      ammo.map((item) => [item.equipmentId, item.location, item.slots]),
    ).toEqual(
      expect.arrayContaining([
        ['ammo-lrm-20', MechLocation.LEFT_TORSO, [8]],
        ['ammo-lrm-20', MechLocation.LEFT_TORSO, [9]],
        ['ammo-srm-6', MechLocation.LEFT_TORSO, [10]],
        ['ac-20-ammo', MechLocation.RIGHT_TORSO, [10]],
        ['ac-20-ammo', MechLocation.RIGHT_TORSO, [11]],
      ]),
    );
    expect(ammo).toHaveLength(5);
    expect(ammo.reduce((total, item) => total + item.weight, 0)).toBe(5);

    const heatSinks = mapped.filter(
      (item) => item.equipmentId === 'single-heat-sink',
    );
    expect(heatSinks).toHaveLength(8);
    expect(heatSinks.every((item) => !item.isRemovable)).toBe(true);
    expect(heatSinks.reduce((total, item) => total + item.weight, 0)).toBe(8);
    expect(heatSinks.map((item) => [item.location, item.slots])).toEqual(
      expect.arrayContaining([
        [MechLocation.LEFT_ARM, [4]],
        [MechLocation.RIGHT_ARM, [4]],
        [MechLocation.LEFT_TORSO, [0]],
        [MechLocation.HEAD, [3]],
        [MechLocation.LEFT_LEG, [4]],
        [MechLocation.LEFT_LEG, [5]],
        [MechLocation.RIGHT_LEG, [4]],
        [MechLocation.RIGHT_LEG, [5]],
      ]),
    );

    const weapons = mapped.filter((item) =>
      [
        EquipmentCategory.ENERGY_WEAPON,
        EquipmentCategory.BALLISTIC_WEAPON,
        EquipmentCategory.MISSILE_WEAPON,
      ].includes(item.category),
    );
    expect(weapons).toHaveLength(7);
    expect(weapons.map((item) => item.heat)).toEqual([3, 3, 6, 4, 7, 3, 3]);
  });
  it('keeps explicit custom placements authoritative without duplicate recovery', () => {
    const mapped = mapEquipment(
      [
        {
          id: 'medium-laser',
          location: 'CENTER_TORSO',
          slots: [10],
          isRearMounted: false,
        },
        { id: 'ac-20-ammo', location: 'RIGHT_TORSO', slots: [11] },
        {
          id: 'single-heat-sink',
          location: 'HEAD',
          slots: [3],
          isRemovable: true,
        },
      ],
      TechBase.INNER_SPHERE,
      TechBaseMode.INNER_SPHERE,
      {
        CENTER_TORSO: Array.from({ length: 12 }, (_, index) =>
          index === 10 ? 'Medium Laser (R)' : null,
        ),
        RIGHT_TORSO: Array.from({ length: 12 }, (_, index) =>
          index === 11 ? 'IS Ammo AC/20' : null,
        ),
        HEAD: [null, null, null, 'Heat Sink', null, null],
      },
    );

    expect(mapped).toHaveLength(3);
    expect(mapped[0]).toMatchObject({ slots: [10], isRearMounted: false });
    expect(
      mapped.filter((item) => item.equipmentId === 'ac-20-ammo'),
    ).toHaveLength(1);
    const heatSink = mapped.filter(
      (item) => item.equipmentId === 'single-heat-sink',
    );
    expect(heatSink).toHaveLength(1);
    expect(heatSink[0]).toMatchObject({
      slots: [3],
      weight: 1,
      isRemovable: true,
    });
  });

  it('restores placements from Quad and Tripod location keys without inventing slot equipment', () => {
    const mapped = mapEquipment(
      [
        { id: 'medium-laser', location: 'CENTER_LEG' },
        { id: 'small-laser', location: 'FRONT_LEFT_LEG' },
      ],
      TechBase.INNER_SPHERE,
      TechBaseMode.INNER_SPHERE,
      {
        CENTER_LEG: ['Hip', 'Medium Laser', null, null, null, null],
        FRONT_LEFT_LEG: [
          'Hip',
          'Small Laser',
          'Unknown System',
          null,
          null,
          null,
        ],
      },
    );

    expect(mapped).toHaveLength(2);
    expect(mapped[0]).toMatchObject({
      location: MechLocation.CENTER_LEG,
      slots: [1],
    });
    expect(mapped[1]).toMatchObject({
      location: MechLocation.FRONT_LEFT_LEG,
      slots: [1],
    });
  });
});
