import express from 'express';
import multer from 'multer';
import { uploadToPinata } from '../utils/pinata.js';

const router = express.Router();
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await uploadToPinata(file);

        if (!result) {
            return res.status(500).json({ message: 'Failed to upload to Pinata' });
        }

        res.status(200).json({
            ipfsHash: result.IpfsHash,
            pinSize: result.PinSize,
            timestamp: result.Timestamp,
        });
    } catch (err) {
        console.error("Server upload error:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
