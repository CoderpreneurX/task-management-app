import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { addTask } from "@/utils/taskApi"; // Import the improved API function

const AddTask = observer(() => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const mutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setError(err.message || "Failed to add task. Please try again.");
    },
  });

  const handleNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (title.length < 3) {
      setError("Please enter a title with at least 3 characters");
      return;
    }
    if (description.length < 3) {
      setError("Please enter a description with at least 3 characters");
      return;
    }
    if (!status) {
      setError("Please select a status for the task");
      return;
    }

    mutation.mutate({ title, description });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add New Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Task</DialogTitle>
          <DialogDescription>Add a new task. Click save when done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleNewTask}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="title" className="text-left">
                Title
              </Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="description" className="text-left">
                Description
              </Label>
              <Textarea id="description" className="col-span-3" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="status" className="text-left">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Task Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-center py-1 rounded bg-error-background text-error-foreground">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default AddTask;
