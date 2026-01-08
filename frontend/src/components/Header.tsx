import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-orange-700 text-white py-5 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5">
        <h1 className="m-0 text-2xl font-semibold">
          Box test
        </h1>
      </div>
    </header>
  );
};

export default Header;
