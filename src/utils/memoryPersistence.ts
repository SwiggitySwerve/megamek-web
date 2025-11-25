/**
 * Memory Persistence - Type definitions for component memory system
 * Provides memory state management for component selections
 */

import { ComponentMemoryState } from '../types';

/**
 * Initialize memory system - loads from storage or creates fresh state
 */
export function initializeMemorySystem(): ComponentMemoryState {
  if (typeof window === 'undefined') {
    return createFreshMemoryState();
  }

  try {
    const stored = localStorage.getItem('component-memory-state');
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ComponentMemoryState>;
      return {
        techBaseMemory: parsed.techBaseMemory || { innerSphere: {}, clan: {} },
        lastUpdated: parsed.lastUpdated || Date.now(),
        version: parsed.version || '1.0'
      };
    }
  } catch (error) {
    console.warn('Failed to load memory state:', error);
  }

  const freshState = createFreshMemoryState();
  try {
    localStorage.setItem('component-memory-state', JSON.stringify(freshState));
  } catch (error) {
    console.warn('Failed to save memory state:', error);
  }

  return freshState;
}

/**
 * Create fresh memory state
 */
function createFreshMemoryState(): ComponentMemoryState {
  return {
    techBaseMemory: {
      innerSphere: {},
      clan: {}
    },
    lastUpdated: Date.now(),
    version: '1.0'
  };
}

/**
 * Update memory state
 */
export function updateMemoryState(
  currentState: ComponentMemoryState,
  newMemory: Partial<ComponentMemoryState['techBaseMemory']>,
  persist: boolean = true
): ComponentMemoryState {
  const updated: ComponentMemoryState = {
    ...currentState,
    techBaseMemory: {
      ...currentState.techBaseMemory,
      ...newMemory
    },
    lastUpdated: Date.now()
  };

  if (persist && typeof window !== 'undefined') {
    try {
      localStorage.setItem('component-memory-state', JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to persist memory state:', error);
    }
  }

  return updated;
}

/**
 * Save memory to storage
 */
export function saveMemoryToStorage(state: ComponentMemoryState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('component-memory-state', JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save memory to storage:', error);
  }
}

/**
 * Load memory from storage
 */
export function loadMemoryFromStorage(): ComponentMemoryState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('component-memory-state');
    if (stored) {
      return JSON.parse(stored) as ComponentMemoryState;
    }
  } catch (error) {
    console.warn('Failed to load memory from storage:', error);
  }

  return null;
}

