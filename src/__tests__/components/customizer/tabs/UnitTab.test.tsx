import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

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

    const tab = screen.getByRole('tab', { name: 'Atlas AS7-D' });
    if (tab) {
      await user.click(tab);
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
    }
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<UnitTab {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Close Atlas AS7-D' }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelect).not.toHaveBeenCalled();
  });

  it('should enter edit mode on double-click', async () => {
    const user = userEvent.setup();
    render(<UnitTab {...defaultProps} />);

    const tab = screen.getByRole('tab', { name: 'Atlas AS7-D' });
    if (tab) {
      await user.dblClick(tab);
      const input = screen.getByDisplayValue('Atlas AS7-D');
      expect(input).toBeInTheDocument();
    }
  });

  it('should call onRename when name is edited', async () => {
    const user = userEvent.setup();
    render(<UnitTab {...defaultProps} />);

    const tab = screen.getByRole('tab', { name: 'Atlas AS7-D' });
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
    const { container } = render(<UnitTab {...defaultProps} isActive={true} />);

    // The outer div has the bg-surface-raised class when active
    const tab = container.firstChild as HTMLElement;
    expect(tab).toHaveClass('bg-surface-raised');
  });

  it('should show modification indicator', () => {
    render(
      <UnitTab
        {...defaultProps}
        tab={{ ...defaultProps.tab, isModified: true }}
      />,
    );

    // The modification indicator is now a colored dot with title "Changes not saved to library"
    const indicator = screen.getByTitle('Changes not saved to library');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('bg-accent');
  });
});
