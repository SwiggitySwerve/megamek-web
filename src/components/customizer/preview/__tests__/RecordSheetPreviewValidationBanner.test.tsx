import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ValidationSeverity } from '@/hooks/useUnitValidation';

import { RecordSheetPreviewValidationBanner } from '../RecordSheetPreviewValidationBanner';

const issues = [
  {
    id: 'weight',
    severity: ValidationSeverity.ERROR,
    message: 'Unit is overweight',
    details: 'Current weight is 51 tons.',
    fix: 'Remove one ton of equipment.',
  },
  {
    id: 'heat',
    severity: ValidationSeverity.WARNING,
    message: 'Heat dissipation is low',
  },
] as const;

describe('RecordSheetPreviewValidationBanner', () => {
  it('keeps validation issues collapsed until the summary is activated', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <RecordSheetPreviewValidationBanner
        issues={issues}
        errorCount={1}
        warningCount={1}
      />,
    );

    const disclosure = container.querySelector('details');
    const summary = screen
      .getByText('Review 2 validation issues')
      .closest('summary');

    expect(disclosure).not.toHaveAttribute('open');
    expect(summary).toHaveTextContent('1 error');
    expect(summary).toHaveTextContent('1 warning');
    expect(screen.getByText('Unit is overweight')).not.toBeVisible();

    await user.click(summary as HTMLElement);

    expect(disclosure).toHaveAttribute('open');
    expect(screen.getByText('Unit is overweight')).toBeVisible();
    expect(screen.getByText('Current weight is 51 tons.')).toBeVisible();
    expect(
      screen.getByText('Suggested fix: Remove one ton of equipment.'),
    ).toBeVisible();
  });

  it('renders nothing when there are no issues', () => {
    const { container } = render(
      <RecordSheetPreviewValidationBanner
        issues={[]}
        errorCount={0}
        warningCount={0}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
