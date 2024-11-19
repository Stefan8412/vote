import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./utils/AuthContext";
import Login from "./pages/Login";

import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Voteweight from "./pages/Vote-weight";

import Layout from "./components/Layout";
import GDPR from "./pages/GDPRE";
import UserCounter from "./pages/Users";

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
              <Route path="/profile" element={<Profile />} />
              <Route path="/gdpr" element={<GDPR />} />
            </Route>
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
