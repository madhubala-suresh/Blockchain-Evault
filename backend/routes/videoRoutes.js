import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload Video to IPFS
router.post("/upload", upload.single("video"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No video file uploaded." });

        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                "Authorization": `Bearer ${process.env.PINATA_JWT}`,
                ...formData.getHeaders(),
            },
        });

        const videoCID = response.data.IpfsHash;
        res.json({ success: true, videoCID });
    } catch (error) {
        console.error("❌ IPFS Upload Error:", error.message);
        res.status(500).json({ error: "Failed to upload video to IPFS." });
    }
});

// ✅ Retrieve Video URL
router.get("/:cid", (req, res) => {
    const { cid } = req.params;
    res.json({ url: `https://gateway.pinata.cloud/ipfs/${cid}` });
});

export default router;
