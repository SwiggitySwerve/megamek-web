import React from 'react';

import { Button } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { SvgIcon } from '@/components/ui/SvgIcon';

function CheckIcon({ className = '' }: { className?: string }) {
  return <AppIcon name="check" className={className} />;
}

function TrashIcon({ className = '' }: { className?: string }) {
  return <AppIcon name="trash" className={className} />;
}

function PencilIcon({ className = '' }: { className?: string }) {
  return <AppIcon name="edit" className={className} />;
}

function ShieldCheckIcon({ className = '' }: { className?: string }) {
  return (
    <SvgIcon className={className} aria-hidden="true">
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </SvgIcon>
  );
}

function ShieldExclamationIcon({ className = '' }: { className?: string }) {
  return (
    <SvgIcon
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285zm0 13.036h.008v.008H12v-.008z"
      />
    </SvgIcon>
  );
}

export interface ContactDeleteConfirmProps {
  isProcessing: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export function ContactDeleteConfirm({
  isProcessing,
  onConfirmDelete,
  onCancelDelete,
}: ContactDeleteConfirmProps): React.ReactElement {
  return (
    <>
      <span className="text-text-theme-muted mr-2 text-sm">
        Delete this contact?
      </span>
      <Button
        variant="danger"
        size="sm"
        onClick={onConfirmDelete}
        disabled={isProcessing}
        isLoading={isProcessing}
      >
        <CheckIcon className="h-4 w-4" />
        Confirm
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancelDelete}
        disabled={isProcessing}
      >
        Cancel
      </Button>
    </>
  );
}

export interface ContactCardActionsProps {
  isTrusted: boolean;
  isProcessing: boolean;
  showDeleteConfirm: boolean;
  onEdit: () => void;
  onToggleTrust: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export function ContactCardActions({
  isTrusted,
  isProcessing,
  showDeleteConfirm,
  onEdit,
  onToggleTrust,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
}: ContactCardActionsProps): React.ReactElement {
  return (
    <div className="border-border-theme-subtle/50 mt-4 flex items-center justify-end gap-2 border-t pt-4">
      {showDeleteConfirm ? (
        <ContactDeleteConfirm
          isProcessing={isProcessing}
          onConfirmDelete={onConfirmDelete}
          onCancelDelete={onCancelDelete}
        />
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            disabled={isProcessing}
            title="Edit nickname & notes"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTrust}
            disabled={isProcessing}
            title={isTrusted ? 'Remove trust' : 'Mark as trusted'}
            className={isTrusted ? 'text-emerald-400' : 'text-text-theme-muted'}
          >
            {isTrusted ? (
              <ShieldCheckIcon className="h-4 w-4" />
            ) : (
              <ShieldExclamationIcon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isProcessing}
            title="Delete contact"
            className="text-red-400/70 hover:text-red-400"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
