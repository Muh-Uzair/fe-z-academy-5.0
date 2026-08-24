import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h2 className="text-4xl font-bold mb-4 text-gray-800">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-lg">The page or resource you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 transition font-medium">
        Return to Homepage
      </Link>
    </div>
  );
}
