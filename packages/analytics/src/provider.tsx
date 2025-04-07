// packages/analytics/src/provider.tsx
"use client"; // Essential

import React, { useEffect, ReactNode, JSX } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { NextWebVitalsMetric } from "next/app";
import {
  setConfig,
  internalTrackPageView,
  internalTrackWebVital,
} from "./core";

export interface AnalyticsProviderProps {
  /** A unique identifier for your site or project provided by Zeitgg Analytics. */
  siteId: string; // Changed from 'domain'
  /** Optional: Set to true to disable automatic page view tracking. Defaults to false. */
  disableAutoPageView?: boolean;
  /** Optional: Enables verbose logging. Defaults to true if NODE_ENV is 'development'. */
  debug?: boolean;
  children: ReactNode;
}

export function AnalyticsProvider({
  siteId, // Changed from 'domain'
  disableAutoPageView = false,
  debug = process.env.NODE_ENV === "development",
  children,
}: AnalyticsProviderProps): JSX.Element {
  const pathname = usePathname();

  // Effect to initialize/update the internal config
  useEffect(() => {
    // Validate the siteId prop
    if (!siteId || typeof siteId !== "string" || siteId.trim() === "") {
      if (debug ?? process.env.NODE_ENV === "development") {
        // Check debug flag carefully
        console.warn(
          "[@zeitgg/analytics:Provider] 'siteId' prop is missing or invalid. Analytics disabled."
        );
      }
      // Ensure config is reset if siteId becomes invalid
      setConfig({ siteId: "", debug: debug ?? false }); // Pass empty siteId to signal disabled state
      return;
    }

    // Set the configuration using the provided siteId
    setConfig({ siteId, debug });
  }, [siteId, debug]); // Re-run if siteId or debug prop changes

  useEffect(() => {
    if (!disableAutoPageView && pathname) {
      internalTrackPageView(pathname);
    }
  }, [pathname, disableAutoPageView]);

  useReportWebVitals((metric: NextWebVitalsMetric) => {
    internalTrackWebVital(metric);
  });

  return <>{children}</>;
}
