import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  const loginForm = useRef(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;

    const userInfo = { email, password };

    loginUser(userInfo);
  };

  return (
    <div className="container">
      <h2 className="text-3xl text-center font-bold">
        {"Rada partnerstva PSK-Hlasovanie"}
      </h2>
      <div className="login-register-container">
        <form onSubmit={handleSubmit} ref={loginForm}>
          <div className="form-field-wrapper">
            <label>Email:</label>
            <input
              className="inputlogin"
              required
              type="email"
              name="email"
              placeholder="vložte email ..."
            />
          </div>

          <div className="form-field-wrapper">
            <label>Heslo:</label>
            <input
              className="inputlogin"
              type="password"
              name="password"
              placeholder="napíšte heslo..."
              autoComplete="password"
            />
          </div>

          <div className="form-field-wrapper">
            <input type="submit" value="Prihláste sa" className="btn" />
          </div>
        </form>

        {/* <p>
          Nemáte účet? <Link to="/register">Registrujte sa</Link>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
