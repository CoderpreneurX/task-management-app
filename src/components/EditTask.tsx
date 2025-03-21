import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { editTask } from "@/utils/taskApi"; // Import API function

interface EditTaskProps {
  id: string;
  title: string;
  description: string;
  status: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const EditTask = ({
  id,
  title,
  description,
  status,
  open,
  setOpen,
}: EditTaskProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [newTitle, setNewTitle] = useState<string>(title);
  const [newDescription, setNewDescription] = useState<string>(description);
  const [newStatus, setNewStatus] = useState<string>(status);
  const [error, setError] = useState<string>();

  const mutation = useMutation({
    mutationFn: (updatedTask: { id: string; title: string; description: string; status: string }) => editTask(updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refetch task list
      setOpen(false); // Close the dialog
      router.refresh(); // Refresh the page if necessary
    },
    onError: (err: any) => {
      setError(err.message || "Failed to edit task. Please try again.");
    },
  });

  const handleEditedTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (newTitle.length < 3) {
      setError("Please enter a title with at least 3 characters");
      return;
    }
    if (newDescription.length < 10) {
      setError("Please enter a description with at least 3 characters");
      return;
    }

    mutation.mutate({ id: id, title: newTitle, description: newDescription, status: newStatus });
  };

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl">Edit Task</DialogTitle>
        <DialogDescription>Edit or update your task here. Click save when done.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleEditedTask}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="name" className="text-left">
              Title
            </Label>
            <Input id="name" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Textarea id="description" rows={5} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Description" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="status" className="text-left">
              Status
            </Label>
          </div>
          {error && <p className="text-center py-1 rounded bg-error-background text-error-foreground">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default EditTask;
