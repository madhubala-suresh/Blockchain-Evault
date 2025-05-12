import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,              // as plain string
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const authorizeRole = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};
