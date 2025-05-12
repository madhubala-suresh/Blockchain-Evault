import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    title: String,
    ipfsHash: String,
    fileType: String,
    description: String,
    owner: {
        type: String, // 🔥 Changed from ObjectId to String for testing
        required: true,
    },
    access: [String],
});

export default mongoose.model("Document", documentSchema);
