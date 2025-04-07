import { NextRequest, NextResponse } from "next/server";
import { Prisma, EventType } from "@prisma/client";
import prisma from "@/lib/prisma";

interface BasePayload {
  meta: {
    timestamp: string; // CLIENT TIMESTAMP
    url: string;
    hostname: string;
  };
}

interface PageViewPayload extends BasePayload {
  type: "pageview";
  payload: { url: string };
}
interface EventPayload extends BasePayload {
  type: "event";
  payload: { name: string; data?: Record<string, unknown> };
}
interface WebVitalPayload extends BasePayload {
  type: "webvital";
  payload: { name: string; value: number; id: string; label: string };
}

interface AnalyticsIncomingPayload {
  siteId: string; // Now includes siteId
  type: "pageview" | "event" | "webvital";
  payload: unknown; // Keep payload flexible initially
  meta: {
    timestamp: string;
    url: string;
    hostname: string;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  let data: AnalyticsIncomingPayload;

  try {
    data = (await request.json()) as AnalyticsIncomingPayload;

    // --- Validation ---
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400, headers: corsHeaders }
      );
    }
    if (
      !data.siteId ||
      typeof data.siteId !== "string" ||
      data.siteId.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Missing or invalid siteId" },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!data.type || !["pageview", "event", "webvital"].includes(data.type)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!data.payload || typeof data.payload !== "object") {
      return NextResponse.json(
        { error: "Invalid payload structure" },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!data.meta || typeof data.meta !== "object") {
      return NextResponse.json(
        { error: "Invalid meta structure" },
        { status: 400, headers: corsHeaders }
      );
    }
    // --- End Validation ---

    // --- Prepare data for Prisma ---
    let eventToCreate: Prisma.AnalyticsEventCreateInput;
    const commonData = {
      siteId: data.siteId, // Store the siteId
      clientTimestamp: new Date(data.meta.timestamp), // Store original timestamp
      url: data.meta.url,
      hostname: data.meta.hostname,
    };

    switch (data.type) {
      case "pageview":
        const pvPayload = data.payload as PageViewPayload["payload"];
        eventToCreate = {
          ...commonData,
          type: EventType.PAGEVIEW,
          pageUrl: pvPayload.url,
        };
        break;
      case "event":
        const evPayload = data.payload as EventPayload["payload"];
        eventToCreate = {
          ...commonData,
          type: EventType.EVENT,
          eventName: evPayload.name,
          eventData: evPayload.data
            ? (evPayload.data as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        };
        break;
      case "webvital":
        const wvPayload = data.payload as WebVitalPayload["payload"];
        eventToCreate = {
          ...commonData,
          type: EventType.WEBVITAL,
          metricName: wvPayload.name,
          metricValue: wvPayload.value,
          metricId: wvPayload.id,
          metricLabel: wvPayload.label,
        };
        break;
      default:
        // Should be caught by validation, but good to have a fallback
        return NextResponse.json(
          { error: "Unknown event type" },
          { status: 400, headers: corsHeaders }
        );
    }
    // --- End Prepare data ---

    // --- Insert into Database ---
    // Use await here to ensure insertion before responding (or handle async if preferred)
    await prisma.analyticsEvent.create({
      data: eventToCreate,
    });
    // --- End Insert ---

    // --- Respond ---
    // 202 Accepted is good practice for ingestion APIs
    return NextResponse.json(
      { message: "Data received" },
      { status: 202, headers: corsHeaders }
    );
  } catch (error) {
    console.error("[Central API Error]", error);
    let errorMessage = "Internal Server Error";
    let statusCode = 500;

    if (error instanceof SyntaxError) {
      errorMessage = "Invalid JSON payload";
      statusCode = 400;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Database error: ${error.code}`;
      statusCode = 500; // Internal DB error
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode, headers: corsHeaders }
    );
  }
}
