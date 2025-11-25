'use client';

import React from 'react';
import { useCustomizerStore } from '../../store/useCustomizerStore';

export const FluffTab: React.FC = () => {
  const unit = useCustomizerStore(state => state.unit);
  const updateUnit = useCustomizerStore(state => state.updateUnit);
  const setFluffNotes = useCustomizerStore(state => state.setFluffNotes);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
        <div>
          <label className="text-xs uppercase text-slate-400 block mb-2">Chassis Name</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
            value={unit.name}
            onChange={event => updateUnit({ name: event.target.value })}
          />
        </div>
        <div>
          <label className="text-xs uppercase text-slate-400 block mb-2">Model</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
            value={unit.model}
            onChange={event => updateUnit({ model: event.target.value })}
          />
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase text-slate-400">Deployment Notes</label>
          <span className="text-[10px] text-slate-500">{unit.fluffNotes.length}/2000</span>
        </div>
        <textarea
          className="w-full min-h-[220px] bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
          placeholder="Document famous pilots, notable engagements, factory notes, etc."
          value={unit.fluffNotes}
          maxLength={2000}
          onChange={event => setFluffNotes(event.target.value)}
        />
        <p className="text-[11px] text-slate-500">
          Fluff notes travel with exports and give context to anyone loading the design in the
          future. Markdown is supported in downstream tooling, so feel free to use headings or
          bullet lists.
        </p>
      </section>
    </div>
  );
};

