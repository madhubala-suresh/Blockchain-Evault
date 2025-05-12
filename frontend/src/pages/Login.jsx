import React, { useState } from "react";
import axios from "axios";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginData = { email, password };

    console.log("🔍 Sending login request...", loginData);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", loginData);

      // Log the full response to check its structure
      console.log("✅ Login successful:", res.data);

      // Check if token and user data exist
      if (!res.data.token || !res.data.user) {
        throw new Error("User data is missing from response");
      }

      // ✅ Store user correctly
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Set the user in the state
      setUser(res.data.user);

      // Debugging: Check the user data stored in localStorage
      console.log("📦 Stored user:", JSON.parse(localStorage.getItem("user"))); // ✅ Debugging

      // Redirect to dashboard or homepage
      window.location.href = "/dashboard";

    } catch (err) {
      console.error("❌ Login failed:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
