import express from "express";
import mongoose from "mongoose";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import Document from "../models/Document.js";

const router = express.Router();

// ✅ Upload (everyone allowed)
router.post("/upload", authenticateUser, async (req, res) => {
    try {
        const { title, ipfsHash, fileType, description } = req.body;

        const ownerId = new mongoose.Types.ObjectId(req.user.id);

        const document = new Document({
            title,
            ipfsHash,
            fileType,
            description,
            owner: ownerId,
            access: [ownerId], // Make sure it's an ObjectId
        });

        await document.save();

        console.log("✅ Document saved:", document); // for debugging

        res.status(201).json({ message: "Document uploaded successfully!" });
    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Get documents (based on role)
router.get("/", authenticateUser, async (req, res) => {
    try {
        let documents;

        if (req.user.role === "judge") {
            documents = await Document.find(); // judge sees all
        } else {
            const userId = new mongoose.Types.ObjectId(req.user.id);
            documents = await Document.find({ owner: userId });
        }

        res.status(200).json(documents);
    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Verify document by CID
router.get("/verify/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const document = await Document.findOne({ ipfsHash: cid });

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        res.status(200).json({ message: "✅ Document Verified", document });
    } catch (error) {
        console.error("❌ Verify Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
