/**
 * Tech Base Configuration Component
 * 
 * Allows configuration of global and per-component tech base settings.
 * Supports Inner Sphere, Clan, and Mixed Tech modes.
 * 
 * @spec Based on BattleTech TechManual mixed tech rules
 */

import React from 'react';
import { TechBase } from '@/types/enums/TechBase';
import {
  TechBaseMode,
  TechBaseComponent,
  IComponentTechBases,
  TECH_BASE_MODE_LABELS,
  TECH_BASE_COMPONENT_LABELS,
  TECH_BASE_COMPONENT_DESCRIPTIONS,
} from '@/types/construction/TechBaseConfiguration';

interface TechBaseConfigurationProps {
  /** Current global tech base mode */
  mode: TechBaseMode;
  /** Per-component tech base settings */
  components: IComponentTechBases;
  /** Called when the global mode changes */
  onModeChange: (mode: TechBaseMode) => void;
  /** Called when a component tech base changes */
  onComponentChange: (component: TechBaseComponent, techBase: TechBase) => void;
  /** Whether the configuration is read-only */
  readOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Segmented button for selecting between two options
 */
function TechBaseSegmentedButton({
  value,
  onChange,
  disabled = false,
}: {
  value: TechBase;
  onChange: (value: TechBase) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-slate-600">
      <button
        type="button"
        onClick={() => onChange(TechBase.INNER_SPHERE)}
        disabled={disabled}
        className={`
          px-3 py-1.5 text-sm font-medium transition-colors
          ${value === TechBase.INNER_SPHERE
            ? 'bg-blue-600 text-white'
            : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        Inner Sphere
      </button>
      <button
        type="button"
        onClick={() => onChange(TechBase.CLAN)}
        disabled={disabled}
        className={`
          px-3 py-1.5 text-sm font-medium transition-colors border-l border-slate-600
          ${value === TechBase.CLAN
            ? 'bg-green-600 text-white'
            : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        Clan
      </button>
    </div>
  );
}

/**
 * Row for a single component's tech base setting
 */
function ComponentRow({
  component,
  techBase,
  onChange,
  disabled,
  isOdd,
}: {
  component: TechBaseComponent;
  techBase: TechBase;
  onChange: (techBase: TechBase) => void;
  disabled: boolean;
  isOdd: boolean;
}) {
  return (
    <div
      className={`
        flex items-center justify-between px-4 py-2.5
        ${isOdd ? 'bg-slate-800/50' : 'bg-slate-800'}
        ${disabled ? 'opacity-60' : ''}
      `}
      title={TECH_BASE_COMPONENT_DESCRIPTIONS[component]}
    >
      <div className="text-sm font-medium text-slate-200">
        {TECH_BASE_COMPONENT_LABELS[component]}
      </div>
      <TechBaseSegmentedButton
        value={techBase}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

/**
 * Tech base configuration panel
 */
export function TechBaseConfiguration({
  mode,
  components,
  onModeChange,
  onComponentChange,
  readOnly = false,
  className = '',
}: TechBaseConfigurationProps) {
  const isMixed = mode === 'mixed';
  
  const componentOrder: TechBaseComponent[] = [
    'chassis',
    'gyro',
    'engine',
    'heatsink',
    'targeting',
    'myomer',
    'movement',
    'armor',
  ];

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 overflow-hidden ${className}`}>
      {/* Header with centered global mode selector */}
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-800">
        <h3 className="text-sm font-medium text-slate-400 text-center mb-2">Tech Base</h3>
        
        {/* Centered segmented button for mode selection */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg overflow-hidden border border-slate-600">
            <button
              type="button"
              onClick={() => onModeChange('inner_sphere')}
              disabled={readOnly}
              title="All components use Inner Sphere technology"
              className={`
                px-4 py-2 text-sm font-medium transition-colors
                ${mode === 'inner_sphere'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300'
                }
                ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              Inner Sphere
            </button>
            <button
              type="button"
              onClick={() => onModeChange('clan')}
              disabled={readOnly}
              title="All components use Clan technology"
              className={`
                px-4 py-2 text-sm font-medium transition-colors border-l border-slate-600
                ${mode === 'clan'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300'
                }
                ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              Clan
            </button>
            <button
              type="button"
              onClick={() => onModeChange('mixed')}
              disabled={readOnly}
              title="Configure each component's tech base individually"
              className={`
                px-4 py-2 text-sm font-medium transition-colors border-l border-slate-600
                ${mode === 'mixed'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300'
                }
                ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              Mixed
            </button>
          </div>
        </div>
      </div>

      {/* Component rows */}
      <div className="divide-y divide-slate-700/50">
        {componentOrder.map((component, index) => (
          <ComponentRow
            key={component}
            component={component}
            techBase={components[component]}
            onChange={(techBase) => onComponentChange(component, techBase)}
            disabled={readOnly || !isMixed}
            isOdd={index % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
}

