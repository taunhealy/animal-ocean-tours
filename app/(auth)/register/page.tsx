import { Metadata } from "next";
import { Suspense } from "react";
import RegisterContent from "@/app/(auth)/register/register-content";

export const metadata: Metadata = {
  title: "Register | Off The Grid",
  description: "Create a new account as a customer or tour guide",
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto max-w-md py-8">
      <div className="space-y-6">
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterContent />
        </Suspense>
      </div>
    </div>
  );
}

// Move RegisterContent to a separate client component file
