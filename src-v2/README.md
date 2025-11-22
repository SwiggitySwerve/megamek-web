# BattleTech Editor v2 (Alpha)

This directory (`src-v2`) contains the re-engineered core for the BattleTech Unit Creator. It is designed to replace the legacy logic in `src/` with a strictly typed, SOLID-compliant implementation.

## 🎯 Design Philosophy

1.  **Strict Type Safety**: No `any` casts. All data uses Discriminated Unions (`TechBase`, `ComponentType`) and strict Interfaces.
2.  **Single Source of Truth**: Rules (weight, slots, construction limits) are defined in `src-v2/data/` tables, sourced directly from the *TechManual*.
3.  **Pure Mechanics**: Calculation logic (Engine rating, Structure weight) is separated from UI and State. See `src-v2/mechanics/`.
4.  **No Magic Strings**: All string values (e.g., "Inner Sphere", "Standard") are defined in Enums/Constants.

## 📂 Structure

- **`types/`**: Core domain definitions.
    - `TechBase.ts`, `ComponentType.ts`: Foundational Enums.
    - `SystemComponents.ts`: Engine, Gyro, Structure definitions.
    - `Equipment.ts`: Weapons and Ammo interfaces.
    - `BattleMech.ts`: The aggregate root interface.

- **`data/`**: Static rule tables and equipment databases.
    - `EngineTables.ts`: Weight multipliers, slot requirements.
    - `weapons/`: Weapon definitions (Energy, Ballistic, Missile).

- **`mechanics/`**: Pure business logic functions.
    - `Engine.ts`: Calculates weight/slots given rating/type.
    - `CriticalSlots.ts`: Generates dynamic slot layouts (Paper Doll).
    - `Validation.ts`: Checks rules (tonnage limits, era restrictions).

- **`features/mech-lab/`**: UI and State Management.
    - `store/`: React Hook-based state store (`useMechLabStore`).
    - `components/`: Modular UI panels (Engine, Structure, Paper Doll).

## 🛠️ Usage

The entry point is `features/mech-lab/components/MechDashboard.tsx`. This component provides a self-contained UI for editing a Mech.

```tsx
import { MechDashboard } from 'src-v2/features/mech-lab/components/MechDashboard';

// ... in your router or app
<MechDashboard />
```

## 🧪 Testing

Validation scripts are located in `__tests__/`.
- `verify-v2-foundation.ts`: Unit tests for core mechanics.
- `validate-v2-logic.ts`: Integration tests for state and validation.

Run with:
```bash
npx tsx src-v2/__tests__/validate-v2-logic.ts
```

