/**
 * Folder Manager Icons
 *
 * All SVG icon components used by folder management components.
 */

import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { SvgIcon, type IconSize } from '@/components/ui/SvgIcon';
type IconProps = { className?: string; size?: IconSize };

export function FolderIcon({
  className = '',
  size,
}: IconProps): React.ReactElement {
  return <AppIcon name="folder" className={className} size={size} />;
}

export function FolderOpenIcon({
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
        d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
      />
    </SvgIcon>
  );
}

export function ChevronRightIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="chevron-right" className={className} />;
}

export function ChevronDownIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="chevron-down" className={className} />;
}

export function ShareIcon({
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
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
    </SvgIcon>
  );
}

export function PlusIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="add" className={className} />;
}

export function TrashIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="trash" className={className} />;
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

export function MechIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="mech" className={className} />;
}

export function PilotIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="pilot" className={className} />;
}

export function ForceIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="force" className={className} />;
}

export function EncounterIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="encounter" className={className} />;
}

export function XMarkIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="close" className={className} />;
}

export function SpinnerIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return (
    <SvgIcon
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
