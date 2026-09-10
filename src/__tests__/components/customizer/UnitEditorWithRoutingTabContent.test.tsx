import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/components/customizer/tabs/ArmorTab', () => ({
  ArmorTab: () => null,
}));
jest.mock('@/components/customizer/tabs/CriticalSlotsTab', () => ({
  CriticalSlotsTab: () => null,
}));
jest.mock('@/components/customizer/tabs/EquipmentTab', () => ({
  EquipmentTab: () => null,
}));
jest.mock('@/components/customizer/tabs/OverviewTab', () => ({
  OverviewTab: () => null,
}));
jest.mock('@/components/customizer/tabs/PreviewTab', () => ({
  PreviewTab: () => null,
}));
jest.mock('@/components/customizer/tabs/StructureTab', () => ({
  StructureTab: () => null,
}));

import { UnitEditorWithRoutingTabContent } from '@/components/customizer/UnitEditorWithRoutingTabContent';
import {
  createNewUnitStore,
  UnitStoreContext,
} from '@/stores/unit/useUnitStore';
import { TechBase } from '@/types/enums/TechBase';

function createStore(id: string, name: string, overview: string) {
  const store = createNewUnitStore({
    id,
    name,
    tonnage: 50,
    techBase: TechBase.INNER_SPHERE,
  });
  store.setState({ fluff: { overview } });
  return store;
}

const tabProps = {
  activeTabId: 'fluff' as const,
  selectedEquipmentId: null,
  onSelectEquipment: jest.fn(),
};

describe('UnitEditorWithRoutingTabContent fluff route', () => {
  it('mounts an accessible store-bound editor and switches isolated units', () => {
    const first = createStore(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'First A',
      'First overview',
    );
    const second = createStore(
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'Second B',
      'Second overview',
    );

    const { rerender } = render(
      <UnitStoreContext.Provider value={first}>
        <UnitEditorWithRoutingTabContent {...tabProps} />
      </UnitStoreContext.Provider>,
    );

    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'id',
      'tabpanel-fluff',
    );
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      'customizer-tab-fluff',
    );
    expect(screen.getByLabelText('Overview')).toHaveValue('First overview');

    fireEvent.change(screen.getByLabelText('Combat Role'), {
      target: { value: 'Brawler' },
    });
    expect(first.getState().role).toBe('Brawler');

    rerender(
      <UnitStoreContext.Provider value={second}>
        <UnitEditorWithRoutingTabContent {...tabProps} />
      </UnitStoreContext.Provider>,
    );

    expect(screen.getByLabelText('Overview')).toHaveValue('Second overview');
    fireEvent.change(screen.getByLabelText('Overview'), {
      target: { value: 'Updated second overview' },
    });

    expect(second.getState().fluff?.overview).toBe('Updated second overview');
    expect(first.getState().fluff?.overview).toBe('First overview');
  });
});
