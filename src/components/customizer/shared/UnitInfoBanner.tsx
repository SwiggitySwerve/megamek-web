/**
 * Unit Info Banner Component
 * 
 * At-a-glance unit statistics display with three-section layout.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/unit-info-banner/spec.md
 */

import React from 'react';
import { StatCell } from './StatCell';
import { TechBaseBadge } from './TechBaseBadge';
import { ValidationBadge } from './ValidationBadge';
import { TechBase } from '@/types/enums/TechBase';
import { ValidationStatus } from '@/utils/colors/statusColors';

interface UnitStats {
  /** Unit name/variant */
  name: string;
  /** Tonnage */
  tonnage: number;
  /** Tech base */
  techBase: TechBase;
  /** Walk MP */
  walkMP: number;
  /** Run MP */
  runMP: number;
  /** Jump MP */
  jumpMP: number;
  /** Current weight used */
  weightUsed: number;
  /** Remaining weight */
  weightRemaining: number;
  /** Total armor points */
  armorPoints: number;
  /** Maximum armor points */
  maxArmorPoints: number;
  /** Total heat generated */
  heatGenerated: number;
  /** Total heat dissipation */
  heatDissipation: number;
  /** Validation status */
  validationStatus: ValidationStatus;
  /** Number of validation errors */
  errorCount: number;
  /** Number of validation warnings */
  warningCount: number;
}

interface UnitInfoBannerProps {
  /** Unit statistics */
  stats: UnitStats;
  /** On reset button click */
  onReset?: () => void;
  /** On debug button click */
  onDebug?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Unit information banner with stats display
 */
export function UnitInfoBanner({
  stats,
  onReset,
  onDebug,
  className = '',
}: UnitInfoBannerProps) {
  const weightVariant = stats.weightRemaining < 0 ? 'error' : 
                       stats.weightRemaining < 1 ? 'warning' : 'default';
  
  const heatVariant = stats.heatGenerated > stats.heatDissipation ? 'warning' : 'default';
  
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg ${className}`}>
      <div className="flex items-stretch divide-x divide-slate-700">
        {/* Section 1: Identity */}
        <div className="flex-1 px-4 py-3">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">{stats.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-400">{stats.tonnage} tons</span>
                <TechBaseBadge techBase={stats.techBase} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 2: Core Stats */}
        <div className="flex-1 px-4 py-3">
          <div className="flex items-center justify-around h-full">
            <StatCell 
              label="Walk" 
              value={stats.walkMP} 
            />
            <StatCell 
              label="Run" 
              value={stats.runMP} 
            />
            <StatCell 
              label="Jump" 
              value={stats.jumpMP} 
            />
            <div className="border-l border-slate-600 h-8 mx-2" />
            <StatCell 
              label="Weight" 
              value={stats.weightRemaining.toFixed(1)} 
              unit="t"
              variant={weightVariant}
            />
            <StatCell 
              label="Armor" 
              value={`${stats.armorPoints}/${stats.maxArmorPoints}`}
            />
            <StatCell 
              label="Heat" 
              value={`${stats.heatGenerated}/${stats.heatDissipation}`}
              variant={heatVariant}
            />
          </div>
        </div>
        
        {/* Section 3: Validation & Actions */}
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <ValidationBadge 
              status={stats.validationStatus}
              label={stats.validationStatus === 'valid' ? 'Valid' : 
                    `${stats.errorCount} errors, ${stats.warningCount} warnings`}
            />
          </div>
          
          <div className="flex gap-2 ml-2">
            {onReset && (
              <button
                onClick={onReset}
                className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
              >
                Reset
              </button>
            )}
            {onDebug && (
              <button
                onClick={onDebug}
                className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
              >
                Debug
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

