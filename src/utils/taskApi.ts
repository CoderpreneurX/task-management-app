import api from "./axiosInstance";

export const listTasks = async (
  status: string = "pending",
  page: string | number = 1
) => {
  try {
    const { data } = await api.get(`/tasks`, { params: { status, page } });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};

export const addTask = async (task: { title: string; description: string }) => {
  try {
    const { data } = await api.post("/tasks", task);
    return data;
  } catch (error: any) {
    console.error("Error adding task:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add task. Please try again."
    );
  }
};

export const editTask = async (task: {
  id: string;
  title: string;
  description: string;
}) => {
  try {
    const { data } = await api.patch(`/tasks/${task.id}/`, task);
    return data;
  } catch (error: any) {
    console.error("Error editing task:", error);
    throw new Error(
      error.response?.data?.message || "Failed to edit task. Please try again."
    );
  }
};

export const deleteTask = async (task: { id: string }) => {
  try {
    const { data } = await api.delete(`/tasks/${task.id}/`);
    return data;
  } catch (error: any) {
    console.error("Error deleting task:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete task. Please try again."
    );
  }
};

export const toggleTaskStatus = async (task: { id: string | number, status: string }) => {
  try {
    const { data } = await api.patch(`/tasks/${task.id}/status`, {status: task.status});
    return data;
  } catch (error: any) {
    console.error("Error marking task status:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to mark task status. Please try again."
    );
  }
};
