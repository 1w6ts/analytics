import { type NextWebVitalsMetric } from "next/app";

interface InternalConfig {
  apiEndpoint: string;
  debug: boolean;
}

let config: InternalConfig | null = null;

/**
 * Internal function to set the configuration
 * Called by the AnalyticsProvider.
 */
export function setConfig(newConfig: InternalConfig): void {
  if (
    config?.apiEndpoint === newConfig.apiEndpoint &&
    config?.debug === newConfig.debug
  ) {
    // Avoid unnecessary logging if config hasn't changed
    return;
  }
  config = newConfig;
  if (config.debug) {
    console.log(
      "[@zeitgg/analytics:core] Configured. Endpoint:",
      config.apiEndpoint,
      "Debug:",
      config.debug
    );
  }
}

/**
 * Internal function to check if analytics is configured and ready.
 */
export function isConfigured(): boolean {
  return config != null;
}

/**
 * Internal function to send data to the configured endpoint
 */
async function sendData(
  type: "pageview" | "event" | "webvital",
  payload: unknown
): Promise<void> {
  if (!config) {
    // Should not happen if isConfigured() is checked, but acts as a safeguard
    console.warn(
      "[@zeitgg/analytics:core] Attempted to send data before configuration."
    );
    return;
  }

  const body = JSON.stringify({
    type,
    payload,
    meta: {
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.pathname : "",
      hostname: typeof window !== "undefined" ? window.location.hostname : "",
    },
  });

  if (config.debug) {
    console.log("[@zeitgg/analytics:core] Sending data:", body);
  }

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const sent = navigator.sendBeacon(config.apiEndpoint, body);
      if (!sent && config.debug) {
        console.warn("[@zeitgg/analytics:core] sendBeacon returned false.");
        // Consider fetch fallback here if sendBeacon fails immediately?
      }
    } else {
      // Fallback to fetch for browsers without sendBeacon
      await fetch(config.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true, // Important for fetch on unload
      });
    }
  } catch (error) {
    console.error("[@zeitgg/analytics:core] Failed to send data:", error);
  }
}

// --- Internal Tracking Function ---
export function internalTrackEvent(
  name: string,
  data?: Record<string, unknown>
): void {
  if (!isConfigured()) {
    if (config?.debug) {
      // Check debug flag even if not fully configured
      console.warn(
        `[@zeitgg/analytics:core] Analytics not configured. Event "${name}" dropped.`,
        data
      );
    }
    return;
  }
  if (config?.debug) {
    console.log(
      `[@zeitgg/analytics:core] Tracking event "${name}"`,
      data ?? {}
    );
  }
  sendData("event", { name, data: data ?? {} });
}

export function internalTrackPageView(pathname: string): void {
  if (!isConfigured()) return; // Silently drop if not configured
  if (config?.debug) {
    console.log(
      `[@zeitgg/analytics:core] Tracking page view for "${pathname}"`
    );
  }
  sendData("pageview", { url: pathname }); // Send only pathname
}

export function internalTrackWebVital(metric: NextWebVitalsMetric): void {
  if (!isConfigured()) return; // Silently drop if not configured
  if (config?.debug) {
    console.log(
      `[@zeitgg/analytics:core] Tracking web vital ${metric.name}`,
      metric
    );
  }
  sendData("webvital", {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    label: metric.label,
  });
}
