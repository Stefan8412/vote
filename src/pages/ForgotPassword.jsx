// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useAuth } from '../utils/AuthContext';

const ForgotPassword = () => {
  const { sendPasswordRecovery } = useAuth();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendPasswordRecovery(email);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Zabudnuté heslo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Zadajte svoj email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Odoslať odkaz na obnovu
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
