import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Upload from "./pages/Upload.jsx";
import Verify from "./pages/Verify.jsx";
import Documents from "./pages/Documents.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import JudgeDashboard from "./pages/JudgeDashboard.jsx";
import LawyerDashboard from "./pages/LawyerDashboard.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function MainApp() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user"); // Clear broken data
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>Blockchain eVault</h1>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>

          {user ? (
            <>
              {user.role === "judge" && (
                <NavLink to="/judge-dashboard">Dashboard</NavLink>
              )}
              {user.role === "lawyer" && (
                <NavLink to="/lawyer-dashboard">Dashboard</NavLink>
              )}
              {user.role === "client" && (
                <NavLink to="/client-dashboard">Dashboard</NavLink>
              )}
              <NavLink to="/upload">Upload</NavLink>
              <NavLink to="/verify">Verify</NavLink>
              <NavLink to="/documents">Documents</NavLink>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </div>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/upload"
            element={user ? <Upload /> : <Login setUser={setUser} />}
          />
          <Route
            path="/verify"
            element={user ? <Verify /> : <Login setUser={setUser} />}
          />
          <Route
            path="/documents"
            element={user ? <Documents /> : <Login setUser={setUser} />}
          />
          <Route
            path="/judge-dashboard"
            element={
              user?.role === "judge" ? (
                <JudgeDashboard />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          <Route
            path="/lawyer-dashboard"
            element={
              user?.role === "lawyer" ? (
                <LawyerDashboard />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          <Route
            path="/client-dashboard"
            element={
              user?.role === "client" ? (
                <ClientDashboard />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;
