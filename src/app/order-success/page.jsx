"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="pt-24 pb-12 min-h-screen bg-light flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-secondary mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-accent text-lg mb-8">
            Thank you for your purchase. Your order has been confirmed and will
            be processed shortly.
          </p>

          <div className="bg-light p-6 rounded-xl mb-8">
            <p className="text-secondary mb-2">
              <span className="font-medium">Order Confirmation:</span> #ORD-
              {Math.floor(Math.random() * 100000)}
            </p>
            <p className="text-accent">
              A confirmation email has been sent to your email address.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="text-accent mt-8">Redirecting to home page...</p>
        </div>
      </div>
    </div>
  );
}
