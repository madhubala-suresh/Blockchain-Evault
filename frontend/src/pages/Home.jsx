import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div style={{ padding: "3rem", color: "#222", textAlign: "left" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Blockchain eVault</h1>
            <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                Securely upload and verify legal documents using IPFS & Blockchain.
            </p>
            <div style={{ fontSize: "1rem" }}>
                <Link to="/upload" style={{ marginRight: "1rem", color: "#007bff", textDecoration: "none" }}>Upload Document</Link>
                <Link to="/verify" style={{ marginRight: "1rem", color: "#007bff", textDecoration: "none" }}>Verify Document</Link>
                <Link to="/documents" style={{ color: "#007bff", textDecoration: "none" }}>View Documents</Link>
            </div>
        </div>
    );
};

export default Home;
