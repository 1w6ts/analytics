-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PAGEVIEW', 'EVENT', 'WEBVITAL');

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EventType" NOT NULL,
    "siteId" TEXT NOT NULL,
    "client_timestamp" TIMESTAMP(3) NOT NULL,
    "url" TEXT,
    "hostname" TEXT,
    "pageUrl" TEXT,
    "eventName" TEXT,
    "eventData" JSONB,
    "metricName" TEXT,
    "metricValue" DOUBLE PRECISION,
    "metricId" TEXT,
    "metricLabel" TEXT,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_siteId_idx" ON "AnalyticsEvent"("siteId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_timestamp_idx" ON "AnalyticsEvent"("timestamp");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_hostname_idx" ON "AnalyticsEvent"("hostname");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_idx" ON "AnalyticsEvent"("eventName");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_metricName_idx" ON "AnalyticsEvent"("metricName");
