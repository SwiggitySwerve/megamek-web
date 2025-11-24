'use client';

import React, { useMemo } from 'react';
import { useCustomizerViewModel } from '../../store/useCustomizerStore';
import { ArmorType, HeatSinkType } from '../../../../types/SystemComponents';
import {
  ARMOR_LOCATIONS,
  ArmorLocation,
  IArmorSegmentAllocation,
  createEmptyArmorAllocation,
} from '../../../mech-lab/store/MechLabState';
import { WeightOps } from '../../../../mechanics/WeightOps';

const armorTypes: ArmorType[] = Object.values(ArmorType);
const heatSinkTypes: HeatSinkType[] = Object.values(HeatSinkType);

const clampValue = (value: number): number => (Number.isFinite(value) && value >= 0 ? value : 0);

export const ArmorTab: React.FC = () => {
  const { unit, actions } = useCustomizerViewModel();
  const maxArmor = WeightOps.getMaxArmorPoints(unit.tonnage);
  const allocation = unit.armorAllocation ?? createEmptyArmorAllocation();

  const totalAllocated = useMemo(
    () =>
      Object.values(allocation).reduce((sum, segment) => {
        const front = clampValue(segment?.front ?? 0);
        const rear = clampValue(segment?.rear ?? 0);
        return sum + front + rear;
      }, 0),
    [allocation]
  );

  const remainingArmor = maxArmor - totalAllocated;

  const handleArmorChange = (
    location: ArmorLocation,
    field: keyof IArmorSegmentAllocation,
    rawValue: string
  ) => {
    const numeric = clampValue(parseInt(rawValue, 10));
    const current = allocation[location] ?? { front: 0, rear: 0 };
    const nextAllocation: IArmorSegmentAllocation = {
      ...current,
      [field]: numeric,
    };
    actions.setArmorAllocation(location, nextAllocation);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div>
            <label className="text-xs uppercase text-slate-400 block mb-2">Armor Type</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
              value={unit.armorType}
              onChange={event => actions.setArmorType(event.target.value as ArmorType)}
            >
              {armorTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-slate-300">
            <p>
              Total armor allocation:{' '}
              <span className="font-mono text-slate-100">
                {totalAllocated}/{maxArmor}
              </span>
            </p>
            <p
              className={`text-xs ${remainingArmor < 0 ? 'text-red-400' : 'text-slate-500'}`}
            >
              {remainingArmor < 0
                ? `Over capacity by ${Math.abs(remainingArmor)} points`
                : `${remainingArmor} points remaining`}
            </p>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div>
            <label className="text-xs uppercase text-slate-400 block mb-2">Heat Sink Type</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
              value={unit.heatSinkType}
              onChange={event => actions.setHeatSinkType(event.target.value as HeatSinkType)}
            >
              {heatSinkTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500">
            Heat sink weights follow the TechManual defaults (1 ton unless Compact or Laser).
          </p>
        </section>
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wide">
            Armor Allocation
          </h3>
          <p className="text-xs text-slate-500">Values in armor points (1 point = 1/16 ton)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARMOR_LOCATIONS.map(location => {
            const segment = allocation[location.id as ArmorLocation] ?? { front: 0, rear: 0 };
            return (
              <div
                key={location.id}
                className="border border-slate-800 rounded-md p-3 bg-slate-950/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium text-sm">{location.label}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500 uppercase">Front</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono"
                    value={segment.front ?? 0}
                    onChange={event => handleArmorChange(location.id as ArmorLocation, 'front', event.target.value)}
                  />
                </div>
                {location.hasRear && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-500 uppercase">Rear</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono"
                      value={segment.rear ?? 0}
                      onChange={event =>
                        handleArmorChange(location.id as ArmorLocation, 'rear', event.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

