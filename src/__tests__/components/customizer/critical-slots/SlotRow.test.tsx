import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SlotRow } from '@/components/customizer/critical-slots/SlotRow';
import { SlotContent } from '@/components/customizer/critical-slots/CriticalSlotsDisplay';

describe('SlotRow', () => {
  const defaultProps = {
    slot: { index: 0, type: 'empty' as const },
    isAssignable: false,
    isSelected: false,
    onClick: jest.fn(),
    onDrop: jest.fn(),
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty slot', () => {
    render(<SlotRow {...defaultProps} />);
    
    expect(screen.getByText('- Empty -')).toBeInTheDocument();
  });

  it('should render equipment slot', () => {
    const slot: SlotContent = {
      index: 0,
      type: 'equipment',
      name: 'Medium Laser',
      equipmentId: 'equip-1',
    };
    
    render(<SlotRow {...defaultProps} slot={slot} />);
    
    expect(screen.getByText('Medium Laser')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<SlotRow {...defaultProps} />);
    
    const slot = screen.getByText('- Empty -').closest('div');
    if (slot) {
      await user.click(slot);
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should call onRemove on double-click', async () => {
    const user = userEvent.setup();
    const slot: SlotContent = {
      index: 0,
      type: 'equipment',
      name: 'Medium Laser',
      equipmentId: 'equip-1',
    };
    
    render(<SlotRow {...defaultProps} slot={slot} />);
    
    const slotElement = screen.getByText('Medium Laser').closest('div');
    if (slotElement) {
      await user.dblClick(slotElement);
      expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
    }
  });

  it('should highlight assignable slots', () => {
    render(<SlotRow {...defaultProps} isAssignable={true} />);
    
    const slot = screen.getByText('- Empty -').closest('div');
    expect(slot).toHaveClass('bg-green-900/60');
  });

  it('should highlight selected slots', () => {
    render(<SlotRow {...defaultProps} isSelected={true} />);
    
    const slot = screen.getByText('- Empty -').closest('div');
    expect(slot).toHaveClass('ring-2');
  });
});

