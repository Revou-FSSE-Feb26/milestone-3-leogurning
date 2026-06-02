"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { addToCart, getCart } from "@/lib/cart";
import { Plus, Check } from "lucide-react";
import Image from "next/image";

export default function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCartCount();
    window.addEventListener("cart:change", updateCartCount);

    return () => {
      window.removeEventListener("cart:change", updateCartCount);
    };
  }, []);

  // Format price as IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsAdding(true);

    addToCart(product);
    setAdded(true);

    setTimeout(() => {
      setIsAdding(false);
      setAdded(false);
    }, 1000);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          width={300}
          height={300}
          loading="eager"
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        {/* Added to cart notification */}
        {added && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-primary text-white px-4 py-2 rounded-lg font-medium">
              Added to Cart!
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.title}
        </h3>
        <p className="text-sm text-accent mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.discount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price * (1 + product.discount / 100))}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-light hover:bg-primary hover:text-white text-secondary flex items-center justify-center transition-colors"
            aria-label="Add to cart"
          >
            {isAdding ? (
              <span className="text-xs text-white">Add...</span>
            ) : added ? (
              <span className="text-xs text-white">Added!</span>
            ) : added ? (
              <Check className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
