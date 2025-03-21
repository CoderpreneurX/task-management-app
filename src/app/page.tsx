"use client";

import TaskList from "@/components/TaskList";
import useAuth from "@/hooks/useAuth";

const Home = ({}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (<div className="border-2 size-12 absolute translate-x-1/2 translate-y-1/2 border-blue-500 border-r-slate-200 rounded-full animate-spin"></div>);
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen">
      <h1 className="text-2xl sm:text-4xl font-black fixed w-full top-0 tracking-wide text-center pt-6">
        Welcome to Task Manager
      </h1>

      <div className="flex justify-center">
        <TaskList user={user} />
      </div>
    </div>
  );
};

export default Home;
