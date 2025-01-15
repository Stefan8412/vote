import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/'); // To track the active menu item

  /* 
  const logoutClick = () => {
    navigate("/login");
  }; */

  const handleMenuClick = (path) => {
    setActiveLink(path);
    if (path === '/logout') {
      logoutUser();
      navigate('/login');
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {' '}
        <div>
          <Link id="header-logo" to="/">
            <img
              src="/erbfarebny.png
            "
              alt="logoPSK"
              className="logo"
            />
          </Link>
        </div>
        {/* Show logged-in user info */}
        <div className="text-gray-300">
          {user && (
            <span className="mr-4">Vitajte, {user.name || user.email} !</span>
          )}
        </div>
        <nav className="hidden md:flex space-x-4">
          {user ? (
            <>
              <button
                onClick={() => handleMenuClick('/howto')}
                className={` hover:text-red-300 ${
                  activeLink === '/howto' ? 'text-red-400 font-bold' : ''
                }`}
              >
                Ako hlasovať
              </button>
              <button
                onClick={() => handleMenuClick('/')}
                className={` hover:text-red-300 ${
                  activeLink === '/' ? 'text-red-400 font-bold' : ''
                }`}
              >
                Rovné hlasovanie
              </button>

              <button
                onClick={() => handleMenuClick('/voteweight')}
                className={` hover:text-red-300 ${
                  activeLink === '/voteweight' ? 'text-red-400 font-bold' : ''
                }`}
              >
                Vážené hlasovanie
              </button>

              <button
                onClick={() => handleMenuClick('/logout')}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Odhláste sa
              </button>
              {/*  <button
                onClick={() => navigate('/reset-password')}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2"
              >
                Zmeniť heslo
              </button> */}
            </>
          ) : (
            <Link
              to="/login"
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                activeLink === '/login' ? 'text-blue-400 font-bold' : ''
              }`}
              onClick={() => handleMenuClick('/login')}
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
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && user && (
        <div className="md:hidden bg-gray-800">
          <nav className="space-y-2 p-4">
            <button
              onClick={() => handleMenuClick('/howto')}
              className={`block  hover:text-red-300 ${
                activeLink === '/howto' ? 'text-red-400 font-bold' : ''
              }`}
            >
              Ako hlasovať
            </button>
            <button
              onClick={() => handleMenuClick('/')}
              className={`block  hover:text-red-300 ${
                activeLink === '/' ? 'text-red-400 font-bold' : ''
              }`}
            >
              Rovné hlasovanie
            </button>

            <button
              onClick={() => handleMenuClick('/voteweight')}
              className={`block  hover:text-red-300 ${
                activeLink === '/voteweight' ? 'text-red-400 font-bold' : ''
              }`}
            >
              Vážené hlasovanie
            </button>
            {user ? (
              <>
                <button
                  onClick={() => handleMenuClick('/logout')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2"
                >
                  Odhláste sa
                </button>
                {/*  <button
                  onClick={() => navigate('/reset-password')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2"
                >
                  Zmeniť heslo
                </button> */}
              </>
            ) : (
              <Link
                to="/login"
                className={`block w-full bg-blue-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2 ${
                  activeLink === '/login' ? 'text-red-400 font-bold' : ''
                }`}
                onClick={() => handleMenuClick('/login')}
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
