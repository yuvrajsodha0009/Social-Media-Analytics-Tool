import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [channelInfo, setChannelInfo] = useState({ name: "", logo: "" });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        setChannelInfo({ name: data.channelName, logo: data.channelLogo });

        // Create cards for all available data
        const formattedCards = [
          { title: "Subscribers", value: data.subscribers },
          { title: "Total Views", value: data.views },
          { title: "Total Likes", value: data.totalLikes },
          { title: "Total Comments", value: data.totalComments },
          { title: "Total Videos", value: data.totalVideos },
          { title: "Total Shares", value: data.totalShares },
        ];

        setCards(formattedCards);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching data");
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return <p className="text-white text-center mt-10">Loading dashboard...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="flex flex-col p-6">
      <div className="flex items-center mb-8">
        <img
          src={channelInfo.logo}
          alt="Channel Logo"
          className="w-16 h-16 rounded-full mr-4 border-2 border-gray-700"
        />
        <div>
          <h1 className="text-3xl text-white font-bold">{channelInfo.name}</h1>
          <p className="text-gray-400">Your YouTube Analytics Dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-lg shadow bg-gray-800 text-white"
          >
            <h2 className="font-semibold text-gray-400">{card.title}</h2>
            <p className="text-2xl font-bold mt-2">
              {new Intl.NumberFormat().format(card.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
