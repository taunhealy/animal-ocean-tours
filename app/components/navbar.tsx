"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  const handleSignUp = () => {
    // Direct navigation to register page without triggering auth
    router.push("/register");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-primary font-semibold text-lg text-black">
              Animal Ocean
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/tours"
              className="font-primary text-black hover:text-gray-900"
            >
              Tours
            </Link>
            <Link
              href="/marine-life"
              className="font-primary text-black hover:text-gray-900"
            >
              Marine Life
            </Link>
            <Link
              href="/about"
              className="font-primary text-black hover:text-gray-900"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="font-primary text-black hover:text-gray-900"
            >
              Contact
            </Link>
          </div>

          {/* Sign In Button */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-black font-primary">
                  Hi, {session.user?.name || "User"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDashboard}
                  className="text-black"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-black"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGoogleSignIn}
                >
                  Sign In
                </Button>
                <Button variant="default" size="sm" onClick={handleSignUp}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/tours"
              className="block font-primary text-black hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Tours
            </Link>
            <Link
              href="/marine-life"
              className="block font-primary text-black hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Marine Life
            </Link>
            <Link
              href="/about"
              className="block font-primary text-black hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block font-primary text-black hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex space-x-4 pt-2">
              {session ? (
                <>
                  <span className="text-black font-primary">
                    Hi, {session.user?.name || "User"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDashboard}
                    className="text-black"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-black"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGoogleSignIn}
                  >
                    Sign In
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSignUp}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
