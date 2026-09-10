import type { Meta, StoryObj } from '@storybook/react';

import { AppIcon, APP_ICON_NAMES } from './AppIcon';

const meta: Meta<typeof AppIcon> = {
  title: 'UI/AppIcon',
  component: AppIcon,
  args: { name: 'save', size: 'toolbar' },
};
export default meta;
type Story = StoryObj<typeof AppIcon>;

export const ActionSymbols: Story = {
  render: () => (
    <div className="bg-surface-base text-text-theme-primary grid grid-cols-4 gap-4 p-6">
      {APP_ICON_NAMES.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2 p-3">
          <AppIcon name={name} size="toolbar" />
          <span className="text-xs">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const SizeScale: Story = {
  render: () => (
    <div className="bg-surface-base text-text-theme-primary flex items-center gap-6 p-6">
      {(['inline', 'control', 'toolbar', 'feature', 'hero'] as const).map(
        (size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <AppIcon name="save" size={size} />
            <span className="text-xs">{size}</span>
          </div>
        ),
      )}
    </div>
  ),
};
