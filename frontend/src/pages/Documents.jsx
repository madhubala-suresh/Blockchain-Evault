import React, { useEffect, useState } from "react";
import axios from "axios";

const Documents = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/documents", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setDocuments(res.data);
            } catch (err) {
                console.error("❌ Error fetching documents:", err);
            }
        };
        fetchDocuments();
    }, []);

    return (
        <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto", backgroundColor: "#fff", color: "#000", borderRadius: "8px", marginTop: "40px" }}>
            <h2 style={{ marginBottom: "20px" }}>📄 Uploaded Documents</h2>

            {documents.length === 0 ? (
                <p>No documents uploaded yet.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    {documents.map((doc) => (
                        <div
                            key={doc._id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "20px",
                                borderRadius: "10px",
                                backgroundColor: "#f7f9fc",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                color: "#000",
                            }}
                        >
                            <h3>{doc.title}</h3>
                            <p>{doc.description}</p>

                            <div style={{ overflowX: "auto", maxWidth: "100%", marginTop: "15px" }}>
                                {doc.fileType?.startsWith("video/") ? (
                                    <video controls style={{ maxWidth: "100%", borderRadius: "8px" }}>
                                        <source src={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`} type={doc.fileType} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : doc.fileType === "application/pdf" ? (
                                    <iframe
                                        src={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`}
                                        title="PDF Preview"
                                        style={{
                                            width: "100%",
                                            height: "500px",
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            backgroundColor: "#fff",
                                        }}
                                    />
                                ) : (
                                    <a
                                        href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: "inline-block",
                                            marginTop: "10px",
                                            color: "#007bff",
                                            fontWeight: "bold",
                                            textDecoration: "none",
                                        }}
                                    >
                                        📂 View File
                                    </a>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = `https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`;
                                    link.download = doc.title || "document";
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                style={{
                                    marginTop: "15px",
                                    padding: "10px 20px",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                ⬇️ Download
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Documents;
