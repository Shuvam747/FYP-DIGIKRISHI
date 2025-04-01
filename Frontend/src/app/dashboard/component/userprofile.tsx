import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  username: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  emailVerified: boolean;
  numberVerified: boolean;
  profilePicture?: string;
  points: number;
  twoFactorEnabled: boolean;
}

const UserCard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/user") // Adjust endpoint as needed
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      {user?.profilePicture && (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto"
        />
      )}
      <h2 className="text-xl font-bold">{user?.username}</h2>
      <p className="text-gray-600">{user?.email}</p>
      <p className="text-gray-600">Phone: {user?.phone || "N/A"}</p>
      <p className="text-gray-600">Role: {user?.role}</p>
      <p className="text-gray-600">Points: {user?.points}</p>
      <p className={`text-sm ${user?.isVerified ? "text-green-500" : "text-red-500"}`}>
        {user?.isVerified ? "Verified" : "Not Verified"}
      </p>
    </div>
  );
};

export default UserCard;
