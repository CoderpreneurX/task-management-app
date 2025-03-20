"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import Task from "./Task";
import AddTask from "./AddTask";
import TaskFilter from "./TaskFilter";
import { listTasks } from "@/utils/taskApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TaskList = observer(() => {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("tasks") || "pending"; // Get filter from URL
  const initalPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();

  const [page, setPage] = useState(initalPage);

  const goToNextPage = () => {
    if (tasks.currentPage < tasks.totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      router.push(`?tasks=${statusFilter}&page=${nextPage}`, { scroll: false });
    }
  };

  const goToPrevPage = () => {
    if (tasks.currentPage > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      router.push(`?tasks=${statusFilter}&page=${prevPage}`, { scroll: false });
    }
  };

  // ✅ Fetch tasks using React Query
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", statusFilter],
    queryFn: () => listTasks(statusFilter, page),
  });

  if (isLoading)
    return (
      <p className="absolute top-1/2 left-1/2 translate-x-1/2 -translate-x-1/2">
        Loading tasks...
      </p>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col fixed sm:top-20 top-12 h-[calc(100%-70px)] sm:h-[calc(100%-85px)]">
      {/* ✅ Sticky Header: Title & Add Task Button */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between p-4 sticky top-0 z-10">
        <h2 className="sm:text-2xl text-lg font-semibold">
          All The{" "}
          {statusFilter === "pending"
            ? "Pending"
            : statusFilter === "in_progress"
            ? "In Progress"
            : "Completed"}{" "}
          Tasks
        </h2>
        <AddTask />
      </div>

      {/* ✅ Sticky Filter */}
      <div className="sticky top-[4rem] z-10 p-2">
        <TaskFilter allCount={tasks.totalTasks} />
      </div>

      {/* ✅ Scrollable Task List */}
      <div className="flex-1 overflow-y-scroll max-h-screen px-4 pt-2 pb-26">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.tasks.map((task: any) => (
              <Task
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

      {/* ✅ Page Padding */}
      <div className="p-3 text-right font-bold">
        <button
          onClick={goToPrevPage}
          className="mr-2 underline text-blue-500 hover:text-blue-700"
        >
          {"<<"}
        </button>
        Page {tasks.currentPage} / {tasks.totalPages}
        <button
          onClick={goToNextPage}
          className="ml-2 underline text-blue-500 hover:text-blue-700"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
});

export default TaskList;
