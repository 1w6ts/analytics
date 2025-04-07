import { type NextWebVitalsMetric } from "next/app";

const CENTRAL_API_ENDPOINT = "https://analytics.zeit.gg/api/track";

interface InternalConfig {
  siteId: string; // Identifier for the user's site/project
  debug: boolean;
}

let config: InternalConfig | null = null;

/**
 * Internal function to set the configuration. Called by AnalyticsProvider.
 */
export function setConfig(newConfig: InternalConfig): void {
  // Check if config actually changed to avoid redundant logs/work
  if (
    config?.siteId === newConfig.siteId &&
    config?.debug === newConfig.debug
  ) {
    return;
  }
  config = newConfig;
  if (config.debug) {
    console.log(
      "[@zeitgg/analytics:core] Configured. Site ID:",
      config.siteId,
      "Debug:",
      config.debug,
      "Endpoint:",
      CENTRAL_API_ENDPOINT // Log the fixed endpoint
    );
  }
}

/**
 * Internal function to check if analytics is configured.
 */
export function isConfigured(): boolean {
  return config !== null && !!config.siteId; // Ensure siteId is present
}

/**
 * Internal function to send data to the CENTRAL endpoint.
 */
async function sendData(
  type: "pageview" | "event" | "webvital",
  payload: unknown
): Promise<void> {
  if (!config) {
    // Guard against calls before config is set
    return;
  }

  const body = JSON.stringify({
    siteId: config.siteId, // <<< Include the siteId in the payload
    type,
    payload,
    meta: {
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.pathname : "",
      hostname: typeof window !== "undefined" ? window.location.hostname : "",
      // Add other anonymous meta if needed (e.g., language, screen size category)
    },
  });

  if (config.debug) {
    console.log("[@zeitgg/analytics:core] Sending data:", body);
  }

  try {
    // Use sendBeacon first
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(CENTRAL_API_ENDPOINT, body);
    } else {
      // Fallback to fetch
      await fetch(CENTRAL_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch (error) {
    console.error("[@zeitgg/analytics:core] Failed to send data:", error);
  }
}

// --- Internal Tracking Functions (no change needed in their logic) ---

export function internalTrackEvent(
  name: string,
  data?: Record<string, unknown>
): void {
  if (!isConfigured()) {
    if (config?.debug) {
      console.warn(
        `[@zeitgg/analytics:core] Analytics not configured (missing siteId?). Event "${name}" dropped.`,
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
  if (!isConfigured()) return;
  if (config?.debug) {
    console.log(
      `[@zeitgg/analytics:core] Tracking page view for "${pathname}"`
    );
  }
  sendData("pageview", { url: pathname });
}

export function internalTrackWebVital(metric: NextWebVitalsMetric): void {
  if (!isConfigured()) return;
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
