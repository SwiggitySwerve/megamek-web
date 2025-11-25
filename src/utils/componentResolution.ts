import { COMPONENT_DATABASE } from './componentDatabase';
import { ComponentCategory } from '../types/ComponentType';
import { ComponentTechBase, ComponentSpec } from '../types/ComponentDatabase';
import { TechBase } from '../types/TechBase';

const matchesName = (component: ComponentSpec, name: string): boolean =>
  component.name === name || component.id === name;

const extractBaseType = (name: string): string =>
  name
    .replace(/ \(Inner Sphere\)/gi, '')
    .replace(/ \(Clan\)/gi, '')
    .replace(/ \(IS\)/gi, '')
    .trim();

const getComponents = (category: ComponentCategory, techBase: ComponentTechBase): ComponentSpec[] =>
  COMPONENT_DATABASE[category]?.[techBase] ?? [];

const getDefaultComponent = (category: ComponentCategory, techBase: ComponentTechBase): ComponentSpec => {
  const components = getComponents(category, techBase);
  if (components.length === 0) {
    throw new Error(`No components available for ${techBase} ${category}`);
  }

  const defaultComponent = components.find((component) => component.isDefault);
  if (defaultComponent) {
    return defaultComponent;
  }

  const standardComponent = components.find(
    (component) => component.name === 'Standard' || component.techLevel === 'Introductory',
  );
  if (standardComponent) {
    return standardComponent;
  }

  return components[0];
};

const findSpecialEquivalent = (
  currentComponent: string,
  category: ComponentCategory,
  newTechBase: TechBase,
): string | null => {
  switch (category) {
    case 'myomer':
      if (currentComponent === 'Triple Strength Myomer' && newTechBase === 'Clan') return 'MASC';
      if (currentComponent === 'MASC' && newTechBase === 'Inner Sphere') return 'MASC';
      return null;
    case 'heatsink':
      if (currentComponent === 'Double' && newTechBase === 'Clan') return 'Double (Clan)';
      if (currentComponent === 'Double (Clan)' && newTechBase === 'Inner Sphere') return 'Double';
      if (currentComponent === 'Single' && newTechBase === 'Clan') return 'Double (Clan)';
      return null;
    case 'engine':
      if (currentComponent === 'XL' && newTechBase === 'Clan') return 'XL (Clan)';
      if (currentComponent === 'XL (Clan)' && newTechBase === 'Inner Sphere') return 'XL';
      if (currentComponent === 'Light' && newTechBase === 'Clan') return 'Light (Clan)';
      if (currentComponent === 'Light (Clan)' && newTechBase === 'Inner Sphere') return 'Light';
      return null;
    case 'armor':
      if (currentComponent === 'Ferro-Fibrous' && newTechBase === 'Clan') return 'Ferro-Fibrous (Clan)';
      if (currentComponent === 'Ferro-Fibrous (Clan)' && newTechBase === 'Inner Sphere') return 'Ferro-Fibrous';
      if (currentComponent === 'Stealth' && newTechBase === 'Clan') return 'Stealth (Clan)';
      if (currentComponent === 'Stealth (Clan)' && newTechBase === 'Inner Sphere') return 'Stealth';
      return null;
    case 'chassis':
      if (currentComponent === 'Endo Steel' && newTechBase === 'Clan') return 'Endo Steel (Clan)';
      if (currentComponent === 'Endo Steel (Clan)' && newTechBase === 'Inner Sphere') return 'Endo Steel';
      return null;
    case 'targeting':
      if (currentComponent === 'Artemis IV' && newTechBase === 'Clan') return 'Artemis IV (Clan)';
      if (currentComponent === 'Artemis IV (Clan)' && newTechBase === 'Inner Sphere') return 'Artemis IV';
      if (currentComponent === 'Targeting Computer' && newTechBase === 'Clan') return 'Targeting Computer (Clan)';
      if (currentComponent === 'Targeting Computer (Clan)' && newTechBase === 'Inner Sphere') return 'Targeting Computer';
      return null;
    case 'movement':
      if (currentComponent.includes('Improved Jump Jets') && newTechBase === 'Clan') {
        return 'Improved Jump Jets (Clan)';
      }
      if (currentComponent.includes('Jump Jets') && newTechBase === 'Clan') {
        return 'Jump Jets (Clan)';
      }
      if (currentComponent.includes('Improved Jump Jets (Clan)') && newTechBase === 'Inner Sphere') {
        return 'Improved Jump Jets';
      }
      if (currentComponent.includes('Jump Jets (Clan)') && newTechBase === 'Inner Sphere') {
        return 'Standard Jump Jets';
      }
      return null;
    default:
      return null;
  }
};

export function resolveComponentForTechBase(
  currentComponent: string,
  category: ComponentCategory,
  newTechBase: TechBase,
): string {
  const availableComponents = getComponents(category, newTechBase);
  if (availableComponents.length === 0) {
    return currentComponent;
  }

  const trimmedName = currentComponent?.trim();
  if (trimmedName && availableComponents.some((component) => matchesName(component, trimmedName))) {
    return trimmedName;
  }

  if (trimmedName) {
    const baseType = extractBaseType(trimmedName);
    const baseMatch = availableComponents.find(
      (component) => extractBaseType(component.name) === baseType || extractBaseType(component.id) === baseType,
    );
    if (baseMatch) {
      return baseMatch.name;
    }

    const specialEquivalent = findSpecialEquivalent(trimmedName, category, newTechBase);
    if (specialEquivalent) {
      const match = availableComponents.find((component) => component.name === specialEquivalent);
      if (match) {
        return match.name;
      }
    }
  }

  return getDefaultComponent(category, newTechBase).name;
}

