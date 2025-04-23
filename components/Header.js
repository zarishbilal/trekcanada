"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserAuth } from "@/app/_utils/auth-context";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, firebaseSignOut } = useUserAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Trails", href: "/trails" },
    ...(user ? [{ name: "Favorites", href: "/favorites" }] : []),
    { name: "Offline Maps", href: "/offline-maps" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-sm backdrop-blur">
      <nav className="custom-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Parks Canada Trail Guide"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <span className="ml-3 text-xl font-semibold text-text-primary">
              Parks Canada Trail Guide
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="nav-link">
                {item.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={firebaseSignOut}
                className="btn btn-primary px-6 py-2"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/signin">
                <button className="btn btn-primary px-6 py-2">Sign In</button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 animate-fade-in">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={firebaseSignOut}
                className="w-full btn btn-primary mt-4"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/signin">
                <button className="w-full btn btn-primary mt-4">Sign In</button>
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
