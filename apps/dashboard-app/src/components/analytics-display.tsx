"use client";

import { EventType } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea

interface AnalyticsEvent {
  id: string;
  timestamp: Date;
  type: string;
  siteId: string;
  url?: string | null;
  hostname?: string | null;
  pageUrl?: string | null;
  eventName?: string | null;
  eventData?: null | null;
  metricName?: string | null;
  metricValue?: number | null;
  metricId?: string | null;
  metricLabel?: string | null;
}

interface AnalyticsDisplayProps {
  events: AnalyticsEvent[];
  siteId: string;
}

// Helper to format timestamp
const formatTimestamp = (timestamp: Date): string => {
  return new Date(timestamp).toLocaleString(); // Adjust formatting as needed
};

// Helper to render event data nicely
const renderEventData = (data: unknown): string => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return "-";
  }
  try {
    // Limit length for display in table
    const jsonString = JSON.stringify(data);
    return jsonString.length > 50
      ? jsonString.substring(0, 47) + "..."
      : jsonString;
  } catch {
    return "[Invalid Data]";
  }
};

export function AnalyticsDisplay({ events, siteId }: AnalyticsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Events for Site: {siteId}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add ScrollArea for better table handling */}
        <ScrollArea className="h-[600px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>URL / Event / Metric</TableHead>
                <TableHead>Details / Data / Value</TableHead>
                <TableHead>Hostname</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No events found for this site ID.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{formatTimestamp(event.timestamp)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          event.type === EventType.PAGEVIEW
                            ? "secondary"
                            : event.type === EventType.EVENT
                            ? "outline"
                            : "default" // WebVital
                        }
                      >
                        {event.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {event.type === EventType.PAGEVIEW &&
                        (event.pageUrl || event.url)}
                      {event.type === EventType.EVENT && event.eventName}
                      {event.type === EventType.WEBVITAL && event.metricName}
                    </TableCell>
                    <TableCell>
                      {event.type === EventType.PAGEVIEW && "-"}
                      {event.type === EventType.EVENT &&
                        renderEventData(event.eventData)}
                      {event.type === EventType.WEBVITAL &&
                        event.metricValue?.toFixed(2)}
                    </TableCell>
                    <TableCell>{event.hostname ?? "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
