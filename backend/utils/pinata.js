import axios from "axios";
import FormData from "form-data";

// ✅ JWT key directly from Pinata (You can also use process.env.PINATA_JWT for security)
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMTNjYWI2YS0yNWEzLTQ4ZjMtOGMxNC05YzE4ODMzMWUzNGYiLCJlbWFpbCI6Im5paGFsZ2FnYW4wN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDg4YjBiOTA5OTQzNGJjNGE3NzMiLCJzY29wZWRLZXlTZWNyZXQiOiI3MzE3MDc3ODk4MDlkOTE2ZGNjZmIxOGU3MzVmMjljMjc3N2Y1OTY0ZWU1OTMyNDFkMDFkMDg2MDQwNWQyN2ExIiwiZXhwIjoxNzczNTk1NTUxfQ.SH7Y24fN6B_0-NV2ULxYxDDZs3O7XQ7i4xwRykROeBQ";

// ✅ Function to upload file to Pinata
export const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
    });

    // Optional: Add metadata
    const metadata = JSON.stringify({
        name: file.originalname,
    });
    formData.append("pinataMetadata", metadata);

    // Optional: Set options
    const options = JSON.stringify({
        cidVersion: 1,
    });
    formData.append("pinataOptions", options);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity", // Important for large files
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
                ...formData.getHeaders(),
            },
        });

        return res.data; // Contains IpfsHash, PinSize, Timestamp
    } catch (error) {
        console.error("❌ Pinata Upload Error:", error?.response?.data || error.message);
        return null;
    }
};
