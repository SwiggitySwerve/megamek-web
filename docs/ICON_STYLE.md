# Application icon style

Use `AppIcon` from `@/components/ui/AppIcon` for recurring actions. Use `SvgIcon` from `@/components/ui/SvgIcon` for a domain-specific symbol that has no named equivalent. Reuse a named drawing when the action has the same meaning; do not substitute a Unicode character or emoji for a control icon.

| Role      |  Size | Use                                                               |
| --------- | ----: | ----------------------------------------------------------------- |
| `inline`  | 16 px | Status markers, tab close controls, disclosure arrows beside text |
| `control` | 20 px | Standard buttons, navigation links, menus, inputs                 |
| `toolbar` | 24 px | Icon controls in application and panel headers                    |
| `feature` | 32 px | Feature/card illustrations                                        |
| `hero`    | 48 px | Large empty-state illustrations                                   |

Control glyphs use a 24-unit square drawing grid, 2-unit round strokes, centered alignment, and `currentColor`. The shared frame fixes the rendered square and prevents flex shrinking. Keep drawing bounds optically balanced within the grid; never stretch a chevron or ellipsis to fill a square. Filled marks such as ellipsis dots retain their silhouette. The size role, rather than a local `h-*`/`w-*` override, controls dimensions.

Keep icon-only buttons at least 44×44 px and give the button an action-specific accessible name. Icons inside labeled buttons are decorative. Pass `label` only when an icon communicates standalone information. A disabled button may change icon opacity; do not give an enabled icon a weaker stroke.

Use `add` for adding, `save` for saving to the library, `more` for action menus, `list` for opening the loadout, `panel-right-close` / `panel-right-open` for hiding/restoring its sidebar, `category` for category grouping, and `location` for location grouping. `close` dismisses a view; `trash` removes equipment or other data.

Use `mech`, `pilot`, `force`, and `encounter` consistently for those entities across navigation and content. Preserve different domain meanings such as heat, damage, attack, and timing when choosing a status symbol.

Map artwork, unit/armor diagrams, graphs, print/record sheets, and brand images are not UI icons and keep their own drawing rules. Do not apply the `.ui-icon` class to them.

The AppIcon Storybook gallery shows the complete named set and the size scale. Browser checks measure the rendered header/panel symbols and exercise their controls, including the loadout menu at narrow widths.
