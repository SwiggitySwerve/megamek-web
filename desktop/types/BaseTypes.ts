/**
 * Base Types for Desktop Services
 * 
 * Local copy of core types needed by Electron services.
 * These match the types in src/services/core/types/BaseTypes.ts
 */

// ============================================================================
// SERVICE INTERFACE
// ============================================================================

/**
 * Base interface for all services
 */
export interface IService {
  /**
   * Initialize the service
   */
  initialize(): Promise<void>;

  /**
   * Cleanup service resources
   */
  cleanup(): Promise<void>;
}

// ============================================================================
// RESULT TYPE
// ============================================================================

/**
 * Result type for operations that can fail
 */
export type ResultType<T, E = string> =
  | { success: true; data: T; error?: never }
  | { success: false; error: E; data?: never };

/**
 * Result class with static factory methods
 */
export class Result {
  /**
   * Create a successful result
   */
  static success<T>(data: T): ResultType<T, never> {
    return { success: true, data };
  }

  /**
   * Create a failed result
   */
  static error<E = string>(error: E): ResultType<never, E> {
    return { success: false, error };
  }

  /**
   * Check if a result is successful
   */
  static isSuccess<T, E>(result: ResultType<T, E>): result is { success: true; data: T } {
    return result.success === true;
  }

  /**
   * Check if a result is an error
   */
  static isError<T, E>(result: ResultType<T, E>): result is { success: false; error: E } {
    return result.success === false;
  }
}
