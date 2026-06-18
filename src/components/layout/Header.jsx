"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, X, User, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();

  // Use cart context instead of localStorage and event listeners
  const { itemCount, clearCart } = useCart();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const checkAuth = async () => {
      const user = await auth.getCurrentUser();
      setCurrentUser(user);
    };
    checkAuth();
    window.addEventListener("auth:change", checkAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("auth:change", checkAuth);
    };
  }, []);

  const handleLogout = async () => {
    // Clear cart using CartContext before logout
    clearCart();
    await auth.logout();
    router.push("/");
  };

  // Admin navigation links
  const adminNavLinks = [{ name: "Dashboard", href: "/admin" }];

  // Customer navigation links
  const customerNavLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Promotions", href: "/promotions" },
    { name: "FAQ", href: "/faq" },
  ];

  const navLinks =
    currentUser?.role === "admin" ? adminNavLinks : customerNavLinks;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={currentUser?.role === "admin" ? "/admin" : "/"}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-secondary font-bold text-xl">LeonShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-secondary hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                >
                  {currentUser.image ? (
                    <img
                      src={currentUser.image}
                      alt={currentUser.firstName || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="hidden md:block">
                    {currentUser.firstName || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm text-secondary font-medium">
                        {currentUser.role === "admin" ? "Admin" : "Customer"}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-secondary hover:bg-light transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block">Sign In</span>
              </Link>
            )}

            {/* Cart link - only show for customers */}
            {!currentUser || currentUser.role !== "admin" ? (
              <Link
                href="/cart"
                className="relative p-2 text-secondary hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            ) : null}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-secondary hover:bg-light rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {currentUser ? (
              <div className="px-3 py-2 text-secondary">
                <p className="font-medium">{currentUser.firstName || "User"}</p>
                <p className="text-sm text-accent">
                  {currentUser.role === "admin" ? "Admin" : "Customer"}
                </p>
              </div>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 text-secondary hover:bg-light rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
