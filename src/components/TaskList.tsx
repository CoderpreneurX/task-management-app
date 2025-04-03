"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import Task from "./Task";
import AddTask from "./AddTask";
import TaskFilter from "./TaskFilter";
import { listTasks } from "@/utils/taskApi";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { HiBell } from "react-icons/hi";
import ThemeToggler from "./ui/ThemeToggler";
import Notifications from "./Notifications";

const TaskList = ({ user }: any) => {
  console.log("Viewing tasks for user:", user);

  const searchParams = useSearchParams();
  const rawStatusFilter = searchParams.get("tasks");
  const statusFilter = rawStatusFilter || "all"; // ✅ Default to "all" if null

  const [toast, setToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const initialPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);
  const router = useRouter();

  // ✅ Ensure `statusFilter` change resets `page` first
  useEffect(() => {
    setPage(1); // ✅ Reset page when statusFilter changes
  }, [statusFilter]);

  // ✅ Update URL only after `page` is properly set
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
    staleTime: Infinity, // ✅ Forces fresh data every time
  });

  // ✅ Pagination Functions (Updates page & triggers a refetch)
  const goToNextPage = () => {
    if (tasks && tasks?.currentPage < tasks?.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (tasks && tasks?.currentPage > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // ✅ Debugging logs
  useEffect(() => {
    console.log("Current Page:", page);
    console.log("Tasks Data:", tasks);
  }, [tasks, page]);

  if (error) return <p>Error: {error.message}</p>;

  if (user?.role == "admin") {
    const socket = io(`http://localhost:5000/?token=${user.token}`);

    socket.on("taskCreated", (data) => {
      setToast(true);
      setToastMessage(data.message);
      console.log(data.message);
    });

    socket.on("taskUpdated", (data) => {
      setToast(true);
      setToastMessage(data.message);
      console.log(data.message);
    });

    socket.on("taskStatusUpdated", (data) => {
      setToast(true);
      setToastMessage(data.message);
      console.log(data.message);
    });

    socket.on("taskDeleted", (data) => {
      setToast(true);
      setToastMessage(data.message);
      console.log(data.message);
    });
  }

  return (
    <div className="flex flex-col h-screen px-2 justify-center sm:px-8 bg-white dark:bg-gray-900 text-black dark:text-white">
      {showNotifications && (
        <Notifications onHide={() => setShowNotifications(false)} />
      )}
      {toast && (
        <div className="p-4 z-50 bg-white rounded fixed top-4 right-4 border shadow">
          {toastMessage}{" "}
          <button
            onClick={() => {
              setToast(!toast);
            }}
          >
            x
          </button>
        </div>
      )}
      {/* ✅ Sticky Header: Title & Add Task Button */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between p-4 sticky top-0 z-10 bg-white dark:bg-gray-900">
        <h2 className="sm:text-2xl text-lg font-semibold">
          {statusFilter === "pending"
            ? "Pending"
            : statusFilter === "completed"
            ? "Completed"
            : "All"}{" "}
          Tasks
        </h2>
        <div className="flex gap-4 items-center">
          {user?.role === "admin" && (
            <HiBell onClick={() => setShowNotifications(true)} size={22} />
          )}
          <AddTask />
        </div>
      </div>

      {/* ✅ Sticky Filter */}
      <div className="sticky top-[4rem] z-10 p-2 bg-white dark:bg-gray-900">
        <TaskFilter
          allCount={tasks?.totalTasks}
          pendingCount={tasks?.pendingTasks}
          completedCount={tasks?.completedTasks}
        />
      </div>

      {/* ✅ Scrollable Task List */}
      <div
        className={`flex-1 overflow-y-auto max-w-[720px] w-full mx-auto max-h-[calc(100vh-200px)] px-4 pt-2 pb-26 ${
          page > 1 && "min-w-max"
        }`}
      >
        {isLoading ? (
          <div>
            <div className="size-8 border-3 border-blue-600 dark:border-blue-400 border-r-slate-400 dark:border-r-gray-600 animate-spin"></div>
          </div>
        ) : tasks.tasks?.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No tasks found.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.tasks?.map((task: any) => (
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

      <div className="flex self-end justify-between items-center">
        <div></div>
        {/* ✅ Page Navigation */}
        <div className="p-3 text-right font-bold">
          {tasks?.currentPage !== 1 && (
            <button
              onClick={goToPrevPage}
              className="mr-2 underline text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {"<<"}
            </button>
          )}
          Page {tasks?.totalPages === 0 ? 0 : tasks?.currentPage} /{" "}
          {tasks?.totalPages}
          {tasks?.currentPage < tasks?.totalPages && (
            <button
              onClick={goToNextPage}
              className="ml-2 underline text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {">>"}
            </button>
          )}
        </div>
      </div>

      {/* ✅ Theme Toggle Button */}
      <ThemeToggler />
    </div>
  );
};

export default TaskList;
