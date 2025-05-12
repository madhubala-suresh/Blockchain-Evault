import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ipfsHash, setIpfsHash] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("owner", "0x1234567890abcdef"); // Replace later with actual address

        try {
            setUploading(true);
            const res = await axios.post("http://localhost:5000/api/upload/file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setIpfsHash(res.data.ipfsHash);
            alert("✅ File uploaded successfully!");
        } catch (error) {
            console.error("❌ Upload Error:", error);
            alert("Error uploading file");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "30px", backgroundColor: "#fff", color: "#000", borderRadius: "8px", marginTop: "40px" }}>
            <h2 style={{ marginBottom: "20px" }}>Upload Document / Video</h2>
            <form onSubmit={handleFileUpload} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <button
                    type="submit"
                    disabled={uploading}
                    style={{
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px"
                    }}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </form>

            {ipfsHash && (
                <div style={{ marginTop: "20px" }}>
                    <strong>📦 IPFS CID:</strong>
                    <p>{ipfsHash}</p>
                </div>
            )}
        </div>
    );
};

export default Upload;
