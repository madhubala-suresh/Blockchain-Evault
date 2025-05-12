import React, { useState } from "react";
import axios from "axios";

const Verify = () => {
    const [ipfsHash, setIpfsHash] = useState("");
    const [document, setDocument] = useState(null);

    const handleVerify = async () => {
        if (!ipfsHash) return alert("Enter IPFS Hash");

        try {
            const res = await axios.get(`http://localhost:5000/api/documents/verify/${ipfsHash}`);
            setDocument(res.data.document);
        } catch (error) {
            alert("Document not found!");
            console.error("Verification Error:", error);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "30px", backgroundColor: "#fff", color: "#000", borderRadius: "8px", marginTop: "40px" }}>
            <h2>Verify Document</h2>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Enter IPFS Hash"
                    value={ipfsHash}
                    onChange={(e) => setIpfsHash(e.target.value)}
                    style={{ flex: 1, padding: "10px" }}
                />
                <button
                    onClick={handleVerify}
                    style={{
                        padding: "10px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px"
                    }}
                >
                    Verify
                </button>
            </div>

            {document && (
                <div>
                    <h3>Document Found:</h3>
                    <p><strong>Title:</strong> {document.title}</p>
                    <p><strong>Description:</strong> {document.description}</p>
                    <p><strong>Owner:</strong> {document.owner}</p>
                    <p><strong>Uploaded At:</strong> {new Date(document.uploadedAt).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default Verify;
