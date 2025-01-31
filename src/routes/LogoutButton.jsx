// LogoutButton.jsx
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "import.meta.env.VITE_API_URL/usersp/logout",
        {},
        { withCredentials: true }
      );
      // Clear local storage
      localStorage.removeItem("user");
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 16px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      LOGOUT
    </button>
  );
};

export default LogoutButton;