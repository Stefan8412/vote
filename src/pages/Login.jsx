import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  const loginForm = useRef(null);

  useEffect(() => {
    if (user) {
      navigate('/');
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Rada partnerstva-prihlásenie
        </h2>

        <form onSubmit={handleSubmit} ref={loginForm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              placeholder="Vložte email ..."
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heslo
            </label>
            <input
              type="password"
              name="password"
              placeholder="Napíšte heslo..."
              autoComplete="current-password"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="submit"
              value="Prihláste sa"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
            />
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Nemáte účet?{' '}
            <Link
              to="/register"
              className="text-red-500 hover:text-red-600 font-medium hover:underline"
            >
              Registrujte sa
            </Link>
          </p>
          <p className="text-sm mt-2">
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Zabudli ste heslo?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
