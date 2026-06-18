"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

function LoginContent() {
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    const checkAuth = async () => {
      const user = await auth.getCurrentUser();

      // If already logged in, redirect to appropriate page
      if (user) {
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push(redirect);
        }
      }
    };

    checkAuth();
  }, [router, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await auth.login(userName, password);

      if (result.success) {
        const user = result.user;

        // Use hard navigation (window.location.href) so the browser sends a
        // fresh request with the newly-set auth_session cookie. If using router.push, 
        // the browser might not send the cookie in the same request.
        if (user?.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = redirect;
        }
      } else {
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-secondary">
            Sign in to LeonShop
          </h2>
          <p className="mt-2 text-center text-sm text-accent">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-secondary mb-1"
              >
                User Name
              </label>
              <input
                id="userName"
                name="userName"
                //type="email"
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your User Name"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-light py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-48 bg-gray-200 rounded mx-auto w-full"></div>
            </div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
