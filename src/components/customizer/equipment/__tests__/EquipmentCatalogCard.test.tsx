import { render, screen } from '@testing-library/react';
import React from 'react';

import { RulesLevel } from '@/types/enums/RulesLevel';
import { TechBase } from '@/types/enums/TechBase';
import { EquipmentCategory, type IEquipmentItem } from '@/types/equipment';

import { EquipmentCatalogCard } from '../EquipmentCatalogCard';

const laser: IEquipmentItem = {
  id: 'small-laser',
  name: 'Small Laser',
  category: EquipmentCategory.ENERGY_WEAPON,
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  weight: 0.5,
  criticalSlots: 1,
  costCBills: 11250,
  battleValue: 9,
  introductionYear: 2300,
};

function setup(
  props: Partial<React.ComponentProps<typeof EquipmentCatalogCard>> = {},
) {
  const onInspect = jest.fn();
  const onAdd = jest.fn();
  const onAddAndPlace = jest.fn();
  render(
    <EquipmentCatalogCard
      equipment={laser}
      expanded={false}
      readOnly={false}
      onInspect={onInspect}
      onAdd={onAdd}
      onAddAndPlace={onAddAndPlace}
      {...props}
    />,
  );
  return { onInspect, onAdd, onAddAndPlace };
}

it('exposes Add Small Laser on the collapsed row without Add and place', () => {
  setup({ expanded: false });
  expect(screen.getByRole('button', { name: 'Add Small Laser' })).toBeEnabled();
  expect(
    screen.queryByRole('button', { name: 'Add and place Small Laser' }),
  ).not.toBeInTheDocument();
});

it('exposes Add and place once details are expanded', () => {
  setup({ expanded: true });
  expect(screen.getByRole('button', { name: 'Add Small Laser' })).toBeEnabled();
  expect(
    screen.getByRole('button', { name: 'Add and place Small Laser' }),
  ).toBeEnabled();
});

it('disables add actions when readOnly', () => {
  setup({ expanded: true, readOnly: true });
  expect(
    screen.getByRole('button', { name: 'Add Small Laser' }),
  ).toBeDisabled();
  expect(
    screen.getByRole('button', { name: 'Add and place Small Laser' }),
  ).toBeDisabled();
});
