import { internalTrackEvent } from "./core";

/**
 * Tracks a custom event with optional data.
 * Can be called from anywhere in your client-side code after AnalyticsProvider is initialized
 * Events are silently dropped if analytics is not configured
 *
 * @param name - A descriptive name for the event (e.g., "signup-completed")
 * @param data - Optional JSON-serializable object with event context.
 */
export function track(name: string, data?: Record<string, unknown>): void {
  // Delegate directly to the internal function, which handles configuration checks
  internalTrackEvent(name, data);
}
