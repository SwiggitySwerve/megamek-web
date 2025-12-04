import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewTabModal } from '@/components/customizer/tabs/NewTabModal';

describe('NewTabModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onCreateUnit: jest.fn().mockReturnValue('unit-1'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open', () => {
    render(<NewTabModal {...defaultProps} />);
    
    expect(screen.getByText('Create New Unit')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<NewTabModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Create New Unit')).not.toBeInTheDocument();
  });

  it('should display mode tabs', () => {
    render(<NewTabModal {...defaultProps} />);
    
    expect(screen.getByText('New Unit')).toBeInTheDocument();
    expect(screen.getByText('Copy Current')).toBeInTheDocument();
    expect(screen.getByText('Import Data')).toBeInTheDocument();
  });

  it('should call onCreateUnit when create button is clicked', async () => {
    const user = userEvent.setup();
    render(<NewTabModal {...defaultProps} />);
    
    const createButton = screen.getByText(/Create/i);
    await user.click(createButton);
    
    expect(defaultProps.onCreateUnit).toHaveBeenCalled();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<NewTabModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText(/Close/i);
    await user.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});

