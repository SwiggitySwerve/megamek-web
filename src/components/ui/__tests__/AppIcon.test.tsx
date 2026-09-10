import { render, screen } from '@testing-library/react';
import React from 'react';

import { AppIcon } from '../AppIcon';
import { SvgIcon } from '../SvgIcon';

describe('application icon contract', () => {
  it('keeps a decorative icon out of its button accessible name', () => {
    render(
      <button type="button" aria-label="Save unit">
        <AppIcon name="save" size="toolbar" />
      </button>,
    );
    const button = screen.getByRole('button', { name: 'Save unit' });
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(button.querySelector('svg')).toHaveAttribute('focusable', 'false');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('gives a standalone informative icon an accessible name', () => {
    render(<AppIcon name="warning" label="Equipment requires attention" />);
    expect(
      screen.getByRole('img', { name: 'Equipment requires attention' }),
    ).not.toHaveAttribute('aria-hidden');
  });

  it('retains a legacy filled glyph without adding an unintended outline', () => {
    const { container } = render(
      <SvgIcon fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 2h16v16H2Z" />
      </SvgIcon>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke', 'none');
    expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
  });
});
