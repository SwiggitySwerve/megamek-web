import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveUnitDialog } from '@/components/customizer/dialogs/SaveUnitDialog';
import { unitNameValidator } from '@/services/units/UnitNameValidator';

// Mock ModalOverlay
jest.mock('@/components/customizer/dialogs/ModalOverlay', () => ({
  ModalOverlay: ({ children, isOpen, onClose: _onClose }: { children: React.ReactNode; isOpen: boolean; onClose: () => void }) =>
    isOpen ? <div data-testid="modal-overlay">{children}</div> : null,
}));

// Mock UnitNameValidator
jest.mock('@/services/units/UnitNameValidator', () => ({
  unitNameValidator: {
    validateUnitName: jest.fn(),
    generateUniqueName: jest.fn(),
    buildFullName: jest.fn((chassis: string, variant: string) => `${chassis} ${variant}`),
  },
}));

describe('SaveUnitDialog', () => {
  const defaultProps = {
    isOpen: true,
    initialChassis: 'Atlas',
    initialVariant: 'AS7-D',
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render when open', () => {
    render(<SaveUnitDialog {...defaultProps} />);
    
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Atlas')).toBeInTheDocument();
    expect(screen.getByDisplayValue('AS7-D')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<SaveUnitDialog {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });

  it('should reset form when dialog opens', () => {
    const { rerender } = render(<SaveUnitDialog {...defaultProps} isOpen={false} />);
    
    rerender(<SaveUnitDialog {...defaultProps} isOpen={true} initialChassis="New" initialVariant="Variant" />);
    
    expect(screen.getByDisplayValue('New')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Variant')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SaveUnitDialog {...defaultProps} />);
    
    const cancelButton = screen.getByText(/Cancel/i);
    await user.click(cancelButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should validate name when inputs change', async () => {
    const user = userEvent.setup({ delay: null });
    (unitNameValidator.validateUnitName as jest.Mock).mockResolvedValue({
      isValid: true,
      isCanonicalConflict: false,
      isCustomConflict: false,
    });
    
    render(<SaveUnitDialog {...defaultProps} />);
    
    const chassisInput = screen.getByDisplayValue('Atlas');
    await user.clear(chassisInput);
    await user.type(chassisInput, 'New');
    
    jest.advanceTimersByTime(350);
    
    await waitFor(() => {
      expect(unitNameValidator.validateUnitName).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('should disable save button when validating', () => {
    (unitNameValidator.validateUnitName as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    
    render(<SaveUnitDialog {...defaultProps} />);
    
    const saveButton = screen.getByText(/Save/i);
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when name is valid', async () => {
    (unitNameValidator.validateUnitName as jest.Mock).mockResolvedValue({
      isValid: true,
      isCanonicalConflict: false,
      isCustomConflict: false,
    });
    
    render(<SaveUnitDialog {...defaultProps} />);
    
    // Wait for validation to complete
    await waitFor(() => {
      const saveButton = screen.getByText(/Save/i);
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('should disable save button when canonical conflict', async () => {
    (unitNameValidator.validateUnitName as jest.Mock).mockResolvedValue({
      isValid: false,
      isCanonicalConflict: true,
      isCustomConflict: false,
      errorMessage: 'Conflicts with official unit',
    });
    
    render(<SaveUnitDialog {...defaultProps} />);
    
    await waitFor(() => {
      const saveButton = screen.getByText(/Save/i);
      expect(saveButton).toBeDisabled();
    });
    
    expect(screen.getByText(/Conflicts with official unit/i)).toBeInTheDocument();
  });

  it('should call onSave when save button is clicked with valid name', async () => {
    const user = userEvent.setup({ delay: null });
    (unitNameValidator.validateUnitName as jest.Mock).mockResolvedValue({
      isValid: true,
      isCanonicalConflict: false,
      isCustomConflict: false,
    });
    
    render(<SaveUnitDialog {...defaultProps} />);
    
    await waitFor(() => {
      const saveButton = screen.getByText(/Save/i);
      expect(saveButton).not.toBeDisabled();
    });
    
    const saveButton = screen.getByText(/Save/i);
    await user.click(saveButton);
    
    expect(defaultProps.onSave).toHaveBeenCalledWith('Atlas', 'AS7-D');
  });

  it('should call onSave with overwrite ID when custom conflict', async () => {
    const user = userEvent.setup({ delay: null });
    (unitNameValidator.validateUnitName as jest.Mock).mockResolvedValue({
      isValid: false,
      isCanonicalConflict: false,
      isCustomConflict: true,
      conflictingUnitId: 'conflict-id',
    });
    
    render(<SaveUnitDialog {...defaultProps} />);
    
    await waitFor(() => {
      const saveButton = screen.getByText(/Save/i);
      expect(saveButton).not.toBeDisabled();
    });
    
    const saveButton = screen.getByText(/Save/i);
    await user.click(saveButton);
    
    expect(defaultProps.onSave).toHaveBeenCalledWith('Atlas', 'AS7-D', 'conflict-id');
  });

  it('should show suggested name when available', async () => {
    (unitNameValidator.validateUnitName as jest.Mock).mockResolvedValue({
      isValid: false,
      isCanonicalConflict: false,
      isCustomConflict: true,
      suggestedName: 'Atlas AS7-D-2',
    });
    
    render(<SaveUnitDialog {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText(/AS7-D-2/i)).toBeInTheDocument();
    });
  });

  it('should have generateUniqueName available for suggesting names', () => {
    // Verify the mock is set up correctly for the suggest flow
    (unitNameValidator.generateUniqueName as jest.Mock).mockResolvedValue({
      chassis: 'Atlas',
      variant: 'AS7-D-2',
    });
    
    // The generateUniqueName function should be available and mockable
    expect(unitNameValidator.generateUniqueName).toBeDefined();
  });
});

