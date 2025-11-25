import { CustomizerApp } from '../../features/mech-customizer/components/CustomizerApp';
import type { ReactElement } from 'react';

export default function CustomizerPage(): ReactElement {
  return (
    <main className="min-h-screen">
      <CustomizerApp />
    </main>
  );
}

