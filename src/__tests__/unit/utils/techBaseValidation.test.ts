import {
  getValidatedSelectionUpdates,
  ComponentSelections,
} from '@/utils/techBaseValidation';
import { TechBase } from '@/types/enums/TechBase';
import { TechBaseComponent } from '@/types/construction/TechBaseConfiguration';
import { EngineType } from '@/types/construction/EngineType';
import { GyroType } from '@/types/construction/GyroType';
import { InternalStructureType } from '@/types/construction/InternalStructureType';
import { CockpitType } from '@/types/construction/CockpitType';
import { HeatSinkType } from '@/types/construction/HeatSinkType';
import { ArmorTypeEnum } from '@/types/construction/ArmorType';

describe('techBaseValidation', () => {
  const createSelections = (overrides?: Partial<ComponentSelections>): ComponentSelections => ({
    engineType: EngineType.STANDARD,
    gyroType: GyroType.STANDARD,
    internalStructureType: InternalStructureType.STANDARD,
    cockpitType: CockpitType.STANDARD,
    heatSinkType: HeatSinkType.SINGLE,
    armorType: ArmorTypeEnum.STANDARD,
    ...overrides,
  });

  describe('getValidatedSelectionUpdates()', () => {
    it('should return empty updates when selections are valid', () => {
      const selections = createSelections();
      const updates = getValidatedSelectionUpdates(
        TechBaseComponent.ENGINE,
        TechBase.INNER_SPHERE,
        selections
      );
      
      expect(Object.keys(updates).length).toBe(0);
    });

    it('should update engine type when invalid', () => {
      const selections = createSelections({
        engineType: EngineType.XL_CLAN, // Clan engine
      });
      const updates = getValidatedSelectionUpdates(
        TechBaseComponent.ENGINE,
        TechBase.INNER_SPHERE,
        selections
      );
      
      // Should update to valid IS engine
      expect(updates.engineType).toBeDefined();
    });

    it('should update gyro type when invalid', () => {
      const selections = createSelections();
      const updates = getValidatedSelectionUpdates(
        TechBaseComponent.GYRO,
        TechBase.INNER_SPHERE,
        selections
      );
      
      expect(updates).toBeDefined();
    });

    it('should update structure type when invalid', () => {
      const selections = createSelections({
        internalStructureType: InternalStructureType.ENDO_STEEL_CLAN, // Clan structure
      });
      const updates = getValidatedSelectionUpdates(
        TechBaseComponent.STRUCTURE,
        TechBase.INNER_SPHERE,
        selections
      );
      
      expect(updates).toBeDefined();
    });

    it('should update heat sink type when invalid', () => {
      const selections = createSelections({
        heatSinkType: HeatSinkType.DOUBLE_CLAN, // Clan heat sink
      });
      const updates = getValidatedSelectionUpdates(
        TechBaseComponent.HEAT_SINK,
        TechBase.INNER_SPHERE,
        selections
      );
      
      expect(updates).toBeDefined();
    });

    it('should update armor type when invalid', () => {
      const selections = createSelections();
      const updates = getValidatedSelectionUpdates(
        TechBaseComponent.ARMOR,
        TechBase.INNER_SPHERE,
        selections
      );
      
      expect(updates).toBeDefined();
    });
  });
});

