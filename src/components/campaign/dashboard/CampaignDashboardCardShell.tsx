import React from 'react';

interface ICardProps {
  readonly title: string;
  readonly testid: string;
  readonly children: React.ReactNode;
  readonly footer?: React.ReactNode;
  /** Honest origin text — solo FIFO is not the shared log. */
  readonly headerNote?: string;
  readonly headerNoteTestId?: string;
}

export function DashboardCard({
  title,
  testid,
  children,
  footer,
  headerNote,
  headerNoteTestId,
}: ICardProps): React.ReactElement {
  return (
    <section
      data-testid={testid}
      className="border-border-theme bg-surface-deep/60 flex flex-col rounded-xl border p-4"
    >
      <h3 className="text-text-theme-secondary mb-3 text-sm font-semibold tracking-wide uppercase">
        {title}
      </h3>
      {headerNote ? (
        <p
          data-testid={headerNoteTestId}
          className="text-text-theme-secondary -mt-2 mb-3 text-xs"
        >
          {headerNote}
        </p>
      ) : null}
      <div className="flex-1">{children}</div>
      {footer ? (
        <div className="border-border-theme mt-3 border-t pt-3">{footer}</div>
      ) : null}
    </section>
  );
}
