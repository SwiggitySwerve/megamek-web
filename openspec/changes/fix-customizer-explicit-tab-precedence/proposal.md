# Explicit customizer tab precedence

## Why

The route resolver currently treats an explicit Structure tab as though no tab were present, allowing a saved last subtab to replace a direct Structure link. The user authorized fixing this remaining item after the specification inventory.

## What Changes

Preserve whether the catch-all route explicitly supplied a valid tab. Explicit valid tabs, including Structure, take precedence over the saved last subtab. Routes with no tab keep their existing persisted/default behavior. Invalid routes retain existing validation behavior. Add route/store integration regressions and a browser refresh scenario.

## Capabilities

### Modified Capabilities
- customizer-routing: distinguish explicit tab selection from omitted tab restoration.

## Impact

Customizer router metadata, route/state composition, focused hook/component tests, and browser routing proof. No storage migration or change to tab identifiers.
