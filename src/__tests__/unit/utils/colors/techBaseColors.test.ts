import {
  getTechBaseColors,
  getTechBaseModeColors,
  getTechBaseBadgeClass,
  getTechBaseShortName,
  getTechBaseModeShortName,
  TECH_BASE_COLORS,
  TECH_BASE_MODE_COLORS,
} from '@/utils/colors/techBaseColors';
import { TechBase } from '@/types/enums/TechBase';
import { TechBaseMode } from '@/types/construction/TechBaseConfiguration';

describe('techBaseColors', () => {
  describe('getTechBaseColors', () => {
    it('should return colors for Inner Sphere', () => {
      const colors = getTechBaseColors(TechBase.INNER_SPHERE);
      expect(colors).toEqual(TECH_BASE_COLORS[TechBase.INNER_SPHERE]);
      expect(colors.text).toBe('text-blue-400');
      expect(colors.bg).toBe('bg-blue-900/50');
      expect(colors.border).toBe('border-blue-700');
    });

    it('should return colors for Clan', () => {
      const colors = getTechBaseColors(TechBase.CLAN);
      expect(colors).toEqual(TECH_BASE_COLORS[TechBase.CLAN]);
      expect(colors.text).toBe('text-green-400');
      expect(colors.bg).toBe('bg-green-900/50');
      expect(colors.border).toBe('border-green-700');
    });

    it('should return default colors for invalid tech base', () => {
      // @ts-expect-error - testing invalid input
      const colors = getTechBaseColors('invalid');
      expect(colors.text).toBe('text-slate-400');
      expect(colors.bg).toBe('bg-slate-900/50');
    });
  });

  describe('getTechBaseModeColors', () => {
    it('should return colors for Inner Sphere mode', () => {
      const colors = getTechBaseModeColors(TechBaseMode.INNER_SPHERE);
      expect(colors).toEqual(TECH_BASE_MODE_COLORS.inner_sphere);
    });

    it('should return colors for Clan mode', () => {
      const colors = getTechBaseModeColors(TechBaseMode.CLAN);
      expect(colors).toEqual(TECH_BASE_MODE_COLORS.clan);
    });

    it('should return colors for Mixed mode', () => {
      const colors = getTechBaseModeColors(TechBaseMode.MIXED);
      expect(colors).toEqual(TECH_BASE_MODE_COLORS.mixed);
      expect(colors.text).toBe('text-purple-400');
      expect(colors.bg).toBe('bg-purple-900/50');
    });

    it('should return default colors for invalid mode', () => {
      // @ts-expect-error - testing invalid input
      const colors = getTechBaseModeColors('invalid');
      expect(colors.text).toBe('text-slate-400');
    });
  });

  describe('getTechBaseBadgeClass', () => {
    it('should return badge class for Inner Sphere', () => {
      const badgeClass = getTechBaseBadgeClass(TechBase.INNER_SPHERE);
      expect(badgeClass).toContain('bg-blue-700');
      expect(badgeClass).toContain('text-blue-100');
      expect(badgeClass).toContain('px-2');
      expect(badgeClass).toContain('py-0.5');
      expect(badgeClass).toContain('rounded');
      expect(badgeClass).toContain('text-xs');
      expect(badgeClass).toContain('font-medium');
    });

    it('should return badge class for Clan', () => {
      const badgeClass = getTechBaseBadgeClass(TechBase.CLAN);
      expect(badgeClass).toContain('bg-green-700');
      expect(badgeClass).toContain('text-green-100');
    });
  });

  describe('getTechBaseShortName', () => {
    it('should return "IS" for Inner Sphere', () => {
      expect(getTechBaseShortName(TechBase.INNER_SPHERE)).toBe('IS');
    });

    it('should return "Clan" for Clan', () => {
      expect(getTechBaseShortName(TechBase.CLAN)).toBe('Clan');
    });

    it('should return string representation for unknown tech base', () => {
      // @ts-expect-error - testing invalid input
      expect(getTechBaseShortName('unknown')).toBe('unknown');
    });
  });

  describe('getTechBaseModeShortName', () => {
    it('should return "IS" for Inner Sphere mode', () => {
      expect(getTechBaseModeShortName(TechBaseMode.INNER_SPHERE)).toBe('IS');
    });

    it('should return "Clan" for Clan mode', () => {
      expect(getTechBaseModeShortName(TechBaseMode.CLAN)).toBe('Clan');
    });

    it('should return "Mixed" for Mixed mode', () => {
      expect(getTechBaseModeShortName(TechBaseMode.MIXED)).toBe('Mixed');
    });

    it('should return string representation for unknown mode', () => {
      // @ts-expect-error - testing invalid input
      expect(getTechBaseModeShortName('unknown')).toBe('unknown');
    });
  });
});

