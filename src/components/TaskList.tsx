"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import Task from "./Task";
import AddTask from "./AddTask";
import TaskFilter from "./TaskFilter";
import { listTasks } from "@/utils/taskApi";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const TaskList = observer(({ user }) => {
  console.log("Viewing tasks for user:", user);

  const searchParams = useSearchParams();
  const rawStatusFilter = searchParams.get("tasks");
  const statusFilter = rawStatusFilter || "all"; // ✅ Default to "all" if null

  const initialPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);
  const router = useRouter();

  // ✅ Update URL when `page` or `statusFilter` changes
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (statusFilter !== "all") queryParams.set("tasks", statusFilter);
    queryParams.set("page", String(page));

    router.push(`?${queryParams.toString()}`, { scroll: false });
  }, [page, statusFilter, router]);

  // ✅ Fetch tasks using React Query (Includes `page` in queryKey)
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", statusFilter, page], // ✅ Ensures fresh fetch on page change
    queryFn: () => listTasks(statusFilter, page),
    staleTime: 0, // ✅ Forces fresh data every time
  });

  // ✅ Pagination Functions (Updates page & triggers a refetch)
  const goToNextPage = () => {
    if (tasks && tasks.currentPage < tasks.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (tasks && tasks.currentPage > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // ✅ Debugging logs
  useEffect(() => {
    console.log("Current Page:", page);
    console.log("Tasks Data:", tasks);
  }, [tasks, page]);

  if (isLoading)
    return (
      <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        Loading tasks...
      </p>
    );
  if (error) return <p>Error: {error.message}</p>;

  console.log("Is tasks.tasks an Array?", Array.isArray(tasks.tasks));

  console.log("The user viewing is:", user)

  return (
    <div className="flex flex-col fixed px-2 max-w-full justify-center sm:px-8">
      {/* ✅ Sticky Header: Title & Add Task Button */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between p-4 sticky top-0 z-10">
        <h2 className="sm:text-2xl text-lg font-semibold">
          {statusFilter === "pending"
            ? "Pending"
            : statusFilter === "completed"
            ? "Completed"
            : "All"}{" "}
          Tasks
        </h2>
        <AddTask />
      </div>

      {/* ✅ Sticky Filter */}
      <div className="sticky top-[4rem] z-10 p-2">
        <TaskFilter />
      </div>

      {/* ✅ Scrollable Task List */}
      <div
        className={`flex-1 overflow-y-scroll max-w-screen max-h-[calc(100vh-200px)] px-4 pt-2 pb-26 ${
          page > 1 && "min-w-max"
        }`}
      >
        {tasks.tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.tasks.map((task: any) => (
              <Task
                user={task.User ? task.User : user}
                currentUser={user}
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p>Showing records: 
          {
            tasks.currentPage === 1 ? "First page"
            : "Not the first page"
          }
        </p>
      {/* ✅ Page Navigation */}
      <div className="p-3 text-right font-bold">
        {tasks.currentPage !== 1 && (
          <button
          onClick={goToPrevPage}
          className="mr-2 underline text-blue-500 hover:text-blue-700"
          >
            {"<<"}
          </button>
        )}
        Page {tasks.currentPage} / {tasks.totalPages}
        {tasks.currentPage < tasks.totalPages && (
          <button
          onClick={goToNextPage}
          className="ml-2 underline text-blue-500 hover:text-blue-700"
          >
            {">>"}
          </button>
        )}
        </div>
      </div>
    </div>
  );
});

export default TaskList;
