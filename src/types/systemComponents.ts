/**
 * System Components Types
 * Types for system components (Engine, Gyro, etc.)
 */

// Engine Types
export enum EngineType {
  STANDARD = 'Standard',
  XL = 'XL',
  XL_INNER_SPHERE = 'XL (IS)',
  XL_CLAN = 'XL (Clan)',
  LIGHT = 'Light',
  XXL = 'XXL',
  COMPACT = 'Compact',
  ICE = 'ICE',
  FUEL_CELL = 'Fuel Cell',
}

// Gyro Types
export enum GyroType {
  STANDARD = 'Standard',
  XL = 'XL',
  COMPACT = 'Compact',
  HEAVY_DUTY = 'Heavy-Duty',
}

// Cockpit Types
export enum CockpitType {
  STANDARD = 'Standard',
  SMALL = 'Small',
  COMMAND_CONSOLE = 'Command Console',
  TORSO_MOUNTED = 'Torso-Mounted',
  PRIMITIVE = 'Primitive',
}

// Structure Types
export enum StructureType {
  STANDARD = 'Standard',
  ENDO_STEEL = 'Endo Steel',
  ENDO_STEEL_IS = 'Endo Steel (IS)',
  ENDO_STEEL_CLAN = 'Endo Steel (Clan)',
  COMPOSITE = 'Composite',
  REINFORCED = 'Reinforced',
  INDUSTRIAL = 'Industrial',
}

// Armor Types
export enum ArmorType {
  STANDARD = 'Standard',
  FERRO_FIBROUS = 'Ferro-Fibrous',
  FERRO_FIBROUS_CLAN = 'Ferro-Fibrous (Clan)',
  LIGHT_FERRO = 'Light Ferro-Fibrous',
  HEAVY_FERRO = 'Heavy Ferro-Fibrous',
  STEALTH = 'Stealth',
  REACTIVE = 'Reactive',
  REFLECTIVE = 'Reflective',
  HARDENED = 'Hardened',
}

// Heat Sink Types
export enum HeatSinkType {
  SINGLE = 'Single',
  DOUBLE = 'Double',
  DOUBLE_IS = 'Double (IS)',
  DOUBLE_CLAN = 'Double (Clan)',
  COMPACT = 'Compact',
  LASER = 'Laser',
}

// Jump Jet Types
export enum JumpJetType {
  STANDARD = 'Standard',
  IMPROVED = 'Improved',
  MECHANICAL = 'Mechanical',
}

// Component type enum
export enum ComponentType {
  ENGINE = 'Engine',
  GYRO = 'Gyro',
  COCKPIT = 'Cockpit',
  STRUCTURE = 'Structure',
  ARMOR = 'Armor',
  HEAT_SINK = 'Heat Sink',
  JUMP_JET = 'Jump Jet',
  WEAPON = 'Weapon',
  AMMO = 'Ammo',
  EQUIPMENT = 'Equipment',
  ACTUATOR = 'Actuator',
}
