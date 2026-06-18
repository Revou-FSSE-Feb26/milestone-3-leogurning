"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { useCart } from "@/contexts/CartContext";

function CartContent() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  // Use cart context instead of localStorage and event listeners
  const { items, itemCount, total, removeItem, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await auth.getCurrentUser();
      setCurrentUser(user);

      // Redirect to login if not authenticated
      if (!user) {
        // Hardcode /cart as redirect target to avoid redirect-loop bugs
        router.push("/login?redirect=%2Fcart");
        return;
      }

      // Only stop loading after auth is confirmed
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleRemoveItem = (id) => {
    removeItem(id);
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    updateQuantity(id, quantity);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }
    router.push("/checkout");
  };

  // Format price as IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded mx-auto w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-12 min-h-screen bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag className="w-24 h-24 text-accent mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-secondary mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-accent mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-accent hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-secondary mb-8">
          Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-sm flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-accent mb-2">{formatPrice(item.price)}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 hover:bg-light text-secondary"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-secondary font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-light text-secondary"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-secondary mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-accent">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-accent">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-accent">
                  <span>Tax</span>
                  <span>{formatPrice(total * 0.08)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-secondary">
                  <span>Total</span>
                  <span>{formatPrice(total * 1.08)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={handleClearCart}
                className="w-full py-2 text-accent hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-24 pb-12 min-h-screen bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-48 bg-gray-200 rounded mx-auto w-full"></div>
            </div>
          </div>
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}

