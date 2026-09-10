import Link from 'next/link';
import React, { useEffect, useId, useRef, useState } from 'react';

import { AppIcon } from '@/components/ui/AppIcon';

import { type NavItemConfig, useClickOutside } from './TopBarMenu';

interface CustomizerAppMenuProps {
  groups: { label: string; items: NavItemConfig[] }[];
}

/** Application navigation within the customizer's single command row. */
export function CustomizerAppMenu({
  groups,
}: CustomizerAppMenuProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  useClickOutside(root, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const escape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);

  return (
    <div ref={root} className="relative shrink-0">
      <button
        ref={trigger}
        type="button"
        aria-label="MekStation menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="text-text-theme-primary hover:bg-surface-raised focus-visible:outline-accent flex min-h-11 min-w-11 items-center justify-center gap-2 rounded !px-2 !py-0 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <AppIcon name="menu" size="toolbar" />
        <span className="hidden lg:inline">MekStation</span>
      </button>
      {open && (
        <div
          ref={panel}
          id={id}
          className="bg-surface-base border-border-theme absolute top-full left-0 z-50 mt-1 max-h-[75dvh] w-72 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-lg border p-2 shadow-xl"
        >
          <nav
            aria-label="Application navigation"
            onClick={() => setOpen(false)}
          >
            <Link
              href="/"
              className="text-text-theme-primary hover:bg-surface-raised focus-visible:outline-accent flex min-h-11 items-center rounded px-3 text-sm focus-visible:outline-2"
            >
              Dashboard
            </Link>
            {groups.map((group) => (
              <div
                key={group.label}
                className="border-border-theme border-t py-1"
              >
                <p className="text-text-theme-secondary px-3 py-1 text-[10px] font-semibold tracking-wider uppercase">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={item.prefetch}
                    className="text-text-theme-primary hover:bg-surface-raised focus-visible:outline-accent flex min-h-11 items-center gap-3 rounded px-3 text-sm focus-visible:outline-2"
                  >
                    <span className="h-5 w-5" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href="/settings"
              className="border-border-theme text-text-theme-primary hover:bg-surface-raised focus-visible:outline-accent flex min-h-11 items-center rounded border-t px-3 text-sm focus-visible:outline-2"
            >
              Settings
            </Link>
            <a
              href="https://github.com/SwiggitySwerve/MekStation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-theme-primary hover:bg-surface-raised focus-visible:outline-accent flex min-h-11 items-center rounded px-3 text-sm focus-visible:outline-2"
            >
              GitHub
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
