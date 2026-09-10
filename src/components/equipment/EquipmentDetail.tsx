import React from 'react';

import { SvgIcon } from '@/components/ui/SvgIcon';

import { IEquipmentItem } from '../../types/equipment';

/**
 * Extended equipment details for weapon-specific display
 * Used to show combat stats when available
 */
export interface WeaponDetails {
  damage?: number | string;
  range?: string;
  heat?: number;
}

export interface EquipmentDetailProps {
  item: IEquipmentItem;
  weaponDetails?: WeaponDetails;
  description?: string;
  onBack: () => void;
  onAssign?: () => void;
  className?: string;
}

export function EquipmentDetail({
  item,
  weaponDetails,
  description,
  onBack,
  onAssign,
  className = '',
}: EquipmentDetailProps): React.ReactElement {
  return (
    <div
      className={`equipment-detail bg-surface-deep fixed inset-0 z-20 translate-x-0 transform transition-transform duration-300 ${className}`.trim()}
      style={{
        animation: 'slideInRight 300ms ease-out',
      }}
    >
      {/* Header with back button */}
      <div className="p-safe border-border-theme bg-surface-deep sticky top-0 z-10 border-b px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="hover:bg-surface-raised min-h-[44px] min-w-[44px] rounded-full p-2"
            aria-label="Go back"
          >
            <SvgIcon
              size="toolbar"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </SvgIcon>
          </button>
          <h1 className="text-text-theme-primary flex-1 truncate text-lg font-semibold">
            Equipment Details
          </h1>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Equipment name */}
        <h2 className="text-text-theme-primary mb-2 text-2xl font-bold">
          {item.name}
        </h2>

        {/* Stats sections */}
        <div className="space-y-4">
          {/* Basic info */}
          <div className="bg-surface-base rounded-lg p-4">
            <h3 className="text-text-theme-secondary mb-3 text-sm font-semibold">
              Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-theme-secondary text-sm">
                  Category
                </span>
                <span className="text-text-theme-primary text-sm font-medium">
                  {item.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-theme-secondary text-sm">
                  Weight
                </span>
                <span className="text-text-theme-primary text-sm font-medium">
                  {item.weight} tons
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-theme-secondary text-sm">
                  Critical Slots
                </span>
                <span className="text-text-theme-primary text-sm font-medium">
                  {item.criticalSlots}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-theme-secondary text-sm">
                  Tech Base
                </span>
                <span className="text-text-theme-primary text-sm font-medium">
                  {item.techBase}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-theme-secondary text-sm">Cost</span>
                <span className="text-text-theme-primary text-sm font-medium">
                  {item.costCBills.toLocaleString()} C-Bills
                </span>
              </div>
            </div>
          </div>

          {/* Combat stats (only shown for weapons) */}
          {weaponDetails &&
            (weaponDetails.damage !== undefined ||
              weaponDetails.range ||
              weaponDetails.heat !== undefined) && (
              <div className="bg-surface-base rounded-lg p-4">
                <h3 className="text-text-theme-secondary mb-3 text-sm font-semibold">
                  Combat Stats
                </h3>
                <div className="space-y-2">
                  {weaponDetails.damage !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-text-theme-secondary text-sm">
                        Damage
                      </span>
                      <span className="text-text-theme-primary text-sm font-medium">
                        {weaponDetails.damage}
                      </span>
                    </div>
                  )}
                  {weaponDetails.range && (
                    <div className="flex justify-between">
                      <span className="text-text-theme-secondary text-sm">
                        Range
                      </span>
                      <span className="text-text-theme-primary text-sm font-medium">
                        {weaponDetails.range}
                      </span>
                    </div>
                  )}
                  {weaponDetails.heat !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-text-theme-secondary text-sm">
                        Heat
                      </span>
                      <span className="text-text-theme-primary text-sm font-medium">
                        {weaponDetails.heat}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Description */}
          {description && (
            <div className="bg-surface-base rounded-lg p-4">
              <h3 className="text-text-theme-secondary mb-3 text-sm font-semibold">
                Description
              </h3>
              <p className="text-text-theme-secondary text-sm leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons at bottom */}
      <div className="p-safe border-border-theme bg-surface-deep sticky bottom-0 border-t p-4">
        {onAssign && (
          <button
            type="button"
            onClick={onAssign}
            className="bg-accent text-on-accent hover:bg-accent-hover min-h-[44px] w-full rounded-md px-4 py-3 font-medium transition-colors"
          >
            Assign Equipment
          </button>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
