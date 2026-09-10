import React, { useEffect, useRef } from 'react';

interface SlotContextMenuShellProps {
  x: number;
  y: number;
  menuHeight: number;
  onClose: () => void;
  children: React.ReactNode;
}

export function SlotContextMenuShell({
  x,
  y,
  menuHeight,
  onClose,
  children,
}: SlotContextMenuShellProps): React.ReactElement {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="bg-surface-base border-border-theme fixed z-50 min-w-[140px] rounded-lg border py-1 shadow-xl"
      style={{
        left: Math.min(x, window.innerWidth - 180),
        top: Math.min(y, window.innerHeight - menuHeight),
      }}
    >
      {children}
    </div>
  );
}
