import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EquipmentFilters } from '@/components/customizer/equipment/EquipmentFilters';
import { TechBase } from '@/types/enums/TechBase';
import { EquipmentCategory } from '@/types/equipment';

describe('EquipmentFilters', () => {
  const defaultProps = {
    search: '',
    techBase: null,
    category: null,
    onSearchChange: jest.fn(),
    onTechBaseChange: jest.fn(),
    onCategoryChange: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input', () => {
    render(<EquipmentFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search equipment...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render tech base select', () => {
    render(<EquipmentFilters {...defaultProps} />);
    
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('All Tech')).toBeInTheDocument();
  });

  it('should render category select', () => {
    render(<EquipmentFilters {...defaultProps} />);
    
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('should call onSearchChange when search input changes', async () => {
    const user = userEvent.setup();
    render(<EquipmentFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search equipment...');
    await user.type(searchInput, 'laser');
    
    expect(defaultProps.onSearchChange).toHaveBeenCalled();
  });

  it('should call onTechBaseChange when tech base changes', async () => {
    const user = userEvent.setup();
    render(<EquipmentFilters {...defaultProps} />);
    
    const techBaseSelect = screen.getByDisplayValue('All Tech');
    await user.selectOptions(techBaseSelect, TechBase.INNER_SPHERE);
    
    expect(defaultProps.onTechBaseChange).toHaveBeenCalledWith(TechBase.INNER_SPHERE);
  });

  it('should call onCategoryChange when category changes', async () => {
    const user = userEvent.setup();
    render(<EquipmentFilters {...defaultProps} />);
    
    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categorySelect, EquipmentCategory.ENERGY_WEAPON);
    
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith(EquipmentCategory.ENERGY_WEAPON);
  });

  it('should display current search value', () => {
    render(<EquipmentFilters {...defaultProps} search="laser" />);
    
    const searchInput = screen.getByDisplayValue('laser');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display current tech base value', () => {
    render(<EquipmentFilters {...defaultProps} techBase={TechBase.CLAN} />);
    
    const selects = screen.getAllByRole('combobox');
    const techBaseSelect = selects[0];
    expect(techBaseSelect).toHaveValue(TechBase.CLAN);
  });

  it('should display current category value', () => {
    render(<EquipmentFilters {...defaultProps} category={EquipmentCategory.ENERGY_WEAPON} />);
    
    const selects = screen.getAllByRole('combobox');
    const categorySelect = selects[1];
    expect(categorySelect).toHaveValue(EquipmentCategory.ENERGY_WEAPON);
  });

  it('should show clear button when filters are active', () => {
    render(<EquipmentFilters {...defaultProps} search="laser" />);
    
    const clearButton = screen.getByText(/Clear/i);
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when no filters are active', () => {
    render(<EquipmentFilters {...defaultProps} />);
    
    const clearButton = screen.queryByText(/Clear/i);
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should call onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<EquipmentFilters {...defaultProps} search="laser" />);
    
    const clearButton = screen.getByText(/Clear/i);
    await user.click(clearButton);
    
    expect(defaultProps.onClear).toHaveBeenCalledTimes(1);
  });

  it('should show clear button when tech base filter is active', () => {
    render(<EquipmentFilters {...defaultProps} techBase={TechBase.INNER_SPHERE} />);
    
    expect(screen.getByText(/Clear/i)).toBeInTheDocument();
  });

  it('should show clear button when category filter is active', () => {
    render(<EquipmentFilters {...defaultProps} category={EquipmentCategory.ENERGY_WEAPON} />);
    
    expect(screen.getByText(/Clear/i)).toBeInTheDocument();
  });

  it('should list all tech base options', () => {
    render(<EquipmentFilters {...defaultProps} />);
    
    expect(screen.getByText(TechBase.INNER_SPHERE)).toBeInTheDocument();
    expect(screen.getByText(TechBase.CLAN)).toBeInTheDocument();
  });

  it('should list all category options', () => {
    render(<EquipmentFilters {...defaultProps} />);
    
    expect(screen.getByText('Energy Weapons')).toBeInTheDocument();
    expect(screen.getByText('Ballistic Weapons')).toBeInTheDocument();
    expect(screen.getByText('Missile Weapons')).toBeInTheDocument();
    expect(screen.getByText('Ammunition')).toBeInTheDocument();
  });
});

