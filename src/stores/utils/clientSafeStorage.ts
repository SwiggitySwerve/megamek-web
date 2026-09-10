/**
 * Client-Safe Storage Utility
 *
 * SSR-safe localStorage wrapper for Zustand persist middleware.
 * Safely handles server-side rendering where window/localStorage are unavailable.
 */

import type { StateStorage } from 'zustand/middleware';

export type StorageWriteReceipt =
  | {
      readonly key: string;
      readonly status: 'saved';
    }
  | {
      readonly error: unknown;
      readonly key: string;
      readonly status: 'failed';
    };

type StorageWriteReceiptListener = (receipt: StorageWriteReceipt) => void;

const storageWriteReceiptListeners = new Set<StorageWriteReceiptListener>();
const latestStorageWriteReceipts = new Map<string, StorageWriteReceipt>();

/**
 * Latest completed write for a storage key in this session, or null if none.
 * Initial and read-only states must not invent a successful write.
 */
export function getLatestStorageWriteReceipt(
  key: string,
): StorageWriteReceipt | null {
  return latestStorageWriteReceipts.get(key) ?? null;
}

/**
 * Observe completed browser-storage writes. Observers run only after setItem
 * succeeds, or with a failure receipt immediately before the error is rethrown.
 */
export function subscribeToStorageWriteReceipts(
  listener: StorageWriteReceiptListener,
): () => void {
  storageWriteReceiptListeners.add(listener);
  return () => storageWriteReceiptListeners.delete(listener);
}

function publishStorageWriteReceipt(receipt: StorageWriteReceipt): void {
  latestStorageWriteReceipts.set(receipt.key, receipt);
  storageWriteReceiptListeners.forEach((listener) => {
    try {
      listener(receipt);
    } catch {
      // Receipt observers must never change the persistence result.
    }
  });
}

/**
 * Storage wrapper that safely handles SSR (no localStorage on server).
 *
 * Returns null/no-op when running on server (typeof window === 'undefined'),
 * preventing hydration errors and SSR crashes.
 */
export const clientSafeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(name, value);
      publishStorageWriteReceipt({ key: name, status: 'saved' });
    } catch (error) {
      publishStorageWriteReceipt({ error, key: name, status: 'failed' });
      throw error;
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
    latestStorageWriteReceipts.delete(name);
  },
};

// =============================================================================
// Simple SSR-Safe Helpers
// =============================================================================

/**
 * Safely get item from localStorage (returns null during SSR).
 * Use this for one-off reads outside of Zustand persist middleware.
 */
export function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

/**
 * Safely set item in localStorage (no-op during SSR).
 * Use this for one-off writes outside of Zustand persist middleware.
 */
export function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

/**
 * Safely remove item from localStorage (no-op during SSR).
 * Use this for one-off deletions outside of Zustand persist middleware.
 */
export function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
  latestStorageWriteReceipts.delete(key);
}
