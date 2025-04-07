// apps/example-app/src/components/TestEventButton.tsx
"use client"; // Required for onClick handler

import React from "react";
// Import the global track function directly
import { track } from "@zeitgg/analytics";

export function TestEventButton() {
  const handleClick = () => {
    const eventData = {
      location: "homepage",
      variant: Math.random() > 0.5 ? "primary" : "secondary",
      timestamp: new Date().toISOString(),
    };

    // Call the global track function
    track("test_button_click", eventData);

    alert(
      `✅ Event 'test_button_click' tracked!\n\nData Sent:\n${JSON.stringify(
        eventData,
        null,
        2
      )}\n\nCheck the central-api console and database.`
    );
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-150 ease-in-out"
    >
      Track Custom Event (Global Track)
    </button>
  );
}
