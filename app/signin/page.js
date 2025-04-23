"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../_utils/auth-context";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { googleSignIn, user } = useUserAuth();
  const router = useRouter();

  // Redirect to home if already signed in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "Create an Account" : "Sign In to Your Account"}
        </h2>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={async () => {
            try {
              await googleSignIn();
              router.push("/");
            } catch (error) {
              console.error("Google sign-in error:", error);
            }
          }}
          className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 mb-4 hover:bg-gray-100 transition-colors"
        >
          {/* Replace this span with a Google icon if available */}
          <span className="ml-2">Continue with Google</span>
        </button>

        <div className="flex items-center justify-center mb-4">
          <span className="h-px w-16 bg-gray-300 inline-block"></span>
          <span className="px-2 text-gray-500">or</span>
          <span className="h-px w-16 bg-gray-300 inline-block"></span>
        </div>

        <form className="space-y-4">
          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="********"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white rounded-md py-2 font-medium hover:bg-primary-dark transition-colors"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-medium underline hover:no-underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
