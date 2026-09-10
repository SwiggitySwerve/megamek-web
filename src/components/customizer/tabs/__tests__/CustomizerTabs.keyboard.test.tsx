import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';

import { CustomizerTabs, DEFAULT_CUSTOMIZER_TABS } from '../CustomizerTabs';

function WorkbenchTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <CustomizerTabs
      tabs={DEFAULT_CUSTOMIZER_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}

it('keeps keyboard focus on the selected tab across arrow, Home and End navigation', () => {
  render(<WorkbenchTabs />);
  const overview = screen.getByRole('tab', { name: 'Overview' });
  overview.focus();
  fireEvent.keyDown(overview, { key: 'ArrowRight' });
  const structure = screen.getByRole('tab', { name: 'Structure' });
  expect(structure).toHaveAttribute('aria-selected', 'true');
  expect(structure).toHaveFocus();
  fireEvent.keyDown(structure, { key: 'End' });
  const preview = screen.getByRole('tab', { name: 'Preview' });
  expect(preview).toHaveFocus();
  fireEvent.keyDown(preview, { key: 'Home' });
  expect(overview).toHaveFocus();
});

it('does not steal focus from outside controls on a controlled tab change', () => {
  const { rerender } = render(
    <>
      <input aria-label="External control" />
      <CustomizerTabs
        tabs={DEFAULT_CUSTOMIZER_TABS}
        activeTab="overview"
        onTabChange={() => {}}
      />
    </>,
  );
  const input = screen.getByRole('textbox');
  input.focus();
  rerender(
    <>
      <input aria-label="External control" />
      <CustomizerTabs
        tabs={DEFAULT_CUSTOMIZER_TABS}
        activeTab="structure"
        onTabChange={() => {}}
      />
    </>,
  );
  expect(input).toHaveFocus();
});
