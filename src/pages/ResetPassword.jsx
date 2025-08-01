// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from '../utils/AuthContext';

const ResetPassword = () => {
  const { confirmPasswordRecovery } = useAuth();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await confirmPasswordRecovery(userId, secret, password);
  };

  if (!userId || !secret) {
    return <p>Chýbajúce údaje pre obnovenie hesla.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Obnova hesla</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nové heslo"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Obnoviť heslo
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
