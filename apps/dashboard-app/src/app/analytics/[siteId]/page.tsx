// apps/dashboard-app/src/app/analytics/[siteId]/page.tsx
"use client"; // Required for data fetching and state

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Use hook for client components
import { AnalyticsDisplay } from "@/components/analytics-display";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react"; // Example icon

interface AnalyticsEvent {
  id: string;
  timestamp: Date;
  type: string;
  siteId: string;
  url?: string | null;
  hostname?: string | null;
  pageUrl?: string | null;
  eventName?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventData?: any | null;
  metricName?: string | null;
  metricValue?: number | null;
  metricId?: string | null;
  metricLabel?: string | null;
}

interface AnalyticsDataResponse {
  events: AnalyticsEvent[];
  count: number;
  siteId: string;
}

export default function AnalyticsPage() {
  const params = useParams(); // Get route params
  const siteId = params.siteId as string; // Type assertion

  const [data, setData] = useState<AnalyticsDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) {
      setError("Site ID is missing from URL.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct the API URL - Use environment variable for production!
        // For local testing assuming central-api runs on 3001
        const apiUrl =
          process.env.NEXT_PUBLIC_CENTRAL_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/api/analytics/${siteId}`);

        // --- 🔒 Authentication Header Placeholder ---
        // const response = await fetch(`/api/analytics/${siteId}`, {
        //   headers: {
        //     'Authorization': `Bearer YOUR_API_TOKEN_OR_SESSION_COOKIE`
        //   }
        // });
        // --- End Placeholder ---

        if (!response.ok) {
          let errorMsg = `Error: ${response.status} ${response.statusText}`;
          try {
            const errorBody = await response.json();
            errorMsg = errorBody.error || errorMsg;
          } catch {}
          throw new Error(errorMsg);
        }

        const result: AnalyticsDataResponse = await response.json();
        setData(result);
      } catch (err: unknown) {
        console.error("Failed to fetch analytics data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [siteId]); // Re-fetch if siteId changes

  // Loading State
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Success State
  if (data) {
    return (
      <div className="container mx-auto p-4">
        <AnalyticsDisplay events={data.events} siteId={data.siteId} />
      </div>
    );
  }

  // Should not be reached if logic is correct, but good fallback
  return <div className="container mx-auto p-4">No data available.</div>;
}
