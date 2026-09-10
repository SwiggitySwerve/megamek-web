import React from 'react';

import type { IconSize } from '@/components/ui/SvgIcon';

import { AppIcon } from '@/components/ui/AppIcon';

import { customizerStyles as cs } from '../styles';

type IconProps = {
  className?: string;
  size?: IconSize;
};

export function CloseIcon({
  className = '',
  size = 'control',
}: IconProps): React.ReactElement {
  return <AppIcon name="close" size={size} className={className} />;
}

export function CheckIcon({
  className = '',
  size = 'inline',
}: IconProps): React.ReactElement {
  return <AppIcon name="check" size={size} className={className} />;
}

export function ErrorIcon({
  className = '',
  size = 'inline',
}: IconProps): React.ReactElement {
  return <AppIcon name="info" size={size} className={className} />;
}

export function WarningIcon({
  className = '',
  size = 'inline',
}: IconProps): React.ReactElement {
  return <AppIcon name="warning" size={size} className={className} />;
}

export function SpinnerIcon({
  className = 'animate-spin',
  size = 'control',
}: IconProps): React.ReactElement {
  return <AppIcon name="loader" size={size} className={className} />;
}

export function DialogCloseButton({
  onClose,
}: {
  onClose: () => void;
}): React.ReactElement {
  return (
    <button
      onClick={onClose}
      className={cs.dialog.closeBtn}
      aria-label="Close dialog"
    >
      <CloseIcon />
    </button>
  );
}

export function DialogErrorMessage({
  message,
}: {
  message: string;
}): React.ReactElement {
  return (
    <div className={cs.dialog.errorPanel}>
      <div className="flex items-center gap-2 text-red-400">
        <ErrorIcon size="control" />
        {message}
      </div>
    </div>
  );
}

export function DialogLoadingState({
  label,
}: {
  label: string;
}): React.ReactElement {
  return (
    <div className="text-text-theme-secondary flex items-center justify-center gap-2 py-4">
      <SpinnerIcon />
      {label}
    </div>
  );
}
