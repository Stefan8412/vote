import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes';
import { AuthProvider } from './utils/AuthContext';
import Login from './pages/Login';

import HowTo from './pages/HowTo';
import Register from './pages/Register';
import Voteweight from './pages/Vote-weight';

import Layout from './components/Layout';

import UserCounter from './pages/Users';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<UserCounter />} />
              <Route path="/voteweight" element={<Voteweight />} />
              <Route path="/howto" element={<HowTo />} />
            </Route>
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
