import { createContext, useState, useEffect, ReactNode } from "react";
import api from "@/utils/axiosInstance"; // Import your Axios instance

// ✅ Define User type
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Define Authentication Context Type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

// ✅ Create AuthContext with default undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Define Props for the Provider
interface AuthProviderProps {
  children: ReactNode;
}

// ✅ AuthProvider Component (Using Axios)
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await api.get("/auth/me"); // ✅ Using Axios instead of fetch
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // ✅ Login function
  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await api.post("/auth/login", { email, password }); // ✅ Axios request
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // ✅ Axios request
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✅ Provide context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
