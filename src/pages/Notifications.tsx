import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getNotifications, markNotificationRead } from "@/mock/api";

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getNotifications(user.id).then((data) => {
      setNotifs(data);
      setLoading(false);
    });
  }, [user]);

  const handleRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {loading ? (
        <div>Loading...</div>
      ) : notifs.length === 0 ? (
        <div>No notifications.</div>
      ) : (
        <ul className="space-y-2">
          {notifs.map((n) => (
            <li
              key={n.id}
              className={`p-4 border rounded cursor-pointer ${n.read ? "bg-gray-100" : "bg-blue-50"}`}
              onClick={() => handleRead(n.id)}
            >
              <div className="font-semibold">{n.title}</div>
              <div className="text-gray-600 text-sm">{n.body}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
