import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useState } from "react";
const Header = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const logoutClick = () => {
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {" "}
        <div>
          <Link id="header-logo" to="/">
            <img
              src="/erbpsk.png
          "
              alt="logoPSK"
              className="logo"
            />
          </Link>
        </div>
        <nav className="hidden md:flex space-x-4">
          {user ? (
            <>
              <Link to="/" className="text-white hover:text-gray-300">
                Rovné hlasovanie
              </Link>
              <Link to="/profile" className="text-white hover:text-gray-300">
                Rada partnerstva
              </Link>
              <Link to="/voteweight" className="text-white hover:text-gray-300">
                Vážené hlasovanie
              </Link>

              <button
                onClick={logoutUser}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Odhláste sa
              </button>
            </>
          ) : (
            <Link
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              to="/login"
            >
              Prihláste sa
            </Link>
          )}
        </nav>
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <nav className="space-y-2 p-4">
            <Link to="/" className="block text-white hover:text-gray-300">
              Vote-simple
            </Link>
            <Link
              to="/profile"
              className="block text-white hover:text-gray-300"
            >
              Intro
            </Link>
            <Link
              to="/voteweight"
              className="block text-white hover:text-gray-300"
            >
              Vote-Population
            </Link>
            {user ? (
              <button
                onClick={logoutClick}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2"
              >
                Odhláste sa
              </button>
            ) : (
              <Link
                to="/login"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
              >
                Prihláste sa
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
