import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Sorry, we couldn't log you in. The authentication code was invalid or has expired.
        </p>
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            Try Again
          </Link>
          <div>
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition duration-200"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}