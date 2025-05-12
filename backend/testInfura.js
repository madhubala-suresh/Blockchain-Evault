import { create } from "ipfs-http-client";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ✅ Set up Infura IPFS client
const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization:
            "Basic " +
            Buffer.from(process.env.INFURA_PROJECT_ID + ":" + process.env.INFURA_PROJECT_SECRET).toString("base64"),
    },
});

// ✅ Upload a test file to IPFS
async function uploadFile() {
    try {
        const filePath = "C:\\Users\\anika\\blockchain-evault\\backend\\loan-agreement-template.pdf";
const file = fs.readFileSync(filePath);

        const result = await ipfs.add(file);
        console.log("✅ File uploaded to IPFS:", result.path);
    } catch (error) {
        console.error("❌ Error uploading file to IPFS:", error);
    }
}

uploadFile();
