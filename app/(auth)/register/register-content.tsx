"use client";

import { useSearchParams } from "next/navigation";
import RegisterForm from "@/app/(auth)/register/register-form";
import { GoogleAuthButton } from "@/app/components/auth/google-auth-button";

export default function RegisterContent() {
  const searchParams = useSearchParams();
  const isAuthenticated = searchParams.has("email");

  if (!isAuthenticated) {
    return (
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-primary font-semibold text-gray-900 mb-2">
              Create an account
            </h1>
            <p className="text-gray-600 font-primary text-sm">
              Sign up with Google to get started with your motorcycle adventure
            </p>
          </div>

          <GoogleAuthButton mode="signup" className="w-full" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-primary">
                Or continue with
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 font-primary">
            <p>
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <RegisterForm />;
}
