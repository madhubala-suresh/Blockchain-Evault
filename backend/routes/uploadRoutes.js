import express from "express";
import multer from "multer";
import { uploadToPinata } from "../utils/pinata.js"; // 👈 Make sure this file exists
import DocumentModel from "../models/Document.js";

const router = express.Router();

// Multer config – store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload/file
router.post("/file", upload.single("file"), async (req, res) => {
    try {
        const { title, description, owner } = req.body;
        const file = req.file;

        if (!file) {
            console.log("❌ No file found in request");
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("📦 File received:", file.originalname);
        console.log("📝 Title:", title);
        console.log("📃 Description:", description);

        // ✅ Upload file to Pinata (IPFS)
        const pinataResponse = await uploadToPinata(file);

        if (!pinataResponse || !pinataResponse.IpfsHash) {
            console.log("❌ Failed to get IPFS hash from Pinata");
            return res.status(500).json({ error: "Failed to upload to IPFS" });
        }

        // ✅ Save metadata to MongoDB
        const newDoc = new DocumentModel({
            title,
            description,
            ipfsHash: pinataResponse.IpfsHash,
            fileType: file.mimetype,
            owner,
        });

        const savedDoc = await newDoc.save();
        console.log("✅ Document saved to MongoDB:", savedDoc._id);

        return res.status(201).json({
            success: true,
            message: "Uploaded and saved successfully",
            ipfsHash: pinataResponse.IpfsHash,
            document: savedDoc,
        });

    } catch (err) {
        console.error("🔥 Upload Error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
