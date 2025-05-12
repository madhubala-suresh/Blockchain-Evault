import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

export const uploadToIPFS = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const formData = new FormData();
        formData.append("file", req.file.buffer, { filename: req.file.originalname });

        const pinataMetadata = JSON.stringify({ name: req.file.originalname });
        formData.append("pinataMetadata", pinataMetadata);

        const pinataOptions = JSON.stringify({ cidVersion: 1 });
        formData.append("pinataOptions", pinataOptions);

        const pinataResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: `Bearer ${process.env.PINATA_JWT}`, // 🔹 Use JWT key from Pinata
            },
        });

        res.status(200).json({ ipfsHash: pinataResponse.data.IpfsHash });
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        res.status(500).json({ error: "File upload failed" });
    }
};
