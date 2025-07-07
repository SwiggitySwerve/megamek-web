/**
 * Test Helper for Component Name Refactor
 * 
 * This helper provides utilities for testing component name mappings
 */

import { getComponentDisplayName, getComponentIdByName, isSpecialComponent } from '../utils/componentNameUtils';

/**
 * Test helper to verify component ID mapping
 */
export function expectComponentId(actualId: string, expectedId: string) {
  expect(actualId).toBe(expectedId);
}

/**
 * Test helper to verify component display name
 */
export function expectComponentDisplayName(actualName: string, expectedName: string) {
  expect(actualName).toBe(expectedName);
}

/**
 * Test helper to verify special component detection
 */
export function expectSpecialComponent(id: string, expected: boolean = true) {
  expect(isSpecialComponent(id)).toBe(expected);
}

/**
 * Test helper to verify component mapping functions
 */
export function expectComponentMapping(id: string, expectedDisplayName: string) {
  expect(getComponentDisplayName(id)).toBe(expectedDisplayName);
  expect(getComponentIdByName(expectedDisplayName)).toBe(id);
}
