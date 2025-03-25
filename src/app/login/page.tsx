"use client";

import LoginForm from "@/components/LoginForm";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/"); // Redirect logged-in users to home
    }
  }, [loading, user, router]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="h-screen grid place-content-center">
      <LoginForm />
    </div>
  );
}
