import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance"; // Ensure this path matches your project structure

interface User {
  fullName: string;
  email: string;
  role: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me"); // Change this to your actual auth endpoint
        setUser(res.data);
      } catch (error) {
        setUser(null);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { user, loading };
};

export default useAuth;
