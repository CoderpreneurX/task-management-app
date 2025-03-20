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
import { deleteTask } from "@/utils/taskApi";
import { toggleTaskStatus } from "@/utils/taskApi";
import { observer } from "mobx-react-lite";

interface TaskProps {
  id: string;
  title: string;
  description: string;
  status: string;
}

const Task = observer(({ id, title, description, status }: TaskProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  // const taskStatus = status === "pending" ? "completed" : "pending"

  // ✅ Use mutation for deleting a task
  const deleteMutation = useMutation({
    mutationFn: () => deleteTask({ id }),
    onSuccess: () => {
      // ✅ Invalidate tasks list so UI updates after deletion
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
    },
  });

  const toggleTaskStatusMutation = useMutation({
    mutationFn: () => {
      const newStatus = status === "pending" ? "completed" : "pending"; // Compute inside mutation
      return toggleTaskStatus({ id, status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh task list after status update
    },
    onError: (error) => {
      console.error("Error marking task status:", error);
    },
  });

  return (
    <div className="relative bg-white p-4 rounded shadow mt-1 border-b border-slate-300 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>

        <div className="flex gap-1 sm:gap-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil2Icon className="w-5 h-5 text-blue-500" />
              </Button>
            </DialogTrigger>

            <EditTask
              id={id}
              title={title}
              description={description}
              status={status}
              open={open}
              setOpen={setOpen}
            />
          </Dialog>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending} // Disable button while deleting
          >
            {deleteMutation.isPending ? (
              <span className="w-5 h-5 animate-spin border-2 border-red-500 border-t-transparent rounded-full"></span>
            ) : (
              <TrashIcon className="w-5 h-5 text-red-500" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleTaskStatusMutation.mutate()}
            disabled={toggleTaskStatusMutation.isPending} // Disable button while deleting
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
      </div>

      <Badge
        className="my-2"
        variant={
          status === "pending"
            ? "error"
            : status === "in_progress"
            ? "warning"
            : "success"
        }
      >
        {status === "pending"
          ? "Pending"
          : status === "in_progress"
          ? "In Progress"
          : "Completed"}
      </Badge>

      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
});

export default Task;
