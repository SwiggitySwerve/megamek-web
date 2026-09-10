import type { JSX } from 'react';

import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { SvgIcon } from '@/components/ui/SvgIcon';

export function CubeIcon(): JSX.Element {
  return (
    <SvgIcon fill="none" viewBox="0 0 24 24" stroke="currentColor" className="">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
      />
    </SvgIcon>
  );
}

export function SpeedIcon(): JSX.Element {
  return (
    <SvgIcon fill="none" viewBox="0 0 24 24" stroke="currentColor" className="">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </SvgIcon>
  );
}

export function ShieldIcon(): JSX.Element {
  return (
    <SvgIcon fill="none" viewBox="0 0 24 24" stroke="currentColor" className="">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </SvgIcon>
  );
}

export function FlameIcon(): JSX.Element {
  return (
    <SvgIcon fill="none" viewBox="0 0 24 24" stroke="currentColor" className="">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
      />
    </SvgIcon>
  );
}

export function EditIcon({
  className = '',
}: {
  className?: string;
}): JSX.Element {
  return <AppIcon name="edit" className={className} />;
}
