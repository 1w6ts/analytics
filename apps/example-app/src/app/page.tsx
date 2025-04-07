// apps/example-app/src/app/page.tsx
import Link from "next/link";
import { TestEventButton } from "@/components/test-event-button"; // We'll create this

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          @zeitgg/analytics Example (Central Backend)
        </h1>

        <nav className="flex justify-center space-x-4 md:space-x-6 mb-8 border-b pb-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Home
          </Link>
          <Link href="/about" className="text-blue-600 hover:text-blue-800">
            About
          </Link>
          <Link
            href="/products/123"
            className="text-blue-600 hover:text-blue-800"
          >
            Product Page
          </Link>
        </nav>

        <div className="text-center my-10 space-y-4">
          <p>
            Navigate between pages to test automatic{" "}
            <code className="font-mono bg-gray-100 p-1 rounded text-sm">
              PAGEVIEW
            </code>{" "}
            tracking.
          </p>
          <p>
            Click the button below to test custom{" "}
            <code className="font-mono bg-gray-100 p-1 rounded text-sm">
              EVENT
            </code>{" "}
            tracking using the global `track` function.
          </p>
          <p>
            Core Web Vitals (
            <code className="font-mono bg-gray-100 p-1 rounded text-sm">
              WEBVITAL
            </code>
            ) are tracked automatically.
          </p>
        </div>

        <div className="flex justify-center my-10">
          <TestEventButton />
        </div>
      </div>
    </main>
  );
}
