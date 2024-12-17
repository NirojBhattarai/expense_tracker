import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.js";

function Header() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await axios.post("https://expense-tracker-qyva.onrender.com/api/v1/users/logout");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      logout();
      navigate("/login");
      
    } catch (error) {
      console.error("Logout failed", error.response?.data?.message || error.message);
    }
  };

  return (
    <header className="bg-cyan-950 shadow-lg py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-white text-2xl font-bold">
          <span className="bg-clip-text text-transparent bg-white">
            ExpenseTracker
          </span>
        </div>
        <button className="flex space-x-6" onClick={handleLogout}>
          <span className="text-[#3d52a0] bg-[#ede8f5] px-4 py-2 rounded-lg hover:bg-[#adbbda] hover:text-white font-semibold transition cursor-pointer">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
