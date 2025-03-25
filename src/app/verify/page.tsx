"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/axiosInstance"; // Import your API utility

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !code) {
      setError("Invalid verification link.");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.post("/auth/verify", { email, code });

        // Redirect to home page on success
        router.push("/");
      } catch (err: any) {
        setError(err.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [email, code, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 max-w-md w-full bg-white shadow-md rounded">
        {loading ? (
          <p className="text-blue-500">Verifying email...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : null}
      </div>
    </div>
  );
};

export default VerifyPage;
