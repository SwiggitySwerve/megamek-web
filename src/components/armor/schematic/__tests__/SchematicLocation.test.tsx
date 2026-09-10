import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { MechLocation } from '@/types/construction';

import { SchematicLocation } from '../SchematicLocation';

describe('SchematicLocation', () => {
  const defaultProps = {
    location: MechLocation.CENTER_TORSO,
    current: 35,
    maximum: 47,
    rear: 12,
    rearMaximum: 23,
    isSelected: false,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render location label', () => {
    render(<SchematicLocation {...defaultProps} />);
    expect(screen.getByText('CT')).toBeInTheDocument();
  });

  it('should render front armor value', () => {
    render(<SchematicLocation {...defaultProps} />);
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('/ 47')).toBeInTheDocument();
  });

  it('should render rear armor for torso locations', () => {
    render(<SchematicLocation {...defaultProps} />);
    expect(screen.getByText('Rear')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should not render rear for non-torso locations', () => {
    render(
      <SchematicLocation
        {...defaultProps}
        location={MechLocation.HEAD}
        rear={undefined}
      />,
    );
    expect(screen.queryByText('Rear')).not.toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<SchematicLocation {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).toHaveBeenCalledWith(
      MechLocation.CENTER_TORSO,
    );
  });

  it('should show selected state', () => {
    const { container } = render(
      <SchematicLocation {...defaultProps} isSelected={true} />,
    );
    expect(container.querySelector('.ring-2')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(<SchematicLocation {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Center Torso'),
    );
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});

it.each([
  ['empty', 0, 10, 1],
  ['half', 5, 10, 0.5],
  ['full', 10, 10, 0],
  ['over capacity', 15, 10, 0],
  ['zero maximum', 5, 0, 1],
])(
  'renders a $s proportional bottom-up gradient',
  (_state, current, maximum, boundary) => {
    const { container } = render(
      <SchematicLocation
        location={MechLocation.HEAD}
        current={current}
        maximum={maximum}
        isSelected={false}
        onClick={jest.fn()}
        rear={undefined}
      />,
    );
    const fill = container.querySelector('[data-armor-fill="Head-front"]');
    expect(fill).toHaveAttribute('data-armor-fill-ratio', String(1 - boundary));
    const reference = fill!.getAttribute('fill')!;
    const gradient = container.querySelector(
      '[id="' + reference.slice(5, -1) + '"]',
    );
    const stops = gradient!.querySelectorAll('stop');
    expect(stops[1]).toHaveAttribute('offset', String(boundary));
    expect(stops[2]).toHaveAttribute('offset', String(boundary));
  },
);
