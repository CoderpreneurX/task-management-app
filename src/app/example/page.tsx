"use client";

import { useQuery } from "@tanstack/react-query";
import { listTasks } from "@/utils/taskApi";
import useAuth from "@/hooks/useAuth";

function TaskList({ status }: { status: string }) {
  const { user, loading } = useAuth(); // ✅ Get auth state

  if (loading) return <p>Loading</p>
  if (!user) return null;

  // ✅ Only fetch tasks if the user is authenticated
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks", status],
    queryFn: () => listTasks(status),
    // enabled: isAuthenticated, // ✅ Prevents fetching if user is not authenticated
  });

  // if (!isAuthenticated) {
  //   return <p>Please log in to view tasks.</p>; // ✅ Show message if not authenticated
  // }

  if (isLoading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {tasks?.tasks?.map((task: any) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}

export default TaskList;
