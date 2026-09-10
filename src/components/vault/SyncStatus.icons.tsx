/**
 * SVG Icons for Sync Status Components
 *
 * Extracted from SyncStatus.tsx to reduce file size.
 * Contains all icon components used across sync status UI.
 */

import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { SvgIcon, type IconSize } from '@/components/ui/SvgIcon';
type IconProps = { className?: string; size?: IconSize };

export function CloudIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
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
        d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
      />
    </SvgIcon>
  );
}

export function CloudArrowUpIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
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
        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
      />
    </SvgIcon>
  );
}

export function CloudOffIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
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
        d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
      />
    </SvgIcon>
  );
}

export function ExclamationCircleIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="warning" className={className} />;
}

export function ArrowPathIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="refresh" className={className} />;
}

export function TrashIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="trash" className={className} />;
}

export function XMarkIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="close" className={className} />;
}

export function UserIcon({
  className = '',
  size,
}: IconProps): React.ReactElement {
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
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </SvgIcon>
  );
}

export function SpinnerIcon({
  className = '',
  size,
}: IconProps): React.ReactElement {
  return (
    <SvgIcon
      size={size}
      className={`animate-spin ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </SvgIcon>
  );
}

export function SignalIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
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
        d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </SvgIcon>
  );
}

export function ClockIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
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
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </SvgIcon>
  );
}

export function PaperAirplaneIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
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
        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
      />
    </SvgIcon>
  );
}
