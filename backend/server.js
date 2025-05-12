import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import documentRoutes from "./routes/documentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";

const app = express();

// ✅ Security & Performance
app.use(helmet());
app.use(compression());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, try again later." },
});
app.use(limiter);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected successfully!"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });

mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Retrying...");
});

// ✅ Routes
app.use("/api/documents", documentRoutes); // this includes /verify
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/upload", uploadRoutes);

// ✅ Health check
app.get("/", (req, res) => {
    res.status(200).json({ message: "🚀 eVault API is running!" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
