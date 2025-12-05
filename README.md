# BattleTech Editor

A modern, spec-driven web application for constructing and customizing BattleTech combat units. Built with Next.js 16, React 19, and TypeScript with a focus on accuracy to official construction rules.

<div align="center">

![Code License](https://img.shields.io/badge/code-Apache%202.0-blue.svg)
![Data License](https://img.shields.io/badge/data-CC--BY--NC--SA--4.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

**Based on concepts from [MegaMek](https://megamek.org) • Implemented by [SwerveLabs](https://github.com/swervelabs)**

</div>

---

## Overview

BattleTech Editor is a comprehensive unit construction application that implements the official BattleTech TechManual rules. The project uses an **OpenSpec-driven architecture** where domain specifications serve as the single source of truth, ensuring accurate rule implementation and maintainable code.

### Key Features

- **Complete Unit Customizer** — Full BattleMech construction with 7-tab interface (Overview, Structure, Armor, Equipment, Criticals, Fluff, Preview)
- **Multi-Unit Workspace** — Browser-like tabs for editing and comparing multiple units simultaneously
- **Equipment Browser** — Unified browser for weapons, ammunition, electronics, and miscellaneous equipment with advanced filtering
- **Critical Slot Management** — Drag-and-drop equipment placement with location validation and auto-assignment
- **Armor Allocation** — Visual diagram editor with auto-allocation algorithms and front/rear distribution
- **Record Sheet Preview** — Live SVG-based record sheet preview with PDF export using MegaMek-compatible templates
- **Custom Unit Persistence** — SQLite-backed storage with version history, clone protection, and JSON export
- **Unit Metrics** — Battle Value (BV 2.0), C-Bill cost, and rules level calculations
- **Tech Base Support** — Inner Sphere, Clan, and Mixed Tech configurations with automatic validation
- **Era Filtering** — Filter equipment by historical availability across all canonical eras

---

## Recent Capabilities

### Record Sheet Export (December 2025)
- **SVG Template Rendering** — Uses MegaMek's original SVG templates for pixel-perfect record sheet generation
- **Live Preview Tab** — Real-time preview with zoom controls (20%-300%)
- **PDF Export** — Client-side PDF generation using jsPDF with full armor pip rendering
- **Armor Pip Integration** — Proper matrix transforms matching MegaMekLab's Java implementation

### Custom Unit Persistence (December 2025)
- **SQLite Backend** — Cross-platform storage replacing browser-specific IndexedDB
- **Version History** — Save increments with full revert capability
- **Canonical Protection** — Official units are read-only; modifications create editable copies
- **Clone Naming** — Automatic naming convention (`{Chassis} {Variant}-Custom-{n}`)
- **JSON Export** — Portable unit files for sharing

### Unit Metrics System (December 2025)
- **Battle Value 2.0** — Defensive BV, offensive BV, speed factor calculations
- **C-Bill Cost** — Complete TechManual cost formulas for all components
- **Rules Level** — Introductory, Standard, Advanced, Experimental classification

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |
| `npm run test:coverage` | Run tests with coverage report |

---

## Architecture

The application follows a **spec-driven development** approach where OpenSpec specifications define domain rules before implementation.

```
OpenSpec Specs → TypeScript Types → Services → Components
     ↓                 ↓              ↓           ↓
  (Rules)          (Contracts)    (Logic)      (UI)
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 |
| UI | React 19 + Tailwind CSS 4 |
| State | Zustand 5 (isolated per-unit stores) |
| Drag & Drop | react-dnd |
| Search | MiniSearch |
| Database | SQLite (better-sqlite3) |
| PDF | jsPDF |
| Testing | Jest + React Testing Library |
| Language | TypeScript 5.8 |

### Project Structure

```
megamek-web/
├── openspec/               # Specifications (domain truth)
│   ├── specs/              # 58 capability specs
│   │   ├── armor-system/
│   │   ├── engine-system/
│   │   ├── record-sheet-export/
│   │   ├── unit-versioning/
│   │   └── ...
│   └── changes/            # Change proposals (active & archived)
├── src/
│   ├── components/         # React UI components
│   │   ├── common/         # Shared components
│   │   ├── customizer/     # Unit editor components
│   │   │   ├── armor/      # Armor diagram & editors
│   │   │   ├── critical-slots/ # Drag-drop slot management
│   │   │   ├── dialogs/    # Modal dialogs
│   │   │   ├── equipment/  # Equipment browser
│   │   │   ├── preview/    # Record sheet preview
│   │   │   ├── shared/     # Unit info components
│   │   │   └── tabs/       # Tab components
│   │   └── ui/             # Design system primitives
│   ├── pages/              # Next.js pages & API routes
│   │   ├── api/            # REST API endpoints
│   │   ├── customizer/     # Unit construction UI
│   │   ├── compendium/     # Equipment browser
│   │   └── compare/        # Unit comparison
│   ├── services/           # Business logic layer
│   │   ├── construction/   # Construction services
│   │   ├── equipment/      # Equipment services
│   │   ├── printing/       # Record sheet rendering
│   │   ├── persistence/    # SQLite storage
│   │   └── units/          # Unit services
│   ├── types/              # TypeScript definitions
│   │   ├── core/           # Base interfaces
│   │   ├── enums/          # TechBase, Era, RulesLevel
│   │   ├── construction/   # Engine, Gyro, Armor types
│   │   ├── equipment/      # Weapons, ammo, electronics
│   │   └── printing/       # Record sheet types
│   └── utils/              # Calculation utilities
│       ├── construction/   # Engine, armor, movement calc
│       └── equipment/      # Equipment property calc
├── public/
│   ├── data/               # JSON data files (CC-BY-NC-SA-4.0)
│   │   ├── units/          # 4200+ unit files
│   │   └── equipment/      # Equipment catalogs
│   └── record-sheets/      # SVG templates & assets
│       ├── templates/      # MegaMek record sheet templates
│       └── biped_pips/     # Armor pip graphics
└── docs/                   # Development documentation
```

---

## OpenSpec System

This project uses [OpenSpec](openspec/AGENTS.md) for specification-driven development. All BattleTech construction rules are documented in machine-readable specifications before implementation.

### Specification Categories

| Category | Specs | Examples |
|----------|-------|----------|
| **Foundation** | 7 | Core Entity Types, Enumerations, Era System, Weight Classes |
| **Construction** | 13 | Engine, Gyro, Armor, Structure, Heat Sinks, Movement |
| **Equipment** | 8 | Weapons, Ammunition, Electronics, Physical Weapons |
| **Validation** | 6 | Construction Rules, Validation Patterns, Data Integrity |
| **UI Components** | 14 | Critical Slots, Armor Diagram, Equipment Browser, Multi-Unit Tabs |
| **Services** | 6 | Unit Services, Equipment Services, Persistence, Construction |
| **Data Models** | 4 | Unit Entity Model, Serialization, Database Schema |

### Viewing Specifications

```bash
# List all specifications
npx openspec list --specs

# View a specific spec
npx openspec show engine-system --type spec

# List active changes
npx openspec list
```

---

## API Reference

REST API endpoints for accessing unit and equipment data:

### Units

| Endpoint | Description |
|----------|-------------|
| `GET /api/units` | List units with filtering & pagination |
| `GET /api/catalog` | Unit catalog with search |
| `GET /api/custom-variants` | Custom unit variants |
| `GET /api/custom-variants/[id]` | Specific variant details |
| `POST /api/custom-variants` | Save custom unit |
| `PUT /api/custom-variants/[id]` | Update custom unit |
| `DELETE /api/custom-variants/[id]` | Delete custom unit |

### Equipment

| Endpoint | Description |
|----------|-------------|
| `GET /api/equipment` | List equipment with filtering |
| `GET /api/equipment/catalog` | Equipment catalog |
| `GET /api/equipment/filters` | Available filter options |

### Metadata

| Endpoint | Description |
|----------|-------------|
| `GET /api/meta/categories` | Unit categories |
| `GET /api/meta/unit_eras` | Available eras |
| `GET /api/meta/unit_tech_bases` | Tech base options |
| `GET /api/meta/equipment_categories` | Equipment categories |
| `GET /api/meta/unit_weight_classes` | Weight class definitions |

---

## BattleTech Rules

This project implements official BattleTech construction rules from the TechManual. The `constants/BattleTechConstructionRules.ts` file serves as the code-level single source of truth.

### Key Rules Quick Reference

| Component | Formula |
|-----------|---------|
| **Engine Rating** | Walk MP × Tonnage |
| **Engine Weight** | Lookup table by rating + type modifier |
| **Gyro Weight** | ceil(Engine Rating / 100) × type modifier |
| **Structure Weight** | Tonnage × 0.10 (Standard), × 0.05 (Endo Steel) |
| **Max Armor** | Structure Points × 2 (Head = 9) |
| **Internal Heat Sinks** | floor(Engine Rating / 25) |
| **Run MP** | ceil(Walk MP × 1.5) |
| **Jump MP** | ≤ Walk MP (standard jets) |

### Critical Slot Allocations

| Location | Slots |
|----------|-------|
| Head | 6 |
| Center Torso | 12 |
| Side Torsos | 12 each |
| Arms | 12 each |
| Legs | 6 each |
| **Total** | **78** |

---

## Development

### Adding Features

1. **Check OpenSpec** — Review existing specifications
2. **Create Change Proposal** — Use `openspec/changes/` for new features
3. **Implement** — Follow types from `src/types/`
4. **Test** — Add tests matching spec scenarios
5. **Validate** — Run `npm run validate:refactor`

### Code Standards

- **Type Safety** — No `as any` or `as unknown as` casting
- **SOLID Principles** — Services for business logic, components for UI
- **Naming** — Services end with `Service`, Validators with `Validator`
- **Constants** — Use enums and constants, no magic strings
- **Concrete Types** — Avoid ambiguous types; prefer explicit interfaces

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

---

## Data

The project includes comprehensive BattleTech data derived from the MegaMek project:

- **4,200+ Unit Files** — Converted from MegaMek MTF format
- **Equipment Catalogs** — Weapons, ammo, electronics, misc equipment
- **Era Data** — Age of War through Dark Age availability
- **Record Sheet Assets** — SVG templates and pip graphics

### Converting Units

```bash
# Convert MTF files to JSON
npm run convert:mtf

# Extract equipment data
npm run extract:equipment

# Generate unit index with metrics
npm run generate:index
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Review relevant OpenSpec specifications
4. Follow code standards (no `as any`, use types)
5. Add tests for new functionality
6. Submit a pull request

By contributing, you agree that:
- Code contributions will be licensed under Apache 2.0
- Data/asset contributions derived from MegaMek will be licensed under CC-BY-NC-SA-4.0

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Project Structure](docs/architecture/project-structure.md) | Codebase organization |
| [Getting Started](docs/development/getting-started.md) | Development setup |
| [Coding Standards](docs/development/coding-standards.md) | Code style guidelines |
| [OpenSpec Guide](openspec/AGENTS.md) | Specification system |

---

## Roadmap

### Current Focus
- 🎨 **UI Polish** — Refining customizer interface with improved UX
- 📋 **Equipment Browser** — Enhanced filtering and category organization
- 📄 **Record Sheets** — Complete pip rendering for all unit types

### Upcoming
- 🚁 **Vehicle Support** — Combat vehicles, VTOLs, support vehicles
- ✈️ **Aerospace Units** — Fighters, dropships, small craft
- 🖥️ **Desktop App** — Electron wrapper for offline use
- 🌐 **Multi-User Mode** — Shared unit libraries and collaboration

---

## License

This project uses a **dual-license** approach:

| Component | License | File |
|-----------|---------|------|
| **Source Code** | Apache License 2.0 | [LICENSE.code](LICENSE.code) |
| **Game Data & Assets** | CC-BY-NC-SA-4.0 | [LICENSE.assets](LICENSE.assets) |

See [LICENSE](LICENSE) for complete details.

---

## Credits & Attribution

### MegaMek Project
This application is inspired by and builds upon concepts from the **MegaMek** suite of applications:
- **Website**: https://megamek.org
- **Repository**: https://github.com/MegaMek
- **MegaMekLab**: The original Java-based unit construction tool that inspired this project's functionality
- **License**: CC-BY-NC-SA-4.0 (data/assets), GPLv3 (original code)

Unit data, record sheet SVG templates, and armor pip graphics are derived from MegaMek assets.

### SwerveLabs
This web application implementation was developed by **SwerveLabs**:
- Modern TypeScript/React reimplementation of MegaMekLab concepts
- OpenSpec-driven architecture for maintainable, spec-compliant code
- SVG-based record sheet rendering matching MegaMekLab's output quality

### Non-Commercial Use

Due to the CC-BY-NC-SA-4.0 license on derived game data, this project **cannot be used for commercial purposes** when incorporating those materials. Content creators may monetize videos/streams about the application per MegaMek's content creator policy.

---

<div align="center">

**BattleTech is a registered trademark of The Topps Company, Inc.**

MechWarrior, BattleMech, 'Mech, and AeroTech are registered trademarks of The Topps Company, Inc.

This project was created under Microsoft's "Game Content Usage Rules" and is not endorsed by or affiliated with Microsoft, The Topps Company, Inc., or Catalyst Game Labs.

*This is an unofficial, fan-created tool.*

</div>
