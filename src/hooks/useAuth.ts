import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance"; // Ensure this path is correct

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
        const res = await api.get("/auth/me"); // Your auth endpoint
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false); // Set loading false AFTER we know the result
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

export default useAuth;
