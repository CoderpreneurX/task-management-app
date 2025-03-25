"use client";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Dialog, DialogTrigger } from "./ui/Dialog";
import EditTask from "./EditTask";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, toggleTaskStatus } from "@/utils/taskApi";
import { observer } from "mobx-react-lite";

interface TaskProps {
  id: string;
  title: string;
  description: string;
  status: string;
  user: User;
  currentUser: User;
}

interface User {
  email: string;
  fullName: string;
  role: string;
}

const Task = observer(({ id, user, title, description, status, currentUser }: TaskProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // ✅ Only show buttons if:
  // 1. The logged-in user (currentUser) is the task owner
  // 2. OR the logged-in user is *not* an admin viewing someone else's task
  const canModify = user?.email === currentUser.email;

  console.log("Task user is:", user)

  // ✅ Use mutation for deleting a task
  const deleteMutation = useMutation({
    mutationFn: () => deleteTask({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
    },
  });

  const toggleTaskStatusMutation = useMutation({
    mutationFn: () => {
      const newStatus = status === "pending" ? "completed" : "pending";
      return toggleTaskStatus({ id, status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error marking task status:", error);
    },
  });

  return (
    <div className="relative bg-white p-4 w-full rounded shadow mt-1 border-b border-slate-300 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>

        {canModify && (
          <div className="flex gap-1 sm:gap-3">
            {/* ✅ Edit Button */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Pencil2Icon className="w-5 h-5 text-blue-500" />
                </Button>
              </DialogTrigger>

              <EditTask id={id} title={title} description={description} status={status} open={open} setOpen={setOpen} />
            </Dialog>

            {/* ✅ Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <span className="w-5 h-5 animate-spin border-2 border-red-500 border-t-transparent rounded-full"></span>
              ) : (
                <TrashIcon className="w-5 h-5 text-red-500" />
              )}
            </Button>

            {/* ✅ Status Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleTaskStatusMutation.mutate()}
              disabled={toggleTaskStatusMutation.isPending}
            >
              {toggleTaskStatusMutation.isPending ? (
                <span className="w-5 h-5 animate-spin border-2 border-blue-500 border-t-transparent rounded-full"></span>
              ) : status === "pending" ? (
                <CheckCircledIcon className="w-5 h-5 text-green-500" />
              ) : (
                <CrossCircledIcon className="w-5 h-5 text-red-500" />
              )}
            </Button>
          </div>
        )}
      </div>

      {currentUser.role === "admin" && <p className="mt-2 text-xs text-slate-600">{canModify ? "You" : user.email}</p>}

      <Badge
        className="my-2"
        variant={status === "pending" ? "error" : "success"}
      >
        {status === "pending" ? "Pending" : "Completed"}
      </Badge>

      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
});

export default Task;
