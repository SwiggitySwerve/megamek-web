/**
 * Campaign Layout - Civilization-style 3-panel layout
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │ [Date] [C-Bills] [Morale] [Rep]            [≡ Menu]    │ <- HUD Bar (48px)
 * ├─────────┬─────────────────────────────────┬─────────────┤
 * │ ROSTER  │                                 │ EVENTS      │
 * │ (slot)  │       MAP AREA (children)       │ (slot)      │ <- Side panels (280px / 40px collapsed)
 * ├─────────┴─────────────────────────────────┴─────────────┤
 * │ CONTEXT PANEL (slot)                                    │ <- Context panel (120px)
 * └─────────────────────────────────────────────────────────┘
 */

import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';

const PANEL_WIDTH_OPEN = 280;
const PANEL_WIDTH_COLLAPSED = 40;
const HUD_HEIGHT = 48;
const CONTEXT_PANEL_HEIGHT = 120;

export interface CampaignLayoutProps {
  /** Current date string, e.g., "3025-03-15" */
  date: string;
  /** Current C-Bills balance */
  cBills: number;
  /** Morale percentage (0-100) */
  morale: number;
  /** Reputation level, e.g., "Reliable" */
  reputation: string;

  /** Content slot for left panel (Roster) */
  leftPanelContent?: React.ReactNode;
  /** Content slot for right panel (Events/Contracts) */
  rightPanelContent?: React.ReactNode;
  /** Content slot for bottom context panel */
  contextPanelContent?: React.ReactNode;
  /** Main content (Map area) */
  children: React.ReactNode;

  /** Is left panel expanded */
  leftPanelOpen?: boolean;
  /** Is right panel expanded */
  rightPanelOpen?: boolean;
  /** Callback when left panel toggle is clicked */
  onLeftPanelToggle?: () => void;
  /** Callback when right panel toggle is clicked */
  onRightPanelToggle?: () => void;

  /** Optional className for root container */
  className?: string;
}

function formatCBills(value: number): string {
  return value.toLocaleString('en-US');
}

function getMoraleColor(morale: number): string {
  if (morale >= 70) return 'text-emerald-400';
  if (morale >= 40) return 'text-amber-400';
  return 'text-red-400';
}

interface HudBarProps {
  date: string;
  cBills: number;
  morale: number;
  reputation: string;
}

function HudBar({
  date,
  cBills,
  morale,
  reputation,
}: HudBarProps): React.ReactElement {
  return (
    <div
      className="border-border-theme bg-surface-deep flex items-center justify-between border-b px-4"
      style={{ height: HUD_HEIGHT }}
      data-testid="hud-bar"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-text-theme-muted text-xs tracking-wider uppercase">
            Date
          </span>
          <span className="text-text-theme-primary font-mono text-sm">
            {date}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-theme-muted text-xs tracking-wider uppercase">
            C-Bills
          </span>
          <span className="font-mono text-sm font-semibold text-amber-400">
            {formatCBills(cBills)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-theme-muted text-xs tracking-wider uppercase">
            Morale
          </span>
          <span
            className={`font-mono text-sm font-semibold ${getMoraleColor(morale)}`}
          >
            {morale}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-theme-muted text-xs tracking-wider uppercase">
            Rep
          </span>
          <span className="text-sm font-medium text-sky-400">{reputation}</span>
        </div>
      </div>

      <button
        type="button"
        className="text-text-theme-secondary hover:bg-surface-base hover:text-text-theme-primary rounded p-2 transition-colors"
        aria-label="Menu"
      >
        <AppIcon name="menu" size="control" />
      </button>
    </div>
  );
}

interface SidePanelProps {
  title: string;
  side: 'left' | 'right';
  isOpen: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
  testId: string;
}

function SidePanel({
  title,
  side,
  isOpen,
  onToggle,
  children,
  testId,
}: SidePanelProps): React.ReactElement {
  const isLeft = side === 'left';

  return (
    <div
      className={`border-border-theme bg-surface-base relative flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${isLeft ? 'border-r' : 'border-l'} `}
      style={{ width: isOpen ? PANEL_WIDTH_OPEN : PANEL_WIDTH_COLLAPSED }}
      data-testid={testId}
    >
      {isOpen ? (
        <div className="flex h-full flex-col">
          <div
            className={`bg-surface-base border-border-theme flex items-center gap-2 border-b px-3 py-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'} `}
          >
            <button
              type="button"
              onClick={onToggle}
              className="text-text-theme-secondary hover:bg-surface-raised hover:text-text-theme-primary rounded p-1 transition-colors"
              aria-label={`Collapse ${title}`}
            >
              <AppIcon
                name={isLeft ? 'chevron-left' : 'chevron-right'}
                size="inline"
              />
            </button>
            <h3 className="text-text-theme-secondary flex-1 text-xs font-semibold tracking-wider uppercase">
              {title}
            </h3>
          </div>

          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          className="text-text-theme-secondary hover:bg-surface-raised hover:text-text-theme-primary flex h-full w-full flex-col items-center justify-center gap-2 transition-colors"
          aria-label={`Expand ${title}`}
        >
          <AppIcon
            name={isLeft ? 'chevron-right' : 'chevron-left'}
            size="inline"
          />
          <span
            className="text-xs font-semibold tracking-wider uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {title}
          </span>
        </button>
      )}
    </div>
  );
}

export function CampaignLayout({
  date,
  cBills,
  morale,
  reputation,
  leftPanelContent,
  rightPanelContent,
  contextPanelContent,
  children,
  leftPanelOpen = true,
  rightPanelOpen = true,
  onLeftPanelToggle,
  onRightPanelToggle,
  className = '',
}: CampaignLayoutProps): React.ReactElement {
  return (
    <div className={`bg-surface-deep flex h-full flex-col ${className}`}>
      <HudBar
        date={date}
        cBills={cBills}
        morale={morale}
        reputation={reputation}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidePanel
          title="Roster"
          side="left"
          isOpen={leftPanelOpen}
          onToggle={onLeftPanelToggle}
          testId="left-panel"
        >
          {leftPanelContent}
        </SidePanel>

        <div className="relative flex-1 overflow-hidden" data-testid="map-area">
          {children}
        </div>

        <SidePanel
          title="Events"
          side="right"
          isOpen={rightPanelOpen}
          onToggle={onRightPanelToggle}
          testId="right-panel"
        >
          {rightPanelContent}
        </SidePanel>
      </div>

      <div
        className="border-border-theme bg-surface-base overflow-hidden border-t"
        style={{ height: CONTEXT_PANEL_HEIGHT }}
        data-testid="context-panel"
      >
        {contextPanelContent ?? (
          <div className="text-text-theme-muted flex h-full items-center justify-center text-sm">
            Select a system or unit to view details
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignLayout;
