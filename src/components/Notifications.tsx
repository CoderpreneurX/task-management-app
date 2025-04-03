import api from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsProps {
  onHide: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onHide }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications"); // Update with your API route
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((notification) => notification.id !== id)); // Update UI instantly
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button onClick={onHide} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>

        <div className="mt-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications found.</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li key={notification.id} className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="text-gray-800">{notification.message}</p>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
