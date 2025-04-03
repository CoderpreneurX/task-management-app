"use client";

import TaskList from "@/components/TaskList";
import AvatarDropdown from "@/components/ui/AvatarDropdown";
import Sidebar from "@/components/ui/Sidebar";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = ({}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect when loading is done and user is null
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]); // dependencies include `loading`

  if (loading) {
    return <p>Loading...</p>; // You could also use a spinner here.
  }

  return (
    <div className="h-screen">
      {/* <Sidebar user={user} /> */}
      <div>
        <TaskList user={user} />
      </div>
      <div className="fixed bottom-6 left-6">
        <AvatarDropdown user={user} />
      </div>
    </div>
  );
};

export default Home;
