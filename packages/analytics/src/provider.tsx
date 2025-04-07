"use client"; // Essential: This component uses hooks and runs client-side

import React, { useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation"; // Use App Router hook
import { useReportWebVitals } from "next/web-vitals";
import { type NextWebVitalsMetric } from "next/app";
import {
  setConfig,
  internalTrackPageView,
  internalTrackWebVital,
} from "./core"; // Import internal functions

export interface AnalyticsProviderProps {
  domain: string;
  /** Optional: Set to true to disable automatic page view tracking. Defaults to false. */
  disableAutoPageView?: boolean;
  /** Optional: Enables verbose logging. Defaults to true if NODE_ENV is 'development'. */
  debug?: boolean;
  /** Optional: Specify scheme (http or https). Defaults to 'https'. */
  scheme?: "http" | "https";
  /** Optional: Specify a custom API path. Defaults to '/api/track'. */
  apiPath?: string;
  children: ReactNode;
}

export function AnalyticsProvider({
  domain,
  disableAutoPageView = false,
  debug = process.env.NODE_ENV === "development", // Default debug based on env
  scheme = "https",
  apiPath = "/api/track",
  children,
}: AnalyticsProviderProps): JSX.Element {
  const pathname = usePathname(); // Get current path

  // Effect to initialize/update the internal config when props change
  useEffect(() => {
    if (!domain) {
      if (debug) {
        console.warn(
          "[@zeitgg/analytics:Provider] 'domain' prop is missing or empty. Analytics disabled."
        );
      }
      // Potentially call setConfig with null or a disabled state if needed
      return;
    }

    // Construct the full API endpoint URL
    // Handle potential trailing slash in domain and leading slash in apiPath
    const normalizedDomain = domain.replace(/\/$/, "");
    const normalizedApiPath = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
    const endpoint = `${scheme}://${normalizedDomain}${normalizedApiPath}`;

    setConfig({ apiEndpoint: endpoint, debug });
  }, [domain, debug, scheme, apiPath]); // Re-run if config props change

  // Effect for automatic page view tracking
  useEffect(() => {
    // Track page view when pathname changes, if enabled and configured
    if (!disableAutoPageView && pathname) {
      // internalTrackPageView handles the isConfigured check internally
      internalTrackPageView(pathname);
    }
  }, [pathname, disableAutoPageView]); // Re-run when pathname changes

  // Hook for Web Vitals reporting
  useReportWebVitals((metric: NextWebVitalsMetric) => {
    // internalTrackWebVital handles the isConfigured check internally
    internalTrackWebVital(metric);
  });

  // This provider's main job is to configure the core module via useEffects.
  // It doesn't need to provide a React Context for the global 'track' function.
  return <>{children}</>; // Render children directly
}
