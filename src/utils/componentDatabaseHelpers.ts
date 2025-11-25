import { COMPONENT_DATABASE } from './componentDatabase';
import { ComponentCategory } from '../types/ComponentType';
import { ComponentTechBase, ComponentSpec } from '../types/ComponentDatabase';
import { RulesLevel } from '../types/TechBase';

const RULES_LEVEL_ORDER: Record<string, number> = {
  Introductory: 0,
  Standard: 1,
  Advanced: 2,
  Experimental: 3,
};

const getRulesOrder = (level: string | undefined): number =>
  level ? RULES_LEVEL_ORDER[level] ?? RULES_LEVEL_ORDER.Standard : RULES_LEVEL_ORDER.Standard;

const findComponent = (
  name: string,
  category: ComponentCategory,
  techBase: ComponentTechBase,
): ComponentSpec | null => {
  const categoryData = COMPONENT_DATABASE[category];
  if (!categoryData) {
    return null;
  }

  const components = categoryData[techBase];
  if (!components) {
    return null;
  }

  return components.find((component) => component.name === name || component.id === name) ?? null;
};

export function isComponentAvailable(
  componentName: string,
  category: ComponentCategory,
  techBase: ComponentTechBase,
  rulesLevel?: RulesLevel | string,
): boolean {
  const component = findComponent(componentName, category, techBase);
  if (!component) {
    return false;
  }

  if (!rulesLevel) {
    return true;
  }

  return getRulesOrder(component.rulesLevel as string) <= getRulesOrder(rulesLevel);
}

