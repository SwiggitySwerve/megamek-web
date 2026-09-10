import type { Meta, StoryObj } from '@storybook/react';

import React, { useState } from 'react';

import { TabNavigation } from './TabNavigation';

const meta: Meta<typeof TabNavigation> = {
  title: 'Simulation/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['campaign-dashboard', 'encounter-history', 'analysis-bugs'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabNavigation>;

export const CampaignDashboard: Story = {
  args: {
    activeTab: 'campaign-dashboard',
    onTabChange: (tab: string) => alert(`Tab: ${tab}`),
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export const EncounterHistory: Story = {
  args: {
    activeTab: 'encounter-history',
    onTabChange: (tab: string) => alert(`Tab: ${tab}`),
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export const AnalysisBugs: Story = {
  args: {
    activeTab: 'analysis-bugs',
    onTabChange: (tab: string) => alert(`Tab: ${tab}`),
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

const InteractiveTabs = () => {
  const [active, setActive] = useState<
    'campaign-dashboard' | 'encounter-history' | 'analysis-bugs'
  >('campaign-dashboard');
  return (
    <div className="max-w-2xl">
      <TabNavigation
        activeTab={active}
        onTabChange={(t) => setActive(t as typeof active)}
      />
      <div className="border-border-theme bg-surface-base rounded-b-lg border border-t-0 p-6">
        <p className="text-text-theme-secondary">
          Active tab: <strong>{active}</strong>
        </p>
      </div>
    </div>
  );
};

export const Interactive: StoryObj = {
  render: () => <InteractiveTabs />,
};

export const DarkMode: Story = {
  args: {
    activeTab: 'campaign-dashboard',
    onTabChange: (tab: string) => alert(`Tab: ${tab}`),
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-deep max-w-2xl rounded-lg p-8">
        <Story />
      </div>
    ),
  ],
};

export const MobileWidth: Story = {
  args: {
    activeTab: 'encounter-history',
    onTabChange: (tab: string) => alert(`Tab: ${tab}`),
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};
