"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await auth.getCurrentUser();
      setCurrentUser(user);
    };
    checkAuth();
    window.addEventListener("auth:change", checkAuth);

    return () => {
      window.removeEventListener("auth:change", checkAuth);
    };
  }, []);

  // Hide Quick Links and Contact Us for admin users
  const isAdmin = currentUser?.role === "admin";

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl">LeonShop</span>
            </div>
            <p className="text-accent text-sm">
              Your one-stop shop for everything you need. Quality products at
              affordable prices.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-accent">cs@leonshop.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-accent">+62 21 1234 5678</span>
              </div>
            </div>
          </div>

          {/* Quick Links - hidden for admin */}
          {!isAdmin && (
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-accent hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-accent hover:text-white transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/promotions"
                    className="text-accent hover:text-white transition-colors"
                  >
                    Promotions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-accent hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Customer Service - hidden for admin */}
          {!isAdmin && (
            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="text-accent hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-accent mt-8 pt-8 text-center">
          <p className="text-accent text-sm">
            © {currentYear} LeonShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
