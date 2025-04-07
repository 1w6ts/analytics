import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">About Page</h1>
      <nav className="space-x-4 mb-8">
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
      <p>
        This is the about page. Navigating here should trigger a pageview event.
      </p>
    </main>
  );
}
