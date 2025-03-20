import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext"; // Adjust path as needed

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { user, loading } = useAuth(); // Get authentication state

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/login"); // Redirect if not authenticated
      }
    }, [user, loading, router]);

    if (loading) return <p>Loading...</p>;

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
