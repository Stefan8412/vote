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
    <div className="header">
      <div>
        <Link id="header-logo" to="/">
          PSK
        </Link>
      </div>

      <div className="links--wrapper">
        {user ? (
          <>
            <Link to="/" className="header--link">
              Domov
            </Link>
            <Link to="/profile" className="header--link">
              Hlasovanie
            </Link>
            <Link to="/krs" className="header--link">
              KRS
            </Link>

            <button onClick={logoutUser} className="btn">
              Odhláste sa
            </button>
          </>
        ) : (
          <Link className="btn" to="/login">
            Prihláste sa
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
