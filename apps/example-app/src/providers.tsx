// apps/example-app/src/app/providers.tsx
"use client"; // Mark as a Client Component

import React from "react";
// Import the provider from your package
import { AnalyticsProvider } from "@zeitgg/analytics";

// Define a Site ID for this example app.
const EXAMPLE_SITE_ID = "test-site-001";

/**
 * Client component wrapper responsible for rendering the AnalyticsProvider
 * and passing the required siteId prop.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  if (!EXAMPLE_SITE_ID) {
    console.warn("Example App: Site ID is missing. Analytics disabled.");
    return <>{children}</>;
  }

  return (
    <AnalyticsProvider
      siteId={EXAMPLE_SITE_ID}
      // Enable debug logging in development for easier testing
      debug={process.env.NODE_ENV === "development"}
    >
      {children}
    </AnalyticsProvider>
  );
}
