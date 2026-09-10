import React, { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

interface CustomizerToolbarLayout {
  target: HTMLElement | null;
  requestLoadout: () => void;
}

export const CustomizerToolbarContext =
  createContext<CustomizerToolbarLayout | null>(null);

export function CustomizerTools({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement | null {
  const layout = useContext(CustomizerToolbarContext);
  if (!layout) return <>{children}</>;
  return layout.target ? createPortal(children, layout.target) : null;
}
