"use client";

import SignupForm from "@/components/SignupForm";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/"); // Redirect logged-in users to home
    }
  }, [loading, user, router]);

  return (
    <div className="h-screen grid place-content-center">
     {loading ? <p>Loading...</p> : <SignupForm />}
    </div>
  );
}
