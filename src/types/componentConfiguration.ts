/**
 * Component Configuration Types - STUB FILE
 * Types for component configuration
 * TODO: Replace with spec-driven implementation
 */

export interface ComponentConfiguration {
  id?: string;
  type: string;
  variant?: string;
  settings?: Record<string, unknown>;
  techBase?: 'Inner Sphere' | 'Clan' | string;
}

export interface EngineConfiguration extends ComponentConfiguration {
  type: 'engine';
  rating: number;
  engineType: string;
}

export interface ArmorConfiguration extends ComponentConfiguration {
  type: 'armor';
  armorType: string;
  allocation: Record<string, number>;
}

export interface WeaponConfiguration extends ComponentConfiguration {
  type: 'weapon';
  linkedAmmo?: string;
  firingMode?: string;
}

export interface ConfigurationChange {
  componentId: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  timestamp: Date;
}


