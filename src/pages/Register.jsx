import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Register = () => {
  const registerForm = useRef(null);
  const { registerUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = registerForm.current.name.value;
    const email = registerForm.current.email.value;
    const password1 = registerForm.current.password1.value;
    const password2 = registerForm.current.password2.value;

    if (password1 !== password2) {
      alert('hesla sa nezhodujú');
      return;
    }
    if (name === '' || email === '' || password1 === '' || password2 === '') {
      alert('Prosím vyplnťe všetky polia');
      return;
    }
    if (password1.length < 8) {
      alert('Heslo musí obsahovať minimálne 8 znakov');
      return;
    }

    const userInfo = { name, email, password1, password2 };

    registerUser(userInfo);
    alert('Účet úspešne vytvorený, prihláste sa');
  };

  return (
    <div className="container">
      <div className="login-register-container">
        <form ref={registerForm} onSubmit={handleSubmit}>
          <div className="form-field-wrapper">
            <label>Organizácia:</label>
            <input
              className="inputlogin"
              required
              type="text"
              name="name"
              placeholder="Napíšte meno organizácie..."
            />
          </div>

          <div className="form-field-wrapper">
            <label>Email:</label>
            <input
              className="inputlogin"
              required
              type="email"
              name="email"
              placeholder="Napíšte email..."
            />
          </div>

          <div className="form-field-wrapper">
            <label>Heslo:</label>
            <input
              className="inputlogin"
              type="password"
              name="password1"
              placeholder="Napíšte heslo..."
              autoComplete="password1"
            />
          </div>

          <div className="form-field-wrapper">
            <label>Potvrdiť heslo</label>
            <input
              className="inputlogin"
              type="password"
              name="password2"
              placeholder="Potvrďte heslo..."
              autoComplete="password2"
            />
          </div>

          <div className="form-field-wrapper">
            <input type="submit" value="Register" className="btn" />
          </div>
        </form>

        <p>
          Máte už účet? <Link to="/login">Prihláste sa</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
