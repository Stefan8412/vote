import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes';
import { AuthProvider } from './utils/AuthContext';
import Login from './pages/Login';

import HowTo from './pages/HowTo';
import Register from './pages/Register';
import Voteweight from './pages/Vote-weight';
import Resultweight from './pages/Resultweight';
import Layout from './components/Layout';

import Resultsimple from './pages/Resultsimple';
import { useState, useEffect } from 'react';

import { account } from './lib/appwrite';

function App() {
  const [isAdmin, setIsAdmin] = useState(false); // Admin check
  const [loading, setLoading] = useState(true); // Loading state
  console.log('isAdmin', isAdmin);

  useEffect(() => {
    const checkIfAdmin = async () => {
      try {
        const user = await account.get(); // Fetch user data
        console.log('user', user);

        // Replace this with your actual admin check logic
        if (user.name === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    checkIfAdmin();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator until the check completes
  }

  return (
    <>
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/voteweight" element={<Voteweight />} />

                {isAdmin ? (
                  <>
                    <Route path="/resultsimple" element={<Resultsimple />} />

                    <Route path="/resultweight" element={<Resultweight />} />
                  </>
                ) : null}

                <Route path="/howto" element={<HowTo />} />
              </Route>
            </Routes>
          </Layout>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
