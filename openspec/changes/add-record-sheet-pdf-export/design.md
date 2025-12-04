# Design: Record Sheet PDF Export

## Context

BattleTech tabletop gameplay requires printed record sheets showing unit stats, armor diagrams, weapons, and critical hit locations. MegaMekLab uses SVG templates with Apache Batik for PDF generation. For the web application, we need a client-side solution that works offline and can eventually be used in an Electron desktop app.

## Goals / Non-Goals

**Goals:**
- Generate MegaMekLab-style record sheets usable for tabletop play
- Provide live preview in the customizer as users edit units
- Support PDF download and browser print
- Architecture extensible for other unit types (vehicles, aerospace, etc.)

**Non-Goals:**
- Perfect pixel-for-pixel match with MegaMekLab output
- Server-side PDF generation
- Multi-unit batch printing (future enhancement)
- Reference charts/tables on record sheet (future enhancement)

## Decisions

### Decision: Use jsPDF for PDF Generation

**Rationale:** jsPDF is a mature, well-maintained library with good browser support. It works entirely client-side, supports custom fonts, and can embed images. Alternatives like pdfmake have similar capabilities but jsPDF has simpler API for programmatic drawing.

**Alternatives Considered:**
- **pdfmake**: Declarative document definition, but less control over exact positioning
- **Puppeteer/Headless Chrome**: Requires server, not suitable for client-side
- **html2pdf.js**: Uses html2canvas, quality issues with complex layouts

### Decision: Canvas-based Preview with SVG Fallback

**Rationale:** Canvas provides fast rendering for the preview and can be converted to image data for PDF embedding. SVG could be used as fallback for better print quality but adds complexity.

### Decision: Modular Renderer Architecture

**Rationale:** Separating renderers (ArmorDiagramRenderer, EquipmentTableRenderer, etc.) allows:
- Independent testing of each component
- Easy extension for other unit types
- Reuse of common elements (heat scale, pilot data)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PreviewTab                           │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │   PreviewToolbar    │  │  RecordSheetPreview      │  │
│  │  [Download] [Print] │  │  (Canvas rendering)      │  │
│  └─────────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 RecordSheetService                       │
│  - generatePreview(unit) → Canvas                        │
│  - exportPDF(unit) → Blob                               │
│  - print(unit) → window.print()                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              MechRecordSheetRenderer                     │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐                 │
│  │ ArmorDiagram   │  │ EquipmentTable │                 │
│  │ Renderer       │  │ Renderer       │                 │
│  └────────────────┘  └────────────────┘                 │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │ CriticalSlots  │  │ HeatScale      │                 │
│  │ Renderer       │  │ Renderer       │                 │
│  └────────────────┘  └────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

## Record Sheet Layout (Letter/A4)

```
┌──────────────────────────────────────────────────────────────┐
│  BATTLEMECH RECORD SHEET                                     │
├──────────────────────────────────────────────────────────────┤
│  Name: ________________  Tonnage: ___  Tech: ___  BV: ___    │
├────────────────────────────┬─────────────────────────────────┤
│                            │  WEAPONS & EQUIPMENT            │
│      ARMOR DIAGRAM         │  ┌───┬────┬───┬───┬───┬───┬───┐ │
│                            │  │Qty│Type│Loc│Ht │Dmg│Rng│   │ │
│    [Head Armor]            │  ├───┼────┼───┼───┼───┼───┼───┤ │
│         ___                │  │ 1 │ML  │RA │ 3 │ 5 │S/M│   │ │
│        /   \               │  │...│... │...│...│...│...│   │ │
│   LA  | CT  | RA           │  └───┴────┴───┴───┴───┴───┴───┘ │
│       |_____|              │                                 │
│       |     |              │  HEAT SCALE                     │
│   LL  |     | RL           │  [0][1][2]...[30]               │
│       |_____|              │                                 │
│                            │  Heat Sinks: __ (__)            │
├────────────────────────────┴─────────────────────────────────┤
│  CRITICAL HIT TABLE                                          │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐     │
│  │  HEAD  │   CT   │   LT   │   RT   │   LA   │   RA   │     │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤     │
│  │1._____ │1._____ │1._____ │1._____ │1._____ │1._____ │     │
│  │2._____ │2._____ │2._____ │2._____ │2._____ │2._____ │     │
│  │...     │...     │...     │...     │...     │...     │     │
│  └────────┴────────┴────────┴────────┴────────┴────────┘     │
├──────────────────────────────────────────────────────────────┤
│  PILOT: ____________  Gunnery: __  Piloting: __              │
└──────────────────────────────────────────────────────────────┘
```

## Risks / Trade-offs

- **Risk:** Canvas rendering may have slight differences across browsers
  - **Mitigation:** Test on major browsers, use standard fonts

- **Risk:** Large equipment lists may not fit in allocated space
  - **Mitigation:** Auto-scale font size or paginate

- **Trade-off:** Simplified armor diagram vs MegaMekLab's detailed pip layout
  - Chose simpler approach for initial implementation; can enhance later

## Open Questions

- Should we support custom fonts (Eurostile like MegaMekLab)?
- Multi-page support for units with many weapons?
- Include reference charts on record sheet?

