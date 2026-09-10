import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  GlobalLoadoutTray,
  LoadoutEquipmentItem,
} from '@/components/customizer/equipment/GlobalLoadoutTray';
import { MechLocation } from '@/types/construction';
import { EquipmentCategory } from '@/types/equipment';

describe('GlobalLoadoutTray', () => {
  const createEquipment = (
    overrides?: Partial<LoadoutEquipmentItem>,
  ): LoadoutEquipmentItem => ({
    instanceId: 'equip-1',
    equipmentId: 'medium-laser',
    name: 'Medium Laser',
    category: EquipmentCategory.ENERGY_WEAPON,
    weight: 1,
    criticalSlots: 1,
    isAllocated: false,
    isRemovable: true,
    ...overrides,
  });

  const defaultProps = {
    equipment: [createEquipment()],
    equipmentCount: 1,
    onRemoveEquipment: jest.fn(),
    onRemoveAllEquipment: jest.fn(),
    isExpanded: true,
    onToggleExpand: jest.fn(),
    selectedEquipmentId: null,
    onSelectEquipment: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render equipment tray', () => {
    render(<GlobalLoadoutTray {...defaultProps} />);

    expect(screen.getByText('Medium Laser')).toBeInTheDocument();
  });

  it('should display equipment count', () => {
    render(<GlobalLoadoutTray {...defaultProps} equipmentCount={5} />);

    expect(screen.getByText(/5/i)).toBeInTheDocument();
  });

  it('should have clickable section headers', async () => {
    const user = userEvent.setup();
    render(<GlobalLoadoutTray {...defaultProps} />);

    // Click on the "Unallocated" section header button
    const sectionButton = screen.getByRole('button', { name: /^Unassigned/i });
    await user.click(sectionButton);

    // Verify the section header was found and clicked (no error = success)
    expect(sectionButton).toBeInTheDocument();
  });

  it('should call onSelectEquipment when equipment is clicked', async () => {
    const user = userEvent.setup();
    render(<GlobalLoadoutTray {...defaultProps} />);

    const equipment = screen.getByText('Medium Laser');
    await user.click(equipment);

    expect(defaultProps.onSelectEquipment).toHaveBeenCalledWith('equip-1');
  });

  it('should call onRemoveEquipment when remove button is clicked twice (with confirmation)', async () => {
    const user = userEvent.setup();
    render(<GlobalLoadoutTray {...defaultProps} />);

    // Find the remove button by title
    const removeButton = screen.getByTitle('Remove from unit');

    // First click shows confirmation
    await user.click(removeButton);
    expect(defaultProps.onRemoveEquipment).not.toHaveBeenCalled();

    // Button should now show confirmation state
    const confirmButton = screen.getByTitle('Click again to confirm');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton.querySelector('svg')).toHaveAttribute(
      'data-icon-name',
      'check',
    );

    // Second click confirms and removes
    await user.click(confirmButton);
    expect(defaultProps.onRemoveEquipment).toHaveBeenCalledWith('equip-1');
  });

  it('keeps non-removable equipment in the collapsed fixed-systems group', async () => {
    const user = userEvent.setup();
    const equipment = createEquipment({ isRemovable: false });
    render(<GlobalLoadoutTray {...defaultProps} equipment={[equipment]} />);

    expect(screen.queryByTitle('Remove from unit')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fixed systems 1' }));
    expect(screen.getByTitle('Managed by configuration')).toBeInTheDocument();
  });

  it('should display mounted equipment in mounted section', () => {
    const allocated = createEquipment({
      instanceId: 'allocated-1',
      name: 'Allocated Laser',
      isAllocated: true,
      location: 'Right Torso',
    });

    render(<GlobalLoadoutTray {...defaultProps} equipment={[allocated]} />);

    expect(screen.getByText('Allocated Laser')).toBeInTheDocument();
    expect(screen.getByText(/RT/i)).toBeInTheDocument();
  });

  it('should display unallocated equipment in unallocated section', () => {
    const unallocated = createEquipment({
      instanceId: 'unallocated-1',
      name: 'Unallocated Laser',
      isAllocated: false,
    });

    render(<GlobalLoadoutTray {...defaultProps} equipment={[unallocated]} />);

    expect(screen.getByText('Unallocated Laser')).toBeInTheDocument();
  });

  it('should highlight selected equipment', () => {
    const { container } = render(
      <GlobalLoadoutTray {...defaultProps} selectedEquipmentId="equip-1" />,
    );

    // The ring-1 class is applied to the item row wrapper div
    const highlightedItem = container.querySelector('.ring-1');
    expect(highlightedItem).toBeInTheDocument();
  });

  it('uses per-instance availability in the desktop context menu', () => {
    const getAvailableLocationsForEquipment = jest.fn(() => [
      {
        location: MechLocation.LEFT_ARM,
        label: 'Left Arm',
        availableSlots: 4,
        canFit: true,
      },
    ]);
    render(
      <GlobalLoadoutTray
        {...defaultProps}
        getAvailableLocationsForEquipment={getAvailableLocationsForEquipment}
      />,
    );

    fireEvent.contextMenu(
      screen.getByRole('button', {
        name: 'Select Medium Laser in unallocated loadout',
      }),
    );

    expect(getAvailableLocationsForEquipment).toHaveBeenCalledWith('equip-1');
    expect(
      screen.getByRole('button', { name: /add to left arm/i }),
    ).toBeInTheDocument();
  });

  it('should accept available locations prop', () => {
    const availableLocations = [
      {
        location: MechLocation.RIGHT_TORSO,
        label: 'Right Torso',
        availableSlots: 5,
        canFit: true,
      },
    ];

    render(
      <GlobalLoadoutTray
        {...defaultProps}
        onQuickAssign={jest.fn()}
        availableLocations={availableLocations}
        selectedEquipmentId="equip-1"
      />,
    );

    // Equipment name appears in both the item row and the selection footer
    expect(screen.getAllByText('Medium Laser').length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it('should accept onUnassignEquipment prop', () => {
    const allocated = createEquipment({
      instanceId: 'allocated-1',
      name: 'Allocated Laser',
      isAllocated: true,
      location: 'Right Torso',
    });

    render(
      <GlobalLoadoutTray
        {...defaultProps}
        equipment={[allocated]}
        onUnassignEquipment={jest.fn()}
        selectedEquipmentId="allocated-1"
      />,
    );

    // Equipment name appears in both the item row and the selection footer
    expect(
      screen.getAllByText('Allocated Laser').length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('should group equipment by category', () => {
    const equipment = [
      createEquipment({
        instanceId: 'e1',
        name: 'Laser',
        category: EquipmentCategory.ENERGY_WEAPON,
      }),
      createEquipment({
        instanceId: 'e2',
        name: 'AC/20',
        category: EquipmentCategory.BALLISTIC_WEAPON,
      }),
    ];

    render(<GlobalLoadoutTray {...defaultProps} equipment={equipment} />);

    expect(screen.getByText(/Energy/i)).toBeInTheDocument();
    expect(screen.getByText(/Ballistic/i)).toBeInTheDocument();
  });

  it('should display empty state when no equipment', () => {
    render(
      <GlobalLoadoutTray {...defaultProps} equipment={[]} equipmentCount={0} />,
    );

    expect(screen.getByText(/No equipment/i)).toBeInTheDocument();
  });

  describe('Loadout grouping and actions', () => {
    it('uses category grouping by default and allows location grouping', async () => {
      const user = userEvent.setup();
      const equipment = [
        createEquipment({
          instanceId: 'energy-1',
          name: 'Medium Laser',
          category: EquipmentCategory.ENERGY_WEAPON,
        }),
        createEquipment({
          instanceId: 'ballistic-1',
          name: 'AC/10',
          category: EquipmentCategory.BALLISTIC_WEAPON,
          isAllocated: true,
          location: 'Right Torso',
        }),
      ];
      render(<GlobalLoadoutTray {...defaultProps} equipment={equipment} />);

      await user.click(
        screen.getByRole('button', { name: 'More loadout actions' }),
      );
      expect(
        screen.getByRole('button', { name: 'category', pressed: true }),
      ).toBeInTheDocument();
      expect(screen.getByText('Energy')).toBeInTheDocument();
      expect(screen.getByText('Ballistic')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'location' }));

      expect(screen.getByText('By location')).toBeInTheDocument();
      await user.click(
        screen.getByRole('button', { name: 'More loadout actions' }),
      );
      expect(
        screen.getByRole('button', { name: 'location', pressed: true }),
      ).toBeInTheDocument();
      expect(screen.getByText('Right Torso')).toBeInTheDocument();
    });

    it('expands duplicate equipment into individual selectable and removable instances', async () => {
      const user = userEvent.setup();
      const equipment = [
        createEquipment({ instanceId: 'laser-1' }),
        createEquipment({ instanceId: 'laser-2' }),
      ];
      const getAvailableLocationsForEquipment = jest.fn(() => []);
      render(
        <GlobalLoadoutTray
          {...defaultProps}
          equipment={equipment}
          getAvailableLocationsForEquipment={getAvailableLocationsForEquipment}
        />,
      );

      const duplicateGroup = screen.getByRole('button', {
        name: 'Show 2 instances of Medium Laser in Unassigned',
      });
      expect(
        screen.queryByRole('button', {
          name: 'Select Medium Laser in unallocated loadout',
        }),
      ).not.toBeInTheDocument();

      await user.click(duplicateGroup);

      expect(
        screen.getAllByRole('button', {
          name: 'Select Medium Laser in unallocated loadout',
        }),
      ).toHaveLength(2);
      const instanceButtons = screen.getAllByRole('button', {
        name: 'Select Medium Laser in unallocated loadout',
      });
      await user.click(instanceButtons[1]);
      expect(defaultProps.onSelectEquipment).toHaveBeenCalledWith('laser-2');

      fireEvent.contextMenu(instanceButtons[1]);
      expect(getAvailableLocationsForEquipment).toHaveBeenCalledWith('laser-2');
    });

    it('keeps fixed systems collapsed until explicitly opened', async () => {
      const user = userEvent.setup();
      const fixedSystem = createEquipment({
        instanceId: 'fixed-case',
        name: 'CASE',
        isRemovable: false,
      });
      render(<GlobalLoadoutTray {...defaultProps} equipment={[fixedSystem]} />);

      const section = screen.getByRole('button', { name: 'Fixed systems 1' });
      expect(section).toHaveAttribute('aria-expanded', 'false');
      expect(
        screen.queryByTitle('Managed by configuration'),
      ).not.toBeInTheDocument();

      await user.click(section);

      expect(section).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTitle('Managed by configuration')).toBeInTheDocument();
    });

    it('moves bulk removal into the loadout actions overflow', async () => {
      const user = userEvent.setup();
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
      render(<GlobalLoadoutTray {...defaultProps} />);

      expect(
        screen.queryByRole('button', { name: /remove all removable/i }),
      ).not.toBeInTheDocument();

      await user.click(
        screen.getByRole('button', { name: 'More loadout actions' }),
      );
      await user.click(
        screen.getByRole('button', { name: 'Remove all removable (1)' }),
      );

      expect(defaultProps.onRemoveAllEquipment).toHaveBeenCalledTimes(1);
      confirmSpy.mockRestore();
    });
  });
});
