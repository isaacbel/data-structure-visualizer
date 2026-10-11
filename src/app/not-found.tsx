import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
      <div className="glass-card max-w-md p-8">
        <h2 className="mb-4 text-2xl font-bold text-cyan-400">Page Not Found</h2>
        <p className="mb-6 text-sm text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  )
}
