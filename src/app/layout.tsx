import type { ReactNode } from 'react';

export const metadata = {
  title: 'BattleTech Unit Customizer',
  description: 'Customize and build BattleTech units',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
