import type { Meta, StoryObj } from '@storybook/react';

import { ColorLegend } from './ColorLegend';

const meta: Meta<typeof ColorLegend> = {
  title: 'Customizer/Shared/ColorLegend',
  component: ColorLegend,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Collapsible color reference panel explaining the color system for system components, equipment types, and tech base.',
      },
    },
  },
  argTypes: {
    defaultExpanded: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof ColorLegend>;

export const Default: Story = {
  args: {
    defaultExpanded: false,
  },
};

export const Expanded: Story = {
  args: {
    defaultExpanded: true,
  },
};

export const InContext: Story = {
  render: () => (
    <div className="bg-surface-deep max-w-md space-y-4 rounded p-4">
      <div className="bg-surface-base rounded p-4">
        <h3 className="text-text-theme-primary mb-2 font-bold">
          Critical Slots
        </h3>
        <p className="text-text-theme-secondary text-sm">
          Select a location to view slots...
        </p>
      </div>
      <ColorLegend defaultExpanded />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Color legend displayed alongside critical slots editor.',
      },
    },
  },
};
