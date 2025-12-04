import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnitTab } from '@/components/customizer/tabs/UnitTab';

describe('UnitTab', () => {
  const defaultProps = {
    tab: {
      id: 'tab-1',
      name: 'Atlas AS7-D',
      isModified: false,
    },
    isActive: false,
    canClose: true,
    onSelect: jest.fn(),
    onClose: jest.fn(),
    onRename: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render tab name', () => {
    render(<UnitTab {...defaultProps} />);
    
    expect(screen.getByText('Atlas AS7-D')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', async () => {
    const user = userEvent.setup();
    render(<UnitTab {...defaultProps} />);
    
    const tab = screen.getByText('Atlas AS7-D').closest('div');
    if (tab) {
      await user.click(tab);
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
    }
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<UnitTab {...defaultProps} />);
    
    const closeButton = screen.getByLabelText(/Close/i);
    await user.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should enter edit mode on double-click', async () => {
    const user = userEvent.setup();
    render(<UnitTab {...defaultProps} />);
    
    const tab = screen.getByText('Atlas AS7-D').closest('div');
    if (tab) {
      await user.dblClick(tab);
      const input = screen.getByDisplayValue('Atlas AS7-D');
      expect(input).toBeInTheDocument();
    }
  });

  it('should call onRename when name is edited', async () => {
    const user = userEvent.setup();
    render(<UnitTab {...defaultProps} />);
    
    const tab = screen.getByText('Atlas AS7-D').closest('div');
    if (tab) {
      await user.dblClick(tab);
      const input = screen.getByDisplayValue('Atlas AS7-D');
      await user.clear(input);
      await user.type(input, 'Marauder');
      await user.keyboard('{Enter}');
      
      expect(defaultProps.onRename).toHaveBeenCalledWith('Marauder');
    }
  });

  it('should highlight active tab', () => {
    render(<UnitTab {...defaultProps} isActive={true} />);
    
    const tab = screen.getByText('Atlas AS7-D').closest('div');
    expect(tab).toHaveClass('bg-slate-700');
  });

  it('should show modification indicator', () => {
    render(<UnitTab {...defaultProps} tab={{ ...defaultProps.tab, isModified: true }} />);
    
    expect(screen.getByText('●')).toBeInTheDocument();
  });
});

