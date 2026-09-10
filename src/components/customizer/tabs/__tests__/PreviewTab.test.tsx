import { render, screen } from '@testing-library/react';
import React from 'react';

import type { IUnitConfig } from '@/services/printing/recordsheet/types';

import { useUnitStore } from '@/stores/useUnitStore';
import { createEmptyArmorAllocation } from '@/types/construction/ArmorAllocation';
import { ArmorTypeEnum } from '@/types/construction/ArmorType';
import { CockpitType } from '@/types/construction/CockpitType';
import { EngineType } from '@/types/construction/EngineType';
import { GyroType } from '@/types/construction/GyroType';
import { HeatSinkType } from '@/types/construction/HeatSinkType';
import { InternalStructureType } from '@/types/construction/InternalStructureType';
import { RulesLevel } from '@/types/enums/RulesLevel';
import { TechBase } from '@/types/enums/TechBase';
import { MechConfiguration } from '@/types/unit/BattleMechInterfaces';

import { PreviewTab } from '../PreviewTab';

let mockRegistryReady = false;
let mockCanvasUnitConfig: IUnitConfig | undefined;
let mockToolbarUnitConfig: IUnitConfig | undefined;

jest.mock('@/hooks/useEquipmentRegistry', () => ({
  useEquipmentRegistry: () => ({ isReady: mockRegistryReady }),
}));

jest.mock('@/services/construction/CalculationService', () => ({
  getCalculationService: () => ({
    calculateBattleValue: () => (mockRegistryReady ? 1234 : 0),
    calculateCost: () => (mockRegistryReady ? 5_000_000 : 0),
  }),
}));

jest.mock('@/stores/useUnitStore', () => ({
  useUnitStore: jest.fn(),
}));

jest.mock('../../preview/PreviewTabFrame', () => ({
  PreviewTabFrame: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../preview/RecordSheetCanvasPreview', () => ({
  useRecordSheetToolbarActions: (unitConfig: IUnitConfig) => {
    mockToolbarUnitConfig = unitConfig;
    return {
      onExportPDF: jest.fn(),
      onPrint: jest.fn(),
      paperSize: 'letter',
      onPaperSizeChange: jest.fn(),
    };
  },
}));

jest.mock('../../preview/RecordSheetPreview', () => ({
  RecordSheetPreview: ({ unitConfig }: { unitConfig: IUnitConfig }) => {
    mockCanvasUnitConfig = unitConfig;
    return <div data-testid="preview-bv">{unitConfig.battleValue}</div>;
  },
}));

const storeState = {
  name: 'Atlas AS7-D',
  chassis: 'Atlas',
  model: 'AS7-D',
  tonnage: 100,
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  year: 3025,
  role: 'Juggernaut',
  configuration: MechConfiguration.BIPED,
  engineType: EngineType.STANDARD,
  engineRating: 300,
  gyroType: GyroType.STANDARD,
  internalStructureType: InternalStructureType.STANDARD,
  cockpitType: CockpitType.STANDARD,
  armorType: ArmorTypeEnum.STANDARD,
  armorAllocation: createEmptyArmorAllocation(),
  heatSinkType: HeatSinkType.SINGLE,
  heatSinkCount: 10,
  enhancement: null,
  jumpMP: 0,
  equipment: [],
};

describe('PreviewTab', () => {
  it('updates the shared preview/export role when Fluff changes', () => {
    const { rerender } = render(<PreviewTab />);
    expect(mockCanvasUnitConfig).toMatchObject({ role: 'Juggernaut' });
    storeState.role = 'Brawler';
    rerender(<PreviewTab />);
    expect(mockCanvasUnitConfig).toMatchObject({ role: 'Brawler' });
    expect(mockCanvasUnitConfig).toBe(mockToolbarUnitConfig);
  });
  beforeEach(() => {
    storeState.role = 'Juggernaut';
    mockRegistryReady = false;
    mockCanvasUnitConfig = undefined;
    mockToolbarUnitConfig = undefined;
    (useUnitStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: typeof storeState) => unknown) => selector(storeState),
    );
  });

  it('shares one projection with canvas and toolbar and refreshes on registry readiness', () => {
    const { rerender } = render(<PreviewTab />);

    expect(screen.getByTestId('preview-bv')).toHaveTextContent('0');
    expect(mockCanvasUnitConfig).toBe(mockToolbarUnitConfig);

    mockRegistryReady = true;
    rerender(<PreviewTab />);

    expect(screen.getByTestId('preview-bv')).toHaveTextContent('1234');
    expect(mockCanvasUnitConfig).toBe(mockToolbarUnitConfig);
  });
});
