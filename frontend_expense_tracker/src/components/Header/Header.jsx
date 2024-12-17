import React from "react";

function Header() {
  return (
    <header className="bg-cyan-950 shadow-lg py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-white text-2xl font-bold">
          <span className="bg-clip-text text-transparent bg-white">
            ExpenseTracker
          </span>
        </div>
        <nav className="flex space-x-6">
          <a
            href="#logout"
            className="text-[#3d52a0] bg-[#ede8f5] px-4 py-2 rounded-lg hover:bg-[#adbbda] hover:text-white font-semibold transition"
          >
            Logout
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
