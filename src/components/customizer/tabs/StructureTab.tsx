/**
 * Structure Tab Component
 * 
 * Configuration of structural components (engine, gyro, structure, cockpit).
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/customizer-tabs/spec.md
 */

import React from 'react';
import { TechBase } from '@/types/enums/TechBase';

interface StructureTabProps {
  /** Unit tonnage */
  tonnage: number;
  /** Tech base */
  techBase: TechBase;
  /** Read-only mode */
  readOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Structure configuration tab
 */
export function StructureTab({
  tonnage,
  techBase,
  readOnly = false,
  className = '',
}: StructureTabProps) {
  return (
    <div className={`space-y-6 p-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engine Configuration */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Engine</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Engine Type</label>
              <select 
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                disabled={readOnly}
              >
                <option>Fusion (Standard)</option>
                <option>Fusion (XL)</option>
                <option>Fusion (Light)</option>
                <option>Fusion (Compact)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Engine Rating</label>
              <select 
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                disabled={readOnly}
              >
                <option>200</option>
                <option>225</option>
                <option>250</option>
                <option>275</option>
                <option>300</option>
              </select>
            </div>
            
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Weight:</span>
                <span className="text-white">8.5 tons</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Walk MP:</span>
                <span className="text-white">4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gyro Configuration */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Gyro</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Gyro Type</label>
              <select 
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                disabled={readOnly}
              >
                <option>Standard</option>
                <option>Compact</option>
                <option>Heavy-Duty</option>
                <option>XL</option>
              </select>
            </div>
            
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Weight:</span>
                <span className="text-white">3 tons</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Critical Slots:</span>
                <span className="text-white">4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structure Configuration */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Internal Structure</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Structure Type</label>
              <select 
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                disabled={readOnly}
              >
                <option>Standard</option>
                <option>Endo Steel</option>
                <option>Endo-Composite</option>
                <option>Reinforced</option>
              </select>
            </div>
            
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Weight:</span>
                <span className="text-white">{(tonnage * 0.1).toFixed(1)} tons</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Critical Slots:</span>
                <span className="text-white">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cockpit Configuration */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Cockpit</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Cockpit Type</label>
              <select 
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                disabled={readOnly}
              >
                <option>Standard</option>
                <option>Small</option>
                <option>Command Console</option>
                <option>Torso-Mounted</option>
              </select>
            </div>
            
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Weight:</span>
                <span className="text-white">3 tons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weight Summary */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Structural Weight Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">8.5t</div>
            <div className="text-xs text-slate-400">Engine</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">3t</div>
            <div className="text-xs text-slate-400">Gyro</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{(tonnage * 0.1).toFixed(1)}t</div>
            <div className="text-xs text-slate-400">Structure</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">3t</div>
            <div className="text-xs text-slate-400">Cockpit</div>
          </div>
          <div className="border-l border-slate-700 pl-4">
            <div className="text-2xl font-bold text-amber-400">
              {(8.5 + 3 + (tonnage * 0.1) + 3).toFixed(1)}t
            </div>
            <div className="text-xs text-slate-400">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}

