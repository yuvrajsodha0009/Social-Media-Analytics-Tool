import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch user data");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleConnectYouTube = () => {
    window.open(`http://localhost:5000/api/auth/google`, "_self");
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return null;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">User Profile</h1>
      <p className="text-gray-400 mb-6">
        Manage your account info & connected platforms.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl text-center">
          <img
            className="h-20 w-20 rounded-full mx-auto mb-4"
            src={user.youtubeChannelPic || user.profilePic}
            alt="Avatar"
          />
          <h2 className="text-lg font-semibold">{user.username}</h2>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <span className="font-semibold">YouTube</span>
                {user.youtubeAccessToken ? (
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm cursor-not-allowed"
                    disabled
                  >
                    Connected
                  </button>
                ) : (
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                    onClick={handleConnectYouTube}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
