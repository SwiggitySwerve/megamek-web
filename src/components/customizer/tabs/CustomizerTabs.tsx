/**
 * Customizer Tabs Component
 * 
 * Tabbed navigation for unit configuration sections.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/customizer-tabs/spec.md
 */

import React, { useState } from 'react';

/**
 * Customizer tab configuration
 */
export interface CustomizerTabConfig {
  /** Tab identifier */
  id: string;
  /** Tab label */
  label: string;
  /** Icon (optional) */
  icon?: React.ReactNode;
  /** Is tab disabled */
  disabled?: boolean;
}

interface CustomizerTabsProps {
  /** Tab configurations */
  tabs: CustomizerTabConfig[];
  /** Currently active tab ID */
  activeTab: string;
  /** Called when tab changes */
  onTabChange: (tabId: string) => void;
  /** Read-only mode */
  readOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Default customizer tabs
 */
export const DEFAULT_CUSTOMIZER_TABS: CustomizerTabConfig[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'structure', label: 'Structure' },
  { id: 'armor', label: 'Armor' },
  { id: 'weapons', label: 'Weapons' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'criticals', label: 'Critical Slots' },
  { id: 'fluff', label: 'Fluff' },
];

/**
 * Customizer section tabs
 */
export function CustomizerTabs({
  tabs,
  activeTab,
  onTabChange,
  readOnly = false,
  className = '',
}: CustomizerTabsProps) {
  return (
    <div className={`flex bg-slate-800 border-b border-slate-700 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
          className={`
            flex items-center gap-2 px-4 py-2.5 text-sm font-medium
            border-b-2 transition-colors
            ${tab.id === activeTab
              ? 'text-amber-400 border-amber-400'
              : 'text-slate-400 border-transparent hover:text-white hover:border-slate-500'
            }
            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${readOnly ? 'pointer-events-none' : ''}
          `}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Hook for managing customizer tab state
 */
export function useCustomizerTabs(
  initialTab: string = 'overview',
  tabs: CustomizerTabConfig[] = DEFAULT_CUSTOMIZER_TABS
) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  
  return {
    tabs,
    activeTab,
    currentTab,
    setActiveTab,
  };
}

