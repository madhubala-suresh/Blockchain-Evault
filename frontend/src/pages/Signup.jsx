import React, { useState } from "react";
import axios from "axios";

const Signup = ({ setUser }) => {
  const [name, setName] = useState("");  // 👈 Add name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");  // 👈 Default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userData = { name, email, password, role }; // ✅ Now sending correct fields
    console.log("📤 Sending signup request:", userData);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", userData);

      console.log("✅ Signup successful:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

      // ✅ Redirect after signup
      window.location.href = "/login";
    } catch (err) {
      console.error("❌ Signup failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        {/* ✅ Role selection */}
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="client">Client</option>
          <option value="lawyer">Lawyer</option>
          <option value="judge">Judge</option>
        </select>

        <button type="submit" disabled={loading} className="signup-button">
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
