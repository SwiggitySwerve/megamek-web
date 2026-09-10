import React from 'react';

import type { ShareableContentType } from '@/types/vault';

import { AppIcon } from '@/components/ui/AppIcon';

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

export function FolderIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="folder" className={className} />;
}

export function DocumentIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="document" className={className} />;
}

export function WarningIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="warning" className={className} />;
}

export function CheckIcon({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  return <AppIcon name="check" className={className} />;
}

export function getContentTypeLabel(
  type: ShareableContentType | 'folder',
): string {
  switch (type) {
    case 'unit':
      return 'Unit';
    case 'pilot':
      return 'Pilot';
    case 'force':
      return 'Force';
    case 'encounter':
      return 'Encounter';
    case 'folder':
      return 'Folder';
    default:
      return 'Item';
  }
}

export function getContentTypeIcon(
  type: ShareableContentType | 'folder',
): React.ReactNode {
  switch (type) {
    case 'unit':
      return <MechIcon className="h-5" />;
    case 'pilot':
      return <PilotIcon className="h-5" />;
    case 'force':
      return <ForceIcon className="h-5" />;
    case 'encounter':
      return <EncounterIcon className="h-5" />;
    case 'folder':
      return <FolderIcon className="h-5" />;
    default:
      return <DocumentIcon className="h-5" />;
  }
}

export function formatConflictDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
