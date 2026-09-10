import type { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';

import { ModalOverlay } from './ModalOverlay';

const meta: Meta<typeof ModalOverlay> = {
  title: 'Customizer/Dialogs/ModalOverlay',
  component: ModalOverlay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reusable modal overlay with backdrop, focus trapping, and escape key handling.',
      },
    },
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    preventClose: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof ModalOverlay>;

function ModalOverlayDemo({
  preventClose = false,
}: {
  preventClose?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-accent text-on-accent hover:bg-accent-hover rounded px-4 py-2"
      >
        Open Modal
      </button>
      <ModalOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        preventClose={preventClose}
      >
        <div className="p-6">
          <h2 className="text-text-theme-primary mb-4 text-lg font-bold">
            Modal Content
          </h2>
          <p className="text-text-theme-secondary mb-4">
            Click outside or press Escape to close.
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-surface-raised text-text-theme-primary hover:bg-surface-base rounded px-4 py-2"
          >
            Close
          </button>
        </div>
      </ModalOverlay>
    </div>
  );
}

export const Default: Story = {
  render: () => <ModalOverlayDemo />,
};

export const PreventClose: Story = {
  render: () => <ModalOverlayDemo preventClose />,
  parameters: {
    docs: {
      description: {
        story:
          'When preventClose is true, clicking outside or pressing Escape will not close the modal.',
      },
    },
  },
};

export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-accent text-on-accent hover:bg-accent-hover rounded px-4 py-2"
        >
          Open Form Modal
        </button>
        <ModalOverlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-4 p-6">
            <h2 className="text-text-theme-primary text-lg font-bold">
              Edit Settings
            </h2>
            <div>
              <label className="text-text-theme-secondary mb-1 block text-sm">
                Name
              </label>
              <input
                type="text"
                className="border-border-theme bg-surface-raised text-text-theme-primary w-full rounded border px-3 py-2"
                placeholder="Enter name..."
              />
            </div>
            <div>
              <label className="text-text-theme-secondary mb-1 block text-sm">
                Description
              </label>
              <textarea
                className="border-border-theme bg-surface-raised text-text-theme-primary w-full rounded border px-3 py-2"
                rows={3}
                placeholder="Enter description..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-surface-raised text-text-theme-primary hover:bg-surface-base rounded px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-accent text-on-accent hover:bg-accent-hover rounded px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </ModalOverlay>
      </div>
    );
  },
};

export const LargeContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-accent text-on-accent hover:bg-accent-hover rounded px-4 py-2"
        >
          Open Large Modal
        </button>
        <ModalOverlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-6">
            <h2 className="text-text-theme-primary mb-4 text-lg font-bold">
              Terms and Conditions
            </h2>
            <div className="text-text-theme-secondary space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={i}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              ))}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-accent text-on-accent hover:bg-accent-hover mt-4 rounded px-4 py-2"
            >
              Accept
            </button>
          </div>
        </ModalOverlay>
      </div>
    );
  },
};

export const FullScreen: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open full-screen loadout</button>
        <ModalOverlay
          isOpen={open}
          fullScreen
          onClose={() => setOpen(false)}
          ariaLabelledBy="full-screen-heading"
        >
          <div className="flex h-full flex-col p-4">
            <h2 id="full-screen-heading">Equipment Loadout</h2>
            <button onClick={() => setOpen(false)}>Close loadout</button>
            <div className="flex-1">
              Full-screen content remains above page navigation.
            </div>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </ModalOverlay>
      </>
    );
  },
};
