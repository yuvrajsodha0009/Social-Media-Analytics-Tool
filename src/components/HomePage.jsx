import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Settings from "./Settings";

function Homepage() {
  const [activeSection, setActiveSection] = useState("Dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <Dashboard />;
      case "Profile":
        return <Profile />;
      case "Settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="left flex flex-col items-center bg-slate-800 w-70 text-amber-50">
        <h3 className="my-3 font-bold text-2xl text-cyan-500">InsightFlow</h3>
        <div className="flex flex-col w-auto">
          <button
            className="li-btn"
            onClick={() => setActiveSection("Dashboard")}
          >
            Dashboard
          </button>
          <button
            className="li-btn"
            onClick={() => setActiveSection("Profile")}
          >
            Profile
          </button>
          <button
            className="li-btn"
            onClick={() => setActiveSection("Settings")}
          >
            Settings
          </button>
        </div>
      </div>
      <div className="flex-1 bg-[#0f172a] text-white p-5 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default Homepage;
