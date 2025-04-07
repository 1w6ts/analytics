import Link from "next/link";

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Product Page: {params.id}</h1>
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
        Viewing product {params.id}. Another pageview event should be triggered.
      </p>
    </main>
  );
}
