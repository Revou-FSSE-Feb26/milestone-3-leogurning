"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm text-center">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-secondary">Access Denied</h1>
          <p className="mt-4 text-accent">
            You do not have permission to access this page. This area is
            restricted to authorized personnel only.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </Link>

          <button
            onClick={() => router.back()}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 text-secondary rounded-lg hover:bg-light transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <p className="text-xs text-accent">
          You will be redirected to the homepage in 5 seconds...
        </p>
      </div>
    </div>
  );
}
