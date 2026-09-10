import { render, screen } from '@testing-library/react';
import React from 'react';

import { DialogTemplate } from '../DialogTemplate';

describe('DialogTemplate', () => {
  it('names and describes the actual dialog role from its header', () => {
    render(
      <DialogTemplate
        isOpen
        onClose={jest.fn()}
        title="Save Unit"
        subtitle="Choose a name for this unit."
      >
        <label>
          Unit name
          <input />
        </label>
      </DialogTemplate>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Save Unit' });
    const descriptionId = dialog.getAttribute('aria-describedby');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title-save-unit');
    expect(descriptionId).toBe('dialog-subtitle-save-unit');
    expect(document.getElementById(descriptionId ?? '')).toHaveTextContent(
      'Choose a name for this unit.',
    );
  });
});
