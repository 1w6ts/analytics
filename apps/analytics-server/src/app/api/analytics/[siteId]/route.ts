// apps/central-api/src/app/api/analytics/[siteId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import your Prisma client instance
import { AnalyticsEvent } from "@prisma/client"; // Import the type

// Define CORS headers - Adjust origin for production!
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or your specific dashboard domain
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization", // Add Authorization if needed
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// Define the expected shape of the response data
export interface AnalyticsDataResponse {
  events: AnalyticsEvent[];
  count: number;
  siteId: string;
}

// GET handler to fetch analytics for a specific siteId
export async function GET(
  request: NextRequest,
  context: { params: { siteId: string } } // The second argument is 'context' containing 'params'
): Promise<NextResponse> {
  const siteId = context.params.siteId;

  // --- 🔒 Authentication/Authorization Placeholder ---
  // In a real application, you MUST protect this endpoint.
  // Check if the requesting user is authenticated and authorized
  // to view analytics for this specific `siteId`.
  // Example (pseudo-code):
  // const user = await getCurrentUser(request); // Implement this
  // const canAccess = await checkUserAccess(user, siteId); // Implement this
  // if (!canAccess) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 403, headers: corsHeaders });
  // }
  console.warn(
    `[API /api/analytics/${siteId}] 🔒 Auth check skipped (placeholder)`
  );
  // --- End Placeholder ---

  if (!siteId) {
    return NextResponse.json(
      { error: "siteId parameter is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const events = await prisma.analyticsEvent.findMany({
      where: {
        siteId: siteId,
      },
      orderBy: {
        timestamp: "desc", // Show most recent first
      },
      take: 100, // Limit the number of results for now
    });

    const count = events.length; // Or potentially do a separate count query

    const responseData: AnalyticsDataResponse = {
      events,
      count,
      siteId,
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error(`[API /api/analytics/${siteId}] Error fetching data:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
