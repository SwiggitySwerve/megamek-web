import type { JSX } from 'react';

import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { SvgIcon, type IconSize } from '@/components/ui/SvgIcon';
type IconProps = { className?: string; size?: IconSize };

export function CopyIcon({ className = '', size }: IconProps): JSX.Element {
  return <AppIcon name="copy" className={className} size={size} />;
}

export function CheckIcon({ className = '', size }: IconProps): JSX.Element {
  return <AppIcon name="check" className={className} size={size} />;
}

export function ToggleOnIcon({ className = '', size }: IconProps): JSX.Element {
  return (
    <SvgIcon
      size={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
      />
    </SvgIcon>
  );
}

export function TrashIcon({ className = '', size }: IconProps): JSX.Element {
  return <AppIcon name="trash" className={className} size={size} />;
}

export function LinkIcon({ className = '', size }: IconProps): JSX.Element {
  return (
    <SvgIcon
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      size={size}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </SvgIcon>
  );
}
