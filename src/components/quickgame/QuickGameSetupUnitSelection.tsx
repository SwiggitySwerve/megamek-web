import type { IQuickGameUnitRequest } from '@/types/quickgame';

import { Button, Card } from '@/components/ui';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { useQuickGameSelector } from '@/stores/useQuickGameStore';

import { DEMO_UNITS } from './quickGameSetup.helpers';

export function UnitSelectionStep(): React.ReactElement {
  const game = useQuickGameSelector((state) => state.game);
  const addUnit = useQuickGameSelector((state) => state.addUnit);
  const removeUnit = useQuickGameSelector((state) => state.removeUnit);
  const updateUnitSkills = useQuickGameSelector(
    (state) => state.updateUnitSkills,
  );
  const nextStep = useQuickGameSelector((state) => state.nextStep);

  const handleAddUnit = (unit: IQuickGameUnitRequest) => {
    addUnit(unit);
  };

  const playerUnits = game?.playerForce.units ?? [];

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-6">
        <h2 className="text-text-theme-primary mb-2 text-xl font-semibold">
          Select Your Units
        </h2>
        <p className="text-text-theme-muted text-sm">
          Add units to your force. The opponent will be generated to match your
          total Battle Value.
        </p>
      </div>

      <Card className="mb-6">
        <div className="border-border-theme border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-text-theme-primary font-medium">Your Force</h3>
            <div className="text-text-theme-muted text-sm">
              <span className="font-medium text-cyan-400">
                {game?.playerForce.totalBV.toLocaleString()}
              </span>{' '}
              BV
              {' / '}
              <span>{game?.playerForce.totalTonnage}</span> tons
            </div>
          </div>
        </div>

        <div className="p-4">
          {playerUnits.length === 0 ? (
            <p className="text-text-theme-muted py-8 text-center">
              No units added yet. Add units from the list below.
            </p>
          ) : (
            <div className="space-y-3">
              {playerUnits.map((unit) => (
                <div
                  key={unit.instanceId}
                  className="bg-surface-base flex items-center justify-between rounded-lg p-3"
                >
                  <div className="flex-1">
                    <p className="text-text-theme-primary font-medium">
                      {unit.name}
                    </p>
                    <div className="text-text-theme-muted mt-1 flex items-center gap-4 text-xs">
                      <span>{unit.tonnage}t</span>
                      <span>{unit.bv.toLocaleString()} BV</span>
                      <span>
                        Skill: {unit.gunnery}/{unit.piloting}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={`${unit.gunnery}/${unit.piloting}`}
                      onChange={(e) => {
                        const [g, p] = e.target.value.split('/').map(Number);
                        updateUnitSkills(unit.instanceId, g, p);
                      }}
                      className="border-border-theme bg-surface-raised text-text-theme-secondary rounded border px-2 py-1 text-xs"
                    >
                      <option value="3/4">Elite (3/4)</option>
                      <option value="4/5">Regular (4/5)</option>
                      <option value="5/6">Green (5/6)</option>
                    </select>
                    <button
                      onClick={() => removeUnit(unit.instanceId)}
                      className="p-1 text-red-400 hover:text-red-300"
                      aria-label="Remove unit"
                    >
                      <SvgIcon
                        size="inline"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </SvgIcon>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="border-border-theme border-b p-4">
          <h3 className="text-text-theme-primary font-medium">
            Available Units
          </h3>
          <p className="text-text-theme-muted mt-1 text-xs">
            Select units to add to your force (demo units shown)
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
          {DEMO_UNITS.map((unit) => (
            <button
              key={unit.sourceUnitId}
              onClick={() => handleAddUnit(unit)}
              className="hover:bg-surface-raised border-border-theme bg-surface-base flex items-center justify-between rounded-lg border p-3 text-left transition-colors hover:border-cyan-500/50"
            >
              <div>
                <p className="text-text-theme-primary text-sm font-medium">
                  {unit.name}
                </p>
                <div className="text-text-theme-muted mt-1 flex items-center gap-3 text-xs">
                  <span>{unit.tonnage}t</span>
                  <span>{unit.bv.toLocaleString()} BV</span>
                </div>
              </div>
              <SvgIcon
                size="control"
                className="h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </SvgIcon>
            </button>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={nextStep}
          disabled={playerUnits.length === 0}
          data-testid="next-step-btn"
        >
          Continue to Configuration
        </Button>
      </div>
    </div>
  );
}
