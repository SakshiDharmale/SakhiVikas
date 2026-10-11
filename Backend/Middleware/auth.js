import db from '../db.js';
import jwt from 'jsonwebtoken';


export default function verifytoken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.secret);

        console.log("JWT PAYLOAD:", payload);

        req.user_id = payload.id;

        next();

    } catch (error) {
        console.error("JWT ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
}